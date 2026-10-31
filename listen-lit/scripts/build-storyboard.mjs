// Génère storyboard.html — « Les nuits blanches · épisode 2 » (croquis statiques 9:16, aucune animation).
// Réutilise le kit de l'épisode 3 (kit/kit.js) : même personnage, même lit, mêmes pastilles.   node scripts/build-storyboard.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
global.window = {};
global.gsap = { set() {} };
require("../kit/kit.js");
const L = window.LS, C = L.C, COLD = "#9cc8ff";
const VERSION = "v1";
const AMB = C.amber, WARM = "#ffd28a";
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
const CH = (A, o = {}) => `<g transform="translate(-177 260) scale(0.8)">${A.couchTop(o)}</g>`;
const TBL = (A) => A.sideTable("tbl", 740, 860, 420, 600);
const SEC = (A, o = {}) => A.bedSection(o);
const BED = (A, o = {}) => `<g transform="translate(-170 -170) scale(1.32)">${A.bedTop(o)}</g>`;

function render(id, world, hud, fx = {}) {
  const root = { innerHTML: "", querySelector: () => null, querySelectorAll: () => [] };
  L.stage(root, id, world, hud);
  let svg = root.innerHTML.replace(/<rect id="[^"]*-lid[LR]"[^>]*\/>/g, "").replace(/<rect id="[^"]*-screenOff"[^>]*\/>/g, "").replace(/<circle id="[^"]*-(seed|ring)"[^>]*\/>/g, "");
  if (fx.closed) svg = svg.replace(new RegExp(`<g id="${id}-([A-Za-z]*[eE]yes)-open"`, "g"), `<g id="${id}-$1-open" opacity="0"`).replace(new RegExp(`<g id="${id}-([A-Za-z]*[eE]yes)-shut" opacity="0"`, "g"), `<g id="${id}-$1-shut" opacity="1"`);
  return svg;
}

