// PLAN 7 — « Léa. Soulève la couette. Dis-moi que c'est rien. Juste dis-le. » / « Tu réponds pas. Tu bouges plus. Je t'entends respirer… non. » : Léa de près, immobile. Sa main entre, tremble, s'arrête. Le drap sous son menton ne bouge pas. Une ligne de points plate.
const dots = Array.from({ length: 35 }, (_, i) => `<circle class="dot" cx="${40 + i * 30}" cy="1250" r="5" fill="#fff" opacity=".6"/>`).join("");
const S = L.stage(root, ID, A.lea("lea") + A.hand("hd") + `<g id="${ID}-dots" opacity="0">${dots}</g>`, "");
gsap.set(S.cam, { svgOrigin: "540 960" });
gsap.set(S.$("hd"), { opacity: 0 }); gsap.set(S.$("hd-g"), { y: 520 });
const D = sc.end - sc.start;
const tB = w("L07", 7) - 0.4, tC = w("L08", 0) - 0.03, tD = w("L08", 6) - 0.03;   // B : « rien » (cadrage serré) ; C : insert sur le drap ; D : retour sur le visage
// A : Léa, de près (elle ne respire plus : le drap est immobile). La main entre par le bas et s'arrête à mi-chemin.
tl.fromTo(S.$("lea-g"), { scale: 1 }, { scale: 1.08, duration: tB, ease: "none", immediateRender: false }, 0);
const h0 = w("L07", 3) - 0.1;
tl.set(S.$("hd"), { opacity: 1 }, h0);
tl.fromTo(S.$("hd-g"), { y: 520 }, { y: 40, duration: 0.9, ease: "power2.out", immediateRender: false }, h0);
tl.fromTo(S.$("hd-g"), { x: -3 }, { x: 3, duration: 0.06, yoyo: true, repeat: Math.round((tC - h0 - 0.9) / 0.06), ease: "none", immediateRender: false }, h0 + 0.9);
// B : cadrage plus serré, poussée lente
tl.set(S.cam, { scale: 1.3, y: 80 }, tB);
tl.fromTo(S.cam, { scale: 1.3 }, { scale: 1.42, duration: tC - tB, ease: "none", immediateRender: false }, tB + 0.01);
// C : insert, le drap sous son menton : plat, immobile
tl.set(S.cam, { scale: 1.7, y: -905, x: 0 }, tC);
tl.set(S.$("hd"), { opacity: 0 }, tC);
tl.fromTo(S.cam, { scale: 1.7 }, { scale: 1.76, duration: tD - tC, ease: "none", immediateRender: false }, tC + 0.01);
// D : retour sur le visage, serré ; sur « respirer… » la ligne de points plate traverse le cadre
tl.set(S.cam, { scale: 1.5, y: -250 }, tD);
tl.fromTo(S.cam, { scale: 1.5 }, { scale: 1.58, duration: D - tD, ease: "none", immediateRender: false }, tD + 0.01);
const dd = w("L08", 8) + 0.55;
tl.set(S.$("dots"), { opacity: 1 }, dd);
tl.fromTo(S.$("dots").querySelectorAll(".dot"), { opacity: 0, scale: 0 }, { opacity: 0.7, scale: 1, duration: 0.25, ease: "back.out(2)", stagger: { each: 0.5 / 35, from: "center" }, immediateRender: false }, dd);
