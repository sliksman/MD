// Génère alternatives.html — deux pistes pour remplacer le plan POV « plafond » (illisible).   node scripts/build-alternatives.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
global.window = {};
global.gsap = { set() {} };
require("../kit/kit.js");
const L = window.LS, C = L.C, AMB = C.amber, CREAM = C.cream, WARM = "#e0674d";
const font = (f) => `url(data:font/woff2;base64,${readFileSync(new URL(`../assets/fonts/${f}`, import.meta.url)).toString("base64")})`;
function cap(id, str, y = 450) {
  const n = str.replace(/\*/g, "").length, size = Math.min(76, Math.round(900 / (n * 0.52)));
  const parts = str.split(/(\*[^*]+\*)/).filter(Boolean).map((p) => (p.startsWith("*") ? `<tspan fill="${AMB}">${L.esc(p.slice(1, -1))}</tspan>` : L.esc(p)));
  return `<text x="540" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${size}" fill="#fff" filter="url(#${id}-fShadow)">${parts.join("")}</text>`;
}
const vig = (id, n = 1) => Array.from({ length: n }, () => `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#${id}-gVig)"/>`).join("");
const glow = (id, cx, cy, rx, ry, op = 1) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id}-gWm)" opacity="${op}"/>`;
const dome = (id, cx, cy, rx, ry) => `<ellipse cx="${cx + rx * 0.06}" cy="${cy + ry * 0.2}" rx="${rx * 1.06}" ry="${ry * 1.05}" fill="#000" opacity=".32"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.duvet}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id}-gMd)"/>
  <g stroke="#000" stroke-opacity=".22" stroke-width="${Math.max(3, rx / 40)}" stroke-linecap="round" fill="none">${[-60, -30, 0, 30, 60].map((a) => { const r = (a * Math.PI) / 180; return `<path d="M${(cx + Math.sin(r) * rx * 0.5).toFixed(0)} ${(cy - Math.cos(r) * ry * 0.5).toFixed(0)} Q${(cx + Math.sin(r) * rx * 0.85).toFixed(0)} ${(cy - Math.cos(r) * ry * 0.7).toFixed(0)} ${(cx + Math.sin(r) * rx * 1.15).toFixed(0)} ${(cy - Math.cos(r) * ry * 0.95).toFixed(0)}"/>`; }).join("")}</g>`;

