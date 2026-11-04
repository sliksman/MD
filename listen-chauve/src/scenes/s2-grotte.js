// PLAN 2 — « Première nouvelle, à moitié surprenante : la tête en bas. Pendant des heures, » (UN SEUL PLAN) : la grotte. Elle pend au plafond, tête en bas, ailes en cape. Trois plans de profondeur. Badge « 1 ».
// Sur « Pendant des heures » : une fenêtre sur le ciel s'ouvre sous elle, le soleil et la lune défilent en accéléré. Elle ne bouge pas d'un poil.
const mid = `<g id="${ID}-pm">${A.caveCeil()}${A.stalac("st2", 8, 8, 520, 90, 300, 0, 1080, "#2a3060")}${A.bat("bt", 540, 640, 1.5)}${[[300, 1100], [760, 1300]].map(([x, y], i) => `<ellipse id="${ID}-dr${i}" cx="${x}" cy="${y}" rx="8" ry="12" fill="#bfe0ff" opacity=".7"/>`).join("")}</g>`;
const bg = `<g id="${ID}-pb">${A.caveBg(3)}${A.crystals("cr", 9, 7, 0, 1080, 700, 1700)}${A.mist("ms", 2, 5)}${A.stalac("st1", 5, 10, 0, 120, 380, -20, 1100, "#1a1f48")}</g>`;
const fg = `<g id="${ID}-pf" filter="url(#${ID}-fBlurL)">${A.stalac("st3", 12, 3, 0, 520, 760, 0, 1080, "#2a3060")}</g>`;
const sky = A.porthole("win", 540, 1380, 330, `<rect x="200" y="1040" width="680" height="720" fill="#6aa8e8"/><rect id="${ID}-nt" x="200" y="1040" width="680" height="720" fill="#070a22" opacity="0"/>${A.stars(26, 4, 1050, 1700, 0.8)}<g id="${ID}-rot" data-ox="540" data-oy="1380"><circle cx="540" cy="1150" r="62" fill="#fff1c8"/><circle cx="540" cy="1150" r="140" fill="#ffd08a" opacity=".3"/><circle cx="540" cy="1610" r="48" fill="#e8f0ff"/></g>`);
const S = L.stage(root, ID, `<g id="${ID}-ww" opacity="0" data-ox="540" data-oy="1380">${sky}</g>`.replace(/^/, bg + mid + fg), A.badge("b1", 1) + A.pill("pTete", 700, 1290, "tête en bas", 560, 1030, { size: 40, w: 300, dot: "#F5B85A" }));
gsap.set(S.cam, { svgOrigin: "540 960" });
const D = sc.end - sc.start, p0 = w("L03", 0) - 0.1;
tl.fromTo(S.$("pb"), { x: 0 }, { x: -22, duration: D, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.$("pm"), { x: 0 }, { x: -50, duration: D, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.$("pf"), { x: 0 }, { x: -110, duration: D, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.$("bt-body"), { scale: 1 }, { scale: 1.012, duration: 1.1, yoyo: true, repeat: 5, ease: "sine.inOut", immediateRender: false }, 0);
[0, 1].forEach((i) => tl.fromTo(S.$("dr" + i), { y: 0, opacity: 0.7 }, { y: 420, opacity: 0, duration: 1.6, ease: "power1.in", repeat: 3, delay: i * 0.7, immediateRender: false }, 0.3));
tl.fromTo(S.cam, { scale: 1, y: 0 }, { scale: 1.1, y: -20, duration: D, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.$("b1"), { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.6)", immediateRender: false }, w("L02", 0) + 0.04);
L.pill(tl, S, "pTete", w("L02", 6));
tl.to(S.$("pTete"), { opacity: 0, duration: 0.25 }, p0 - 0.3);
// le temps accéléré derrière elle
tl.fromTo(S.$("ww"), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)", immediateRender: false }, p0);
tl.fromTo(S.$("rot"), { rotation: 0 }, { rotation: 540, duration: D - p0 - 0.05, ease: "power1.inOut", immediateRender: false }, p0 + 0.2);
tl.fromTo(S.$("nt"), { opacity: 0 }, { opacity: 0.9, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, p0 + 0.2);
