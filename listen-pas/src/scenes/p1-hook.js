// PLAN 1 — HOOK. Le lit en plongée, le personnage dort (yeux fermés), chambre sombre. 21 traits ambre s'alignent (« trois semaines »),
// l'heure du petit réveil (et celle du haut, dans la composition « counter ») passe de 03:11 à 03:12 sur « douze ». Caméra : poussée continue.
const AM = L.C.amber, O = "540 800";
const ticks = Array.from({ length: 21 }, (_, i) => `<rect id="${A.id("tk" + i)}" data-ox="${297 + (i % 7) * 70}" data-oy="${1374 + Math.floor(i / 7) * 62}" x="${290 + (i % 7) * 70}" y="${1330 + Math.floor(i / 7) * 62}" width="14" height="44" rx="7" fill="${AM}" opacity="0"/>`).join("");
const world = A.void() + A.bg() + `<g opacity=".72">${A.bedTop({ clock: ["03:11", "03:12"] })}</g>`;
const S = L.stage(root, ID, world, ticks);
gsap.set(S.$("phone"), { opacity: 0 });                                   // pas de téléphone sur la table dans ce plan
gsap.set(S.$("eyes-open"), { opacity: 0 }); gsap.set(S.$("eyes-shut"), { opacity: 1 }); gsap.set([S.$("eyes-lidL"), S.$("eyes-lidR")], { opacity: 0 });
gsap.set(S.cam, { scale: 1.5, svgOrigin: O });
tl.to(S.cam, { scale: 1.62, duration: sc.end - sc.start, ease: "none" }, 0);

// « Depuis trois semaines » : 21 traits, un par nuit
const t0 = w("L01", 1) - 0.1;
for (let i = 0; i < 21; i++) tl.fromTo(S.$("tk" + i), { opacity: 0, scaleY: 0 }, { opacity: 0.95, scaleY: 1, duration: 0.12, ease: "back.out(2.5)" }, t0 + i * 0.06);
// « à trois heures douze » : le petit réveil flippe
tl.set(S.$("clk-0"), { opacity: 0 }, w("L01", 11)).set(S.$("clk-1"), { opacity: 1 }, w("L01", 11));
