// PLAN 7 — LES TROIS PICS. La forme d'onde de la nuit, pleine largeur, plate. Sur « Un. Deux. Trois. » trois pics, chacun avec son chiffre qui claque
// (comme les règles de « Heure de fin »). Sur « Puis un silence » les pics retombent : la ligne redevient plate, et on la laisse (le seul temps calme).
const AM = L.C.amber, Y = 1000;
const sp = (n, x, h) => A.wave("sp" + n, x - 40, x + 40, Y, [{ x, h, w: 18 }], { noise: 0, step: 4, w: 5, op: 1 });
const num = (n, x, y) => `<text id="${A.id("n" + n)}" data-ox="${x}" data-oy="${y - 50}" x="${x}" y="${y}" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="150" fill="${AM}" filter="url(#${A.id("fShadow")})" opacity="0">${n}</text>`;
const world = A.bg() + `<rect width="1080" height="1920" fill="#04050d" opacity=".2"/>` +
  A.wave("wb", 40, 1040, Y, [], { noise: 5, draw: true, op: 0.9 }) +
  `<line id="${A.id("cur")}" data-ox="540" data-oy="700" x1="540" y1="700" x2="540" y2="1340" stroke="${AM}" stroke-width="4" stroke-dasharray="3 14" stroke-linecap="round" opacity="0"/>` +
  sp(1, 400, 190) + sp(2, 540, 250) + sp(3, 680, 200) + num(1, 400, 770) + num(2, 540, 730) + num(3, 680, 770) +
  A.pill("pSi", 800, 1180, "silence", undefined, undefined, { size: 44 });
const S = L.stage(root, ID, world, "");
[["sp1", "400 1000"], ["sp2", "540 1000"], ["sp3", "680 1000"]].forEach(([n, o]) => { gsap.set(S.$(n), { svgOrigin: o }); });
gsap.set([S.$("sp1"), S.$("sp2"), S.$("sp3")], { opacity: 0, scaleY: 0 });
{ const e = S.$("wb"), L0 = +e.getAttribute("data-len"); tl.fromTo(e, { strokeDashoffset: L0 }, { strokeDashoffset: 0, duration: 0.9, ease: "none", immediateRender: true }, 0.05); }
// « Trois heures douze pile. » : le curseur ambre arrive sur 03:12
tl.fromTo(S.$("cur"), { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.35, ease: "power2.out" }, w("L06", 0));
// « Un. Deux. Trois. » : un pic + son chiffre à chaque mot
[4, 5, 6].forEach((wi, i) => {
  const n = i + 1, t = w("L06", wi);
  tl.fromTo(S.$("sp" + n), { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.12, ease: "power3.out", immediateRender: false }, t - 0.02);
  tl.fromTo(S.$("n" + n), { opacity: 0, scale: 2.2, rotation: -10 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.2)", immediateRender: false }, t);
});
// « Puis un silence. » : les pics et les chiffres s'effacent, la ligne reste plate
const sil = w("L06", 9);
tl.to([S.$("sp1"), S.$("sp2"), S.$("sp3"), S.$("n1"), S.$("n2"), S.$("n3"), S.$("cur")], { opacity: 0, duration: 0.35, ease: "power2.in" }, sil - 0.05);
L.pill(tl, S, "pSi", sil + 0.15);
