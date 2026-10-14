// 10 — LE NOM. « cognitive shuffle » ; la boucle des pensées se déroule et s'éteint ; les paupières tombent.
const world = A.bg() + A.headClose(500, 860, 150) +
  A.dots("loop", A.ell(500, 860, 330, 210), { step: 30, r: 7 }) +
  A.pill("pTest", 820, 620, "à tester", 770, 730, { dot: L.C.amber });
const hud = A.title("title", "ASTUCE 2 · ÇA S'APPELLE", ["cognitive", "*shuffle*"], 300);
const S = L.stage(root, ID, world, hud);
L.fadeIn(tl, S, sc);
L.cam(tl, S, { scale: 1.04 }, { scale: 1 }, 0, sc.hostDur - 0.5, "power1.out");
// la boucle tourne déjà (pensées en boucle)
L.drawDots(tl, S.$("loop"), 0.1, 0.6);
L.shimmer(tl, S.$("loop"), 0.7, w("L28", 11), { per: 0.45, low: 0.2 });
// titre
tl.fromTo(S.$("title-over"), { opacity: 0 }, { opacity: 0.85, duration: 0.3 }, w("L27", 1));
tl.fromTo(S.$("title-l0"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, w("L27", 3) - 0.05);
tl.fromTo(S.$("title-l1"), { opacity: 0, rotation: -8, scale: 0.7, transformOrigin: "50% 50%" }, { opacity: 1, rotation: 0, scale: 1, duration: 0.5, ease: "back.out(2.4)" }, w("L27", 4) - 0.05);
L.pill(tl, S, "pTest", w("L28", 3));
// « qui tournent en boucle » : la boucle se déroule et s'éteint
const dots = S.$("loop").querySelectorAll(".dot");
const un = w("L28", 11);
dots.forEach((d, i) => {
  const cx = +d.getAttribute("cx"), cy = +d.getAttribute("cy");
  const ang = Math.atan2(cy - 860, cx - 500);
  tl.to(d, { x: -Math.sin(ang) * 260 + Math.cos(ang) * 120, y: Math.cos(ang) * 260 + Math.sin(ang) * 120, opacity: 0, duration: 0.7, ease: "power2.in" }, un + i * 0.012);
});
// les paupières tombent
L.lids(tl, S, w("L28", 13), 0.55, 0.6);
L.lids(tl, S, sc.hostDur - 0.9, 0.75, 0.8);
// sortie : la caméra recule
tl.to(S.cam, { scale: 0.85, svgOrigin: "540 960", duration: 0.5, ease: "power2.in" }, sc.hostDur - 0.5);
