// PLAN 5 — LISTEN. L'interface (reconstruite d'après les captures) : une pluie, une forêt. Puis on ressort : le téléphone est
// face contre table sur le canapé, des arcs de points chauds remplissent le salon, la tête n'a plus rien à surveiller.
const AM = L.C.amber, WARM = "#ffd28a";
const dots3 = (n) => `<g id="${A.id("pdots")}">${[0, 1, 2].map((i) => `<circle id="${A.id("pd" + i)}" cx="${820 + i * 56}" cy="212" r="14" fill="${i < n ? AM : "#fff"}" opacity="${i < n ? 1 : 0.22}"/>`).join("")}</g>`;
const room = `<g id="${A.id("bw")}" opacity="0">${A.floorTop()}${A.rug(540, 1100, 780, 760)}<ellipse cx="400" cy="1000" rx="650" ry="500" fill="url(#${A.id("gWarm")})" opacity=".7"/>
  <g transform="translate(-34.8 572) scale(0.62)">${A.couchTop({ held: false })}<g id="${A.id("phoneDown")}" transform="rotate(12 650 980)"><rect x="620" y="925" width="62" height="110" rx="14" fill="#0b0d1a" stroke="#fff" stroke-opacity=".3" stroke-width="4"/></g></g>
  ${A.plant(900, 1330, 66)}${A.headLamp("lamp", 820, 800, 0.8)}${A.warmDots("w", 380, 1180, 3, 120, 90)}${A.pill("pCan", 300, 790, "sur le canapé", 300, 890, { size: 36 })}${A.pill("pRien", 760, 480, "rien à surveiller", 300, 975, { size: 34, dot: WARM })}</g>`;
const phoneSide = `<g id="${A.id("B")}">${A.bg()}<ellipse cx="540" cy="890" rx="460" ry="620" fill="${L.C.violet}" opacity=".2" filter="${A.u("fBlurL")}"/>${A.phoneUI(270, 410, 460, { track: "Pluie", sub: "Sons de l'eau", section: "AMBIANCES" })}${A.pill("pFor", 540, 1417, "pluie · forêt", 540, 1304, { size: 36, dot: L.C.cyan })}</g>`;
const hud = A.bigNum("n3", "3", "Une ambiance.") + dots3(2);
const S = L.stage(root, ID, room + phoneSide, hud);
gsap.set(S.$("screenOff"), { opacity: 0 });
["w0", "w1", "w2"].forEach((n) => gsap.set(S.$(n), { opacity: 0 }));
tl.fromTo(S.$("B"), { scale: 0.93, svgOrigin: "540 960" }, { scale: 1, duration: 0.7, ease: "expo.out" }, 0);
// « Trois. Mets une ambiance. »
const tr = w("L20", 0);
L.slam(tl, S, "n3", tr);
tl.to(S.$("pd2"), { fill: AM, opacity: 1, duration: 0.12 }, tr + 0.4);
tl.fromTo(S.$("pd2"), { scale: 1.9, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, tr + 0.4);
tl.fromTo(S.$("n3-lab"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, ease: "back.out(2)" }, w("L20", 2));
// « Sur l'app Listen, une pluie, une forêt. » : la piste est lancée
L.pill(tl, S, "pFor", w("L21", 4));
const tap = w("L21", 4);
tl.fromTo(S.$("trackHi"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, tap);
tl.fromTo(S.$("tap"), { opacity: 0.9, scale: 0.5, transformOrigin: "50% 50%" }, { opacity: 0, scale: 1.4, duration: 0.7, ease: "power2.out" }, tap);
tl.set(S.$("play"), { opacity: 0 }, tap + 0.15).set(S.$("pause"), { opacity: 1 }, tap + 0.15);
// « Un truc assez constant… » : on ressort du téléphone, il est posé face contre table, la pièce se remplit
const out = w("L22", 0) + 0.1;
tl.to([S.$("n3"), S.$("pFor")], { opacity: 0, duration: 0.3 }, out - 0.1);
tl.to(S.$("B"), { scale: 0.16, x: -120, y: 298, svgOrigin: "500 881.5", duration: 0.55, ease: "power3.in", immediateRender: false }, out);
tl.to(S.$("B"), { opacity: 0, duration: 0.15 }, out + 0.45);
tl.fromTo(S.$("bw"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, out + 0.3);
["w0", "w1", "w2"].forEach((r, i) => { tl.fromTo(S.$(r), { opacity: 0 }, { opacity: 1, duration: 0.05 }, w("L22", 3) + i * 0.2); L.drawDots(tl, S.$(r), w("L22", 3) + i * 0.2, 0.6, { from: "center", ir: false }); });
L.pill(tl, S, "pCan", out + 0.6);
tl.to(S.$("pCan"), { opacity: 0, duration: 0.25 }, w("L22", 9));
L.pill(tl, S, "pRien", w("L22", 10));
L.shut(tl, S, w("L22", 11), true);
