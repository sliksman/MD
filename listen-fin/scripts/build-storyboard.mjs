// Génère storyboard.html — nouveau format (pilote, histoire de l'ép. 1 « heure de fin »). Croquis statiques 9:16.
// Réutilise le kit de l'épisode 2 (kit/kit.js).   node scripts/build-storyboard.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
global.window = {};
global.gsap = { set() {} };
require("../kit/kit.js");
const L = window.LS, C = L.C, COLD = "#9cc8ff", AMB = C.amber, WARM = "#ffd28a";
const VERSION = "v1";
const font = (f) => `url(data:font/woff2;base64,${readFileSync(new URL(`../assets/fonts/${f}`, import.meta.url)).toString("base64")})`;

// ---------- aides ----------
const CAP_Y = 450;
function cap(id, str, y = CAP_Y, max = 76) {
  const n = str.replace(/\*/g, "").length, size = Math.min(max, Math.round(900 / (n * 0.52)));
  const parts = str.split(/(\*[^*]+\*)/).filter(Boolean).map((p) => (p.startsWith("*") ? `<tspan fill="${AMB}">${L.esc(p.slice(1, -1))}</tspan>` : L.esc(p)));
  return `<text x="540" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${size}" fill="#fff" filter="url(#${id}-fShadow)">${parts.join("")}</text>`;
}
// compte à rebours persistant (temps avant le réveil) : gros au début et à la fin, petit au milieu
function counter(id, t, o = {}) {
  const big = o.big, size = big ? 176 : 70, y = big ? 330 : 250, col = o.color || AMB;
  const label = o.label ?? "AVANT TON RÉVEIL";
  return `<g opacity="${o.opacity ?? 1}">
    ${big ? `<text x="540" y="${y - size * 0.86}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="27" letter-spacing="8" fill="${C.cream}" fill-opacity=".8">${label}</text>` : ""}
    <text x="540" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${size}" fill="${col}" letter-spacing="${big ? 4 : 2}" filter="url(#${id}-fShadow)">${t}</text>
    ${big ? "" : `<text x="540" y="${y + 40}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="20" letter-spacing="6" fill="${C.cream}" fill-opacity=".6">${label}</text>`}</g>`;
}
const strike = (x1, x2, y, w = 12) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${AMB}" stroke-width="${w}" stroke-linecap="round"/>`;
const dark = (op = 0.45) => `<rect width="1080" height="1920" fill="#04050d" opacity="${op}"/>`;
// téléphone tenu au-dessus du visage (on voit le dos) + halo bleu froid sur le visage
const HEAD = [542, 736];
const phoneHeld = (cx = 560, cy = 905, glow = 1) => `<ellipse cx="${HEAD[0]}" cy="${HEAD[1] + 40}" rx="300" ry="260" fill="url(#ID-gHalo)" opacity="${0.95 * glow}"/>
  <g transform="rotate(-8 ${cx} ${cy})"><rect x="${cx - 72}" y="${cy - 128}" width="144" height="256" rx="26" fill="#0b0d1a" stroke="${COLD}" stroke-opacity=".9" stroke-width="5" filter="url(#ID-fGlowS)"/>
  <rect x="${cx - 52}" y="${cy - 108}" width="38" height="38" rx="10" fill="#1d2140"/></g>
  <ellipse cx="${cx - 40}" cy="${cy + 90}" rx="44" ry="30" fill="url(#ID-gSkin)"/><ellipse cx="${cx + 66}" cy="${cy + 60}" rx="30" ry="44" fill="url(#ID-gSkin)"/>`;
const scrollStreaks = (cx = 560, cy = 905) => [0, 1, 2].map((i) => `<rect x="${cx + 110 + i * 26}" y="${cy - 120 + i * 40}" width="10" height="${120 - i * 26}" rx="5" fill="${COLD}" opacity="${0.7 - i * 0.18}"/>`).join("");
const tremble = (cx, cy, col = AMB) => `<g stroke="${col}" stroke-width="6" stroke-linecap="round" fill="none"><path d="M${cx - 62} ${cy - 22} l-18 -10 M${cx - 66} ${cy} h-22 M${cx - 62} ${cy + 22} l-18 10"/><path d="M${cx + 62} ${cy - 22} l18 -10 M${cx + 66} ${cy} h22 M${cx + 62} ${cy + 22} l18 10"/></g>`;
// décompte (traits) : POSÉ en ambre, REVENU en bleu écran
const ticks = (n, col) => Array.from({ length: n }, (_, i) => `<rect x="${i * 30}" y="0" width="14" height="70" rx="7" fill="${col}"/>`).join("");
function tally(posed, back, y = 1420) {
  const box = (x, label, n, col) => `<g transform="translate(${x} ${y})"><rect x="-20" y="-58" width="360" height="160" rx="30" fill="#0b0d1a" fill-opacity=".82" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>
    <text x="0" y="-16" font-family="Nunito" font-weight="800" font-size="24" letter-spacing="6" fill="${C.cream}" fill-opacity=".8">${label}</text><g transform="translate(0 6)">${ticks(n, col)}</g></g>`;
  return box(120, "POSÉ", posed, AMB) + (back !== undefined ? box(540, "REVENU", back, COLD) : "");
}
// mur de traits (« depuis des mois ») — déterministe
function markWall() {
  let s = "", k = 7;
  const rnd = () => ((k = (k * 9301 + 49297) % 233280) / 233280);
  for (let row = 0; row < 15; row++) for (let col = 0; col < 7; col++) {
    const x = 70 + col * 136 + rnd() * 20, y = 650 + row * 58;
    if (x > 300 && x < 800 && y > 760 && y < 1350) continue; // laisse le lit lisible
    if (x > 880 && y > 780) continue; // colonne d'icônes TikTok
    const c = rnd() < 0.78 ? COLD : AMB;
    s += `<g transform="translate(${x} ${y})" opacity=".75">${[0, 1, 2, 3].map((i) => `<rect x="${i * 16}" y="0" width="7" height="40" rx="3" fill="${c}"/>`).join("")}<line x1="-6" y1="34" x2="62" y2="6" stroke="${c}" stroke-width="6" stroke-linecap="round"/></g>`;
  }
  return s;
}
// grand chiffre de règle (remplace bigNum : surtitre « RÈGLE », onde de choc)
const ruleNum = (n, label, x = 110, y = 840) => `<g><circle cx="${x + 70}" cy="${y - 80}" r="150" fill="none" stroke="${AMB}" stroke-width="8" opacity=".55"/><circle cx="${x + 70}" cy="${y - 80}" r="210" fill="none" stroke="${AMB}" stroke-width="4" opacity=".25"/>
  <text x="${x}" y="${y}" font-family="Fraunces" font-style="italic" font-weight="700" font-size="260" fill="${AMB}" filter="url(#ID-fShadow)">${n}</text>
  <text x="${x + 175}" y="${y - 150}" font-family="Nunito" font-weight="800" font-size="27" letter-spacing="8" fill="${C.cream}" fill-opacity=".85">RÈGLE ${n}</text>
  <text x="${x + 175}" y="${y - 76}" font-family="Fraunces" font-style="italic" font-weight="500" font-size="62" fill="${C.cream}">${L.esc(label)}</text></g>`;
// gros plan du téléphone qui sonne (écran d'alarme ambre) tenu en main
const alarmPhone = (o = {}) => `<g transform="rotate(${o.rot ?? -4} 540 1040)">
  ${[150, 230, 310].map((r, i) => `<path d="M${540 - 250 - r * 0.25} ${1040 - r} q-${r * 0.5} ${r} 0 ${2 * r}" stroke="${AMB}" stroke-width="${10 - i * 3}" fill="none" opacity="${0.8 - i * 0.22}" stroke-linecap="round"/><path d="M${540 + 250 + r * 0.25} ${1040 - r} q${r * 0.5} ${r} 0 ${2 * r}" stroke="${AMB}" stroke-width="${10 - i * 3}" fill="none" opacity="${0.8 - i * 0.22}" stroke-linecap="round"/>`).join("")}
  <rect x="330" y="640" width="420" height="820" rx="70" fill="#0b0d1a" stroke="#fff" stroke-opacity=".2" stroke-width="4"/>
  <rect x="352" y="662" width="376" height="776" rx="54" fill="#2a1d3a"/><rect x="352" y="662" width="376" height="776" rx="54" fill="${AMB}" opacity=".9"/>
  <rect x="480" y="680" width="120" height="34" rx="17" fill="#000"/>
  <text x="540" y="840" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" letter-spacing="6" fill="#2a1d3a">HEURE DE FIN</text>
  <text x="540" y="990" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="150" fill="#2a1d3a">00:45</text>
  <text x="540" y="1060" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="500" font-size="40" fill="#4a3a22">pose le téléphone</text>
  <rect x="390" y="1300" width="300" height="84" rx="42" fill="#2a1d3a" opacity=".85"/><circle cx="432" cy="1342" r="34" fill="${C.cream}"/>
  <text x="575" y="1352" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" fill="${C.cream}">arrêter</text></g>
  <ellipse cx="300" cy="1330" rx="70" ry="120" fill="url(#ID-gSkin)" transform="rotate(-20 300 1330)"/><ellipse cx="770" cy="1260" rx="64" ry="130" fill="url(#ID-gSkin)" transform="rotate(18 770 1260)"/>
  <ellipse cx="${o.thumbX ?? 470}" cy="1345" rx="60" ry="40" fill="url(#ID-gSkin)"/>`;
// tête en gros plan sur l'oreiller (silence)
const headPillow = () => `<rect x="190" y="700" width="700" height="440" rx="150" fill="url(#ID-gPillow)" opacity=".9"/>`;
// bande ambre fond plat de la carte Listen
const listenCard = (A, y = 1330) => `<g><rect x="140" y="${y}" width="720" height="150" rx="40" fill="#0b0d1a" fill-opacity=".9" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>${A.listenIcon(170, y + 20, 110)}<text x="310" y="${y + 75}" font-family="Poppins" font-weight="700" font-size="44" fill="#fff">Listen</text><text x="310" y="${y + 120}" font-family="Poppins" font-weight="400" font-size="27" fill="#b8bdd6">Sounds of the World · lien en bio</text></g>`;

// lit en plongée (kit) ; phone:"hand"|"table"|"down"|"neonDown"
function bed(A, o = {}) {
  let s = A.bedTop({ clock: [o.clock || "00:34"] });
  if (o.phone !== "table") s = s.replace(/<g id="([^"]*-phone)">/, `<g id="$1" opacity="0">`);
  return s;
}
const TABLE_PHONE = [230, 744]; // centre du téléphone posé sur la table de nuit
function render(id, world, hud, fx = {}) {
  const root = { innerHTML: "", querySelector: () => null, querySelectorAll: () => [] };
  L.stage(root, id, world.replaceAll("ID-", id + "-"), hud.replaceAll("ID-", id + "-"));
  let svg = root.innerHTML.replace(/<rect id="[^"]*-lid[LR]"[^>]*\/>/g, "").replace(/<rect id="[^"]*-screenOff"[^>]*\/>/g, "").replace(/<circle id="[^"]*-(seed|ring)"[^>]*\/>/g, "");
  svg = svg.replace(/>00:11</g, ">00:47<");
  if (fx.closed) svg = svg.replace(new RegExp(`<g id="${id}-([A-Za-z]*[eE]yes)-open"`, "g"), `<g id="${id}-$1-open" opacity="0"`).replace(new RegExp(`<g id="${id}-([A-Za-z]*[eE]yes)-shut" opacity="0"`, "g"), `<g id="${id}-$1-shut" opacity="1"`);
  if (fx.neon) svg = svg.replace(`<g id="${id}-big-on" opacity="0"`, `<g id="${id}-big-on" opacity="1"`);
  return svg;
}
// téléphone posé face contre la table (dos sombre) ; neon = liseré néon qui fuit dessous (Listen joue)
const downPhone = (A, neon = false, x = TABLE_PHONE[0], y = TABLE_PHONE[1]) => `${neon ? `<rect x="${x - 40}" y="${y - 70}" width="80" height="140" rx="16" fill="none" stroke="url(#ID-gNeon)" stroke-width="10" filter="url(#ID-fGlowN)" opacity=".75"/>` : ""}
  <rect x="${x - 35}" y="${y - 64}" width="70" height="128" rx="14" fill="#0b0d1a" stroke="#fff" stroke-opacity=".18" stroke-width="3"/><rect x="${x - 25}" y="${y - 54}" width="22" height="22" rx="6" fill="#1d2140"/>`;
const upPhoneLit = (x = TABLE_PHONE[0], y = TABLE_PHONE[1]) => `<ellipse cx="${x}" cy="${y}" rx="150" ry="170" fill="url(#ID-gHalo)" opacity=".6"/><rect x="${x - 35}" y="${y - 64}" width="70" height="128" rx="14" fill="#0b0d1a" stroke="#fff" stroke-opacity=".2" stroke-width="3"/><rect x="${x - 29}" y="${y - 58}" width="58" height="116" rx="10" fill="#cfe2ff"/>`;

// ---------- les croquis ----------
const F = [
  { id: "f01", name: "DANS SIX HEURES VINGT-SIX", plan: 1, words: 7, breath: 0.5, tag: "Crochet · le compte à rebours", voice: "Dans six heures vingt-six, ton réveil sonne.",
    note: "<b>Image 1 = texte + mouvement</b>, sans titre ni surtitre. Plongée sur le lit, chambre plus sombre : <b>la seule vraie lumière est le halo bleu du téléphone</b> sur le visage. Le compte à rebours <b>06:26:14</b> en ambre, très gros, en haut, <b>défile à la seconde</b> (chaque chiffre qui change claque). Le petit réveil de la table de nuit (00:34) tremble sur « sonne ». La caméra se rapproche lentement et en continu, sans pulsation.",
    seam: "même plan", build: (A, id) => ({ world: A.bg() + bed(A) + dark(0.42) + phoneHeld() + tremble(275 + 29, 650 + 17),
      hud: counter(id, "06:26:14", { big: true }) + cap(id, "ton réveil *sonne.*") }) },
  { id: "f02", name: "ET TOI, TU SCROLLES", plan: 1, words: 4, tag: "Le problème · le pouce", voice: "Et toi, tu scrolles.",
    note: "Le pouce scrolle : <b>traînées bleues</b> qui remontent le long du téléphone, le halo du visage <b>clignote à chaque glissement</b> (le flux qui change). Les secondes continuent de tomber. À la fin de la phrase, le compteur <b>rétrécit et monte</b> (il reste visible tout le film, c'est le fil de la vidéo).",
    seam: "même plan", build: (A, id) => ({ world: A.bg() + bed(A) + dark(0.42) + phoneHeld() + scrollStreaks(),
      hud: counter(id, "06:26:11", { big: true }) + cap(id, "Et toi, tu *scrolles.*") }) },
  { id: "f03", name: "POSÉ… ", plan: 1, words: 9, tag: "★ Le gag · 1/2", voice: "Minuit trente-quatre. T'as posé ton téléphone deux fois.",
    note: "<b>Même cadre, caméra immobile, l'objet change d'état</b> (ce n'est pas un jump cut de caméra, donc ça se lit) : le téléphone est sur la table, écran encore allumé, les mains vides, la chambre s'assombrit. Pastille <b>00:34</b> sur le réveil (secondaire, plus petite que le compteur). Un trait ambre « POSÉ » à chaque fois. Bruitage « tac ».",
    seam: "même plan, changement d'état sec", build: (A, id) => ({ world: A.bg() + bed(A) + dark(0.5) + upPhoneLit() + A.pill("p34", 300, 1060, "00:34", 304, 684, { size: 44, w: 190 }),
      hud: counter(id, "06:26:08") + cap(id, "T'as *posé* ton téléphone") + tally(1) }) },
  { id: "f04", name: "…REVENU", plan: 1, words: 5, tag: "★ Le gag · 2/2", voice: "Il est revenu deux fois.",
    note: "Le téléphone <b>est de nouveau dans la main</b>, halo bleu revenu. En 2,5 s : posé / main / posé / main, <b>un seul téléphone visible à la fois</b>. Score <b>POSÉ II · REVENU II</b> : l'égalité dit « tu perds à chaque fois ».",
    seam: "même plan", build: (A, id) => ({ world: A.bg() + bed(A) + dark(0.42) + phoneHeld(),
      hud: counter(id, "06:26:05") + cap(id, "Il est *revenu* deux fois.") + tally(2, 2) }) },
  { id: "f05", name: "DEPUIS DES MOIS", plan: 1, words: 9, tag: "Escalade · le mur de traits", voice: "Cette négo, tu la perds depuis des mois.",
    note: "<b>Dézoom rapide et continu</b> : le lit rapetisse, et les traits du score se multiplient jusqu'à <b>couvrir la chambre</b> (des centaines, presque tous bleus). C'est la seule image du film qui dit « des mois » sans chiffre. Le dézoom remplace l'ancienne « pulsation de caméra » : il a une raison.",
    seam: "même plan, retour vers la tête", build: (A, id) => ({ world: A.bg() + dark(0.3) + markWall() + `<g transform="translate(297 485) scale(.55)">${bed(A)}${phoneHeld()}</g>`,
      hud: counter(id, "06:26:02") + cap(id, "tu la *perds* depuis des mois.") }) },
  { id: "f06", name: "PAS UNE QUESTION DE VOLONTÉ", plan: 1, words: 8, tag: "Recadrage · le mot barré, en grand", voice: "Et c'est pas une question de volonté.",
    note: "La caméra revient sur la tête. Une pastille reliée à la tête, <b>« volonté » en très gros</b> (≈ 3 fois la taille d'une pastille normale), <b>barré d'un trait ambre épais</b> qui se trace de gauche à droite sur « volonté ». Le mur de traits reste en fond, estompé.",
    seam: "volet ambre (sur la virgule de « Règle numéro un, »)", build: (A, id) => ({ world: A.bg() + dark(0.3) + `<g opacity=".25">${markWall()}</g>` + bed(A) + dark(0.25) + phoneHeld() +
      A.pill("pVol", 540, 1180, "volonté", HEAD[0], HEAD[1] + 70, { size: 104 }) + strike(330, 750, 1172, 16),
      hud: counter(id, "06:25:59") + cap(id, "pas une question de *volonté.*") }) },
  { id: "f07", name: "RÈGLE NUMÉRO UN", plan: 2, words: 14, tag: "Règle 1 · le chiffre claque", voice: "Règle numéro un : décide de ton heure de fin, pas de ton heure de coucher.",
    note: "<b>Le « 1 » claque</b> en très grand avec une onde de choc ambre (ce sont les chiffres qui claquent, pas la caméra). Un vrai réveil, vu de dessus, réglé sur <b>00:45</b>. Deux pastilles : <b>« heure de fin »</b> (ambre, reliée au réveil) et « heure de coucher », <b>barrée</b>.",
    seam: "continu", build: (A, id) => ({ world: A.bg() + A.alarmClock("ac", 560, 1090, 1.75, { time: "00:45", size: 50 }) +
      A.pill("pFin", 540, 1360, "heure de fin", 560, 1250, { size: 44, dot: AMB }) + A.pill("pCou", 540, 1470, "heure de coucher", undefined, undefined, { size: 40 }) + strike(370, 710, 1462, 5),
      hud: counter(id, "06:25:50") + cap(id, "décide de ton *heure de fin*") + ruleNum("1", "L'heure de fin.", 110, 860) }) },
  { id: "f08", name: "UNE ALARME", plan: 2, words: 9, tag: "La règle · l'alarme traverse", voice: "Une alarme. Pas pour dormir. Pour poser le téléphone.",
    note: "<b>La bande ambre de l'alarme traverse l'écran</b> en biais (reprise de l'ép. 1) : « ALARME · 00:45 / pour poser le téléphone ». « pas pour dormir » apparaît puis est barré. Rythme : trois phrases, trois coups.",
    seam: "coupe sèche vers le gros plan (rythme)", build: (A, id) => ({ world: A.bg() + `<g opacity=".35">${A.alarmClock("ac", 560, 1090, 1.75, { time: "00:45", size: 50 })}</g>` +
      A.pill("pDor", 540, 760, "pas pour dormir", undefined, undefined, { size: 44 }) + strike(370, 710, 752, 5) + A.alarmBand("band", { cx: 540, cy: 1100, text: "ALARME · 00:45", sub: "pour poser le téléphone", size: 84 }),
      hud: counter(id, "06:25:44") + cap(id, "Pour *poser* le téléphone.") }) },
  { id: "f09", name: "ELLE SONNE · TU L'ÉTEINS", plan: 3, words: 5, tag: "Rythme · gros plan / large", voice: "Elle sonne. Tu l'éteins. Elle sonne.",
    note: "<b>Alternance gros plan / plan large sur chaque phrase</b>, coupes sèches avec bruitage : « sonne » = gros plan, le téléphone vibre (ondes ambre), écran d'alarme « HEURE DE FIN 00:45 » ; « éteins » = le pouce glisse, retour au plan large, halo bleu ; « sonne » = gros plan, ondes plus grandes. On saute dans le temps : le compteur passe à <b>06:15</b>.",
    seam: "coupes sèches rythmées (3)", build: (A, id) => ({ world: A.bg() + dark(0.35) + alarmPhone(),
      hud: counter(id, "06:15:00") + cap(id, "Elle *sonne.*") }) },
  { id: "f10", name: "TU LE POSES", plan: 3, words: 3, breath: 0.4, tag: "★ Payoff du gag · le score s'inverse", voice: "Tu le poses.",
    note: "Plan large : le téléphone <b>vole vers la table</b> (chemin de points ambre) et y atterrit <b>face contre table</b>, avec un bruitage mat. Le score revient : <b>POSÉ III · REVENU II</b>, la première fois que tu gagnes. Ce téléphone retourné est celui qui servira pour Listen : l'apparition de l'app est préparée.",
    seam: "même plan, la caméra glisse vers la tête", build: (A, id) => ({ world: A.bg() + bed(A, { clock: "00:45" }) + dark(0.55) + downPhone(A) +
      A.dots("fly", [[520, 880], [430, 760], [330, 720], [262, 740]], { step: 34, r: 8, color: AMB, opacity: 0.9 }) + tremble(TABLE_PHONE[0], TABLE_PHONE[1], "#fff"),
      hud: counter(id, "06:15:00") + cap(id, "Tu le *poses.*") + tally(3, 2) }) },
  { id: "f11", name: "UN SILENCE PAS POSSIBLE", plan: 3, words: 8, breath: 0.8, tag: "Le seul temps calme · ≈ 3 s", voice: "Et là, ta chambre fait un silence pas possible.",
    note: "<b>Gros plan sur la tête, yeux grands ouverts</b>, la chambre presque noire. Une <b>ligne de points plate</b> traverse l'image (le motif du silence de l'ép. 1). Le grain monte, <b>tous les bruitages coupent</b> : vrai silence pendant la respiration. Le compteur s'estompe. C'est la seule pause, courte, juste avant l'app.",
    seam: "la caméra glisse vers la table de nuit", build: (A, id) => ({ world: A.bg() + dark(0.4) + headPillow() + A.headClose(540, 900, 220) + dark(0.2) + A.dots("flat", [[30, 600], [1050, 600]], { step: 30, r: 5, opacity: 0.55 }),
      hud: counter(id, "06:14:58", { opacity: 0.4 }) + cap(id, "un silence *pas possible.*") }) },
  { id: "f12", name: "RÈGLE NUMÉRO DEUX", plan: 4, words: 6, tag: "Règle 2 · le premier néon", voice: "Règle numéro deux : remplis ce silence.",
    note: "Sur la table de nuit, <b>le téléphone se retourne et s'allume en néon</b> cyan → violet → magenta : <b>première apparition du néon dans le film</b>. Le « 2 » claque (même onde de choc que le « 1 »). Pas de volet ici : le passage du noir au néon est plus fort qu'un volet.",
    seam: "zoom continu dans l'écran", build: (A, id) => ({ world: A.bg() + dark(0.35) + A.sideTable("tbl", 540, 1200, 560, 640) + A.phoneTop("big", 450, 1030, 180, 330),
      hud: counter(id, "06:14:50") + cap(id, "*remplis* ce silence.") + ruleNum("2", "Une ambiance.", 110, 860), neon: true }) },
  { id: "f13", name: "SUR LISTEN · TERRASSE DE CAFÉ", plan: 4, words: 9, tag: "Le produit · la piste", voice: "Sur Listen, une terrasse de café, enregistrée sur place.",
    note: "Zoom dans l'écran de <b>Listen</b> (interface reconstruite d'après tes captures, Poppins). Piste <b>« Terrasse de café »</b>, sous-titre « enregistrée sur place ». <b>Nom de la piste à vérifier dans l'app</b>. « Tu lances » = le doigt tape lecture (onde blanche).",
    seam: "dézoom hors du téléphone", build: (A, id) => ({ world: A.bg() + `<ellipse cx="540" cy="1070" rx="460" ry="620" fill="${C.violet}" opacity=".2" filter="url(#${id}-fBlurL)"/>` + A.phoneUI(330, 640, 420, { track: "Terrasse de café", sub: "Enregistrée sur place", section: "AMBIANCES" }),
      hud: counter(id, "06:14:40") + cap(id, "une *terrasse de café,*") }) },
  { id: "f14", name: "TU LANCES, TU RETOURNES", plan: 4, words: 15, breath: 0.6, tag: "★ La contradiction réglée · sans l'écran", voice: "Tu lances, tu retournes le téléphone. Le bruit des autres, sans l'écran.",
    note: "Dézoom jusqu'au plan large du lit. Le téléphone est <b>retourné sur la table, écran contre le bois</b> : seul un <b>liseré néon</b> fuit dessous (le son joue). Des <b>arcs de points chauds</b> sortent de la table et remplissent la chambre : « le bruit des autres ». Le personnage, yeux ouverts, se détend. Aucune lumière d'écran dans l'image.",
    seam: "même plan", build: (A, id) => ({ world: A.bg() + bed(A, { clock: "00:47" }) + dark(0.5) + downPhone(A, true) + A.warmDots("w", TABLE_PHONE[0], TABLE_PHONE[1], 3, 130, 90) +
      A.pill("pAut", 640, 1140, "le bruit des autres", 470, 900, { size: 38, dot: WARM }),
      hud: counter(id, "06:13:00") + cap(id, "le bruit des autres, *sans l'écran.*") }) },
  { id: "f15", name: "SIX HEURES DIX DEVANT TOI", plan: 5, words: 9, tag: "Retour au cadre d'ouverture", voice: "Minuit cinquante. Six heures dix devant toi. Téléphone retourné.",
    note: "<b>Exactement le cadre de l'image 1</b> : le compteur redevient très gros, <b>06:10:00</b>, et <b>passe de l'ambre au crème</b> (la tension retombe ; pas de bleu, qui est la couleur de l'écran). Réveil 00:50, personnage endormi, téléphone retourné, ondes chaudes plus faibles.",
    seam: "même plan", build: (A, id) => ({ world: A.bg() + bed(A, { clock: "00:50" }) + dark(0.5) + downPhone(A, true) + `<g opacity=".5">${A.warmDots("w", TABLE_PHONE[0], TABLE_PHONE[1], 2, 130, 90)}</g>`,
      hud: counter(id, "06:10:00", { big: true, color: C.cream, label: "DEVANT TOI" }) + cap(id, "Six heures dix *devant toi.*"), closed: true }) },
  { id: "f16", name: "ET TOI ?", plan: 5, words: 8, tag: "Question = commentaire · boucle", voice: "Et toi, c'est quoi ton heure de fin ?",
    note: "La question remplace le compteur, <b>en grand, en haut</b>. Pastille « dis-le en commentaire ↓ », carte Listen (« lien en bio » : <b>à confirmer avec le client</b>). Le dernier cadre est le premier : <b>la vidéo boucle</b> sans raccord visible sur le hook.",
    seam: "fin (boucle vers l'image 1)", build: (A, id) => ({ world: A.bg() + bed(A, { clock: "00:50" }) + dark(0.5) + downPhone(A, true),
      hud: A.title("title", "", ["Et *toi*, c'est quoi", "ton heure de fin ?"], 300, { size: 84, x: 540 }) + A.pill("pCom", 540, 500, "dis-le en commentaire ↓", undefined, undefined, { size: 34 }) + listenCard(A, 1330), closed: true }) },
];

// ---------- minutage estimé (0,32 s par mot, cadence mesurée sur tes SRT) ----------
let t = 0.1;
for (const f of F) { f.t0 = t; t += f.words * 0.32; f.t1 = t; t += (f.breath || 0.12); }
const total = t + 1.0;
const fmt = (x) => x.toFixed(1).replace(".", ",");
const totalWords = F.reduce((a, f) => a + f.words, 0);
const appAt = F.find((f) => f.id === "f12").t0;

const cell = (f) => {
  const A = L.art(f.id + "-");
  const b = f.build(A, f.id);
  const svg = render(f.id, b.world.replaceAll(`${f.id}-`, "ID-"), b.hud.replaceAll(`${f.id}-`, "ID-"), { closed: b.closed, neon: b.neon });
  return `<article class="cell" id="frame-${f.id.slice(1)}">
  <div class="frame">${svg}<svg class="safe" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><g opacity=".6" fill="none" stroke="#ff6b6b" stroke-width="3" stroke-dasharray="14 10"><rect x="920" y="780" width="150" height="740"/><rect x="0" y="1530" width="1080" height="390"/><rect x="0" y="0" width="1080" height="150"/></g></svg></div>
  <div class="label"><span>${f.id.slice(1)} · ${f.name}</span><span>≈ ${fmt(f.t0)}–${fmt(f.t1)} s</span></div>
  <p class="voice">« ${f.voice} »</p>
  <p class="note">${f.note}</p>
  <div class="chips"><span class="chip">→ ${f.seam}</span><span class="chip tag">${f.tag}</span></div>
</article>`;
};

const changes = `<article class="cell meta wide"><h3>Ce que j'ai changé dans ta mise en scène</h3><ol class="seams">
<li><b>Le compteur devient le fil du film</b> : gros au début, petit en haut pendant tout le milieu (il continue de tomber), de nouveau gros à la fin. C'est lui qui remplace les points de progression : un seul système, lisible sans le son.</li>
<li><b>Les secondes sont affichées</b> (06:26:14). Un 06:26 « à la seconde » ne bouge pas pendant le hook ; avec les secondes, chaque chiffre qui change claque.</li>
<li><b>Sous-titres en haut, sous le compteur</b>, sur tout le film : le texte du hook est en haut dès l'image 1, et ça libère le bas de l'image (où TikTok met la légende).</li>
<li><b>Le gag « posé / revenu »</b> : caméra fixe, c'est l'objet qui change d'état. On garde la coupe sèche sans enfreindre ton retour « pas de jump cut » (qui portait sur la caméra). Un seul téléphone visible.</li>
<li><b>Le score revient en payoff</b> (POSÉ III · REVENU II, image 10) : la règle 1 « gagne » à l'image.</li>
<li><b>« Depuis des mois » = mur de traits</b> par dézoom (image 5) : du mouvement qui a une raison.</li>
<li><b>Pas de volet avant Listen</b> : noir → néon direct. 1 seul volet dans le film (avant la règle 1) ; le reste est continu ou en coupes rythmées.</li>
<li><b>Le téléphone n'est jamais rallumé dans la main</b> après la règle 1 : l'app s'ouvre sur la table puis l'écran est retourné (liseré néon dessous).</li>
<li><b>Fin en crème, pas en bleu</b> (le bleu est la couleur de l'écran, donc du problème).</li>
<li><b>Retiré</b> : la référence à l'ép. 3 (le film doit tenir seul), le titre d'ouverture, les pulsations de caméra.</li></ol></article>`;
const retention = `<article class="cell meta"><h3>Rétention</h3><ol class="seams">
<li><b>0–1 s</b> : un chiffre qui défile + un visage éclairé par l'écran + une phrase qui menace (« ton réveil sonne »).</li>
<li><b>Un événement visible par phrase</b>, jamais plus de ≈ 3 s sans changement d'état.</li>
<li><b>Le produit</b> arrive à ≈ ${Math.round((appAt / total) * 100)} % du film, comme réponse au seul silence.</li>
<li><b>Boucle</b> : la dernière image est la première.</li></ol>
<p class="note"><b>Pas mesuré.</b> Ce sont des principes courants, pas des données sur ta vidéo. Seules les stats TikTok trancheront ; si tu veux une vraie réponse, publie-le face à l'ép. 1 v9 dans des conditions comparables.</p></article>`;
const open = `<article class="cell meta"><h3>À vérifier avant le rendu</h3><ol class="seams">
<li>Nom exact de la piste « Terrasse de café » dans Listen.</li>
<li>« lien en bio » ou « App Store » : décision du client.</li>
<li>Mention pub (« Collaboration commerciale » / contenu de marque).</li>
<li>Durées estimées (0,32 s/mot) : ta prise fera foi, je recale tout sur le SRT.</li></ol>
<p class="note"><b>Pointillés rouges</b> = zones masquées par TikTok (case à cocher en haut pour les cacher).</p></article>`;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Heure de fin · storyboard</title>
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
body{background:#0c0e1f;color:${C.cream};font-family:Nunito,system-ui,sans-serif;padding:40px 16px 80px}
header{max-width:1500px;margin:0 auto 32px;display:flex;flex-wrap:wrap;align-items:baseline;gap:16px 24px}
header h1{font-family:Fraunces;font-style:italic;font-weight:700;font-size:40px}
header h1 em{color:${C.amber};font-style:italic}
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
.note{font-size:14px;line-height:1.45;opacity:.88}.note b{color:${C.amber}}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{font-size:12px;font-weight:800;border-radius:99px;padding:4px 10px;background:#ffffff14}
.chip.tag{background:#f5b85a22;color:${C.amber}}
.meta{background:#ffffff08;border:1px solid #ffffff14;border-radius:14px;padding:18px}
.meta.wide{grid-column:1/-1}
.meta h3{font-family:Fraunces;font-style:italic;font-size:26px;margin-bottom:10px}
.seams{font-size:14px;line-height:1.55;padding-left:18px;margin-bottom:10px}.seams b{color:${C.amber}}
#hide:checked ~ main .safe{display:none}
</style></head><body>
<input type="checkbox" id="hide" hidden>
<header><h1>Listen — <em>Heure de fin</em> · nouveau format · storyboard ${VERSION}</h1>
<p>Script v2 (${totalWords} mots). Croquis statiques : cadrage, hiérarchie, textes et mouvements à valider avant l'animation. Durées estimées à 0,32 s par mot (cadence mesurée sur tes SRT) plus les respirations ; ta prise fera foi.</p>
<span class="tag">1080×1920 · ≈ ${Math.round(total)} s · ${F.length} croquis · 5 plans · 1 volet</span>
<label class="toggle" for="hide">☐ masquer les zones TikTok</label></header>
<main>${changes}${F.map(cell).join("\n")}${retention}${open}</main>
</body></html>`;

writeFileSync(new URL("../storyboard.html", import.meta.url), html);
console.log("storyboard.html écrit —", F.length, "croquis,", totalWords, "mots, ≈", fmt(total), "s, app à", fmt(appAt), "s");
console.log(F.map((f) => `${f.id} ${fmt(f.t0)}-${fmt(f.t1)}`).join(" | "));
