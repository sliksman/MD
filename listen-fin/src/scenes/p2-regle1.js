// PLAN 2 — RÈGLE NUMÉRO UN. Le « 1 » claque (ce sont les chiffres qui claquent, pas la caméra). Un vrai réveil, vu de dessus,
// passe de 00:34 à 00:45 : l'heure de fin. « heure de coucher » est barrée. Puis la bande ambre de l'alarme traverse l'écran.
const AM = L.C.amber;
const strike = (name, x1, x2, y, wd = 5) => `<line id="${A.id(name)}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${AM}" stroke-width="${wd}" stroke-linecap="round" opacity="0"/>`;
const world = A.void() + A.bg() +
  A.alarmClock("ac", 560, 1090, 1.75, { times: ["00:34", "00:45"], size: 50 }) +
  A.pill("pFin", 540, 1360, "heure de fin", 560, 1250, { size: 44, dot: AM }) +
  A.pill("pCou", 540, 1470, "heure de coucher", undefined, undefined, { size: 40 }) + strike("sCou", 360, 720, 1462) +
  A.pill("pDor", 540, 760, "pas pour dormir", undefined, undefined, { size: 44 }) + strike("sDor", 360, 720, 752) +
  A.alarmBand("band", { cx: 540, cy: 1100, text: "ALARME · 00:45", sub: "pour poser le téléphone", size: 84 });
const S = L.stage(root, ID, world, A.ruleNum("r1", "1", "L'heure de fin.", 110, 860));
gsap.set([S.$("sCou"), S.$("sDor")], { opacity: 0 });
gsap.set(S.$("r1-lab"), { opacity: 0 });
gsap.set(S.$("band"), { opacity: 0 });
const stick = (name, org, t) => {
  tl.set(S.$(name), { opacity: 1 }, t - 0.02);
  tl.fromTo(S.$(name), { scaleX: 0, svgOrigin: org }, { scaleX: 1, duration: 0.18, ease: "power3.out", immediateRender: false }, t - 0.02);
};

// la caméra pousse doucement tout le plan
tl.fromTo(S.cam, { scale: 1, svgOrigin: "540 960" }, { scale: 1.07, duration: sc.end - sc.start, ease: "none" }, 0);

// le réveil entre dès la sortie du volet
tl.fromTo(S.$("ac"), { scale: 0.3, opacity: 0, svgOrigin: "560 1090" }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.2)", immediateRender: true }, 0.08);
tl.set(S.$("ac-t0"), { opacity: 1 }, 0);
// « Règle numéro un : » — le « 1 » claque sur « un »
L.slam(tl, S, "r1", w("L08", 2), { noPunch: true });
tl.fromTo(S.$("r1-lab"), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.3, ease: "back.out(2)" }, w("L08", 3));
// « …ton heure de fin, » : la pastille, puis le réveil passe à 00:45
L.pill(tl, S, "pFin", w("L08", 6));
tl.set(S.$("ac-t0"), { opacity: 0 }, w("L08", 8)).set(S.$("ac-t1"), { opacity: 1 }, w("L08", 8));
tl.fromTo(S.$("ac"), { scale: 1, svgOrigin: "560 1090" }, { scale: 1.12, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, w("L08", 8));
// « …pas de ton heure de coucher. » : la pastille, puis le trait ambre
L.pill(tl, S, "pCou", w("L08", 12));
stick("sCou", "360 1462", w("L08", 14));
tl.to(S.$("pCou"), { opacity: 0.5, duration: 0.2 }, w("L08", 14) + 0.15);

// « Une alarme. » : la bande ambre traverse l'écran ; le décor passe en arrière-plan
const al = w("L09", 0);
tl.to([S.$("ac"), S.$("pFin"), S.$("pCou"), S.$("sCou")], { opacity: 0.18, duration: 0.25 }, al - 0.1);
tl.to(S.$("r1"), { opacity: 0, duration: 0.2 }, al - 0.1);
tl.set(S.$("band"), { opacity: 1 }, al + 0.02);
tl.fromTo(S.$("band-b"), { x: -1500 }, { x: 0, duration: 0.38, ease: "back.out(1.3)", immediateRender: true }, al + 0.02);
// « Pas pour dormir. » : pastille barrée
L.pill(tl, S, "pDor", w("L09", 2));
stick("sDor", "360 752", w("L09", 4));
// « Pour poser le téléphone. » : la bande sonne
tl.fromTo(S.$("band-b"), { rotation: -1.6, transformOrigin: "50% 50%" }, { rotation: 1.6, duration: 0.06, yoyo: true, repeat: 9, ease: "none", immediateRender: false }, w("L09", 5));
tl.set(S.$("band-b"), { rotation: 0 }, w("L09", 5) + 0.64);
