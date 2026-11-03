// PLAN 5 — « Ça remonte. Doucement. Là, c'est la cheville. Je sens plus mes orteils. » : retour au plafond. Le relief du drap entre par le bas, cran par cran. « orteils » s'éteint lettre par lettre.
const hud = `<g id="${ID}-ot" opacity="0"><text x="540" y="450" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="76" fill="#fff" filter="url(#${ID}-fShadow)">Je sens plus mes</text>
  <text id="${ID}-ot2" x="540" y="548" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="104" filter="url(#${ID}-fShadow)">${"orteils.".split("").map((c, i) => `<tspan id="${ID}-ol${i}" fill="#F5B85A">${c}</tspan>`).join("")}</text></g>`;
const S = L.stage(root, ID, A.pov("pv"), hud);
gsap.set(S.cam, { svgOrigin: "540 960" });
gsap.set(S.$("pv-glw"), { opacity: 0.75 });
gsap.set(S.$("ot2"), { opacity: 0 });
const lv = (b) => 280 - b, D = sc.end - sc.start;
gsap.set(S.$("pv-hump"), { y: lv(90) });
const cut2 = w("L05", 3) - 0.08;                    // « Là » : changement de cadrage (la tête bouge)
L.sway(tl, S, 0, D, 3.2, 12);
tl.fromTo(S.cam, { scale: 1 }, { scale: 1.05, duration: cut2, ease: "none", immediateRender: false }, 0);
tl.set(S.cam, { scale: 1.12, rotation: -2.2, x: -24, y: 18 }, cut2);
tl.fromTo(S.cam, { scale: 1.12 }, { scale: 1.17, duration: D - cut2, ease: "none", immediateRender: false }, cut2 + 0.01);
// le relief monte : doucement, puis un cran net sur « Là », un autre sur « cheville »
tl.fromTo(S.$("pv-hump"), { y: lv(90) }, { y: lv(170), duration: w("L05", 3) - w("L05", 1) - 0.1, ease: "power1.inOut", immediateRender: false }, w("L05", 1));
tl.fromTo(S.$("pv-hump"), { y: lv(170) }, { y: lv(230), duration: 0.22, ease: "power3.out", immediateRender: false }, w("L05", 3));
tl.fromTo(S.$("pv-hump"), { y: lv(230) }, { y: lv(270), duration: 0.22, ease: "power3.out", immediateRender: false }, w("L05", 6));
tl.fromTo(S.$("pv-hump"), { y: lv(270) }, { y: lv(300), duration: D - w("L05", 6) - 0.3, ease: "power1.inOut", immediateRender: false }, w("L05", 6) + 0.3);
tl.to(S.$("pv-glw"), { opacity: 0.9, duration: 1.2 }, w("L05", 3));
// sous-titre « orteils » : il s'éteint lettre par lettre
const o0 = w("L05", 7) - 0.02, o1 = w("L05", 11);
tl.set(S.$("ot"), { opacity: 1 }, o0);
tl.fromTo(S.$("ot"), { scale: 0.8 }, { scale: 1, duration: 0.2, ease: "back.out(3)", immediateRender: false }, o0);
tl.set(S.$("ot2"), { opacity: 1 }, o1 - 0.02);
tl.set(S.$("ot"), { opacity: 0 }, D - 0.02);
"orteils.".split("").forEach((_, i) => tl.to(S.$("ol" + i), { attr: { "fill-opacity": 0.07 }, duration: 0.14 }, o1 + 0.28 + i * 0.13));
