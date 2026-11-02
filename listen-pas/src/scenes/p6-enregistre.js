// PLAN 6 — « Alors j'ai laissé mon téléphone enregistrer la nuit. » Le téléphone en gros plan, écran bleu froid (couleur de l'écran) : forme d'onde
// vivante, chronomètre, point d'enregistrement ambre qui clignote. Pas de néon (réservé à Listen).
const AM = L.C.amber, COLD = "#9cc8ff", O = "540 1090";
const world = A.bg() + `<ellipse cx="540" cy="1050" rx="470" ry="620" fill="url(#${A.id("gHalo")})" opacity=".55"/>` +
  `<g id="${A.id("ph")}"><rect x="320" y="640" width="440" height="900" rx="70" fill="#0b0d1a" stroke="${COLD}" stroke-opacity=".8" stroke-width="5" filter="url(#${A.id("fGlowS")})"/><rect x="344" y="664" width="392" height="852" rx="52" fill="#0d1433"/><rect x="480" y="680" width="120" height="34" rx="17" fill="#000"/>
  <text x="540" y="810" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" letter-spacing="6" fill="${COLD}">ENREGISTREMENT</text><circle id="${A.id("rec")}" cx="540" cy="758" r="11" fill="${AM}" filter="url(#${A.id("fGlowS")})"/>
  <clipPath id="${A.id("wclip")}"><rect x="360" y="930" width="360" height="220"/></clipPath>
  <g clip-path="url(#${A.id("wclip")})"><g id="${A.id("wvg")}">${A.wave("wv", 360, 1500, 1040, [{ x: 450, h: 50, w: 20 }, { x: 560, h: 80, w: 24 }, { x: 650, h: 40, w: 18 }, { x: 820, h: 70, w: 22 }, { x: 960, h: 55, w: 20 }, { x: 1100, h: 85, w: 24 }, { x: 1230, h: 45, w: 18 }], { color: COLD, w: 4, noise: 12, step: 6, op: 1 })}</g></g>
  ${["00:00:05", "00:00:06", "00:00:07"].map((tt, i) => `<text id="${A.id("tm" + i)}" x="540" y="1250" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="84" fill="#fff" opacity="${i ? 0 : 1}">${tt}</text>`).join("")}
  <circle cx="540" cy="1400" r="52" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="5"/><rect x="518" y="1378" width="44" height="44" rx="8" fill="${AM}"/></g>`;
const S = L.stage(root, ID, world, "");
gsap.set(S.$("ph"), { svgOrigin: O });
tl.fromTo(S.$("ph"), { scale: 0.92 }, { scale: 1, duration: 0.5, ease: "expo.out" }, 0);
tl.to(S.$("wvg"), { x: -420, duration: sc.end - sc.start, ease: "none" }, 0);                 // la forme d'onde défile
tl.fromTo(S.$("rec"), { opacity: 1 }, { opacity: 0.2, duration: 0.45, yoyo: true, repeat: 8, ease: "sine.inOut", immediateRender: false }, 0);
tl.set(S.$("tm0"), { opacity: 0 }, 0.8).set(S.$("tm1"), { opacity: 1 }, 0.8);
tl.set(S.$("tm1"), { opacity: 0 }, 1.8).set(S.$("tm2"), { opacity: 1 }, 1.8);
