// PLAN 4 — LA TÊTE (un seul plan continu, sans coupe).
// a) tête en gros plan : « confortable », puis la semaine tourne en orbite ;
// b) « Deux. » : la tête descend, une bulle de pensée sort (vue du dessus, comme l'étang) :
//    pomme → parapluie → chaise, puis les trois ensemble, « sans lien » ;
// c) la bulle rentre, la tête remonte : « cognitive shuffle », la boucle des pensées se déroule.
const week = [
  ["pLun", 250, 545, "LUN · réunion 9 h", 220, 600, 40],
  ["pMar", 790, 570, "MAR · rappeler le proprio", 820, 625, 32],
  ["pJeu", 210, 990, "JEU · un cadeau", 150, 880, 40],
  ["pSam", 520, 1140, "SAM · planifier dimanche", 520, 990, 36],
];
const strike = (x1, x2, y, n) => `<line id="${A.id(n)}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${L.C.amber}" stroke-width="7" stroke-linecap="round"/>`;
const chrono = `<g transform="translate(410 1110)"><circle r="20" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="5"/>
  <circle id="${A.id("pie")}" r="20" fill="none" stroke="${L.C.amber}" stroke-width="5" stroke-dasharray="126" stroke-dashoffset="126" transform="rotate(-90)"/></g>`;
const world = A.bg() +
  `<g id="${A.id("rig")}">${A.headClose(500, 760, 170)}</g>` +
  A.dots("orbit", A.ell(500, 760, 400, 230), { step: 30, r: 7 }) +
  week.map(([n, x, y, t, ax, ay, s]) => A.pill(n, x, y, t, ax, ay, { size: s, dot: n === "pSam" ? L.C.amber : "#fff" })).join("") +
  A.pill("pConf", 800, 520, "confortable ✓", 640, 640, { dot: L.C.amber }) +
  `<g id="${A.id("trail")}" fill="#fff" opacity="0"><circle cx="560" cy="1440" r="14"/><circle cx="580" cy="1380" r="20"/></g>` +
  A.bubble(500, 820, 400, 340) +
  A.apple("apple", 505, 840) + A.umbrella("umb", 500, 830) + A.chair("chair", 500, 820) +
  A.dots("link", [[360, 700], [470, 760], [560, 770], [660, 700]], { step: 28, r: 7 }) +
  A.dots("link2", [[700, 760], [560, 880]], { step: 28, r: 7 }) +
  A.pill("pApple", 800, 600, "pomme", 600, 800, { dot: L.C.amber }) +
  A.pill("pUmb", 800, 560, "parapluie", 610, 700, { dot: L.C.amber }) +
  A.pill("pChair", 800, 580, "chaise", 560, 780, { dot: L.C.amber }) +
  A.pill("pSec", 250, 1110, "quelques secondes", undefined, undefined, { size: 36, w: 420, extra: chrono }) +
  A.pill("pHist", 280, 1210, "histoire") + strike(190, 370, 1210, "sHist") +
  A.pill("pList", 720, 1210, "liste") + strike(655, 785, 1210, "sList") +
  A.pill("pTest", 830, 560, "à tester", 800, 660, { dot: L.C.amber });
const hud = A.title("tWeek", "TA TÊTE, À 00:30", ["*Toute* ta semaine."], 300) +
  A.bigNum("n2", "2", "Occupe ton esprit.") +
  A.title("tLien", "PAS D'HISTOIRE, PAS DE LISTE", ["*Sans lien.*"], 300) +
  A.title("tName", "ASTUCE 2 · ÇA S'APPELLE", ["cognitive", "*shuffle*"], 270);
const S = L.stage(root, ID, world, hud);
const hide0 = ["trail", "bubble", "apple", "umb", "chair", "pSec", "sHist", "sList", "tWeek", "tLien", "tName", "n2"];
hide0.forEach((n) => gsap.set(S.$(n), { opacity: 0 }));
L.cam(tl, S, { scale: 1.04 }, { scale: 1 }, 0, 2.5, "power2.out");

