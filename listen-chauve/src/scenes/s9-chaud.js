// PLAN 9 — « Troisième nouvelle, la bonne : t'as aucun mal à t'endormir. » : changement de température. Le grenier, lumière ambre douce, poussière qui danse dans un rayon ; elle dort, un petit sourire, des « z z z » qui montent. Badge « 3 ».
const zs = [0, 1, 2].map((i) => `<g id="${ID}-z${i}" data-ox="${700 + i * 70}" data-oy="${1180 + i * 110}" opacity="0"><text x="${700 + i * 70}" y="${1180 + i * 110}" font-family="Nunito" font-weight="900" font-size="${70 + i * 18}" fill="#fff">z</text></g>`).join("");
const world = A.atticBg() + A.dust("du", 8, 70) + `<ellipse id="${ID}-lamp" cx="540" cy="1000" rx="560" ry="620" fill="#F5B85A" opacity=".12"/><rect x="-160" y="640" width="1400" height="150" fill="#5a3a22"/><rect x="-160" y="640" width="1400" height="22" fill="#9a6a40" opacity=".7"/>${A.bat("bt", 540, 670, 1.5, { ledge: false })}${zs}<rect x="-160" y="-160" width="1400" height="2240" fill="#04050d" opacity=".06"/>`;
const S = L.stage(root, ID, world, A.badge("b3", 3));
gsap.set(S.cam, { svgOrigin: "540 960" });
const D = sc.end - sc.start, z0 = w("L08", 8) - 0.1;
tl.fromTo(S.$("b3"), { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.6)", immediateRender: false }, w("L08", 0) + 0.04);
tl.fromTo(S.$("du"), { y: 0 }, { y: -140, duration: D, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.$("lamp"), { opacity: 0.08 }, { opacity: 0.18, duration: 1.2, yoyo: true, repeat: 2, ease: "sine.inOut", immediateRender: false }, 0);
tl.fromTo(S.$("bt-body"), { scale: 1 }, { scale: 1.015, duration: 1.3, yoyo: true, repeat: 2, ease: "sine.inOut", immediateRender: false }, 0);
[0, 1, 2].forEach((i) => tl.fromTo(S.$("z" + i), { opacity: 0, y: 40, x: 0 }, { opacity: 0.85, y: -60 + i * -20, x: 30, duration: 0.9, ease: "power1.out", immediateRender: false }, z0 + i * 0.35));
tl.fromTo(S.cam, { scale: 1 }, { scale: 1.08, duration: D, ease: "none", immediateRender: false }, 0);
