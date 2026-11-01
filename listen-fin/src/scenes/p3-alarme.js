// PLAN 3 — ELLE SONNE / TU LE POSES / LE SILENCE. Coupes sèches rythmées sur les phrases (gros plan du réveil ↔ plan large du lit), puis le seul
// temps calme du film : tête en gros plan, la chambre presque noire, une ligne de points plate, tous les bruitages coupés.
const AM = L.C.amber, O = "540 800";
const bedG = A.bedTop({ clock: ["00:45"] });
const world = A.void() + A.bg() + bedG +
  `<rect id="${A.id("dk")}" x="-1200" y="-1200" width="3480" height="4320" fill="#04050d" opacity=".42"/>` +
  A.heldPhone("held") + A.downPhone("dph") + A.flyer("fl");
const gA = `<g id="${A.id("gA")}"><rect width="1080" height="1920" fill="#10132c"/>${A.alarmPhone("aph")}</g>`;
const gD = `<g id="${A.id("gD")}" opacity="0"><rect x="-100" y="-100" width="1280" height="2120" fill="#070914"/>
  <rect x="190" y="700" width="700" height="440" rx="150" fill="url(#${A.id("gPillow")})" opacity=".85"/>
  <circle cx="540" cy="930" r="230" fill="url(#${A.id("gSkin")})"/>${A.eyes("eyesD", 463, 617, 905, 36)}
  <rect x="-100" y="1180" width="1280" height="900" fill="url(#${A.id("gDuvet")})"/><rect x="-100" y="1180" width="1280" height="40" fill="${L.C.duvetEdge}"/>
  <rect width="1080" height="1920" fill="#04050d" opacity=".5"/>${A.dots("flat", [[30, 600], [1050, 600]], { step: 30, r: 5, opacity: 0.55 })}
  <rect width="1080" height="1920" filter="url(#${A.id("fGrain")})" opacity=".16" style="pointer-events:none"/></g>`;
const S = L.stage(root, ID, world, gA + gD + A.tally("ty", 1420));
gsap.set(S.$("dph"), { opacity: 0 });
gsap.set(S.$("fl"), { x: 560, y: 905 });
gsap.set(S.$("held"), { opacity: 0 });
gsap.set(S.$("phone"), { opacity: 0 });
gsap.set(S.cam, { scale: 1.2, svgOrigin: O });
gsap.set(S.$("ty-P"), { opacity: 0 }); gsap.set(S.$("ty-R"), { opacity: 0 });
["ty-p0", "ty-p1", "ty-r0", "ty-r1"].forEach((n) => gsap.set(S.$(n), { opacity: 1 }));

const cut = (el, on, t) => tl.set(S.$(el), { opacity: on ? 1 : 0 }, t);
const ring = (t0, t1, amp) => {   // le téléphone vibre et ses ondes pulsent
  const n = Math.max(2, Math.round((t1 - t0) / 0.05));
  tl.fromTo(S.$("aph-body"), { x: -amp, rotation: -amp * 0.5, svgOrigin: "540 1050" }, { x: amp, rotation: amp * 0.5, duration: 0.05, yoyo: true, repeat: n, ease: "none", immediateRender: false }, t0);
  tl.fromTo(S.$("aph-waves"), { opacity: 1 }, { opacity: 0.35, duration: 0.11, yoyo: true, repeat: Math.round((t1 - t0) / 0.11), ease: "none", immediateRender: false }, t0);
  tl.set(S.$("aph-body"), { x: 0, rotation: 0 }, t1);
};
const wide = (held, t) => {       // état du plan large : le téléphone est dans la main ou non
  tl.set(S.$("held"), { opacity: held ? 1 : 0 }, t);
  tl.fromTo(S.$("held"), { y: 30 }, { y: 0, duration: 0.14, ease: "back.out(2.2)", immediateRender: false }, t);
};

