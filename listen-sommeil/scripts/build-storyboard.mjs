// Génère storyboard.html (planche de croquis statiques, 9:16) — node scripts/build-storyboard.mjs
import { writeFileSync, readFileSync } from "node:fs";
const font = (f) => `url(data:font/woff2;base64,${readFileSync(new URL(`../assets/fonts/${f}`, import.meta.url)).toString("base64")})`;

const VERSION = "v2";
const C = {
  night0: "#121633", night1: "#1d2350", night2: "#2a3170", fog: "#8fa3d9",
  amber: "#F5B85A", cream: "#F1EDE4", skin: "#d9b08c", skinDark: "#b48a68",
  duvet: "#3d4c96", duvetDark: "#2c3878", wood: "#4a3a5c", woodDark: "#352a45",
  cyan: "#3BD6F5", violet: "#7B5CFF", magenta: "#E04FD8", rain: "#9cc8ff",
};

// ---------- primitives ----------
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function bg(extra = "") {
  return `<rect width="1080" height="1920" fill="url(#gNight)"/>
  <ellipse cx="540" cy="900" rx="760" ry="900" fill="url(#gFog)" opacity=".55"/>${extra}`;
}
function grain() { return `<rect width="1080" height="1920" filter="url(#fGrain)" opacity=".07"/>`; }

// pastille Catcharium : bulle + trait + point d'ancrage
function pill(x, y, text, ax, ay, { dot = "#fff", size = 40, anchorSide = "auto" } = {}) {
  const w = text.length * size * 0.56 + size * 1.3, h = size * 1.75;
  const lx = x - w / 2, ly = y - h / 2;
  let line = "";
  if (ax !== undefined) {
    const sx = ax < lx ? lx : ax > lx + w ? lx + w : ax;
    const sy = ax >= lx && ax <= lx + w ? (ay < ly ? ly : ly + h) : y;
    line = `<line x1="${sx}" y1="${sy}" x2="${ax}" y2="${ay}" stroke="#fff" stroke-opacity=".8" stroke-width="3"/>
    <circle cx="${ax}" cy="${ay}" r="11" fill="${dot}" filter="url(#fGlowS)"/>`;
  }
  return `<g>${line}<rect x="${lx}" y="${ly}" width="${w}" height="${h}" rx="${h / 2}" fill="#14162a" fill-opacity=".82" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
  <text x="${x}" y="${y + size * 0.36}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="${size}" fill="${C.cream}">${esc(text)}</text></g>`;
}

// sous-titre mot à mot ; *mot* = ambre
function caption(str, y = 1330) {
  const parts = str.split(/(\*[^*]+\*)/).filter(Boolean).map((p) =>
    p.startsWith("*") ? `<tspan fill="${C.amber}">${esc(p.slice(1, -1))}</tspan>` : esc(p));
  const n = str.replace(/\*/g, "").length, size = Math.min(76, Math.round(800 / (n * 0.5)));
  return `<text x="500" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${size}" fill="#fff" filter="url(#fShadow)">${parts.join("")}</text>`;
}
// sol : parquet vu du dessus / sol en plongée
function floorTop() {
  let l = `<rect width="1080" height="1920" fill="#171b40"/>`;
  for (let i = 0; i < 1080; i += 120) l += `<rect x="${i}" y="0" width="118" height="1920" fill="${(i / 120) % 2 ? "#1a1f47" : "#181c42"}"/>`;
  for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) l += `<line x1="${i * 120}" y1="${(j * 380 + i * 170) % 1920}" x2="${i * 120 + 118}" y2="${(j * 380 + i * 170) % 1920}" stroke="#0f1232" stroke-width="3"/>`;
  return l + `<ellipse cx="540" cy="900" rx="700" ry="900" fill="url(#gFog)" opacity=".5"/><rect width="1080" height="1920" fill="url(#gVig)"/>`;
}
function floorIso(y0 = 1150) {
  let l = `<path d="M0 ${y0} H1080 V1920 H0 Z" fill="url(#gFloor)"/>`;
  for (let i = -6; i < 14; i++) l += `<line x1="${540 + i * 90}" y1="${y0}" x2="${540 + i * 260}" y2="1920" stroke="#0f1232" stroke-width="3" opacity=".7"/>`;
  return l + `<ellipse cx="520" cy="${y0 + 330}" rx="440" ry="120" fill="#2b2f63" opacity=".55"/>`;
}

function title(over, main, y = 300) {
  const parts = main.split(/(\*[^*]+\*)/).filter(Boolean).map((p) =>
    p.startsWith("*") ? `<tspan fill="${C.amber}">${esc(p.slice(1, -1))}</tspan>` : esc(p));
  return `<text x="500" y="${y - 110}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="27" letter-spacing="8" fill="${C.cream}" fill-opacity=".85">${esc(over)}</text>
  <text x="500" y="${y}" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="92" fill="${C.cream}" filter="url(#fShadow)">${parts.join("")}</text>`;
}
function title2(over, l1, l2, y = 270) {
  const fmt = (main) => main.split(/(\*[^*]+\*)/).filter(Boolean).map((p) =>
    p.startsWith("*") ? `<tspan fill="${C.amber}">${esc(p.slice(1, -1))}</tspan>` : esc(p)).join("");
  return `<text x="500" y="${y - 120}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="27" letter-spacing="8" fill="${C.cream}" fill-opacity=".85">${esc(over)}</text>
  <text text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="96" fill="${C.cream}" filter="url(#fShadow)"><tspan x="500" y="${y}">${fmt(l1)}</tspan><tspan x="500" y="${y + 104}">${fmt(l2)}</tspan></text>`;
}

function bigNum(n, label, x = 150, y = 330) {
  return `<text x="${x}" y="${y}" font-family="Fraunces" font-style="italic" font-weight="700" font-size="230" fill="${C.amber}" filter="url(#fShadow)">${n}</text>
  <text x="${x + 150}" y="${y - 120}" font-family="Nunito" font-weight="800" font-size="27" letter-spacing="8" fill="${C.cream}" fill-opacity=".85">ASTUCE ${n}</text>
  <text x="${x + 150}" y="${y - 50}" font-family="Fraunces" font-style="italic" font-weight="500" font-size="62" fill="${C.cream}">${esc(label)}</text>`;
}

