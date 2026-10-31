// PLAN 6 — LE LIT A RETROUVÉ SON MÉTIER. Retour au plan du début (coupe) : un dormeur dans le lit, la tête de lit les yeux fermés,
// le badge « LIT · métier : dormir ». Puis dézoom vers le plan large vu de dessus : « Et toi ? ».
const AM = L.C.amber;
const dots3 = (n) => `<g>${[0, 1, 2].map((i) => `<circle cx="${820 + i * 56}" cy="212" r="14" fill="${i < n ? AM : "#fff"}" opacity="${i < n ? 1 : 0.22}"/>`).join("")}</g>`;
const sec = `<g id="${A.id("secG")}">${A.bedSection()}${A.sleeperSec()}${A.pill("pMet", 480, 520, "LIT · métier : dormir", 120, 800, { size: 44, dot: AM })}</g>`;
const top = `<g id="${A.id("topG")}" opacity="0">${A.floorTop()}${A.rug(540, 1040, 860, 980)}<g transform="translate(-170 -170) scale(1.32)">${A.bedTop({ clock: ["23:50"] })}</g></g>`;
const hud = dots3(3) + `<g id="${A.id("endH")}" opacity="0">${A.title("title", "ÉPISODE 2", ["Et *toi* ?"], 350)}${A.pill("pCom", 540, 410, "dis-le en commentaire ↓", undefined, undefined, { size: 34 })}
  <g id="${A.id("lockup")}"><rect x="140" y="1330" width="720" height="150" rx="40" fill="#0b0d1a" fill-opacity=".88" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>${A.listenIcon(170, 1350, 110)}
  <text x="310" y="1405" font-family="Poppins" font-weight="700" font-size="44" fill="#fff">Listen</text><text x="310" y="1450" font-family="Poppins" font-weight="400" font-size="27" fill="#b8bdd6">Sounds of the World · lien en bio</text></g></g>`;
const S = L.stage(root, ID, sec + top, hud);
gsap.set(S.$("sleeper"), { opacity: 0 });
gsap.set(S.$("pMet"), { opacity: 0 });
gsap.set(S.$("eyes-open"), { opacity: 0 }); gsap.set(S.$("eyes-shut"), { opacity: 1 }); gsap.set([S.$("eyes-lidL"), S.$("eyes-lidR")], { opacity: 0 });
gsap.set(S.$("endH"), { opacity: 0 });
gsap.set([S.$("title-over"), S.$("title-l0")], { opacity: 0 });
gsap.set(S.$("topG"), { opacity: 0 });
// « Tu retournes te coucher. » : le dormeur se glisse dans le lit
tl.fromTo(S.$("sleeper"), { opacity: 0, y: -26 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, w("L23", 3) - 0.1);
tl.fromTo(S.$("duvetSec"), { scaleY: 1, svgOrigin: "620 998" }, { scaleY: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, w("L23", 3) + 0.3);
// « Ton lit a retrouvé son métier. » : le badge
tl.fromTo(S.$("pMet"), { opacity: 0 }, { opacity: 1, duration: 0.01 }, w("L24", 4) - 0.02);
L.pill(tl, S, "pMet", w("L24", 4));
tl.fromTo(S.$("pMet-b"), { rotation: -2, transformOrigin: "50% 50%" }, { rotation: 2, duration: 0.12, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, w("L24", 5));
// « Et toi ? » : dézoom vers le plan large vu de dessus
const et = w("L25", 0);
tl.to(S.$("secG"), { scale: 0.25, x: -20, y: -210, svgOrigin: "540 1000", opacity: 0, duration: 0.6, ease: "power3.inOut", immediateRender: false }, et - 0.3);
tl.fromTo(S.$("topG"), { opacity: 0, scale: 2.2, svgOrigin: "540 700" }, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.inOut", immediateRender: false }, et - 0.3);
tl.set(S.$("endH"), { opacity: 1 }, et - 0.05);
tl.fromTo(S.$("title-over"), { opacity: 0 }, { opacity: 0.85, duration: 0.4 }, et - 0.05);
tl.fromTo(S.$("title-l0"), { opacity: 0, y: 30, scale: 0.92, transformOrigin: "50% 50%" }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2.6)" }, et + 0.1);
L.pop(tl, S.$("pCom"), w("L25", 2), { from: 0.8, ease: "power3.out" });
tl.fromTo(S.$("lockup"), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(2)" }, w("L25", 6) - 0.15);