// ---------- les 17 croquis ----------
// words = mots de la voix (script complet) ; breath = respiration (s) ajoutée APRÈS le croquis
const dots = dots3;
const F = [
  { id: "f01", name: "VINGT-TROIS HEURES DIX", plan: 1, words: 4, breath: 0.8, tag: "Crochet · le lit est un personnage", voice: "Vingt-trois heures dix.",
    note: "<b>Le lit en coupe, vu de côté, en strates</b> (sommier, matelas, couette) ; la tête de lit a des yeux : <b>c'est lui, le personnage</b> (le ressort de l'épisode). Titre + heure dès la 1re image. Il est vide, il attend.",
    seam: "même plan, les objets arrivent",
    build: (A, id) => ({ world: A.bg() + A.bedSection() + A.bigClock("clk", 400, 520, ["23:10"], { size: 92, w: 280, h: 118 }), hud: A.title("title", "LES NUITS BLANCHES · ÉPISODE 2", ["Pourquoi ton lit", "ne te fait *plus dormir*"], 290, { size: 78, x: 540 }) + cap(id, "Vingt-trois *heures dix.*", 1360) }) },
  { id: "f02", name: "C'EST PAS LUI QUI A COMMENCÉ", plan: 1, words: 15, tag: "Recadrage · « le problème » est barré", voice: "C'est pas ton lit, le problème. Enfin si. Mais c'est pas lui qui a commencé.",
    note: "<b>« le problème » est barré, puis « enfin si »</b>, puis « pas lui qui a commencé » : le spectateur comprend qu'on va accuser quelqu'un d'autre. Les yeux de la tête de lit se tournent vers le spectateur (innocent).",
    seam: "continu",
    build: (A, id) => ({ world: A.bg() + A.bedSection() + A.pill("pPb", 330, 520, "le problème", 120, 800, { size: 40 }) + `<line x1="228" y1="520" x2="432" y2="520" stroke="${AMB}" stroke-width="9" stroke-linecap="round"/>` +
      A.pill("pSi", 800, 560, "enfin si", 640, 940, { size: 40 }) + A.pill("pLui", 700, 400, "pas lui qui a commencé", 330, 940, { size: 36, dot: AMB }),
      hud: cap(id, "c'est pas lui qui a *commencé.*", 1360) }) },
  { id: "f03", name: "TU BOSSES, TU MANGES, TU REGARDES", plan: 1, words: 12, tag: "Détail vécu · les strates se remplissent", voice: "Tu bosses dedans, tu manges dedans, tu regardes trois heures de vidéos dedans.",
    note: "<b>Les objets tombent un par un dans le lit</b> : l'ordinateur (bosser), l'assiette (manger), le téléphone (trois heures de vidéos). Chacun a sa pastille ; le lit encaisse, les yeux se plissent.",
    seam: "continu",
    build: (A, id) => ({ world: A.bg() + A.bedSection() + A.laptopObj("lap", 470, 930) + A.plateObj("plt", 690, 930) + A.phoneObj("phn", 840, 930) +
      A.pill("pBos", 400, 470, "bosser", 470, 790, { size: 38 }) + A.pill("pMan", 700, 560, "manger", 690, 880, { size: 38 }) + A.pill("p3h", 860, 400, "3 h de vidéos", 850, 790, { size: 38, dot: COLD }),
      hud: cap(id, "tu regardes *trois heures* de vidéos", 1360) }) },
  { id: "f04", name: "IL REFUSE", plan: 1, words: 15, breath: 0.9, tag: "Boucle ouverte · le lit démissionne", voice: "Et le soir, tu lui demandes de redevenir un lit. Tout de suite. Il refuse.",
    note: "<b>Une lettre de démission est posée sur l'oreiller</b> ; les yeux du lit sont fermés (« il refuse »). Le lit est encore sous la pile d'objets : la tension du film est posée : « est-ce que je récupère mon lit ? ».",
    seam: "volet jaune (démission → règle)",
    build: (A, id) => ({ world: A.bg() + A.bedSection() + A.laptopObj("lap", 520, 930, 0.9) + A.plateObj("plt", 700, 930, 0.9) + A.phoneObj("phn", 840, 930, 0.9) + A.letter("ltr", 250, 830, 0.7) +
      A.pill("pRef", 520, 470, "il refuse", 140, 800, { size: 44, dot: AMB }) + A.pill("pLit", 760, 600, "redevenir un lit", 540, 930, { size: 36 }),
      hud: cap(id, "Il *refuse.*", 1360), closed: true }) },
  { id: "f05", name: "UN · DEUX CHOSES", plan: 2, words: 15, tag: "Astuce 1 · le lit se vide", voice: "Un. Ton lit sert à deux choses. Dormir, et ce que tu sais. C'est tout.",
    note: "<b>Le « 1 » claque</b>. Le lit est enfin vide, les yeux rouverts. Deux pastilles seulement : « dormir » et « ce que tu sais » (clin d'œil, jamais dit). Le premier point ambre s'allume.",
    seam: "continu",
    build: (A, id) => ({ world: A.bg() + A.bedSection() + A.pill("pDor", 420, 560, "dormir", 420, 930, { size: 44, dot: AMB }) + A.pill("pSais", 760, 640, "et ce que tu sais", 760, 930, { size: 40 }),
      hud: A.bigNum("n1", "1", "Ton lit sert à deux choses.") + dots(1) + cap(id, "dormir, et ce que *tu sais.*", 1360) }) },
  { id: "f06", name: "PAS DE MAILS, PAS DE DOSSIERS", plan: 2, words: 9, tag: "La règle · les objets sortent", voice: "Pas de mails, pas de dossiers, pas de scroll.",
    note: "<b>Les objets sont expulsés du lit un par un</b> et atterrissent par terre à droite : l'ordinateur (mails), une pile (dossiers), le téléphone (scroll). Chaque mot est barré en ambre à son tour.",
    seam: "continu",
    build: (A, id) => ({ world: A.bg() + A.bedSection() + A.laptopObj("lap", 800, 1128, 0.7) + A.phoneObj("phn", 990, 1128, 0.7) +
      `<g transform="translate(600 1128)"><ellipse cx="0" cy="4" rx="90" ry="10" fill="#000" opacity=".3"/>${[0, 1, 2, 3].map((i) => `<rect x="${-80 + i * 3}" y="${-24 - i * 22}" width="160" height="20" rx="4" fill="${i % 2 ? "#cfc8bb" : "#e6dfd2"}"/>`).join("")}</g>` +
      A.dots("exp", curve([470, 900], [780, 1020], 120), { step: 26, r: 6, color: "#fff", opacity: 0.6 }) +
      A.pill("pMa", 300, 500, "mails", 800, 1020, { size: 38 }) + A.pill("pDo", 560, 400, "dossiers", 600, 1060, { size: 38 }) + A.pill("pSc", 820, 520, "scroll", 990, 1030, { size: 38 }),
      hud: A.bigNum("n1", "1", "") + dots(1) + cap(id, "pas de mails, pas de *scroll.*", 1360) }) },
  { id: "f07", name: "MÊME À UN MÈTRE", plan: 2, words: 19, tag: "★ L'idée centrale · le lit c'est la nuit", voice: "Même dans vingt mètres carrés : le lit c'est la nuit, le reste se passe ailleurs. Même à un mètre.",
    note: "<b>Plan du studio de 20 m² vu de dessus</b> : la zone du lit est cerclée d'ambre (pointillés), le bureau est à l'autre bout. Une cote mesure <b>un mètre</b> entre la zone et le reste : « même à un mètre ». Aucune pièce de plus n'est nécessaire.",
    seam: "volet jaune (règle → plafond)",
    build: (A, id) => ({ world: A.bg() + A.studioPlan() + `<line x1="400" y1="1080" x2="700" y2="1080" stroke="#fff" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/><line x1="400" y1="1062" x2="400" y2="1098" stroke="#fff" stroke-width="4"/><line x1="700" y1="1062" x2="700" y2="1098" stroke="#fff" stroke-width="4"/>` +
      A.pill("pNuit", 270, 450, "le lit : la nuit", 260, 640, { dot: AMB, size: 40 }) + A.pill("pAil", 800, 430, "le reste : ailleurs", 820, 1130, { size: 40 }) + A.pill("p1m", 550, 1190, "1 m", 550, 1080, { size: 40, w: 150 }),
      hud: A.bigNum("n1", "1", "") + dots(1) + cap(id, "Même à *un mètre.*", 1400) }) },
  { id: "f08", name: "TU CONNAIS TON PLAFOND", plan: 2, words: 19, breath: 0.9, tag: "Échec de l'astuce · boucle rouverte", voice: "Bon. Ce soir tu t'y couches juste pour dormir. Vingt minutes. Trente. Tu connais ton plafond par cœur, maintenant.",
    note: "<b>Vue depuis le lit : le plafond</b>, avec sa lampe et ses fissures en points reliés (« par cœur »). Deux yeux grands ouverts en bas du cadre. Les compteurs 20 min puis 30 min : c'est ici que l'astuce 1 « rate », ce qui appelle l'astuce 2.",
    seam: "volet jaune (plafond → sors)",
    build: (A, id) => ({ world: A.bg() + A.ceilingView() + A.upEyes(540, 1420, 44) + A.pill("p20", 270, 1330, "20 min", 270, 1260, { size: 40 }) + A.pill("p30", 800, 1330, "30 min", 790, 1260, { size: 40, dot: AMB }) + A.pill("pPla", 760, 560, "connu par cœur", 610, 920, { size: 38 }),
      hud: A.bigNum("n1", "1", "") + dots(1) + cap(id, "tu connais ton *plafond* par cœur", 1560) }) },
  { id: "f09", name: "DEUX · SORS DE TON LIT", plan: 3, words: 8, tag: "★ Astuce 2 · le contre-pied", voice: "Deux. Pour dormir, sors de ton lit. Oui.",
    note: "<b>Le « 2 » claque</b>. Le lit vu de dessus, couette rabattue en biais : on vient de se lever. Le mannequin est debout à côté, un chemin de points ambre le mène hors du cadre. Le lit reste en place, intact.",
    seam: "continu",
    build: (A, id) => ({ world: A.floorTop() + A.rug(540, 1060, 860, 1000) + A.bedPlain(190, 640, 330, 560, { open: true }) + A.personTop("pp", 760, 1000, 0.9) + A.dots("go", [[640, 960], [740, 1080], [840, 1190], [900, 1300]], { step: 30, r: 7, color: AMB, opacity: 0.9 }) + A.pill("pSors", 760, 760, "sors", 760, 930, { size: 44, dot: AMB }),
      hud: A.bigNum("n2", "2", "Sors de ton lit.") + dots(2) + cap(id, "pour dormir, *sors* de ton lit.", 1400) }) },
  { id: "f10", name: "UNE AUTRE PIÈCE", plan: 3, words: 15, tag: "Le détail utile · lumière faible", voice: "Si ça vient pas, lève-toi, va dans une autre pièce, lumière faible, un truc ennuyeux.",
    note: "<b>Le mannequin traverse le couloir</b>, vu de dessus ; seule une lampe basse éclaire le salon, où l'attend <b>un mode d'emploi</b> (« un truc ennuyeux »). Sa silhouette projette une ombre allongée : c'est elle que la lampe du salon reprendra (croquis 12).",
    seam: "continu",
    build: (A, id) => ({ world: A.floorTop() + `<rect x="110" y="400" width="860" height="360" rx="22" fill="#1c2150" opacity=".9"/>` + A.bedPlain(160, 440, 230, 280, { id: "bpS" }) + `<rect x="440" y="760" width="200" height="320" fill="#161a40"/>` + `<rect x="110" y="1080" width="860" height="420" rx="22" fill="#232a63" opacity=".9"/>` +
      A.dots("walk", [[330, 700], [430, 790], [540, 900], [540, 1060], [640, 1180], [760, 1260]], { step: 30, r: 7, color: AMB, opacity: 0.9 }) + A.personTop("pp", 540, 930, 0.7) +
      `<ellipse cx="560" cy="1100" rx="48" ry="130" fill="#000" opacity=".28" transform="rotate(14 560 1100)"/>` + A.bookTitled("bk", 790, 1310, 0.7, "(lecture facile)") + `<ellipse cx="300" cy="1250" rx="230" ry="150" fill="url(#${id}-gWarm)" opacity=".5"/>` +
      A.pill("pAut", 640, 520, "une autre pièce", 540, 880, { size: 38 }) + A.pill("pLum", 270, 1000, "lumière faible", 300, 1230, { size: 36 }) + A.pill("pEnn", 800, 1100, "un truc ennuyeux", 790, 1260, { size: 36, dot: AMB }),
      hud: dots(2) + cap(id, "un truc *ennuyeux.*", 1560) }) },
  { id: "f11", name: "L'ENDROIT OÙ TU PERDS", plan: 3, words: 15, breath: 0.9, tag: "Boucle · le lit récupère", voice: "Tu reviens quand le sommeil revient. Ton lit doit plus être l'endroit où tu perds.",
    note: "<b>Le lit refait, vu de dessus, en plan large</b> : propre, vide, en attente. La pastille « tu perds » est barrée en ambre. Le lit n'est plus le lieu de la défaite (écho de « tu la perds tous les soirs » de l'épisode 1).",
    seam: "volet jaune (lit → salon)",
    build: (A, id) => ({ world: A.floorTop() + A.rug(540, 1010, 860, 1000) + A.bedPlain(300, 560, 480, 760) + A.pill("pRev", 270, 460, "quand le sommeil revient", 360, 720, { size: 36 }) + A.pill("pPer", 800, 520, "tu perds", 760, 760, { size: 42 }) + `<line x1="695" y1="520" x2="905" y2="520" stroke="${AMB}" stroke-width="9" stroke-linecap="round"/>`,
      hud: dots(2) + cap(id, "plus l'endroit où tu *perds.*", 1500) }) },
  { id: "f12", name: "DEUX HEURES DU MAT'", plan: 4, words: 8, tag: "L'image-signature · la lampe qui reprend la silhouette", voice: "Deux heures du mat'. T'es debout dans ton salon.",
    note: "<b>La lampe du salon a l'abat-jour en forme de tête et d'épaules</b> : elle reprend la silhouette du personnage vue dans le couloir. Le mannequin est debout au milieu de la pièce, horloge 02:00 au-dessus. Lumière chaude et faible (la même que « lumière faible »).",
    seam: "continu",
    build: (A, id) => ({ world: A.floorTop() + A.rug(540, 1100, 780, 760) + `<rect x="150" y="1260" width="400" height="170" rx="40" fill="#3b3666"/><rect x="150" y="1260" width="400" height="60" rx="30" fill="#4a4480"/>` + A.plant(880, 1330, 70) + A.headLamp("lamp", 810, 860, 1) + A.personTop("pp", 440, 960, 1) + A.bigClock("clk", 400, 470, ["02:00"], { size: 92, w: 280, h: 118 }),
      hud: dots(2) + cap(id, "t'es debout dans ton *salon.*", 1560) }) },
  { id: "f13", name: "PLUS SILENCIEUX QU'UNE CHAMBRE", plan: 4, words: 16, breath: 0.9, tag: "Tension · le vide à combler", voice: "Et un salon vide à deux heures du mat', c'est encore plus silencieux qu'une chambre.",
    note: "<b>La ligne de points plate traverse le salon</b> (le même motif de silence que l'épisode 1). Le mannequin a les yeux ouverts, la lampe tient. Le silence est ici plus fort que celui de la chambre : le besoin d'une ambiance se crée.",
    seam: "volet jaune (silence → Listen)",
    build: (A, id) => ({ world: A.floorTop() + A.rug(540, 1100, 780, 760) + `<rect x="150" y="1260" width="400" height="170" rx="40" fill="#3b3666"/><rect x="150" y="1260" width="400" height="60" rx="30" fill="#4a4480"/>` + A.plant(880, 1330, 70) + A.headLamp("lamp", 810, 860, 0.9) + A.personTop("pp", 440, 960, 1) + A.dots("flat", [[40, 1130], [1040, 1130]], { step: 30, r: 5, opacity: 0.5 }) + A.pill("pSil", 800, 1030, "silence", 740, 1130, { size: 40 }) + A.bigClock("clk", 400, 470, ["02:00"], { size: 92, w: 280, h: 118 }),
      hud: dots(2) + cap(id, "c'est encore plus *silencieux.*", 1560) }) },
  { id: "f14", name: "TROIS · UNE AMBIANCE", plan: 5, words: 11, tag: "Produit en soulagement", voice: "Trois. Mets une ambiance. Sur l'app Listen, une pluie, une forêt.",
    note: "<b>Premier néon du film</b> : zoom dans l'écran de Listen (interface reconstruite d'après tes captures), deux pistes visibles : <b>pluie</b> et <b>forêt</b> (<b>noms à confirmer dans l'app</b>). Le script ne dit pas « enregistré sur place » cette fois : pas de pastille de promesse.",
    seam: "dézoom hors du téléphone",
    build: (A, id) => ({ world: A.bg() + `<ellipse cx="540" cy="890" rx="460" ry="620" fill="${C.violet}" opacity=".2" filter="url(#${id}-fBlurL)"/>` + A.phoneUI(270, 410, 460, { track: "Pluie", sub: "Sons de l'eau", section: "AMBIANCES" }) + A.pill("pFor", 540, 1417, "pluie · forêt", 540, 1304, { size: 36, dot: C.cyan }),
      hud: A.bigNum("n3", "3", "Une ambiance.") + dots(3) + cap(id, "sur l'app *Listen,* une pluie, une forêt.", 1520) }) },
  { id: "f15", name: "PLUS RIEN À SURVEILLER", plan: 5, words: 13, breath: 0.9, tag: "Résolution · la pièce se remplit", voice: "Un truc assez constant pour que ta tête ait plus rien à surveiller.",
    note: "<b>Le téléphone est posé face contre table sur le canapé</b>, écran éteint (« sans écran » de l'épisode 1). Des arcs de points chauds sortent de lui et remplissent le salon ; le mannequin s'est assis, les yeux se ferment. La pastille « rien à surveiller » est plus petite que les autres : le cerveau lâche.",
    seam: "volet jaune (salon → lit)",
    build: (A, id) => ({ world: A.floorTop() + A.rug(540, 1100, 780, 760) + `<ellipse cx="400" cy="1000" rx="650" ry="500" fill="url(#${id}-gWarm)" opacity=".7"/><rect x="150" y="1180" width="400" height="190" rx="40" fill="#3b3666"/><rect x="150" y="1180" width="400" height="60" rx="30" fill="#4a4480"/>` + A.plant(900, 1330, 66) + A.headLamp("lamp", 820, 800, 0.8) + A.personTop("pp", 380, 1090, 1) + `<g transform="rotate(10 520 1250)"><rect x="480" y="1190" width="70" height="116" rx="14" fill="#0b0d1a" stroke="#fff" stroke-opacity=".25" stroke-width="3"/></g>` + A.warmDots("w", 520, 1250, 3, 140, 90) + A.pill("pRien", 760, 480, "rien à surveiller", 400, 1030, { size: 34, dot: WARM }),
      hud: dots(3) + cap(id, "ta tête ait *plus rien* à surveiller", 1560), closed: true }) },
  { id: "f16", name: "SON MÉTIER", plan: 6, words: 10, tag: "★ Le ressort se résout · la chute", voice: "Tu retournes te coucher. Ton lit a retrouvé son métier.",
    note: "<b>Retour au plan du début, en coupe</b> : le même lit, vide d'objets, avec un dormeur dedans. La tête de lit a les yeux fermés, un badge « LIT · métier : dormir » est accroché à la tête de lit. C'est la réponse à la question « est-ce que je récupère mon lit ? ».",
    seam: "continu",
    build: (A, id) => ({ world: A.bg() + A.bedSection() + A.sleeperSec() + A.pill("pMet", 480, 520, "LIT · métier : dormir", 120, 800, { size: 44, dot: AMB }),
      hud: dots(3) + cap(id, "ton lit a retrouvé son *métier.*", 1360), closed: true }) },
  { id: "f17", name: "ET TOI ?", plan: 6, words: 10, tag: "Question = commentaire", voice: "Et toi ? Tu fais quoi quand t'arrives pas à dormir ?",
    note: "<b>Dernier cadre : le lit en plan large, vu de dessus</b>, avec le dormeur. La question est <b>ouverte</b> (« quand t'arrives pas à dormir »), facile à commenter. Signature Listen en bas, avec « lien en bio » (à confirmer, voir la note sur le lien tracké).",
    seam: "fin (boucle vers le plan 1)",
    build: (A, id) => ({ world: A.floorTop() + A.rug(540, 1040, 860, 980) + BED(A, { clock: ["23:50"] }), hud: A.title("title", "ÉPISODE 2", ["Et *toi* ?"], 350) + dots(3) + A.pill("pCom", 540, 410, "dis-le en commentaire ↓", undefined, undefined, { size: 34 }) + cap(id, "tu fais quoi quand t'arrives pas à dormir ?", 1240) +
      `<g><rect x="140" y="1330" width="720" height="150" rx="40" fill="#0b0d1a" fill-opacity=".88" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>${A.listenIcon(170, 1350, 110)}<text x="310" y="1405" font-family="Poppins" font-weight="700" font-size="44" fill="#fff">Listen</text><text x="310" y="1450" font-family="Poppins" font-weight="400" font-size="27" fill="#b8bdd6">Sounds of the World · lien en bio</text></g>`, closed: true }) },
];