// ---- a) « confortable »
const co = w("L14", 2);
L.shut(tl, S, co - 0.2, true);
tl.fromTo(S.$("cheeks"), { opacity: 0 }, { opacity: 0.5, duration: 0.6 }, co);
L.pill(tl, S, "pConf", co - 0.1);
// « Mais ta tête » : les yeux se rouvrent
const te = w("L15", 2);
L.shut(tl, S, te - 0.2, false);
tl.to(S.$("cheeks"), { opacity: 0, duration: 0.5 }, te);
L.pillOut(tl, S, "pConf", te);
tl.fromTo(S.$("eyes-open"), { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.3, duration: 0.35, ease: "power2.out" }, te);
// « n'est pas prête » : l'orbite apparaît, puis la semaine
L.drawDots(tl, S.$("orbit"), w("L15", 4), 1.0);
L.shimmer(tl, S.$("orbit"), w("L15", 4) + 1.0, w("L16", 7) + 0.6, { per: 0.9, low: 0.3 });
[["pLun", 2], ["pMar", 4], ["pJeu", 5]].forEach(([n, k]) => L.pill(tl, S, n, w("L16", k) - 0.15));
L.pill(tl, S, "pSam", w("L16", 7) - 0.1);
tl.fromTo(S.$("tWeek"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, w("L16", 5));

// ---- b) « Deux. » : la semaine tombe, la tête descend, la bulle sort
const down = w("L16", 7) + 0.75;
week.forEach(([n], i) => tl.to(S.$(n), { y: 900, rotation: i % 2 ? 20 : -20, opacity: 0, duration: 0.6, ease: "power2.in" }, down - 0.3 + i * 0.05));
tl.to(S.$("orbit"), { opacity: 0, duration: 0.5 }, down - 0.3);
tl.to(S.$("tWeek"), { opacity: 0, duration: 0.4 }, down - 0.3);
tl.to(S.$("rig"), { y: 860, scale: 0.88, svgOrigin: "500 760", duration: 1.0, ease: "power2.inOut" }, down);
tl.to(S.$("eyes-pup"), { y: -5, duration: 0.5 }, down + 0.8);
tl.fromTo(S.$("bubble"), { opacity: 0, scale: 0, svgOrigin: "560 1400" }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.3)" }, down + 0.6);
tl.fromTo(S.$("trail"), { opacity: 0 }, { opacity: 0.55, duration: 0.5 }, down + 0.5);
const dx = w("L17", 0);
tl.fromTo(S.$("n2"), { opacity: 0 }, { opacity: 1, duration: 0.01 }, dx - 0.02);
tl.fromTo(S.$("n2-seed"), { scale: 1, opacity: 1, transformOrigin: "50% 50%" }, { scale: 4, opacity: 0, duration: 0.5 }, dx);
L.pop(tl, S.$("n2-n"), dx, { from: 0.4 });
tl.fromTo(S.$("n2-over"), { opacity: 0, x: -20 }, { opacity: 0.85, x: 0, duration: 0.5 }, dx + 0.25);
tl.fromTo(S.$("n2-lab"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 }, w("L18", 0));
// un objet à la fois
const objIn = (id, t) => tl.fromTo(S.$(id), { y: -220, opacity: 0, scale: 1 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, t);
const objOut = (id, t) => tl.to(S.$(id), { scale: 0, opacity: 0, svgOrigin: "500 840", duration: 0.35, ease: "power2.in" }, t);
objIn("apple", w("L19", 2) - 0.35);
L.pill(tl, S, "pApple", w("L19", 2) - 0.1);
const qs = w("L20", 0);
L.pop(tl, S.$("pSec"), qs - 0.1, { from: 0.8, ease: "power3.out" });
tl.fromTo(S.$("pie"), { attr: { "stroke-dashoffset": 126 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.0, ease: "none" }, qs);
objOut("apple", w("L21", 0) - 0.15);
L.pillOut(tl, S, "pApple", w("L21", 0) - 0.15);
tl.to(S.$("pSec"), { opacity: 0, duration: 0.4 }, w("L21", 0));
tl.fromTo(S.$("umb"), { scaleX: 0.15, opacity: 0, svgOrigin: "500 830" }, { scaleX: 1, opacity: 1, duration: 0.6, ease: "power3.out" }, w("L21", 2) - 0.3);
L.pill(tl, S, "pUmb", w("L21", 2) - 0.1);
objOut("umb", w("L22", 0) - 0.15);
L.pillOut(tl, S, "pUmb", w("L22", 0) - 0.15);
objIn("chair", w("L22", 2) - 0.35);
L.pill(tl, S, "pChair", w("L22", 2) - 0.1);
// les trois ensemble, « sans lien »
const tog = w("L23", 0) - 0.2;
L.pillOut(tl, S, "pChair", tog);
tl.to(S.$("n2"), { opacity: 0, duration: 0.5 }, tog);
tl.to(S.$("bubble"), { scale: 1.06, svgOrigin: "500 820", duration: 0.8, ease: "power2.inOut" }, tog);
tl.to(S.$("chair"), { x: 0, y: 110, scale: 0.6, svgOrigin: "500 820", duration: 0.8, ease: "power2.inOut" }, tog);
tl.fromTo(S.$("apple"), { x: -205, y: -160, scale: 0, opacity: 0, svgOrigin: "505 840" }, { scale: 0.66, opacity: 1, duration: 0.6, ease: "back.out(1.4)", immediateRender: false }, tog + 0.3);
tl.fromTo(S.$("umb"), { x: 230, y: -180, scale: 0, opacity: 0, svgOrigin: "500 830" }, { scale: 0.6, scaleX: 0.6, opacity: 1, duration: 0.6, ease: "back.out(1.4)", immediateRender: false }, tog + 0.5);
const sl = w("L24", 0);
L.drawDots(tl, S.$("link"), sl - 0.2, 0.6);
L.drawDots(tl, S.$("link2"), sl, 0.4);
tl.fromTo(S.$("tLien"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, w("L24", 1));
tl.to([...S.$("link").querySelectorAll(".dot"), ...S.$("link2").querySelectorAll(".dot")], { y: 70, opacity: 0, duration: 0.6, ease: "power2.in", stagger: { each: 0.03, from: "random" } }, w("L24", 3));
L.pill(tl, S, "pHist", w("L25", 1) - 0.1);
tl.fromTo(S.$("sHist"), { opacity: 1, scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.4, ease: "power2.out" }, w("L25", 3));
L.pill(tl, S, "pList", w("L26", 2) - 0.1);
tl.fromTo(S.$("sList"), { opacity: 1, scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.4, ease: "power2.out" }, w("L26", 4));
tl.to(S.$("eyes-pup"), { x: -5, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, sl);

// ---- c) la bulle rentre, la tête remonte : « cognitive shuffle »
const up = w("L26", 4) + 0.55;
tl.to([S.$("apple"), S.$("umb"), S.$("chair"), S.$("pHist"), S.$("pList"), S.$("sHist"), S.$("sList"), S.$("tLien")], { opacity: 0, duration: 0.4 }, up);
tl.to(S.$("bubble"), { scale: 0, svgOrigin: "560 1400", duration: 0.6, ease: "power2.in" }, up + 0.1);
tl.to(S.$("trail"), { opacity: 0, duration: 0.3 }, up + 0.4);
tl.to(S.$("rig"), { y: 0, scale: 1, svgOrigin: "500 760", duration: 1.0, ease: "power2.inOut" }, up + 0.3);
tl.to(S.$("eyes-pup"), { x: 0, y: 0, duration: 0.4 }, up + 0.6);
// titre
tl.fromTo(S.$("tName"), { opacity: 0 }, { opacity: 1, duration: 0.01 }, w("L27", 0));
tl.fromTo(S.$("tName-over"), { opacity: 0 }, { opacity: 0.85, duration: 0.5 }, w("L27", 1));
tl.fromTo(S.$("tName-l0"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, w("L27", 3) - 0.15);
tl.fromTo(S.$("tName-l1"), { opacity: 0, rotation: -8, scale: 0.7, transformOrigin: "50% 50%" }, { opacity: 1, rotation: 0, scale: 1, duration: 0.7, ease: "back.out(1.6)" }, w("L27", 4) - 0.15);
// la boucle des pensées revient, puis se déroule et s'éteint
const loopT = w("L28", 0);
tl.set(S.$("orbit").querySelectorAll(".dot"), { x: 0, y: 0 }, up);
tl.to(S.$("orbit"), { opacity: 1, duration: 0.01 }, up + 1.2);
L.drawDots(tl, S.$("orbit"), up + 1.2, 1.0, { ir: false });
L.shimmer(tl, S.$("orbit"), up + 2.3, w("L28", 11), { per: 0.9, low: 0.3 });
L.pill(tl, S, "pTest", w("L28", 3) - 0.15);
const un = w("L28", 11);
S.$("orbit").querySelectorAll(".dot").forEach((d, i) => {
  const cx = +d.getAttribute("cx"), cy = +d.getAttribute("cy");
  const ang = Math.atan2(cy - 760, cx - 500);
  tl.to(d, { x: -Math.sin(ang) * 260 + Math.cos(ang) * 120, y: Math.cos(ang) * 260 + Math.sin(ang) * 120, opacity: 0, duration: 1.0, ease: "power2.in" }, un + i * 0.012);
});
L.lids(tl, S, w("L28", 13), 0.5, 0.8);
L.lids(tl, S, sc.hostDur - 0.9, 0.7, 0.8);
