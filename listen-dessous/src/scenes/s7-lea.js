// PLAN 6 — « Léa. Soulève la couette. Dis-moi que c'est rien. Juste dis-le. » / « Tu réponds pas. Tu bouges plus. Je t'entends respirer… non. » : UN SEUL PLAN, la caméra bouge (plus aucune coupe sur le même sujet).
// Léa de près, immobile. Sa main entre, tremble, s'arrête. La caméra descend sur le drap sous son menton (plat, immobile), puis remonte sur son visage. Une ligne de points plate.
const dots = Array.from({ length: 35 }, (_, i) => `<circle class="dot" cx="${40 + i * 30}" cy="1250" r="5" fill="#fff" opacity=".6"/>`).join("");
const S = L.stage(root, ID, A.lea("lea") + A.hand("hd") + `<g id="${ID}-dots" opacity="0">${dots}</g>`, "");
gsap.set(S.cam, { svgOrigin: "540 960" });
gsap.set(S.$("hd"), { opacity: 0 }); gsap.set(S.$("hd-g"), { y: 520 });
const D = sc.end - sc.start;
const tB = w("L07", 7) - 0.4, tC = w("L08", 0) - 0.03, tD = w("L08", 6) - 0.03;
// la caméra pousse sur le visage (sans coupe), descend sur le drap (« Tu réponds pas »), remonte sur le visage (« Je t'entends respirer »)
tl.fromTo(S.cam, { scale: 1, y: 0 }, { scale: 1.1, y: 30, duration: tB, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.cam, { scale: 1.1, y: 30 }, { scale: 1.36, y: 90, duration: tC - tB, ease: "none", immediateRender: false }, tB);
tl.fromTo(S.cam, { scale: 1.36, y: 90 }, { scale: 1.7, y: -905, duration: 0.7, ease: "power2.inOut", immediateRender: false }, tC);
tl.fromTo(S.cam, { scale: 1.7, y: -905 }, { scale: 1.74, y: -905, duration: tD - tC - 0.7, ease: "none", immediateRender: false }, tC + 0.7);
tl.fromTo(S.cam, { scale: 1.74, y: -905 }, { scale: 1.5, y: -250, duration: 0.7, ease: "power2.inOut", immediateRender: false }, tD);
tl.fromTo(S.cam, { scale: 1.5, y: -250 }, { scale: 1.58, y: -250, duration: D - tD - 0.7, ease: "none", immediateRender: false }, tD + 0.7);
// la main entre par le bas, tremble, s'arrête à mi-chemin ; elle sort du champ quand la caméra descend
const h0 = w("L07", 3) - 0.1;
tl.set(S.$("hd"), { opacity: 1 }, h0);
tl.fromTo(S.$("hd-g"), { y: 520 }, { y: 40, duration: 0.9, ease: "power2.out", immediateRender: false }, h0);
tl.fromTo(S.$("hd-g"), { x: -3 }, { x: 3, duration: 0.06, yoyo: true, repeat: Math.round((tC - h0 - 0.9) / 0.06), ease: "none", immediateRender: false }, h0 + 0.9);
tl.to(S.$("hd"), { opacity: 0, duration: 0.3 }, tC + 0.1);
// sur « respirer… » la ligne de points plate traverse le cadre
const dd = w("L08", 8) + 0.55;
tl.set(S.$("dots"), { opacity: 1 }, dd);
tl.fromTo(S.$("dots").querySelectorAll(".dot"), { opacity: 0, scale: 0 }, { opacity: 0.7, scale: 1, duration: 0.25, ease: "back.out(2)", stagger: { each: 0.5 / 35, from: "center" }, immediateRender: false }, dd);