// ---------- PISTE 1 : « le long du corps » — POV, regard baissé : on voit son corps sous la couette comme un paysage, les pieds au loin, et la bosse qui avance vers lui
const U = (u) => ({ y: 640 + 1340 * u, hw: 210 + 590 * u });          // profondeur u (0 = pieds, 1 = poitrine) → ligne de la couette et demi-largeur
function along(A, id, o = {}) {
  const u = (n) => A.u(n), p = o.p, chest = o.chest ?? 0;
  const far = U(0), near = U(1);
  const m = p != null ? U(p) : null;
  const legs = [-1, 1].map((s) => `<path d="M${540 + s * 28} 668 L${540 + s * 22 - s * 150} 1800 L${540 + s * 160 + s * 30} 1800 L${540 + s * 90} 668Z" fill="#fff" opacity=".055"/>`).join("");
  return `<rect x="-200" y="-200" width="1480" height="2320" fill="#0b0e28"/>
  <rect x="150" y="150" width="270" height="340" rx="6" fill="#26306a" opacity=".8"/><path d="M285 150 V490 M150 320 H420" stroke="#0b0e28" stroke-width="10"/>
  <rect x="300" y="560" width="480" height="64" rx="10" fill="${u("gWood")}"/><rect x="288" y="520" width="34" height="140" rx="8" fill="${u("gWoodDark")}"/><rect x="758" y="520" width="34" height="140" rx="8" fill="${u("gWoodDark")}"/>
  <path d="M${540 - far.hw} ${far.y} L${540 + far.hw} ${far.y} L${540 + near.hw} ${near.y} L${540 - near.hw} ${near.y}Z" fill="${C.duvet}"/><path d="M${540 - far.hw} ${far.y} L${540 + far.hw} ${far.y} L${540 + near.hw} ${near.y} L${540 - near.hw} ${near.y}Z" fill="url(#${id}-gShade)"/>
  <path d="M${540 - far.hw} ${far.y} L${540 + far.hw} ${far.y}" stroke="${C.duvetEdge}" stroke-width="14" stroke-linecap="round"/>
  <g stroke="#000" stroke-opacity=".16" stroke-width="8" fill="none" stroke-linecap="round"><path d="M470 660 L${540 - 330} 1900 M610 660 L${540 + 330} 1900"/></g>${legs}
  <ellipse cx="490" cy="690" rx="38" ry="22" fill="#fff" opacity=".1"/><ellipse cx="592" cy="690" rx="38" ry="22" fill="#fff" opacity=".1"/>
  ${o.farGlow ? glow(id, 540, 720, 190, 110, o.farGlow) : ""}
  ${m ? `<path d="M520 700 L560 700 L${540 + m.hw * 0.2} ${m.y} L${540 - m.hw * 0.2} ${m.y}Z" fill="#1a0b14" opacity=".5"/>${glow(id, 540, m.y + 20, m.hw * 0.9, m.hw * 0.5, 0.95)}${dome(id, 540, m.y, m.hw * 0.4, m.hw * 0.22)}` : ""}
  ${dome(id, 540, 1960 - chest, 620, 270)}
  ${o.ghostChest ? `<g opacity=".3">${dome(id, 540, 1960 - chest - 90, 620, 270)}</g>` : ""}`;
}
// ---------- PISTE 2 : « gros plans de jambes » — vue de dessus très serrée, mais avec ses jambes dessinées pour qu'on lise la bosse sur un corps
function legs(A, id, o = {}) {
  const u = (n) => A.u(n), y0 = o.y0 ?? 0;
  const leg = (cx) => `<path d="M${cx - 110} 2200 L${cx - 100} ${240 + y0} Q${cx} ${150 + y0} ${cx + 100} ${240 + y0} L${cx + 110} 2200Z" fill="#fff" opacity=".07"/><path d="M${cx + 100} ${240 + y0} L${cx + 110} 2200" stroke="#000" stroke-opacity=".22" stroke-width="12" fill="none"/>`;
  const toes = (cx) => [-54, -26, 2, 30, 58].map((dx, i) => `<ellipse cx="${cx + dx}" cy="${200 + y0 - Math.abs(i - 1.8) * 6}" rx="22" ry="30" fill="#fff" opacity="${o.toes ?? 0.1}"/>`).join("");
  return `<rect x="-200" y="-200" width="1480" height="2320" fill="${C.duvet}"/><rect x="-200" y="-200" width="1480" height="2320" fill="url(#${id}-gShade)"/>
  ${leg(400)}${leg(680)}${toes(400)}${toes(680)}
  ${o.glow ? glow(id, 540, o.gy ?? 400, 520, 360, o.glow) : ""}
  ${o.trail ? `<path d="M470 240 L610 240 L${540 + o.tw} ${o.my} L${540 - o.tw} ${o.my}Z" fill="#1a0b14" opacity=".5"/>` : ""}
  ${o.my ? dome(id, 540, o.my, o.mrx, o.mry) : ""}`;
}

