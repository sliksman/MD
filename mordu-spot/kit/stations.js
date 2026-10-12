/* ==========================================================================
   MORDU — décors partagés (« stations ») et cadrages de raccord.
   Chaque scène reconstruit le même diorama avec ces fabriques : les raccords
   de caméra entre scènes tombent donc sur un décor identique.
   ========================================================================== */
(function () {
  "use strict";
  const M = window.MORDU;

  // ---------- cadrages de raccord ------------------------------------------
  // fin de la scène N = début de la scène N+1.
  const CAM = {
    s0: M.focus({ x: -380, y: -400, z: 140 }, 1.3, 0, 10),
    mixer: M.focus({ x: -40, y: 340, z: 130 }, 1.35),
    press: M.focus({ x: 290, y: 360, z: 150 }, 1.35),
    rack: M.focus({ x: 600, y: 320, z: 130 }, 1.35),
    s1end: M.focus({ x: 100, y: 60, z: 100 }, 0.78, 0, 30),
  };

  // ---------- CHANTIER (scènes 0 et 1, monde gris) --------------------------
  function chantier(iso, o) {
    o = o || {};
    const R = {};
    R.slab = M.slab(iso, { size: 1700, mat: "gris", id: o.id ? o.id + "-slab" : undefined });

    // Ossature de cloison : lisses + montants, le long de x, face au sud.
    const wall = M.obj(iso, { x: -700, y: -560 });
    R.wall = wall;
    M.cuboid(wall, { x: 0, y: 0, z: 0, w: 700, d: 22, h: 12, mat: "gris" });
    M.cuboid(wall, { x: 0, y: 0, z: 318, w: 700, d: 22, h: 12, mat: "gris" });
    for (const sx of [0, 172, 344, 516, 686]) M.cuboid(wall, { x: sx, y: 0, z: 12, w: 14, d: 22, h: 306, mat: "fond-gris" });

    // Plaques « barre protéinée standard » vissées sur l'ossature.
    R.plates = [];
    const plateXs = [2, 174, 346, 518];
    plateXs.forEach(function (px, i) {
      const p = M.obj(wall, { x: px, y: 22, z: 0 });
      const b = M.barPlaco(p, { len: 168, d: 14, h: 330, seed: 20 + i, shadow: false });
      b.screws = [];
      for (const [sx, sz] of [[16, 290], [152, 290], [16, 40], [152, 40]]) {
        const dot = M.decal(b.body.faces.s, '<svg viewBox="0 0 168 330"><circle cx="' + sx + '" cy="' + (330 - sz) + '" r="5" fill="var(--choco)"/></svg>');
        b.screws.push(dot);
      }
      p.bar = b;
      R.plates.push(p);
    });
    // Étiquette posée sur la plaque 2.
    const tag = M.decal(
      R.plates[1].bar.body.faces.s,
      '<div style="position:absolute;left:14px;top:110px;width:140px;padding:8px 0;background:var(--creme);text-align:center">' +
        '<div class="t-display" style="display:block;font-size:19px;color:var(--choco)">BARRE PROTÉINÉE</div>' +
        '<div class="t-display" style="display:block;font-size:15px;color:var(--choco);margin-top:4px">(STANDARD)</div></div>'
    );
    R.tag = tag;

    // Pile de plaques au sol + niveau à bulle (gag scène 0).
    const stack = M.obj(iso, { x: -660, y: -300 });
    R.stack = stack;
    M.shadow(stack, { w: 330, d: 170, ext: 30 });
    for (let k = 0; k < 3; k++) M.barPlaco(stack, { len: 330, d: 170, h: 14, z: k * 14, seed: 40 + k, shadow: false });
    const level = M.obj(stack, { x: 40, y: 74, z: 42 });
    const lv = M.cuboid(level, { w: 250, d: 26, h: 26, mat: "caramel" });
    M.decal(lv.faces.s, '<svg viewBox="0 0 250 26"><rect x="90" y="4" width="70" height="18" rx="9" fill="var(--creme)"/><rect x="116" y="4" width="2.5" height="18" fill="var(--choco)"/><rect x="131.5" y="4" width="2.5" height="18" fill="var(--choco)"/></svg>');
    // Bulle : élément 2D dans la fenêtre, tween x (0 = pile au centre).
    const bubbleWrap = document.createElement("div");
    bubbleWrap.style.cssText = "position:absolute;left:94px;top:7px;width:62px;height:12px";
    const bubble = document.createElement("div");
    bubble.style.cssText = "position:absolute;left:22px;top:0;width:18px;height:12px;border-radius:6px;background:var(--caramel-vif)";
    bubbleWrap.appendChild(bubble);
    lv.faces.s.appendChild(bubbleWrap);
    R.bubble = bubble;
    R.level = level;

    // Ouvriers : de dos, face à la cloison, visseuse en main.
    function drillWorker(x, y, id) {
      const w = M.operator(iso, { x: x, y: y, variant: "worker", id: id });
      gsap.set(w, { rotationZ: 180 });
      // Visseuse dans le prolongement du bras (bras tendu à l'horizontale).
      const drill = M.obj(w.parts.armR, { x: 0, y: 0, z: 0 });
      M.cuboid(drill, { x: -11, y: -13, z: -152, w: 22, d: 26, h: 48, mat: "choco" });
      M.cuboid(drill, { x: -3, y: -3, z: -170, w: 6, d: 6, h: 18, mat: "gris" });
      M.cuboid(drill, { x: -8, y: -42, z: -124, w: 16, d: 29, h: 16, mat: "caramel" });
      gsap.set(w.parts.armR, { rotationX: 90 });
      w.drill = drill;
      return w;
    }
    R.worker1 = drillWorker(-270, -346, o.id ? o.id + "-w1" : undefined);
    R.worker2 = drillWorker(-98, -346, o.id ? o.id + "-w2" : undefined);

    // Machines du procédé ordinaire, en ligne le long de y = +260.
    // Malaxeur.
    const mixer = M.obj(iso, { x: -120, y: 260 });
    R.mixer = mixer;
    M.shadow(mixer, { w: 160, d: 160, ext: 40 });
    const tank = M.cuboid(mixer, { w: 160, d: 160, h: 120, mat: "gris" });
    M.decal(tank.faces.top, '<svg viewBox="0 0 160 160"><rect x="16" y="16" width="128" height="128" fill="var(--fond-gris)"/></svg>');
    const paddle = M.obj(mixer, { x: 80, y: 80, z: 120 });
    M.cuboid(paddle, { x: -54, y: -6, z: 0, w: 108, d: 12, h: 10, mat: "fond-gris" });
    M.cuboid(paddle, { x: -6, y: -6, z: 0, w: 12, d: 12, h: 60, mat: "fond-gris" });
    R.paddle = paddle;
    // Sac de poudre, au-dessus.
    const sack = M.obj(iso, { x: -230, y: 320, z: 0 });
    M.cuboid(sack, { x: -40, y: -30, z: 0, w: 80, d: 60, h: 90, mat: "gris" });
    R.sack = sack;
    R.powder = [];
    const r = M.rng(77);
    for (let i = 0; i < 18; i++) {
      const pz = M.obj(iso, { x: -60 + r() * 30, y: 300 + r() * 30, z: 250 });
      M.cuboid(pz, { w: 9, d: 9, h: 9, mat: "gris" });
      pz.dx = -20 + r() * 40;
      gsap.set(pz, { scale: 0 }); // révélée par la scène 1
      R.powder.push(pz);
    }

    // Presse hydraulique.
    const press = M.obj(iso, { x: 200, y: 280 });
    R.press = press;
    M.shadow(press, { w: 170, d: 140, ext: 40 });
    M.cuboid(press, { w: 170, d: 140, h: 40, mat: "fond-gris" });
    M.cuboid(press, { x: 6, y: 56, z: 40, w: 22, d: 28, h: 260, mat: "gris" });
    M.cuboid(press, { x: 142, y: 56, z: 40, w: 22, d: 28, h: 260, mat: "gris" });
    M.cuboid(press, { x: 0, y: 50, z: 300, w: 170, d: 40, h: 30, mat: "gris" });
    const ram = M.obj(press, { x: 30, y: 30, z: 200 });
    M.cuboid(ram, { w: 110, d: 80, h: 30, mat: "gris" });
    M.cuboid(ram, { x: 45, y: 30, z: 30, w: 20, d: 20, h: 70, mat: "fond-gris" });
    R.ram = ram;
    const cake = M.obj(press, { x: 35, y: 35, z: 40 });
    M.barPlaco(cake, { len: 100, d: 70, h: 60, seed: 61, shadow: false });
    R.cake = cake;

    // Claie de séchage.
    const rack = M.obj(iso, { x: 500, y: 260 });
    R.rack = rack;
    M.shadow(rack, { w: 200, d: 120, ext: 40 });
    for (const [px, py] of [[0, 0], [188, 0], [0, 108], [188, 108]]) M.cuboid(rack, { x: px, y: py, z: 0, w: 12, d: 12, h: 206, mat: "fond-gris" });
    R.trays = [];
    [40, 120, 200].forEach(function (z, i) {
      M.cuboid(rack, { x: 0, y: 0, z: z, w: 200, d: 120, h: 6, mat: "gris" });
      const t = M.obj(rack, { x: 30, y: 25, z: z + 6 });
      M.barPlaco(t, { len: 140, d: 70, h: 26, seed: 90 + i, shadow: false });
      R.trays.push(t);
    });
    // Ouvrier témoin (gag poussière, scène 1), face au sud.
    R.witness = M.operator(iso, { x: 60, y: 540, variant: "worker", id: o.id ? o.id + "-wit" : undefined });
    return R;
  }

  window.MORDU.CAM = CAM;
  window.MORDU.chantier = chantier;
})();
