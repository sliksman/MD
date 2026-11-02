// PLAN 9 — « …j'ai compris que ça ne vient pas d'en haut. » On revient à la coupe de l'immeuble. Une flèche vers le toit apparaît, puis est barrée ;
// les anneaux ne partent plus du toit : ils sont déjà à l'intérieur de l'étage.
const AM = L.C.amber, COLD = "#9cc8ff", O = "540 1100";
const line = (name, x1, y1, x2, y2, wd) => { const L0 = Math.ceil(Math.hypot(x2 - x1, y2 - y1)) + 1; return `<line id="${A.id(name)}" data-len="${L0}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${AM}" stroke-width="${wd}" stroke-linecap="round" stroke-dasharray="${L0}" stroke-dashoffset="${L0}" opacity="0"/>`; };
const world = A.bg() + A.facade("fc").replace(/<rect x="590" y="805"[^>]*\/><circle cx="610" cy="832"[^>]*\/>/, "") +
  `<g id="${A.id("arrow")}" data-ox="150" data-oy="770" opacity="0"><g stroke="${COLD}" stroke-width="12" stroke-linecap="round" fill="none"><line x1="150" y1="900" x2="150" y2="640"/><polyline points="110,690 150,640 190,690"/></g></g>` +
  line("sArrow", 100, 780, 200, 760, 9) + A.ring("k1", 540, 850, 70) + A.ring("k2", 540, 850, 70) + A.ring("k3", 540, 850, 70) + `<circle id="${A.id("src")}" data-ox="540" data-oy="850" cx="540" cy="850" r="12" fill="${AM}" filter="url(#${A.id("fGlowS")})" opacity="0"/>` +
  A.pill("pRe", 760, 640, "réécoute", undefined, undefined, { size: 40 }) + A.pill("pEn", 760, 640, "pas d'en haut", undefined, undefined, { size: 40 }) + line("sEn", 610, 650, 910, 644, 7);
const S = L.stage(root, ID, world, "");
gsap.set(S.cam, { scale: 1, svgOrigin: O });
tl.to(S.cam, { scale: 1.05, duration: sc.end - sc.start, ease: "none" }, 0);
const dash = (n, t, d = 0.2) => { const e = S.$(n), L0 = +e.getAttribute("data-len"); tl.set(e, { opacity: 1 }, t - 0.01); tl.fromTo(e, { strokeDashoffset: L0 }, { strokeDashoffset: 0, duration: d, ease: "power2.out", immediateRender: false }, t - 0.01); };
gsap.set([S.$("sArrow"), S.$("sEn")], { opacity: 0 });
// « Et en réécoutant, » : la source est déjà dans l'étage (le point + des anneaux qui pulsent)
tl.fromTo(S.$("src"), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(3)" }, w("L08", 1));
L.pill(tl, S, "pRe", w("L08", 2));
for (let k = 0; k < 4; k++) ["k1", "k2", "k3"].forEach((r, i) => tl.fromTo(S.$(r), { opacity: 0.7, scale: 0.4 }, { opacity: 0, scale: 2.6, duration: 0.9, ease: "power2.out", immediateRender: false }, w("L08", 2) + 0.2 + k * 0.75 + i * 0.2));
tl.to(S.$("pRe"), { opacity: 0, duration: 0.2 }, w("L08", 8) - 0.15);
// « …ne vient pas d'en haut. » : la flèche vers le toit, puis le trait qui la barre
tl.fromTo(S.$("arrow"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, w("L08", 8));
L.pill(tl, S, "pEn", w("L08", 10) - 0.05);
dash("sArrow", w("L08", 11) - 0.05, 0.2);
dash("sEn", w("L08", 11) + 0.2, 0.2);
