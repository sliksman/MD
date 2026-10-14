// 01 — RÉVEIL. Vue du dessus du lit (carte), téléphone noir posé. Titre de série.
const world = A.floorTop() +
  `<g transform="translate(-170 -170) scale(1.32)">${A.bedTop({ clock: ["07:00"] })}</g>` +
  A.pill("p0700", 250, 560, "07:00", 231, 682, { dot: L.C.amber });
const S = L.stage(root, ID, world, "");

// caméra : zoom avant lent sur la carte
L.cam(tl, S, { scale: 1 }, { scale: 1.07 }, 0, sc.hostDur, "none");
// (le titre de série est un calque à part : compositions/intro-title.html)
// « sept heures » : le réveil s'allume
L.pill(tl, S, "p0700", w("L01", 5) - 0.1);
tl.fromTo(S.$("clk"), { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.25, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, w("L01", 5));
L.blink(tl, S, 0.9);
// sortie : la caméra bascule en plongée
tl.to(S.tilt, { rotationX: 32, scale: 1.12, duration: 0.5, ease: "power2.in" }, sc.hostDur - 0.5);