// chemin de points lumineux le long d'une liste de points (polyline échantillonnée)
function dots(pts, { step = 34, r = 8, color = "#fff", glow = "fGlowS", opacity = 1, gapEvery = 0 } = {}) {
  let out = "", acc = 0, i = 0;
  for (let k = 0; k < pts.length - 1; k++) {
    const [x1, y1] = pts[k], [x2, y2] = pts[k + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    while (acc <= len) {
      const t = acc / len;
      if (!(gapEvery && (i % gapEvery) >= gapEvery - 2))
        out += `<circle cx="${(x1 + (x2 - x1) * t).toFixed(1)}" cy="${(y1 + (y2 - y1) * t).toFixed(1)}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
      acc += step; i++;
    }
    acc -= len;
  }
  return `<g filter="url(#${glow})">${out}</g>`;
}
function arc(cx, cy, rad, a0, a1, n = 40) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]); }
  return pts;
}
function ellipsePts(cx, cy, rx, ry, a0 = 0, a1 = 360, n = 90) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  return pts;
}

// ---------- décors ----------
// lit vu du dessus ; asleep: yeux fermés
function bedTop(x, y, { eyes = "open", phone = "off", clock = "07:00", socks = false } = {}) {
  const ph = phone === "on"
    ? `<rect x="${x - 205}" y="${y + 40}" width="70" height="128" rx="14" fill="#0b0d1a" stroke="url(#gNeon)" stroke-width="5" filter="url(#fGlowN)"/>
       <circle cx="${x - 170}" cy="${y + 104}" r="20" fill="none" stroke="url(#gNeon)" stroke-width="6"/>`
    : `<rect x="${x - 205}" y="${y + 40}" width="70" height="128" rx="14" fill="#0b0d1a" stroke="#fff" stroke-opacity=".18" stroke-width="3"/>`;
  const eyeSvg = eyes === "open"
    ? `<circle cx="${x + 120}" cy="${y + 100}" r="11" fill="#fff"/><circle cx="${x + 164}" cy="${y + 100}" r="11" fill="#fff"/>
       <circle cx="${x + 122}" cy="${y + 102}" r="5" fill="#1a1a2a"/><circle cx="${x + 166}" cy="${y + 102}" r="5" fill="#1a1a2a"/>`
    : `<path d="M${x + 108} ${y + 102} q12 10 24 0 M${x + 152} ${y + 102} q12 10 24 0" stroke="#5b4636" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  return `<g>
  <ellipse cx="${x + 140}" cy="${y + 520}" rx="330" ry="560" fill="#000" opacity=".28" filter="url(#fBlurL)"/>
  <!-- table de nuit -->
  <rect x="${x - 250}" y="${y - 20}" width="190" height="230" rx="22" fill="url(#gWood)"/>
  <rect x="${x - 240}" y="${y - 10}" width="170" height="210" rx="16" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="3"/>
  <rect x="${x - 125}" y="${y + 10}" width="58" height="34" rx="8" fill="#1a1b30"/>
  <text x="${x - 96}" y="${y + 36}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="22" fill="${C.amber}">${clock}</text>
  ${ph}
  <!-- lit -->
  <rect x="${x - 40}" y="${y - 40}" width="360" height="1000" rx="38" fill="url(#gWood)"/>
  <rect x="${x - 20}" y="${y - 20}" width="320" height="960" rx="28" fill="#cfc8bb"/>
  <rect x="${x + 20}" y="${y}" width="240" height="150" rx="50" fill="url(#gPillow)"/>
  <circle cx="${x + 142}" cy="${y + 96}" r="66" fill="url(#gSkin)"/>
  ${eyeSvg}
  <path d="M${x - 20} ${y + 190} h320 v720 q0 30 -30 30 h-260 q-30 0 -30 -30 z" fill="url(#gDuvet)"/>
  <path d="M${x - 20} ${y + 190} h320 v40 h-320 z" fill="#5868b0"/>
  ${socks ? "" : ""}
  </g>`;
}

// lit en plongée (3/4) avec face avant pour la fausse 3D
function bedIso(x, y, { eyes = "open", phone = "off", clock = "00:04", pillowUp = false, lidHalf = false } = {}) {
  const head = pillowUp
    ? `<circle cx="${x + 160}" cy="${y + 80}" r="58" fill="url(#gSkin)"/>`
    : `<rect x="${x + 60}" y="${y + 20}" width="220" height="110" rx="45" fill="url(#gPillow)"/><circle cx="${x + 165}" cy="${y + 70}" r="58" fill="url(#gSkin)"/>`;
  const eyeY = y + 70;
  const eyeSvg = eyes === "open"
    ? `<circle cx="${x + 145}" cy="${eyeY}" r="12" fill="#fff"/><circle cx="${x + 187}" cy="${eyeY}" r="12" fill="#fff"/>
       <circle cx="${x + 146}" cy="${eyeY + 2}" r="5.5" fill="#1a1a2a"/><circle cx="${x + 188}" cy="${eyeY + 2}" r="5.5" fill="#1a1a2a"/>
       ${lidHalf ? `<rect x="${x + 130}" y="${eyeY - 14}" width="74" height="13" fill="${C.skin}"/>` : ""}`
    : `<path d="M${x + 133} ${eyeY} q12 9 24 0 M${x + 175} ${eyeY} q12 9 24 0" stroke="#5b4636" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const ph = phone === "on"
    ? `<rect x="${x - 205}" y="${y + 45}" width="62" height="36" rx="9" fill="#0b0d1a" stroke="url(#gNeon)" stroke-width="5" filter="url(#fGlowN)"/>`
    : `<rect x="${x - 205}" y="${y + 45}" width="62" height="36" rx="9" fill="#0b0d1a" stroke="#fff" stroke-opacity=".2" stroke-width="3"/>`;
  return `<g>
  <ellipse cx="${x + 150}" cy="${y + 560}" rx="420" ry="80" fill="#000" opacity=".35" filter="url(#fBlurL)"/>
  <!-- table de nuit -->
  <path d="M${x - 250} ${y + 30} h170 l-10 60 h-150 z" fill="#5a4a6e"/>
  <rect x="${x - 260}" y="${y + 90}" width="170" height="220" rx="10" fill="url(#gWood)"/>
  <rect x="${x - 150}" y="${y + 40}" width="56" height="34" rx="8" fill="#1a1b30"/>
  <text x="${x - 122}" y="${y + 65}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="20" fill="${C.amber}">${clock}</text>
  ${ph}
  <!-- lit : dessus -->
  <path d="M${x - 30} ${y} h380 l60 420 h-500 z" fill="#cfc8bb"/>
  ${head}
  ${pillowUp ? "" : eyeSvg}
  <path d="M${x - 45} ${y + 140} h410 l50 280 h-510 z" fill="url(#gDuvet)"/>
  <path d="M${x - 45} ${y + 140} h410 l5 30 h-420 z" fill="#5868b0"/>
  <!-- lit : face avant -->
  <path d="M${x - 90} ${y + 420} h500 v110 h-500 z" fill="url(#gWood)"/>
  <path d="M${x - 90} ${y + 420} h500 v14 h-500 z" fill="#6a5a80"/>
  </g>`;
}

function phoneUI(x, y, w = 560) {
  const h = w * 2.05, s = w / 560;
  const P = (v) => v * s;
  const chips = ["Bali", "Indonésie", "tropical", "vent"];
  let cx = x + P(40), chipSvg = "";
  for (const c of chips) {
    const cw = P(c.length * 15 + 44);
    chipSvg += `<rect x="${cx}" y="${y + P(400)}" width="${cw}" height="${P(52)}" rx="${P(26)}" fill="#1b1f3a" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>
    <text x="${cx + cw / 2}" y="${y + P(434)}" text-anchor="middle" font-family="Poppins" font-weight="400" font-size="${P(20)}" fill="#e6e8f2">${c}</text>`;
    cx += cw + P(12);
  }
  return `<g>
  <rect x="${x - P(18)}" y="${y - P(18)}" width="${w + P(36)}" height="${h + P(36)}" rx="${P(90)}" fill="#05060c" stroke="url(#gNeon)" stroke-width="${P(6)}" filter="url(#fGlowN)"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${P(72)}" fill="#0d1020"/>
  <rect x="${x + w / 2 - P(80)}" y="${y + P(22)}" width="${P(160)}" height="${P(46)}" rx="${P(23)}" fill="#000"/>
  <text x="${x + P(60)}" y="${y + P(56)}" font-family="Poppins" font-weight="600" font-size="${P(24)}" fill="#fff">00:11</text>
  <rect x="${x + P(40)}" y="${y + P(120)}" width="${P(70)}" height="${P(6)}" rx="${P(3)}" fill="${C.violet}"/>
  <text x="${x + P(40)}" y="${y + P(180)}" font-family="Poppins" font-weight="600" font-size="${P(17)}" letter-spacing="${P(4)}" fill="#b8bdd6">AMBIANCES CALMES</text>
  <text x="${x + P(40)}" y="${y + P(232)}" font-family="Poppins" font-weight="700" font-size="${P(36)}" fill="#fff">Concentration et sommeil</text>
  <rect x="${x + P(40)}" y="${y + P(275)}" width="${w - P(80)}" height="${P(84)}" rx="${P(42)}" fill="#161a33" stroke="#fff" stroke-opacity=".1" stroke-width="2"/>
  <text x="${x + P(100)}" y="${y + P(326)}" font-family="Poppins" font-weight="400" font-size="${P(22)}" fill="#8a90b0">Rechercher des sons relaxants</text>
  ${chipSvg}
  <text x="${x + P(40)}" y="${y + P(520)}" font-family="Poppins" font-weight="600" font-size="${P(17)}" letter-spacing="${P(4)}" fill="#b8bdd6">NOTRE SÉLECTION</text>
  <text x="${x + P(40)}" y="${y + P(562)}" font-family="Poppins" font-weight="700" font-size="${P(30)}" fill="#fff">Collections</text>
  <rect x="${x + P(40)}" y="${y + P(590)}" width="${P(300)}" height="${P(300)}" rx="${P(34)}" fill="url(#gCard)"/>
  <text x="${x + P(66)}" y="${y + P(642)}" font-family="Poppins" font-weight="700" font-size="${P(28)}" fill="#fff">Sons de l'eau</text>
  <text x="${x + P(66)}" y="${y + P(674)}" font-family="Poppins" font-weight="400" font-size="${P(18)}" fill="#dbe6ff">32 sons</text>
  <rect x="${x + P(360)}" y="${y + P(590)}" width="${P(200)}" height="${P(300)}" rx="${P(34)}" fill="url(#gCard)" opacity=".8"/>
  <text x="${x + P(384)}" y="${y + P(642)}" font-family="Poppins" font-weight="700" font-size="${P(28)}" fill="#fff">À la plage</text>
  <text x="${x + P(40)}" y="${y + P(950)}" font-family="Poppins" font-weight="600" font-size="${P(17)}" letter-spacing="${P(4)}" fill="#b8bdd6">SONS DE L'EAU</text>
  <rect x="${x + P(40)}" y="${y + P(975)}" width="${w - P(80)}" height="${P(110)}" rx="${P(26)}" fill="#1a2350" stroke="${C.rain}" stroke-width="${P(4)}"/>
  <rect x="${x + P(56)}" y="${y + P(990)}" width="${P(80)}" height="${P(80)}" rx="${P(18)}" fill="url(#gCard)"/>
  <text x="${x + P(156)}" y="${y + P(1028)}" font-family="Poppins" font-weight="700" font-size="${P(26)}" fill="#fff">Pluie régulière</text>
  <text x="${x + P(156)}" y="${y + P(1060)}" font-family="Poppins" font-weight="400" font-size="${P(18)}" fill="#b8c4ee">titre à confirmer</text>
  <circle cx="${x + w - P(90)}" cy="${y + P(1030)}" r="${P(30)}" fill="#fff"/>
  <path d="M${x + w - P(98)} ${y + P(1016)} l${P(24)} ${P(14)} l-${P(24)} ${P(14)} z" fill="#1a2350"/>
  <circle cx="${x + w - P(90)}" cy="${y + P(1030)}" r="${P(56)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="${P(4)}"/>
  </g>`;
}

function listenIcon(x, y, s = 120) {
  return `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.23}" fill="#05060c" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>
  <circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s * 0.3}" fill="none" stroke="url(#gNeon)" stroke-width="${s * 0.075}" filter="url(#fGlowN)"/>`;
}

// mur en coupe (immeuble) : chambre à gauche, cuisine voisine à droite
function wallCut({ rain = false, eyes = "open" } = {}) {
  let s = `
  <!-- plancher / plafond en coupe -->
  <rect x="0" y="1200" width="1080" height="720" fill="#1b1830"/>
  ${[0, 1, 2].map((i) => `<rect x="${80 + i * 330}" y="1300" width="230" height="300" rx="6" fill="#24203d"/><rect x="${80 + i * 330}" y="1300" width="230" height="300" rx="6" fill="none" stroke="#3a3352" stroke-width="4"/>`).join("")}
  <rect x="0" y="1700" width="1080" height="70" fill="#2a2440"/>
  <rect x="0" y="1080" width="1080" height="120" fill="#2a2440"/><rect x="0" y="1080" width="1080" height="10" fill="#4a3f66"/>
  <rect x="0" y="420" width="1080" height="70" fill="#2a2440"/>
  <!-- chambre -->
  <rect x="0" y="490" width="610" height="590" fill="#1a1f45"/>
  <!-- cuisine voisine (plus chaude, en chantier) -->
  <rect x="680" y="490" width="400" height="590" fill="#2b2238"/>
  <rect x="740" y="860" width="320" height="220" fill="#3a3046"/><rect x="740" y="850" width="320" height="18" fill="#6c5c78"/>
  <rect x="770" y="600" width="140" height="110" fill="#3a3046" stroke="#6c5c78" stroke-width="4" stroke-dasharray="10 8"/>
  <!-- mur coupé, hachuré -->
  <rect x="610" y="420" width="70" height="780" fill="url(#pHatch)"/>
  <!-- voisin-mannequin à la perceuse -->
  <ellipse cx="860" cy="1072" rx="70" ry="12" fill="#000" opacity=".4"/>
  <rect x="830" y="900" width="26" height="170" rx="12" fill="#3d3550"/><rect x="866" y="900" width="26" height="170" rx="12" fill="#3d3550"/>
  <rect x="815" y="760" width="90" height="160" rx="30" fill="#c0603e"/>
  <circle cx="860" cy="715" r="44" fill="url(#gSkin)"/>
  <path d="M812 705 q48 -60 96 0 z" fill="${C.amber}"/>
  <rect x="740" y="790" width="100" height="24" rx="12" fill="#c0603e"/>
  <rect x="705" y="778" width="62" height="40" rx="8" fill="#2f3b2f"/><rect x="684" y="792" width="26" height="10" fill="#9aa"/>`;
  // lit + perso + table de nuit + téléphone dans la chambre
  s += `
  <ellipse cx="300" cy="1075" rx="280" ry="16" fill="#000" opacity=".4"/>
  <rect x="60" y="930" width="470" height="140" rx="14" fill="url(#gWood)"/>
  <rect x="60" y="890" width="470" height="50" rx="14" fill="#cfc8bb"/>
  <rect x="90" y="845" width="130" height="60" rx="26" fill="url(#gPillow)"/>
  <circle cx="160" cy="845" r="48" fill="url(#gSkin)"/>
  ${eyes === "open"
    ? `<circle cx="146" cy="838" r="10" fill="#fff"/><circle cx="178" cy="838" r="10" fill="#fff"/><circle cx="147" cy="840" r="4.5" fill="#1a1a2a"/><circle cx="179" cy="840" r="4.5" fill="#1a1a2a"/>`
    : `<path d="M136 840 q10 8 20 0 M168 840 q10 8 20 0" stroke="#5b4636" stroke-width="5" fill="none" stroke-linecap="round"/>`}
  <path d="M200 880 h330 v60 h-330 z" fill="url(#gDuvet)"/>
  <rect x="540" y="930" width="66" height="140" rx="8" fill="url(#gWood)"/>
  <rect x="548" y="908" width="48" height="24" rx="6" fill="#0b0d1a" ${rain ? `stroke="url(#gNeon)" stroke-width="4" filter="url(#fGlowN)"` : `stroke="#fff" stroke-opacity=".25" stroke-width="2"`}/>`;
  return s;
}


// plante de pied en chaussette, vue de face (talon en bas, orteils en haut) ; dir=-1 miroir
function sole(cx, cy, dir = 1, k = 1.7) {
  const P = "M-34 92 Q-52 30 -56 -30 Q-62 -98 -10 -110 Q52 -120 58 -58 Q60 -20 34 8 Q20 30 34 62 Q38 112 -2 114 Q-30 114 -34 92 Z";
  return `<g transform="translate(${cx} ${cy}) scale(${k * dir} ${k})">
    <ellipse cx="0" cy="125" rx="60" ry="14" fill="#000" opacity=".25"/>
    <clipPath id="cs${cx}"><path d="${P}"/></clipPath>
    <path d="${P}" fill="${C.amber}"/>
    <g clip-path="url(#cs${cx})"><ellipse cx="0" cy="-92" rx="70" ry="40" fill="#d9963c"/><ellipse cx="-4" cy="100" rx="46" ry="30" fill="#d9963c"/>
    <path d="M-48 -20 Q0 -8 50 -24" stroke="#e3a447" stroke-width="5" fill="none"/></g>
    <path d="M-30 -104 q8 -8 16 0 M-8 -110 q9 -9 18 0 M14 -108 q8 -8 16 0 M34 -96 q7 -7 14 2" stroke="#c9862f" stroke-width="3" fill="none"/>
    <path d="${P}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
  </g>`;
}
// coupe du lit : couette en strates, poche d'air, drap, matelas, cadre
function cutStrata() {
  return `<rect x="0" y="420" width="1080" height="600" fill="#2c3878"/>
  <rect x="0" y="420" width="1080" height="70" fill="#3d4c96"/><rect x="0" y="560" width="1080" height="110" fill="#33418a" opacity=".75"/><rect x="0" y="720" width="1080" height="90" fill="#25306a" opacity=".8"/>
  <path d="M-20 820 Q300 790 560 800 Q620 600 700 610 Q800 620 790 820 Q790 1010 700 1012 H-20 Z" fill="#151a45"/>
  <rect x="0" y="1010" width="1080" height="150" fill="#d9d2c4"/><rect x="0" y="1050" width="1080" height="8" fill="#c3baa9"/><rect x="0" y="1110" width="1080" height="8" fill="#c3baa9"/>
  <rect x="0" y="1160" width="1080" height="760" fill="url(#gWood)"/><rect x="0" y="1160" width="1080" height="16" fill="#6a5a80"/>`;
}
const LEG = "M-20 860 L560 868 C600 860 615 800 625 740 Q635 670 680 655 Q730 645 735 700 L738 900 Q740 1008 670 1008 Q620 1008 585 990 C500 1008 380 1012 260 1000 L-20 1004 Z";
function legSide() {
  return `<path d="${LEG}" fill="url(#gSkin)"/>
  <path d="M-20 860 L560 868" stroke="#f0d2b4" stroke-width="6" opacity=".6"/>
  <path d="M120 1002 Q 300 1020 520 996" stroke="#000" stroke-opacity=".12" stroke-width="10" fill="none"/>`;
}
function sockSide() {
  const SOCK = "M500 864 L560 868 C600 860 615 800 625 740 Q635 670 680 655 Q730 645 735 700 L738 900 Q740 1008 670 1008 Q620 1008 585 990 C560 998 530 1002 500 1004 Z";
  return `<clipPath id="cSock"><path d="${SOCK}"/></clipPath>
  <path d="${SOCK}" fill="${C.amber}"/>
  <g clip-path="url(#cSock)"><ellipse cx="700" cy="660" rx="60" ry="50" fill="#d9963c"/><ellipse cx="700" cy="990" rx="70" ry="48" fill="#d9963c"/>
  <rect x="500" y="850" width="14" height="170" fill="#d9963c"/><rect x="526" y="850" width="14" height="170" fill="#d9963c"/></g>
  <path d="${SOCK}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`;
}

// ---------- scènes ----------
const scenes = [
  { id: "01", name: "RÉVEIL", t: "0–3 s", seam: "bascule en plongée",
    note: "<b>Le titre se compose mot à mot</b> pendant un zoom avant lent sur la carte du lit. Le téléphone est déjà là, noir. Seam : la caméra bascule en plongée.",
    svg: () => floorTop() + `<g transform="translate(-170 -170) scale(1.32)">${bedTop(400, 640)}</g>` + pill(250, 560, "07:00", 232, 712, { dot: C.amber }) +
      title2("LES NUITS BLANCHES · ÉPISODE 3", "Pourquoi tu *dors*", "toujours pas ?", 280) +
      caption("à *sept heures.*") },
  { id: "02", name: "INSOMNIE", t: "3–8,7 s", seam: "continu",
    note: "<b>La lampe s'éteint, les yeux s'ouvrent</b> (pop). Le réveil défile 23:04 → 00:04, la pastille « +1 h » se pose. Pas de moutons.",
    svg: () => bg() + floorIso(1150) + `<g transform="translate(-130 -60) scale(1.3)">${bedIso(360, 640, { clock: "00:04" })}</g>` + pill(220, 560, "+1 h", 210, 777, { dot: C.amber }) +
      pill(720, 560, "yeux : grands ouverts", 581, 772) +
      caption("mais *impossible*") },
  { id: "03", name: "OREILLER", t: "8,7–13,7 s", seam: "travelling vers le pied du lit",
    note: "<b>L'oreiller se retourne 5 fois</b> (compteur), le 6ᵉ reste figé en l'air. Puis 3 points ambre s'allument au-dessus du lit : le sommaire.",
    svg: () => bg() + floorIso(1250) + `<g transform="translate(-130 -60) scale(1.3)">${bedIso(360, 760, { pillowUp: true })}</g>` +
      `<g transform="rotate(-18 520 560)"><rect x="410" y="510" width="220" height="110" rx="45" fill="url(#gPillow)"/></g>
      <path d="M380 640 q-40 -60 10 -120" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none" stroke-dasharray="4 14" stroke-linecap="round"/>` +
      pill(740, 470, "6ᵉ fois ?", 600, 540) +
      `<g filter="url(#fGlowS)"><circle cx="330" cy="330" r="22" fill="${C.amber}"/><circle cx="500" cy="330" r="22" fill="${C.amber}"/><circle cx="670" cy="330" r="22" fill="${C.amber}"/></g>
      <text x="500" y="250" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="500" font-size="54" fill="${C.cream}">trois choses</text>` +
      caption("ces *trois choses.*") },
  { id: "04", name: "CHAUSSETTES", t: "13,7–16,9 s", seam: "la couette se coupe (vue en coupe)",
    note: "<b>Caméra au pied du lit.</b> Le 1er point ambre devient « 1 ». Les deux plantes de pied dépassent de la couette ; les chaussettes glissent dessus (talon et pointe contrastés). Au fond, la tête dépasse.",
    svg: () => bg() + floorIso(1250) + bigNum("1", "Mets des chaussettes.") +
      `<circle cx="520" cy="640" r="70" fill="url(#gSkin)"/>
       <circle cx="497" cy="632" r="10" fill="#fff"/><circle cx="543" cy="632" r="10" fill="#fff"/><circle cx="498" cy="634" r="4.5" fill="#1a1a2a"/><circle cx="544" cy="634" r="4.5" fill="#1a1a2a"/>
       <path d="M120 1100 Q160 700 520 690 Q880 700 920 1100 Z" fill="url(#gDuvet)"/>
       <path d="M150 960 Q520 860 890 960" stroke="#5868b0" stroke-width="6" fill="none" opacity=".6"/>
       ${sole(380, 930, 1, 1.35)}${sole(660, 930, -1, 1.35)}
       <path d="M80 1080 h880 v40 h-880z" fill="#cfc8bb"/>
       <rect x="60" y="1110" width="920" height="170" rx="18" fill="url(#gWood)"/><rect x="60" y="1110" width="920" height="16" fill="#6a5a80"/>` +
      pill(220, 560, "chaussettes", 340, 820, { dot: C.amber }) +
      pill(800, 520, "t'as chaud", 585, 600) +
      caption("mets des *chaussettes.*", 1400) },
  { id: "05", name: "PARADOXE", t: "16,9–22,6 s", seam: "continu",
    note: "<b>La couette se coupe comme le sol chez Catcharium</b> : strates de tissu, et dessous la jambe de profil, pied orteils en l'air. La chaussette se met à luire ambre.",
    svg: () => bg() + cutStrata() +
      `${legSide()}<g filter="url(#fGlowA)">${sockSide()}</g>` +
      pill(260, 560, "corps : à refroidir", 220, 925) +
      pill(840, 520, "pieds : chauds", 690, 720, { dot: C.amber }) +
      caption("à *refroidir.*", 1330) },
  { id: "06", name: "VAISSEAUX", t: "22,6–31,7 s", seam: "la coupe se referme, caméra monte vers la tête",
    note: "<b>Trois lignes de points (vaisseaux) suivent la jambe jusqu'au pied</b> et s'écartent sur « dilate » ; puis les points ambre s'échappent du pied en arcs, comme le « thud ». La jauge descend 37,2 → 36,8.",
    svg: () => bg() + cutStrata() + legSide() + `<g opacity=".9">${sockSide()}</g>` +
      dots([[0, 895], [540, 900], [610, 830], [650, 720]], { color: C.amber, r: 7 }) +
      dots([[0, 930], [560, 935], [650, 860], [690, 730]], { color: C.amber, r: 7 }) +
      dots([[0, 965], [580, 968], [690, 930], [715, 780]], { color: C.amber, r: 7 }) +
      dots(arc(700, 800, 130, -80, 60), { color: C.amber, r: 7, opacity: .9 }) + dots(arc(700, 800, 220, -70, 50), { color: C.amber, r: 7, opacity: .7 }) + dots(arc(700, 800, 310, -60, 40), { color: C.amber, r: 7, opacity: .5 }) +
      pill(250, 1100, "petits vaisseaux", 250, 965, { dot: C.amber }) +
      `<g><rect x="80" y="160" width="300" height="200" rx="30" fill="#14162a" fill-opacity=".82" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
       <text x="110" y="215" font-family="Nunito" font-weight="800" font-size="28" fill="${C.cream}" fill-opacity=".8">temp. interne</text>
       <text x="110" y="300" font-family="Fraunces" font-style="italic" font-weight="700" font-size="76" fill="${C.cream}">36,8°</text>
       <text x="320" y="300" font-family="Nunito" font-weight="900" font-size="56" fill="${C.amber}">↓</text></g>` +
      caption("La chaleur *dilate*", 1330) },
  { id: "07", name: "AGENDA", t: "31,7–40,3 s", seam: "continu (l'orbite se vide)",
    note: "<b>Une orbite de points blancs tourne autour de la tête</b> et accélère ; les pastilles de la semaine défilent dessus. Gag méta : « SAM · planifier dimanche ».",
    svg: () => bg() +
      `<circle cx="500" cy="760" r="170" fill="url(#gSkin)"/>
       <circle cx="440" cy="740" r="18" fill="#fff"/><circle cx="560" cy="740" r="18" fill="#fff"/><circle cx="442" cy="744" r="8" fill="#1a1a2a"/><circle cx="562" cy="744" r="8" fill="#1a1a2a"/>
       <rect x="370" y="900" width="260" height="380" rx="120" fill="url(#gDuvet)"/><path d="M0 1080 q540 -120 1080 0 V1920 H0 Z" fill="url(#gDuvet)"/><path d="M0 1080 q540 -120 1080 0 v36 q-540 -120 -1080 0 Z" fill="#5868b0"/>` +
      dots(ellipsePts(500, 760, 400, 230), { step: 30, r: 7 }) +
      pill(250, 545, "LUN · réunion 9 h", 220, 600) + pill(800, 570, "MAR · rappeler le proprio", 820, 620, {size: 34}) +
      pill(840, 960, "MER · sport ?", 860, 900) + pill(200, 990, "JEU · un cadeau", 170, 900) +
      pill(500, 1110, "SAM · planifier dimanche", 520, 990, { dot: C.amber, size: 36 }) +
      title("TA TÊTE, À 00:30", "*Toute* ta semaine.", 300) +
      caption("*toute ta semaine.*", 1330) },
  { id: "08", name: "SHUFFLE", t: "40,3–47,3 s", seam: "continu",
    note: "<b>Les pastilles de la semaine tombent hors champ.</b> La bulle de pensée est vue du dessus comme l'étang (courbes de niveau). Un seul objet à la fois : pomme → parapluie → chaise.",
    svg: () => bg() + `<path d="M0 1560 q540 -100 1080 0 V1920 H0 Z" fill="url(#gDuvet)"/><circle cx="540" cy="1620" r="150" fill="url(#gSkin)"/><circle cx="490" cy="1600" r="15" fill="#fff"/><circle cx="590" cy="1600" r="15" fill="#fff"/><circle cx="491" cy="1604" r="7" fill="#1a1a2a"/><circle cx="591" cy="1604" r="7" fill="#1a1a2a"/><path d="M0 1700 q540 -90 1080 0 V1920 H0 Z" fill="url(#gDuvet)"/><g fill="#fff" opacity=".5"><circle cx="560" cy="1440" r="14"/><circle cx="580" cy="1380" r="20"/></g>` + bigNum("2", "Occupe ton esprit.") +
      `<ellipse cx="500" cy="840" rx="380" ry="330" fill="#1a2058" stroke="#fff" stroke-opacity=".2" stroke-width="3"/>
       <ellipse cx="500" cy="840" rx="300" ry="255" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>
       <ellipse cx="500" cy="840" rx="210" ry="175" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="2"/>
       <ellipse cx="500" cy="920" rx="110" ry="22" fill="#000" opacity=".35" filter="url(#fBlurL)"/>
       <circle cx="470" cy="840" r="85" fill="#d4513f"/><circle cx="540" cy="840" r="85" fill="#c4473a"/>
       <ellipse cx="460" cy="805" rx="30" ry="18" fill="#fff" opacity=".35"/>
       <path d="M505 760 q5 -40 25 -55" stroke="#5a3a25" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M520 735 q40 -30 70 -5 q-35 25 -70 5z" fill="#6aa04a"/>` +
      pill(780, 640, "pomme", 600, 800, { dot: C.amber }) +
      pill(260, 1110, "quelques secondes ◔", 380, 980) +
      caption("Imagine *une pomme.*") },
  { id: "09", name: "SANS LIEN", t: "47,3–53,6 s", seam: "continu",
    note: "<b>Un chemin de points essaie de relier les 3 objets</b> puis s'effrite. Les pastilles « histoire » et « liste » se barrent d'un trait ambre.",
    svg: () => bg() + `<path d="M0 1560 q540 -100 1080 0 V1920 H0 Z" fill="url(#gDuvet)"/><circle cx="540" cy="1620" r="150" fill="url(#gSkin)"/><circle cx="490" cy="1600" r="15" fill="#fff"/><circle cx="590" cy="1600" r="15" fill="#fff"/><circle cx="491" cy="1604" r="7" fill="#1a1a2a"/><circle cx="591" cy="1604" r="7" fill="#1a1a2a"/><path d="M0 1700 q540 -90 1080 0 V1920 H0 Z" fill="url(#gDuvet)"/><g fill="#fff" opacity=".5"><circle cx="560" cy="1440" r="14"/><circle cx="580" cy="1380" r="20"/></g>` +
      `<ellipse cx="500" cy="800" rx="420" ry="360" fill="#1a2058" stroke="#fff" stroke-opacity=".2" stroke-width="3"/>
       <ellipse cx="500" cy="800" rx="320" ry="270" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="2"/>
       <circle cx="290" cy="660" r="62" fill="#d4513f"/><path d="M290 600 q5 -25 20 -35" stroke="#5a3a25" stroke-width="8" fill="none"/>
       <path d="M640 600 q90 -90 180 0 z" fill="#5f7fd0"/><line x1="730" y1="600" x2="730" y2="720" stroke="#ddd" stroke-width="8"/><path d="M730 720 q0 20 -20 20" stroke="#ddd" stroke-width="8" fill="none"/>
       <ellipse cx="520" cy="1000" rx="90" ry="14" fill="#000" opacity=".35"/><path d="M450 780 h22 v120 h-22z" fill="#a8743f"/><path d="M452 790 h20 v30 h-20z" fill="#c08a52"/><path d="M440 900 h170 l-10 26 h-150z" fill="#c08a52"/><path d="M452 926 h16 v70 h-16z M582 926 h16 v70 h-16z" fill="#8f6236"/><path d="M500 926 h12 v56 h-12z M548 926 h12 v56 h-12z" fill="#6f4a28" opacity=".7"/>` +
      dots([[350, 680], [470, 720], [560, 740], [660, 700]], { step: 30, r: 7, gapEvery: 5, opacity: .7 }) +
      dots([[700, 760], [620, 850]], { step: 30, r: 7, gapEvery: 4, opacity: .4 }) +
      `<g>${pill(280, 1110, "histoire", undefined, undefined)}<line x1="190" y1="1110" x2="370" y2="1110" stroke="${C.amber}" stroke-width="7"/></g>
       <g>${pill(700, 1110, "liste", undefined, undefined)}<line x1="635" y1="1110" x2="765" y2="1110" stroke="${C.amber}" stroke-width="7"/></g>` +
      title("PAS D'HISTOIRE, PAS DE LISTE", "*Sans lien.*", 300) +
      caption("*sans lien* entre eux.") },
  { id: "10", name: "LE NOM", t: "53,6–61,3 s", seam: "travelling latéral, le mur se coupe",
    note: "<b>Le titre arrive en serif</b> ; la boucle de pensées se déroule en ligne droite et s'éteint ; les paupières tombent à moitié.",
    svg: () => bg() + title2("ASTUCE 2 · ÇA S'APPELLE", "cognitive", "*shuffle*", 300) +
      `<circle cx="500" cy="820" r="150" fill="url(#gSkin)"/>
       <circle cx="447" cy="810" r="16" fill="#fff"/><circle cx="553" cy="810" r="16" fill="#fff"/><circle cx="448" cy="815" r="7" fill="#1a1a2a"/><circle cx="554" cy="815" r="7" fill="#1a1a2a"/>
       <rect x="425" y="790" width="45" height="18" fill="${C.skin}"/><rect x="531" y="790" width="45" height="18" fill="${C.skin}"/>
       <rect x="380" y="950" width="240" height="320" rx="110" fill="url(#gDuvet)"/><path d="M0 1080 q540 -120 1080 0 V1920 H0 Z" fill="url(#gDuvet)"/><path d="M0 1080 q540 -120 1080 0 v36 q-540 -120 -1080 0 Z" fill="#5868b0"/>` +
      dots(ellipsePts(500, 820, 320, 200, 180, 400), { step: 30, r: 7, opacity: .85 }) +
      dots([[500 + 320 * Math.cos(40 * Math.PI / 180), 820 + 200 * Math.sin(40 * Math.PI / 180)], [960, 1100]], { step: 34, r: 6, opacity: .35 }) +
      pill(800, 620, "à tester", 760, 720, { dot: C.amber }) +
      caption("qui *tournent en boucle.*") },
  { id: "11", name: "VOISIN", t: "61,3–70,5 s", seam: "zoom dans le téléphone",
    note: "<b>Paupières presque fermées</b>, puis la caméra recule et le mur se coupe. Sur « cuisine » : arcs de points saccadés à travers la cloison, pastille « BRRRRR », les yeux s'ouvrent d'un coup.",
    svg: () => bg() + wallCut() +
      dots(arc(700, 800, 120, 140, 220), { step: 26, r: 7, gapEvery: 3 }) + dots(arc(700, 800, 220, 145, 215), { step: 26, r: 7, gapEvery: 3, opacity: .8 }) + dots(arc(700, 800, 330, 150, 210), { step: 26, r: 7, gapEvery: 3, opacity: .6 }) +
      pill(800, 340, "BRRRRR", 700, 798) + pill(230, 660, "presque…", 160, 800) +
      title("00:41", "", 200) +
      caption("refaire *toute sa cuisine.*", 1380) },
  { id: "12", name: "LISTEN", t: "70,5–77,4 s", seam: "dézoom hors du téléphone",
    note: "<b>Premier néon du film</b> : le téléphone s'allume, la caméra plonge dans l'écran. Interface reconstruite d'après les captures ; le doigt-point tape la carte pluie.",
    svg: () => bg() + `<ellipse cx="500" cy="820" rx="460" ry="620" fill="${C.violet}" opacity=".18" filter="url(#fBlurL)"/>` +
      phoneUI(250, 300, 500) +
      `<text x="120" y="330" font-family="Fraunces" font-style="italic" font-weight="700" font-size="200" fill="${C.amber}" filter="url(#fShadow)">3</text>` +
      pill(860, 470, "Listen", 760, 420, { dot: C.cyan }) +
      caption("une *pluie régulière*", 1450) },
  { id: "13", name: "PLUIE · PLAN TENU", t: "77,4–80,7 s", seam: "bascule vers la vue du dessus",
    note: "<b>Plan tenu.</b> Des arcs bleus doux sortent du téléphone et recouvrent ceux de la perceuse, qui s'éteignent. Pluie fine en points. Les yeux se ferment. Rien d'autre ne bouge.",
    svg: () => bg() + wallCut({ rain: true, eyes: "closed" }) +
      dots(arc(700, 800, 220, 145, 215), { step: 26, r: 6, gapEvery: 3, opacity: .18 }) +
      dots(arc(572, 910, 140, 190, 330), { step: 22, r: 7, color: C.rain, glow: "fGlowB" }) +
      dots(arc(572, 910, 250, 195, 325), { step: 22, r: 7, color: C.rain, glow: "fGlowB", opacity: .8 }) +
      dots(arc(572, 910, 370, 200, 320), { step: 22, r: 7, color: C.rain, glow: "fGlowB", opacity: .6 }) +
      Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 137) % 1060 + 10}" cy="${(i * 263) % 560 + 500}" r="4" fill="${C.rain}" opacity=".5"/>`).join("") +
      pill(330, 360, "pluie régulière", 572, 905, { dot: C.rain }) +
      caption("*accompagner le moment.*", 1380) },
  { id: "14", name: "ET TOI ?", t: "80,7–85 s", seam: "fin",
    note: "<b>Rappel exact du cadre 01</b> : même vue du dessus, mais le perso dort, le téléphone diffuse la pluie. Titre « Et toi ? » ; signature Listen en bas de la zone utile.",
    svg: () => floorTop() + `<g transform="translate(-170 -170) scale(1.32)">${bedTop(400, 640, { eyes: "closed", phone: "on", clock: "00:12" })}</g>` +
      pill(820, 700, "Zz", 708, 670) +
      title("LES NUITS BLANCHES · ÉPISODE 3", "Et *toi* ?", 300) +
      pill(500, 410, "dis-le en commentaire ↓", undefined, undefined, { size: 34 }) +
      caption("C'est quoi *tes astuces* ?", 1240) +
      `<rect x="140" y="1330" width="720" height="150" rx="40" fill="#0b0d1a" fill-opacity=".85" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>` +
      listenIcon(170, 1350, 110) +
      `<text x="310" y="1405" font-family="Poppins" font-weight="700" font-size="44" fill="#fff">Listen</text>
       <text x="310" y="1450" font-family="Poppins" font-weight="400" font-size="27" fill="#b8bdd6">Sounds of the World · App Store</text>` },
];

