// PLAN 6 — « Le soleil se lève jusqu'à seize fois par jour. » : le hublot en grand sur la Terre. Le soleil perce l'horizon et inonde le visage de l'astronaute au premier plan ; autour du hublot, un cadran de 16 repères qui s'allument de plus en plus vite. « ×16 » en gros.
const inner = `<rect width="1080" height="1920" fill="#02040f"/>${A.stars(60, 2, 540, 1340)}<ellipse cx="540" cy="1420" rx="900" ry="520" fill="#1b4a9a"/><ellipse cx="540" cy="1400" rx="900" ry="520" fill="none" stroke="#bfe0ff" stroke-width="10" opacity=".8"/>
  <g id="${ID}-sg"><rect x="0" y="540" width="1080" height="800" fill="url(#${ID}-gSun)"/>${A.sunflare("sun", 520, 1020, 280)}</g><defs><linearGradient id="${ID}-gSun" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffc77a" stop-opacity=".5"/><stop offset=".6" stop-color="#ffc77a" stop-opacity="0"/></linearGradient></defs>`;
const ticks = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * 6.2832 - 1.5708; return `<circle id="${ID}-tk${i}" data-ox="${(540 + Math.cos(a) * 470).toFixed(1)}" data-oy="${(940 + Math.sin(a) * 470).toFixed(1)}" cx="${(540 + Math.cos(a) * 470).toFixed(1)}" cy="${(940 + Math.sin(a) * 470).toFixed(1)}" r="10" fill="#fff" opacity=".35"/>`; }).join("");
const world = A.wall("w", { sat: 30 }) + A.porthole("ph", 540, 940, 400, inner) + ticks + A.sleeper("sl", 190, 1500, 1.0) +
  `<g id="${ID}-x16" data-ox="860" data-oy="1470" opacity="0"><text x="860" y="1500" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="170" fill="#F5B85A" filter="url(#${ID}-fShadow)">×16</text></g>` +
  `<rect id="${ID}-wm" x="-60" y="-60" width="1200" height="2040" fill="#F5B85A" opacity="0"/>`;
const S = L.stage(root, ID, world, "");
gsap.set(S.cam, { svgOrigin: "540 960" });
const D = sc.end - sc.start, s0 = w("L06", 1), n0 = w("L06", 5);   // « soleil » : il se lève ; « seize » : le cadran
gsap.set(S.$("sg"), { y: 360 });
tl.fromTo(S.$("sg"), { y: 360 }, { y: 0, duration: n0 - s0 + 0.3, ease: "power2.out", immediateRender: false }, s0 - 0.1);
tl.fromTo(S.$("wm"), { opacity: 0 }, { opacity: 0.16, duration: n0 - s0, ease: "power1.in", immediateRender: false }, s0);
tl.to(S.$("wm"), { opacity: 0.06, duration: 0.8 }, n0 + 0.5);
// le cadran : 16 repères, de plus en plus vite
for (let i = 0; i < 16; i++) {
  const t = n0 + (D - (n0 - 0) - 0.15) * Math.pow(i / 15, 0.75);
  tl.to(S.$("tk" + i), { attr: { fill: "#F5B85A" }, opacity: 1, scale: 1.7, duration: 0.14, ease: "back.out(3)" }, t);
  tl.to(S.$("tk" + i), { scale: 1.2, duration: 0.2 }, t + 0.14);
}
tl.fromTo(S.$("x16"), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, n0 + 0.1);
tl.fromTo(S.cam, { scale: 1 }, { scale: 1.07, duration: D, ease: "none", immediateRender: false }, 0);
