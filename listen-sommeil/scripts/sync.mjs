#!/usr/bin/env node
// Régénère tout ce qui dépend de timeline.json :
//   - timeline.js   (window.LS_TIMELINE : scènes, mots minutés, groupes de sous-titres)
//   - index.html    (hôtes des scènes avec chevauchement de fondu, voix, sous-titres)
// Usage : npm run sync
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const T = JSON.parse(readFileSync(join(ROOT, "timeline.json"), "utf8"));
const r3 = (n) => Math.round(n * 1000) / 1000;
const errors = [];

// ---------- scènes contiguës
let cursor = 0;
for (const s of T.scenes) {
  if (Math.abs(s.start - cursor) > 1e-6) errors.push(`${s.id} commence à ${s.start}s, attendu ${cursor}s`);
  if (s.end <= s.start) errors.push(`${s.id} : end <= start`);
  cursor = s.end;
}
if (Math.abs(cursor - T.duration) > 1e-6) errors.push(`les scènes finissent à ${cursor}s, durée ${T.duration}s`);

// ---------- mots : répartis au prorata des syllabes, sauf liste "words" explicite
const VOWELS = /[aeiouyàâäéèêëîïôöùûüœæ]+/gi;
function syllables(w) {
  const core = w.toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüœæç'-]/g, "");
  let n = (core.match(VOWELS) || []).length;
  if (n > 1 && /[^aeiouy]e$/.test(core)) n -= 1;
  return Math.max(1, n);
}
const vo = {};
let prevEnd = 0;
for (const line of T.vo) {
  if (line.start < prevEnd - 1e-6) errors.push(`${line.id} chevauche la réplique précédente`);
  prevEnd = line.end;
  const tokens = line.text.split(/\s+/).filter(Boolean);
  const words = [];
  for (const tok of tokens) {
    if (/^[:;!?»]$/.test(tok) && words.length) words[words.length - 1] += " " + tok;
    else words.push(tok);
  }
  let timed;
  if (Array.isArray(line.words)) {
    timed = line.words.map(([w, t]) => ({ w, t: r3(t) }));
    if (timed.length !== words.length) errors.push(`${line.id} : "words" a ${timed.length} mots, le texte en a ${words.length}`);
  } else {
    const weights = words.map((w) => syllables(w) + (/[,.:;!?]$/.test(w) ? 0.6 : 0));
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    timed = words.map((w, i) => {
      const t = line.start + ((line.end - line.start) * acc) / total;
      acc += weights[i];
      return { w, t: r3(t) };
    });
  }
  const hl = new Set(line.hl || []);
  timed.forEach((x) => (x.hl = hl.has(x.w.replace(/ [:;!?»]$/, ""))));
  for (const h of hl) if (!words.some((w) => w.replace(/ [:;!?»]$/, "") === h)) errors.push(`${line.id} : mot surligné introuvable « ${h} »`);
  vo[line.id] = { id: line.id, start: line.start, end: line.end, text: line.text, timed };
}

// ---------- groupes de sous-titres (≤ maxWords, coupés de préférence après une ponctuation)
const CP = T.captions || {};
const maxW = CP.maxWords || 3;
const groups = [];
for (const line of T.vo) {
  const ws = vo[line.id].timed;
  let cur = [];
  ws.forEach((x, i) => {
    cur.push(x);
    const punct = /[,.:;!?]$/.test(x.w);
    const last = i === ws.length - 1;
    // coupe si : ponctuation, plein, ou on laisserait un mot orphelin
    if (last || punct || cur.length >= maxW || (cur.length === maxW - 1 && ws.length - i - 1 === 1 && false)) {
      groups.push({ line: line.id, words: cur });
      cur = [];
    }
  });
}
// recoller les groupes d'un seul mot court au groupe suivant de la même réplique quand ça tient
for (let i = 0; i < groups.length - 1; i++) {
  const g = groups[i], n = groups[i + 1];
  if (g.words.length === 1 && n.line === g.line && n.words.length < maxW && !/[,.:;!?]$/.test(g.words[0].w)) {
    n.words = g.words.concat(n.words);
    groups.splice(i, 1);
    i--;
  }
}
const sceneAt = (t) => T.scenes.find((s) => t >= s.start - 1e-6 && t < s.end) || T.scenes[T.scenes.length - 1];
const capGroups = groups.map((g, i) => {
  const start = g.words[0].t;
  const next = groups[i + 1];
  const lineEnd = vo[g.line].end + (CP.tail ?? 0.3);
  let end = next ? Math.min(next.words[0].t, Math.max(lineEnd, start + 0.4)) : lineEnd;
  if (next && next.words[0].t - lineEnd < 0.25) end = next.words[0].t; // pas de trou de scintillement
  const sc = sceneAt(start);
  const cy = T.captionY || {};
  const rng = Array.isArray(cy) ? cy.find(([a, b]) => start >= a && start < b) : null;
  const y = rng ? rng[2] : (!Array.isArray(cy) && cy[sc.id]) || CP.y || 1330;
  return { start: r3(Math.max(0, start - (CP.lead || 0))), end: r3(end), y, words: g.words.map((x) => ({ w: x.w, t: x.t, hl: x.hl })) };
});

