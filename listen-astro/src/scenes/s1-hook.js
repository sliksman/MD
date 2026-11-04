// PLAN 1 — « Si t'étais astronaute, tu dormirais comment ? » : le lit de la série décolle. Tout ce qui s'y trouve se met à flotter, les étoiles apparaissent au plafond.
const bed = A.bedTop({ clock: ["23:40"] });
const floatItems = `<g id="${ID}-fp" data-ox="250" data-oy="860"><ellipse cx="250" cy="860" rx="150" ry="80" fill="#cfc8bb"/></g>
  <g id="${ID}-fm" data-ox="760" data-oy="760"><path d="M730 720 h70 v95 q0 42 -35 42 q-35 0 -35 -42z" fill="#f1ede4"/><path d="M752 700 q-10 -30 6 -50" stroke="#fff" stroke-opacity=".5" stroke-width="6" fill="none"/></g>
  <g id="${ID}-fs" data-ox="880" data-oy="1000"><path d="M860 950 h40 v55 q0 32 -36 36 q-30 4 -30 -16 q0 -14 26 -20z" fill="#8fa0d8"/><rect x="860" y="950" width="40" height="14" fill="#fff" opacity=".5"/></g>
  <g id="${ID}-fh" data-ox="170" data-oy="1100"><rect x="140" y="1040" width="62" height="118" rx="12" fill="#0b0d1a" stroke="#fff" stroke-opacity=".3" stroke-width="3"/></g>`;
const world = `<rect x="-200" y="-200" width="1480" height="2320" fill="#0c102a"/><g id="${ID}-st" opacity="0">${A.stars(110, 4, 0, 1100, 0.9)}</g>
  <g id="${ID}-bw" data-ox="540" data-oy="1000"><g transform="translate(-130 -230) scale(1.25)">${bed}</g></g>${floatItems}`;
const S = L.stage(root, ID, world, "");
gsap.set(S.cam, { svgOrigin: "540 960" });
const D = sc.end - sc.start;
tl.to(S.$("st"), { opacity: 1, duration: D * 0.8, ease: "power1.in" }, 0.2);
tl.fromTo(S.$("bw"), { y: 0, scale: 1 }, { y: -110, scale: 1.06, duration: D, ease: "power1.in", immediateRender: false }, 0);
tl.fromTo(S.$("duvet"), { y: 0 }, { y: -40, duration: 1.4, ease: "power2.out", immediateRender: false }, 0.2);
[["fp", -300, -24, 0.25], ["fm", -380, 18, 0.45], ["fs", -330, 30, 0.35], ["fh", -420, -30, 0.55]].forEach(([n, dy, rot, t]) => tl.fromTo(S.$(n), { y: 0, rotation: 0 }, { y: dy, rotation: rot, duration: D - t, ease: "power1.in", immediateRender: false }, t));
tl.fromTo(S.cam, { scale: 1, rotation: 0 }, { scale: 1.08, rotation: -4, duration: D, ease: "none", immediateRender: false }, 0);
