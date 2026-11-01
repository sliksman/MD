// PLAN 4 — RÈGLE NUMÉRO DEUX. Du noir au néon, sans volet : le téléphone sur la table de nuit s'allume (première apparition du néon).
// On plonge dans l'écran de Listen, on lance la piste, puis le téléphone se retourne, écran contre le bois : seul un liseré néon fuit dessous
// et des arcs de points chauds remplissent la chambre. Aucune lumière d'écran dans le dernier plan.
const AM = L.C.amber, WARM = "#ffd28a", O = "540 800";
// plan large (monde, sous la caméra)
const wideG = `<g id="${A.id("wideG")}" opacity="0">${A.bg()}${A.bedTop({ clock: ["00:47"] })}
  <rect id="${A.id("dk")}" x="-1200" y="-1200" width="3480" height="4320" fill="#04050d" opacity=".58"/>
  ${A.downPhone("dph")}${A.warmDots("w", 230, 744, 3, 110, 60, 35)}</g>`;
// vues plein cadre (au-dessus de la caméra) : la table de nuit, l'écran de Listen, le dos du téléphone
const tblG = `<g id="${A.id("tblG")}"><rect width="1080" height="1920" fill="#0a0c1c"/>
  <ellipse id="${A.id("bloom")}" cx="540" cy="1195" rx="440" ry="540" fill="${L.C.violet}" opacity="0" filter="url(#${A.id("fBlurL")})"/>
  ${A.sideTable("tbl", 540, 1200, 560, 640)}${A.phoneTop("big", 450, 1030, 180, 330)}</g>`;
const uiG = `<g id="${A.id("uiG")}" opacity="0"><rect width="1080" height="1920" fill="${L.C.night0}"/><ellipse cx="540" cy="1070" rx="480" ry="640" fill="${L.C.violet}" opacity=".22" filter="url(#${A.id("fBlurL")})"/>
  <g id="${A.id("uiZ")}">${A.phoneUI(330, 640, 420, { track: "Terrasse de café", sub: "Enregistrée sur place", section: "AMBIANCES" })}</g></g>`;
const backG = `<g id="${A.id("backG")}" opacity="0"><rect x="318" y="628" width="444" height="885" rx="66" fill="none" stroke="url(#${A.id("gNeon")})" stroke-width="12" filter="url(#${A.id("fGlowN")})"/>
  <rect x="330" y="640" width="420" height="861" rx="60" fill="#0b0d1a" stroke="#fff" stroke-opacity=".18" stroke-width="4"/><rect x="362" y="672" width="120" height="120" rx="30" fill="#1d2140"/></g>`;
const S = L.stage(root, ID, A.void() + wideG, tblG + uiG + backG + A.ruleNum("r2", "2", "Une ambiance.", 110, 860));
// origines épinglées une fois pour toutes (jamais dans un tween : le rendu saute à la fin puis revient)
[["big-on", "540 1195"], ["tblG", "540 1195"], ["uiG", "540 1070"], ["uiZ", "540 1560"], ["tap", "682 1412"], ["phoneBig", "540 1070"], ["backG", "540 1070"], ["dph", "230 744"]].forEach(([n, o]) => gsap.set(S.$(n), { svgOrigin: o }));
gsap.set(S.$("screenOff"), { opacity: 0 });
gsap.set(S.$("phone"), { opacity: 0 });
gsap.set(S.$("r2-lab"), { opacity: 0 });
gsap.set(S.$("dph-rim"), { opacity: 1 });
const DUR = sc.end - sc.start;
["w0", "w1", "w2"].forEach((n) => gsap.set(S.$(n), { opacity: 0 }));
gsap.set(S.cam, { scale: 1.2, svgOrigin: O });
L.initLids(S, 0.0);