const sheet = (id, body, hudStr, extra = "") => ({ id, body, hud: hudStr, extra });
const A1 = [
  ["chaud", "« Y a un truc chaud sur mes pieds »", "Il baisse les yeux le long de son corps : la couette en perspective, ses pieds au loin sous la toile, le pied du lit. <b>La lueur chaude naît tout au fond, sur ses pieds.</b>", { farGlow: 0.9 }, "un truc *chaud*"],
  ["humide", "« C'est doux et humide »", "<b>Une bosse minuscule apparaît entre ses pieds, et une traînée sombre et brillante derrière elle</b> : on lit d'où elle vient.", { p: 0.08, farGlow: 0.6 }, "doux et *humide.*"],
  ["cheville", "« Là, c'est la cheville »", "<b>La bosse a avancé le long de sa jambe</b> (la traînée s'allonge, la lueur la suit). Elle grossit en s'approchant : la perspective fait le travail.", { p: 0.3 }, "c'est la *cheville.*"],
  ["respire", "« À chaque fois que je respire, ça remonte d'un cran »", "<b>Au premier plan, son torse se soulève (image fantôme)</b> et au même instant la bosse fait un bond vers lui. Cause et effet dans le même cadre, lisibles sans explication.", { p: 0.55, chest: 60, ghostChest: true }, "ça remonte d'un *cran.*"],
  ["dessous", "« C'est dessous. C'est lent. »", "<b>La bosse est presque sur lui</b>, énorme, la lueur éclaire la couette autour. Le cadre respire (le lit). Vignette serrée. On ne voit jamais ce qu'il y a dessous.", { p: 0.86, chest: 140, ghostChest: true }, "C'est *dessous.*"],
];
const A2 = [
  ["pieds", "« Y a un truc chaud sur mes pieds »", "Plan de dessus, très serré : <b>ses deux pieds sous la couette, bien dessinés</b>. La lueur chaude naît entre eux.", { glow: 0.85, gy: 330, y0: 260 }, "un truc *chaud*"],
  ["humide", "« C'est doux et humide »", "<b>La bosse se forme entre ses chevilles</b>, la traînée sombre derrière.", { y0: 260, my: 420, mrx: 130, mry: 90, trail: true, tw: 50, glow: 0.8, gy: 440, toes: 0.06 }, "doux et *humide.*"],
  ["cheville", "« Là, c'est la cheville »", "<b>Elle a recouvert ses pieds</b> (ses orteils ne se lisent plus : c'est « je sens plus mes orteils ») et monte sur les chevilles.", { y0: 260, my: 700, mrx: 220, mry: 150, trail: true, tw: 110, glow: 0.9, gy: 700, toes: 0.02 }, "c'est la *cheville.*"],
  ["genou", "« ça remonte d'un cran »", "<b>Plan fixe sur ses jambes : la bosse avance de cran en cran vers le haut du cadre</b> à chaque inspiration. Elle est plus large que ses deux jambes réunies.", { y0: 260, my: 1050, mrx: 380, mry: 250, trail: true, tw: 220, glow: 1, gy: 1050, toes: 0.02 }, "ça remonte d'un *cran.*"],
  ["dessous", "« C'est dessous. C'est lent. »", "<b>Elle a pris toute la largeur du lit</b> : ses jambes ont disparu sous la couette. Le cadre respire (le lit).", { y0: 260, my: 1450, mrx: 620, mry: 360, trail: true, tw: 360, glow: 1, gy: 1450, toes: 0 }, "C'est *dessous.*"],
];
const render = (id, world, hud) => {
  const root = { innerHTML: "", querySelector: () => null, querySelectorAll: () => [] };
  L.stage(root, id, world.replaceAll("ID-", id + "-"), hud.replaceAll("ID-", id + "-"));
  return root.innerHTML;
};
const cells = (prefix, list, fn) => list.map(([k, v, n, o, c], i) => {
  const id = `${prefix}${i}`, A = L.art(id + "-");
  const shade = `<defs><linearGradient id="${id}-gShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient><radialGradient id="${id}-gWm" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ee7a55" stop-opacity=".95"/><stop offset=".5" stop-color="${WARM}" stop-opacity=".4"/><stop offset="1" stop-color="#b93d3a" stop-opacity="0"/></radialGradient><radialGradient id="${id}-gMd" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></radialGradient></defs>`;
  const world = shade + fn(A, id, o) + `<rect x="-200" y="-200" width="1480" height="2320" fill="#04050d" opacity=".25"/>`;
  const svg = render(id, world.replaceAll(`${id}-`, "ID-"), (cap(id, c) + vig(id, i >= 3 ? 2 : 1)).replaceAll(`${id}-`, "ID-"));
  return `<article class="cell"><div class="frame">${svg}</div><div class="label"><span>${i + 1} · ${k.toUpperCase()}</span></div><p class="voice">${v}</p><p class="note">${n}</p></article>`;
}).join("");

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dessous · alternatives au plan POV</title>
<style>
@font-face{font-family:Fraunces;font-style:italic;font-weight:700;src:${font("Fraunces-Italic-700.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:700;src:${font("Nunito-700.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:800;src:${font("Nunito-800.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:900;src:${font("Nunito-900.woff2")} format("woff2")}
*{box-sizing:border-box;margin:0}
body{background:#0c0e1f;color:${CREAM};font-family:Nunito,system-ui,sans-serif;padding:40px 16px 80px}
header,section{max-width:1500px;margin:0 auto 28px}
h1{font-family:Fraunces;font-style:italic;font-size:38px;margin-bottom:10px}h1 em{color:${WARM}}
h2{font-family:Fraunces;font-style:italic;font-size:28px;margin:30px 0 6px}h2 em{color:${AMB}}
p.lead{opacity:.85;line-height:1.5;max-width:900px;margin-bottom:6px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:20px;margin-top:14px}
.cell{display:flex;flex-direction:column;gap:6px;min-width:0}
.frame{position:relative;aspect-ratio:9/16;border-radius:14px;overflow:hidden;background:${C.night0};box-shadow:0 10px 30px #0008}
.frame>.ls-stage{position:absolute;inset:0;width:100%;height:100%}.ls-stage{overflow:hidden}.ls-tilt{position:absolute;inset:0}.ls-stage svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.label{font-weight:900;font-size:13px;letter-spacing:.06em}.voice{font-size:13px;font-style:italic;opacity:.7}.note{font-size:13.5px;line-height:1.45;opacity:.9}.note b{color:${AMB}}
.why{background:#ffffff08;border:1px solid #ffffff14;border-radius:14px;padding:16px;font-size:14.5px;line-height:1.55;max-width:900px}.why b{color:${AMB}}
</style></head><body>
<header><h1>Dessous — <em>alternatives au plan POV</em></h1>
<p class="lead">Pourquoi le plafond ne marchait pas : <b>aucun repère</b> (un cercle de lampe, une fissure), donc on ne sait ni où l'on est ni ce qu'on regarde ; et la chose n'était qu'un dôme qui entrait par le bas du cadre, sans corps à comparer. Il faut un <b>corps lisible sous la couette</b> pour que la progression se lise. Deux pistes, croquis des cinq beats qui portent l'histoire.</p></header>
<section><h2>Piste 1 — <em>« le long du corps »</em> (recommandée) : toujours la première personne, mais le regard baissé</h2>
<div class="why">Il est allongé et il <b>voit son propre corps sous la couette, comme un paysage</b> : ses pieds au fond, le pied du lit, une fenêtre pâle. La bosse part de ses pieds et <b>avance vers lui</b> en grossissant (la perspective fait le travail), avec une traînée sombre derrière elle et la lueur chaude dessous. Au premier plan, son torse se soulève : cause et effet sont dans le même cadre. Le plafond ne sert plus qu'à « Je regarde pas » (il ferme les yeux, ou lève les yeux), et les plans de Léa, du drap et de ses yeux restent tels quels.</div>
<div class="grid">${cells("a", A1, along)}</div></section>
<section><h2>Piste 2 — <em>« gros plans de jambes »</em> : vue de dessus très serrée, mais avec son corps dessiné</h2>
<div class="why">Plus du tout POV, mais les mêmes inserts serrés que dans la v1 de l'épisode, avec <b>ses jambes et ses pieds visibles sous la couette</b> pour que la bosse se lise <i>sur</i> un corps. Plus simple à animer, moins oppressant, et on perd la sensation « c'est moi qui subis ». À réserver si la piste 1 te paraît encore trop abstraite.</div>
<div class="grid">${cells("b", A2, legs)}</div></section>
</body></html>`;
writeFileSync(new URL("../alternatives.html", import.meta.url), html);
console.log("alternatives.html écrit");
