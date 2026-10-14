// 12 — ASTUCE 3 : LISTEN. Le téléphone de la table de nuit grandit et s'allume (premier néon du film).
const world = A.bg() +
  `<ellipse id="${A.id("halo")}" cx="500" cy="820" rx="460" ry="620" fill="${L.C.violet}" opacity="0" filter="${A.u("fBlurL")}"/>` +
  A.rain("rain", 70, 0, 1080, -400, 1920) +
  A.phoneUI(250, 300, 500) +
  A.pill("pListen", 860, 470, "Listen", 760, 420, { dot: L.C.cyan });
const hud = A.bigNum("n3", "3", "Un fond sonore doux.");
const S = L.stage(root, ID, world, hud);
L.fadeIn(tl, S, sc);
// arrivée : le téléphone part de sa place sur la table de nuit (petit, en bas) et remplit le cadre
gsap.set(S.$("bezelGlow"), { opacity: 0 });
gsap.set(S.$("rain"), { opacity: 0 });
L.cam(tl, S, { scale: 0.3, x: 44, y: 4 }, { scale: 1, x: 0, y: 0 }, 0.2, 1.6, "power3.inOut");
// « Trois. »
const tr = w("L31", 0);
tl.fromTo(S.$("n3-seed"), { scale: 1, opacity: 1, transformOrigin: "50% 50%" }, { scale: 4, opacity: 0, duration: 0.3 }, tr);
L.pop(tl, S.$("n3-n"), tr + 0.05, { from: 0.3, ease: "back.out(2.6)" });
tl.fromTo(S.$("n3-over"), { opacity: 0, x: -20 }, { opacity: 0.85, x: 0, duration: 0.35 }, tr + 0.2);
tl.fromTo(S.$("n3-lab"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.35 }, w("L32", 2));
// « fond sonore doux » : l'écran s'allume
const on = w("L32", 2);
tl.to(S.$("screenOff"), { opacity: 0, duration: 0.5, ease: "power1.out" }, on);
tl.fromTo(S.$("bezelGlow"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, on);
tl.fromTo(S.$("halo"), { opacity: 0 }, { opacity: 0.2, duration: 0.8 }, on);
tl.fromTo(S.$("ui").children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.012, ease: "power2.out" }, on + 0.15);
// « l'app Listen »
L.pill(tl, S, "pListen", w("L33", 3) - 0.1);
// « lance » : on tape la piste pluie
const la = w("L33", 5);
tl.fromTo(S.$("trackHi"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, la);
tl.fromTo(S.$("tap"), { opacity: 0.9, scale: 0.5, transformOrigin: "50% 50%" }, { opacity: 0, scale: 1.4, duration: 0.5, ease: "power2.out" }, la);
tl.set(S.$("play"), { opacity: 0 }, la + 0.1).set(S.$("pause"), { opacity: 1 }, la + 0.1);
tl.to(S.$("bezelGlow"), { opacity: 0.6, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, la + 0.3);
// « une pluie régulière » : la pluie tombe autour du téléphone
const pl = w("L33", 7);
tl.fromTo(S.$("rain"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, pl - 0.2);
tl.fromTo(S.$("rain"), { y: -300 }, { y: 300, duration: 1.2, ease: "none", repeat: Math.max(0, Math.floor((sc.hostDur - pl) / 1.2)) }, pl - 0.2);