// zones TikTok (repère de relecture)
const safe = `<g opacity=".55" fill="none" stroke="#ff6b6b" stroke-width="3" stroke-dasharray="14 10">
  <rect x="920" y="780" width="150" height="740"/><rect x="0" y="1530" width="1080" height="390"/><rect x="0" y="0" width="1080" height="150"/></g>`;

const defs = `<svg width="0" height="0" style="position:absolute"><defs>
  <radialGradient id="gNight" cx="50%" cy="42%" r="75%"><stop offset="0" stop-color="${C.night1}"/><stop offset="1" stop-color="${C.night0}"/></radialGradient>
  <radialGradient id="gVig" cx="50%" cy="45%" r="75%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
  <linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2150"/><stop offset="1" stop-color="#0f1230"/></linearGradient>
  <radialGradient id="gFog" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${C.fog}" stop-opacity=".22"/><stop offset="1" stop-color="${C.fog}" stop-opacity="0"/></radialGradient>
  <linearGradient id="gDuvet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.duvet}"/><stop offset="1" stop-color="${C.duvetDark}"/></linearGradient>
  <linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.wood}"/><stop offset="1" stop-color="${C.woodDark}"/></linearGradient>
  <radialGradient id="gPillow" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#f4f0e8"/><stop offset="1" stop-color="#c9c2b6"/></radialGradient>
  <radialGradient id="gSkin" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#e8c4a2"/><stop offset="1" stop-color="${C.skinDark}"/></radialGradient>
  <linearGradient id="gNeon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.magenta}"/></linearGradient>
  <linearGradient id="gCard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a7fb8"/><stop offset="1" stop-color="#1d4f86"/></linearGradient>
  <pattern id="pHatch" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="#3a3352"/><line x1="0" y1="0" x2="0" y2="18" stroke="#5a5078" stroke-width="6"/></pattern>
  <filter id="fGlowS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="fGlowB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="fGlowA" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="fGlowN" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="fBlurL" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="fShadow" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity=".55"/></filter>
  <filter id="fGrain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter>
</defs></svg>`;

