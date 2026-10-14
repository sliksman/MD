// 06 — VAISSEAUX. Les vaisseaux (points) suivent la jambe, s'écartent sur « dilate », la chaleur s'échappe en arcs.
const vessels = [
  [[-60, 895], [540, 900], [610, 830], [650, 720]],
  [[-60, 930], [560, 935], [650, 860], [690, 730]],
  [[-60, 965], [580, 968], [690, 930], [715, 780]],
].map((pts, i) => A.dots("v" + i, pts, { color: L.C.amber, r: 7 })).join("");
const arcs = [130, 220, 310].map((r, i) => A.dots("a" + i, A.arc(700, 800, r, -80 + i * 10, 60 - i * 10), { color: L.C.amber, r: 7 })).join("");
const world = A.bg() + A.cutStrata() + A.legSide("leg") + A.sockSide("sock") + vessels + arcs + A.duvetTop("dtop") +
  A.pill("pVes", 250, 1100, "petits vaisseaux", 250, 965, { dot: L.C.amber });
const hud = `<g id="${A.id("gauge")}"><rect x="80" y="160" width="330" height="200" rx="30" fill="#14162a" fill-opacity=".84" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
  <text x="110" y="215" font-family="Nunito" font-weight="800" font-size="28" fill="${L.C.cream}" fill-opacity=".8">temp. interne</text>
  <text id="${A.id("temp")}" x="110" y="300" font-family="Fraunces" font-style="italic" font-weight="700" font-size="76" fill="${L.C.cream}">37,2°</text>
  <text id="${A.id("arrow")}" x="345" y="300" font-family="Nunito" font-weight="900" font-size="56" fill="${L.C.amber}">↓</text></g>`;
const S = L.stage(root, ID, world, hud);
L.fadeIn(tl, S, sc);
// état d'arrivée = fin de 05
gsap.set(S.$("dtop"), { scaleY: 0, svgOrigin: "540 420" });
gsap.set(S.$("sock-glow"), { opacity: 0.8 });
gsap.set(S.$("leg-cool"), { opacity: 1 });
tl.to(S.$("leg-cool"), { opacity: 0.25, duration: 0.8 }, 0.2);
L.cam(tl, S, { scale: 1 }, { scale: 1.06 }, 0, sc.hostDur - 0.6, "none");
// vaisseaux : tracé, puis écart sur « dilate »
["v0", "v1", "v2"].forEach((v, i) => L.drawDots(tl, S.$(v), w("L11", 0) - 0.1 + i * 0.1, 0.7));
const dil = w("L11", 2);
tl.to(S.$("v0"), { y: -16, duration: 0.5, ease: "back.out(2)" }, dil);
tl.to(S.$("v2"), { y: 16, duration: 0.5, ease: "back.out(2)" }, dil);
tl.to([S.$("v0"), S.$("v1"), S.$("v2")].flatMap((g) => Array.from(g.querySelectorAll(".dot"))), { scale: 1.4, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2)" }, dil);
L.pill(tl, S, "pVes", w("L11", 4));
// « l'évacuation » : arcs de chaleur qui partent du pied, en vagues
const ev = w("L11", 8);
["a0", "a1", "a2"].forEach((a, i) => L.drawDots(tl, S.$(a), ev + i * 0.15, 0.35, { from: "center" }));
const endWaves = sc.hostDur - 1.2;
["a0", "a1", "a2"].forEach((a, i) => {
  const per = 1.2, reps = Math.max(0, Math.floor((endWaves - ev - 0.8) / per) - 1);
  tl.fromTo(S.$(a), { scale: 0.92, opacity: 1, svgOrigin: "700 800" }, { scale: 1.12, opacity: 0.25, duration: per, ease: "sine.out", repeat: reps }, ev + 0.6 + i * 0.25);
});
// « baisse de température » : jauge 37,2 → 36,8
const ba = w("L12", 0);
L.pop(tl, S.$("gauge"), ba - 0.2, { from: 0.7 });
L.setText(tl, S.$("temp"), w("L12", 1), ["37,2°", "37,1°", "37,0°", "36,9°", "36,8°"], 1.6);
tl.fromTo(S.$("arrow"), { y: -8 }, { y: 8, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut" }, w("L12", 1));
// sortie : la coupe se referme, la caméra monte vers la tête
tl.to(S.$("dtop"), { scaleY: 1, duration: 0.5, ease: "power3.inOut" }, sc.hostDur - 1.0);
tl.to(S.cam, { y: 700, svgOrigin: "540 960", duration: 0.5, ease: "power2.in" }, sc.hostDur - 0.5);
tl.to(S.$("gauge"), { opacity: 0, duration: 0.3 }, sc.hostDur - 0.5);
