// 09 — SANS LIEN. Les trois objets ensemble ; un chemin de points essaie de les relier puis s'effrite.
const strike = (x1, x2, y, n) => `<line id="${A.id(n)}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${L.C.amber}" stroke-width="7" stroke-linecap="round"/>`;
const world = A.bg() + A.headBottom() + A.bubble(500, 800, 420, 360) +
  A.apple("apple", 300, 680, 0.66) + A.umbrella("umb", 730, 650, 0.6) + A.chair("chair", 500, 930, 0.6) +
  A.dots("link", [[360, 700], [470, 760], [560, 770], [660, 700]], { step: 28, r: 7 }) +
  A.dots("link2", [[700, 760], [560, 880]], { step: 28, r: 7 }) +
  A.pill("pHist", 280, 1210, "histoire") + strike(190, 370, 1210, "sHist") +
  A.pill("pList", 720, 1210, "liste") + strike(655, 785, 1210, "sList");
const hud = A.title("title", "PAS D'HISTOIRE, PAS DE LISTE", ["*Sans lien.*"], 300);
const S = L.stage(root, ID, world, hud);
L.fadeIn(tl, S, sc);
L.cam(tl, S, { scale: 1 }, { scale: 1.04 }, 0, sc.hostDur, "none");
gsap.set(S.$("eyes-pup"), { y: -5 });
// les objets réapparaissent
[["apple", 0], ["umb", 1], ["chair", 2]].forEach(([id, k]) => L.pop(tl, S.$(id), w("L23", k) - 0.1, { from: 0.2 }));
// « sans lien » : le lien se trace puis s'effrite
const sl = w("L24", 0);
L.drawDots(tl, S.$("link"), sl - 0.1, 0.4);
L.drawDots(tl, S.$("link2"), sl, 0.3);
tl.fromTo(S.$("title-over"), { opacity: 0 }, { opacity: 0.85, duration: 0.3 }, sl);
tl.fromTo(S.$("title-l0"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, w("L24", 1));
const br = w("L24", 3);
tl.to([...S.$("link").querySelectorAll(".dot"), ...S.$("link2").querySelectorAll(".dot")], { y: 70, opacity: 0, duration: 0.45, ease: "power2.in", stagger: { each: 0.03, from: "random" } }, br - 0.2);
// « pas d'histoire » / « pas de liste » : barrés
L.pill(tl, S, "pHist", w("L25", 1));
tl.fromTo(S.$("sHist"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.25, ease: "power2.out" }, w("L25", 3));
L.pill(tl, S, "pList", w("L26", 2));
tl.fromTo(S.$("sList"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.25, ease: "power2.out" }, w("L26", 4));
// les pupilles cherchent un lien
tl.to(S.$("eyes-pup"), { x: -5, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut" }, sl);
