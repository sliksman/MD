// PLAN 4 — LE SALON. Deux heures du mat' : la lampe a l'abat-jour en forme de tête et d'épaules (la silhouette du personnage
// vue dans le couloir). Un salon vide est encore plus silencieux qu'une chambre : la ligne de points plate.
const AM = L.C.amber;
const dots3 = (n) => `<g id="${A.id("pdots")}">${[0, 1, 2].map((i) => `<circle cx="${820 + i * 56}" cy="212" r="14" fill="${i < n ? AM : "#fff"}" opacity="${i < n ? 1 : 0.22}"/>`).join("")}</g>`;
const COUCH = (o) => `<g transform="translate(-34.8 572) scale(0.62)">${A.couchTop(o)}</g>`;
const world = A.floorTop() + A.rug(540, 1100, 780, 760) + COUCH({ empty: true, held: false }) +
  A.plant(880, 1330, 70) + A.headLamp("lamp", 810, 860, 1) + A.personTop("pp", 640, 980, 1) +
  A.bigClock("clk", 400, 470, ["02:00"], { size: 92, w: 280, h: 118 }) +
  A.pill("pCan", 300, 790, "le canapé", 300, 890, { size: 36 }) +
  A.dots("flat", [[40, 700], [1040, 700]], { step: 30, r: 5, opacity: 0.5 }) + A.pill("pSil", 780, 620, "silence", 740, 700, { size: 40 });
const S = L.stage(root, ID, world, dots3(2));
gsap.set(S.$("flat"), { opacity: 0 });
L.blink(tl, S, 3.4, "ppEyes");
// la lampe s'allume (halo chaud qui grandit), l'horloge apparaît
const lt = w("L18", 0);
tl.fromTo(S.$("lamp"), { opacity: 0, scale: 0.7, svgOrigin: "810 860" }, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, lt - 0.2);
tl.fromTo(S.$("clk"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" }, lt);
tl.fromTo(S.$("pp"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, w("L18", 4) - 0.1);
L.pill(tl, S, "pCan", w("L18", 7));
tl.to(S.$("pCan"), { opacity: 0, duration: 0.25 }, w("L19", 0) - 0.1);
// la lampe et le personnage se regardent : léger balancement de la lampe quand il parle de lui (une seule fois)
tl.to(S.$("lamp"), { rotation: 3, svgOrigin: "810 900", duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" }, w("L18", 5));
// « un salon vide… plus silencieux qu'une chambre » : la ligne plate
tl.to(S.$("clk"), { opacity: 0, y: -20, duration: 0.25 }, w("L19", 0) - 0.1);
tl.fromTo(S.$("flat"), { opacity: 0 }, { opacity: 0.5, duration: 0.05 }, w("L19", 12));
L.drawDots(tl, S.$("flat"), w("L19", 12), 0.9, { from: "center", ir: false });
L.pill(tl, S, "pSil", w("L19", 12) + 0.35);
tl.to(S.$("lamp"), { opacity: 0.75, duration: 0.8 }, w("L19", 8));
