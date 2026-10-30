// Génère storyboard.html — « Les nuits blanches · épisode 1 » (croquis statiques 9:16, aucune animation).
// Réutilise le kit de l'épisode 3 (kit/kit.js) : même personnage, même lit, mêmes pastilles.   node scripts/build-storyboard.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
global.window = {};
global.gsap = { set() {} };
require("../kit/kit.js");
const L = window.LS, C = L.C, COLD = "#9cc8ff";
const VERSION = "v1";
const font = (f) => `url(data:font/woff2;base64,${readFileSync(new URL(`../assets/fonts/${f}`, import.meta.url)).toString("base64")})`;

// ---------- aides ----------
const strike = (x1, x2, y, w = 9) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${C.amber}" stroke-width="${w}" stroke-linecap="round"/>`;
function cap(id, str, y = 1330) {
  const n = str.replace(/\*/g, "").length, size = Math.min(76, Math.round(820 / (n * 0.5)));
  const parts = str.split(/(\*[^*]+\*)/).filter(Boolean).map((p) => (p.startsWith("*") ? `<tspan fill="${C.amber}">${L.esc(p.slice(1, -1))}</tspan>` : L.esc(p)));
  return `<text x="540" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${size}" fill="#fff" filter="url(#${id}-fShadow)">${parts.join("")}</text>`;
}
const dots3 = (n, dim = false) => `<g filter="none">${[0, 1, 2].map((i) => `<circle cx="${820 + i * 56}" cy="212" r="14" fill="${i < n ? C.amber : "#fff"}" opacity="${i < n ? 1 : dim ? 0.22 : 0.3}"/>`).join("")}</g>`;
function curve(p0, p1, bend = 80, n = 14) {
  const mx = (p0[0] + p1[0]) / 2 + bend, my = (p0[1] + p1[1]) / 2 - bend;
  return Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * mx + t * t * p1[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * my + t * t * p1[1]]; });
}
const COUCH = (A, o = {}) => `<g transform="translate(54 150) scale(0.9)">${A.couchTop(o)}</g>`;
const BED = (A, o = {}) => `<g transform="translate(-170 -170) scale(1.32)">${A.bedTop(o)}</g>`;

function render(id, world, hud, fx = {}) {
  const root = { innerHTML: "", querySelector: () => null, querySelectorAll: () => [] };
  L.stage(root, id, world, hud);
  let svg = root.innerHTML.replace(/<rect id="[^"]*-lid[LR]"[^>]*\/>/g, "").replace(/<rect id="[^"]*-screenOff"[^>]*\/>/g, "");
  if (fx.closed) svg = svg.replace(new RegExp(`<g id="${id}-eyes-open"`, "g"), `<g id="${id}-eyes-open" opacity="0"`).replace(new RegExp(`<g id="${id}-eyes-shut" opacity="0"`, "g"), `<g id="${id}-eyes-shut" opacity="1"`);
  return svg;
}

