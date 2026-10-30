// PLAN 2 — LE RÉVEIL. Le canapé à gauche, une table de chevet à droite avec un vrai réveil.
// Astuce 1 : les heures de coucher défilent et sont barrées → heure de fin → le réveil ambre sonne → il est balayé.
const AM = L.C.amber, COLD = "#9cc8ff";
const strikeEl = (name, x1, x2, y, wd = 9) => `<line id="${A.id(name)}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${AM}" stroke-width="${wd}" stroke-linecap="round" opacity="0"/>`;
const dots3 = (n) => `<g id="${A.id("pdots")}">${[0, 1, 2].map((i) => `<circle id="${A.id("pd" + i)}" cx="${820 + i * 56}" cy="212" r="14" fill="${i < n ? AM : "#fff"}" opacity="${i < n ? 1 : 0.22}"/>`).join("")}</g>`;
const world = A.floorTop() +
  `<g transform="translate(-177 260) scale(0.8)">${A.couchTop({ halo: 420 })}</g>` +
  A.sideTable("tbl", 740, 860, 420, 600) +
  A.dots("ring1", A.arc(740, 860, 245, 0, 360, 72), { step: 24, r: 7, color: AM, opacity: 0.85, glow: "fGlowA" }) +
  A.dots("ring2", A.arc(740, 860, 315, 0, 360, 90), { step: 26, r: 6, color: AM, opacity: 0.45 }) +
  A.alarmClock("ac", 740, 860, 2, { times: ["22:30", "23:00", "23:30"], size: 44 }) +
  A.pill("p2230", 600, 480, "22:30", 680, 640, { size: 40 }) + strikeEl("s2230", 530, 670, 480, 8) +
  A.pill("p2300", 880, 560, "23:00", 800, 660, { size: 40 }) + strikeEl("s2300", 810, 950, 560, 8) +
  A.pill("pCou", 740, 1195, "heure de coucher", 740, 1050, { size: 38 }) +
  A.pill("pFin", 740, 470, "alarme · heure de fin", 740, 640, { dot: AM, size: 38 }) +
  A.pill("pArr", 740, 1195, "pour t'arrêter", 740, 1050, { size: 38 }) +
  A.pill("pOff", 820, 600, "éteinte", 800, 1040, { size: 38 }) + A.pill("pCont", 255, 560, "tu continues", 255, 790, { size: 38, dot: COLD });
const hud = A.bigNum("n1", "1", "Pas d'heure de coucher.") + dots3(0);
const S = L.stage(root, ID, world, hud);
["ring1", "ring2"].forEach((n) => gsap.set(S.$(n), { opacity: 0 }));
["s2230", "s2300"].forEach((n) => gsap.set(S.$(n), { opacity: 0 }));
L.blink(tl, S, 7.0); L.blink(tl, S, 12.5);

// « Un. » : le chiffre claque, le premier point du sommaire s'allume
const un = w("L08", 0);
L.slam(tl, S, "n1", un);
tl.fromTo(S.$("n1-lab"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, ease: "back.out(2)" }, w("L08", 1) + 0.1);
tl.to(S.$("pd0"), { fill: AM, opacity: 1, duration: 0.12 }, un + 0.4);
tl.fromTo(S.$("pd0"), { scale: 1.9, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, un + 0.4);

// les heures de coucher défilent, chacune est barrée
const setTime = (t, i) => { tl.set(S.$("ac-t" + (i - 1)), { opacity: 0 }, t).set(S.$("ac-t" + i), { opacity: 1 }, t); };
L.pill(tl, S, "p2230", w("L08", 5));
tl.fromTo(S.$("s2230"), { opacity: 1, scaleX: 0, svgOrigin: "530 480" }, { scaleX: 1, duration: 0.16, ease: "power3.out" }, w("L08", 6));
setTime(w("L08", 6) + 0.1, 1);
L.pill(tl, S, "pCou", w("L08", 8));
L.pill(tl, S, "p2300", w("L09", 0));
tl.fromTo(S.$("s2300"), { opacity: 1, scaleX: 0, svgOrigin: "810 560" }, { scaleX: 1, duration: 0.16, ease: "power3.out" }, w("L09", 2));
setTime(w("L09", 2) + 0.1, 2);
tl.to([S.$("p2230"), S.$("p2300"), S.$("s2230"), S.$("s2300"), S.$("pCou"), S.$("n1-lab")], { opacity: 0, duration: 0.3 }, w("L10", 0) - 0.1);

// « heure de fin » : le réveil devient ambre
const fin = w("L10", 5);
tl.to(S.$("ac-body"), { fill: AM, duration: 0.25 }, fin);
tl.fromTo(S.$("ac"), { scale: 1, svgOrigin: "740 860" }, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, fin);
// « Mets une alarme. » : il sonne (anneaux de points), la pastille arrive, le téléphone est baissé
const al = w("L12", 2);
tl.to(S.$("phoneHeld"), { opacity: 0, duration: 0.2 }, w("L12", 0));
tl.to(S.$("halo"), { opacity: 0.1, duration: 0.3 }, w("L12", 0));
L.pill(tl, S, "pFin", al);
["ring1", "ring2"].forEach((r, i) => { tl.fromTo(S.$(r), { opacity: 0 }, { opacity: 1, duration: 0.05 }, al + i * 0.1); L.drawDots(tl, S.$(r), al + i * 0.1, 0.5, { from: "center" }); });
const stopRing = w("L14", 3) - 0.02;
tl.fromTo(S.$("ac"), { rotation: -3, svgOrigin: "740 880" }, { rotation: 3, duration: 0.06, yoyo: true, repeat: Math.max(1, Math.floor((stopRing - al) / 0.06) - 1), ease: "none", immediateRender: false }, al);
L.pillOut(tl, S, "pFin", w("L13", 0) - 0.1);
L.pill(tl, S, "pArr", w("L13", 4) - 0.1);
L.pillOut(tl, S, "pArr", w("L14", 0) - 0.1);

// « Elle sonne. Tu l'éteins. » : le réveil est balayé, éteint
const off = w("L14", 3);
tl.to(S.$("ac"), { x: 60, y: 250, rotation: 38, scale: 0.85, svgOrigin: "740 860", duration: 0.28, ease: "power3.in" }, off);
tl.to(S.$("ac-body"), { fill: "#8d88a6", duration: 0.2 }, off);
tl.to(S.$("ac"), { opacity: 0.7, duration: 0.3 }, off);
["ring1", "ring2"].forEach((r) => tl.to(S.$(r), { opacity: 0, duration: 0.2 }, off));
L.pill(tl, S, "pOff", off + 0.25);
// « Tu continues. » : le téléphone revient, halo froid
const cont = w("L15", 0);
tl.set(S.$("phoneHeld"), { opacity: 1 }, cont);
tl.fromTo(S.$("phoneHeld"), { scale: 0.92, svgOrigin: "255 905" }, { scale: 1, duration: 0.3, ease: "back.out(2.4)", immediateRender: false }, cont);
tl.to(S.$("halo"), { opacity: 1, duration: 0.4 }, cont);
L.pill(tl, S, "pCont", cont + 0.1);
