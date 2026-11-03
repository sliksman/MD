// PLAN 4 — « C'est doux et humide. Ça tient comme une main, mais trop grande. » : le drap de très près. La tache s'étend ; puis l'empreinte, plus grande que le cadre.
const S = L.stage(root, ID, A.fabric("fb"), "");
gsap.set(S.cam, { svgOrigin: "540 960" });
gsap.set(S.$("fb-glw"), { opacity: 0.85 });
const D = sc.end - sc.start, h = w("L04", 3), p0 = w("L04", 4) - 0.05, trop = w("L04", 10);
tl.fromTo(S.cam, { scale: 1 }, { scale: 1.12, duration: D, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.$("fb-glw").querySelector("ellipse"), { opacity: 1 }, { opacity: 0.55, duration: 0.45, yoyo: true, repeat: 10, ease: "sine.inOut", immediateRender: false }, 0);
// la tache sombre et brillante s'étend dans le tissu
tl.fromTo(S.$("fb-stain"), { opacity: 0, scale: 0.15 }, { opacity: 1, scale: 0.8, duration: h - 0.1 - 0.1, ease: "power1.out", immediateRender: false }, 0.1);
tl.to(S.$("fb-stain"), { scale: 1.15, duration: p0 - h, ease: "power1.in" }, h);
tl.set(S.$("fb-stain"), { opacity: 0 }, p0);
// l'empreinte : on n'en voit jamais le bord ; sur « trop », elle serre d'un coup
tl.fromTo(S.$("fb-press"), { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 0.9, duration: trop - p0, ease: "power2.out", immediateRender: false }, p0);
tl.fromTo(S.$("fb-press"), { scale: 0.9 }, { scale: 1.12, duration: 0.14, ease: "power3.out", immediateRender: false }, trop);
tl.fromTo(S.cam, { x: 0 }, { x: 10, duration: 0.05, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, trop);
