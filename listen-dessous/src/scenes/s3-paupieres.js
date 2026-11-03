// PLAN 3 — « Je regarde pas. Je te jure que je regarde pas. » : il ferme les yeux (écran rouge-noir), contrechamp sur ses yeux serrés, puis une fente d'un quart de seconde : il regarde ses pieds.
const S = L.stage(root, ID, A.along("al") + A.eyesBig("eb"), A.povLids("pl"));
gsap.set(S.cam, { svgOrigin: "540 960" });
gsap.set(S.$("eb"), { opacity: 0 });
const U = (u) => 640 + 1340 * u, K = (u) => (210 + 590 * u) / 400;
gsap.set(S.$("al-swell"), { y: U(0.1), scale: K(0.1), opacity: 1 });
gsap.set(S.$("al-warm"), { y: U(0.1) - 1000 });
gsap.set(S.$("al-fg"), { opacity: 0.85 });
gsap.set(S.$("pl-lt"), { y: -1300 }); gsap.set(S.$("pl-lb"), { y: 1300 });   // ouvertes ; fermées : lt = +130, lb = -130 ; fente de 70 px : lt = +50, lb = -40
[S.$("eb-lidA"), S.$("eb-lidB")].forEach((e) => gsap.set(e, { scaleY: 1 }));   // ses yeux sont serrés
gsap.set(S.$("eb-shut"), { opacity: 1 });
const close = w("L03", 0) - 0.03, eIn = w("L03", 3) - 0.06, eOut = w("L03", 8) - 0.1, slit = w("L03", 9) - 0.04;
tl.fromTo(S.$("pl-lt"), { y: -1300 }, { y: 130, duration: 0.3, ease: "power3.in", immediateRender: false }, close);
tl.fromTo(S.$("pl-lb"), { y: 1300 }, { y: -130, duration: 0.3, ease: "power3.in", immediateRender: false }, close);
// contrechamp : ses yeux serrés, ça tremble
tl.set([S.$("pl-lt"), S.$("pl-lb")], { opacity: 0 }, eIn);
tl.set(S.$("eb"), { opacity: 1 }, eIn);
tl.fromTo(S.$("eb"), { x: -3 }, { x: 3, duration: 0.06, yoyo: true, repeat: Math.round((eOut - eIn) / 0.06), ease: "none", immediateRender: false }, eIn);
tl.set(S.$("eb"), { opacity: 0, x: 0 }, eOut);
tl.set([S.$("pl-lt"), S.$("pl-lb")], { opacity: 1 }, eOut);
// la fente : le regard glisse vers ses pieds, on aperçoit la chaleur au fond, puis tout se referme
tl.fromTo(S.cam, { y: 0 }, { y: 250, duration: 0.1, ease: "power2.out", immediateRender: false }, slit);
tl.fromTo(S.$("pl-lt"), { y: 130 }, { y: 50, duration: 0.1, ease: "power2.out", immediateRender: false }, slit);
tl.fromTo(S.$("pl-lb"), { y: -130 }, { y: -40, duration: 0.1, ease: "power2.out", immediateRender: false }, slit);
tl.to(S.$("pl-lt"), { y: 130, duration: 0.12, ease: "power2.in" }, slit + 0.3);
tl.to(S.$("pl-lb"), { y: -130, duration: 0.12, ease: "power2.in" }, slit + 0.3);
tl.to(S.cam, { y: 0, duration: 0.15 }, slit + 0.3);
