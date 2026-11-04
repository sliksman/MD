// PLAN 10 — « Seize à vingt heures par jour, pour la plupart. » : un grand cadran de 24 heures ; l'arc ambre du sommeil mange presque tout le cadran, de 16 h puis jusqu'à 20 h. « 16-20 h » au centre, la chauve-souris minuscule pendue au bord.
const world = A.caveBg(2) + `<rect x="-160" y="-160" width="1400" height="2240" fill="#0b0e2a" opacity=".6"/>` + A.dial24("dl", 540, 1000, 300) + `<g id="${ID}-tx" data-ox="540" data-oy="1000" opacity="0"><text x="540" y="1030" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="104" fill="#F5B85A">16-20 h</text></g>${A.bat("bt", 540, 560, 0.5, { ledge: false })}`;
const S = L.stage(root, ID, world, "");
gsap.set(S.cam, { svgOrigin: "540 960" });
const D = sc.end - sc.start, a0 = w("L09", 0), a1 = w("L09", 8) - 0.05, circ = parseFloat(S.$("dl-arc").getAttribute("data-circ"));
tl.fromTo(S.$("dl-arc"), { attr: { "stroke-dasharray": `0 ${circ}` } }, { attr: { "stroke-dasharray": `${circ * 16 / 24} ${circ}` }, duration: a1 - a0, ease: "power2.inOut", immediateRender: false }, a0);
tl.to(S.$("dl-arc"), { attr: { "stroke-dasharray": `${circ * 20 / 24} ${circ}` }, duration: 0.6, ease: "power2.inOut" }, a1);
tl.fromTo(S.$("tx"), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, a0 + 0.2);
tl.fromTo(S.$("bt-body"), { scale: 1 }, { scale: 1.03, duration: 1.0, yoyo: true, repeat: 2, ease: "sine.inOut", immediateRender: false }, 0);
tl.fromTo(S.cam, { scale: 1.04 }, { scale: 1.0, duration: D, ease: "none", immediateRender: false }, 0);
