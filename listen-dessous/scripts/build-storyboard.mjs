// Génère storyboard.html — « Dessous » (storytelling horreur, même DA que « Des pas »). Croquis statiques 9:16.   node scripts/build-storyboard.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
global.window = {};
global.gsap = { set() {} };
require("../kit/kit.js");
const L = window.LS, C = L.C, AMB = C.amber, CREAM = C.cream, WARM = "#e0674d";
const VERSION = "v2";
const font = (f) => `url(data:font/woff2;base64,${readFileSync(new URL(`../assets/fonts/${f}`, import.meta.url)).toString("base64")})`;

// ---------- aides ----------
function cap(id, str, y = 450, max = 76) {
  const n = str.replace(/\*/g, "").length, size = Math.min(max, Math.round(900 / (n * 0.52)));
  const parts = str.split(/(\*[^*]+\*)/).filter(Boolean).map((p) => (p.startsWith("*") ? `<tspan fill="${AMB}">${L.esc(p.slice(1, -1))}</tspan>` : L.esc(p)));
  return `<text x="540" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${size}" fill="#fff" filter="url(#${id}-fShadow)">${parts.join("")}</text>`;
}
const dark = (op = 0.45) => `<rect x="-1200" y="-1200" width="3480" height="4320" fill="#04050d" opacity="${op}"/>`;
const vig = (id, op) => `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#${id}-gVig)" opacity="${op}"/>`;
const defs = (id) => `<defs>
  <radialGradient id="${id}-gWm" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ee7a55" stop-opacity=".95"/><stop offset=".5" stop-color="${WARM}" stop-opacity=".4"/><stop offset="1" stop-color="#b93d3a" stop-opacity="0"/></radialGradient>
  <radialGradient id="${id}-gMd" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></radialGradient></defs>`;
const cam = (fx, fy, s, sy = 960) => (c) => `<g transform="translate(540 ${sy}) scale(${s}) translate(${-fx} ${-fy})">${c}</g>`;
const glow = (id, cx, cy, rx, ry, op = 1) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id}-gWm)" opacity="${op}"/>`;
const stain = (cx, cy, k = 1, op = 0.55) => `<g transform="translate(${cx} ${cy}) scale(${k})" opacity="${op}"><path d="M-70 -20 q20 -50 70 -40 q55 -6 75 38 q40 20 25 62 q-10 45 -60 40 q-30 36 -70 8 q-62 8 -66 -40 q-30 -34 26 -68z" fill="#1a0b14"/><path d="M-30 -30 q30 -20 60 -4" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="5" stroke-linecap="round"/></g>`;
const mound = (id, cx, cy, rx, ry, op = 1) => `<g opacity="${op}"><ellipse cx="${cx + 8}" cy="${cy + 14}" rx="${rx + 8}" ry="${ry + 6}" fill="#000" opacity=".28"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id}-gMd)"/>
  <g stroke="#000" stroke-opacity=".2" stroke-width="4" stroke-linecap="round" fill="none">${[-60, -30, 0, 30, 60].map((a) => { const r = (a * Math.PI) / 180, x0 = cx + Math.sin(r) * rx * 0.55, y0 = cy - Math.cos(r) * ry * 0.55, x1 = cx + Math.sin(r) * rx * 1.25, y1 = cy - Math.cos(r) * ry * 1.25; return `<path d="M${x0.toFixed(0)} ${y0.toFixed(0)} Q${((x0 + x1) / 2 + 8).toFixed(0)} ${((y0 + y1) / 2).toFixed(0)} ${x1.toFixed(0)} ${y1.toFixed(0)}"/>`; }).join("")}</g></g>`;
const dots = (x0, x1, y, r = 5, step = 30, op = 0.55) => Array.from({ length: Math.floor((x1 - x0) / step) + 1 }, (_, i) => `<circle cx="${x0 + i * step}" cy="${y}" r="${r}" fill="#fff" opacity="${op}"/>`).join("");
const eyesOnly = (id, o = {}) => { // yeux seuls, même dessin que les personnages (ronds blancs, petite pupille, paupière), à grande échelle
  const r = o.r || 100, ex = o.ex || 170, y = o.y || 960, pup = o.pup ?? 0.2, dy = o.dy || 0, lid = o.lid || 0;
  const one = (cx) => `<ellipse cx="${cx}" cy="${y}" rx="${r * 1.9}" ry="${r * 1.45}" fill="#2d2229"/><circle cx="${cx}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${cx + 2}" cy="${y + dy}" r="${r * pup}" fill="${C.ink}"/>
    ${lid ? `<rect x="${cx - r - 2}" y="${y - r - 2}" width="${2 * r + 4}" height="${(2 * r + 4) * lid}" fill="#2d2229"/>` : ""}`;
  return `<rect x="-200" y="-200" width="1480" height="2320" fill="#030409"/>${one(540 - ex)}${one(540 + ex)}`;
};
const arc = (cx, y, r, col = "#5b4636") => `<path d="M${cx - r} ${y} q${r} ${r * 0.8} ${2 * r} 0" stroke="${col}" stroke-width="${r * 0.45}" fill="none" stroke-linecap="round"/>`;

