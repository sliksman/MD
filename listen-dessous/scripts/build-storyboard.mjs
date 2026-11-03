// Génère storyboard.html — « Dessous » (storytelling horreur, même DA que « Des pas »). Croquis statiques 9:16.   node scripts/build-storyboard.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
global.window = {};
global.gsap = { set() {} };
require("../kit/kit.js");
const L = window.LS, C = L.C, AMB = C.amber, CREAM = C.cream, WARM = "#e0674d";
const VERSION = "v1";
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

// lit double en plongée : lui à gauche (x≈385), Léa à droite (x≈695). o.lea = "sleep" | "flat" ; o.him = "open" | "shut"
function bed(A, id, o = {}) {
  const u = (n) => A.u(n);
  const body = (cx, op) => `<path d="M${cx - 62} 850 Q${cx} 815 ${cx + 62} 850 L${cx + 46} 1540 Q${cx} 1575 ${cx - 46} 1540 Z" fill="#fff" opacity="${op}"/><path d="M${cx + 62} 850 L${cx + 46} 1540" stroke="#000" stroke-opacity=".25" stroke-width="10" fill="none"/>
    <ellipse cx="${cx - 24}" cy="1590" rx="24" ry="40" fill="#fff" opacity="${op * 1.2}"/><ellipse cx="${cx + 24}" cy="1590" rx="24" ry="40" fill="#fff" opacity="${op * 1.2}"/>`;
  const him = o.himBody === false ? "" : body(385, 0.08), lea = o.lea === "flat" ? body(695, 0.015) : body(695, 0.08);
  return `<rect x="190" y="545" width="700" height="1210" rx="46" fill="${u("gWood")}"/><rect x="222" y="582" width="636" height="1140" rx="32" fill="#cfc8bb"/>
  <rect x="100" y="600" width="86" height="120" rx="12" fill="${u("gWood")}"/>${o.clock === false ? "" : A.clock("clk", 105, 640, [o.clock || "03:12"], 18, 70, 36)}
  <rect x="262" y="600" width="250" height="150" rx="52" fill="${u("gPillow")}"/><rect x="572" y="600" width="250" height="150" rx="52" fill="${u("gPillow")}"/>
  <g id="${id}-hair"><ellipse cx="695" cy="705" rx="104" ry="96" fill="#2b1d1f"/><path d="M600 700 Q560 780 590 830 M790 700 Q830 780 800 830" stroke="#2b1d1f" stroke-width="22" fill="none" stroke-linecap="round"/></g>
  <circle cx="385" cy="690" r="66" fill="${u("gSkin")}"/>${o.him === "shut" ? arc(363, 694, 11) + arc(407, 694, 11) : A.eyes("eyes", 363, 407, 694, 11)}
  <circle cx="695" cy="690" r="62" fill="${u("gSkin")}"/>${arc(675, 694, 11)}${arc(715, 694, 11)}
  <rect x="222" y="790" width="636" height="915" rx="26" fill="${u("gDuvet")}"/><rect x="222" y="790" width="636" height="44" rx="14" fill="${C.duvetEdge}"/><line x1="540" y1="834" x2="540" y2="1705" stroke="#000" stroke-opacity=".15" stroke-width="4"/>
  ${him}${lea}`;
}