// ---------- les 15 croquis ----------
// words = mots de la voix (version B, 185 mots) ; breath = respiration (s) ajoutée APRÈS le croquis
const F = [
  { id: "f01", name: "MINUIT TRENTE-QUATRE", plan: 1, words: 2, breath: 0.9, tag: "Crochet · heure précise + titre-question", voice: "Minuit trente-quatre.",
    note: "<b>Le titre et l'horloge sont lisibles dès la 1re image</b>, avant même la voix. Vue de dessus du canapé, le halo bleu froid du téléphone sur le visage (pas le néon de Listen). L'horloge avance par à-coups : 00:34 → 00:35 → 00:41.",
    seam: "même plan, la caméra recule d'un cran",
    build: (A, id) => ({ world: A.floorTop() + COUCH(A, { halo: 480 }) + A.bigClock("clk", 330, 450, ["00:34", "00:35", "00:41"]), hud: A.title("title", "LES NUITS BLANCHES · ÉPISODE 1", ["Pourquoi tu te couches", "toujours *trop tard* ?"], 300, { size: 78 }) + cap(id, "Minuit *trente-quatre.*") }) },
  { id: "f02", name: "PAS ENVIE D'Y ALLER", plan: 1, words: 16, tag: "Recadrage · insomnie → « pas envie »", voice: "C'est pas que t'arrives pas à dormir, le problème. C'est que t'as pas envie d'y aller.",
    note: "<b>La pastille « insomnie » se barre d'un trait ambre</b>, remplacée par « pas envie d'y aller ». Un chemin de points part des pieds vers le lit, hors cadre, et s'arrête avant d'y arriver.",
    seam: "continu",
    build: (A, id) => ({ world: A.floorTop() + COUCH(A, { halo: 480 }) + A.dots("path", [[470, 1190], [330, 1260], [190, 1300], [60, 1330]], { opacity: 0.55, gapEvery: 4 }) +
      A.pill("pIns", 250, 470, "insomnie", 470, 760) + strike(150, 350, 470) + A.pill("pEnv", 760, 560, "pas envie d'y aller", 610, 830, { dot: C.amber }) + A.pill("pLit", 170, 1215, "le lit", 60, 1330, { size: 34 }),
      hud: cap(id, "pas *envie* d'y aller.") }) },
  { id: "f03", name: "TROIS FOIS", plan: 1, words: 11, tag: "Détail vécu · identification", voice: "T'as posé ton téléphone trois fois, il est revenu trois fois.",
    note: "<b>Le téléphone est posé sur le sol, trois boucles de points le ramènent vers la main</b>, compteur « × 3 ». Le halo bleu revient à chaque boucle.",
    seam: "continu",
    build: (A, id) => ({ world: A.floorTop() + COUCH(A, { held: false }) +
      `<ellipse cx="880" cy="1090" rx="300" ry="300" fill="url(#${id}-gHalo)" opacity=".8"/><g transform="rotate(14 880 1090)"><rect x="835" y="1015" width="90" height="150" rx="16" fill="#0b0d1a"/><rect x="843" y="1023" width="74" height="134" rx="11" fill="#dcebff"/></g>` +
      [60, 130, 200].map((b, i) => A.dots(`ret${i}`, curve([850, 1050], [650, 880], b + 20), { step: 28, r: 7, color: COLD, opacity: 0.9 - i * 0.22 })).join("") + A.pill("pX3", 800, 840, "× 3", 880, 1040, { size: 44, w: 150 }),
      hud: cap(id, "revenu *trois fois.*") }) },
  { id: "f04", name: "UNE NÉGOCIATION", plan: 1, words: 16, breath: 0.9, tag: "Boucle ouverte · « tu la perds »", voice: "C'est pas de la fatigue, ça. C'est une négociation. Et tu la perds tous les soirs.",
    note: "<b>Score : TOI 0 – ÉCRAN 7.</b> Les trois points ambre du sommaire apparaissent en haut à droite, éteints : le spectateur voit qu'il y a une suite. Pas un mot de plus dans la voix.",
    seam: "volet jaune (couché → alarme)",
    build: (A, id) => ({ world: A.floorTop() + `<g opacity=".5">${COUCH(A, { halo: 420 })}</g>` +
      `<rect x="150" y="560" width="780" height="270" rx="48" fill="#0c0f2a" stroke="#fff" stroke-opacity=".14" stroke-width="3"/>` +
      `<text x="270" y="740" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="170" fill="${C.amber}">0</text><text x="270" y="618" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" letter-spacing="7" fill="${C.cream}" fill-opacity=".8">TOI</text>` +
      `<text x="540" y="725" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="100" fill="${C.cream}" fill-opacity=".6">–</text>` +
      `<text x="810" y="740" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="170" fill="${COLD}">7</text><text x="810" y="618" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" letter-spacing="7" fill="${C.cream}" fill-opacity=".8">ÉCRAN</text>`,
      hud: A.title("title", "TOUS LES SOIRS", ["Une *négociation*."], 330, { size: 96 }) + dots3(0, true) + cap(id, "tu la *perds* tous les soirs.") }) },
  { id: "f05", name: "UN · PAS D'HEURE DE COUCHER", plan: 2, words: 15, tag: "Astuce 1 · le contre-pied", voice: "Un. Arrête de décider de ton heure de coucher. Personne tient une heure de coucher.",
    note: "<b>Le « 1 » claque</b> (impact + onde de choc). Trois heures de coucher possibles défilent, barrées l'une après l'autre : 22:30, 23:00, 23:30. Un point ambre s'allume en haut à droite.",
    seam: "continu",
    build: (A, id) => ({ world: A.floorTop() + [["22:30", 640, 0.8], ["23:00", 830, 0.62], ["23:30", 1020, 0.46]].map(([t, y, o]) => `<g opacity="${o}">${A.bigClock("c" + t.slice(0, 2) + t.slice(3), 390, y, [t], { size: 100, w: 300, h: 140 })}${strike(370, 710, y + 70, 10)}</g>`).join("") + A.pill("pCou", 540, 570, "heure de coucher", 540, 640, { size: 38 }),
      hud: A.bigNum("n1", "1", "Pas d'heure de coucher.") + dots3(1) + cap(id, "heure de *coucher.*") }) },
  { id: "f06", name: "L'ALARME DE FIN", plan: 2, words: 23, tag: "Image-signature · l'alarme ambre", voice: "Décide de ton heure de fin. Celle où t'éteins, tu ranges, tu poses tout. Mets une alarme. Pas pour te lever. Pour t'arrêter.",
    note: "<b>L'alarme traverse l'écran en bande ambre</b> (cloche, « ALARME · 23:30 », « pour t'arrêter »). L'ambre = la décision : c'est la seule couleur chaude du film avant Listen, et aucun autre élément ambre ne ressemble à cette bande.",
    seam: "continu",
    build: (A, id) => ({ world: A.floorTop() + A.bigClock("clk", 310, 450, ["23:30"], { color: C.amber, size: 130, w: 460 }) + A.pill("pFin", 540, 745, "heure de fin", 540, 640, { dot: C.amber }) + A.alarmBand("al", { cy: 1010, rot: -7 }),
      hud: A.bigNum("n1", "1", "") + dots3(1) + cap(id, "Pour *t'arrêter.*") }) },
  { id: "f07", name: "ELLE SONNE. TU CONTINUES.", plan: 2, words: 7, breath: 0.9, tag: "Échec de l'astuce · boucle rouverte", voice: "Elle sonne. Tu l'éteins. Tu continues. Évidemment.",
    note: "<b>L'alarme est balayée hors cadre</b> d'un geste. L'horloge repasse en bleu froid : 23:52. Le halo du téléphone revient en bas. C'est ici que chaque astuce « rate », ce qui relance l'attention.",
    seam: "volet jaune (alarme → carte de la journée)",
    build: (A, id) => ({ world: A.floorTop() + `<ellipse cx="300" cy="1250" rx="420" ry="360" fill="url(#${id}-gHalo)" opacity=".8"/>` + A.bigClock("clk", 310, 450, ["23:52"], { size: 130, w: 460 }) + A.pill("pCont", 540, 745, "tu continues", 540, 640, { size: 38 }) +
      `<g opacity=".55">${A.alarmBand("al", { cx: 900, cy: 1010, rot: -24, sub: "éteinte" })}</g>`,
      hud: A.bigNum("n1", "1", "") + dots3(1) + cap(id, "Tu *continues.*") }) },
  { id: "f08", name: "PAS DIX MINUTES À TOI", plan: 3, words: 12, tag: "★ Le fait · la journée est pleine", voice: "Depuis sept heures ce matin, t'as pas eu dix minutes à toi.",
    note: "<b>La carte de la journée</b> : cadran 24 h en anneau, courbes de niveau comme l'étang de Catcharium. De 07:00 à 00:34, aucun trou. Le seul espace libre est la nuit, en pointillés : c'est ton sommeil que tu grignotes.",
    seam: "continu",
    build: (A, id) => { const [kx, ky] = A.hourPt(540, 950, 270, 0.57), [sx, sy] = A.hourPt(540, 950, 270, 7);
      return { world: A.bg() + A.dayMap("dm", 540, 950, 270) + `<text x="540" y="985" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="110" fill="${COLD}">00:34</text>` +
        `<circle cx="${kx}" cy="${ky}" r="24" fill="${C.amber}" filter="url(#${id}-fGlowS)"/>` + A.pill("pZero", 240, 640, "à toi : 0 min", kx, ky, { dot: C.amber, size: 38 }) + A.pill("p7h", 790, 1185, "07:00", sx, sy, { size: 36 }) + A.pill("pSomm", 880, 700, "sommeil", ...A.hourPt(540, 950, 270, 3.8), { size: 34 }),
        hud: A.title("title", "DEPUIS 7 H CE MATIN", ["Pas *dix minutes*", "à toi."], 270, { size: 86 }) + dots3(1) + cap(id, "dix *minutes* à toi.") }; } },
  { id: "f09", name: "DEUX · VINGT MINUTES, AVANT", plan: 3, words: 9, tag: "Astuce 2 · l'objet montré, pas dit", voice: "Deux. Alors prends-les avant. Vingt minutes, sans écran, décidées.",
    note: "<b>Vingt minutes sont découpées dans la soirée, en ambre</b> (à 22:10, bien avant l'heure de fin). Le téléphone est face contre table au centre. Les exemples (livre, carnet, disque) sont <b>à l'image seulement</b> : la liste parlée est coupée.",
    seam: "continu",
    build: (A, id) => { const [cx, cy] = A.hourPt(540, 750, 230, 22.27);
      return { world: A.bg() + A.dayMap("dm", 540, 750, 230, { carve: [22.1, 22.43] }) + `<g transform="rotate(8 540 750)"><rect x="505" y="695" width="70" height="116" rx="14" fill="#0b0d1a" stroke="#fff" stroke-opacity=".25" stroke-width="3"/></g>` +
        A.pill("pEcr", 160, 760, "sans écran", 505, 760, { size: 36 }) + A.pill("p20", 850, 520, "20 min", cx, cy, { dot: C.amber, size: 40 }) +
        A.book("bk", 260, 1175, 0.6) + A.notebook("nb", 540, 1175, 0.6) + A.record("rc", 820, 1175, 0.6),
        hud: A.bigNum("n2", "2", "Prends-les avant.") + dots3(2) + cap(id, "Vingt *minutes,* sans écran.", 1345) }; } },
  { id: "f10", name: "L'HEURE À LAQUELLE TU LE PRENDS", plan: 3, words: 18, breath: 0.9, tag: "★ Le fait, formulé", voice: "Le problème c'est pas que tu veuilles du temps pour toi. C'est l'heure à laquelle tu le prends.",
    note: "<b>Le fait contre-intuitif, en une image</b> : le même besoin de temps, mais à 00:34 (barré, bleu froid) ou à 22:10 (ambre). Un arc de points ambre fait « glisser » le temps à toi vers l'avant. Titre en serif, mot-clé ambre.",
    seam: "volet jaune (carte → lit)",
    build: (A, id) => { const pts = []; for (let h = 24.57; h >= 22.1; h -= 0.1) pts.push(A.hourPt(540, 1040, 360, h)); const [kx, ky] = A.hourPt(540, 1040, 250, 0.57), [ax, ay] = A.hourPt(540, 1040, 250, 22.27);
      return { world: A.bg() + A.dayMap("dm", 540, 1040, 250, { carve: [22.1, 22.43] }) + A.dots("slide", pts, { step: 26, r: 7, color: C.amber }) +
        `<circle cx="${kx}" cy="${ky}" r="22" fill="#9cc8ff" opacity=".9"/>` + A.pill("pNuit", 880, 1000, "00:34", kx, ky, { size: 36 }) + strike(805, 955, 1000, 7) + A.pill("pSoir", 190, 760, "22:10", ax, ay, { dot: C.amber, size: 40 }),
        hud: A.title("title", "LE PROBLÈME, CE N'EST PAS ÇA", ["C'est *l'heure*", "à laquelle tu le prends."], 270, { size: 72 }) + dots3(2) + cap(id, "l'heure à laquelle *tu le prends.*", 1470) }; } },
  { id: "f11", name: "COUCHÉ. À L'HEURE.", plan: 4, words: 12, tag: "Récompense · enfin à l'heure", voice: "Là t'es couché. À l'heure. Pour la première fois depuis des mois.",
    note: "<b>Le lit vu de dessus, enfin occupé</b> : miroir du canapé du début. Horloge 23:32, téléphone face contre table. Une pastille « à l'heure » ambre. C'est la récompense avant la dernière astuce.",
    seam: "continu",
    build: (A, id) => ({ world: A.floorTop() + BED(A, { clock: ["23:32"] }) + A.pill("pOk", 830, 600, "à l'heure", 700, 790, { dot: C.amber }) + A.pill("p1", 800, 470, "1ʳᵉ fois depuis des mois", 700, 640, { size: 32 }),
      hud: dots3(2) + cap(id, "Là t'es *couché.*"), closed: true }) },
  { id: "f12", name: "UN SILENCE PAS POSSIBLE", plan: 4, words: 11, breath: 0.9, tag: "Tension relancée · le vide à combler", voice: "Et ta chambre se met à faire un silence pas possible.",
    note: "<b>Les yeux se rouvrent.</b> Une ligne de points, parfaitement droite et immobile, traverse la chambre : le silence. C'est la dernière fois qu'on voit cette ligne plate. Elle prépare le produit (le fond sonore).",
    seam: "volet jaune (silence → téléphone)",
    build: (A, id) => ({ world: A.floorTop() + BED(A, { clock: ["23:48"] }) + A.dots("flat", [[40, 1130], [1040, 1130]], { step: 30, r: 5, opacity: 0.5 }) + A.pill("pSil", 840, 1010, "silence", 760, 1130, { size: 40 }),
      hud: dots3(2) + cap(id, "un *silence* pas possible.") }) },
  { id: "f13", name: "TROIS · LISTEN", plan: 5, words: 15, tag: "Produit en soulagement", voice: "Trois. Mets un fond sonore. Sur l'app Listen, c'est des endroits réels, enregistrés sur place.",
    note: "<b>Premier néon du film</b> : zoom dans l'écran de Listen (interface reconstruite d'après tes captures), piste « Terrasse de café » (<b>nom à confirmer dans l'app</b>). Pastille « enregistré sur place » : c'est l'argument réel de l'app.",
    seam: "dézoom hors du téléphone",
    build: (A, id) => ({ world: A.bg() + `<ellipse cx="540" cy="890" rx="460" ry="620" fill="${C.violet}" opacity=".2" filter="url(#${id}-fBlurL)"/>` + A.phoneUI(270, 410, 460, { track: "Terrasse de café", sub: "Enregistré sur place", section: "URBAIN" }) + A.pill("pRec", 540, 1417, "endroit réel", 540, 1304, { size: 34, dot: C.cyan }),
      hud: A.bigNum("n3", "3", "Un fond sonore.") + dots3(3) + cap(id, "enregistrés *sur place.*", 1520) }) },
  { id: "f14", name: "ET LAISSE TOURNER", plan: 5, words: 8, breath: 0.9, tag: "Résolution · la chambre se remplit", voice: "Prends une terrasse de café, et laisse tourner.",
    note: "<b>Le téléphone est face contre table, écran éteint</b> (cohérent avec « sans écran », et avec le mode « Fermez les yeux » de l'app). Des arcs de points chauds, ambre doux, remplissent la chambre à la place de la ligne plate.",
    seam: "volet jaune (silence comblé → question)",
    build: (A, id) => ({ world: A.floorTop() + `<ellipse cx="300" cy="900" rx="700" ry="520" fill="url(#${id}-gWarm)" opacity=".7"/>` + BED(A, { clock: ["23:49"] }) + A.warmDots("w", 140, 815, 4) + A.pill("pCafe", 810, 560, "terrasse de café", 560, 760, { dot: "#ffd28a", size: 36 }),
      hud: dots3(3) + cap(id, "et laisse *tourner.*"), closed: true }) },
  { id: "f15", name: "ET TOI ?", plan: 6, words: 10, tag: "Question = commentaire", voice: "Et toi ? C'est quoi ton heure de fin ?",
    note: "<b>Retour au cadre d'ouverture, dans l'autre sens</b> : le canapé du début devient le lit occupé. La question porte sur « l'heure de fin », notion propre à cet épisode, donc plus facile à commenter que « tes astuces ». Signature Listen en bas.",
    seam: "fin (cadre qui boucle vers le début)",
    build: (A, id) => ({ world: A.floorTop() + BED(A, { clock: ["23:50"] }) + A.pill("pCom", 540, 410, "dis-le en commentaire ↓", undefined, undefined, { size: 34 }),
      hud: A.title("title", "LES NUITS BLANCHES · ÉPISODE 1", ["Et *toi* ?"], 300) + dots3(3) + cap(id, "C'est quoi ton *heure de fin* ?", 1240) +
        `<g><rect x="140" y="1330" width="720" height="150" rx="40" fill="#0b0d1a" fill-opacity=".88" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>${A.listenIcon(170, 1350, 110)}<text x="310" y="1405" font-family="Poppins" font-weight="700" font-size="44" fill="#fff">Listen</text><text x="310" y="1450" font-family="Poppins" font-weight="400" font-size="27" fill="#b8bdd6">Sounds of the World · App Store</text></g>`, closed: true }) },
];

