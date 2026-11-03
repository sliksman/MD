// PLAN 1 — « Léa. » : ses yeux (seul contrechamp de l'ouverture), puis il tourne la tête vers elle : Léa endormie, de près.
const S = L.stage(root, ID, A.eyesBig("eb", { pup: 0.14 }) + A.lea("lea"), "");
gsap.set(S.cam, { svgOrigin: "540 960" });
gsap.set(S.$("lea"), { opacity: 0 });
[S.$("eb-lidA"), S.$("eb-lidB")].forEach((e) => gsap.set(e, { scaleY: 0 }));
const cut = w("L01", 1) - 0.04, D = sc.end - sc.start;
// ses yeux : fixes, un tremblement d'un pixel
tl.fromTo(S.$("eb"), { x: -1.5 }, { x: 1.5, duration: 0.05, yoyo: true, repeat: Math.round(cut / 0.05), ease: "none", immediateRender: false }, 0);
tl.set(S.$("eb"), { opacity: 0 }, cut);
tl.set(S.$("lea"), { opacity: 1 }, cut);
// Léa respire (la dernière fois) : le drap monte et descend, le visage pousse très lentement
tl.fromTo(S.$("lea-g"), { scale: 1 }, { scale: 1.1, duration: D - cut, ease: "none", immediateRender: false }, cut);
L.sway(tl, { cam: S.$("lea-duv") }, cut, D, 2.6, 8);