// ---------- les croquis ----------
const F = [
  { id: "f01", name: "LÉA.", words: 1, pause: 0.8, breath: 0.2, tag: "Hook · ses yeux", voice: "Léa.",
    note: "<b>Image 1 = ses yeux, en gros plan, grands ouverts, fixés au plafond</b>, pupilles minuscules, avec un tremblement de 1 px. Le premier mot est un prénom, dit à plat, en chuchotant. Fond noir, rien d'autre : le regard fait le hook. <b>Durée ≈ 1,2 s.</b>",
    seam: "coupe sèche", build: (A, id) => ({ world: eyesOnly(id, { pup: 0.14 }), hud: cap(id, "*Léa.*"), noGrain: true }) },
  { id: "f02", name: "RÉVEILLE-TOI MON AMOUR", words: 6, tag: "Plan large · le lit, Léa à côté", voice: "Réveille-toi mon amour. Je suis terrifié.",
    note: "<b>Plongée sur le lit double, quasi noir.</b> Lui à gauche, yeux ouverts ; Léa à droite, immobile, cheveux étalés sur l'oreiller. Horloge de chevet 03:12 (option). <b>Poussée lente</b> pendant « Je suis terrifié ». On voit que le lit est trop grand, trop calme.",
    seam: "coupe sèche (≈ 2,5 s max)", build: (A, id) => ({ world: defs(id) + cam(540, 1000, 1)(bed(A, id)) + dark(0.42), hud: cap(id, "Réveille-toi *mon amour.*") + vig(id, 0.9) }) },
  { id: "f03", name: "UN TRUC CHAUD", words: 7, tag: "Le bas du lit · la lueur naît", voice: "Y'a un truc chaud sur mes pieds.",
    note: "<b>Coupe sur le pied du lit.</b> Sous le drap, au niveau de ses pieds, <b>une lueur chaude sale (rose-ambre) apparaît et pulse lentement</b>, comme un battement. Rien d'autre ne change. C'est la première chose « anormale » : une source de lumière qui ne devrait pas être là.",
    seam: "coupe sèche", build: (A, id) => ({ world: defs(id) + cam(385, 1560, 1.9)(bed(A, id) + glow(id, 385, 1590, 190, 150, 0.9)) + dark(0.38), hud: cap(id, "un truc *chaud*") + vig(id, 0.9) }) },
  { id: "f04", name: "JE REGARDE PAS", words: 10, tag: "Gros plan · il fait le contraire", voice: "Je regarde pas. Je te jure que je regarde pas.",
    note: "<b>Ses yeux, paupières serrées</b> sur « Je regarde pas ». Sur « je te jure », <b>elles s'entrouvrent un quart de seconde et les pupilles glissent vers le bas</b> (vers ses pieds), puis se referment. Il dit une chose et fait l'autre : on sent qu'il a besoin de regarder. <b>Croquis : instant où il regarde.</b>",
    seam: "continu", build: (A, id) => ({ world: eyesOnly(id, { pup: 0.2, dy: 46, lid: 0.55 }), hud: cap(id, "Je regarde *pas.*") }) },
  { id: "f05", name: "DOUX ET HUMIDE", words: 4, tag: "Plan serré · la tache s'étend", voice: "C'est doux et humide.",
    note: "<b>Plan serré sur le drap, bas du lit.</b> Une <b>tache sombre brillante s'étend lentement</b> autour de ses pieds (humide), la lueur chaude passe derrière. Le drap se froisse légèrement. On ne voit toujours rien de la chose.",
    seam: "continu", build: (A, id) => ({ world: defs(id) + cam(385, 1560, 2.1)(bed(A, id) + glow(id, 385, 1590, 210, 170, 0.8) + stain(385, 1560, 1.3, 0.6)) + dark(0.35), hud: cap(id, "doux et *humide.*") + vig(id, 0.9) }) },
  { id: "f06", name: "COMME UNE MAIN, TROP GRANDE", words: 7, tag: "★ L'empreinte · l'échelle", voice: "Ça tient comme une main, mais trop grande.",
    note: "<b>Le drap se creuse en une empreinte plus large que son pied</b> (≈ 2× sa taille) : un relief arrondi, des plis qui rayonnent, <b>jamais de doigts dessinés</b>. Au mot « trop », l'empreinte grossit d'un coup (à-coup caméra). C'est l'image la plus explicite de l'épisode, et elle ne montre rien.",
    seam: "à-coup caméra sur « trop »", build: (A, id) => ({ world: defs(id) + cam(385, 1540, 1.6)(bed(A, id) + glow(id, 385, 1560, 250, 200, 0.75) + stain(385, 1580, 1.5, 0.5) + mound(id, 385, 1540, 175, 130)) + dark(0.35), hud: cap(id, "mais *trop grande.*") + vig(id, 1) }) },
  { id: "f07", name: "ÇA REMONTE", words: 7, tag: "La cheville · premier cran", voice: "Ça remonte. Doucement. Là, c'est la cheville.",
    note: "<b>L'empreinte a monté d'un cran</b> : elle est maintenant au niveau de la cheville, la tache la suit, la lueur est plus grande. <b>La vignette se resserre d'un cran</b> (à chaque cran, un paramètre monte : lueur, vignette, drone grave). Coupe franche sur « Là ».",
    seam: "coupe sur « Là »", build: (A, id) => ({ world: defs(id) + cam(385, 1430, 1.35)(bed(A, id) + glow(id, 385, 1480, 260, 260, 0.8) + stain(385, 1540, 1.7, 0.55) + mound(id, 385, 1440, 120, 100)) + dark(0.35), hud: cap(id, "Là, c'est la *cheville.*") + vig(id, 1) }) },
  { id: "f08", name: "JE SENS PLUS MES ORTEILS", words: 5, tag: "★ Cinq points qui s'éteignent", voice: "Je sens plus mes orteils.",
    note: "<b>Une icône de pied (cinq points ambre) s'allume en haut du cadre</b>, puis <b>les points s'éteignent un par un</b> sur « orteils » (ici 3 sur 5 éteints). Lecture instantanée de l'engourdissement, sans effet gore. Le fond reste le lit, en plus sombre.",
    seam: "continu", build: (A, id) => ({ world: defs(id) + cam(385, 1380, 1.35)(bed(A, id) + glow(id, 385, 1450, 280, 280, 0.8) + stain(385, 1500, 1.7, 0.55) + mound(id, 385, 1400, 130, 105)) + dark(0.5), hud: cap(id, "Je sens plus mes *orteils.*") + `<g transform="translate(540 800)"><path d="M-70 -120 q-20 80 -10 150 q20 40 80 30 q60 -10 60 -60 q0 -80 -30 -120 z" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="5"/>${[-52, -20, 12, 40, 66].map((x, i) => `<circle cx="${x}" cy="${-150 + Math.abs(i - 1.6) * 10}" r="12" fill="${i < 2 ? AMB : "#fff"}" opacity="${i < 2 ? 1 : 0.18}"/>`).join("")}</g>` + vig(id, 1) }) },
  { id: "f09", name: "À CHAQUE FOIS QUE JE RESPIRE", words: 10, tag: "★ La règle · cause → effet", voice: "À chaque fois que je respire, ça remonte d'un cran.",
    note: "<b>Deuxième hook (≈ 25 s) : la règle.</b> Plan sur son torse : le drap se soulève à chaque inspiration et <b>un anneau part de la poitrine</b> ; <b>au même instant l'empreinte monte d'un cran</b> (genou). Il faut que la cause et l'effet soient lisibles sans explication : on les voit se produire ensemble trois fois, de plus en plus vite.",
    seam: "coupes rapides (3 respirations)", build: (A, id) => ({ world: defs(id) + cam(385, 1180, 1.15)(bed(A, id) + `<ellipse cx="385" cy="1000" rx="95" ry="70" fill="#fff" opacity=".1"/>` + [90, 150, 210].map((r, i) => `<ellipse cx="385" cy="1000" rx="${r}" ry="${r * 0.7}" fill="none" stroke="${AMB}" stroke-opacity="${0.55 - i * 0.17}" stroke-width="6"/>`).join("") + glow(id, 385, 1330, 270, 240, 0.8) + stain(385, 1420, 1.9, 0.5) + mound(id, 385, 1330, 125, 100)) + dark(0.4), hud: cap(id, "ça remonte d'un *cran.*") + vig(id, 1) }) },
  { id: "f10", name: "JE PEUX PAS", words: 8, tag: "Gros plan · il retient son souffle", voice: "Alors j'essaie de plus respirer. Je peux pas.",
    note: "<b>Gros plan sur son visage</b> : yeux écarquillés, bouche minuscule serrée, joues un peu plus claires, deux gouttes de sueur. Tout est figé (le relief aussi). Sur « Je peux pas » : <b>le torse reprend de force et la chambre fait un à-coup</b> (cran suivant). Les coupes accélèrent.",
    seam: "à-coup sur « Je peux pas »", build: (A, id) => ({ world: `<rect x="-200" y="-200" width="1480" height="2320" fill="#05060f"/><circle cx="540" cy="930" r="300" fill="${A.u("gSkin")}"/><circle cx="420" cy="1010" r="52" fill="#fff" opacity=".12"/><circle cx="660" cy="1010" r="52" fill="#fff" opacity=".12"/>
      <circle cx="450" cy="900" r="58" fill="#fff"/><circle cx="630" cy="900" r="58" fill="#fff"/><circle cx="452" cy="903" r="11" fill="${C.ink}"/><circle cx="632" cy="903" r="11" fill="${C.ink}"/>
      <path d="M510 1060 q30 -10 60 0" stroke="#5b4636" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M705 760 q14 28 0 40 q-14 -12 0 -40z M740 810 q10 22 0 32 q-10 -10 0 -32z" fill="#9cc8ff" opacity=".8"/>` + dark(0.3), hud: cap(id, "plus *respirer.*") + vig(id, 1) }) },
  { id: "f11", name: "SOULÈVE LA COUETTE", words: 11, tag: "Léa · son bras s'arrête", voice: "Léa. Soulève la couette. Dis-moi que c'est rien. Juste dis-le.",
    note: "<b>Coupe sur Léa</b> : visage endormi, yeux fermés. <b>Son bras à lui entre dans le cadre depuis la gauche, tremble, et s'arrête à mi-chemin de son épaule.</b> Lecture : il n'ose pas la toucher, ni lever la couette. Sur « Juste dis-le » : poussée très lente sur son visage. <b>À la relecture</b> : sa silhouette sous la couette est plus aplatie qu'au plan 2.",
    seam: "coupe sèche", build: (A, id) => ({ world: defs(id) + cam(700, 820, 1.9)(bed(A, id, { lea: "flat" }) + `<g stroke="#fff" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"><path d="M520 840 l-18 -10 M520 880 l-20 0 M520 920 l-18 10"/></g><rect x="230" y="830" width="310" height="62" rx="31" fill="${A.u("gSkin")}"/><circle cx="548" cy="861" r="40" fill="${A.u("gSkin")}"/>`) + dark(0.3), hud: cap(id, "Juste *dis-le.*") + vig(id, 0.9) }) },
  { id: "f12", name: "JE T'ENTENDS RESPIRER… NON", words: 9, pause: 0.8, tag: "★ Le son coupe · Léa ne respire pas", voice: "Tu réponds pas. Tu bouges plus. Je t'entends respirer… non.",
    note: "<b>Plan large.</b> Son torse à elle ne bouge pas : le drap est plat de son côté. Sur « … non », <b>le son coupe net (sa respiration, présente depuis le début, disparaît)</b> et une ligne de points plate traverse son côté du lit. Le spectateur comprend avant lui. 0,8 s de silence.",
    seam: "coupe sèche + silence", build: (A, id) => ({ world: defs(id) + cam(540, 1000, 1)(bed(A, id, { lea: "flat" }) + glow(id, 385, 1470, 300, 280, 0.7) + mound(id, 385, 1340, 125, 100)) + dark(0.42) + dots(580, 840, 1000, 5, 30, 0.6), hud: cap(id, "Je t'entends respirer… *non.*") + vig(id, 1) }) },
  { id: "f13", name: "C'EST DESSOUS. C'EST LENT.", words: 7, tag: "★ Le lit respire", voice: "C'est pas toi. C'est dessous. C'est lent.",
    note: "<b>Tout le matelas se soulève puis redescend, très lentement (cycle ≈ 4 s)</b> ; la caméra suit, la vignette bat au même rythme (croquis : lit à l'échelle 1,03 et son contour de repos en pointillé). <b>Le mot « dessous » s'enfonce physiquement vers le bas du cadre</b> (traînées). Sur « C'est lent », le cycle ralentit encore. Presque aucun son.",
    seam: "continu (long)", build: (A, id) => ({ world: defs(id) + cam(540, 1000, 1)(`<rect x="190" y="545" width="700" height="1210" rx="46" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-dasharray="12 10"/>` + `<g transform="translate(540 1150) scale(1.035) translate(-540 -1150)">${bed(A, id, { lea: "flat" })}</g>` + [260, 330, 400].map((r, i) => `<rect x="${190 - 14 * (i + 1)}" y="${545 - 14 * (i + 1)}" width="${700 + 28 * (i + 1)}" height="${1210 + 28 * (i + 1)}" rx="${46 + 12 * (i + 1)}" fill="none" stroke="${WARM}" stroke-opacity="${0.3 - i * 0.09}" stroke-width="5"/>`).join("")) + dark(0.45), hud: `<g opacity=".28"><text x="540" y="512" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="76" fill="#fff">C'est dessous.</text></g><g opacity=".5"><text x="540" y="482" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="76" fill="#fff">C'est dessous.</text></g>` + cap(id, "C'est *dessous.*") + vig(id, 1) }) },
  { id: "f14", name: "LÉA ?", words: 1, pause: 1.0, tag: "★ Presque noir · le blanc de ses yeux", voice: "Léa ?",
    note: "<b>Presque noir pendant 0,3 s.</b> Seul le <b>blanc de ses yeux</b> se détache, très petit, les pupilles minuscules. Un seul mot, centré. Un temps mort d'une seconde avant, pour que le spectateur retienne son souffle comme lui.",
    seam: "coupe sèche", build: (A, id) => ({ world: `<rect x="-200" y="-200" width="1480" height="2320" fill="#020309"/>` + [430, 650].map((cx) => `<ellipse cx="${cx}" cy="960" rx="62" ry="44" fill="#fff" opacity=".9"/><circle cx="${cx + 2}" cy="962" r="8" fill="${C.ink}"/>`).join(""), hud: cap(id, "*Léa ?*", 560, 110) }) },
  { id: "f15", name: "AVEC TA VOIX", words: 9, pause: 0.6, tag: "★ Le plan final · immobile", voice: "Ça vient de dire mon prénom. Avec ta voix.",
    note: "<b>Retour au plan large.</b> Les deux silhouettes sont aplaties, <b>un seul gonflement doux au centre du lit</b>, lent. Lui, tête sur l'oreiller, regard fixe. Sur « Avec ta voix » : <b>plus rien ne bouge</b>. Son prénom n'est jamais dit ni écrit.",
    seam: "immobile", build: (A, id) => ({ world: defs(id) + cam(540, 1000, 1)(bed(A, id, { lea: "flat", himBody: false }) + glow(id, 540, 1150, 330, 300, 0.45) + `<ellipse cx="540" cy="1150" rx="170" ry="260" fill="url(#${id}-gMd)" opacity=".9"/>`) + dark(0.5), hud: cap(id, "Avec *ta voix.*") + vig(id, 1) }) },
  { id: "f16", name: "FIN", words: 0, tag: "★ Noir sec · boucle", voice: "(aucune voix)",
    note: "<b>Coupe au noir sec, aucune end card, aucun texte.</b> Environ 0,5 s de noir. Le premier plan de la vidéo étant ses yeux ouverts sur « Léa. », la boucle TikTok enchaîne naturellement : la fin ne se « termine » pas.",
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

const principles = `<article class="cell meta wide"><h3>Principes</h3><ol class="seams">
<li><b>On ne voit jamais la chose.</b> Tout passe par le drap : lueur, humidité, relief, respiration. Pas de main, pas de bouche, pas de monstre dessinés.</li>
<li><b>Chaque beat monte d'un cran d'un seul paramètre</b> (lueur, tache, relief, vignette, drone grave) : la progression se sent sans être expliquée.</li>
<li><b>Même DA que « Des pas »</b> (plongée, personnages ronds, yeux ronds à petite pupille), en plus noir : pas de néon, pas de produit, pas d'end card. Lueur chaude sale (rose-ambre) à la place du bleu/ambre habituel.</li>
<li><b>Une image qui change toutes les ≈ 2 à 3 s</b>, coupes sèches sur les phrases courtes, plans longs sur la montée (f13) et le silence (f12).</li>
<li><b>Deux hooks</b> : ses yeux dès l'image 1, puis la règle de la respiration (f09, ≈ 25 s).</li>
<li><b>À la relecture</b> : la silhouette de Léa s'aplatit au fil de l'épisode (f02 → f11 → f12 → f15).</li></ol></article>`;
const questions = `<article class="cell meta"><h3>À trancher avant la voix</h3><ol class="seams">
<li><b>« Qu'est-ce qui nous arrive ? »</b> est coupée (voir BRIEF.md).</li>
<li><b>Horloge 03:12</b> sur la table de nuit (clin d'œil à « Des pas ») : dessinée ici, à garder ou retirer.</li>
<li><b>Fin</b> : noir sec en boucle (recommandé) ou dernier plan sur ses yeux qui se tournent vers Léa.</li>
<li><b>Sons</b> : respiration de Léa (présente dès le début, coupée à « … non »), respiration lente du lit, humide étouffé, drone grave. Mes versions synthétiques seront faibles : de vrais enregistrements feront beaucoup mieux.</li>
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
<p>Script v2 (${totalWords} mots). Croquis statiques : cadrage, hiérarchie, textes et mouvements à valider avant l'animation. Durées estimées à 0,36 s par mot (chuchoté) plus les pauses ; ta prise fera foi.</p>
<span class="tag">1080×1920 · ≈ ${Math.round(total)} s · ${F.length} croquis</span>
<label class="toggle" for="hide">☐ masquer les zones TikTok</label></header>
<main>${principles}${F.map(cell).join("\n")}${questions}</main>
</body></html>`;
writeFileSync(new URL("../storyboard.html", import.meta.url), html);
console.log("storyboard.html écrit —", F.length, "croquis,", totalWords, "mots, ≈", fmt(total), "s");
console.log(F.map((f) => `${f.id} ${fmt(f.t0)}-${fmt(f.t1)}`).join(" | "));