// ---------- minutage estimé (cadence de la voix de l'épisode 3 : 0,348 s par mot) ----------
let t = 0.1;
for (const f of F) { f.t0 = t; t += f.words * 0.348; f.t1 = t; t += (f.breath || 0.15); }
const total = t + 1.2;
const fmt = (x) => x.toFixed(1).replace(".", ",");
const totalWords = F.reduce((a, f) => a + f.words, 0);

const cell = (f) => {
  const A = L.art(f.id + "-");
  const b = f.build(A, f.id);
  const svg = render(f.id, b.world, b.hud, { closed: b.closed });
  return `<article class="cell" id="frame-${f.id.slice(1)}">
  <div class="frame">${svg}<svg class="safe" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><g opacity=".6" fill="none" stroke="#ff6b6b" stroke-width="3" stroke-dasharray="14 10"><rect x="920" y="780" width="150" height="740"/><rect x="0" y="1530" width="1080" height="390"/><rect x="0" y="0" width="1080" height="150"/></g></svg></div>
  <div class="label"><span>${f.id.slice(1)} · ${f.name}</span><span>≈ ${fmt(f.t0)}–${fmt(f.t1)} s</span></div>
  <p class="voice">« ${f.voice} »</p>
  <p class="note">${f.note}</p>
  <div class="chips"><span class="chip">→ ${f.seam}</span><span class="chip tag">${f.tag}</span></div>
</article>`;
};