// --- le téléphone s'allume (dès la coupe : le visuel précède la voix) — premier néon du film
tl.fromTo(S.$("big-on"), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.12);
tl.fromTo(S.$("big-on"), { scale: 1.3 }, { scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, 0.12);
tl.to(S.$("bloom"), { opacity: 0.35, duration: 0.6, ease: "power2.out" }, 0.12);
// « Règle numéro deux : » — le « 2 » claque ; « remplis ce silence. »
L.slam(tl, S, "r2", w("L12", 2), { noPunch: true });
tl.fromTo(S.$("r2-lab"), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.3, ease: "back.out(2)" }, w("L12", 3));

// « Sur Listen, » — on plonge dans l'écran
const dive = w("L13", 0);
tl.to(S.$("tblG"), { scale: 3.4, duration: 0.42, ease: "power3.in" }, dive - 0.1);
tl.to(S.$("r2"), { opacity: 0, duration: 0.15 }, dive - 0.15);
tl.fromTo(S.$("uiG"), { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out", immediateRender: true }, dive + 0.05);
tl.set(S.$("tblG"), { opacity: 0 }, dive + 0.4);
// « …une terrasse de café, » — la piste est lue de près
tl.fromTo(S.$("uiZ"), { scale: 1 }, { scale: 1.15, duration: 0.5, ease: "power2.inOut", immediateRender: false }, w("L13", 2) - 0.1);
tl.fromTo(S.$("trackHi"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, w("L13", 5));
// « Tu lances, » — le doigt tape la lecture
const tap = w("L14", 1);
tl.fromTo(S.$("tap"), { opacity: 0.9, scale: 0.5 }, { opacity: 0, scale: 1.5, duration: 0.6, ease: "power2.out", immediateRender: false }, tap);
tl.set(S.$("play"), { opacity: 0 }, tap + 0.1).set(S.$("pause"), { opacity: 1 }, tap + 0.1);

// « tu retournes le téléphone. » — dézoom, le téléphone se retourne, rétrécit vers la table de nuit
const fl = w("L14", 3);
tl.to(S.$("uiZ"), { scale: 1, duration: 0.3, ease: "power2.inOut" }, fl - 0.4);
tl.fromTo(S.$("phoneBig"), { scaleX: 1 }, { scaleX: 0, duration: 0.14, ease: "power2.in", immediateRender: false }, fl - 0.05);
tl.set(S.$("backG"), { opacity: 1 }, fl + 0.09);
tl.fromTo(S.$("backG"), { scaleX: 0 }, { scaleX: 1, duration: 0.14, ease: "power2.out", immediateRender: false }, fl + 0.09);
tl.to(S.$("uiG"), { opacity: 0, duration: 0.3 }, fl + 0.22);
tl.to(S.$("backG"), { scale: 0.2, x: -372, y: -338, duration: 0.5, ease: "power3.inOut" }, fl + 0.3);
tl.fromTo(S.$("wideG"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, fl + 0.3);
tl.to(S.$("backG"), { opacity: 0, duration: 0.08 }, fl + 0.82);
tl.fromTo(S.$("dph"), { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: true }, fl + 0.75);
tl.fromTo(S.$("dph"), { scale: 1.18 }, { scale: 1, duration: 0.15, ease: "power3.out", immediateRender: false }, fl + 0.8);

// « Le bruit des autres, sans l'écran. » — des arcs de points chauds remplissent la chambre
["w0", "w1", "w2"].forEach((r, i) => {
  const t = w("L15", 1) + i * 0.24;
  tl.set(S.$(r), { opacity: 1 }, t - 0.01);
  L.drawDots(tl, S.$(r), t, 0.5, { ir: false });
  L.shimmer(tl, S.$(r), t + 0.6, DUR, { per: 1.1, low: 0.4 });
});
tl.to(S.cam, { scale: 1.28, duration: DUR - (fl + 0.8), ease: "none" }, fl + 0.8);
L.lids(tl, S, w("L15", 4), 0.5, 0.6);
