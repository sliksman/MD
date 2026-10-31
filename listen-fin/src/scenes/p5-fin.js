// PLAN 5 — LE RETOUR AU CADRE D'OUVERTURE. Même cadrage que la première image (la vidéo boucle) : le compteur est redevenu gros, il est passé
// de l'ambre au crème. Le téléphone est retourné, le personnage s'endort. La question remplace le compteur : « c'est quoi ton heure de fin ? »
const AM = L.C.amber, O = "470 850";
const world = A.void() + A.bg() + A.bedTop({ clock: ["00:50"] }) +
  `<rect id="${A.id("dk")}" x="-1200" y="-1200" width="3480" height="4320" fill="#04050d" opacity=".5"/>` +
  A.downPhone("dph") + A.warmDots("w", 230, 744, 2, 130, 90) + A.pill("p50", 300, 985, "00:50", 304, 690, { size: 48, w: 200, dot: AM });
const hud = A.title("title", "", ["Et *toi*, c'est quoi", "ton heure de fin ?"], 300, { size: 84, x: 540 }) +
  A.pill("pCom", 540, 500, "dis-le en commentaire ↓", undefined, undefined, { size: 34 }) +
  `<g id="${A.id("lockup")}" opacity="0"><rect x="140" y="1330" width="720" height="150" rx="40" fill="#0b0d1a" fill-opacity=".9" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>${A.listenIcon(170, 1350, 110)}
  <text x="310" y="1405" font-family="Poppins" font-weight="700" font-size="44" fill="#fff">Listen</text><text x="310" y="1450" font-family="Poppins" font-weight="400" font-size="27" fill="#b8bdd6">Sounds of the World · lien en bio</text></g>`;
const S = L.stage(root, ID, world, hud);
gsap.set(S.$("phone"), { opacity: 0 });
gsap.set(S.$("dph-rim"), { opacity: 1 }); gsap.set(S.$("dph"), { opacity: 1 });
["w0", "w1"].forEach((n) => gsap.set(S.$(n), { opacity: 0.55 }));
gsap.set([S.$("title-l0"), S.$("title-l1")], { opacity: 0 });
gsap.set(S.cam, { scale: 1.5, svgOrigin: O });
L.initLids(S, 0.5);
L.shimmer(tl, S.$("w0"), 0.3, 4.3, { per: 1.2, low: 0.3 });
L.shimmer(tl, S.$("w1"), 0.5, 4.3, { per: 1.2, low: 0.3 });

// « Minuit cinquante. » — l'heure, comme au début
L.pill(tl, S, "p50", w("L16", 0) + 0.04);
tl.to(S.$("p50"), { opacity: 0, duration: 0.25 }, w("L16", 2) - 0.1);
// « Six heures dix devant toi. » — il s'endort ; la caméra pousse doucement, comme à la première image
tl.to(S.cam, { scale: 1.58, duration: w("L17", 0) - 0.1, ease: "none" }, 0);
L.shut(tl, S, w("L16", 4), true);
// « Et toi, c'est quoi ton heure de fin ? » — dézoom, la question en grand
const q = w("L17", 0);
tl.to(S.cam, { scale: 1.02, duration: 1.3, ease: "power2.inOut" }, q - 0.1);
tl.fromTo(S.$("title-l0"), { opacity: 0, y: 34, scale: 0.9, transformOrigin: "50% 50%" }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2.4)" }, q + 0.04);
tl.fromTo(S.$("title-l1"), { opacity: 0, y: 34, scale: 0.9, transformOrigin: "50% 50%" }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2.4)" }, w("L17", 3));
L.pill(tl, S, "pCom", w("L17", 6));
tl.fromTo(S.$("lockup"), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(2)" }, w("L17", 7) + 0.1);