const retention = `<article class="cell meta"><h3>Rétention</h3><ol class="seams">
<li><b>0–3 s</b> titre-question + heure précise + halo : une image qui se lit sans le son.</li>
<li><b>≈ 5 s</b> premier recadrage (« pas envie d'y aller ») : l'idée forte arrive avant la 1ʳᵉ astuce.</li>
<li><b>Points ambre</b> en haut à droite : le spectateur voit où il en est (0/3 → 3/3), sans qu'on le dise.</li>
<li><b>Chaque astuce échoue</b> (alarme balayée, silence) : une petite boucle ouverte tous les ≈ 15 s.</li>
<li><b>Deux images-clés</b> portent le fait : la carte pleine (08) et le glissement de l'heure (10).</li>
<li><b>Le produit</b> arrive en soulagement du silence (≈ ${Math.round((F[12].t0 / total) * 100)} % du film), pas en annonce.</li>
<li><b>Boucle</b> : le dernier cadre répond au premier (canapé → lit).</li></ol>
<p class="note"><b>Pas mesuré.</b> Ce sont des principes courants, pas des données sur ta vidéo. Seules les statistiques de TikTok diront si ça tient.</p></article>`;
const plans = ["canapé", "horloge · alarme", "carte de la journée", "lit", "téléphone Listen", "fin"];
const seamMap = `<article class="cell meta"><h3>6 plans · 5 volets</h3><ol class="seams">${plans.map((p, i) => `<li><b>Plan ${i + 1}</b> ${p} <span class="dim">(croquis ${F.filter((f) => f.plan === i + 1).map((f) => f.id.slice(1)).join(", ")})</span></li>`).join("")}</ol>
<p class="note"><b>Règle de couleur.</b> Bleu froid = l'écran (le problème) · ambre = la décision (alarme, heure de fin, volets) · néon = Listen, uniquement à partir du croquis 13. Le halo du téléphone n'a jamais le dégradé néon.</p>
<p class="note"><b>Volet jaune</b> (comme l'épisode 3) à chaque changement de plan, posé dans une respiration de la voix. L'alarme, elle, a une cloche et un texte : on ne peut pas la confondre avec un volet.</p></article>`;
const tokens = `<article class="cell meta"><h3>Tokens</h3><div class="sw">${[["nuit", C.night0], ["nuit 2", C.night1], ["bleu écran", COLD], ["ambre", C.amber], ["crème", C.cream], ["néon (13→15)", "linear-gradient(135deg,#3BD6F5,#7B5CFF,#E04FD8)"]].map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join("")}</div>
<p class="type"><span style="font-family:Fraunces;font-style:italic;font-weight:700;font-size:28px">Fraunces Italic</span> titres · <span style="font-family:Nunito;font-weight:900">Nunito 900</span> sous-titres · <span style="font-family:Poppins;font-weight:600">Poppins</span> UI Listen</p>
<p class="note"><b>Interdits repris de l'épisode 3</b> : pas de pulsations de caméra sans raison, pas de diaporama, pas de bruitage de pluie, pas de néon avant l'app. <b>Pointillés rouges</b> = zones masquées par TikTok.</p></article>`;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Listen — Nuits blanches ép. 1 · storyboard ${VERSION}</title>
<style>
@font-face{font-family:Fraunces;font-style:italic;font-weight:500;src:${font("Fraunces-Italic-500.woff2")} format("woff2")}
@font-face{font-family:Fraunces;font-style:italic;font-weight:700;src:${font("Fraunces-Italic-700.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:700;src:${font("Nunito-700.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:800;src:${font("Nunito-800.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:900;src:${font("Nunito-900.woff2")} format("woff2")}
@font-face{font-family:Poppins;font-weight:400;src:${font("Poppins-400.woff2")} format("woff2")}
@font-face{font-family:Poppins;font-weight:600;src:${font("Poppins-600.woff2")} format("woff2")}
@font-face{font-family:Poppins;font-weight:700;src:${font("Poppins-700.woff2")} format("woff2")}
*{box-sizing:border-box;margin:0}
body{background:#0c0e1f;color:${C.cream};font-family:Nunito,system-ui,sans-serif;padding:40px 32px 80px}
header{max-width:1500px;margin:0 auto 32px;display:flex;flex-wrap:wrap;align-items:baseline;gap:16px 24px}
header h1{font-family:Fraunces;font-style:italic;font-weight:700;font-size:44px}
header h1 em{color:${C.amber};font-style:italic}
header p{opacity:.8;font-size:17px;flex:1 1 420px}
.tag{border:1px solid #ffffff33;border-radius:99px;padding:6px 14px;font-weight:800;font-size:14px;letter-spacing:.06em}
.toggle{font-size:14px;opacity:.85;cursor:pointer}
main{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:28px}
.cell{display:flex;flex-direction:column;gap:8px}
.frame{position:relative;aspect-ratio:9/16;border-radius:14px;overflow:hidden;background:${C.night0};box-shadow:0 10px 30px #0008}
.frame>.ls-stage,.frame .safe{position:absolute;inset:0;width:100%;height:100%}
.ls-stage{overflow:hidden;background:${C.night0}}.ls-tilt{position:absolute;inset:0}.ls-stage svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.frame .safe{pointer-events:none}
.label{display:flex;justify-content:space-between;font-weight:900;font-size:13px;letter-spacing:.06em;opacity:.9}
.voice{font-size:13.5px;line-height:1.4;font-style:italic;opacity:.7}
.note{font-size:14px;line-height:1.45;opacity:.88}.note b{color:${C.amber}}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{font-size:12px;font-weight:800;border-radius:99px;padding:4px 10px;background:#ffffff14}
.chip.tag{background:#f5b85a22;color:${C.amber}}
.meta{background:#ffffff08;border:1px solid #ffffff14;border-radius:14px;padding:18px}
.meta h3{font-family:Fraunces;font-style:italic;font-size:26px;margin-bottom:10px}
.seams{font-size:13.5px;line-height:1.55;padding-left:18px;margin-bottom:10px}.seams .dim{opacity:.55}
.sw{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px}.sw span{display:flex;align-items:center;gap:6px;font-size:13px}
.sw i{width:22px;height:22px;border-radius:6px;display:inline-block;border:1px solid #fff3}
.type{font-size:14px;margin-bottom:10px;line-height:1.6}
#hide:checked ~ main .safe{display:none}
</style></head><body>
<input type="checkbox" id="hide" hidden>
<header><h1>Listen — <em>Nuits blanches</em>, ép. 1 · ${VERSION}</h1>
<p>« Pourquoi tu te couches toujours trop tard ». Croquis statiques (aucune animation) : cadrage, hiérarchie et textes à valider. Version du script <b>B</b> : ${totalWords} mots, sans la liste de l'astuce 2 (les objets sont montrés, pas dits). Durées estimées à la cadence de la voix de l'épisode 3 ; ta voix fera foi.</p>
<span class="tag">1080×1920 · ≈ ${Math.round(total)} s · ${F.length} croquis · 6 plans</span>
<label class="toggle" for="hide">☐ masquer les zones TikTok</label></header>
<main>${F.map(cell).join("\n")}${seamMap}${retention}${tokens}</main>
</body></html>`;

writeFileSync(new URL("../storyboard.html", import.meta.url), html);
console.log("storyboard.html écrit —", F.length, "croquis,", totalWords, "mots, ≈", fmt(total), "s");
console.log(F.map((f) => `${f.id} ${fmt(f.t0)}-${fmt(f.t1)}`).join(" | "));