// ---------- art : vue subjective (il est allongé sur le dos), plans rapprochés ----------
// plafond + périphérie (oreiller à gauche, Léa à droite) + drap en bas de champ + paupières. o.glow : lueur chaude qui monte du bas ; o.bulge : hauteur du relief qui entre par le bas ; o.lid : fermeture des paupières (0..1) ; o.dy : décalage vertical (respiration)
function pov(A, id, o = {}) {
  const u = (n) => A.u(n), dy = o.dy || 0, bulge = o.bulge || 0, glw = o.glow || 0, lid = o.lid || 0;
  const hump = bulge ? `<path d="M200 1990 Q215 ${1700 - bulge} 540 ${1650 - bulge} Q865 ${1700 - bulge} 880 1990z" fill="${u("gDuvet")}"/><path d="M200 1990 Q215 ${1700 - bulge} 540 ${1650 - bulge} Q865 ${1700 - bulge} 880 1990z" fill="url(#${id}-gMd)"/>` : "";
  return `<defs><linearGradient id="${id}-gCe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0e24"/><stop offset=".5" stop-color="#171c42"/><stop offset="1" stop-color="#0a0c1f"/></linearGradient></defs>
  <g transform="translate(0 ${dy})"><rect x="-80" y="-120" width="1240" height="2240" fill="url(#${id}-gCe)"/>
  <circle cx="540" cy="640" r="160" fill="#1b2150" opacity=".85"/><circle cx="540" cy="640" r="112" fill="#262e68" opacity=".6"/><path d="M130 260 q140 130 70 280 q-50 130 50 230" stroke="#fff" stroke-opacity=".07" stroke-width="5" fill="none"/>
  <g filter="url(#${id}-fBlurL)"><path d="M-40 800 Q110 860 170 1180 L-40 1600z" fill="#222a62"/><path d="M1120 760 Q960 830 920 1160 L1120 1600z" fill="#222a62"/><path d="M1120 800 Q1010 860 990 1060 Q1060 1120 1120 1100z" fill="#4a2d26"/></g>
  ${o.clock === false ? "" : A.clock("clk", 6, 980, [o.time || "03:12"], 22, 92, 48)}
  <path d="M-60 1990 L-60 1700 Q540 1590 1140 1700 L1140 1990z" fill="${u("gDuvet")}"/><path d="M-60 1700 Q540 1590 1140 1700 L1140 1735 Q540 1625 -60 1735z" fill="${C.duvetEdge}"/>${hump}
  ${glw ? `<ellipse cx="540" cy="1960" rx="680" ry="460" fill="url(#${id}-gWm)" opacity="${glw}"/><rect x="-80" y="-120" width="1240" height="2240" fill="#c4483f" opacity="${glw * 0.1}"/>` : ""}</g>
  ${lid ? `<path d="M-10 -10 H1090 V${lid * 980} Q540 ${lid * 980 + 300 * lid} -10 ${lid * 980}Z" fill="#150609"/><path d="M-10 1930 H1090 V${1920 - lid * 980} Q540 ${1920 - lid * 980 - 300 * lid} -10 ${1920 - lid * 980}Z" fill="#150609"/>` : ""}`;
}
// Léa vue de près. variante A (retenue) : chignon de nuit + frange + mèches courtes ; B : longs cheveux sur un seul côté ; C : carré. Repère local : visage rayon 100 au centre.
function leaHead(A, v = "A", closed = true) {
  const HAIR = "#6a3f2f", HI = "#92604a", skin = A.u("gSkin");
  const cap = `<path d="M-97 -18 Q-92 -98 0 -102 Q92 -98 97 -18 Q76 -62 42 -64 Q16 -42 0 -64 Q-16 -42 -42 -64 Q-76 -62 -97 -18Z" fill="${HAIR}"/><path d="M-60 -78 Q-20 -96 30 -86" stroke="${HI}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const extra = v === "A" ? `<circle cx="0" cy="-128" r="38" fill="${HAIR}"/><path d="M-22 -128 q22 -26 44 0 M-14 -120 q14 -14 28 0" stroke="${HI}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-97 -18 q-12 40 -4 74 M97 -18 q12 40 4 74" stroke="${HAIR}" stroke-width="12" fill="none" stroke-linecap="round"/>`
    : v === "B" ? `<path d="M84 -50 Q170 10 138 150 Q118 196 78 184 Q106 100 80 20Z" fill="${HAIR}"/><path d="M110 20 Q140 80 118 150" stroke="${HI}" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<path d="M-100 -30 Q-122 50 -92 96 L-66 84 Q-84 30 -78 -20Z M100 -30 Q122 50 92 96 L66 84 Q84 30 78 -20Z" fill="${HAIR}"/>`;
  const eyes = closed ? `${arc(-38, 14, 15)}${arc(38, 14, 15)}` : `<circle cx="-38" cy="12" r="15" fill="#fff"/><circle cx="38" cy="12" r="15" fill="#fff"/><circle cx="-37" cy="14" r="7" fill="${C.ink}"/><circle cx="39" cy="14" r="7" fill="${C.ink}"/>`;
  return `${v === "B" ? "" : ""}<circle r="100" fill="${skin}"/>${extra}${cap}${eyes}`;
}
const leaClose = (A, id, o = {}) => `<rect x="-80" y="-120" width="1240" height="2240" fill="#0a0c1f"/><ellipse cx="540" cy="1080" rx="640" ry="470" fill="#232a60"/><ellipse cx="540" cy="1080" rx="640" ry="470" fill="url(#${id}-gMd)" opacity=".5"/>
  <g transform="translate(${o.x || 540} ${o.y || 1020}) scale(${o.s || 2.5})">${leaHead(A, o.v || "A")}</g>
  ${o.glow ? `<ellipse cx="540" cy="2000" rx="760" ry="520" fill="url(#${id}-gWm)" opacity="${o.glow}"/>` : ""}`;
// drap en très gros plan : plis, lueur, tache, empreinte qui dépasse le cadre
const fabric = (A, id, o = {}) => `<defs><linearGradient id="${id}-gFa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34418a"/><stop offset="1" stop-color="#232d6c"/></linearGradient></defs><rect x="-80" y="-120" width="1240" height="2240" fill="url(#${id}-gFa)"/>
  <g fill="none" stroke-linecap="round">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M-60 ${250 + i * 300} Q300 ${180 + i * 300} 540 ${300 + i * 300} T1140 ${240 + i * 300}" stroke="#000" stroke-opacity=".16" stroke-width="${26 + (i % 3) * 8}"/><path d="M-60 ${280 + i * 300} Q300 ${210 + i * 300} 540 ${330 + i * 300} T1140 ${270 + i * 300}" stroke="#fff" stroke-opacity=".06" stroke-width="12"/>`).join("")}</g>
  ${o.glow ? `<ellipse cx="540" cy="${o.gy || 1250}" rx="620" ry="520" fill="url(#${id}-gWm)" opacity="${o.glow}"/>` : ""}
  ${o.stain ? stain(540, 1150, o.stain, 0.62) : ""}
  ${o.press ? `<ellipse cx="560" cy="1130" rx="${o.press}" ry="${o.press * 0.78}" fill="url(#${id}-gMd)"/><g stroke="#000" stroke-opacity=".22" stroke-width="9" stroke-linecap="round" fill="none">${[-70, -40, -12, 14, 42, 70].map((a) => { const r = (a * Math.PI) / 180, R = o.press; return `<path d="M${(560 + Math.sin(r) * R * 0.62).toFixed(0)} ${(1130 - Math.cos(r) * R * 0.5).toFixed(0)} Q${(560 + Math.sin(r) * R * 0.95).toFixed(0)} ${(1130 - Math.cos(r) * R * 0.74).toFixed(0)} ${(560 + Math.sin(r) * R * 1.3).toFixed(0)} ${(1130 - Math.cos(r) * R * 1.0).toFixed(0)}"/>`; }).join("")}</g>` : ""}`;
const hand = (A) => `<g><rect x="-140" y="1560" width="520" height="150" rx="75" fill="${A.u("gSkin")}" transform="rotate(-14 -140 1630)"/><circle cx="420" cy="1520" r="86" fill="${A.u("gSkin")}"/><g stroke="#fff" stroke-opacity=".35" stroke-width="7" stroke-linecap="round"><path d="M530 1440 l34 -22 M545 1510 l40 0 M530 1580 l34 22"/></g></g>`;

// ---------- les croquis ----------
const F = [
  { id: "f01", name: "LÉA.", words: 1, pause: 0.8, breath: 0.2, tag: "Hook · ses yeux (contrechamp)", voice: "Léa.",
    note: "<b>Image 1 = ses yeux, gros plan, grands ouverts, fixés au plafond</b>, pupilles minuscules, 1 px de tremblement. C'est le <b>seul contrechamp</b> de l'épisode : on le revoit pour ses moments de panique (f12, f16), le reste est <b>sa vision à lui</b>.",
    seam: "coupe sèche", build: (A, id) => ({ world: eyesOnly(id, { pup: 0.14 }), hud: cap(id, "*Léa.*") }) },
  { id: "f02", name: "RÉVEILLE-TOI MON AMOUR", words: 3, tag: "Subjectif · il tourne la tête vers elle", voice: "Réveille-toi mon amour.",
    note: "<b>Première personne.</b> Il tourne la tête : <b>Léa, de près, 40 cm</b>, endormie, yeux fermés, la chambre presque noire derrière. On ne voit rien d'autre du lit. Le cadre fait un très léger mouvement de respiration (le sien).",
    seam: "coupe sèche", build: (A, id) => ({ world: defs(id) + leaClose(A, id) + dark(0.32), hud: cap(id, "Réveille-toi *mon amour.*") + vig(id, 1) }) },
  { id: "f03", name: "JE SUIS TERRIFIÉ", words: 3, tag: "Subjectif · le plafond", voice: "Je suis terrifié.",
    note: "<b>Retour au plafond</b> (il a remis la tête droite). On voit : une lampe éteinte, une fissure, le bord du drap en bas de cadre, <b>l'horloge 03:12 à gauche</b>, et à droite, flou, le bord de l'oreiller de Léa. <b>Le cadre monte et descend avec sa respiration</b> (le spectateur la sent). Poussée très lente.",
    seam: "coupe sèche", build: (A, id) => ({ world: defs(id) + pov(A, id) + dark(0.2), hud: cap(id, "Je suis *terrifié.*") + vig(id, 1) }) },
  { id: "f04", name: "UN TRUC CHAUD", words: 7, tag: "Subjectif · la lueur monte par le bas", voice: "Y'a un truc chaud sur mes pieds.",
    note: "<b>Même plan.</b> Rien ne bouge, sauf <b>une lueur chaude sale qui apparaît tout en bas du cadre</b> (là où seraient ses pieds, hors champ) et teinte à peine le plafond. Elle pulse lentement. Il ne regarde pas : on ne voit pas. L'inquiétude vient de ce qu'on ne voit pas.",
    seam: "continu", build: (A, id) => ({ world: defs(id) + pov(A, id, { glow: 0.55 }) + dark(0.2), hud: cap(id, "un truc *chaud*") + vig(id, 1) }) },
  { id: "f05", name: "SUR MES PIEDS", words: 0, tag: "Insert · le drap, de très près", voice: "(même phrase, sans nouveau mot)",
    note: "<b>Insert de 0,6 s : le tissu du drap, de si près que ça devient abstrait.</b> La lueur transparaît à travers la toile, pulse. Un plan de détail, pas un plan de situation : on ne sait pas où on est. Sert de coupe pour casser la fixité du plafond.",
    seam: "coupe sèche", build: (A, id) => ({ world: defs(id) + fabric(A, id, { glow: 0.85, gy: 1250 }) + dark(0.25), hud: vig(id, 0.9) }) },
  { id: "f06", name: "JE REGARDE PAS", words: 10, tag: "★ Subjectif · paupières", voice: "Je regarde pas. Je te jure que je regarde pas.",
    note: "<b>Il ferme les yeux : l'écran devient rouge-noir (l'intérieur des paupières).</b> Sur « je te jure », <b>une fente s'ouvre un quart de seconde en bas : on aperçoit, très flou, la lueur au pied du lit</b>, puis la fente se referme. Le spectateur voit un quart de seconde de ce qu'il ne doit pas voir. Croquis : la fente ouverte.",
    seam: "continu", build: (A, id) => ({ world: defs(id) + pov(A, id, { glow: 0.7, lid: 0.46, bulge: 20 }), hud: cap(id, "Je regarde *pas.*") + vig(id, 1) }) },
  { id: "f07", name: "DOUX ET HUMIDE", words: 4, tag: "Insert · le tissu fonce", voice: "C'est doux et humide.",
    note: "<b>Insert très serré sur le drap</b> : <b>une tache sombre brillante s'étend lentement</b> dans le tissu, la lueur chaude derrière. Le grain du tissu s'écrase. Aucun repère d'échelle, aucun corps.",
    seam: "coupe sèche", build: (A, id) => ({ world: defs(id) + fabric(A, id, { glow: 0.8, stain: 3.2, gy: 1180 }) + dark(0.25), hud: cap(id, "doux et *humide.*") + vig(id, 0.9) }) },
  { id: "f08", name: "COMME UNE MAIN, TROP GRANDE", words: 7, tag: "★ Insert · l'empreinte dépasse le cadre", voice: "Ça tient comme une main, mais trop grande.",
    note: "<b>L'empreinte dans le drap est plus grande que le cadre</b> : on n'en voit ni le bord ni la forme, seulement les plis qui rayonnent. « Trop grande » est dit par l'échelle, pas par un dessin. <b>Au mot « trop », léger à-coup de caméra et les plis se resserrent.</b> Aucun doigt, aucune main.",
    seam: "à-coup sur « trop »", build: (A, id) => ({ world: defs(id) + fabric(A, id, { glow: 0.6, press: 760, gy: 1150 }) + dark(0.3), hud: cap(id, "mais *trop grande.*") + vig(id, 1) }) },
  { id: "f09", name: "ÇA REMONTE", words: 7, tag: "★ Subjectif · le relief entre dans le champ", voice: "Ça remonte. Doucement. Là, c'est la cheville.",
    note: "<b>Retour au plafond.</b> <b>Un relief du drap entre dans le cadre par le bas</b>, lentement : c'est la progression de la chose, vue uniquement à travers le tissu. Il monte d'un cran sur « Là ». La lueur éclaire davantage le plafond. On ne voit toujours pas ses jambes.",
    seam: "coupe sur « Là »", build: (A, id) => ({ world: defs(id) + pov(A, id, { glow: 0.75, bulge: 70 }) + dark(0.2), hud: cap(id, "Là, c'est la *cheville.*") + vig(id, 1) }) },
  { id: "f10", name: "JE SENS PLUS MES ORTEILS", words: 5, tag: "★ Le mot s'éteint", voice: "Je sens plus mes orteils.",
    note: "<b>Le sous-titre fait le travail</b> : <b>les lettres de « orteils » s'éteignent une à une</b> (de gauche à droite, comme l'engourdissement). Le plan reste le plafond, avec le relief un peu plus haut. Pas d'icône, pas d'infographie : c'est le texte qui meurt.",
    seam: "continu", build: (A, id) => ({ world: defs(id) + pov(A, id, { glow: 0.75, bulge: 110 }) + dark(0.2), hud: `<text x="540" y="450" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="64" fill="#fff" filter="url(#${id}-fShadow)">Je sens plus mes</text><text x="540" y="535" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="88" filter="url(#${id}-fShadow)">${"orteils.".split("").map((ch, i) => `<tspan fill="${AMB}" fill-opacity="${Math.max(0.1, 1 - i * 0.15)}">${ch}</tspan>`).join("")}</text>` + vig(id, 1) }) },
  { id: "f11", name: "À CHAQUE FOIS QUE JE RESPIRE", words: 10, tag: "★ La règle · le cadre respire", voice: "À chaque fois que je respire, ça remonte d'un cran.",
    note: "<b>Deuxième hook : la règle.</b> Le cadre entier monte à l'inspiration et redescend à l'expiration (croquis : l'image fantôme est la position « inspiré »). <b>À chaque inspiration, le relief monte d'un cran et ne redescend jamais</b> : c'est un cliquet. Trois fois, de plus en plus vite, avec une coupe à chaque inspiration.",
    seam: "coupes rapides (3 inspirations)", build: (A, id) => ({ world: defs(id) + `<g opacity=".28">${pov(A, id, { glow: 0.7, bulge: 140, dy: -46, clock: false })}</g>` + pov(A, id, { glow: 0.8, bulge: 180, clock: false }) + dark(0.2), hud: cap(id, "ça remonte d'un *cran.*") + vig(id, 1) }) },
  { id: "f12", name: "JE PEUX PAS", words: 8, tag: "★ Contrechamp · il retient son souffle", voice: "Alors j'essaie de plus respirer. Je peux pas.",
    note: "<b>« Alors j'essaie de plus respirer » : le cadre se fige complètement</b>, plus aucun mouvement, plus un son. Cut sur <b>ses yeux, écarquillés, vignette serrée</b> (la tension se lit dans le visage). Sur « Je peux pas » : <b>il aspire de force, le cadre fait un grand à-coup et le relief saute de deux crans</b>.",
    seam: "à-coup sur « Je peux pas »", build: (A, id) => ({ world: eyesOnly(id, { pup: 0.1, r: 112, ex: 180 }) + `<path d="M310 1130 q-14 36 0 54 q14 -18 0 -54z" fill="#9cc8ff" opacity=".85"/>`, hud: cap(id, "plus *respirer.*") + vig(id, 1) }) },
  { id: "f13", name: "SOULÈVE LA COUETTE", words: 11, tag: "Subjectif · sa main tremble", voice: "Léa. Soulève la couette. Dis-moi que c'est rien. Juste dis-le.",
    note: "<b>Il tourne la tête vers Léa.</b> Son visage de près, immobile. <b>Sa main entre dans le champ par le bas, tremble, et s'arrête à mi-chemin de l'épaule de Léa.</b> Sur « Juste dis-le » : poussée très lente sur son visage. Elle ne bouge pas, ne respire pas : on le comprend en regardant le drap sous son menton.",
    seam: "coupe sèche", build: (A, id) => ({ world: defs(id) + leaClose(A, id, { glow: 0.35 }) + hand(A) + dark(0.28), hud: cap(id, "Juste *dis-le.*") + vig(id, 1) }) },
  { id: "f14", name: "JE T'ENTENDS RESPIRER… NON", words: 9, pause: 0.8, tag: "★ Le son coupe", voice: "Tu réponds pas. Tu bouges plus. Je t'entends respirer… non.",
    note: "<b>Plan fixe, serré, sur Léa</b> : <b>le drap sous son menton ne bouge pas</b>. Sur « … non », <b>le son coupe net</b> (sa respiration, présente depuis le début, disparaît) et <b>une ligne de points plate traverse le cadre</b>. 0,8 s de silence. Le spectateur comprend avant lui.",
    seam: "coupe sèche + silence", build: (A, id) => ({ world: defs(id) + leaClose(A, id, { y: 880, s: 2.3 }) + `<rect x="-80" y="1260" width="1240" height="900" rx="40" fill="${A.u("gDuvet")}"/><rect x="-80" y="1260" width="1240" height="40" fill="${C.duvetEdge}"/>` + dots(40, 1040, 1240, 5, 30, 0.6) + dark(0.35), hud: cap(id, "Je t'entends respirer… *non.*") + vig(id, 1) }) },
  { id: "f15", name: "C'EST DESSOUS. C'EST LENT.", words: 7, tag: "★ Subjectif · le lit respire", voice: "C'est pas toi. C'est dessous. C'est lent.",
    note: "<b>Retour au plafond, et c'est le lit qui respire</b> : tout le cadre monte et descend, beaucoup plus lentement et plus fort que sa respiration (cycle ≈ 4 s, croquis : image fantôme). <b>Le relief du drap est maintenant à hauteur de son menton</b>, la lueur remplit le bas du cadre. « dessous » s'enfonce vers le bas. Sur « C'est lent », le cycle ralentit encore.",
    seam: "continu (long)", build: (A, id) => ({ world: defs(id) + `<g opacity=".3">${pov(A, id, { glow: 0.9, bulge: 260, dy: -90, clock: false })}</g>` + pov(A, id, { glow: 1, bulge: 300, clock: false }) + dark(0.15), hud: `<g opacity=".28"><text x="540" y="512" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="76" fill="#fff">C'est dessous.</text></g><g opacity=".5"><text x="540" y="482" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="76" fill="#fff">C'est dessous.</text></g>` + cap(id, "C'est *dessous.*") + vig(id, 1) }) },
  { id: "f16", name: "LÉA ?", words: 1, pause: 1.0, tag: "★ Presque noir · le blanc de ses yeux", voice: "Léa ?",
    note: "<b>Presque noir 0,3 s</b> : seul le blanc de ses yeux, très petit, pupilles minuscules. Un temps mort d'une seconde avant pour que le spectateur retienne son souffle comme lui.",
    seam: "coupe sèche", build: (A, id) => ({ world: `<rect x="-200" y="-200" width="1480" height="2320" fill="#020309"/>` + [430, 650].map((cx) => `<ellipse cx="${cx}" cy="960" rx="62" ry="44" fill="#fff" opacity=".9"/><circle cx="${cx + 2}" cy="962" r="8" fill="${C.ink}"/>`).join(""), hud: cap(id, "*Léa ?*", 560, 110) }) },
  { id: "f17", name: "AVEC TA VOIX", words: 9, pause: 0.6, tag: "★ Le plan final · son visage", voice: "Ça vient de dire mon prénom. Avec ta voix.",
    note: "<b>Dernier plan : le visage de Léa, de très près.</b> Yeux fermés, pas de bouche dessinée : <b>c'est elle qui n'a pas parlé</b>. En bas de cadre, <b>la lueur chaude monte comme une marée</b> et recouvre lentement le bas de son visage. Le cadre ne respire plus. Sur « Avec ta voix » : plus rien ne bouge.",
    seam: "immobile", build: (A, id) => ({ world: defs(id) + leaClose(A, id, { glow: 0.95, s: 2.6, y: 1000 }) + `<path d="M-80 1950 Q540 1450 1160 1950z" fill="${A.u("gDuvet")}" opacity=".95"/>` + dark(0.3), hud: cap(id, "Avec *ta voix.*") + vig(id, 1) }) },
  { id: "f18", name: "FIN", words: 0, tag: "★ Noir sec · boucle", voice: "(aucune voix)",
    note: "<b>Coupe au noir sec, aucune end card, aucun texte.</b> Environ 0,5 s de noir. Le premier plan de la vidéo étant ses yeux sur « Léa. », la boucle TikTok enchaîne : la fin ne se « termine » pas.",
    seam: "fin (boucle sur 01)", build: () => ({ world: `<rect x="-200" y="-200" width="1480" height="2320" fill="#020309"/>`, hud: "" }) },
];

// ---------- minutage estimé (0,36 s par mot, chuchoté) + respirations ----------
let t = 0.1;
for (const f of F) { f.t0 = t; t += f.words * 0.36 + (f.pause || 0) + (f.words ? 0 : 0.5); f.t1 = t; t += f.breath ?? 0.2; }
const total = t;
const fmt = (x) => x.toFixed(1).replace(".", ",");
const totalWords = F.reduce((a, f) => a + f.words, 0);

function render(id, world, hud) {
  const root = { innerHTML: "", querySelector: () => null, querySelectorAll: () => [] };
  L.stage(root, id, world.replaceAll("ID-", id + "-"), hud.replaceAll("ID-", id + "-"));
  return root.innerHTML.replace(/<rect id="[^"]*-lid[LR]"[^>]*\/>/g, "").replace(/<rect id="[^"]*-screenOff"[^>]*\/>/g, "").replace(/<circle id="[^"]*-(seed|ring)"[^>]*\/>/g, "");
}
const cell = (f) => {
  const A = L.art(f.id + "-");
  const b = f.build(A, f.id);
  const svg = render(f.id, b.world.replaceAll(`${f.id}-`, "ID-"), (b.hud || "").replaceAll(`${f.id}-`, "ID-"));
  return `<article class="cell" id="frame-${f.id.slice(1)}">
  <div class="frame">${svg}<svg class="safe" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><g opacity=".6" fill="none" stroke="#ff6b6b" stroke-width="3" stroke-dasharray="14 10"><rect x="920" y="780" width="150" height="740"/><rect x="0" y="1530" width="1080" height="390"/><rect x="0" y="0" width="1080" height="150"/></g></svg></div>
  <div class="label"><span>${f.id.slice(1)} · ${f.name}</span><span>≈ ${fmt(f.t0)}–${fmt(f.t1)} s</span></div>
  <p class="voice">« ${f.voice} »</p>
  <p class="note">${f.note}</p>
  <div class="chips"><span class="chip">→ ${f.seam}</span><span class="chip tag">${f.tag}</span></div>
</article>`;
};

const principles = `<article class="cell meta wide"><h3>Principes (v2 : plans rapprochés, première personne)</h3><ol class="seams">
<li><b>Plus aucun plan large.</b> Le lit, le corps, la chose : jamais montrés. Tout est vu de très près ou par ce que le tissu en dit.</li>
<li><b>Première personne.</b> Le spectateur est allongé sur le dos : plafond, bord du drap en bas de cadre, horloge à gauche, Léa à droite. <b>Le cadre respire avec lui</b> ; quand il retient son souffle, il se fige ; quand c'est le lit qui respire, il bouge plus lentement et plus fort.</li>
<li><b>La chose se lit par le bas du cadre</b> : lueur chaude qui monte, relief du drap qui entre dans le champ (cliquet : monte à chaque inspiration, ne redescend jamais), jusqu'au menton.</li>
<li><b>Inserts de détail</b> (drap, tache, empreinte plus grande que le cadre) pour casser la fixité du plafond, sans jamais situer l'action. Pas de plan > 2,5 s.</li>
<li><b>Un seul contrechamp : ses yeux</b> (début, panique, « Léa ? »). C'est ce qui garde le personnage et le lien avec « Des pas ».</li>
<li><b>Dernier plan : le visage de Léa</b>, immobile, sans bouche dessinée. Elle n'a pas parlé.</li></ol></article>
<article class="cell meta wide"><h3>Design de Léa : trois pistes (la v1 lisait « voilée »)</h3>
<div style="display:flex;gap:18px;flex-wrap:wrap">${["A", "B", "C"].map((v) => { const A = L.art("lea" + v + "-"); return `<figure style="margin:0;flex:1 1 160px;max-width:230px"><svg viewBox="-190 -230 380 420" style="width:100%;background:#232a60;border-radius:12px"><defs><radialGradient id="lea${v}-gSkin" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#e8c4a2"/><stop offset="1" stop-color="${C.skinDark}"/></radialGradient></defs>${leaHead(A, v)}</svg><figcaption style="font-size:13px;line-height:1.4;margin-top:6px"><b style="color:${AMB}">${v}${v === "A" ? " · retenue" : ""}</b> — ${v === "A" ? "chignon de nuit + frange + mèches courtes. Les cheveux restent au-dessus et sur les côtés du visage, jamais autour du menton : impossible à lire comme un voile." : v === "B" ? "longs cheveux, sur un seul côté du visage. Plus féminin, mais risque de masquer le visage de près." : "carré court. Lisible, mais la forme « casque » ressemble à un capuchon en gros plan."}</figcaption></figure>`; }).join("")}</div></article>`;
const questions = `<article class="cell meta"><h3>À trancher avant la voix</h3><ol class="seams">
<li><b>Design de Léa</b> : A (recommandé), B ou C.</li>
<li><b>Première personne partout sauf ses yeux</b> : on perd le personnage « qu'on regarde dormir » de « Des pas ». Je pense que ça vaut le coup pour l'oppression, mais c'est un changement de langage pour le compte.</li>
<li><b>Horloge 03:12</b> en périphérie gauche (clin d'œil à « Des pas ») : à garder ou retirer.</li>
<li><b>Sons</b> : respiration de Léa (présente dès le début, coupée à « … non »), respiration du lit, humide étouffé, drone grave, cœur qui bat quand il retient son souffle. De vrais enregistrements feront beaucoup mieux que mes versions synthétiques.</li>
<li>Durée estimée ≈ ${Math.round(total)} s (0,36 s par mot en chuchoté, plus les pauses) : ta prise fera foi.</li></ol></article>`;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dessous · storyboard</title>
<style>
@font-face{font-family:Fraunces;font-style:italic;font-weight:500;src:${font("Fraunces-Italic-500.woff2")} format("woff2")}
@font-face{font-family:Fraunces;font-style:italic;font-weight:700;src:${font("Fraunces-Italic-700.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:700;src:${font("Nunito-700.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:800;src:${font("Nunito-800.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:900;src:${font("Nunito-900.woff2")} format("woff2")}
*{box-sizing:border-box;margin:0}
body{background:#0c0e1f;color:${CREAM};font-family:Nunito,system-ui,sans-serif;padding:40px 16px 80px}
header{max-width:1500px;margin:0 auto 32px;display:flex;flex-wrap:wrap;align-items:baseline;gap:16px 24px}
header h1{font-family:Fraunces;font-style:italic;font-weight:700;font-size:40px}
header h1 em{color:${WARM};font-style:italic}
header p{opacity:.8;font-size:17px;flex:1 1 420px}
.tag{border:1px solid #ffffff33;border-radius:99px;padding:6px 14px;font-weight:800;font-size:14px;letter-spacing:.06em}
.toggle{font-size:14px;opacity:.85;cursor:pointer}
main{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:28px}
.cell{display:flex;flex-direction:column;gap:8px;min-width:0}
.frame{position:relative;aspect-ratio:9/16;border-radius:14px;overflow:hidden;background:${C.night0};box-shadow:0 10px 30px #0008}
.frame>.ls-stage,.frame .safe{position:absolute;inset:0;width:100%;height:100%}
.ls-stage{overflow:hidden;background:${C.night0}}.ls-tilt{position:absolute;inset:0}.ls-stage svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.frame .safe{pointer-events:none}
.label{display:flex;justify-content:space-between;gap:8px;font-weight:900;font-size:13px;letter-spacing:.06em;opacity:.9}
.voice{font-size:13.5px;line-height:1.4;font-style:italic;opacity:.7}
.note{font-size:14px;line-height:1.45;opacity:.88}.note b{color:${AMB}}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{font-size:12px;font-weight:800;border-radius:99px;padding:4px 10px;background:#ffffff14}
.chip.tag{background:#e0674d22;color:${WARM}}
.meta{background:#ffffff08;border:1px solid #ffffff14;border-radius:14px;padding:18px}
.meta.wide{grid-column:1/-1}
.meta h3{font-family:Fraunces;font-style:italic;font-size:26px;margin-bottom:10px}
.seams{font-size:14px;line-height:1.55;padding-left:18px;margin-bottom:10px}.seams b{color:${AMB}}
#hide:checked ~ main .safe{display:none}
</style></head><body>
<input type="checkbox" id="hide" hidden>
<header><h1>Dessous — <em>storytelling horreur</em> · storyboard ${VERSION}</h1>
<p>Script v2 (${totalWords} mots), mise en scène v2 : plans rapprochés et première personne. Croquis statiques : cadrage, hiérarchie, textes et mouvements à valider avant l'animation. Durées estimées à 0,36 s par mot (chuchoté) plus les pauses ; ta prise fera foi.</p>
<span class="tag">1080×1920 · ≈ ${Math.round(total)} s · ${F.length} croquis</span>
<label class="toggle" for="hide">☐ masquer les zones TikTok</label></header>
<main>${principles}${F.map(cell).join("\n")}${questions}</main>
</body></html>`;
writeFileSync(new URL("../storyboard.html", import.meta.url), html);
console.log("storyboard.html écrit —", F.length, "croquis,", totalWords, "mots, ≈", fmt(total), "s");
console.log(F.map((f) => `${f.id} ${fmt(f.t0)}-${fmt(f.t1)}`).join(" | "));
