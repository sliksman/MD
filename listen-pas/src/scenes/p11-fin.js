// PLAN 11 — CETTE NUIT / LA VOIX COUPE / TROIS PAS, UN QUATRIÈME / LES YEUX. Un seul décor de lit en plongée (même cadrage que le hook : la vidéo boucle),
// puis, sur la voix coupée net : l'horloge flippe à 03:12, la chambre s'éteint, NOIR TOTAL (le son seul : trois pas, un quatrième), puis le DERNIER PLAN :
// gros plan des yeux du personnage qui s'ouvrent dans le noir (un point ambre se reflète dans chacun).
const AM = L.C.amber, O = "540 800";
const recPhone = `<g id="${A.id("rp")}"><rect x="195" y="680" width="70" height="128" rx="14" fill="#0b0d1a" stroke="#9cc8ff" stroke-opacity=".7" stroke-width="3"/><rect x="201" y="686" width="58" height="116" rx="10" fill="#101a3a"/>
  ${A.wave("rpw", 208, 252, 750, [{ x: 230, h: 14, w: 12 }], { step: 4, noise: 3, color: "#9cc8ff", w: 3, op: 1 })}<circle id="${A.id("rdot")}" cx="230" cy="708" r="7" fill="${AM}" filter="url(#${A.id("fGlowS")})"/></g>`;
const world = A.void() + A.bg() + `<g opacity=".72">${A.bedTop({ clock: ["03:11", "03:12"] })}</g>` + `<rect id="${A.id("dk")}" x="-1200" y="-1200" width="3480" height="4320" fill="#04050d" opacity="0"/>` + recPhone;
const gBk = `<g id="${A.id("gBk")}" opacity="0"><rect x="-100" y="-100" width="1280" height="2120" fill="#030409"/></g>`;   // NOIR TOTAL : le script dit « Noir », les pas ne s'entendent que
const eye = (cx, n) => `<g id="${A.id("eye" + n)}" data-ox="${cx}" data-oy="960"><ellipse cx="${cx}" cy="960" rx="185" ry="135" fill="#e9e6f2"/><circle cx="${cx}" cy="960" r="82" fill="#2a1d3a"/><circle cx="${cx}" cy="960" r="30" fill="#05060c"/>
  <circle id="${A.id("gl" + n)}" cx="${cx + 27}" cy="932" r="14" fill="${AM}" filter="url(#${A.id("fGlowS")})" opacity="0"/><path d="M${cx - 185} 960 Q${cx} 812 ${cx + 185} 960" fill="none" stroke="#030409" stroke-width="12" stroke-linecap="round"/></g>`;
const gEy = `<g id="${A.id("gEy")}" opacity="0"><rect x="-100" y="-100" width="1280" height="2120" fill="#030409"/>${eye(325, 1)}${eye(735, 2)}</g>`;
const S = L.stage(root, ID, world, gBk + gEy);
gsap.set(S.$("phone"), { opacity: 0 });
gsap.set(S.$("eyes-open"), { opacity: 0 }); gsap.set(S.$("eyes-shut"), { opacity: 1 }); gsap.set([S.$("eyes-lidL"), S.$("eyes-lidR")], { opacity: 0 });
gsap.set([S.$("eye1"), S.$("eye2")], { scaleY: 0.03 });
gsap.set(S.cam, { scale: 1.38, svgOrigin: O });
const tC = w("L10", "end"), tS = tC + 0.38, tE = tC + 4.7;
tl.to(S.cam, { scale: 1.5, duration: tS, ease: "none" }, 0);
// cette nuit : le téléphone enregistre, le personnage dort, rien ne bouge
tl.fromTo(S.$("rdot"), { opacity: 1 }, { opacity: 0.15, duration: 0.55, yoyo: true, repeat: 40, ease: "sine.inOut", immediateRender: false }, 0);
// la voix coupe : l'horloge flippe (aussi en haut), la chambre s'éteint
tl.set(S.$("clk-0"), { opacity: 0 }, tC).set(S.$("clk-1"), { opacity: 1 }, tC);
tl.to(S.$("dk"), { opacity: 0.92, duration: 0.3, ease: "power2.in" }, tC);
// coupe sèche : NOIR TOTAL. Aucune image pendant les quatre pas (bruitages seuls : trois pas, un silence, puis un quatrième, plus lourd, dans la pièce)
tl.set(S.$("gBk"), { opacity: 1 }, tS);
// DERNIER PLAN : les yeux s'ouvrent
tl.set(S.$("gEy"), { opacity: 1 }, tE);
[1, 2].forEach((n) => { tl.fromTo(S.$("eye" + n), { scaleY: 0.03 }, { scaleY: 1, duration: 0.6, ease: "power2.out", immediateRender: false }, tE); tl.fromTo(S.$("gl" + n), { opacity: 0 }, { opacity: 1, duration: 0.3 }, tE + 0.35); });
