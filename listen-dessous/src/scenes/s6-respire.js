// PLAN 6 — « À chaque fois que je respire, ça remonte d'un cran. Alors j'essaie de ne plus respirer. Je peux pas. » : son torse, au premier plan, se soulève à chaque inspiration et la chaleur avance d'un cran (cliquet). Il retient son souffle : tout se fige. Contrechamp : ses yeux. Il aspire de force.
const hud = `<g id="${ID}-vg2" opacity="0"><rect width="1080" height="1920" fill="url(#${ID}-gVig)"/><rect width="1080" height="1920" fill="url(#${ID}-gVig)"/><rect width="1080" height="1920" fill="url(#${ID}-gVig)"/></g>`;
const S = L.stage(root, ID, A.along("al") + A.eyesBig("eb", { r: 112, ex: 180, pup: 0.1 }), hud);
gsap.set(S.cam, { svgOrigin: "540 960", scale: 1.1, rotation: -2.2, x: -24, y: 14 });
gsap.set(S.$("eb"), { opacity: 0 });
[S.$("eb-lidA"), S.$("eb-lidB")].forEach((e) => gsap.set(e, { scaleY: 0 }));
const U = (u) => 640 + 1340 * u, K = (u) => (210 + 590 * u) / 400, D = sc.end - sc.start;
let cu = 0.43;
gsap.set(S.$("al-swell"), { y: U(cu), scale: K(cu), opacity: 1 });
gsap.set(S.$("al-warm"), { y: U(cu) - 1000 });
gsap.set(S.$("al-fg"), { opacity: 0.85 });
const mv = (t, u, d, ease = "power3.out") => {
  tl.fromTo(S.$("al-swell"), { y: U(cu), scale: K(cu) }, { y: U(u), scale: K(u), duration: d, ease, immediateRender: false }, t);
  tl.fromTo(S.$("al-warm"), { y: U(cu) - 1000 }, { y: U(u) - 1000, duration: d, ease, immediateRender: false }, t);
  cu = u;
};
const inh = [w("L06", 5), w("L06", 7) - 0.05, w("L06", 9)];   // « respire », « remonte », « cran » : trois inspirations
const frz = w("L06", 10), eIn = w("L06", 14) - 0.05, gulp = w("L06", 15) - 0.03;
const chest = S.$("al-chest");
L.sway(tl, { cam: chest }, 0, inh[0] - 0.35, 2.4, 16);
inh.forEach((t, i) => {
  tl.fromTo(chest, { y: 0 }, { y: -52, duration: 0.32, ease: "power2.out", immediateRender: false }, t - 0.32);   // il inspire : le torse monte…
  tl.to(chest, { y: -8, duration: 0.5, ease: "power2.inOut" }, t + 0.1);                                           // …il expire : il redescend presque
  mv(t - 0.2, cu + 0.06, 0.3);                                                                                    // …et la chaleur ne recule jamais
});
// « ne plus respirer » : tout se fige, la vignette se resserre
tl.to(S.$("vg2"), { opacity: 1, duration: 0.9, ease: "power1.in" }, frz);
tl.to(S.cam, { scale: 1.14, duration: eIn - frz, ease: "none" }, frz);
// contrechamp : ses yeux écarquillés, une larme
tl.set(S.$("eb"), { opacity: 1 }, eIn);
tl.fromTo(S.$("eb-tear"), { opacity: 0, y: -10 }, { opacity: 0.9, y: 18, duration: 0.8, ease: "power1.in", immediateRender: false }, eIn + 0.2);
tl.fromTo(S.$("eb"), { x: -2 }, { x: 2, duration: 0.05, yoyo: true, repeat: Math.round((gulp - eIn) / 0.05), ease: "none", immediateRender: false }, eIn);
// « Je peux pas » : il aspire de force, à-coup, la chaleur saute de deux crans
tl.set(S.$("eb"), { opacity: 0, x: 0 }, gulp);
tl.to(S.$("vg2"), { opacity: 0.2, duration: 0.15 }, gulp);
tl.fromTo(S.cam, { y: 14 }, { y: -50, duration: 0.14, ease: "power3.out", immediateRender: false }, gulp);
tl.to(S.cam, { y: 14, duration: 0.7, ease: "power2.inOut" }, gulp + 0.14);
tl.fromTo(chest, { y: -8 }, { y: -90, duration: 0.2, ease: "power3.out", immediateRender: false }, gulp);
mv(gulp, cu + 0.12, 0.25);
