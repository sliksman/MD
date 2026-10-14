// 03 — OREILLER. 5 retournements avec compteur, le 6e figé en l'air ; 3 points ambre = le sommaire.
const X = (x) => x * 1.3 - 130, Y = (y) => y * 1.3 - 60;
const counts = [1, 2, 3, 4, 5].map((n) => A.pill("pc" + n, 760, 470, "× " + n, X(470), Y(640), { w: 150 })).join("");
const world = A.bg() + A.floorIso(1150) +
  `<g transform="translate(-130 -60) scale(1.3)">${A.bedIso({ clock: ["00:04"] })}</g>` +
  `<rect width="1080" height="1920" fill="#05061a" opacity=".22"/>` +
  `<path id="${A.id("whoosh")}" d="M330 690 q-40 -60 10 -120" stroke="#fff" stroke-opacity=".55" stroke-width="5" fill="none" stroke-dasharray="4 14" stroke-linecap="round" opacity="0"/>` +
  counts + A.pill("pc6", 760, 470, "6ᵉ fois ?", X(470), Y(640));
const hud = `<g id="${A.id("toc")}"><text id="${A.id("tocLab")}" x="500" y="250" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="500" font-size="58" fill="${L.C.cream}">trois choses</text>
  <g filter="${A.u("fGlowS")}">${[330, 500, 670].map((x, i) => `<circle id="${A.id("td" + i)}" cx="${x}" cy="330" r="24" fill="${L.C.amber}"/>`).join("")}</g></g>`;
const S = L.stage(root, ID, world, hud);
L.fadeIn(tl, S, sc);
L.cam(tl, S, { scale: 1.05 }, { scale: 1.08 }, 0, sc.hostDur - 0.5, "none");
L.initLids(S, 0);
gsap.set(S.$("eyes-open"), { scale: 1.35, transformOrigin: "50% 50%" });
tl.to(S.$("eyes-open"), { scale: 1, duration: 0.4 }, 0.3);

// 5 retournements entre « retourner » et « sixième »
const t0 = w("L05", 3), t6 = w("L05", 7);
const per = (t6 - t0) / 5;
const pillow = S.$("pillow");
gsap.set(pillow, { transformOrigin: "50% 50%" });
for (let i = 0; i < 5; i++) {
  const t = t0 + i * per;
  tl.to(pillow, { y: -110, rotation: (i + 1) * 180 - 90, duration: per / 2, ease: "power2.out" }, t);
  tl.to(pillow, { y: 0, rotation: (i + 1) * 180, duration: per / 2, ease: "power2.in" }, t + per / 2);
  tl.set(S.$("pc" + (i + 1)), { opacity: 1 }, t).set(S.$("pc" + (i + 1)), { opacity: 0 }, t + per - 0.01);
}
[1, 2, 3, 4, 5].forEach((n) => gsap.set(S.$("pc" + n), { opacity: 0 }));
// 6e fois : l'oreiller reste en l'air
tl.to(pillow, { y: -150, rotation: 900 - 18, duration: 0.3, ease: "power3.out" }, t6);
tl.fromTo(S.$("whoosh"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, t6 + 0.1);
L.pill(tl, S, "pc6", t6);
// « trois choses » : trois points ambre
const tr = w("L06", 2);
[0, 1, 2].forEach((i) => L.pop(tl, S.$("td" + i), tr + i * 0.12, { from: 0 }));
tl.fromTo(S.$("tocLab"), { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 }, w("L06", 3));
// sortie : travelling vers le pied du lit
tl.to(S.cam, { y: -420, scale: 1.2, svgOrigin: "540 960", duration: 0.55, ease: "power2.in" }, sc.hostDur - 0.55);
tl.to(S.$("toc"), { y: -60, opacity: 0, duration: 0.4 }, sc.hostDur - 0.45);
