// Génère storyboard.html — « Astronaute » (épisode Listen, décors immersifs). Croquis statiques 9:16.   node scripts/build-storyboard.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
global.window = {};
global.gsap = { set() {} };
require("../kit/kit.js");
const L = window.LS, C = L.C, AMB = C.amber, CREAM = C.cream;
const STEEL = "#7fa6d6", RED = "#e0674d";
const VERSION = "v1";
const font = (f) => `url(data:font/woff2;base64,${readFileSync(new URL(`../assets/fonts/${f}`, import.meta.url)).toString("base64")})`;

// ---------- aides génériques ----------
function cap(id, str, y = 450) {
  const lines = str.split("\n");
  return lines.map((ln, i) => {
    const n = ln.replace(/\*/g, "").length, size = Math.min(76, Math.round(900 / (n * 0.52)));
    const parts = ln.split(/(\*[^*]+\*)/).filter(Boolean).map((p) => (p.startsWith("*") ? `<tspan fill="${AMB}">${L.esc(p.slice(1, -1))}</tspan>` : L.esc(p)));
    return `<text x="540" y="${y + i * 84}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${size}" fill="#fff" filter="url(#${id}-fShadow)">${parts.join("")}</text>`;
  }).join("");
}
const dark = (op = 0.3) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#04050d" opacity="${op}"/>`;
const vig = (id, n = 1) => Array.from({ length: n }, () => `<rect x="-200" y="-200" width="1480" height="2320" fill="url(#${id}-gVig)"/>`).join("");
const rnd = (seed) => { let k = seed; return () => ((k = (k * 9301 + 49297) % 233280) / 233280); };
const stars = (n, seed, y0 = 0, y1 = 1920, op = 0.8) => { const r = rnd(seed); return Array.from({ length: n }, () => { const x = r() * 1080, y = y0 + r() * (y1 - y0), s = r(); return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(0.8 + s * 2).toFixed(1)}" fill="#fff" opacity="${(op * (0.3 + s * 0.7)).toFixed(2)}"/>`; }).join(""); };
const badge = (n, x = 110, y = 300) => `<g><circle cx="${x}" cy="${y}" r="54" fill="${AMB}"/><text x="${x}" y="${y + 24}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="72" fill="#1a1a2a">${n}</text><text x="${x}" y="${y + 86}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="20" letter-spacing="4" fill="${CREAM}" opacity=".8">NOUVELLE</text></g>`;
const tag = (x, y, txt, tx, ty) => `<g><line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${AMB}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="9" fill="${AMB}"/><rect x="${tx - 8}" y="${ty - 36}" width="${txt.length * 17 + 36}" height="56" rx="28" fill="#10142e" stroke="${AMB}" stroke-width="3"/><text x="${tx + 10}" y="${ty + 2}" font-family="Nunito" font-weight="800" font-size="26" fill="#fff">${L.esc(txt)}</text></g>`;

// ---------- décors ----------
function earth(id, cx, cy, r, o = {}) {
  const r_ = rnd(o.seed || 5);
  const clouds = Array.from({ length: 9 }, () => { const a = r_() * 6.28, d = r_() * r * 0.8, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.8, w = 60 + r_() * 160; return `<path d="M${x - w} ${y} q${w * 0.5} ${-w * 0.25} ${w} ${-w * 0.05} t${w} ${w * 0.05}" stroke="#fff" stroke-opacity=".38" stroke-width="${10 + r_() * 12}" stroke-linecap="round" fill="none"/>`; }).join("");
  const land = `<path d="M${cx - r * 0.5} ${cy - r * 0.1} q${r * 0.2} ${-r * 0.35} ${r * 0.45} ${-r * 0.1} q${r * 0.2} ${r * 0.25} ${-r * 0.05} ${r * 0.4} q${-r * 0.3} ${r * 0.1} ${-r * 0.4} ${-r * 0.3}z M${cx + r * 0.15} ${cy + r * 0.3} q${r * 0.3} ${-r * 0.1} ${r * 0.4} ${r * 0.1} q${-r * 0.1} ${r * 0.25} ${-r * 0.35} ${r * 0.15}z" fill="#2f6b57" opacity=".75"/>`;
  return `<defs><radialGradient id="${id}-gE${o.k || 0}" cx="42%" cy="36%" r="78%"><stop offset="0" stop-color="#4d8ee0"/><stop offset=".55" stop-color="#1f4f9e"/><stop offset="1" stop-color="#071336"/></radialGradient><clipPath id="${id}-cE${o.k || 0}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
  <circle cx="${cx}" cy="${cy}" r="${r + 26}" fill="none" stroke="${STEEL}" stroke-opacity=".28" stroke-width="22"/><circle cx="${cx}" cy="${cy}" r="${r + 8}" fill="none" stroke="#bfe0ff" stroke-opacity=".5" stroke-width="6"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-gE${o.k || 0})"/><g clip-path="url(#${id}-cE${o.k || 0})">${land}${clouds}<ellipse cx="${cx + r * 0.55}" cy="${cy + r * 0.2}" rx="${r * 0.95}" ry="${r * 1.3}" fill="#02040f" opacity=".55"/></g>`;
}
const sunflare = (cx, cy, r = 260, op = 1) => `<g opacity="${op}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffd08a" opacity=".22"/><circle cx="${cx}" cy="${cy}" r="${r * 0.45}" fill="#fff1d0" opacity=".6"/><circle cx="${cx}" cy="${cy}" r="${r * 0.16}" fill="#fff"/>${[0, 30, 60, 90, 120, 150].map((a) => `<line x1="${cx - Math.cos((a * Math.PI) / 180) * r * 1.4}" y1="${cy - Math.sin((a * Math.PI) / 180) * r * 1.4}" x2="${cx + Math.cos((a * Math.PI) / 180) * r * 1.4}" y2="${cy + Math.sin((a * Math.PI) / 180) * r * 1.4}" stroke="#ffe3b0" stroke-opacity=".35" stroke-width="5"/>`).join("")}</g>`;
function porthole(id, cx, cy, r, inner, k = 0) {
  const bolts = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * 6.2832; return `<circle cx="${cx + Math.cos(a) * (r + 30)}" cy="${cy + Math.sin(a) * (r + 30)}" r="7" fill="#9aa8d0"/>`; }).join("");
  return `<defs><clipPath id="${id}-ph${k}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
  <circle cx="${cx}" cy="${cy + 10}" r="${r + 54}" fill="#000" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${r + 50}" fill="#2a3358"/><circle cx="${cx}" cy="${cy}" r="${r + 42}" fill="#4a5584"/><circle cx="${cx}" cy="${cy}" r="${r + 18}" fill="#1b2142"/>${bolts}
  <g clip-path="url(#${id}-ph${k})">${inner}</g><path d="M${cx - r * 0.8} ${cy - r * 0.35} A${r * 0.88} ${r * 0.88} 0 0 1 ${cx - r * 0.2} ${cy - r * 0.85}" stroke="#fff" stroke-opacity=".16" stroke-width="14" fill="none" stroke-linecap="round"/>`;
}
function wall(id, o = {}) {
  const r_ = rnd(o.seed || 3), W = 1080, H = 1920, cols = 3, rows = 7, pw = W / cols, ph = H / rows; let g = "";
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const sh = 22 + Math.floor(r_() * 12);
    g += `<rect x="${i * pw + 4}" y="${j * ph + 4}" width="${pw - 8}" height="${ph - 8}" rx="10" fill="hsl(228 ${o.sat ?? 36}% ${sh}%)"/><rect x="${i * pw + 10}" y="${j * ph + 10}" width="${pw - 20}" height="14" rx="7" fill="#fff" opacity=".05"/>`;
    [[16, 16], [pw - 16, 16], [16, ph - 16], [pw - 16, ph - 16]].forEach(([dx, dy]) => (g += `<circle cx="${i * pw + dx}" cy="${j * ph + dy}" r="5" fill="#9aa8d0" opacity=".45"/>`));
  }
  return `<rect x="-60" y="-60" width="1200" height="2040" fill="#141a3a"/>${g}`;
}
const vent = (x, y, w, h, n = 8) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#0b0f26" stroke="#5c6896" stroke-width="5"/>${Array.from({ length: n }, (_, i) => `<rect x="${x + 14}" y="${y + 14 + (i * (h - 28)) / n}" width="${w - 28}" height="${(h - 28) / n - 8}" rx="6" fill="#2a3358"/>`).join("")}</g>`;
const cable = (d, col = "#0b0f26", w = 22) => `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#fff" stroke-opacity=".14" stroke-width="${w * 0.25}" fill="none" stroke-linecap="round" transform="translate(-3 -4)"/>`;
const rail = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#0b0f26" stroke-width="30" stroke-linecap="round"/><line x1="${x1}" y1="${y1 - 4}" x2="${x2}" y2="${y2 - 4}" stroke="#c9d3f0" stroke-width="12" stroke-linecap="round" opacity=".75"/>`;
const led = (x, y, col = RED) => `<circle cx="${x}" cy="${y}" r="9" fill="${col}"/><circle cx="${x}" cy="${y}" r="24" fill="${col}" opacity=".25"/>`;
const placard = (x, y, w = 110) => `<rect x="${x}" y="${y}" width="${w}" height="54" rx="6" fill="#d9d1c0" opacity=".85"/><rect x="${x + 10}" y="${y + 12}" width="${w - 36}" height="8" rx="4" fill="#1a1a2a" opacity=".6"/><rect x="${x + 10}" y="${y + 28}" width="${w - 60}" height="8" rx="4" fill="#1a1a2a" opacity=".45"/>`;
const fan = (id, cx, cy, r, blur = true) => `<circle cx="${cx}" cy="${cy}" r="${r + 36}" fill="#0b0f26"/><circle cx="${cx}" cy="${cy}" r="${r + 22}" fill="#3a4575"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f1430"/>
  ${[0, 72, 144, 216, 288].map((a) => `<path d="M${cx} ${cy} q${r * 0.5} ${-r * 0.2} ${r * 0.9} ${r * 0.28} q${-r * 0.4} ${r * 0.28} ${-r * 0.9} ${-r * 0.28}z" fill="#8a97c4" opacity=".92" transform="rotate(${a} ${cx} ${cy})"/>`).join("")}
  ${blur ? `<circle cx="${cx}" cy="${cy}" r="${r * 0.92}" fill="none" stroke="#c9d3f0" stroke-opacity=".28" stroke-width="${r * 0.35}" stroke-dasharray="${r * 0.9} ${r * 0.5}"/>` : ""}
  <circle cx="${cx}" cy="${cy}" r="${r * 0.2}" fill="#2a3358"/>${[1, 2, 3].map((i) => `<circle cx="${cx}" cy="${cy}" r="${r + 4 + i * 0}" fill="none" stroke="#5c6896" stroke-width="3" opacity="${i === 1 ? 0.8 : 0}"/>`).join("")}`;
