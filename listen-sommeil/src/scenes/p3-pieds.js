// PLAN 3 — ASTUCE 1. Au pied du lit : pieds nus, « t'as chaud », les chaussettes glissent dessus.
// Puis la caméra plonge dans la chaussette et ressort dans la vue en coupe (jambe de profil) :
// la chaussette chauffe, les vaisseaux s'écartent, la chaleur s'échappe, la jauge baisse.
const footA = `<g id="${A.id("A")}"><g id="${A.id("camA")}">` + A.bg() + A.floorIso(1250) +
  `<g id="${A.id("me")}"><circle cx="520" cy="640" r="70" fill="${A.u("gSkin")}"/>${A.eyes("eyes", 497, 543, 632, 10)}
   <path id="${A.id("sweat")}" d="M590 590 q12 22 0 30 q-12 -8 0 -30z" fill="#9cc8ff" opacity="0"/></g>
   <path d="M120 1100 Q160 700 520 690 Q880 700 920 1100 Z" fill="${A.u("gDuvet")}"/>
   <path d="M150 960 Q520 860 890 960" stroke="#5868b0" stroke-width="6" fill="none" opacity=".6"/>
   <g id="${A.id("feet")}">${A.sole("bareL", 380, 930, 1, 1.35, false)}${A.sole("bareR", 660, 930, -1, 1.35, false)}</g>
   <g id="${A.id("sockL")}">${A.sole("sL", 380, 930, 1, 1.35, true)}</g><g id="${A.id("sockR")}">${A.sole("sR", 660, 930, -1, 1.35, true)}</g>
   <path d="M80 1080 h880 v40 h-880z" fill="#cfc8bb"/>
   <rect x="60" y="1110" width="920" height="170" rx="18" fill="${A.u("gWood")}"/><rect x="60" y="1110" width="920" height="16" fill="#6a5a80"/>` +
  A.pill("pSocks", 220, 560, "chaussettes", 340, 820, { dot: L.C.amber }) +
  A.pill("pHot", 800, 520, "t'as chaud", 585, 600) + `</g></g>`;
const vessels = [
  [[-60, 895], [540, 900], [610, 830], [650, 720]],
  [[-60, 930], [560, 935], [650, 860], [690, 730]],
  [[-60, 965], [580, 968], [690, 930], [715, 780]],
].map((pts, i) => A.dots("v" + i, pts, { color: L.C.amber, r: 7 })).join("");
const arcs = [130, 220, 310].map((r, i) => A.dots("a" + i, A.arc(700, 800, r, -80 + i * 10, 60 - i * 10), { color: L.C.amber, r: 7 })).join("");
const cutB = `<g id="${A.id("B")}" opacity="0"><g id="${A.id("camB")}">` + A.bg() + A.cutStrata() + A.legSide("leg") + A.sockSide("sock") + vessels + arcs +
  A.pill("pBody", 260, 560, "corps : à refroidir", 220, 925) +
  A.pill("pFeet", 840, 520, "pieds : chauds", 690, 720, { dot: L.C.amber }) +
  A.pill("pVes", 250, 1100, "petits vaisseaux", 250, 965, { dot: L.C.amber }) + `</g></g>`;
const hud = A.bigNum("n1", "1", "Mets des chaussettes.") +
  `<g id="${A.id("gauge")}" opacity="0"><rect x="80" y="160" width="330" height="200" rx="30" fill="#14162a" fill-opacity=".84" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
  <text x="110" y="215" font-family="Nunito" font-weight="800" font-size="28" fill="${L.C.cream}" fill-opacity=".8">temp. interne</text>
  <text id="${A.id("temp")}" x="110" y="300" font-family="Fraunces" font-style="italic" font-weight="700" font-size="76" fill="${L.C.cream}">37,2°</text>
  <text id="${A.id("arrow")}" x="345" y="300" font-family="Nunito" font-weight="900" font-size="56" fill="${L.C.amber}">↓</text></g>`;
const S = L.stage(root, ID, footA + cutB, hud);
const camA = S.$("camA"), camB = S.$("camB");

