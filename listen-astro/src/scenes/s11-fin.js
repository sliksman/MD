// PLAN 11 — « Si t'en mettais un ce soir ? » + CARTE DE FIN. On revient au lit : le téléphone éclaire la couette en néon, la pluie à la fenêtre, le personnage s'endort. Puis la carte de fin : Listen · Sounds of the World · lien en bio.
const rain = Array.from({ length: 22 }, (_, i) => `<line x1="${760 + ((i * 37) % 150)}" y1="${640 + ((i * 53) % 130)}" x2="${752 + ((i * 37) % 150)}" y2="${668 + ((i * 53) % 130)}" stroke="#bfe0ff" stroke-opacity=".7" stroke-width="3"/>`).join("");
const bedPhone = A.bedTop({ clock: ["23:41"] });
const world = `<rect x="-200" y="-200" width="1480" height="2320" fill="#101230"/><ellipse cx="260" cy="800" rx="460" ry="520" fill="url(#${ID}-gNeonGlow)" opacity=".95"/>${bedPhone}
  <g><rect x="760" y="640" width="150" height="150" rx="14" fill="#1a1638" stroke="#F5B85A" stroke-opacity=".5" stroke-width="5"/><path d="M835 640 V790 M760 715 H910" stroke="#F5B85A" stroke-opacity=".5" stroke-width="5"/><g id="${ID}-wr" clip-path="url(#${ID}-wc)">${rain}<g transform="translate(0 -150)">${rain}</g></g></g><defs><clipPath id="${ID}-wc"><rect x="762" y="642" width="146" height="146"/></clipPath></defs>
  <rect id="${ID}-dm" x="-60" y="-60" width="1200" height="2040" fill="#04050d" opacity=".18"/>`;
const card = `<g id="${ID}-cd" opacity="0"><rect x="-60" y="-60" width="1200" height="2040" fill="#070816" opacity=".9"/><ellipse cx="540" cy="900" rx="600" ry="520" fill="url(#${ID}-gNeonGlow)" opacity=".9"/>
  <g id="${ID}-ci" data-ox="540" data-oy="760" opacity="0">${A.listenIcon(420, 640, 240)}</g>
  <text id="${ID}-ct" x="540" y="1000" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="100" fill="#fff" opacity="0">Listen</text>
  <text id="${ID}-cs" x="540" y="1066" text-anchor="middle" font-family="Poppins" font-weight="400" font-size="40" fill="#b8bdd6" opacity="0">Sounds of the World</text>
  <g id="${ID}-cp" data-ox="540" data-oy="1160" opacity="0"><rect x="340" y="1110" width="400" height="90" rx="45" fill="#10142e" stroke="url(#${ID}-gNeon)" stroke-width="5"/><text x="540" y="1170" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="42" fill="#fff">lien en bio</text></g></g>`;
const S = L.stage(root, ID, world, card);
gsap.set(S.cam, { svgOrigin: "540 960" });
gsap.set(S.$("phone-on"), { opacity: 1 });
const D = sc.end - sc.start, c0 = w("L13", 5) + 0.62, shutT = w("L13", 4);   // la carte arrive après la dernière syllabe
tl.fromTo(S.cam, { scale: 1.04 }, { scale: 1.2, duration: c0, ease: "none", immediateRender: false }, 0);
tl.fromTo(S.$("wr"), { y: 0 }, { y: 150, duration: 0.5, ease: "none", repeat: 12, immediateRender: false }, 0);
L.shut(tl, S, shutT, true, "eyes");
tl.to(S.$("dm"), { opacity: 0.4, duration: c0 - shutT, ease: "power1.in" }, shutT);
tl.fromTo(S.$("cd"), { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, c0);
tl.fromTo(S.$("ci"), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.2)", immediateRender: false }, c0 + 0.15);
tl.fromTo(S.$("ct"), { opacity: 0 }, { opacity: 1, duration: 0.35, immediateRender: false }, c0 + 0.4);
tl.fromTo(S.$("cs"), { opacity: 0 }, { opacity: 1, duration: 0.35, immediateRender: false }, c0 + 0.6);
tl.fromTo(S.$("cp"), { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.4)", immediateRender: false }, c0 + 0.85);
