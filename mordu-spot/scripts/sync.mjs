#!/usr/bin/env node
// Régénère tout ce qui dépend de timeline.json :
//   - timeline.js      (window.MORDU_TIMELINE, lu par les scènes et les sous-titres)
//   - index.html       (hôtes des scènes : data-start / data-duration)
//   - out/cues.json    (repères sonores pour le mix)
// Usage : node scripts/sync.mjs   (ou npm run sync)
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const T = JSON.parse(readFileSync(join(ROOT, "timeline.json"), "utf8"));
const r3 = (n) => Math.round(n * 1000) / 1000;
const errors = [];
const warnings = [];

// ---------- scènes ----------------------------------------------------------
let cursor = 0;
for (const s of T.scenes) {
  if (Math.abs(s.start - cursor) > 1e-6) errors.push(`${s.id} commence à ${s.start}s, attendu ${cursor}s (trou ou chevauchement)`);
  if (s.end <= s.start) errors.push(`${s.id} : end <= start`);
  cursor = s.end;
}
if (Math.abs(cursor - T.duration) > 1e-6) errors.push(`les scènes finissent à ${cursor}s, la durée est ${T.duration}s`);
const sceneById = Object.fromEntries(T.scenes.map((s) => [s.id, s]));

// ---------- voix : estimation des mots --------------------------------------
const VOWELS = /[aeiouyàâäéèêëîïôöùûüœæ]+/gi;
function syllables(w) {
  const core = w.toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüœæç'-]/g, "");
  let n = (core.match(VOWELS) || []).length;
  if (n > 1 && /[^aeiouy]e$/.test(core)) n -= 1; // e muet final
  return Math.max(1, n);
}
const vo = {};
for (const line of T.vo) {
  if (!sceneById[line.scene]) errors.push(`${line.id} : scène inconnue ${line.scene}`);
  const tokens = line.text.split(/\s+/).filter(Boolean);
  // « : » isolé se rattache au mot précédent (typo française).
  const words = [];
  for (const tok of tokens) {
    if (/^[:;!?»]$/.test(tok) && words.length) words[words.length - 1] += " " + tok;
    else words.push(tok);
  }
  let timed;
  if (Array.isArray(line.words) && line.words.length) {
    timed = line.words.map(([w, t]) => ({ w, t: r3(t) }));
  } else {
    const weights = words.map((w) => syllables(w) + (/[,.:;!?]$/.test(w) ? 0.8 : 0));
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    timed = words.map((w, i) => {
      const t = line.start + ((line.end - line.start) * acc) / total;
      acc += weights[i];
      return { w, t: r3(t) };
    });
  }
  if (line.start < sceneById[line.scene]?.start || line.end > sceneById[line.scene]?.end)
    warnings.push(`${line.id} déborde de sa scène ${line.scene}`);
  vo[line.id] = { ...line, timed };
}

// ---------- beats -----------------------------------------------------------
function resolveBeat(scene, key, b) {
  let abs;
  if (typeof b === "number") abs = scene.start + b;
  else if (b && b.vo) {
    const l = vo[b.vo];
    if (!l) {
      errors.push(`${scene.id}.${key} : réplique inconnue ${b.vo}`);
      return 0;
    }
    if (b.end) abs = l.end;
    else if (b.word != null) {
      const w = l.timed[b.word];
      if (!w) {
        errors.push(`${scene.id}.${key} : ${b.vo} n'a pas de mot ${b.word}`);
        return 0;
      }
      abs = w.t;
    } else abs = l.start;
    abs += b["+"] || 0;
  } else {
    errors.push(`${scene.id}.${key} : beat invalide`);
    return 0;
  }
  const local = abs - scene.start;
  if (local < 0 || local > scene.end - scene.start) warnings.push(`${scene.id}.${key} = ${r3(local)}s hors de la scène`);
  return r3(local);
}
const scenesOut = {};
for (const s of T.scenes) {
  const beats = {};
  for (const [k, b] of Object.entries(s.beats || {})) beats[k] = resolveBeat(s, k, b);
  scenesOut[s.id] = { id: s.id, title: s.title, start: s.start, end: s.end, dur: r3(s.end - s.start), beats };
}

// ---------- sous-titres -----------------------------------------------------
const ST = T.subtitles || {};
const maxWords = ST.maxWords || 6;
let groups = [];
const minHold = ST.minHold ?? 1.2;
const tail = ST.tail ?? 0.35;
for (const line of T.vo) {
  const words = vo[line.id].timed;
  const n = words.length;
  const parts = Math.ceil(n / maxWords);
  // Coupes réparties, recalées sur une ponctuation voisine (± 1 mot).
  const cuts = [];
  for (let k = 1; k < parts; k++) {
    let c = Math.round((n * k) / parts);
    for (const d of [0, -1, 1]) {
      const j = c + d;
      if (j > 0 && j < n && /[,.:;!?]$/.test(words[j - 1].w)) {
        c = j;
        break;
      }
    }
    cuts.push(c);
  }
  let from = 0;
  for (const c of [...cuts, n]) {
    groups.push({ start: words[from].t, words: words.slice(from, c), lineEnd: line.end, lastOfLine: c === n });
    from = c;
  }
}
groups.sort((a, b) => a.start - b.start);
function computeEnds() {
  groups.forEach((g, i) => {
    const next = groups[i + 1];
    const limit = next ? next.start - 0.04 : T.duration - 0.05;
    let end = g.lastOfLine ? g.lineEnd + tail : next ? next.start - 0.04 : g.lineEnd;
    end = Math.min(Math.max(end, g.start + minHold), limit);
    g.end = r3(end);
  });
}
computeEnds();
// Fusion des groupes trop brefs avec le suivant (si la ligne reste raisonnable).
for (let i = 0; i < groups.length - 1; i++) {
  const g = groups[i];
  const next = groups[i + 1];
  if (g.end - g.start < minHold - 1e-6 && g.words.length + next.words.length <= maxWords + 4) {
    groups.splice(i, 2, { start: g.start, words: [...g.words, ...next.words], lineEnd: next.lineEnd, lastOfLine: next.lastOfLine });
    computeEnds();
    i--;
  } else if (g.end - g.start < minHold - 1e-6 && !g.lastOfLine && next.words.length >= 3) {
    // Sinon on décale la coupe d'un mot vers la droite.
    g.words.push(next.words.shift());
    next.start = next.words[0].t;
    computeEnds();
    i--;
  }
}
groups.forEach((g) => {
  if (g.end - g.start < minHold - 1e-6) warnings.push(`sous-titre « ${g.words.map((w) => w.w).join(" ")} » tenu ${r3(g.end - g.start)}s (< ${minHold}s)`);
});
const subGroups = groups.map((g) => ({ start: g.start, end: g.end, words: g.words }));