const airflow = (cx, cy, n = 5, len = 420, col = STEEL) => Array.from({ length: n }, (_, i) => { const a = -50 + (i * 100) / (n - 1), r = (a * Math.PI) / 180; return `<path d="M${cx} ${cy} q${Math.cos(r) * len * 0.5} ${Math.sin(r) * len * 0.5 - 40} ${Math.cos(r) * len} ${Math.sin(r) * len}" stroke="${col}" stroke-opacity=".5" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="40 24"/>`; }).join("");
const bubble = (id, cx, cy, r, op = 1) => { const pts = Array.from({ length: 36 }, (_, i) => { const t = (i / 36) * 6.2832, w = 1 + 0.07 * Math.sin(3 * t + 0.7) + 0.045 * Math.sin(5 * t + 2.1) + 0.03 * Math.sin(8 * t); return [cx + Math.cos(t) * r * w, cy + Math.sin(t) * r * w * 1.02]; }); const d = "M" + pts.map((p) => p.map((v) => v.toFixed(0)).join(" ")).join(" L") + "Z";
  return `<defs><radialGradient id="${id}-gB${r}" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".6" stop-color="#9ed0e6" stop-opacity=".10"/><stop offset="1" stop-color="#9ed0e6" stop-opacity=".30"/></radialGradient></defs><g opacity="${op}"><path d="${d}" fill="url(#${id}-gB${r})" stroke="#cfeaf6" stroke-opacity=".55" stroke-width="5" stroke-linejoin="round"/><path d="M${cx - r * 0.62} ${cy - r * 0.35} Q${cx - r * 0.5} ${cy - r * 0.7} ${cx - r * 0.1} ${cy - r * 0.8}" stroke="#fff" stroke-opacity=".45" stroke-width="12" fill="none" stroke-linecap="round"/></g>`; };
const co2 = (cx, cy, r, n, seed) => { const r_ = rnd(seed); return Array.from({ length: n }, () => { const a = r_() * 6.28, d = Math.sqrt(r_()) * r * 0.92; return `<circle cx="${(cx + Math.cos(a) * d).toFixed(0)}" cy="${(cy + Math.sin(a) * d).toFixed(0)}" r="${(4 + r_() * 7).toFixed(1)}" fill="#bfe6e0" opacity="${(0.25 + r_() * 0.45).toFixed(2)}"/>`; }).join(""); };

