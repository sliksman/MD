// PLAN 1 — RÉVEIL. Vue du dessus du lit (comme la carte de l'étang), téléphone noir posé.
// Le titre de série est un calque à part (compositions/intro-title.html) qui passe au-dessus du volet.
const world = A.floorTop() +
  `<g transform="translate(-170 -170) scale(1.32)">${A.bedTop({ clock: ["07:00"] })}</g>` +
  A.pill("p0700", 250, 560, "07:00", 231, 682, { dot: L.C.amber });
const S = L.stage(root, ID, world, "");
L.cam(tl, S, { scale: 1 }, { scale: 1.05 }, 0, sc.hostDur, "none");
L.pill(tl, S, "p0700", w("L01", 5) - 0.2);
tl.fromTo(S.$("clk"), { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut" }, w("L01", 5));
L.blink(tl, S, 0.7);
// punch
L.punch(tl, S, w("L01", 5), 0.04);
