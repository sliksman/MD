// PLAN 9 — « Troisième nouvelle, la bonne : eux, ils n'ont pas de pluie sur un toit. Pas de terrasse de café. Pas de rue qui s'endort. » (UN SEUL PLAN, le hublot)
// Le hublot, d'ordinaire bleu froid, s'allume en ambre : un toit sous la pluie, une terrasse de café, une rue qui s'endort. Ce sont des souvenirs : un léger parasite sur les bords. En bas, l'astronaute a les yeux ouverts. Badge « 3 ».
const inner = `<g id="${ID}-cold"><rect width="1080" height="1920" fill="#02040f"/>${A.stars(40, 6, 560, 1320)}${A.earth("ea", 540, 1420, 700, 12)}</g>` + ["roof", "cafe", "street"].map((k, i) => `<g id="${ID}-d${i}" opacity="0"><g transform="translate(140 540) scale(.8)">${A.dio(k, "dd" + i)}</g></g>`).join("");
const world = A.wall("w", { sat: 30 }) + A.vent(60, 1500, 220, 150, 6) + A.cable("M1100 400 C820 480 900 760 800 880", 24) + `<ellipse id="${ID}-hl" cx="540" cy="940" rx="580" ry="580" fill="#F5B85A" opacity="0"/>` +
  A.porthole("ph", 540, 940, 400, inner) + A.sleeper("sl", 190, 1520, 0.9) + `<rect x="-60" y="-60" width="1200" height="2040" fill="#04050d" opacity=".22"/>` +
  `<g id="${ID}-par" opacity="0">${[0, 1, 2].map((i) => `<rect x="140" y="${600 + i * 260}" width="800" height="5" fill="#fff" opacity=".5"/>`).join("")}</g>`;
const S = L.stage(root, ID, world, A.badge("b3", 3));
gsap.set(S.cam, { svgOrigin: "540 960" });
const D = sc.end - sc.start, t0 = w("L09", 4) - 0.35, t1 = w("L10", 0) - 0.2, t2 = w("L11", 0) - 0.2, t3 = sc.end - 0.3;
tl.fromTo(S.$("b3"), { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.6)", immediateRender: false }, w("L09", 0) + 0.04);
tl.set(S.$("sl-eyesS"), { opacity: 0 }, w("L09", 2)); tl.set(S.$("sl-eyesO"), { opacity: 1 }, w("L09", 2));   // « la bonne » : il a les yeux ouverts
const flick = (t) => tl.fromTo(S.$("par"), { opacity: 0.5, y: -30 }, { opacity: 0, y: 40, duration: 0.3, ease: "none", immediateRender: false }, t);
const swap = (a, b, t) => { if (a >= 0) tl.to(S.$("d" + a), { opacity: 0, duration: 0.3 }, t); else tl.to(S.$("cold"), { opacity: 0, duration: 0.4 }, t); if (b >= 0) tl.to(S.$("d" + b), { opacity: 1, duration: 0.3 }, t); else tl.to(S.$("cold"), { opacity: 1, duration: 0.5 }, t); flick(t); };
swap(-1, 0, t0); tl.to(S.$("hl"), { opacity: 0.1, duration: 0.5 }, t0);
swap(0, 1, t1); swap(1, 2, t2);
// vie dans les souvenirs : la pluie, la vapeur, les fenêtres qui s'éteignent
tl.fromTo(S.$("dd0-rain"), { y: 0 }, { y: 1000, duration: 0.7, ease: "none", repeat: 8, immediateRender: false }, t0);
[0, 1].forEach((k) => tl.fromTo(S.$("dd1-st" + k), { y: 0, opacity: 0.9 }, { y: -22, opacity: 0.2, duration: 1.1, repeat: 2, ease: "sine.inOut", immediateRender: false }, t1 + k * 0.3));
[1, 3, 5, 7, 0, 2, 4, 6].forEach((k, i) => tl.to(S.$("dd2-wn" + k), { attr: { fill: "#0e1230" }, duration: 0.2 }, t2 + 0.3 + i * 0.16));
[0, 1, 2].forEach((k) => tl.to(S.$("dd2-lp" + k), { opacity: 0.1, duration: 0.3 }, t2 + 0.9 + k * 0.22));
tl.fromTo(S.$("dd2-cat"), { x: 0 }, { x: -260, duration: sc.end - t2, ease: "none", immediateRender: false }, t2);
// le souvenir s'éteint : le hublot redevient la vraie vue
tl.to(S.$("d2"), { opacity: 0, duration: 0.5 }, t3 - 0.1); tl.to(S.$("cold"), { opacity: 1, duration: 0.5 }, t3 - 0.1); tl.to(S.$("hl"), { opacity: 0, duration: 0.5 }, t3 - 0.1);
tl.fromTo(S.cam, { scale: 1 }, { scale: 1.07, duration: D, ease: "none", immediateRender: false }, 0);