// ---------- scènes : src/scenes/<file>.js → compositions/<file>.html (enveloppe <template>)
for (const s of T.scenes) {
  const src = join(ROOT, "src", "scenes", s.file + ".js");
  if (!existsSync(src)) continue;
  const body = readFileSync(src, "utf8");
  const html = `<!doctype html>
<!-- GÉNÉRÉ par scripts/sync.mjs depuis src/scenes/${s.file}.js — éditer la source, pas ce fichier. -->
<html lang="fr">
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        #root { position: absolute; inset: 0; }
      </style>
      <div id="root" data-composition-id="${s.id}" data-width="1080" data-height="1920"></div>
      <script>
        (function () {
          const ID = "${s.id}";
          const L = window.LS;
          const sc = L.scene(ID);
          const A = L.art(ID + "-");
          const root = document.querySelector('[data-composition-id="${s.id}"]');
          const tl = gsap.timeline({ paused: true });
          const w = sc.w;
${body.split("\n").map((l) => (l ? "          " + l : l)).join("\n")}
          window.__timelines[ID] = tl;
        })();
      </script>
    </template>
  </body>
</html>
`;
  writeFileSync(join(ROOT, "compositions", s.file + ".html"), html);
}

// ---------- hôtes de scènes : chaque scène (sauf la 1re) commence `fade` s plus tôt, en fondu par-dessus
const fade = T.fade ?? 0.3;
const scenes = {};
T.scenes.forEach((s, i) => {
  const hostStart = i === 0 ? 0 : r3(s.start - fade);
  scenes[s.id] = { id: s.id, file: s.file, start: s.start, end: s.end, hostStart, hostDur: r3(s.end - hostStart), fadeIn: i === 0 ? 0 : fade, z: i + 1 };
  if (!existsSync(join(ROOT, "compositions", s.file + ".html"))) errors.push(`compositions/${s.file}.html manquant`);
});