// ---------- cues ------------------------------------------------------------
const cues = (T.cues || [])
  .map((c) => {
    const s = scenesOut[c.scene];
    if (!s || s.beats[c.beat] == null) {
      errors.push(`cue « ${c.name} » : beat ${c.scene}.${c.beat} introuvable`);
      return null;
    }
    return { t: r3(s.start + s.beats[c.beat]), name: c.name, scene: c.scene, beat: c.beat, frame: Math.round((s.start + s.beats[c.beat]) * T.fps) };
  })
  .filter(Boolean)
  .sort((a, b) => a.t - b.t);

// ---------- garde-fous de rendu ----------------------------------------------
// 1. Un enfant en visibility "visible" s'affiche même quand sa scène est masquée
//    (fantômes sur tout le film) → toujours "inherit".
// 2. Un tl.set(..., 0) n'est pas appliqué sur la 1re image d'une scène (la tête
//    de lecture est déjà à 0) → état initial avec gsap.set à la construction.
for (const f of readdirSync(join(ROOT, "compositions")).filter((f) => f.endsWith(".html"))) {
  const src = readFileSync(join(ROOT, "compositions", f), "utf8");
  src.split("\n").forEach((line, i) => {
    if (/visibility:\s*["']visible["']/.test(line)) errors.push(`compositions/${f}:${i + 1} : visibility "visible" interdit, utiliser "inherit"`);
    if (/tl\.set\(.*,\s*0\s*\);/.test(line)) errors.push(`compositions/${f}:${i + 1} : tl.set(..., 0) interdit, utiliser gsap.set à la construction`);
  });
}

if (errors.length) {
  console.error("✗ projet invalide :\n  - " + errors.join("\n  - "));
  process.exit(1);
}

// ---------- écriture --------------------------------------------------------
const runtime = {
  fps: T.fps,
  duration: T.duration,
  scenes: scenesOut,
  vo: Object.fromEntries(Object.values(vo).map((l) => [l.id, { start: l.start, end: l.end, text: l.text, words: l.timed }])),
  subtitles: { enabled: ST.enabled !== false, groups: subGroups },
};
writeFileSync(
  join(ROOT, "timeline.js"),
  "// GÉNÉRÉ par scripts/sync.mjs depuis timeline.json — ne pas éditer à la main.\nwindow.MORDU_TIMELINE = " + JSON.stringify(runtime, null, 1) + ";\n"
);

mkdirSync(join(ROOT, "out"), { recursive: true });
writeFileSync(join(ROOT, "out/cues.json"), JSON.stringify({ fps: T.fps, duration: T.duration, cues }, null, 2) + "\n");

const hosts = T.scenes
  .map(
    (s) => `      <div
        id="${s.id}"
        data-composition-id="${s.id}"
        data-composition-src="${s.src}"
        data-start="${s.start}"
        data-duration="${r3(s.end - s.start)}"
        data-track-index="1"
        data-track-kind="graphics"
        data-width="${T.width}"
        data-height="${T.height}"
      ></div>`
  )
  .join("\n");
const html = `<!doctype html>
<!-- GÉNÉRÉ par scripts/sync.mjs depuis timeline.json — ne pas éditer à la main. -->
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${T.width}, height=${T.height}" />
    <link rel="stylesheet" href="kit/kit.css" />
    <script src="assets/vendor/gsap.min.js"></script>
    <script src="timeline.js"></script>
    <script src="kit/kit.js"></script>
    <script src="kit/stations.js"></script>
    <style>
      html,
      body {
        margin: 0;
        background: var(--fond);
      }
      #root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: var(--fond);
      }
      #root > div[data-composition-src] {
        position: absolute;
        inset: 0;
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-width="${T.width}" data-height="${T.height}" data-duration="${T.duration}">
${hosts}
      <div
        id="subtitles"
        data-composition-id="subtitles"
        data-composition-src="compositions/subtitles.html"
        data-start="0"
        data-duration="${T.duration}"
        data-track-index="2"
        data-track-kind="captions"
        data-width="${T.width}"
        data-height="${T.height}"${ST.enabled === false ? "\n        data-hidden" : ""}
      ></div>
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
writeFileSync(join(ROOT, "index.html"), html);

console.log(`✓ timeline.js, index.html, out/cues.json régénérés — ${T.scenes.length} scènes, ${subGroups.length} groupes de sous-titres, ${cues.length} cues.`);
if (warnings.length) console.log("⚠ " + warnings.join("\n⚠ "));
