// PLAN 1 — LE HOOK. Plongée sur le lit, chambre sombre : la seule vraie lumière est le halo bleu du téléphone sur le visage.
// Le compteur (composition « counter ») descend à la seconde. Caméra fixe en orientation, jamais de pulsation : elle pousse en continu,
// se retire pour le gag « posé / revenu » (le téléphone change d'état, pas la caméra), puis dézoome sur le mur de traits (« depuis des mois »).
const AM = L.C.amber, COLD = "#9cc8ff", O = "470 850";
const rnd = (() => { let k = 11; return () => ((k = (k * 9301 + 49297) % 233280) / 233280); })();

// mur de traits : un <path> par marque, hors de la zone du lit, classé du plus proche au plus lointain (apparition en vague)
const marks = [];
for (let y = -560; y < 2500; y += 108) for (let x = -480; x < 1420; x += 150) {
  const mx = x + rnd() * 26, my = y + rnd() * 26;
  if (mx > 110 && mx < 790 && my > 520 && my < 1700) continue;
  marks.push({ x: mx, y: my, c: rnd() < 0.8 ? COLD : AM });
}
marks.sort((a, b) => Math.hypot(a.x - 540, a.y - 1050) - Math.hypot(b.x - 540, b.y - 1050));
const wall = `<g id="${A.id("wall")}">${marks.map((m, i) => `<path class="mk" d="M${m.x} ${m.y}v68M${m.x + 27} ${m.y}v68M${m.x + 54} ${m.y}v68M${m.x + 81} ${m.y}v68M${m.x - 12} ${m.y + 58}L${m.x + 105} ${m.y + 10}" stroke="${m.c}" stroke-width="11" stroke-linecap="round" fill="none" opacity="0"/>`).join("")}</g>`;

const bedG = A.bedTop({ clock: ["00:34"] });
const tremble = `<g id="${A.id("trm")}" opacity="0" stroke="${AM}" stroke-width="6" stroke-linecap="round" fill="none"><path d="M262 648 l-18 -10 M258 667 h-22 M262 686 l-18 10"/><path d="M338 648 l18 -10 M342 667 h22 M338 686 l18 10"/></g>
  <circle id="${A.id("ring")}" cx="304" cy="667" r="44" fill="none" stroke="${AM}" stroke-width="6" opacity="0"/>`;
const world = A.void() + A.bg() + wall + bedG + tremble +
  `<rect id="${A.id("dk")}" x="-1200" y="-1200" width="3480" height="4320" fill="#04050d" opacity=".42" style="pointer-events:none"/>` +
  A.tablePhoneLit("tph") + A.heldPhone("held") + A.pill("p34", 215, 1000, "00:34", 304, 690, { size: 48, w: 200, dot: AM });
const hud = A.tally("ty", 1420) +
  A.pill("pVol", 540, 1180, "volonté", 542, 800, { size: 104 }) + `<line id="${A.id("sVol")}" x1="330" y1="1172" x2="760" y2="1172" stroke="${AM}" stroke-width="16" stroke-linecap="round" opacity="0"/>`;
const S = L.stage(root, ID, world, hud);
gsap.set([S.$("trm"), S.$("ring"), S.$("tph"), S.$("p34"), S.$("sVol")], { opacity: 0 });
gsap.set(S.$("phone"), { opacity: 0 });
const marksEl = [...S.$("wall").querySelectorAll(".mk")];

// --- caméra : on est déjà dedans à la première image, ça pousse en continu
gsap.set(S.cam, { scale: 1.5, svgOrigin: O });
tl.to(S.cam, { scale: 1.66, svgOrigin: O, duration: w("L03", 0) + 0.2, ease: "none" }, 0);
tl.to(S.cam, { scale: 1.2, duration: 0.7, ease: "power2.inOut" }, w("L03", 0) + 0.2);