// ---------- bruitages : temps absolu, ou accroché à un mot ({vo, word, "+"}), ou interpolé entre deux mots ({vo, word, toWord, frac})
const probe = {};
const fileDur = (f) => (probe[f] ??= parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${join(ROOT, "assets/sfx", f)}"`).toString()));
function resolveAt(a, id) {
  if (typeof a === "number") return a;
  if (a.wipe != null) return (T.wipes || [])[a.wipe] + (a["+"] || 0);
  const l = vo[a.vo];
  if (!l || !l.timed[a.word]) { errors.push(`sfx ${id} : mot introuvable ${a.vo}[${a.word}]`); return 0; }
  let t = l.timed[a.word].t;
  if (a.toWord != null) t = t + (l.timed[a.toWord].t - t) * a.frac;
  return t + (a["+"] || 0);
}
const sfx = (T.sfx || []).map((x) => {
  if (!existsSync(join(ROOT, "assets/sfx", x.file))) errors.push(`sfx ${x.id} : assets/sfx/${x.file} manquant`);
  const at = r3(resolveAt(x.at, x.id));
  const len = existsSync(join(ROOT, "assets/sfx", x.file)) ? fileDur(x.file) : 1;
  let dur = x.dur ?? (x.until != null ? x.until - at : len);
  dur = r3(Math.min(dur, len, T.duration - at));
  return { id: x.id, file: x.file, at, dur, vol: x.vol ?? 1, note: x.note || "" };
});
// pistes : allocation gloutonne, pas de chevauchement sur une même piste
const lanes = [];
[...sfx].sort((a, b) => a.at - b.at).forEach((x) => {
  let k = lanes.findIndex((end) => end <= x.at + 1e-6);
  if (k < 0) { lanes.push(0); k = lanes.length - 1; }
  lanes[k] = x.at + x.dur;
  x.track = 6 + k;
});

if (errors.length) {
  console.error("✗ timeline.json invalide :\n  - " + errors.join("\n  - "));
  process.exit(1);
}

const out = { duration: T.duration, scenes, vo, wipes: T.wipes || [], captions: { enabled: CP.enabled !== false, groups: capGroups } };
writeFileSync(join(ROOT, "timeline.js"), "// GÉNÉRÉ par scripts/sync.mjs depuis timeline.json — ne pas éditer.\nwindow.LS_TIMELINE = " + JSON.stringify(out) + ";\n");

// ---------- attributs audio posés par d'autres outils (carve, chaîne d'effets, automation) : conservés d'une sync à l'autre
const keepAttrs = {};
if (existsSync(join(ROOT, "index.html"))) {
  const prev = readFileSync(join(ROOT, "index.html"), "utf8");
  for (const m of prev.matchAll(/<audio id="([^"]+)"([^>]*)>/g)) {
    const extra = [...m[2].matchAll(/ (data-(?:fx|automation)[\w-]*="[^"]*")/g)].map((x) => x[1]);
    if (extra.length) keepAttrs[m[1]] = " " + extra.join(" ");
  }
}

// ---------- index.html
const host = (s) => `      <div
        id="${s.id}"
        data-composition-id="${s.id}"
        data-composition-src="compositions/${s.file}.html"
        data-start="${s.hostStart}"
        data-duration="${s.hostDur}"
        data-track-index="1"
        data-width="1080"
        data-height="1920"
        style="z-index: ${s.z}"
      ></div>`;
const index = `<!doctype html>
<!-- GÉNÉRÉ par scripts/sync.mjs depuis timeline.json — ne pas éditer à la main. -->
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <link rel="stylesheet" href="kit/kit.css" />
    <script src="assets/vendor/gsap.min.js"></script>
    <script src="timeline.js"></script>
    <script src="kit/kit.js"></script>
    <style>
      html,
      body {
        margin: 0;
        background: #121633;
      }
      #root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #121633;
      }
      #root > div[data-composition-src] {
        position: absolute;
        inset: 0;
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="${T.duration}">
${Object.values(scenes).map(host).join("\n")}
      <div
        id="intro-title"
        data-composition-id="intro-title"
        data-composition-src="compositions/intro-title.html"
        data-start="0"
        data-duration="5.0"
        data-track-index="3"
        data-width="1080"
        data-height="1920"
        style="z-index: 95"
      ></div>
      <div
        id="wipes"
        data-composition-id="wipes"
        data-composition-src="compositions/wipes.html"
        data-start="0"
        data-duration="${T.duration}"
        data-track-index="2"
        data-width="1080"
        data-height="1920"
        style="z-index: 90"
      ></div>
      <div
        id="captions"
        data-composition-id="captions"
        data-composition-src="compositions/captions.html"
        data-track-kind="captions"
        data-start="0"
        data-duration="${T.duration}"
        data-track-index="4"
        data-width="1080"
        data-height="1920"
        style="z-index: 100"
      ></div>
      <audio id="vo" src="${T.voFile || "assets/audio/vo.mp3"}" data-start="0" data-duration="${T.voDuration || T.duration}" data-track-index="5" data-volume="1"></audio>
${sfx.map((x) => `      <audio id="sfx-${x.id}" src="assets/sfx/${x.file}" data-start="${x.at}" data-duration="${x.dur}" data-track-index="${x.track}" data-volume="${x.vol}"${keepAttrs["sfx-" + x.id] || ""}></audio>`).join("\n")}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
writeFileSync(join(ROOT, "index.html"), index);
mkdirSync(join(ROOT, "out"), { recursive: true });
writeFileSync(join(ROOT, "out", "cues.json"), JSON.stringify(sfx.map((x) => ({ t: x.at, frame: Math.round(x.at * 30), dur: x.dur, file: x.file, name: x.note })), null, 1) + "\n");
console.log(`✓ sync : ${T.scenes.length} scènes, ${T.vo.length} répliques, ${capGroups.length} sous-titres, ${T.duration}s`);
