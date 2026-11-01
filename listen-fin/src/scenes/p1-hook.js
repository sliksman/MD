// PLAN 1 — LE HOOK. Plongée sur le lit, chambre sombre : la seule vraie lumière est le halo bleu du téléphone sur le visage.
// Le compteur (composition « counter ») descend à la seconde. Caméra fixe en orientation, jamais de pulsation : elle pousse en continu,
// se retire pour le gag « posé / revenu » (le téléphone change d'état, pas la caméra), puis dézoome sur le mur de traits (« depuis des mois »).
const AM = L.C.amber, COLD = "#9cc8ff", O = "470 850";
const rnd = (() => { let k = 11; return () => ((k = (k * 9301 + 49297) % 233280) / 233280); })();

// mur de traits : un <path> par marque, hors de la zone du lit, classé du plus proche au plus lointain (apparition en vague)
const marks = [];
for (let y = 300; y < 2500; y += 108) for (let x = -480; x < 1420; x += 150) {
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
  A.tablePhoneLit("tph") + A.heldPhone("held") + A.flyer("fl");
// --- coupes : (A) 0 → cut1 plan serré tête + téléphone · (B) cut1 → cut2 GROS PLAN visage éclairé, les yeux balaient (« tu scrolles ») ·
//     (C) cut2 → cut3 GROS PLAN du réveil : 00:00 → 00:34 sur « Minuit trente-quatre » · (D) cut3 → plan large pour le gag
const gF = `<g id="${A.id("gF")}" opacity="0"><rect width="1080" height="1920" fill="#080a18"/>
  <rect x="140" y="640" width="800" height="620" rx="170" fill="url(#${A.id("gPillow")})" opacity=".85"/>
  <circle cx="540" cy="960" r="250" fill="url(#${A.id("gSkin")})"/>${A.eyes("eyesF", 455, 625, 935, 40)}
  <rect x="-100" y="1240" width="1280" height="800" fill="url(#${A.id("gDuvet")})"/><rect x="-100" y="1240" width="1280" height="40" fill="${L.C.duvetEdge}"/>
  <ellipse id="${A.id("fHalo")}" cx="540" cy="1020" rx="640" ry="580" fill="url(#${A.id("gHalo")})" opacity=".55"/>
  <g transform="rotate(-6 540 1560)"><rect x="320" y="1250" width="440" height="720" rx="72" fill="#0b0d1a" stroke="#9cc8ff" stroke-opacity=".9" stroke-width="6" filter="url(#${A.id("fGlowS")})"/><rect x="350" y="1280" width="96" height="96" rx="24" fill="#1d2140"/></g>
  <ellipse cx="300" cy="1760" rx="86" ry="60" fill="url(#${A.id("gSkin")})"/><ellipse cx="790" cy="1690" rx="60" ry="88" fill="url(#${A.id("gSkin")})"/>
  ${[0, 1, 2].map((i) => `<rect id="${A.id("fSw" + i)}" x="${830 + i * 34}" y="${1380 + i * 50}" width="14" height="${190 - i * 40}" rx="7" fill="#9cc8ff" opacity="0"/>`).join("")}</g>`;
const gK = `<g id="${A.id("gK")}" opacity="0"><rect width="1080" height="1920" fill="#0a0c1c"/>
  <rect x="-100" y="540" width="1280" height="1500" fill="url(#${A.id("gWood")})"/><rect x="-100" y="540" width="1280" height="14" fill="#6a5a80"/>
  <ellipse id="${A.id("kHalo")}" cx="1130" cy="1000" rx="560" ry="760" fill="url(#${A.id("gHalo")})" opacity=".5"/>
  <g id="${A.id("kIn")}"><ellipse cx="546" cy="1130" rx="470" ry="90" fill="#000" opacity=".4" filter="url(#${A.id("fBlurL")})"/>${A.bigClock("kc", 130, 760, ["00:00", "00:34"], { size: 230, w: 820, h: 330, color: AM })}</g></g>`;
const hud = gF + gK + A.tally("ty", 1420) +
  A.pill("pVol", 540, 1180, "volonté", 542, 800, { size: 104 }) + `<line id="${A.id("sVol")}" x1="342" y1="1196" x2="738" y2="1186" stroke="${AM}" stroke-width="14" stroke-linecap="round" stroke-dasharray="397" stroke-dashoffset="397" opacity="0"/>`;
const S = L.stage(root, ID, world, hud);
gsap.set([S.$("trm"), S.$("ring"), S.$("tph"), S.$("sVol")], { opacity: 0 });
gsap.set(S.$("phone"), { opacity: 0 });
const marksEl = [...S.$("wall").querySelectorAll(".mk")];

// --- caméra : on est déjà dedans à la première image, ça pousse en continu
gsap.set(S.cam, { scale: 1.5, svgOrigin: O });
const cut1 = w("L02", 0) - 0.23, cut2 = w("L03", 0) - 0.02, cut3 = w("L04", 0) - 0.24;   // pile dans les respirations de la voix
tl.to(S.cam, { scale: 1.62, svgOrigin: O, duration: cut1, ease: "none" }, 0);
tl.set(S.cam, { scale: 1.2 }, cut1 + 0.05);   // caché sous le gros plan

// --- « Dans six heures vingt-six, ton réveil sonne. Et toi, tu scrolles. » : le pouce scrolle, le halo clignote à chaque glissement
const swipe = (t) => {
  [0, 1, 2].forEach((i) => tl.fromTo(S.$("held-sw" + i), { opacity: 0.75, y: 40 }, { opacity: 0, y: -70 - i * 14, duration: 0.34, ease: "power2.out", immediateRender: false }, t + i * 0.04));
  tl.fromTo(S.$("held-halo"), { opacity: 0.95 }, { opacity: 0.55, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.out", immediateRender: false }, t);
};
for (let t = 0.3; t < cut1 - 0.3; t += 0.42) swipe(t);
L.blink(tl, S, 1.1);
// « sonne » : le petit réveil de la table de nuit s'agite, des ondes ambre partent de lui
const sonne = w("L01", 6);
tl.set(S.$("trm"), { opacity: 1 }, sonne - 0.03);
tl.fromTo(S.$("trm"), { opacity: 0.2 }, { opacity: 1, duration: 0.08, yoyo: true, repeat: 7, immediateRender: false }, sonne);
tl.set(S.$("trm"), { opacity: 0 }, sonne + 0.75);
tl.fromTo(S.$("clk"), { x: -4 }, { x: 4, duration: 0.05, yoyo: true, repeat: 13, ease: "none", immediateRender: false }, sonne);
tl.set(S.$("clk"), { x: 0 }, sonne + 0.72);
[0, 0.28].forEach((d) => tl.fromTo(S.$("ring"), { opacity: 0.9, scale: 0.5, transformOrigin: "50% 50%" }, { opacity: 0, scale: 2.4, duration: 0.55, ease: "power2.out", immediateRender: false }, sonne + d));

// --- coupe 1 (« Et toi, tu scrolles. ») : gros plan sur le visage éclairé, les yeux balaient de haut en bas à chaque glissement
tl.set(S.$("gF"), { opacity: 1 }, cut1);
tl.fromTo(S.$("gF"), { scale: 1.06, transformOrigin: "50% 50%" }, { scale: 1.12, duration: cut2 - cut1, ease: "none", immediateRender: false }, cut1);
for (let t = cut1 + 0.12, k = 0; t < cut2 - 0.25; t += 0.42, k++) {
  tl.fromTo(S.$("eyesF-pup"), { y: 14 }, { y: -14, duration: 0.3, ease: "power2.out", immediateRender: false }, t);
  tl.fromTo(S.$("fHalo"), { opacity: 0.55 }, { opacity: 0.3, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.out", immediateRender: false }, t);
  [0, 1, 2].forEach((i) => tl.fromTo(S.$("fSw" + i), { opacity: 0.75, y: 40 }, { opacity: 0, y: -70, duration: 0.32, ease: "power2.out", immediateRender: false }, t + i * 0.04));
}
tl.set(S.$("gF"), { opacity: 0 }, cut2);
// --- coupe 2 (« Minuit trente-quatre. ») : gros plan du réveil, 00:00 puis 00:34 ; la lumière bleue de l'écran passe à droite
tl.set(S.$("gK"), { opacity: 1 }, cut2);
tl.fromTo(S.$("kIn"), { scale: 1, svgOrigin: "540 925" }, { scale: 1.08, duration: cut3 - cut2, ease: "none", immediateRender: false }, cut2);
const mn = w("L03", 1);
tl.set(S.$("kc-0"), { opacity: 0 }, mn).set(S.$("kc-1"), { opacity: 1 }, mn);
tl.fromTo(S.$("kc"), { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.1, duration: 0.09, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, mn);
tl.fromTo(S.$("kHalo"), { opacity: 0.5 }, { opacity: 0.25, duration: 0.07, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, cut2 + 0.1);
tl.set(S.$("gK"), { opacity: 0 }, cut3);

// --- « T'as posé ton téléphone deux fois. Il est revenu deux fois. » : le gag. Caméra fixe ; le téléphone VOYAGE (arc, rotation, rétrécissement)
const HAND = { x: 560, y: 905, s: 1, r: -8 }, TBL = { x: 230, y: 744, s: 0.49, r: 0 };
gsap.set(S.$("fl"), { x: HAND.x, y: HAND.y });
const flight = (t, a, b, d) => {
  tl.set(S.$("fl"), { opacity: 1, x: a.x, y: a.y }, t);
  tl.set(S.$("fl-in"), { scale: a.s, rotation: a.r }, t);
  tl.to(S.$("fl"), { x: b.x, duration: d, ease: "power2.inOut" }, t);
  tl.to(S.$("fl"), { y: Math.min(a.y, b.y) - 55, duration: d * 0.45, ease: "power2.out" }, t);
  tl.to(S.$("fl"), { y: b.y, duration: d * 0.55, ease: "power2.in" }, t + d * 0.45);
  tl.to(S.$("fl-in"), { scale: b.s, rotation: b.r, duration: d, ease: "power2.inOut" }, t);
  tl.set(S.$("fl"), { opacity: 0 }, t + d);
};
const pose = (t, d = 0.32) => {
  tl.to(S.$("held"), { opacity: 0, duration: 0.1 }, t);
  flight(t, HAND, TBL, d);
  tl.set(S.$("tph"), { opacity: 1 }, t + d);
  tl.fromTo(S.$("tph"), { scale: 1.2, svgOrigin: "230 744" }, { scale: 1, duration: 0.14, ease: "back.out(3)", immediateRender: false }, t + d);
  tl.to(S.$("dk"), { opacity: 0.56, duration: 0.2 }, t + d - 0.1);
  tl.to(S.$("eyes-pup"), { x: -7, duration: 0.15 }, t + d);
};
const toHand = (t, d = 0.3) => {
  tl.set(S.$("tph"), { opacity: 0 }, t);
  flight(t, TBL, HAND, d);
  tl.set(S.$("held"), { opacity: 1 }, t + d - 0.02);
  tl.fromTo(S.$("held"), { y: 14 }, { y: 0, duration: 0.14, ease: "power3.out", immediateRender: false }, t + d - 0.02);
  tl.to(S.$("dk"), { opacity: 0.42, duration: 0.15 }, t + d - 0.05);
  tl.to(S.$("eyes-pup"), { x: 0, duration: 0.12 }, t + d);
};
const tick = (id, t) => tl.fromTo(S.$(id), { opacity: 0, scaleY: 0, transformOrigin: "50% 100%" }, { opacity: 1, scaleY: 1, duration: 0.16, ease: "back.out(2.6)", immediateRender: false }, t);
const box = (k, t) => tl.fromTo(S.$("ty-" + k), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25, ease: "power3.out", immediateRender: false }, t);
const p1t = w("L04", 1) - 0.2, b1t = p1t + 0.48, p2t = w("L04", 4) - 0.2, b2t = w("L05", 2) - 0.15;
pose(p1t); box("P", p1t + 0.32); tick("ty-p0", p1t + 0.4);
toHand(b1t); box("R", b1t + 0.3); tick("ty-r0", b1t + 0.38);
pose(p2t); tick("ty-p1", p2t + 0.4);
toHand(b2t); tick("ty-r1", b2t + 0.38);
L.blink(tl, S, b2t + 0.8);
tl.to(S.$("ty-P"), { opacity: 0, duration: 0.2 }, w("L06", 0) - 0.1);
tl.to(S.$("ty-R"), { opacity: 0, duration: 0.2 }, w("L06", 0) - 0.1);

// --- « Cette négo, tu la perds depuis des mois. » : dézoom, le mur de traits recouvre la chambre
const dz = w("L06", 0) - 0.05;
tl.to(S.cam, { scale: 0.58, duration: w("L06", 7) + 0.25 - dz, ease: "power2.inOut" }, dz);
tl.to(marksEl, { opacity: 0.45, y: 0, duration: 0.2, ease: "power2.out", stagger: { each: 1.5 / marksEl.length } }, w("L06", 2) - 0.2);

// --- « Et c'est pas une question de volonté. » : retour sur la tête, le mot « volonté » barré, énorme
const back = w("L06", 7) + 0.3;
tl.to(S.cam, { scale: 1.25, duration: w("L07", 0) + 0.25 - back, ease: "power3.inOut" }, back);
tl.to(S.$("wall"), { opacity: 0.2, duration: 0.5 }, w("L07", 0) - 0.2);
L.blink(tl, S, w("L07", 3));
L.pill(tl, S, "pVol", w("L07", 5));
tl.set(S.$("sVol"), { opacity: 1 }, w("L07", 6) - 0.04);
tl.fromTo(S.$("sVol"), { strokeDashoffset: 397 }, { strokeDashoffset: 0, duration: 0.22, ease: "power2.out", immediateRender: false }, w("L07", 6) - 0.04);
