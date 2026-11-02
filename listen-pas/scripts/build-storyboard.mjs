// Génère storyboard.html — « Des pas » (storytelling, même DA / même rythme que « Heure de fin »). Croquis statiques 9:16.   node scripts/build-storyboard.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
global.window = {};
global.gsap = { set() {} };
require("../kit/kit.js");
const L = window.LS, C = L.C, COLD = "#9cc8ff", AMB = C.amber, CREAM = C.cream;
const VERSION = "v1";
const font = (f) => `url(data:font/woff2;base64,${readFileSync(new URL(`../assets/fonts/${f}`, import.meta.url)).toString("base64")})`;

// ---------- aides ----------
function cap(id, str, y = 450, max = 76) {
  const n = str.replace(/\*/g, "").length, size = Math.min(max, Math.round(900 / (n * 0.52)));
  const parts = str.split(/(\*[^*]+\*)/).filter(Boolean).map((p) => (p.startsWith("*") ? `<tspan fill="${AMB}">${L.esc(p.slice(1, -1))}</tspan>` : L.esc(p)));
  return `<text x="540" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${size}" fill="#fff" filter="url(#${id}-fShadow)">${parts.join("")}</text>`;
}
// fil rouge : l'heure (gros au début et à la fin, petit au milieu) + « NUIT n » ; mêmes positions que le compteur de « Heure de fin »
function clock(id, t, o = {}) {
  const big = o.big, size = big ? 176 : 70, y = big ? 330 : 250, col = o.color || AMB, label = o.label ?? "NUIT 21";
  return `<g opacity="${o.opacity ?? 1}">${big ? `<text x="540" y="${y - size * 0.86}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="27" letter-spacing="8" fill="${CREAM}" fill-opacity=".8">${label}</text>` : ""}
    <text x="540" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${size}" fill="${col}" letter-spacing="${big ? 4 : 2}" filter="url(#${id}-fShadow)">${t}</text>
    ${big ? "" : `<text x="540" y="${y + 40}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="20" letter-spacing="6" fill="${CREAM}" fill-opacity=".6">${label}</text>`}</g>`;
}
const dark = (op = 0.45) => `<rect x="-1200" y="-1200" width="3480" height="4320" fill="#04050d" opacity="${op}"/>`;
const strike = (x1, x2, y1, y2, w = 7) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${AMB}" stroke-width="${w}" stroke-linecap="round"/>`;
// empreinte de pas (semelle + talon), vue de dessus
const foot = (x, y, rot = 0, k = 1, op = 1, col = AMB, glow = true) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})" opacity="${op}" ${glow ? `filter="url(#ID-fGlowS)"` : ""}><ellipse cx="0" cy="-34" rx="30" ry="52" fill="${col}"/><ellipse cx="0" cy="48" rx="22" ry="26" fill="${col}"/></g>`;
const ring = (x, y, r, op = 0.6, col = AMB, w = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" opacity="${op}"/>`;
// forme d'onde : bruit de fond + pics {x, h}
function wave(x0, x1, y, spikes = [], o = {}) {
  const step = o.step || 7, noise = o.noise ?? 5, col = o.color || "#fff"; let k = o.seed || 3, pts = [];
  const rnd = () => ((k = (k * 9301 + 49297) % 233280) / 233280);
  for (let x = x0; x <= x1; x += step) {
    let a = (rnd() - 0.5) * 2 * noise;
    for (const sp of spikes) { const d = Math.abs(x - sp.x); if (d < (sp.w || 22)) a += (rnd() > 0.5 ? 1 : -1) * sp.h * (1 - d / (sp.w || 22)); }
    pts.push(`${x},${(y + a).toFixed(1)}`);
  }
  return `<polyline points="${pts.join(" ")}" fill="none" stroke="${col}" stroke-width="${o.w || 4}" stroke-linejoin="round" stroke-linecap="round" opacity="${o.op ?? 0.9}"/>`;
}
const BED = (A, o = {}) => A.bedTop({ clock: [o.clock || "03:11"] }).replace(/<g id="[^"]*-phone">/, (m) => (o.phone ? m : m.replace(">", ' opacity="0">')));
// téléphone en enregistrement posé sur la table de nuit (vu de dessus) : point ambre qui clignote
const recPhone = (x = 230, y = 744) => `<g><rect x="${x - 35}" y="${y - 64}" width="70" height="128" rx="14" fill="#0b0d1a" stroke="${COLD}" stroke-opacity=".7" stroke-width="3"/><rect x="${x - 29}" y="${y - 58}" width="58" height="116" rx="10" fill="#101a3a"/>
  ${wave(x - 22, x + 22, y + 10, [{ x: x, h: 14, w: 12 }], { step: 4, noise: 3, color: COLD, w: 3 })}<circle cx="${x}" cy="${y - 36}" r="7" fill="${AMB}" filter="url(#ID-fGlowS)"/></g>`;

// ---------- les croquis ----------
const F = [
  { id: "f01", name: "DEPUIS TROIS SEMAINES", words: 12, breath: 0.3, tag: "Hook · le lit, l'heure, 21 nuits", voice: "Depuis trois semaines, mon appartement fait un bruit à trois heures douze.",
    note: "<b>Image 1 = l'heure en gros, en ambre</b> (03:11 → <b>03:12</b> sur « douze », avec un anneau). Plongée sur le lit, chambre sombre, le personnage dort (yeux fermés). En bas, <b>21 traits ambre</b> qui s'alignent en comptant (« trois semaines » sans le dire). La caméra pousse en continu, sans pulsation.",
    seam: "même plan", build: (A, id) => ({ world: A.bg() + BED(A, { clock: "03:12" }) + dark(0.5) + `<g transform="translate(0 0)">${Array.from({ length: 21 }, (_, i) => `<rect x="${290 + (i % 7) * 70}" y="${1330 + Math.floor(i / 7) * 62}" width="14" height="44" rx="7" fill="${AMB}" opacity="${i < 21 ? 0.95 : 0.3}"/>`).join("")}</g>`,
      hud: clock(id, "03:12", { big: true, label: "DEPUIS 21 NUITS" }) + cap(id, "à *trois heures douze.*"), closed: true }) },
  { id: "f02", name: "PAS UN CRAQUEMENT. DES PAS.", words: 5, tag: "Recadrage · le mot barré, puis les empreintes", voice: "Pas un craquement. Des pas.",
    note: "Deux sons visualisés. <b>« craquement »</b> : une forme d'onde déchirée, <b>barrée d'un trait ambre</b> (tracé de gauche à droite, au milieu des lettres). Puis <b>« des pas »</b> : deux empreintes ambre qui se posent l'une après l'autre, avec un anneau qui part de chacune. Coupe sèche entre les deux (chaque phrase = un coup).",
    seam: "coupe sèche (rythme)", build: (A, id) => ({ world: A.bg() + dark(0.2) + wave(160, 920, 840, [{ x: 330, h: 90, w: 14 }, { x: 440, h: 70, w: 12 }, { x: 560, h: 110, w: 16 }, { x: 690, h: 60, w: 12 }], { color: "#fff", op: 0.55 }) + strike(150, 930, 872, 808, 10) +
      A.pill("pCr", 540, 1000, "craquement", undefined, undefined, { size: 50 }) + strike(300, 780, 1010, 1004, 7) +
      foot(430, 1290, -8, 1.35, 1) + foot(640, 1230, 6, 1.35, 0.8) + ring(430, 1290, 110, 0.5) + ring(640, 1230, 160, 0.25) + A.pill("pPas", 540, 1480, "des pas", undefined, undefined, { size: 50, dot: AMB }),
      hud: clock(id, "03:12", {}) + cap(id, "Pas un craquement. Des *pas.*") }) },
  { id: "f03", name: "AU-DESSUS DE MOI", words: 8, tag: "Coupe de l'immeuble · dernier étage", voice: "Au-dessus de moi. Je suis au dernier étage.",
    note: "<b>Façade de l'immeuble en coupe</b> : cinq étages éteints, <b>seul le dernier est allumé</b> (lui, dans son lit minuscule). Au-dessus : le toit. Les empreintes tapent sur la dalle du toit, des anneaux ambre partent vers le bas. Pastille « dernier étage » reliée à la fenêtre. Le chemin de points relie le bruit à la chambre.",
    seam: "continu", build: (A, id) => ({ world: A.bg() + `<ellipse cx="540" cy="1160" rx="460" ry="560" fill="${C.violet}" opacity=".0"/>` +
      `<rect x="250" y="760" width="580" height="760" rx="14" fill="#1a1f4d" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>` +
      Array.from({ length: 5 }, (_, i) => `<line x1="250" y1="${910 + i * 152}" x2="830" y2="${910 + i * 152}" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>` + [0, 1].map((j) => `<rect x="${330 + j * 260}" y="${790 + i * 152}" width="130" height="92" rx="8" fill="${i === 0 ? "#ffd28a" : "#0c0f2a"}" opacity="${i === 0 ? 0.95 : 0.9}"/>`).join("")).join("") +
      `<rect x="215" y="716" width="650" height="44" rx="10" fill="#3a4290"/><rect x="520" y="640" width="12" height="76" fill="#aab0c8"/><circle cx="526" cy="636" r="10" fill="${AMB}"/>` +
      `<rect x="590" y="805" width="60" height="30" rx="8" fill="${C.cream}" opacity=".9"/><circle cx="610" cy="832" r="12" fill="${u(A, "gSkin")}"/>` +
      foot(430, 700, 0, 0.55, 1) + foot(600, 700, 0, 0.55, 0.8) + ring(430, 722, 70, 0.55) + ring(430, 722, 130, 0.3) + A.dots("down", [[430, 750], [440, 790], [470, 800], [560, 812]], { step: 22, r: 6, color: AMB, opacity: 0.85 }) +
      A.pill("pAu", 220, 600, "au-dessus de moi", 430, 700, { size: 36, dot: AMB }) + A.pill("pDe", 720, 1060, "dernier étage", 650, 820, { size: 36 }),
      hud: clock(id, "03:12", {}) + cap(id, "Je suis au *dernier étage.*") }) },
  { id: "f04", name: "JUSTE LE TOIT", words: 12, tag: "Il monte voir · le vide", voice: "Je suis monté voir. Y a pas de voisin. Juste le toit.",
    note: "<b>Le toit vu de dessus</b> : un plan gris-bleu, une antenne, une bouche d'aération, la porte de l'escalier en bas. Le personnage (silhouette) y monte par un chemin de points ambre, s'arrête au milieu, tourne sur lui-même. <b>« pas de voisin »</b> barré, puis <b>« juste le toit »</b> en grand : le vide. Aucun pas sur la dalle : c'est le but.",
    seam: "continu", build: (A, id) => ({ world: A.floorTop() + `<rect x="110" y="590" width="860" height="920" rx="18" fill="#23296a" stroke="#fff" stroke-opacity=".12" stroke-width="4"/>` +
      Array.from({ length: 8 }, (_, i) => `<line x1="110" y1="${700 + i * 100}" x2="970" y2="${700 + i * 100}" stroke="#fff" stroke-opacity=".07" stroke-width="3"/>`).join("") +
      `<rect x="150" y="1340" width="170" height="130" rx="10" fill="#3a4290"/><text x="235" y="1415" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="${CREAM}" fill-opacity=".8">ESCALIER</text>` +
      `<circle cx="800" cy="720" r="30" fill="#aab0c8"/><line x1="800" y1="720" x2="860" y2="640" stroke="#aab0c8" stroke-width="8" stroke-linecap="round"/><circle cx="330" cy="760" r="42" fill="#12163a" stroke="#aab0c8" stroke-width="6"/>` +
      A.dots("up", [[235, 1330], [300, 1230], [420, 1140], [520, 1060], [560, 990]], { step: 30, r: 7, color: AMB, opacity: 0.9 }) + A.personTop("pp", 560, 960, 0.8) +
      A.pill("pVo", 360, 1170, "pas de voisin", undefined, undefined, { size: 40 }) + strike(205, 515, 1179, 1173, 7) + A.pill("pTo", 600, 1330, "juste le toit", 570, 1030, { size: 52, dot: AMB }),
      hud: clock(id, "03:12", {}) + cap(id, "y a pas de voisin. Juste *le toit.*") }) },
  { id: "f05", name: "J'AI LAISSÉ MON TÉLÉPHONE ENREGISTRER", words: 8, tag: "Le dispositif · l'écran est bleu, le point est ambre", voice: "Alors j'ai laissé mon téléphone enregistrer la nuit.",
    note: "<b>Le téléphone en gros plan, écran bleu froid</b> (couleur de l'écran dans la DA) : une forme d'onde vivante, un chronomètre qui défile, <b>un point d'enregistrement ambre qui clignote</b>. Il est posé sur la table de nuit : la lumière bleue éclaire un coin du lit. Pas de néon (réservé à Listen).",
    seam: "continu", build: (A, id) => ({ world: A.bg() + `<ellipse cx="540" cy="1050" rx="470" ry="620" fill="url(#${id}-gHalo)" opacity=".55"/>` +
      `<rect x="320" y="640" width="440" height="900" rx="70" fill="#0b0d1a" stroke="${COLD}" stroke-opacity=".8" stroke-width="5" filter="url(#${id}-fGlowS)"/><rect x="344" y="664" width="392" height="852" rx="52" fill="#0d1433"/><rect x="480" y="680" width="120" height="34" rx="17" fill="#000"/>` +
      `<text x="540" y="810" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" letter-spacing="6" fill="${COLD}">ENREGISTREMENT</text><circle cx="540" cy="758" r="11" fill="${AMB}" filter="url(#${id}-fGlowS)"/>` +
      wave(370, 710, 1040, [{ x: 450, h: 50, w: 20 }, { x: 560, h: 80, w: 24 }, { x: 650, h: 40, w: 18 }], { color: COLD, w: 4, noise: 12, step: 6 }) +
      `<text x="540" y="1250" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="84" fill="#fff">02:47:18</text><circle cx="540" cy="1400" r="52" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="5"/><rect x="518" y="1378" width="44" height="44" rx="8" fill="${AMB}"/>`,
      hud: clock(id, "02:47", { label: "NUIT 1" }) + cap(id, "j'ai laissé mon téléphone *enregistrer.*") }) },
  { id: "f06", name: "TROIS HEURES DOUZE PILE. UN. DEUX. TROIS.", words: 10, breath: 0.6, tag: "★ L'image centrale · trois pics, puis plat", voice: "Trois heures douze pile. Un. Deux. Trois. Puis un silence.",
    note: "<b>La forme d'onde de la nuit, pleine largeur</b>, plate. Le curseur ambre arrive sur <b>03:12</b>. Trois pics, <b>chacun avec son chiffre qui claque</b> (1, 2, 3, en grand, comme les règles de « Heure de fin »). Puis la ligne redevient <b>plate</b> : « un silence » (le seul temps calme, avec la respiration ajoutée).",
    seam: "coupe sèche", build: (A, id) => ({ world: A.bg() + dark(0.2) + wave(40, 1040, 1000, [{ x: 400, h: 190, w: 18 }, { x: 540, h: 250, w: 20 }, { x: 680, h: 200, w: 18 }], { color: "#fff", op: 0.9, noise: 5 }) +
      `<line x1="540" y1="700" x2="540" y2="1340" stroke="${AMB}" stroke-width="4" stroke-dasharray="3 14" stroke-linecap="round"/>` +
      ["1", "2", "3"].map((n, i) => `<text x="${400 + i * 140}" y="${760 + (i === 1 ? -30 : 0)}" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="150" fill="${AMB}" filter="url(#${id}-fShadow)">${n}</text>`).join("") +
      A.pill("pSi", 800, 1180, "silence", undefined, undefined, { size: 44 }),
      hud: clock(id, "03:12", {}) + cap(id, "Un. Deux. Trois. Puis un *silence.*") }) },
  { id: "f07", name: "TOUJOURS TROIS. JAMAIS QUATRE.", words: 8, tag: "La règle · onze nuits empilées", voice: "Toujours trois. Jamais quatre. Onze nuits de suite.",
    note: "<b>Onze formes d'onde empilées</b> (une par nuit, « NUIT 1 » à « NUIT 11 »), chacune avec <b>exactement trois pics</b>. À droite de chaque ligne, un <b>quatrième pic fantôme, barré</b>. Les lignes tombent l'une après l'autre sur « onze nuits de suite » (le compteur du haut passe à NUIT 11). Le mur de traits de « Heure de fin », en version sonore.",
    seam: "continu", build: (A, id) => ({ world: A.bg() + dark(0.15) + Array.from({ length: 11 }, (_, i) => { const y = 640 + i * 78, h = 14 + i * 5; return `<text x="70" y="${y + 9}" font-family="Nunito" font-weight="800" font-size="22" letter-spacing="3" fill="${CREAM}" fill-opacity=".6">N${i + 1}</text>` + wave(130, 880, y, [{ x: 300, h, w: 12 }, { x: 380, h: h * 1.2, w: 12 }, { x: 460, h, w: 12 }], { step: 6, noise: 2, w: 3, op: 0.85 }) +
        `<g opacity=".5">${wave(560, 640, y, [{ x: 600, h: h * 0.9, w: 12 }], { step: 6, noise: 0, w: 3, color: AMB })}</g><line x1="552" y1="${y - 14}" x2="648" y2="${y + 14}" stroke="${AMB}" stroke-width="4" stroke-linecap="round"/>`; }).join(""),
      hud: clock(id, "03:12", { label: "NUIT 11" }) + cap(id, "Jamais *quatre.* Onze nuits de suite.") }) },
  { id: "f08a", name: "…PAS D'EN HAUT", words: 12, tag: "Retournement · la flèche vers le haut est barrée", voice: "Et en réécoutant, j'ai compris que ça ne vient pas d'en haut.",
    note: "On <b>revient à la coupe de l'immeuble</b> (même plan que le croquis 03 : c'est le fil). Une <b>flèche vers le toit</b> apparaît, puis est <b>barrée</b> (trait ambre, au milieu de la flèche). Les anneaux ne partent plus du toit : ils sont déjà <b>à l'intérieur de l'étage</b>. Le personnage ne bouge pas : le spectateur comprend avant lui.",
    seam: "continu", build: (A, id) => ({ world: A.bg() + `<rect x="250" y="760" width="580" height="760" rx="14" fill="#1a1f4d" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>` +
      Array.from({ length: 5 }, (_, i) => `<line x1="250" y1="${910 + i * 152}" x2="830" y2="${910 + i * 152}" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>` + [0, 1].map((j) => `<rect x="${330 + j * 260}" y="${790 + i * 152}" width="130" height="92" rx="8" fill="${i === 0 ? "#ffd28a" : "#0c0f2a"}" opacity="${i === 0 ? 0.95 : 0.9}"/>`).join("")).join("") +
      `<rect x="215" y="716" width="650" height="44" rx="10" fill="#3a4290"/><rect x="520" y="640" width="12" height="76" fill="#aab0c8"/>` +
      `<g stroke="${COLD}" stroke-width="12" stroke-linecap="round" fill="none"><line x1="150" y1="900" x2="150" y2="640"/><polyline points="110,690 150,640 190,690"/></g>${strike(100, 200, 780, 760, 9)}` +
      ring(540, 850, 70, 0.6) + ring(540, 850, 130, 0.35) + ring(540, 850, 190, 0.18) + `<circle cx="540" cy="850" r="12" fill="${AMB}" filter="url(#${id}-fGlowS)"/>` + A.pill("pEn", 760, 640, "pas d'en haut", undefined, undefined, { size: 40 }) + strike(610, 910, 650, 644, 7),
      hud: clock(id, "03:12", { label: "NUIT 11" }) + cap(id, "ça ne vient pas *d'en haut.*") }) },
  { id: "f08b", name: "UN PEU PLUS PRÈS", words: 9, tag: "★ L'idée de peur · le chemin de points qui se rapproche", voice: "Et que chaque nuit, c'est un peu plus près.",
    note: "<b>La chambre vue de dessus</b>, noire. Onze points ambre, de la porte (loin, petit, pâle) jusqu'au pied du lit (près, gros, vif) : <b>un point par nuit</b>, qui apparaît sur la dernière phrase en accélérant. Le dernier est <b>à un mètre du lit</b>. « NUIT 1 » à l'extrémité lointaine, « NUIT 11 » au pied du lit. La grammaire des chemins de points, retournée en menace.",
    seam: "continu", build: (A, id) => ({ world: A.floorTop() + `<rect x="150" y="560" width="780" height="940" rx="22" fill="#14183f" stroke="#fff" stroke-opacity=".10" stroke-width="4"/><rect x="700" y="540" width="180" height="40" rx="6" fill="#3a4290"/><text x="790" y="535" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="24" letter-spacing="4" fill="${CREAM}" fill-opacity=".6">PORTE</text>` +
      `<g transform="translate(180 520) scale(.55)">${BED(A, { clock: "03:11" })}</g>` +
      Array.from({ length: 11 }, (_, i) => { const t = i / 10, x = 790 - 150 * Math.pow(t, 0.8), y = 590 + 560 * Math.pow(t, 1.1), r = 7 + t * 22; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="${AMB}" opacity="${(0.25 + t * 0.75).toFixed(2)}" filter="url(#${id}-fGlowS)"/>`; }).join("") +
      A.pill("pN1", 640, 640, "NUIT 1", undefined, undefined, { size: 30 }) + A.pill("pN11", 770, 1190, "NUIT 11", 650, 1150, { size: 34, dot: AMB }),
      hud: clock(id, "03:12", { label: "NUIT 11" }) + cap(id, "chaque nuit, c'est un peu *plus près.*") }) },
  { id: "f09", name: "IL EST TROIS HEURES ONZE", words: 15, breath: 0.4, tag: "Cette nuit · le calme avant", voice: "Cette nuit, pour l'instant, j'ai pas entendu de pas. Il est trois heures onze.",
    note: "<b>Retour au cadre d'ouverture</b> (le lit en plongée, comme l'image 1), mais <b>03:11</b>, et le label « NUIT 12 ». Le téléphone sur la table de nuit enregistre (point ambre qui clignote). Le personnage dort, yeux fermés. L'horloge ne bouge plus : une minute avant. <b>Aucune musique, aucun mouvement sauf la poussée de caméra</b> : l'image attend.",
    seam: "continu", build: (A, id) => ({ world: A.bg() + BED(A, { clock: "03:11" }) + dark(0.55) + recPhone(), hud: clock(id, "03:11", { big: true, label: "NUIT 12" }) + cap(id, "Il est *trois heures onze.*"), closed: true }) },
  { id: "f10", name: "PEUT-ÊTRE QUE…", words: 3, tag: "★ La voix coupée net · l'horloge passe à 03:12", voice: "Peut-être que…  (voix coupée net)",
    note: "<b>La voix s'arrête au milieu de la phrase</b> (coupe au montage, pas de respiration). <b>L'horloge flippe : 03:11 → 03:12</b> avec un claquement ambre, le reste de l'image s'éteint (la chambre passe à presque noir). Plus de sous-titre après « Peut-être que ». Le compteur d'en haut est la seule chose allumée.",
    seam: "coupe sèche", build: (A, id) => ({ world: A.bg() + BED(A, { clock: "03:12" }) + dark(0.88), hud: clock(id, "03:12", { big: true, label: "NUIT 12" }) + cap(id, "Peut-être que…"), closed: true }) },
  { id: "f11", name: "TROIS PAS, PUIS UN QUATRIÈME", words: 0, tag: "★ Le payoff · dans la pièce", voice: "(aucune voix) — trois pas, puis un quatrième, dans la pièce",
    note: "<b>Noir presque total, aucun texte.</b> Trois empreintes ambre se posent l'une après l'autre en venant de la porte, <b>chacune avec un anneau</b> qui s'agrandit (le bruit), à intervalles réguliers. Puis <b>un quatrième pas, plus près du lit, plus lourd</b> (empreinte plus grosse, anneau qui touche le lit). C'est la règle « jamais quatre » qui casse. Bruitage : 4 pas, le quatrième dans la pièce (à fournir au montage).",
    seam: "coupe sèche vers le noir", build: (A, id) => ({ world: A.floorTop() + dark(0.8) + `<rect x="700" y="540" width="180" height="40" rx="6" fill="#3a4290" opacity=".6"/>` + `<g transform="translate(180 520) scale(.55)" opacity=".7">${BED(A, { clock: "03:12" })}</g>` +
      foot(780, 640, 25, 0.8, 0.55) + foot(730, 790, 20, 0.9, 0.7) + foot(690, 950, 15, 1.0, 0.9) + foot(640, 1160, 8, 1.5, 1) +
      ring(780, 640, 90, 0.25) + ring(730, 790, 120, 0.3) + ring(690, 950, 150, 0.4) + ring(640, 1160, 280, 0.55, AMB, 7) + ring(640, 1160, 170, 0.9, AMB, 8),
      hud: "", closed: true }) },
  { id: "f12", name: "LES YEUX S'OUVRENT", words: 0, tag: "★ Dernier plan · gros plan des yeux", voice: "(aucune voix)",
    note: "<b>Dernier plan, imposé : gros plan des yeux qui s'ouvrent.</b> Fond noir. Deux yeux grands (le même personnage), <b>les paupières se lèvent lentement</b> (≈ 0,6 s), la pupille est petite, un <b>point ambre (l'horloge 03:12) se reflète</b> dans chacune. Immobile ensuite, on tient ≈ 1 s, puis fin sèche. Aucun texte, aucun compteur : la vidéo s'arrête sur le regard. Le seul plan sans le compteur d'en haut.",
    seam: "fin (coupe sèche)", build: (A, id) => ({ world: `<rect x="-1200" y="-1200" width="3480" height="4320" fill="#030409"/>` +
      [325, 735].map((cx) => `<ellipse cx="${cx}" cy="960" rx="185" ry="135" fill="#e9e6f2"/><circle cx="${cx}" cy="960" r="82" fill="#2a1d3a"/><circle cx="${cx}" cy="960" r="30" fill="#05060c"/><circle cx="${cx + 27}" cy="932" r="14" fill="${AMB}" filter="url(#${id}-fGlowS)"/>
        <path d="M${cx - 185} 960 Q${cx} 812 ${cx + 185} 960" fill="none" stroke="#030409" stroke-width="12" stroke-linecap="round"/>`).join("") +
      `<ellipse cx="540" cy="960" rx="520" ry="260" fill="url(#${id}-gHalo)" opacity=".05"/>`, hud: "" }) },
];
function u(A, name) { return A.u(name); }

// ---------- minutage estimé (0,32 s par mot) + respirations ----------
let t = 0.1;
for (const f of F) { f.t0 = t; t += f.words * 0.32 + (f.words ? 0 : 1.4); f.t1 = t; t += f.breath || 0.12; }
const total = t + 0.6;
const fmt = (x) => x.toFixed(1).replace(".", ",");
const totalWords = F.reduce((a, f) => a + f.words, 0);

function render(id, world, hud, fx = {}) {
  const root = { innerHTML: "", querySelector: () => null, querySelectorAll: () => [] };
  L.stage(root, id, world.replaceAll("ID-", id + "-"), hud.replaceAll("ID-", id + "-"));
  let svg = root.innerHTML.replace(/<rect id="[^"]*-lid[LR]"[^>]*\/>/g, "").replace(/<rect id="[^"]*-screenOff"[^>]*\/>/g, "").replace(/<circle id="[^"]*-(seed|ring)"[^>]*\/>/g, "");
  if (fx.closed) svg = svg.replace(new RegExp(`<g id="${id}-([A-Za-z]*[eE]yes)-open"`, "g"), `<g id="${id}-$1-open" opacity="0"`).replace(new RegExp(`<g id="${id}-([A-Za-z]*[eE]yes)-shut" opacity="0"`, "g"), `<g id="${id}-$1-shut" opacity="1"`);
  return svg;
}
const cell = (f) => {
  const A = L.art(f.id + "-");
  const b = f.build(A, f.id);
  const svg = render(f.id, b.world.replaceAll(`${f.id}-`, "ID-"), (b.hud || "").replaceAll(`${f.id}-`, "ID-"), { closed: b.closed });
  return `<article class="cell" id="frame-${f.id.slice(1)}">
  <div class="frame">${svg}<svg class="safe" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><g opacity=".6" fill="none" stroke="#ff6b6b" stroke-width="3" stroke-dasharray="14 10"><rect x="920" y="780" width="150" height="740"/><rect x="0" y="1530" width="1080" height="390"/><rect x="0" y="0" width="1080" height="150"/></g></svg></div>
  <div class="label"><span>${f.id.slice(1)} · ${f.name}</span><span>≈ ${fmt(f.t0)}–${fmt(f.t1)} s</span></div>
  <p class="voice">« ${f.voice} »</p>
  <p class="note">${f.note}</p>
  <div class="chips"><span class="chip">→ ${f.seam}</span><span class="chip tag">${f.tag}</span></div>
</article>`;
};

const changes = `<article class="cell meta wide"><h3>Principes (même DA, même rythme que « Heure de fin »)</h3><ol class="seams">
<li><b>Le fil rouge reste en haut</b> : l'heure (03:12 en ambre) et « NUIT n ». Gros au début et à l'image 9, petit au milieu. Il remplace le compteur « avant ton réveil » et porte la histoire : 21 nuits → NUIT 11 → NUIT 12.</li>
<li><b>Une image qui change toutes les ≈ 2 à 3 s</b>, un événement par phrase, coupes sèches sur les phrases courtes (« Pas un craquement. Des pas. »), continu sur les phrases longues.</li>
<li><b>Le néon (cyan → violet → magenta) n'apparaît pas</b> : le script n'a pas de produit. Bleu froid = l'écran du téléphone, ambre = ce qui arrive (heure, pas, point d'enregistrement).</li>
<li><b>Deux images-clés</b> : les trois pics numérotés (06) et les onze points qui se rapprochent (08b).</li>
<li><b>Fin imposée</b> : voix coupée net sur « Peut-être que » → l'horloge flippe à 03:12 → trois pas, un quatrième → <b>gros plan des yeux qui s'ouvrent</b> (dernier plan).</li></ol></article>`;
const questions = `<article class="cell meta"><h3>À trancher avant la voix</h3><ol class="seams">
<li><b>Y a-t-il un produit dans cette vidéo ?</b> Le script n'en a pas. Si c'est une pub Listen (ou autre), il faut un moment où le produit apparaît ; sinon je ne mets ni néon ni carte de fin.</li>
<li><b>« J'ai sonné chez le voisin »</b> ne tient pas au dernier étage : on ne sonne pas chez un voisin qui n'existe pas. J'ai écrit « Je suis monté voir » (voir SCRIPT-TTS.md). À valider.</li>
<li><b>Sons à fournir au montage</b> : 4 pas (le quatrième plus lourd, dans la pièce), éventuellement un souffle. Je n'ai que des bruitages synthétiques ; je peux générer un pas provisoire.</li>
<li>Durée estimée ≈ ${Math.round(total)} s (0,32 s par mot) : ta prise fera foi.</li></ol></article>`;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Des pas · storyboard</title>
<style>
@font-face{font-family:Fraunces;font-style:italic;font-weight:500;src:${font("Fraunces-Italic-500.woff2")} format("woff2")}
@font-face{font-family:Fraunces;font-style:italic;font-weight:700;src:${font("Fraunces-Italic-700.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:700;src:${font("Nunito-700.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:800;src:${font("Nunito-800.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:900;src:${font("Nunito-900.woff2")} format("woff2")}
@font-face{font-family:Poppins;font-weight:400;src:${font("Poppins-400.woff2")} format("woff2")}
@font-face{font-family:Poppins;font-weight:700;src:${font("Poppins-700.woff2")} format("woff2")}
*{box-sizing:border-box;margin:0}
body{background:#0c0e1f;color:${CREAM};font-family:Nunito,system-ui,sans-serif;padding:40px 16px 80px}
header{max-width:1500px;margin:0 auto 32px;display:flex;flex-wrap:wrap;align-items:baseline;gap:16px 24px}
header h1{font-family:Fraunces;font-style:italic;font-weight:700;font-size:40px}
header h1 em{color:${AMB};font-style:italic}
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
.chip.tag{background:#f5b85a22;color:${AMB}}
.meta{background:#ffffff08;border:1px solid #ffffff14;border-radius:14px;padding:18px}
.meta.wide{grid-column:1/-1}
.meta h3{font-family:Fraunces;font-style:italic;font-size:26px;margin-bottom:10px}
.seams{font-size:14px;line-height:1.55;padding-left:18px;margin-bottom:10px}.seams b{color:${AMB}}
#hide:checked ~ main .safe{display:none}
</style></head><body>
<input type="checkbox" id="hide" hidden>
<header><h1>Des pas — <em>storytelling</em> · storyboard ${VERSION}</h1>
<p>Script v2 (${totalWords} mots). Croquis statiques : cadrage, hiérarchie, textes et mouvements à valider avant l'animation. Durées estimées à 0,32 s par mot plus les respirations et la fin sans voix ; ta prise fera foi.</p>
<span class="tag">1080×1920 · ≈ ${Math.round(total)} s · ${F.length} croquis</span>
<label class="toggle" for="hide">☐ masquer les zones TikTok</label></header>
<main>${changes}${F.map(cell).join("\n")}${questions}</main>
</body></html>`;
writeFileSync(new URL("../storyboard.html", import.meta.url), html);
console.log("storyboard.html écrit —", F.length, "croquis,", totalWords, "mots, ≈", fmt(total), "s");
console.log(F.map((f) => `${f.id} ${fmt(f.t0)}-${fmt(f.t1)}`).join(" | "));