// --- « Dans six heures vingt-six, ton réveil sonne. Et toi, tu scrolles. » : le pouce scrolle, le halo clignote à chaque glissement
const swipe = (t) => {
  [0, 1, 2].forEach((i) => tl.fromTo(S.$("held-sw" + i), { opacity: 0.75, y: 40 }, { opacity: 0, y: -70 - i * 14, duration: 0.34, ease: "power2.out", immediateRender: false }, t + i * 0.04));
  tl.fromTo(S.$("held-halo"), { opacity: 0.95 }, { opacity: 0.55, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.out", immediateRender: false }, t);
};
for (let t = 0.3; t < w("L03", 0) - 0.2; t += 0.42) swipe(t);
L.blink(tl, S, 1.1);
// « sonne » : le petit réveil de la table de nuit s'agite, des ondes ambre partent de lui
const sonne = w("L01", 6);
tl.set(S.$("trm"), { opacity: 1 }, sonne - 0.03);
tl.fromTo(S.$("trm"), { opacity: 0.2 }, { opacity: 1, duration: 0.08, yoyo: true, repeat: 7, immediateRender: false }, sonne);
tl.set(S.$("trm"), { opacity: 0 }, sonne + 0.75);
tl.fromTo(S.$("clk"), { x: -4 }, { x: 4, duration: 0.05, yoyo: true, repeat: 13, ease: "none", immediateRender: false }, sonne);
tl.set(S.$("clk"), { x: 0 }, sonne + 0.72);
[0, 0.28].forEach((d) => tl.fromTo(S.$("ring"), { opacity: 0.9, scale: 0.5, transformOrigin: "50% 50%" }, { opacity: 0, scale: 2.4, duration: 0.55, ease: "power2.out", immediateRender: false }, sonne + d));

// --- « Minuit trente-quatre. » : la pastille 00:34 se pose sur le réveil
const mn = w("L03", 1);
tl.set(S.$("p34"), { opacity: 1 }, mn - 0.02);
L.pill(tl, S, "p34", mn);
tl.to(S.$("p34"), { opacity: 0, duration: 0.2 }, w("L04", 0) - 0.05);

// --- « T'as posé ton téléphone deux fois. Il est revenu deux fois. » : le gag. Caméra fixe ; l'objet change d'état.
const state = (t, held) => {     // held = le téléphone est dans la main
  tl.set(S.$("held"), { opacity: held ? 1 : 0 }, t);
  tl.set(S.$("tph"), { opacity: held ? 0 : 1 }, t);
  tl.to(S.$("dk"), { opacity: held ? 0.42 : 0.56, duration: 0.05 }, t);
  tl.to(S.$("eyes-pup"), { x: held ? 0 : -7, duration: 0.1 }, t);
  if (held) tl.fromTo(S.$("held"), { y: 36 }, { y: 0, duration: 0.14, ease: "back.out(2.4)", immediateRender: false }, t);
  else tl.fromTo(S.$("tph"), { scale: 1.25, svgOrigin: "230 744" }, { scale: 1, duration: 0.12, ease: "power3.out", immediateRender: false }, t);
};
const tick = (id, t) => tl.fromTo(S.$(id), { opacity: 0, scaleY: 0, transformOrigin: "50% 100%" }, { opacity: 1, scaleY: 1, duration: 0.16, ease: "back.out(2.6)", immediateRender: false }, t);
const box = (k, t) => tl.fromTo(S.$("ty-" + k), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25, ease: "power3.out", immediateRender: false }, t);
const pose1 = w("L04", 1), back1 = w("L04", 2) + 0.12, pose2 = w("L04", 4), back2 = w("L05", 2);
state(pose1, false); box("P", pose1); tick("ty-p0", pose1 + 0.08);
state(back1, true); box("R", back1); tick("ty-r0", back1 + 0.08);
state(pose2, false); tick("ty-p1", pose2 + 0.08);
state(back2, true); tick("ty-r1", back2 + 0.08);
L.blink(tl, S, back2 + 0.5);
tl.to(S.$("ty-P"), { opacity: 0, duration: 0.2 }, w("L06", 0) - 0.1);
tl.to(S.$("ty-R"), { opacity: 0, duration: 0.2 }, w("L06", 0) - 0.1);

// --- « Cette négo, tu la perds depuis des mois. » : dézoom, le mur de traits recouvre la chambre
const dz = w("L06", 0) - 0.05;
tl.to(S.cam, { scale: 0.58, duration: w("L06", 7) + 0.25 - dz, ease: "power2.inOut" }, dz);
tl.to(marksEl, { opacity: 0.5, y: 0, duration: 0.2, ease: "power2.out", stagger: { each: 1.5 / marksEl.length } }, w("L06", 2) - 0.2);

// --- « Et c'est pas une question de volonté. » : retour sur la tête, le mot « volonté » barré, énorme
const back = w("L06", 7) + 0.3;
tl.to(S.cam, { scale: 1.25, duration: w("L07", 0) + 0.25 - back, ease: "power3.inOut" }, back);
tl.to(S.$("wall"), { opacity: 0.2, duration: 0.5 }, w("L07", 0) - 0.2);
L.blink(tl, S, w("L07", 3));
L.pill(tl, S, "pVol", w("L07", 5));
tl.set(S.$("sVol"), { opacity: 1 }, w("L07", 6) - 0.04);
tl.fromTo(S.$("sVol"), { scaleX: 0, svgOrigin: "330 1172" }, { scaleX: 1, duration: 0.2, ease: "power3.out", immediateRender: false }, w("L07", 6) - 0.04);
