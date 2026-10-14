// 14 — ET TOI ? Rappel exact du cadre d'ouverture : même vue du dessus, mais on dort, la pluie joue.
const world = A.floorTop() +
  `<g transform="translate(-170 -170) scale(1.32)">${A.bedTop({ clock: ["00:12"] })}</g>` +
  A.rain("rain", 50, 0, 1080, -300, 1700) +
  A.pill("pZz", 820, 700, "Zz", 708, 670);
const hud = A.title("title", "LES NUITS BLANCHES · ÉPISODE 3", ["Et *toi* ?"], 300) +
  A.pill("pComment", 500, 410, "dis-le en commentaire ↓", undefined, undefined, { size: 34 }) +
  `<g id="${A.id("lockup")}"><rect x="140" y="1330" width="720" height="150" rx="40" fill="#0b0d1a" fill-opacity=".88" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>
  ${A.listenIcon(170, 1350, 110)}
  <text x="310" y="1405" font-family="Poppins" font-weight="700" font-size="44" fill="#fff">Listen</text>
  <text x="310" y="1450" font-family="Poppins" font-weight="400" font-size="27" fill="#b8bdd6">Sounds of the World · App Store</text></g>`;
const S = L.stage(root, ID, world, hud);
L.fadeIn(tl, S, sc);
// on dort ; le téléphone diffuse la pluie
gsap.set(S.$("phone-on"), { opacity: 1 });
L.shut(tl, S, 0, true);
tl.fromTo(S.tilt, { rotationX: 24, scale: 1.1 }, { rotationX: 0, scale: 1, duration: 0.7, ease: "power2.out" }, 0);
L.cam(tl, S, { scale: 1 }, { scale: 1.05 }, 0, sc.hostDur, "none");
tl.fromTo(S.$("rain"), { y: -150, opacity: 0.55 }, { y: 150, duration: 1.6, ease: "none", repeat: Math.floor(sc.hostDur / 1.6) }, 0);
tl.to(S.$("phone-on"), { opacity: 0.65, duration: 0.6, yoyo: true, repeat: 4, ease: "sine.inOut" }, 0.5);
L.pill(tl, S, "pZz", 0.45);
tl.to(S.$("pZz-b"), { y: -10, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.9);
// « Et toi ? »
const et = w("L36", 0);
tl.fromTo(S.$("title-over"), { opacity: 0 }, { opacity: 0.85, duration: 0.3 }, et - 0.1);
tl.fromTo(S.$("title-l0"), { opacity: 0, y: 30, scale: 0.9, transformOrigin: "50% 50%" }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2)" }, et);
L.pop(tl, S.$("pComment"), w("L37", 0), { from: 0.6 });
// signature Listen
tl.fromTo(S.$("lockup"), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, w("L37", 3));
