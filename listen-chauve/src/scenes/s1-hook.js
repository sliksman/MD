// PLAN 1 — « Si t'étais une chauve-souris, tu dormirais comment ? » : le lit de la série se retourne (la gravité s'inverse). Tout ce qui s'y trouve tombe vers le plafond du cadre ; une chauve-souris traverse la lune.
const items = `<g id="${ID}-fp" data-ox="230" data-oy="860"><ellipse cx="230" cy="860" rx="150" ry="80" fill="#cfc8bb"/></g>
  <g id="${ID}-fm" data-ox="800" data-oy="900"><path d="M770 860 h70 v95 q0 42 -35 42 q-35 0 -35 -42z" fill="#f1ede4"/></g>
  <g id="${ID}-fs" data-ox="900" data-oy="1100"><path d="M880 1050 h40 v55 q0 32 -36 36 q-30 4 -30 -16 q0 -14 26 -20z" fill="#8fa0d8"/><rect x="880" y="1050" width="40" height="14" fill="#fff" opacity=".5"/></g>`;
const world = `<rect x="-200" y="-200" width="1480" height="2320" fill="#0b0e2a"/><g id="${ID}-st" opacity="0">${A.stars(70, 3, 0, 1900, 0.8)}</g><circle cx="840" cy="560" r="96" fill="#e8f0ff" opacity=".85"/><circle cx="840" cy="560" r="200" fill="#e8f0ff" opacity=".07"/>
  <g id="${ID}-bw" data-ox="540" data-oy="1100"><g transform="translate(-130 -230) scale(1.25)">${A.bedTop({ clock: ["23:40"] })}</g></g>${items}${A.flyBat("fb", 1250, 560, 0.55)}`;
const S = L.stage(root, ID, world, "");
gsap.set(S.cam, { svgOrigin: "540 960" });
const D = sc.end - sc.start;
tl.to(S.$("st"), { opacity: 1, duration: D * 0.7, ease: "power1.in" }, 0.2);
tl.fromTo(S.$("bw"), { rotation: 0 }, { rotation: 180, duration: 1.5, ease: "power2.inOut", immediateRender: false }, 0.15);   // la pièce se retourne
[["fp", -420, -24, 0.9], ["fm", -520, 18, 1.0], ["fs", -560, 30, 0.95]].forEach(([n, dy, rot, t]) => tl.fromTo(S.$(n), { y: 0, rotation: 0 }, { y: dy, rotation: rot, duration: D - t, ease: "power1.in", immediateRender: false }, t));
tl.fromTo(S.$("fb"), { x: 0 }, { x: -760, duration: D - 0.6, ease: "none", immediateRender: false }, 0.6);
tl.fromTo(S.$("fb-w"), { scaleY: 1 }, { scaleY: 0.45, duration: 0.14, yoyo: true, repeat: 18, ease: "sine.inOut", immediateRender: false }, 0.6);
tl.fromTo(S.cam, { scale: 1, rotation: 0 }, { scale: 1.07, rotation: -3, duration: D, ease: "none", immediateRender: false }, 0);