// « Elle sonne. » — gros plan, dès la coupe (le réveil sonne avant le premier mot)
const a1 = w("L10", 2) - 0.04, a2 = w("L10", 4) - 0.04, a3 = w("L10", 6) - 0.04;
ring(0.06, a1, 6);
// « Tu l'éteins. » — plan large, le pouce balaie, l'écran s'éteint
cut("gA", false, a1);
wide(true, a1);
[0, 1, 2].forEach((i) => tl.fromTo(S.$("held-sw" + i), { opacity: 0.8, y: 40 }, { opacity: 0, y: -80, duration: 0.3, ease: "power2.out", immediateRender: false }, w("L10", 3) - 0.05 + i * 0.04));
tl.to(S.$("held-halo"), { opacity: 0.2, duration: 0.25 }, w("L10", 3) + 0.1);
tl.to(S.$("dk"), { opacity: 0.52, duration: 0.25 }, w("L10", 3) + 0.1);
// « Elle sonne. » — gros plan, plus fort : la deuxième fois, le réveil enfle
cut("gA", true, a2);
tl.fromTo(S.$("gA"), { scale: 1, svgOrigin: "540 960" }, { scale: 1.1, duration: a3 - a2, ease: "none", immediateRender: false }, a2);
ring(a2, a3, 10);
// « Tu poses. » — plan large : le téléphone vole vers la table et atterrit face contre table
cut("gA", false, a3);
tl.set(S.$("gA"), { scale: 1 }, a3);
tl.set(S.$("held-halo"), { opacity: 0.95 }, a3);
tl.set(S.$("dk"), { opacity: 0.42 }, a3);
wide(true, a3);
const box = (k, t) => tl.fromTo(S.$("ty-" + k), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25, ease: "power3.out", immediateRender: false }, t);
box("P", a3); box("R", a3);
const pz = w("L10", 7);
// le téléphone quitte la main, décrit un arc et atterrit face contre table
const HAND = { x: 560, y: 905, s: 1, r: -8 }, TBL = { x: 230, y: 744, s: 0.49, r: 0 }, fd = 0.36, ft = pz - 0.1;
tl.to(S.$("held"), { opacity: 0, duration: 0.1 }, ft);
tl.set(S.$("fl"), { opacity: 1, x: HAND.x, y: HAND.y }, ft);
tl.set(S.$("fl-in"), { scale: HAND.s, rotation: HAND.r }, ft);
tl.to(S.$("fl"), { x: TBL.x, duration: fd, ease: "power2.inOut" }, ft);
tl.to(S.$("fl"), { y: Math.min(HAND.y, TBL.y) - 55, duration: fd * 0.45, ease: "power2.out" }, ft);
tl.to(S.$("fl"), { y: TBL.y, duration: fd * 0.55, ease: "power2.in" }, ft + fd * 0.45);
tl.to(S.$("fl-in"), { scale: TBL.s, rotation: TBL.r, duration: fd, ease: "power2.inOut" }, ft);
tl.set(S.$("fl"), { opacity: 0 }, ft + fd);
tl.set(S.$("dph"), { opacity: 1 }, ft + fd);
tl.fromTo(S.$("dph"), { scale: 1.2, svgOrigin: "230 744" }, { scale: 1, duration: 0.14, ease: "back.out(3)", immediateRender: false }, ft + fd);
tl.to(S.$("dk"), { opacity: 0.6, duration: 0.2 }, ft + fd);
tl.fromTo(S.$("ty-p2"), Object.assign({ opacity: 0, scaleY: 0 }, L.og(S.$("ty-p2"), "50% 100%")), { opacity: 1, scaleY: 1, duration: 0.2, ease: "back.out(3)", immediateRender: false }, ft + fd);
tl.fromTo(S.$("ty-P"), Object.assign({ scale: 1 }, L.og(S.$("ty-P"), "50% 50%")), { scale: 1.12, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, ft + fd);

// « Et là, ta chambre fait un silence pas possible. » — le plan large pousse lentement vers la tête, puis tout se vide
tl.to(S.cam, { scale: 1.45, duration: w("L11", 5) - pz, ease: "power1.in" }, pz + 0.5);
tl.to(S.$("eyes-pup"), { x: 0, duration: 0.2 }, w("L11", 2));
tl.to([S.$("ty-P"), S.$("ty-R")], { opacity: 0, duration: 0.25 }, w("L11", 4));
const sil = w("L11", 6);
cut("gD", true, sil);
L.drawDots(tl, S.$("flat"), sil, 0.9, { from: "center", ir: true });
L.blink(tl, S, sil + 1.0, "eyesD");
