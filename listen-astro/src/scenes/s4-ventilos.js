// PLAN 4 — « Alors des ventilateurs tournent toute la nuit. » : un ventilateur géant au premier plan souffle l'air jusqu'à la bulle, au fond, qui se déchire.
const world = A.wall("w") + A.rail(0, 1560, 1080, 1560) + A.cable("M-20 400 C240 520 260 700 80 900", 26) + A.placard(780, 400) + A.led("l0", 130, 1560, "#8fe39a") +
  `<g id="${ID}-far" data-ox="540" data-oy="560" opacity=".92"><g transform="translate(60 120) scale(.55)">${A.sleeper("sl", 600, 560, 1.4)}${A.co2("co", 600, 560, 200, 22, 5)}${A.bubble("bb", 600, 560, 200)}</g></g>` +
  `<g id="${ID}-fw" data-ox="540" data-oy="1160">${A.airflow("af", 540, 1160, 6, 520)}${A.fan("fan", 540, 1160, 300)}</g><rect x="-60" y="-60" width="1200" height="2040" fill="#04050d" opacity=".18"/>`;
const S = L.stage(root, ID, world, "");
gsap.set(S.cam, { svgOrigin: "540 960" });
const D = sc.end - sc.start, f0 = w("L04", 2) - 0.1;
gsap.set(S.$("bb"), { opacity: 1 });
tl.fromTo(S.$("fw"), { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, f0 - 0.45);
tl.fromTo(S.$("fan-bl"), { rotation: 0 }, { rotation: 360 * 9, duration: D, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.$("af").querySelectorAll(".af"), { strokeDashoffset: 0 }, { strokeDashoffset: -640, duration: D, ease: "none", immediateRender: false }, 0);
// la bulle est balayée : elle s'étire vers le haut-gauche et se dissipe, les particules partent avec le courant
tl.fromTo(S.$("bb"), { scaleX: 1, x: 0, opacity: 1 }, { scaleX: 1.4, x: -240, opacity: 0, duration: 1.4, ease: "power2.in", immediateRender: false }, f0 + 0.3);
tl.fromTo(S.$("co"), { x: 0, opacity: 1 }, { x: -520, opacity: 0, duration: 1.6, ease: "power1.in", immediateRender: false }, f0 + 0.3);
tl.fromTo(S.cam, { scale: 1 }, { scale: 1.06, duration: D, ease: "none", immediateRender: false }, 0);
