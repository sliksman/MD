// PLAN 6 — « À chaque fois que je respire, ça remonte d'un cran. Alors j'essaie de ne plus respirer. Je peux pas. » : le cadre respire, le relief monte à chaque inspiration (cliquet). Il retient son souffle : tout se fige. Contrechamp : ses yeux. Il aspire de force.
const hud = `<g id="${ID}-vg2" opacity="0"><rect width="1080" height="1920" fill="url(#${ID}-gVig)"/><rect width="1080" height="1920" fill="url(#${ID}-gVig)"/><rect width="1080" height="1920" fill="url(#${ID}-gVig)"/></g>`;
const S = L.stage(root, ID, A.pov("pv") + A.eyesBig("eb", { r: 112, ex: 180, pup: 0.1 }), hud);
gsap.set(S.cam, { svgOrigin: "540 960", scale: 1.17, rotation: -2.2, x: -24, y: 18 });
gsap.set(S.$("eb"), { opacity: 0 });
[S.$("eb-lidA"), S.$("eb-lidB")].forEach((e) => gsap.set(e, { scaleY: 0 }));
gsap.set(S.$("pv-glw"), { opacity: 0.9 });
const lv = (b) => 280 - b, D = sc.end - sc.start;
gsap.set(S.$("pv-hump"), { y: lv(300) });
const inh = [w("L06", 5), w("L06", 7) - 0.05, w("L06", 9)];   // « respire », « remonte », « cran » : trois inspirations
const frz = w("L06", 10), eIn = w("L06", 14) - 0.05, gulp = w("L06", 15) - 0.03;
// le cadre respire (sa respiration) ; chaque inspiration : le cadre monte et le relief gagne un cran qu'il ne reperd jamais
L.sway(tl, S, 0, inh[0] - 0.3, 2.4, 14);
let b = 300;
inh.forEach((t, i) => {
  tl.fromTo(S.cam, { y: 0 }, { y: -34, duration: 0.3, ease: "power2.out", immediateRender: false }, t - 0.3);
  tl.to(S.cam, { y: 0, duration: 0.5, ease: "power2.inOut" }, t + 0.05);
  tl.fromTo(S.$("pv-hump"), { y: lv(b) }, { y: lv(b + 28), duration: 0.28, ease: "power3.out", immediateRender: false }, t - 0.2);
  b += 28;
});
// « ne plus respirer » : tout se fige, la vignette se resserre
tl.to(S.$("vg2"), { opacity: 1, duration: 0.9, ease: "power1.in" }, frz);
tl.to(S.cam, { scale: 1.22, duration: eIn - frz, ease: "none" }, frz);
// contrechamp : ses yeux écarquillés, une larme
tl.set(S.$("eb"), { opacity: 1 }, eIn);
tl.fromTo(S.$("eb-tear"), { opacity: 0, y: -10 }, { opacity: 0.9, y: 18, duration: 0.8, ease: "power1.in", immediateRender: false }, eIn + 0.2);
tl.fromTo(S.$("eb"), { x: -2 }, { x: 2, duration: 0.05, yoyo: true, repeat: Math.round((gulp - eIn) / 0.05), ease: "none", immediateRender: false }, eIn);
// « Je peux pas » : il aspire de force, à-coup, le relief saute de deux crans
tl.set(S.$("eb"), { opacity: 0, x: 0 }, gulp);
tl.to(S.$("vg2"), { opacity: 0.2, duration: 0.15 }, gulp);
tl.fromTo(S.cam, { y: 0 }, { y: -80, duration: 0.14, ease: "power3.out", immediateRender: false }, gulp);
tl.to(S.cam, { y: 0, duration: 0.7, ease: "power2.inOut" }, gulp + 0.14);
tl.fromTo(S.$("pv-hump"), { y: lv(b) }, { y: lv(b + 60), duration: 0.2, ease: "power3.out", immediateRender: false }, gulp);
