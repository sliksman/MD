// PLAN 6 — « ou un grenier. » : l'autre décor, chaud. Poutres en perspective, lames de lumière dorée, poussière ; un groupe de chauves-souris pend à une poutre.
const cluster = [[330, 1.0], [540, 1.25], [750, 0.95], [440, 0.7], [660, 0.72]].map(([x, s], i) => A.bat(`g${i}`, x, 670 + (i > 2 ? 40 : 0), s * 0.9, { ledge: false })).join("");
const world = A.atticBg() + A.dust("du", 6, 60) + `<rect x="-160" y="640" width="1400" height="150" fill="#5a3a22"/><rect x="-160" y="640" width="1400" height="22" fill="#9a6a40" opacity=".7"/>${cluster}<rect x="-160" y="-160" width="1400" height="2240" fill="#04050d" opacity=".1"/>`;
const S = L.stage(root, ID, world, "");
gsap.set(S.cam, { svgOrigin: "540 960" });
const D = sc.end - sc.start;
tl.fromTo(S.$("du"), { y: 0 }, { y: -120, duration: D + 0.6, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.$("slats"), { opacity: 0.6 }, { opacity: 1, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, 0);
[0, 1, 2, 3, 4].forEach((i) => tl.fromTo(S.$(`g${i}-body`), { scale: 1 }, { scale: 1.015, duration: 0.8, yoyo: true, repeat: 2, ease: "sine.inOut", immediateRender: false }, i * 0.1));
tl.fromTo(S.cam, { scale: 1 }, { scale: 1.08, duration: D, ease: "none", immediateRender: false }, 0);