const cell = (s) => `<article class="cell" id="frame-${s.id}">
  <div class="frame"><svg viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">${s.svg()}${grain()}<g class="safe">${safe}</g></svg></div>
  <div class="label"><span>${s.id} · ${s.name}</span><span>${s.t}</span></div>
  <p class="note">${s.note}</p>
  <span class="chip">→ ${s.seam}</span>
</article>`;

const seamMap = `<article class="cell meta"><h3>Raccords</h3><ol class="seams">${scenes.map((s) => `<li><b>${s.id}</b> ${s.seam}</li>`).join("")}</ol>
<p class="note"><b>Règle de direction :</b> la caméra descend dans le corps (01→06), remonte à la tête (07→10), recule à travers le mur (11), plonge dans le téléphone (12), ressort (13) et revient au cadre d'ouverture (14). Jamais de carte posée sur une autre.</p></article>`;

const tokens = `<article class="cell meta"><h3>Tokens</h3>
<div class="sw">${[["nuit", C.night0], ["nuit 2", C.night1], ["brouillard", C.fog], ["ambre", C.amber], ["crème", C.cream], ["pluie", C.rain], ["néon (12–14)", "linear-gradient(135deg,#3BD6F5,#7B5CFF,#E04FD8)"]].map(([n, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join("")}</div>
<p class="type"><span style="font-family:Fraunces;font-style:italic;font-weight:700;font-size:28px">Fraunces Italic</span> titres · <span style="font-family:Nunito;font-weight:900">Nunito 900</span> sous-titres / pastilles · <span style="font-family:Poppins;font-weight:600">Poppins</span> UI Listen</p>
<p class="note"><b>Interdits :</b> diaporama ; économiseur d'écran ; néon avant 12 ; fausse fonctionnalité Listen ; vocabulaire médical. <b>Pointillés rouges</b> sur chaque cadre = zones masquées par l'interface TikTok (icônes à droite, légende en bas, onglets en haut).</p></article>`;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Listen — Nuits blanches ép. 3 · storyboard ${VERSION}</title>
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
header p{opacity:.8;font-size:17px;flex:1 1 400px}
.tag{border:1px solid #ffffff33;border-radius:99px;padding:6px 14px;font-weight:800;font-size:14px;letter-spacing:.06em}
.toggle{font-size:14px;opacity:.85}
main{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:28px}
.cell{display:flex;flex-direction:column;gap:8px}
.frame{aspect-ratio:9/16;border-radius:14px;overflow:hidden;background:${C.night0};box-shadow:0 10px 30px #0008}
.frame svg{width:100%;height:100%;display:block}
.label{display:flex;justify-content:space-between;font-weight:900;font-size:13px;letter-spacing:.06em;opacity:.9}
.note{font-size:14px;line-height:1.45;opacity:.85}
.note b{color:${C.amber}}
.chip{align-self:flex-start;font-size:12px;font-weight:800;border-radius:99px;padding:4px 10px;background:#ffffff14}
.meta{background:#ffffff08;border:1px solid #ffffff14;border-radius:14px;padding:18px}
.meta h3{font-family:Fraunces;font-style:italic;font-size:26px;margin-bottom:10px}
.seams{font-size:13px;line-height:1.7;padding-left:18px;margin-bottom:10px}
.sw{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px}.sw span{display:flex;align-items:center;gap:6px;font-size:13px}
.sw i{width:22px;height:22px;border-radius:6px;display:inline-block;border:1px solid #fff3}
.type{font-size:14px;margin-bottom:10px;line-height:1.6}
#hide:checked ~ main .safe{display:none}
</style></head><body>
<input type="checkbox" id="hide" hidden>
<header><h1>Listen — <em>Nuits blanches</em>, ép. 3 · ${VERSION}</h1>
<p>Croquis statiques (pas d'animation) : cadrage, hiérarchie et textes à valider. Les sous-titres montrent un moment-clé de la phrase ; les durées sont estimées, la voix fera foi.</p>
<span class="tag">1080×1920 · ~75–85 s · 14 scènes</span>
<label class="toggle" for="hide">☐ masquer les zones TikTok</label></header>
${defs}
<main>${scenes.map(cell).join("\n")}${seamMap}${tokens}</main>
</body></html>`;

writeFileSync(new URL("../storyboard.html", import.meta.url), html);
console.log("storyboard.html écrit —", scenes.length, "scènes");
