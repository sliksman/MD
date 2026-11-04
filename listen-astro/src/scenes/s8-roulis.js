// PLAN 8 — « Et comme y'a pas de gravité, y'a ni haut ni bas : tu dors dans un sac de couchage accroché au mur. » (UN SEUL PLAN)
// La caméra se met à rouler sur elle-même, 360° autour de l'astronaute qui reste immobile : toute la pièce tourne, plus de sol ni de plafond. « haut » et « bas » apparaissent, barrés. Puis la pièce se pose : il dort au mur.
const hooks = [[330, 880], [570, 880], [330, 1100], [570, 1100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#9aa8d0"/><circle cx="${x}" cy="${y}" r="7" fill="#1a1a2a"/>`).join("");
const world = A.wall("w") + A.vent(60, 360, 220, 150) + A.rail(0, 1650, 1080, 1650) + A.cable("M1100 500 C820 600 900 860 760 1060", 24) + A.placard(780, 620) + A.led("l0", 920, 1140) +
  A.porthole("ph", 840, 1380, 150, `<rect width="1080" height="1920" fill="#02040f"/>${A.stars(25, 14, 1230, 1540)}${A.earth("ea", 800, 1620, 420, 9)}`) +
  A.fan("fan", 540, 300, 150) + A.sleeper("sl", 450, 760, 1.5, { mask: true, plugs: true }) + hooks + A.floaters("fl", 33, 5, 60, 1020, 900, 1500) + `<rect x="-60" y="-60" width="1200" height="2040" fill="#04050d" opacity=".2"/>`;
const strike = (n, x, y, txt) => `<g id="${ID}-${n}" data-ox="${x}" data-oy="${y}" opacity="0"><rect x="${x - 130}" y="${y - 42}" width="260" height="84" rx="42" fill="#10142e" stroke="#F5B85A" stroke-width="4"/><text x="${x}" y="${y + 16}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="48" fill="#fff">${txt}</text><line id="${ID}-${n}-k" data-len="228" x1="${x - 114}" y1="${y + 12}" x2="${x + 114}" y2="${y - 8}" stroke="#F5B85A" stroke-width="8" stroke-linecap="round" stroke-dasharray="228" stroke-dashoffset="228"/></g>`;
const hud = strike("ph0", 330, 640, "haut") + strike("pb0", 740, 1280, "bas") + A.pill("pHook", 700, 1000, "accroché au mur", 570, 1100, { size: 36, w: 360, dot: "#F5B85A" });
const S = L.stage(root, ID, world, hud);
gsap.set(S.cam, { svgOrigin: "540 960" });
Array.from(S.$("fl").children).forEach((c, i) => tl.fromTo(c, { y: 0, rotation: 0 }, { y: (i % 2 ? -1 : 1) * (50 + i * 10), rotation: (i % 2 ? 1 : -1) * 60, duration: sc.end - sc.start, ease: "none", immediateRender: false }, 0));
const D = sc.end - sc.start, r0 = w("L08", 5) + 0.2, r1 = w("L08", 11) + 0.1;   // roulis de « y'a ni haut ni bas » jusqu'à « tu dors »
tl.fromTo(S.$("fan-bl"), { rotation: 0 }, { rotation: 360 * 8, duration: D, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.cam, { rotation: 0, scale: 1 }, { rotation: 360, scale: 1.1, duration: r1 - r0, ease: "power2.inOut", immediateRender: false }, r0);
tl.fromTo(S.cam, { scale: 1.1 }, { scale: 1.22, duration: D - r1, ease: "none", immediateRender: false }, r1 + 0.01);
const pop = (n, t) => { tl.fromTo(S.$(n), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.6)", immediateRender: false }, t); tl.fromTo(S.$(n + "-k"), { strokeDashoffset: 228 }, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out", immediateRender: false }, t + 0.18); };
pop("ph0", w("L08", 8)); pop("pb0", w("L08", 10));
tl.to([S.$("ph0"), S.$("pb0")], { opacity: 0, duration: 0.3 }, r1 + 0.1);
L.pill(tl, S, "pHook", w("L08", 18));
