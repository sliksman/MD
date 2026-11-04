// PLAN 4 — « Et si tu mourais dans ton sommeil… tu resterais accroché. » : la grotte, elle dort. Une version fantôme, translucide, avec un petit halo, se détache doucement et s'élève (cartoon, rien de macabre) ; le corps reste accroché, les griffes brillent.
const ghost = `<g id="${ID}-gh" opacity="0"><g filter="url(#${ID}-fGlowS)" opacity=".55">${A.bat("gb", 300, 280, 0.95, { ledge: false })}</g><ellipse cx="300" cy="236" rx="90" ry="20" fill="none" stroke="#fff6cf" stroke-width="8" opacity=".9" filter="url(#${ID}-fGlowS)"/></g>`;
const world = A.caveBg(3) + A.crystals("cr", 9, 5, 0, 1080, 800, 1700) + A.mist("ms", 2, 4) + A.caveCeil() + A.stalac("st2", 8, 8, 520, 90, 300, 0, 1080, "#2a3060") + A.bat("bt", 540, 640, 1.5) + ghost + `<rect x="-160" y="-160" width="1400" height="2240" fill="#04050d" opacity=".18"/>`;
const S = L.stage(root, ID, world, "");
gsap.set(S.cam, { svgOrigin: "540 960" });
const D = sc.end - sc.start, g0 = w("L04", 3), g1 = w("L04", 7), cl = w("L04", 9);   // « mourais » ; « tu resterais » ; « accroché »
tl.fromTo(S.$("bt-body"), { scale: 1 }, { scale: 1.012, duration: 1.1, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, 0);
tl.fromTo(S.$("gh"), { opacity: 0, y: 220, x: 220 }, { opacity: 1, y: 0, x: 0, duration: 1.6, ease: "power2.out", immediateRender: false }, g0);
tl.to(S.$("gh"), { y: -140, duration: D - g0 - 1.6, ease: "none" }, g0 + 1.6);
tl.fromTo(S.$("bt-glow"), { opacity: 0 }, { opacity: 1, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, g1 + 0.2);
tl.fromTo(S.cam, { scale: 1, y: 0 }, { scale: 1.06, y: 40, duration: D, ease: "none", immediateRender: false }, 0);