// ---------- minutage estimé (cadence de la voix de l'épisode 3 : 0,32 s par mot) ----------
let t = 0.1;
for (const f of F) { f.t0 = t; t += f.words * 0.32; f.t1 = t; t += (f.breath || 0.15); }
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
<li><b>0–3 s</b> titre + heure + un lit qui a des yeux : le personnage est posé avant le premier mot.</li>
<li><b>Le ressort</b> : « est-ce que je récupère mon lit ? » ; la réponse (badge « métier : dormir ») arrive à la dernière phrase.</li>
<li><b>Trois objets qui tombent</b> dans le lit (croquis 03) : un gag visuel lisible sans le son.</li>
<li><b>Chaque astuce échoue</b> : la 1 par le plafond (08), la 2 par le salon trop silencieux (13).</li>
<li><b>Deux images-clés</b> : le plan du studio à un mètre (07) et la lampe-silhouette (12).</li>
<li><b>Le produit</b> arrive à ≈ ${Math.round((F[13].t0 / total) * 100)} % du film, en soulagement du silence.</li>
<li><b>Boucle</b> : le dernier cadre (lit, vue de dessus) répond au premier (lit, coupe).</li></ol>
<p class="note"><b>Pas mesuré.</b> Principes courants, pas des données sur ta vidéo. Seules les statistiques de TikTok diront si ça tient.</p></article>`;
const plans = ["lit en coupe", "règle du lit · plafond", "sors · couloir", "salon", "téléphone Listen", "retour au lit"];
const seamMap = `<article class="cell meta"><h3>6 plans · 5 volets</h3><ol class="seams">${plans.map((p, i) => `<li><b>Plan ${i + 1}</b> ${p} <span class="dim">(croquis ${F.filter((f) => f.plan === i + 1).map((f) => f.id.slice(1)).join(", ")})</span></li>`).join("")}</ol>
<p class="note"><b>Règle de couleur.</b> Bleu froid = l'écran (le problème) · ambre = la décision (alarme, heure de fin, volets) · néon = Listen, uniquement à partir du croquis 14. Le halo du téléphone n'a jamais le dégradé néon.</p>
<p class="note"><b>Volet jaune</b> (comme l'épisode 3) à chaque changement de plan, posé dans une respiration de la voix. </p></article>`;
const tokens = `<article class="cell meta"><h3>Tokens</h3><div class="sw">${[["nuit", C.night0], ["nuit 2", C.night1], ["bleu écran", COLD], ["ambre", C.amber], ["crème", C.cream], ["néon (14)", "linear-gradient(135deg,#3BD6F5,#7B5CFF,#E04FD8)"]].map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join("")}</div>
<p class="type"><span style="font-family:Fraunces;font-style:italic;font-weight:700;font-size:28px">Fraunces Italic</span> titres · <span style="font-family:Nunito;font-weight:900">Nunito 900</span> sous-titres · <span style="font-family:Poppins;font-weight:600">Poppins</span> UI Listen</p>
<p class="note"><b>Interdits repris de l'épisode 3</b> : pas de pulsations de caméra sans raison, pas de diaporama, pas de bruitage de pluie, pas de néon avant l'app. <b>Pointillés rouges</b> = zones masquées par TikTok.</p></article>`;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Listen — Nuits blanches ép. 2 · storyboard ${VERSION}</title>
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
<header><h1>Listen — <em>Nuits blanches</em>, ép. 2 · ${VERSION}</h1>
<p>« Pourquoi tu te couches toujours trop tard ». Croquis statiques (aucune animation) : cadrage, hiérarchie et textes à valider. Script <b>complet</b> : ${totalWords} mots, tel que tu l'as enregistré. Durées estimées avec la cadence mesurée sur ton SRT (0,32 s par mot) plus les respirations ; ta voix fera foi.</p>
<span class="tag">1080×1920 · ≈ ${Math.round(total)} s · ${F.length} croquis · 6 plans</span>
<label class="toggle" for="hide">☐ masquer les zones TikTok</label></header>
<main>${F.map(cell).join("\n")}${seamMap}${retention}${tokens}</main>
</body></html>`;

writeFileSync(new URL("../storyboard.html", import.meta.url), html);
console.log("storyboard.html écrit —", F.length, "croquis,", totalWords, "mots, ≈", fmt(total), "s");
console.log(F.map((f) => `${f.id} ${fmt(f.t0)}-${fmt(f.t1)}`).join(" | "));