// l'astronaute qui dort : sac de couchage orange accroché au mur (capsule), tête ronde (même DA que les autres personnages), mains rentrées
function sleeper(A, id, cx, cy, s = 1, o = {}) {
  const u = (n) => A.u(n), rot = o.rot || 0, hr = 64 * s;
  const bag = `<rect x="${cx - 118 * s}" y="${cy + hr * 0.5}" width="${236 * s}" height="${520 * s}" rx="${118 * s}" fill="#c9783f"/><rect x="${cx - 118 * s}" y="${cy + hr * 0.5}" width="${236 * s}" height="${520 * s}" rx="${118 * s}" fill="url(#${id}-gMd)"/>
    <path d="M${cx} ${cy + hr * 0.9} V${cy + 480 * s}" stroke="#6b3b1c" stroke-width="${5 * s}" stroke-dasharray="${14 * s} ${9 * s}"/>
    ${[0.18, 0.5, 0.82].map((t) => `<rect x="${cx - 150 * s}" y="${cy + hr + t * 440 * s}" width="${300 * s}" height="${26 * s}" rx="${6 * s}" fill="#d9d1c0"/><rect x="${cx - 150 * s}" y="${cy + hr + t * 440 * s}" width="${300 * s}" height="${8 * s}" fill="#fff" opacity=".35"/>`).join("")}
    <ellipse cx="${cx}" cy="${cy + hr * 0.62}" rx="${96 * s}" ry="${34 * s}" fill="#9a5628"/>`;
  const head = `<circle cx="${cx}" cy="${cy}" r="${hr}" fill="${u("gSkin")}"/><path d="M${cx - hr} ${cy - hr * 0.1} Q${cx - hr * 0.95} ${cy - hr * 0.95} ${cx} ${cy - hr} Q${cx + hr * 0.95} ${cy - hr * 0.95} ${cx + hr} ${cy - hr * 0.1} Q${cx + hr * 0.6} ${cy - hr * 0.45} ${cx} ${cy - hr * 0.5} Q${cx - hr * 0.6} ${cy - hr * 0.45} ${cx - hr} ${cy - hr * 0.1}z" fill="#3d2a24"/>
    ${o.mask ? `<rect x="${cx - hr * 1.12}" y="${cy - hr * 0.2}" width="${hr * 2.24}" height="${hr * 0.62}" rx="${hr * 0.3}" fill="#0e1024"/><rect x="${cx - hr * 1.12}" y="${cy - hr * 0.2}" width="${hr * 2.24}" height="${hr * 0.18}" rx="${hr * 0.1}" fill="#fff" opacity=".12"/>` : `<path d="M${cx - hr * 0.62} ${cy + hr * 0.12} q${hr * 0.26} ${hr * 0.22} ${hr * 0.5} 0 M${cx + hr * 0.12} ${cy + hr * 0.12} q${hr * 0.26} ${hr * 0.22} ${hr * 0.5} 0" stroke="#5b4636" stroke-width="${hr * 0.1}" fill="none" stroke-linecap="round"/>`}
    ${o.plugs ? `<circle cx="${cx - hr * 1.0}" cy="${cy + hr * 0.1}" r="${hr * 0.16}" fill="#ff9a3c"/><circle cx="${cx + hr * 1.0}" cy="${cy + hr * 0.1}" r="${hr * 0.16}" fill="#ff9a3c"/>` : ""}`;
  return `<g transform="rotate(${rot} ${cx} ${cy + 200 * s})">${bag}${head}</g>`;
}
const floaters = (seed, n = 6, x0 = 60, x1 = 1020, y0 = 600, y1 = 1500) => { const r = rnd(seed); const kinds = ["pen", "drop", "drop", "sock", "bolt", "drop"]; return Array.from({ length: n }, (_, i) => { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), a = r() * 360, k = kinds[i % kinds.length]; return k === "pen" ? `<g transform="rotate(${a} ${x} ${y})"><rect x="${x - 34}" y="${y - 6}" width="68" height="12" rx="6" fill="#d9d1c0"/><rect x="${x + 14}" y="${y - 6}" width="20" height="12" rx="6" fill="${AMB}"/></g>` : k === "sock" ? `<g transform="rotate(${a} ${x} ${y})"><path d="M${x - 14} ${y - 36} h28 v40 q0 22 -26 26 q-22 4 -22 -12 q0 -10 20 -14z" fill="#8fa0d8"/><rect x="${x - 14}" y="${y - 36}" width="28" height="10" fill="#fff" opacity=".5"/></g>` : k === "bolt" ? `<circle cx="${x}" cy="${y}" r="9" fill="#9aa8d0"/>` : `<circle cx="${x}" cy="${y}" r="${8 + r() * 10}" fill="#bfe6ff" opacity=".6"/><circle cx="${x - 3}" cy="${y - 4}" r="3" fill="#fff" opacity=".8"/>`; }).join(""); };

// ---------- les dioramas « Terre » (chauds, ambre) : toit sous la pluie, terrasse de café, rue qui s'endort. Repère 0..1000, centrés ensuite dans un hublot
function roofScene(id, k) {
  const r_ = rnd(8), rain = Array.from({ length: 60 }, () => { const x = r_() * 1000, y = r_() * 1000; return `<line x1="${x}" y1="${y}" x2="${x - 10}" y2="${y + 46}" stroke="#bfe0ff" stroke-opacity=".6" stroke-width="3"/>`; }).join("");
  return `<rect width="1000" height="1000" fill="#121a3d"/><circle cx="800" cy="170" r="70" fill="#d9e4ff" opacity=".18"/><path d="M0 560 L1000 400 L1000 1000 L0 1000z" fill="#26224a"/><path d="M0 560 L1000 400" stroke="#4a3e7a" stroke-width="10"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${-40 + i * 130} ${600 + i * -18} L${60 + i * 130} ${660 + i * -18}" stroke="#1a1638" stroke-width="12" opacity=".7"/>`).join("")}
  <rect x="640" y="330" width="90" height="170" fill="#2a2452"/><rect x="630" y="316" width="110" height="26" fill="#3a3366"/><rect x="250" y="560" width="190" height="210" rx="8" fill="#1a1638"/><rect x="274" y="590" width="142" height="150" rx="6" fill="${AMB}" opacity=".95"/><path d="M345 590 V740 M274 665 H416" stroke="#1a1638" stroke-width="8"/>
  <ellipse cx="345" cy="640" rx="260" ry="220" fill="${AMB}" opacity=".16"/>
  <ellipse cx="640" cy="870" rx="120" ry="22" fill="#9ed0e6" opacity=".35"/><ellipse cx="640" cy="870" rx="70" ry="12" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>${rain}`;
}
function cafeScene(id, k) {
  const bulbs = Array.from({ length: 11 }, (_, i) => `<circle cx="${60 + i * 88}" cy="${190 + Math.sin(i * 0.9) * 30 + 40}" r="14" fill="#ffd98a"/><circle cx="${60 + i * 88}" cy="${190 + Math.sin(i * 0.9) * 30 + 40}" r="36" fill="#ffd98a" opacity=".22"/>`).join("");
  const table = (x, y) => `<ellipse cx="${x}" cy="${y + 120}" rx="110" ry="24" fill="#000" opacity=".35"/><rect x="${x - 6}" y="${y}" width="12" height="120" fill="#3a3366"/><ellipse cx="${x}" cy="${y}" rx="104" ry="28" fill="#5a4a8a"/><rect x="${x - 30}" y="${y - 40}" width="34" height="32" rx="6" fill="#f1ede4"/><path d="M${x - 18} ${y - 54} q-10 -22 4 -40 M${x - 6} ${y - 54} q-10 -22 4 -40" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="${x + 30}" y="${y - 36}" width="30" height="28" rx="6" fill="#f1ede4"/>`;
  return `<rect width="1000" height="1000" fill="#1a1436"/><path d="M0 120 H1000 L940 300 H60z" fill="#8a2f44"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${i * 143 + 71} 120 L${i * 143 + 71 - 10} 300" stroke="#f1ede4" stroke-opacity=".35" stroke-width="22"/>`).join("")}${bulbs}
  <rect x="0" y="700" width="1000" height="300" fill="#251d4c"/>${table(250, 640)}${table(700, 700)}
  <rect x="830" y="380" width="14" height="420" fill="#3a3366"/><circle cx="837" cy="372" r="30" fill="#ffd98a"/><circle cx="837" cy="372" r="120" fill="#ffd98a" opacity=".2"/>`;
}
function streetScene(id, k) {
  const win = (x, y, on) => `<rect x="${x}" y="${y}" width="46" height="62" rx="5" fill="${on ? AMB : "#0e1230"}" opacity="${on ? 0.95 : 1}"/>`;
  const lamp = (x, y, s) => `<rect x="${x - 5 * s}" y="${y}" width="${10 * s}" height="${260 * s}" fill="#0e1230"/><circle cx="${x}" cy="${y}" r="${22 * s}" fill="#ffd98a"/><circle cx="${x}" cy="${y}" r="${90 * s}" fill="#ffd98a" opacity=".16"/>`;
  return `<rect width="1000" height="1000" fill="#0f1536"/><circle cx="170" cy="150" r="60" fill="#e8e6ff" opacity=".7"/>
  <path d="M0 400 L330 480 L330 1000 L0 1000z" fill="#1a1c44"/><path d="M1000 380 L670 480 L670 1000 L1000 1000z" fill="#1a1c44"/><path d="M330 480 L670 480 L1000 1000 L0 1000z" fill="#222654"/><path d="M500 560 L500 1000" stroke="#fff" stroke-opacity=".15" stroke-width="10" stroke-dasharray="40 40"/>
  ${[[40, 470, 1], [120, 560, 0], [210, 470, 0], [40, 600, 1], [210, 640, 0], [800, 460, 1], [880, 560, 0], [740, 570, 1], [880, 660, 0]].map((w) => win(w[0], w[1], w[2])).join("")}
  ${lamp(300, 560, 0.9)}${lamp(700, 560, 0.9)}${lamp(200, 760, 1.4)}
  <ellipse cx="800" cy="860" rx="34" ry="22" fill="#0a0c20"/><path d="M780 850 l-6 -26 l16 12z M820 850 l6 -26 l-16 12z" fill="#0a0c20"/>`;
}
const diorama = (id, scene, cx, cy, r, k) => porthole(id, cx, cy, r, `<g transform="translate(${cx - r} ${cy - r}) scale(${(2 * r) / 1000})">${scene(id, k)}</g>`, k);