// ---- A : au pied du lit
tl.fromTo(camA, { scale: 1.08, svgOrigin: "540 960" }, { scale: 1, duration: 1.4, ease: "power2.out" }, 0);
const un = w("L07", 0);
tl.fromTo(S.$("n1-seed"), { scale: 1, opacity: 1, transformOrigin: "50% 50%" }, { scale: 4, opacity: 0, duration: 0.5, ease: "power2.out" }, un);
L.pop(tl, S.$("n1-n"), un, { from: 0.4 });
tl.fromTo(S.$("n1-over"), { opacity: 0, x: -20 }, { opacity: 0.85, x: 0, duration: 0.5 }, un + 0.25);
tl.fromTo(S.$("n1-lab"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 }, w("L09", 0));
// « T'as chaud » : goutte de sueur
L.pill(tl, S, "pHot", w("L08", 0));
tl.fromTo(S.$("sweat"), { opacity: 0, y: -6 }, { opacity: 1, y: 10, duration: 0.8, ease: "power1.in" }, w("L08", 1));
// les orteils gigotent
tl.fromTo([S.$("bareL"), S.$("bareR")], { rotation: 0, svgOrigin: "520 1040" }, { rotation: 2.5, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, un + 0.3);
// « chaussettes » : elles glissent sur les pieds
const so = w("L09", 3) - 0.3;
gsap.set([S.$("sockL"), S.$("sockR")], { opacity: 0 });
tl.fromTo(S.$("sockL"), { opacity: 0, y: -240 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, so);
tl.fromTo(S.$("sockR"), { opacity: 0, y: -240 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, so + 0.15);
tl.set(S.$("feet"), { opacity: 0 }, so + 0.7);
L.pill(tl, S, "pSocks", so + 0.4);
// ---- plongée dans la chaussette droite → vue en coupe
const dive = 16.2 - sc.hostStart;
tl.to([S.$("n1"), S.$("pSocks"), S.$("pHot")], { opacity: 0, duration: 0.35 }, dive - 0.1);
tl.to(camA, { scale: 5, x: (540 - 660) * 5, y: (960 - 930) * 5, svgOrigin: "540 960", duration: 0.75, ease: "power2.in" }, dive);
tl.to(S.$("A"), { opacity: 0, duration: 0.3 }, dive + 0.5);
tl.fromTo(S.$("B"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, dive + 0.45);
tl.fromTo(camB, { scale: 3.2, x: (540 - 690) * 3.2, y: (960 - 830) * 3.2, svgOrigin: "540 960" }, { scale: 1, x: 0, y: 0, duration: 1.0, ease: "power3.out" }, dive + 0.45);

// ---- B : la coupe
const re = w("L10", 6);
tl.fromTo(S.$("sock-glow"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, re - 0.1);
tl.to(S.$("sock-glow"), { opacity: 0.6, duration: 0.9, yoyo: true, repeat: 5, ease: "sine.inOut" }, re + 0.8);
L.pill(tl, S, "pFeet", w("L10", 8) - 0.1);
L.pill(tl, S, "pBody", w("L10", 12) - 0.1);
tl.fromTo(S.$("leg-cool"), { opacity: 0 }, { opacity: 1, duration: 1.0 }, w("L10", 14) - 0.1);
// les vaisseaux
const v0 = w("L11", 0);
L.pillOut(tl, S, "pBody", v0 - 0.2);
L.pillOut(tl, S, "pFeet", v0 - 0.2);
tl.to(S.$("leg-cool"), { opacity: 0.3, duration: 1.0 }, v0);
["v0", "v1", "v2"].forEach((v, i) => L.drawDots(tl, S.$(v), v0 - 0.1 + i * 0.15, 1.0));
const dil = w("L11", 2);
tl.to(S.$("v0"), { y: -16, duration: 0.8, ease: "power2.out" }, dil);
tl.to(S.$("v2"), { y: 16, duration: 0.8, ease: "power2.out" }, dil);
tl.to([S.$("v0"), S.$("v1"), S.$("v2")].flatMap((g) => Array.from(g.querySelectorAll(".dot"))), { attr: { r: 10 }, duration: 0.8, ease: "power2.out" }, dil);
L.pill(tl, S, "pVes", w("L11", 4) - 0.1);
// l'évacuation : arcs de chaleur, en vagues lentes
const ev = w("L11", 8);
["a0", "a1", "a2"].forEach((a, i) => L.drawDots(tl, S.$(a), ev - 0.1 + i * 0.25, 0.6, { from: "center" }));
["a0", "a1", "a2"].forEach((a, i) => {
  const per = 1.8, reps = Math.max(0, Math.floor((sc.hostDur - ev - 1.6) / per) - 1);
  tl.fromTo(S.$(a), { scale: 0.94, opacity: 1, svgOrigin: "700 800" }, { scale: 1.1, opacity: 0.35, duration: per, ease: "sine.inOut", yoyo: true, repeat: reps }, ev + 1.0 + i * 0.3);
});
// « baisse de température » : la jauge
const ba = w("L12", 0);
L.pillOut(tl, S, "pVes", ba - 0.3);
L.pop(tl, S.$("gauge"), ba - 0.2, { from: 0.8 });
L.setText(tl, S.$("temp"), w("L12", 1), ["37,2°", "37,1°", "37,0°", "36,9°", "36,8°"], 2.0);
tl.fromTo(S.$("arrow"), { y: -8 }, { y: 8, duration: 0.5, yoyo: true, repeat: 5, ease: "sine.inOut" }, w("L12", 1));
