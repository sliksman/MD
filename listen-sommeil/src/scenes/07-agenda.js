// 07 — L'AGENDA. Tête en gros plan ; la semaine tourne en orbite autour d'elle.
const week = [
  ["pLun", 250, 545, "LUN · réunion 9 h", 220, 600, 40],
  ["pMar", 790, 570, "MAR · rappeler le proprio", 820, 625, 32],
  ["pMer", 860, 960, "MER · sport ?", 870, 900, 40],
  ["pJeu", 200, 990, "JEU · un cadeau", 150, 880, 40],
  ["pSam", 520, 1140, "SAM · planifier dimanche", 520, 990, 36],
];
const world = A.bg() + A.headClose(500, 760, 170) +
  A.dots("orbit", A.ell(500, 760, 400, 230), { step: 30, r: 7 }) +
  week.map(([n, x, y, t, ax, ay, s]) => A.pill(n, x, y, t, ax, ay, { size: s, dot: n === "pSam" ? L.C.amber : "#fff" })).join("") +
  A.pill("pConf", 800, 520, "confortable ✓", 640, 640, { dot: L.C.amber });
const hud = A.title("title", "TA TÊTE, À 00:30", ["*Toute* ta semaine."], 300);
const S = L.stage(root, ID, world, hud);
L.fadeIn(tl, S, sc);
// arrivée : la caméra est montée de la jambe à la tête
L.cam(tl, S, { y: -700 }, { y: 0 }, 0, 0.75, "power3.out");
// « confortable » : yeux fermés, joues roses
const co = w("L14", 2);
L.shut(tl, S, co - 0.1, true);
tl.fromTo(S.$("cheeks"), { opacity: 0 }, { opacity: 0.5, duration: 0.4 }, co);
L.pill(tl, S, "pConf", co);
// « Mais ta tête » : les yeux se rouvrent d'un coup
const te = w("L15", 2);
L.shut(tl, S, te - 0.15, false);
tl.to(S.$("cheeks"), { opacity: 0, duration: 0.3 }, te);
L.pillOut(tl, S, "pConf", te);
tl.fromTo(S.$("eyes-open"), { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.3, duration: 0.2, ease: "back.out(3)" }, te);
// « pas prête » : l'orbite apparaît
L.drawDots(tl, S.$("orbit"), w("L15", 5), 0.7);
L.shimmer(tl, S.$("orbit"), w("L15", 5) + 0.8, sc.hostDur - 0.4, { per: 0.5, low: 0.25 });
// la semaine défile
[["pLun", 2], ["pMar", 3], ["pMer", 4], ["pJeu", 5]].forEach(([n, k]) => L.pill(tl, S, n, w("L16", k)));
L.pill(tl, S, "pSam", w("L16", 7) + 0.05);
week.forEach(([n], i) => tl.to(S.$(n + "-b"), { y: i % 2 ? 8 : -8, duration: 0.45, yoyo: true, repeat: 5, ease: "sine.inOut" }, w("L16", 2) + i * 0.1));
tl.fromTo(S.$("title-over"), { opacity: 0 }, { opacity: 0.85, duration: 0.3 }, w("L16", 4));
tl.fromTo(S.$("title-l0"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, w("L16", 5));
// la tête tremble un peu (débordée)
tl.fromTo(S.$("head"), { rotation: 0, svgOrigin: "500 900" }, { rotation: 2, duration: 0.08, yoyo: true, repeat: 7 }, w("L16", 6));
// sortie : la semaine tombe, l'orbite se vide
const out = sc.hostDur - 0.35;
week.forEach(([n], i) => tl.to(S.$(n), { y: 900, rotation: i % 2 ? 25 : -25, opacity: 0, duration: 0.35, ease: "power2.in" }, out + i * 0.02));
tl.to(S.$("orbit"), { opacity: 0, duration: 0.3 }, out);
