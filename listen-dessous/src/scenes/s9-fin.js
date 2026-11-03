// PLAN 9 — « Léa ? » / « Ça vient de dire mon prénom. Avec ta voix. » : presque noir (le blanc de ses yeux), puis Léa de très près, sans bouche : elle n'a pas parlé. La lueur monte comme une marée. Noir sec.
const whites = [430, 650].map((cx, k) => `<ellipse id="${ID}-w${k}" cx="${cx}" cy="960" rx="62" ry="44" fill="#fff" opacity=".9"/><circle cx="${cx + 2}" cy="962" r="8" fill="#1a1a2a"/>`).join("");
const world = `<g id="${ID}-dk"><rect x="-160" y="-260" width="1400" height="2440" fill="#020309"/><g id="${ID}-wh" opacity="0">${whites}</g></g>` + A.lea("lea") + `<rect id="${ID}-bk" x="-160" y="-260" width="1400" height="2440" fill="#020309" opacity="0"/>`;
const S = L.stage(root, ID, world, "");
gsap.set(S.cam, { svgOrigin: "540 960" });
gsap.set(S.$("lea"), { opacity: 0 });
const D = sc.end - sc.start, lea = w("L10", 0) - 0.1, tight = w("L10", 6) - 0.06, black = w("L10", "end") + 0.55;
// presque noir : le blanc de ses yeux apparaît juste avant « Léa ? »
tl.set(S.$("wh"), { opacity: 1 }, w("L09", 0) - 0.08);
tl.fromTo(S.$("wh"), { x: -1.5 }, { x: 1.5, duration: 0.06, yoyo: true, repeat: Math.round((lea - w("L09", 0)) / 0.06), ease: "none", immediateRender: false }, w("L09", 0) - 0.08);
tl.set(S.$("dk"), { opacity: 0 }, lea);
tl.set(S.$("lea"), { opacity: 1 }, lea);
// Léa, de très près, immobile (elle ne respire plus) ; la lueur monte du bas comme une marée
tl.fromTo(S.$("lea-g"), { scale: 1.06 }, { scale: 1.22, duration: tight - lea, ease: "none", immediateRender: false }, lea);
tl.fromTo(S.$("lea-tide"), { opacity: 0, y: 360 }, { opacity: 1, y: 0, duration: black - lea - 0.2, ease: "power1.inOut", immediateRender: false }, lea + 0.4);
tl.set(S.cam, { scale: 1.32, y: -120 }, tight);
tl.fromTo(S.cam, { scale: 1.32 }, { scale: 1.4, duration: black - tight, ease: "none", immediateRender: false }, tight + 0.01);
// noir sec
tl.set(S.$("bk"), { opacity: 1 }, black);
