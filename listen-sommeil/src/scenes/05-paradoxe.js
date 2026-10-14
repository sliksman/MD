// 05 — PARADOXE. La couette se coupe (comme le sol chez Catcharium) : jambe de profil, la chaussette chauffe.
const world = A.bg() + A.cutStrata() + A.legSide("leg") + A.sockSide("sock") + A.duvetTop("dtop") +
  A.pill("pBody", 260, 560, "corps : à refroidir", 220, 925) +
  A.pill("pFeet", 840, 520, "pieds : chauds", 690, 720, { dot: L.C.amber });
const S = L.stage(root, ID, world, "");
L.fadeIn(tl, S, sc);
// ouverture de la coupe : le dessus de couette se replie vers le haut
L.cam(tl, S, { scale: 1.08 }, { scale: 1 }, 0, 1.2, "power2.out");
tl.fromTo(S.$("dtop"), { scaleY: 1, svgOrigin: "540 420" }, { scaleY: 0, duration: 0.7, ease: "power3.inOut" }, 0.35);
// « réchauffer » : la chaussette luit
const re = w("L10", 6);
tl.fromTo(S.$("sock-glow"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, re);
tl.to(S.$("sock-glow"), { opacity: 0.6, duration: 0.45, yoyo: true, repeat: 3, ease: "sine.inOut" }, re + 0.5);
L.pill(tl, S, "pFeet", w("L10", 8));
L.pill(tl, S, "pBody", w("L10", 12));
// « refroidir » : le corps passe au bleu
tl.fromTo(S.$("leg-cool"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, w("L10", 14));
