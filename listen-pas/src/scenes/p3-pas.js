// PLAN 3 — « Des pas. » Deux empreintes ambre se posent l'une après l'autre ; un anneau part de chacune (le bruit). Coupe sèche avec le plan précédent.
const AM = L.C.amber;
const world = A.bg() + `<rect width="1080" height="1920" fill="#04050d" opacity=".2"/>` +
  A.foot("f1", 430, 1290, -8, 1.35) + A.foot("f2", 640, 1230, 6, 1.35) + A.ring("r1", 430, 1290, 110) + A.ring("r2", 640, 1230, 110) +
  A.pill("pPas", 540, 1480, "des pas", undefined, undefined, { size: 50, dot: AM });
const S = L.stage(root, ID, world, "");
const stomp = (f, r, t) => {
  tl.fromTo(S.$(f), { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.12, ease: "power3.in" }, t);
  tl.fromTo(S.$(r), { opacity: 0.8, scale: 0.4 }, { opacity: 0, scale: 1.7, duration: 0.6, ease: "power2.out", immediateRender: false }, t + 0.1);
};
stomp("f1", "r1", w("L02", 3));
stomp("f2", "r2", w("L02", 4));
L.pill(tl, S, "pPas", w("L02", 4) + 0.08);
