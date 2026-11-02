// PLAN 8 — « Toujours trois. Jamais quatre. Onze nuits de suite. » Onze formes d'onde empilées (une par nuit), trois pics chacune ; à droite un quatrième pic
// fantôme, barré. Le compteur du haut défile NUIT 1 → NUIT 11 sur « onze nuits de suite ».
const AM = L.C.amber, CREAM = L.C.cream;
const rows = Array.from({ length: 11 }, (_, i) => { const y = 640 + i * 78, h = 14 + i * 5;
  return `<g id="${A.id("rw" + i)}" opacity="0"><text x="70" y="${y + 9}" font-family="Nunito" font-weight="800" font-size="22" letter-spacing="3" fill="${CREAM}" fill-opacity=".6">N${i + 1}</text>` +
    A.wave("rwv" + i, 130, 880, y, [{ x: 300, h, w: 12 }, { x: 380, h: h * 1.2, w: 12 }, { x: 460, h, w: 12 }], { step: 6, noise: 2, w: 3, op: 0.85 }) + `</g>` +
    `<g id="${A.id("gh" + i)}" opacity="0"><g opacity=".5">${A.wave("ghw" + i, 560, 640, y, [{ x: 600, h: h * 0.9, w: 12 }], { step: 6, noise: 0, w: 3, color: AM })}</g><line id="${A.id("gx" + i)}" x1="552" y1="${y - 14}" x2="648" y2="${y + 14}" stroke="${AM}" stroke-width="4" stroke-linecap="round" stroke-dasharray="110" stroke-dashoffset="110"/></g>`; }).join("");
const world = A.bg() + rows;
const S = L.stage(root, ID, world, "");
// « Toujours trois. » : les onze nuits tombent l'une après l'autre
const r0 = Math.max(0.12, w("L07", 0) - 0.95);                      // les nuits tombent dès la coupe (pas d'écran vide)
for (let i = 0; i < 11; i++) tl.fromTo(S.$("rw" + i), { opacity: 0, y: -26 }, { opacity: 1, y: 0, duration: 0.2, ease: "power3.out" }, r0 + i * 0.07);
// « Jamais quatre. » : le quatrième pic fantôme, barré, sur chaque ligne
const q0 = w("L07", 2) - 0.02;
for (let i = 0; i < 11; i++) {
  tl.fromTo(S.$("gh" + i), { opacity: 0 }, { opacity: 1, duration: 0.1 }, q0 + i * 0.05);
  tl.fromTo(S.$("gx" + i), { strokeDashoffset: 110 }, { strokeDashoffset: 0, duration: 0.14, ease: "power2.out", immediateRender: false }, q0 + 0.1 + i * 0.05);
}
// « Onze nuits de suite. » : la dernière ligne s'allume
tl.to(S.$("rw10"), { opacity: 1, duration: 0.01 }, w("L07", 7));
tl.fromTo(S.$("rwv10"), { opacity: 0.85 }, { opacity: 1, duration: 0.1, yoyo: true, repeat: 3, ease: "none", immediateRender: false }, w("L07", 7));