// le lit des personnages (même lit que les autres épisodes), vu de dessus ; neon = écran du téléphone allumé
const BED = (A, o = {}) => A.bedTop({ clock: [o.clock || "23:40"] }).replace(/<g id="[^"]*-phone">/, (m) => (o.phone ? m : m.replace(">", ' opacity="0">'))).replace(/(id="[^"]*-phone-on" opacity=")0(")/, o.neon ? "$11$2" : "$10$2");

// ---------- les croquis ----------
const F = [
  { id: "f01", name: "SI T'ÉTAIS ASTRONAUTE", words: 6, tag: "Hook · le lit qui décolle", voice: "Si t'étais astronaute, tu dormirais comment ?",
    note: "<b>On part du lit de la série</b> (plongée sur le lit, chambre sombre) : tout ce qui s'y trouve <b>se met à flotter</b> : l'oreiller, une chaussette, le téléphone, une tasse. La couette se soulève par un coin, ses ombres s'allongent. Au plafond, <b>le noir se remplit d'étoiles</b>. Le personnage reste endormi, dans son lit, qui lui-même commence à monter. Raccord direct sur la station.",
    seam: "fondu qui décolle → coupe sèche sur 02", build: (A, id) => ({ world: `<rect x="-200" y="-200" width="1480" height="2320" fill="#0c102a"/>${stars(90, 4, 0, 900)}<rect x="0" y="0" width="1080" height="1000" fill="url(#${id}-gFade)"/><defs><linearGradient id="${id}-gFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c102a" stop-opacity="0"/><stop offset="1" stop-color="#0c102a" stop-opacity="1"/></linearGradient></defs>
      <g transform="translate(-130 -230) scale(1.25)">${BED(A, { clock: "23:40" })}</g>
      <g transform="rotate(-14 230 860)"><ellipse cx="230" cy="860" rx="150" ry="80" fill="#cfc8bb"/></g><g transform="translate(620 190) scale(1.5)"><path d="M560 540 h60 v70 q0 30 -30 30 q-30 0 -30 -30z" fill="#f1ede4"/><path d="M580 520 q-8 -22 4 -34" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none"/></g>
      <g transform="rotate(20 880 760) scale(1.6) translate(-310 -105)"><path d="M700 590 h40 v60 q0 30 -26 32 q-24 2 -24 -18z" fill="#8fa0d8"/></g><g transform="rotate(-24 170 1080) scale(1.5) translate(-60 -330)"><rect x="190" y="500" width="60" height="112" rx="12" fill="#0b0d1a" stroke="#fff" stroke-opacity=".3" stroke-width="3"/></g>
      ${[[230, 960], [890, 760], [980, 900], [170, 1140]].map(([x, y]) => `<path d="M${x} ${y + 30} v40 M${x - 10} ${y + 40} v26 M${x + 10} ${y + 40} v26" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round"/>`).join("")}`,
      hud: cap(id, "Si t'étais *astronaute*,\ntu dormirais comment ?") + vig(id, 1) }) },
  { id: "f02", name: "PREMIÈRE NOUVELLE, PAS SYMPA", words: 4, tag: "L'établi · la station, la nuit", voice: "Première nouvelle, pas sympa…",
    note: "<b>Premier décor immersif : le module de couchage.</b> Panneaux, rivets, grilles d'aération, câbles qui flottent, rampes, placards, voyants rouges. <b>Il dort à la verticale</b>, son sac de couchage orange sanglé au mur. Un hublot sur la Terre lui éclaire la joue. Des objets flottent (stylo, goutte, chaussette), <b>3 plans de profondeur qui bougent à des vitesses différentes</b> (caméra qui dérive lentement). Badge « 1 ».",
    seam: "coupe sèche", build: (A, id) => ({ world: `${wall(id)}${vent(60, 520, 220, 150)}${vent(800, 1280, 220, 150, 6)}${rail(0, 1620, 1080, 1620)}${cable("M-20 480 C260 560 300 760 120 960", "#0b0f26", 26)}${cable("M1100 700 C820 760 900 1000 760 1200", "#0b0f26", 22)}${placard(780, 640)}${placard(110, 1250, 130)}${led(960, 900)}${led(130, 800, "#8fe39a")}
      ${porthole(id, 800, 960, 190, `<rect x="400" y="500" width="800" height="900" fill="#02040f"/>${stars(30, 9, 760, 1160)}${earth(id, 760, 1300, 520, { k: 1 })}`, 1)}
      ${sleeper(A, id, 380, 700, 1.15, {})}${floaters(11, 7)}<rect x="0" y="0" width="1080" height="1920" fill="url(#${id}-gShaft)"/><defs><radialGradient id="${id}-gShaft" cx="75%" cy="50%" r="60%"><stop offset="0" stop-color="#7fa6d6" stop-opacity=".12"/><stop offset="1" stop-color="#7fa6d6" stop-opacity="0"/></radialGradient></defs>${dark(0.28)}`,
      hud: badge(1) + cap(id, "Première nouvelle,\n*pas sympa…*") + vig(id, 1) }) },
  { id: "f03", name: "TU PEUX T'ÉTOUFFER", words: 7, tag: "Gros plan · la bulle commence", voice: "… dans l'espace, tu peux t'étouffer… en dormant.",
    note: "<b>Gros plan sur son visage endormi</b>, le fond de la station flou (bokeh du hublot, voyants). Autour de sa tête, <b>un voile transparent se forme</b> : de petites particules grisâtres (l'air qu'il expire) s'accumulent et ne partent pas. Le voile s'épaissit au rythme de sa respiration. <b>Pas de jauge, pas de texte : on le lit sur l'image.</b>",
    seam: "continu", build: (A, id) => ({ world: `${wall(id, { sat: 30 })}<g filter="url(#${id}-fBlurL)">${led(220, 760)}${led(900, 540, "#8fe39a")}${porthole(id, 860, 1260, 130, `<rect width="1080" height="1920" fill="#02040f"/>${earth(id, 860, 1500, 300, { k: 2 })}`, 2)}${vent(120, 1160, 220, 150)}</g><rect x="-60" y="-60" width="1200" height="2040" fill="#0a0e26" opacity=".35"/>
      ${sleeper(A, id, 540, 1000, 3.2, {})}${bubble(id, 540, 1000, 380, 0.7)}${co2(540, 1000, 340, 36, 3)}`,
      hud: cap(id, "tu peux t'étouffer…\n*en dormant.*") + vig(id, 2) }) },
  { id: "f04", name: "L'AIR RESTE EN BULLE", words: 13, tag: "★ La bulle d'air", voice: "Sans gravité, l'air que tu expires reste en bulle autour de ta tête.",
    note: "<b>La bulle est maintenant nette</b> : une grosse sphère translucide avec son reflet de hublot, pleine de particules d'air expiré qui tournent doucement sans partir. De petits jets partent du nez et <b>restent collés</b>. Une pastille ambre « air expiré » désigne la bulle. C'est l'image-clé de l'épisode : elle explique le danger sans un mot de technique.",
    seam: "continu", build: (A, id) => ({ world: `${wall(id, { sat: 30 })}<g filter="url(#${id}-fBlurL)">${vent(120, 1160, 220, 150)}${led(900, 540, "#8fe39a")}</g><rect x="-60" y="-60" width="1200" height="2040" fill="#0a0e26" opacity=".4"/>
      ${sleeper(A, id, 540, 1020, 3.2, {})}${bubble(id, 540, 1020, 420, 1)}${co2(540, 1020, 380, 90, 7)}
      <g stroke="#bfe6e0" stroke-opacity=".6" stroke-width="6" fill="none" stroke-linecap="round">${[-1, 1].map((s) => `<path d="M${540 + s * 20} 1110 q${s * 70} 30 ${s * 120} -10 M${540 + s * 20} 1130 q${s * 50} 70 ${s * 110} 40"/>`).join("")}</g>`,
      hud: cap(id, "l'air que tu expires reste\n*en bulle* autour de ta tête.") + tag(780, 1000, "air expiré", 600, 1500) + vig(id, 2) }) },
  { id: "f05", name: "DES VENTILATEURS TOUTE LA NUIT", words: 7, tag: "Le ventilateur, héros du plan", voice: "Alors des ventilateurs tournent toute la nuit.",
    note: "<b>Un ventilateur géant au premier plan</b> (pales floues, grille, voyant), <b>qui souffle des lignes d'air</b> à travers le cadre jusqu'à la bulle, au fond, qui se déchire et se disperse. On entend la nuit : le ronronnement. <b>C'est le soulagement du plan précédent</b> : même couleurs, mais l'air circule.",
    seam: "continu", build: (A, id) => ({ world: `${wall(id)}${rail(0, 1560, 1080, 1560)}${cable("M-20 400 C240 520 260 700 80 900", "#0b0f26", 26)}${placard(780, 400)}
      <g opacity=".92" transform="translate(60 120) scale(.55)">${sleeper(A, id, 600, 560, 1.4, {})}${bubble(id, 600, 560, 200, 0.6)}${co2(600, 560, 170, 18, 5)}</g>
      ${airflow(540, 1160, 6, 520)}${fan(id, 540, 1160, 300)}${led(130, 1560, "#8fe39a")}${dark(0.18)}`,
      hud: cap(id, "des ventilateurs tournent\n*toute la nuit.*") + vig(id, 1) }) },
  { id: "f06", name: "DEUXIÈME NOUVELLE : BRUIT ET LUMIÈRE", words: 14, tag: "★ La station, en grand · immersion", voice: "Deuxième nouvelle : y'a plein de bruit et plein de lumière dans une station.",
    note: "<b>Le plan large du film</b> (le seul, et il est là pour l'immersion) : on regarde <b>à l'intérieur de la station, en perspective</b>, un tunnel d'anneaux (modules) qui s'éloignent, chargés de câbles, de panneaux, de voyants, d'objets qui flottent. <b>Des ondes de bruit</b> partent des machines, la lumière chaude des lampes et la lumière froide d'un hublot se croisent. La caméra avance lentement dans le tunnel. Badge « 2 ».",
    seam: "coupe sèche", build: (A, id) => ({ world: `<rect x="-60" y="-60" width="1200" height="2040" fill="#070a1c"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => { const k = 1 - i * 0.14, w = 1180 * k, h = 1500 * k, x = 540 - w / 2, y = 900 - h / 2 - i * 8; return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${70 * k}" fill="hsl(228 ${34 - i * 3}% ${Math.max(9, 27 - i * 3)}%)" stroke="#5c6896" stroke-opacity="${0.55 - i * 0.06}" stroke-width="${10 * k}"/><rect x="${x + 22 * k}" y="${y + 22 * k}" width="${w - 44 * k}" height="${14 * k}" rx="${7 * k}" fill="#fff" opacity=".06"/>${[0.15, 0.5, 0.85].map((t) => `<circle cx="${x + w * t}" cy="${y + 40 * k}" r="${7 * k}" fill="${i % 2 ? RED : "#8fe39a"}"/>`).join("")}`; }).join("")}
      <circle cx="540" cy="900" r="120" fill="#bfe0ff" opacity=".22"/><circle cx="540" cy="900" r="46" fill="#fff" opacity=".7"/>${[0, 1].map((sd) => `<path d="M${sd ? 1080 : 0} 220 L${sd ? 770 : 310} 640 L${sd ? 770 : 310} 1160 L${sd ? 1080 : 0} 1640z" fill="#1d2550" opacity=".95" stroke="#5c6896" stroke-width="6"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${sd ? 800 + i * 0 : 50}" y="${380 + i * 150}" width="${sd ? 200 - i * 14 : 200 - i * 14}" height="${96 - i * 8}" rx="10" fill="#2a3358" stroke="#5c6896" stroke-width="3" transform="translate(${sd ? 0 : 0} 0)"/><circle cx="${sd ? 830 : 80}" cy="${400 + i * 150}" r="7" fill="${i % 2 ? "#8fe39a" : RED}"/>`).join("")}`).join("")}
      ${cable("M-20 300 C260 440 220 760 400 900", "#0b0f26", 34)}${cable("M1100 360 C820 480 880 760 700 900", "#0b0f26", 30)}${cable("M-20 1500 C300 1400 300 1100 440 960", "#0b0f26", 30)}
      ${[0, 1, 2, 3].map((i) => `<circle cx="${220 + i * 0}" cy="${1260}" r="${70 + i * 54}" fill="none" stroke="${AMB}" stroke-opacity="${0.5 - i * 0.12}" stroke-width="${8 - i}"/>`).join("")}
      ${[0, 1, 2].map((i) => `<circle cx="880" cy="${640}" r="${60 + i * 46}" fill="none" stroke="${AMB}" stroke-opacity="${0.45 - i * 0.12}" stroke-width="7"/>`).join("")}
      <rect x="160" y="1210" width="120" height="100" rx="16" fill="#3a4575"/><rect x="800" y="580" width="160" height="120" rx="14" fill="#3a4575"/>${led(180, 1230)}${led(820, 600, "#8fe39a")}
      <g transform="rotate(-16 500 1480)"><rect x="410" y="1440" width="190" height="120" rx="10" fill="#d9d1c0"/><rect x="420" y="1450" width="170" height="90" rx="6" fill="#26306a"/></g>${floaters(21, 6, 80, 1000, 500, 1500)}
      <ellipse cx="540" cy="900" rx="520" ry="760" fill="url(#${id}-gWarm)" opacity=".5"/>`,
      hud: badge(2) + cap(id, "plein de bruit,\nplein de *lumière*") + vig(id, 1) }) },
  { id: "f07", name: "SEIZE LEVERS DE SOLEIL", words: 9, tag: "★ Le soleil × 16", voice: "Le soleil se lève jusqu'à seize fois par jour.",
    note: "<b>Le hublot en grand sur la Terre</b>, le soleil qui <b>perce l'horizon en éclair</b> (flare, rayons) et inonde le visage de l'astronaute au premier plan. Autour du hublot, <b>un cadran de 16 repères</b> : le soleil saute de cran en cran, de plus en plus vite, et l'image alterne jour et nuit (flashs). Au bas du cadre, <b>« ×16 » en gros</b> en ambre. Immersion lumineuse, très rythmée.",
    seam: "continu (flash)", build: (A, id) => ({ world: `${wall(id, { sat: 30 })}${porthole(id, 540, 940, 400, `<rect width="1080" height="1920" fill="#02040f"/>${stars(60, 2, 540, 1340)}<ellipse cx="540" cy="1420" rx="900" ry="520" fill="#1b4a9a"/><ellipse cx="540" cy="1400" rx="900" ry="520" fill="none" stroke="#bfe0ff" stroke-width="10" opacity=".8"/>${sunflare(520, 1020, 280)}<rect x="0" y="540" width="1080" height="800" fill="url(#${id}-gSun)"/><defs><linearGradient id="${id}-gSun" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffc77a" stop-opacity=".45"/><stop offset=".6" stop-color="#ffc77a" stop-opacity="0"/></linearGradient></defs>`, 3)}
      ${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * 6.2832 - 1.5708, on = i <= 6; return `<circle cx="${540 + Math.cos(a) * 470}" cy="${940 + Math.sin(a) * 470}" r="${on ? 16 : 10}" fill="${on ? AMB : "#fff"}" opacity="${on ? 1 : 0.35}"/>`; }).join("")}
      <g transform="translate(70 1480) scale(.7)"><circle cx="0" cy="0" r="0"/></g>${sleeper(A, id, 190, 1500, 1.0, {})}<rect x="-60" y="-60" width="1200" height="2040" fill="${AMB}" opacity=".08"/>${dark(0.1)}`,
      hud: cap(id, "le soleil se lève\n*seize fois* par jour") + `<text x="860" y="1500" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="170" fill="${AMB}" filter="url(#${id}-fShadow)">×16</text>` + vig(id, 1) }) },
  { id: "f08", name: "MASQUE ET BOUCHONS", words: 9, tag: "Gros plan · pop, pop", voice: "Donc masque sur les yeux, bouchons dans les oreilles.",
    note: "<b>Gros plan sur son visage.</b> Le masque noir <b>glisse sur ses yeux</b> (sangle élastique qui claque), puis <b>deux bouchons orange se plantent dans les oreilles</b>, chacun avec un petit anneau (« pop »). À gauche, <b>un égaliseur de bruit</b> (barres) qui s'effondre bar par bar. Le fond, flou, perd sa lumière : le monde s'éteint.",
    seam: "continu", build: (A, id) => ({ world: `${wall(id, { sat: 28 })}<rect x="-60" y="-60" width="1200" height="2040" fill="#0a0e26" opacity=".5"/>${sleeper(A, id, 540, 1000, 3.4, { mask: true, plugs: true })}
      ${[0, 1].map((s) => `<circle cx="${540 + (s ? 1 : -1) * 218}" cy="${1030}" r="46" fill="none" stroke="#ff9a3c" stroke-opacity=".6" stroke-width="6"/><circle cx="${540 + (s ? 1 : -1) * 218}" cy="${1030}" r="82" fill="none" stroke="#ff9a3c" stroke-opacity=".3" stroke-width="4"/>`).join("")}
      ${[260, 180, 120, 70, 36, 18].map((h, i) => `<rect x="${90 + i * 38}" y="${1500 - h}" width="24" height="${h}" rx="6" fill="${STEEL}" opacity="${0.9 - i * 0.1}"/>`).join("")}`,
      hud: cap(id, "masque sur les yeux,\n*bouchons* dans les oreilles") + vig(id, 2) }) },
  { id: "f09", name: "NI HAUT NI BAS", words: 8, tag: "★ La caméra tourne · haut/bas rayés", voice: "Et comme y'a pas de gravité, y'a ni haut ni bas :",
    note: "<b>La caméra se met à rouler sur elle-même</b> (180° en une seconde) autour de l'astronaute, qui reste immobile, et <b>toute la pièce tourne</b> avec ses câbles, ses objets, son hublot : plus de sol, plus de plafond. Deux pastilles « haut » et « bas » apparaissent, <b>barrées d'un trait ambre</b>. Croquis : la même scène à 0° (nette) et tournée de 110° (fantôme).",
    seam: "continu (roulis)", build: (A, id) => ({ world: [0, 110].map((a, i) => `<g opacity="${i === 0 ? 1 : 0.3}" transform="rotate(${a} 540 960)">${i === 0 ? wall(id) : `<rect x="-400" y="-400" width="1880" height="2720" fill="#141a3a" opacity=".0"/>`}${vent(70, 360, 220, 150)}${porthole(id, 860, 1300, 170, `<rect width="1080" height="1920" fill="#02040f"/>${earth(id, 820, 1500, 400, { k: 5 + i })}`, 5 + i)}${cable("M-20 560 C260 660 260 900 100 1100", "#0b0f26", 24)}${sleeper(A, id, 460, 760, 1.2, {})}${floaters(30, 5)}</g>`).join("") + dark(0.2) + `<g transform="translate(540 960)" fill="none" stroke="${AMB}" stroke-width="10" stroke-linecap="round"><path d="M-320 -40 A320 320 0 0 1 100 -310" opacity=".9"/><path d="M100 -310 l-4 -50 M100 -310 l50 6" /></g>`,
      hud: cap(id, "y'a ni haut ni bas :") + `<g><rect x="190" y="620" width="260" height="84" rx="42" fill="#10142e" stroke="${AMB}" stroke-width="4"/><text x="320" y="676" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="48" fill="#fff">haut</text><line x1="206" y1="676" x2="434" y2="656" stroke="${AMB}" stroke-width="8" stroke-linecap="round"/></g><g><rect x="630" y="1240" width="260" height="84" rx="42" fill="#10142e" stroke="${AMB}" stroke-width="4"/><text x="760" y="1296" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="48" fill="#fff">bas</text><line x1="646" y1="1296" x2="874" y2="1276" stroke="${AMB}" stroke-width="8" stroke-linecap="round"/></g>` + vig(id, 1) }) },
  { id: "f10", name: "SAC DE COUCHAGE AU MUR", words: 11, tag: "★ La récap : il dort au mur", voice: "tu dors dans un sac de couchage accroché au mur.",
    note: "<b>Le plan de synthèse</b>, plus serré que le 02 : l'astronaute <b>sanglé au mur dans son sac</b> (sangles, crochets, scratch), masque sur les yeux, bouchons dans les oreilles, le ventilateur qui tourne au-dessus de sa tête, le hublot en fond. Une pastille « accroché au mur » désigne les crochets. Tout ce qu'on a vu depuis 02 est <b>réuni dans une seule image</b> : le spectateur doit la comprendre sans sous-titre.",
    seam: "coupe sèche", build: (A, id) => ({ world: `${wall(id)}${vent(60, 360, 220, 150)}${rail(0, 1650, 1080, 1650)}${cable("M1100 500 C820 600 900 860 760 1060", "#0b0f26", 24)}${placard(780, 620)}${led(920, 1140)}
      ${porthole(id, 840, 1380, 150, `<rect width="1080" height="1920" fill="#02040f"/>${stars(25, 14, 1230, 1540)}${earth(id, 800, 1620, 420, { k: 9 })}`, 9)}
      ${fan(id, 540, 300, 150)}${airflow(540, 300, 4, 380)}${sleeper(A, id, 450, 760, 1.5, { mask: true, plugs: true })}
      ${[[330, 880], [570, 880], [330, 1100], [570, 1100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#9aa8d0"/><circle cx="${x}" cy="${y}" r="7" fill="#1a1a2a"/>`).join("")}${floaters(33, 5, 60, 1020, 900, 1500)}${dark(0.2)}`,
      hud: cap(id, "tu dors dans un *sac de couchage*\naccroché au mur") + tag(570, 1100, "accroché au mur", 600, 1560) + vig(id, 1) }) },
  { id: "f11", name: "PAS DE PLUIE SUR UN TOIT", words: 14, tag: "★ Le hublot s'ouvre sur la Terre qui manque", voice: "Troisième nouvelle, la bonne : eux, ils n'ont pas de pluie sur un toit.",
    note: "<b>Changement de température</b> : le hublot, d'ordinaire bleu froid, <b>s'allume en ambre</b> et montre <b>un toit sous la pluie la nuit</b>, avec sa fenêtre éclairée et ses flaques qui frémissent. C'est un souvenir, pas ce qu'il voit vraiment : un petit <b>vacillement de parasite</b> sur les bords du hublot, et au bas du cadre <b>l'astronaute, les yeux ouverts</b>, le regard dedans. Badge « 3 ».",
    seam: "continu", build: (A, id) => ({ world: `${wall(id, { sat: 30 })}${vent(60, 1500, 220, 150, 6)}${cable("M1100 400 C820 480 900 760 800 880", "#0b0f26", 24)}${diorama(id, roofScene, 540, 940, 400, 11)}<ellipse cx="540" cy="940" rx="560" ry="560" fill="${AMB}" opacity=".08"/>
      ${sleeper(A, id, 190, 1520, 0.9, {})}${dark(0.22)}`,
      hud: badge(3) + cap(id, "eux, ils n'ont pas de\n*pluie sur un toit*") + vig(id, 1) }) },
  { id: "f12", name: "PAS DE TERRASSE DE CAFÉ", words: 5, tag: "Hublot : la terrasse", voice: "Pas de terrasse de café.",
    note: "<b>Même hublot, autre souvenir</b> : <b>une terrasse de café la nuit</b>, guirlandes, tables, tasses qui fument. Le tout vacille un instant (parasite) et s'éteint à moitié, comme une télé mal réglée. Le hublot reste ambre, le reste de la pièce bleu : le contraste dit tout.",
    seam: "coupe sèche (même cadre)", build: (A, id) => ({ world: `${wall(id, { sat: 30 })}${vent(60, 1500, 220, 150, 6)}${cable("M1100 400 C820 480 900 760 800 880", "#0b0f26", 24)}${diorama(id, cafeScene, 540, 940, 400, 12)}<ellipse cx="540" cy="940" rx="560" ry="560" fill="${AMB}" opacity=".08"/>${sleeper(A, id, 190, 1520, 0.9, {})}${dark(0.22)}`,
      hud: cap(id, "pas de *terrasse de café.*") + vig(id, 1) }) },
  { id: "f13", name: "PAS DE RUE QUI S'ENDORT", words: 6, tag: "Hublot : la rue", voice: "Pas de rue qui s'endort.",
    note: "<b>Troisième souvenir : une rue la nuit</b>. Les fenêtres s'éteignent une à une, puis les lampadaires, un chat traverse. À la dernière lumière, <b>le hublot redevient la vraie vue</b> (le noir, la Terre) : le souvenir était un souvenir. Fin du bloc « ce qu'ils n'ont pas ».",
    seam: "coupe sèche (même cadre)", build: (A, id) => ({ world: `${wall(id, { sat: 30 })}${vent(60, 1500, 220, 150, 6)}${cable("M1100 400 C820 480 900 760 800 880", "#0b0f26", 24)}${diorama(id, streetScene, 540, 940, 400, 13)}${sleeper(A, id, 190, 1520, 0.9, {})}${dark(0.3)}`,
      hud: cap(id, "pas de *rue qui s'endort.*") + vig(id, 1) }) },
  { id: "f14", name: "TOI, SI.", words: 2, tag: "★ Retour dans ton lit", voice: "Toi, si.",
    note: "<b>Coupe sur le lit de la série</b> (plongée, chambre chaude, lampe de chevet ambre) : la pluie tape sur la fenêtre, <b>il y a une gravité</b> (tout est posé : la tasse, les chaussettes, la couette). L'ambiance bascule du froid au chaud. Aucun néon ici : le téléphone est posé, écran noir. « Toi, si. » arrive seul, en gros.",
    seam: "coupe sèche", build: (A, id) => ({ world: `<rect x="-200" y="-200" width="1480" height="2320" fill="#14122e"/><ellipse cx="300" cy="860" rx="520" ry="620" fill="${AMB}" opacity=".14"/>${BED(A, { clock: "23:40" })}<rect x="760" y="640" width="150" height="150" rx="14" fill="#1a1638" stroke="${AMB}" stroke-opacity=".5" stroke-width="5"/><path d="M835 640 V790 M760 715 H910" stroke="${AMB}" stroke-opacity=".5" stroke-width="5"/>
      ${Array.from({ length: 22 }, (_, i) => `<line x1="${760 + ((i * 37) % 150)}" y1="${640 + ((i * 53) % 130)}" x2="${752 + ((i * 37) % 150)}" y2="${668 + ((i * 53) % 130)}" stroke="#bfe0ff" stroke-opacity=".7" stroke-width="3"/>`).join("")}
      <path d="M520 1560 h60 v70 q0 30 -30 30 q-30 0 -30 -30z" fill="#f1ede4"/><path d="M700 1500 h40 v60 q0 30 -26 32 q-24 2 -24 -18z" fill="#8fa0d8"/>${dark(0.12)}`,
      hud: cap(id, "*Toi*, si.", 470).replace('font-size="76"', 'font-size="120"') + vig(id, 1) }) },
  { id: "f15", name: "SUR LISTEN", words: 12, tag: "★ Le néon, enfin : Listen", voice: "Sur Listen, t'écoutes des vrais endroits de la Terre, enregistrés sur place.",
    note: "<b>Premier et seul moment néon de l'épisode</b> (cyan → violet → magenta, réservé à Listen). <b>L'écran du téléphone s'allume</b> et de lui sortent <b>trois bulles néon</b> qui montent : le toit sous la pluie, la terrasse, la rue (les mêmes dioramas qu'au hublot, mais en contour néon). Un petit globe avec des repères néon dit « enregistré sur place ». <b>Le toit, la terrasse, la rue reviennent donc, mais cette fois ils sont à toi.</b>",
    seam: "coupe sèche", build: (A, id) => ({ world: `<rect x="-200" y="-200" width="1480" height="2320" fill="#0d0f2a"/><ellipse cx="540" cy="1380" rx="560" ry="420" fill="url(#${id}-gNeonGlow)" opacity=".9"/>
      ${[[300, 740, 150, roofScene], [770, 800, 150, cafeScene], [540, 1000, 170, streetScene]].map(([x, y, r, sc], i) => `<g opacity=".95">${porthole(id, x, y, r, `<g transform="translate(${x - r} ${y - r}) scale(${(2 * r) / 1000})">${sc(id, 20 + i)}</g>`, 20 + i).replace(/#2a3358|#4a5584|#1b2142/g, "#0d0f2a")}<circle cx="${x}" cy="${y}" r="${r + 36}" fill="none" stroke="url(#${id}-gNeon)" stroke-width="9" filter="url(#${id}-fGlowN)"/></g>`).join("")}
      <path d="M450 1200 L540 1255 L630 1200" stroke="url(#${id}-gNeon)" stroke-width="7" fill="none" stroke-dasharray="14 12" opacity=".7"/>
      <rect x="410" y="1275" width="260" height="250" rx="44" fill="#0b0d1a" stroke="url(#${id}-gNeon)" stroke-width="12" filter="url(#${id}-fGlowN)"/><rect x="426" y="1291" width="228" height="218" rx="30" fill="#12153a"/>
      <g stroke="url(#${id}-gNeon)" stroke-width="9" stroke-linecap="round" fill="none">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${462 + i * 26} ${1430 - [20, 40, 24, 60, 36, 52, 20][i]} v${[40, 70, 44, 90, 60, 80, 40][i]}"/>`).join("")}</g>
      <g transform="translate(860 1380)"><circle r="90" fill="#12153a" stroke="url(#${id}-gNeon)" stroke-width="8"/><ellipse rx="96" ry="34" fill="none" stroke="url(#${id}-gNeon)" stroke-width="4" opacity=".6"/><ellipse rx="40" ry="96" fill="none" stroke="url(#${id}-gNeon)" stroke-width="4" opacity=".6"/>${[[-30, -20], [20, 30], [40, -40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${AMB}"/>`).join("")}</g>`,
      hud: cap(id, "sur *Listen*, t'écoutes des vrais\nendroits de la Terre,\nenregistrés *sur place*") + vig(id, 1) }) },
  { id: "f16", name: "SI T'EN METTAIS UN CE SOIR ?", words: 6, tag: "Fin · le lit, la pluie, le sommeil", voice: "Si t'en mettais un ce soir ?",
    note: "<b>On revient au lit de la série</b>, le téléphone posé sur la table de nuit, <b>écran néon qui éclaire la couette</b>. À la fenêtre, <b>la pluie du premier diorama</b>. Le personnage s'endort (yeux qui se ferment), on pousse lentement sur lui, le néon baisse. <b>Pas de carte de fin</b> : l'image fait le travail, et la boucle revient sur le lit qui décolle (plan 01).",
    seam: "fin (boucle sur 01)", build: (A, id) => ({ world: `<rect x="-200" y="-200" width="1480" height="2320" fill="#101230"/><ellipse cx="260" cy="800" rx="460" ry="520" fill="url(#${id}-gNeonGlow)" opacity=".95"/>${BED(A, { clock: "23:41", phone: true, neon: true })}
      <rect x="760" y="640" width="150" height="150" rx="14" fill="#1a1638" stroke="${AMB}" stroke-opacity=".5" stroke-width="5"/><path d="M835 640 V790 M760 715 H910" stroke="${AMB}" stroke-opacity=".5" stroke-width="5"/>${Array.from({ length: 22 }, (_, i) => `<line x1="${760 + ((i * 37) % 150)}" y1="${640 + ((i * 53) % 130)}" x2="${752 + ((i * 37) % 150)}" y2="${668 + ((i * 53) % 130)}" stroke="#bfe0ff" stroke-opacity=".7" stroke-width="3"/>`).join("")}${dark(0.18)}`,
      hud: cap(id, "si t'en mettais un\n*ce soir ?*") + vig(id, 1) }) },
];

// ---------- minutage estimé (0,34 s par mot) + respirations ----------
let t = 0.1;
for (const f of F) { f.t0 = t; t += f.words * 0.34 + (f.pause || 0); f.t1 = t; t += 0.2; }
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

const principles = `<article class="cell meta wide"><h3>Principes (même DA, décors plus riches et immersifs)</h3><ol class="seams">
<li><b>Les décors racontent.</b> La station est dessinée avec ses panneaux, rivets, grilles, câbles, rampes, voyants, hublots : trois plans de profondeur (fond, milieu, avant) qui dérivent à des vitesses différentes, des objets qui flottent partout. Rien n'est vide.</li>
<li><b>Deux températures.</b> Le froid de la station (bleu acier, voyants rouges) contre le chaud de la Terre (ambre : le lit, le toit, le café, la rue). Le néon (cyan → violet → magenta) n'apparaît qu'à <b>« Sur Listen »</b> (15-16) : c'est le seul moment du film où le monde est coloré comme l'appli.</li>
<li><b>Le hublot est le lien.</b> Il montre la Terre froide (02, 07), puis les trois souvenirs chauds (11-13), puis il redevient le téléphone (15). Chaque « nouvelle » a son badge 1, 2, 3.</li>
<li><b>Un plan large seulement</b> (06, le tunnel de la station), pour l'immersion ; tout le reste est serré, comme dans « Dessous ».</li>
<li><b>Boucle</b> : la fin (16, le lit) rejoint le début (01, le lit qui décolle).</li></ol></article>`;
const questions = `<article class="cell meta"><h3>À trancher avant la voix</h3><ol class="seams">
<li><b>Produit</b> : cet épisode finit sur Listen, donc le néon est présent. Je pars de « une annonce qui se cache dans un fait », sans carte de fin. Confirmes-tu ?</li>
<li><b>« Troisième nouvelle, la bonne »</b> : « la bonne » se rapporte à toi (« Toi, si. »), mais à l'oral on peut l'entendre comme la bonne nouvelle <i>des astronautes</i>. Une pause après « la bonne » règle ça. Je ne change pas ton texte.</li>
<li><b>Voix</b> : Laura (comme l'épisode 1, qui parle de Listen) ou une autre ? Tu me donnes voix + SRT.</li>
<li><b>Durée</b> : 135 mots, ≈ ${Math.round(total)} s (0,34 s par mot). C'est le plus long : la rétention dépendra du rythme des images ; ta prise fera foi.</li>
<li><b>Faits</b> : tout est exact (ISS : ≈ 16 levers de soleil par jour, ventilation obligatoire contre le CO₂, masques et bouchons, sacs fixés au mur). « Jusqu'à seize » est une précaution correcte.</li></ol></article>`;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Astronaute · storyboard</title>
<style>
@font-face{font-family:Fraunces;font-style:italic;font-weight:700;src:${font("Fraunces-Italic-700.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:700;src:${font("Nunito-700.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:800;src:${font("Nunito-800.woff2")} format("woff2")}
@font-face{font-family:Nunito;font-weight:900;src:${font("Nunito-900.woff2")} format("woff2")}
*{box-sizing:border-box;margin:0}
body{background:#0c0e1f;color:${CREAM};font-family:Nunito,system-ui,sans-serif;padding:40px 16px 80px}
header{max-width:1500px;margin:0 auto 32px;display:flex;flex-wrap:wrap;align-items:baseline;gap:16px 24px}
header h1{font-family:Fraunces;font-style:italic;font-weight:700;font-size:40px}header h1 em{color:${AMB};font-style:italic}
header p{opacity:.8;font-size:17px;flex:1 1 420px}
.tag{border:1px solid #ffffff33;border-radius:99px;padding:6px 14px;font-weight:800;font-size:14px;letter-spacing:.06em}
.toggle{font-size:14px;opacity:.85;cursor:pointer}
main{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:28px}
.cell{display:flex;flex-direction:column;gap:8px;min-width:0}
.frame{position:relative;aspect-ratio:9/16;border-radius:14px;overflow:hidden;background:${C.night0};box-shadow:0 10px 30px #0008}
.frame>.ls-stage,.frame .safe{position:absolute;inset:0;width:100%;height:100%}.ls-stage{overflow:hidden;background:${C.night0}}.ls-tilt{position:absolute;inset:0}.ls-stage svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.frame .safe{pointer-events:none}
.label{display:flex;justify-content:space-between;gap:8px;font-weight:900;font-size:13px;letter-spacing:.06em;opacity:.9}
.voice{font-size:13.5px;line-height:1.4;font-style:italic;opacity:.7}.note{font-size:14px;line-height:1.45;opacity:.88}.note b{color:${AMB}}
.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{font-size:12px;font-weight:800;border-radius:99px;padding:4px 10px;background:#ffffff14}.chip.tag{background:#f5b85a22;color:${AMB}}
.meta{background:#ffffff08;border:1px solid #ffffff14;border-radius:14px;padding:18px}.meta.wide{grid-column:1/-1}
.meta h3{font-family:Fraunces;font-style:italic;font-size:26px;margin-bottom:10px}.seams{font-size:14px;line-height:1.55;padding-left:18px;margin-bottom:10px}.seams b{color:${AMB}}
#hide:checked ~ main .safe{display:none}
</style></head><body>
<input type="checkbox" id="hide" hidden>
<header><h1>Astronaute — <em>décors immersifs</em> · storyboard ${VERSION}</h1>
<p>Script (${totalWords} mots). Croquis statiques : cadrage, hiérarchie, textes et mouvements à valider avant l'animation. Durées estimées à 0,34 s par mot ; ta prise fera foi.</p>
<span class="tag">1080×1920 · ≈ ${Math.round(total)} s · ${F.length} croquis</span>
<label class="toggle" for="hide">☐ masquer les zones TikTok</label></header>
<main>${principles}${F.map(cell).join("\n")}${questions}</main>
</body></html>`;
writeFileSync(new URL("../storyboard.html", import.meta.url), html);
console.log("storyboard.html écrit —", F.length, "croquis,", totalWords, "mots, ≈", fmt(total), "s");
