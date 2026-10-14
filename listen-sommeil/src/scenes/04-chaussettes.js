// 04 — CHAUSSETTES. Caméra au pied du lit : plantes de pied nues, « t'as chaud », les chaussettes glissent dessus.
const world = A.bg() + A.floorIso(1250) +
  `<g id="${A.id("me")}"><circle cx="520" cy="640" r="70" fill="${A.u("gSkin")}"/>${A.eyes("eyes", 497, 543, 632, 10)}
   <path id="${A.id("sweat")}" d="M590 590 q12 22 0 30 q-12 -8 0 -30z" fill="#9cc8ff" opacity="0"/></g>
   <path d="M120 1100 Q160 700 520 690 Q880 700 920 1100 Z" fill="${A.u("gDuvet")}"/>
   <path d="M150 960 Q520 860 890 960" stroke="#5868b0" stroke-width="6" fill="none" opacity=".6"/>
   <g id="${A.id("feet")}">${A.sole("bareL", 380, 930, 1, 1.35, false)}${A.sole("bareR", 660, 930, -1, 1.35, false)}</g>
   <g id="${A.id("sockL")}">${A.sole("sL", 380, 930, 1, 1.35, true)}</g><g id="${A.id("sockR")}">${A.sole("sR", 660, 930, -1, 1.35, true)}</g>
   <path d="M80 1080 h880 v40 h-880z" fill="#cfc8bb"/>
   <rect x="60" y="1110" width="920" height="170" rx="18" fill="${A.u("gWood")}"/><rect x="60" y="1110" width="920" height="16" fill="#6a5a80"/>` +
  A.pill("pSocks", 220, 560, "chaussettes", 340, 820, { dot: L.C.amber }) +
  A.pill("pHot", 800, 520, "t'as chaud", 585, 600);
const hud = A.bigNum("n1", "1", "Mets des chaussettes.");
const S = L.stage(root, ID, world, hud);
L.fadeIn(tl, S, sc);
// arrivée : on descend vers le pied du lit
L.cam(tl, S, { y: 380, scale: 1.12 }, { y: 0, scale: 1 }, 0, 0.7, "power3.out");
// « Un. » : le premier point ambre devient « 1 »
const un = w("L07", 0);
tl.fromTo(S.$("n1-seed"), { scale: 1, opacity: 1, transformOrigin: "50% 50%" }, { scale: 4, opacity: 0, duration: 0.3, ease: "power2.out" }, un);
L.pop(tl, S.$("n1-n"), un + 0.05, { from: 0.3, ease: "back.out(2.6)" });
tl.fromTo(S.$("n1-over"), { opacity: 0, x: -20 }, { opacity: 0.85, x: 0, duration: 0.35 }, un + 0.2);
tl.fromTo(S.$("n1-lab"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.35 }, w("L09", 1));
// les orteils gigotent
tl.fromTo([S.$("bareL"), S.$("bareR")], { rotation: 0, svgOrigin: "520 1040" }, { rotation: 2.5, duration: 0.18, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.4);
// « T'as chaud » : goutte de sueur
const hot = w("L08", 1);
L.pill(tl, S, "pHot", hot - 0.15);
tl.fromTo(S.$("sweat"), { opacity: 0, y: -6 }, { opacity: 1, y: 8, duration: 0.5, ease: "power1.in" }, hot);
// « chaussettes » : elles glissent sur les pieds
const so = w("L09", 3) - 0.15;
gsap.set([S.$("sockL"), S.$("sockR")], { opacity: 0 });
tl.fromTo(S.$("sockL"), { opacity: 0, y: -240 }, { opacity: 1, y: 0, duration: 0.32, ease: "power3.in" }, so);
tl.fromTo(S.$("sockR"), { opacity: 0, y: -240 }, { opacity: 1, y: 0, duration: 0.32, ease: "power3.in" }, so + 0.08);
tl.fromTo([S.$("sockL"), S.$("sockR")], { scaleY: 1, svgOrigin: "520 1090" }, { scaleY: 0.94, duration: 0.09, yoyo: true, repeat: 1 }, so + 0.4);
tl.set(S.$("feet"), { opacity: 0 }, so + 0.45);
L.pill(tl, S, "pSocks", so + 0.3);
