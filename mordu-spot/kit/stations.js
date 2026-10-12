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

  // Boule de caramel en volumes simples (base + dôme), centrée sur (x, y).
  function caramelBlob(parent, o) {
    const g = M.obj(parent, { x: o.x, y: o.y, z: o.z });
    M.cuboid(g, { x: -19, y: -16, z: 0, w: 38, d: 32, h: 18, mat: "caramel" });
    M.cuboid(g, { x: -12, y: -10, z: 18, w: 24, d: 20, h: 12, mat: "caramel" });
    return g;
  }

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
        '<div class="t-display" data-layout-allow-overlap style="display:block;font-size:19px;color:var(--choco)">BARRE PROTÉINÉE</div>' +
        '<div class="t-display" data-layout-allow-overlap style="display:block;font-size:15px;color:var(--choco);margin-top:4px">(STANDARD)</div></div>'
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
    R.cakeZ = M.zbox(cake, 1);
    M.barPlaco(R.cakeZ, { len: 100, d: 70, h: 60, seed: 61, shadow: false });
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


  // ---------- USINE MORDU (scènes 2 à 7, monde bordeaux) ---------------------
  // Plan de la dalle (repère monde) :
  //   wordmark au nord, console « PRÊT » au nord-ouest, S3 cacahuètes à l'ouest,
  //   S4 caramel à l'est, S5 chocolat au sud-ouest, S6 clou au sud-est,
  //   centre libre pour la barre finale.
  Object.assign(CAM, {
    factory: M.focus({ x: 40, y: 40, z: 60 }, 0.56, 0, 20),
    console: M.focus({ x: -540, y: -430, z: 130 }, 1.25, 0, 40),
    s3: M.focus({ x: -330, y: 150, z: 110 }, 1.9, 87, -28),
    s4: M.focus({ x: 460, y: -310, z: 90 }, 1.8, 190, -200),
    s5: M.focus({ x: -60, y: 690, z: 110 }, 1.55, 0, 30),
    s6: M.focus({ x: 470, y: 330, z: 80 }, 1.25, 0, 0),
    // Fin de scène 6 : serré sur la dernière porte et le panneau, le temps de lire.
    s6end: M.focus({ x: 770, y: 520, z: 60 }, 2.7, 0, 0),
  });

  function factory(iso, o) {
    o = o || {};
    const P = o.id || "f";
    const R = {};
    R.slab = M.slab(iso, { size: 1704, thick: 62, mat: "rouge", id: P + "-slab" });
    gsap.set(R.slab, { z: -60 }); // dessus à +2 : enveloppe la dalle grise sans z-fighting
    // Ombres de l'usine : toujours bordeaux, même dans une scène qui démarre en monde gris.
    const factoryShadow = function (n) {
      n.style.setProperty("--floor-shadow", "color-mix(in oklab, var(--rouge) 62%, var(--shade))");
      return n;
    };

    // ---- wordmark 3D + console à écran tactile.
    R.wordmark = M.wordmark(iso, { x: -430, y: -660, size: 200, id: P + "-wm" });
    const con = M.obj(iso, { x: -600, y: -440, id: P + "-console" });
    R.console = con;
    M.shadow(con, { w: 130, d: 90, ext: 30 });
    M.cuboid(con, { w: 130, d: 90, h: 96, mat: "rouge" });
    M.cuboid(con, { x: 10, y: 70, z: 70, w: 110, d: 24, h: 8, mat: "creme" });
    const screen = M.standee(con, { x: 10, y: 40, z: 96, w: 110, h: 76, bg: "var(--choco)" });
    const scrText = M.faceText(screen.face, "PRÊT", { size: 44, color: "var(--caramel-vif)" });
    gsap.set(scrText, { visibility: "hidden" });
    R.screen = screen;
    R.screenText = scrText;

    // ---- S3 cacahuètes : convoyeur devant l'opérateur, tri au tampon.
    const s3 = M.obj(iso, { x: -660, y: 10, id: P + "-s3" });
    R.s3 = s3;
    s3.conveyor = M.conveyor(s3, { x: 0, y: 100, len: 580, w: 92, h: 70, mat: "rouge" });
    s3.op = M.operator(s3, { x: 270, y: 46, id: P + "-op" });
    // Tampon tenu bras tendu : le poignet (grip) compense la rotation du bras
    // pour que le tampon reste vertical. Repos : bras 100°, frappe : 80°.
    s3.arm = s3.op.parts.armR;
    s3.grip = M.obj(s3.arm, { z: -104 });
    s3.stamp = M.stamp(s3.grip, { x: 0, y: 0, z: -59, text: "OK", mat: "caramel" });
    gsap.set(s3.arm, { rotationX: 100 });
    gsap.set(s3.grip, { rotationX: -100 });
    s3.items = M.obj(s3, { x: 0, y: 108, z: 75 });
    // Cacahuètes : le tampon frappe en x = 316 (local s3). Le convoyeur avance
    // par pas de 76 ; positions de départ = 316 − 76·k pour la k-ième frappe.
    s3.nuts = [];
    [240, 164, 88, 12].forEach(function (x, i) {
      const broken = i === 2;
      const n = M.flat(s3.items, { x: x - 7, y: 14, w: 62, d: 48, html: M.peanutSVG(broken) });
      n.broken = broken;
      n.mark = M.stampMark(n, { x: broken ? -24 : 3, y: 10, z: 1, ok: !broken, w: broken ? 110 : 56, d: 30 });
      gsap.set(n.mark, { scale: 0 });
      s3.nuts.push(n);
    });

    // ---- S4 caramel : table, pinces, filament, règle, voyant, poubelle.
    const s4 = M.obj(iso, { x: 250, y: -420, id: P + "-s4" });
    R.s4 = s4;
    M.shadow(s4, { w: 560, d: 180, ext: 40 });
    M.cuboid(s4, { w: 560, d: 180, h: 70, mat: "rouge" });
    M.cuboid(s4, { x: 30, y: 56, z: 70, w: 50, d: 60, h: 20, mat: "creme" }); // mâchoire fixe (basse)
    s4.pincer = M.obj(s4, { x: 124, y: 56, z: 70 }); // repos : écart de 44 pour la boule
    M.cuboid(s4.pincer, { x: 0, y: 0, z: 0, w: 50, d: 60, h: 20, mat: "creme" });
    M.cuboid(s4.pincer, { x: 16, y: 16, z: 20, w: 18, d: 28, h: 56, mat: "creme" });
    // Caramel : une boule tenue entre les mâchoires ; le fil s'étire depuis elle.
    s4.blobL = caramelBlob(s4, { x: 102, y: 86, z: 70 });
    s4.fil = M.obj(s4, { x: 102, y: 78, z: 74 });
    M.cuboid(s4.fil, { w: 288, d: 16, h: 16, mat: "caramel" });
    gsap.set(s4.fil, { scaleX: 0.001 });
    // Moitié droite après rupture : reste au bout de la pince mobile.
    s4.blobR = caramelBlob(s4, { x: 140, y: 86, z: 70 });
    gsap.set(s4.blobR, { scale: 0 });
    s4.ruler = M.ruler(s4, { x: 80, y: 140, z: 70, len: 330, step: 20 });
    const mark = M.obj(s4, { x: 378, y: 136, z: 70 });
    M.cuboid(mark, { w: 4, d: 36, h: 30, mat: "caramel-vif" });
    // Étiquette posée à plat sur la table, au niveau de la marque.
    const tag = M.flat(s4, { x: 300, y: 100, z: 70.5, w: 150, d: 34, html: '<div class="t-display" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--choco);color:var(--creme);font-size:24px">15 CM MIN.</div>' });
    s4.light = M.obj(s4, { x: 500, y: 30, z: 70 });
    M.cuboid(s4.light, { x: 6, y: 6, z: 0, w: 14, d: 14, h: 50, mat: "choco" });
    s4.bulb = M.cuboid(s4.light, { x: -9, y: -9, z: 50, w: 44, d: 44, h: 36, mat: "choco" });
    s4.bin = M.obj(s4, { x: 470, y: 192 });
    M.shadow(s4.bin, { w: 100, d: 90, ext: 30 });
    const bin = M.cuboid(s4.bin, { w: 100, d: 90, h: 86, mat: "choco" });
    M.decal(bin.faces.top, '<svg viewBox="0 0 100 90"><rect x="8" y="8" width="84" height="74" fill="var(--bracelet)"/></svg>');
    M.faceText(bin.faces.s, "MENSONGES", { size: 19, color: "var(--creme)" });

    // ---- S5 chocolat : convoyeur, rideau, panneau BRILLANT, éjecteur.
    const s5 = M.obj(iso, { x: -560, y: 700, id: P + "-s5" });
    R.s5 = s5;
    s5.conveyor = M.conveyor(s5, { x: 0, y: 0, len: 660, w: 92, h: 70, mat: "rouge" });
    M.cuboid(s5, { x: 300, y: -34, z: 0, w: 24, d: 24, h: 190, mat: "rouge" });
    M.cuboid(s5, { x: 300, y: 102, z: 0, w: 24, d: 24, h: 190, mat: "rouge" });
    M.cuboid(s5, { x: 270, y: -34, z: 190, w: 90, d: 160, h: 60, mat: "rouge" });
    s5.curtain = M.obj(s5, { x: 310, y: 4, z: 190 });
    s5.curtainZ = M.zbox(s5.curtain, 0.001);
    M.cuboid(s5.curtainZ, { x: 0, y: 0, z: -115, w: 10, d: 84, h: 115, mat: "choco" });
    s5.items = M.obj(s5, { x: 0, y: 14, z: 75 });
    s5.bars = [];
    [20, 160, 330].forEach(function (x0, i) {
      const g = M.obj(s5.items, { x: x0 });
      g.x0 = x0;
      const bare = M.cuboid(g, { w: 110, d: 60, h: 34, mat: "peau" });
      M.decal(bare.faces.top, '<svg viewBox="0 0 110 60"><rect x="0" y="0" width="110" height="60" fill="var(--caramel)"/><ellipse cx="30" cy="22" rx="9" ry="6" fill="var(--creme)"/><ellipse cx="74" cy="38" rx="8" ry="5" fill="var(--creme)"/></svg>');
      const coated = M.barMordu(g, { len: 114, d: 62, h: 36, x: -2, y: -1, shadow: false, seed: 30 + i });
      // Déjà passée sous le rideau au début de la scène ?
      const done = x0 + 57 > 315;
      gsap.set(done ? bare : coated, { visibility: "hidden" });
      g.bare = bare;
      g.coated = coated;
      s5.bars.push(g);
    });
    // Barre trop brillante (gag) : reflets crème sur l'enrobage.
    const shinyBar = s5.bars[2]; // déjà enrobée, et beaucoup trop brillante
    M.decal(shinyBar.coated.body.faces.top, '<svg viewBox="0 0 114 62"><path d="M10 52 L40 10 M30 56 L62 12 M70 54 L96 16" stroke="var(--creme)" stroke-width="6"/></svg>');
    M.decal(shinyBar.coated.body.faces.s, '<svg viewBox="0 0 114 36"><path d="M14 30 L30 6 M44 30 L60 6" stroke="var(--creme)" stroke-width="5"/></svg>');
    s5.shiny = shinyBar;
    // Éjecteur côté sud : pousse vers le nord (−y).
    s5.pusher = M.obj(s5, { x: 520, y: 92, z: 75 });
    M.cuboid(s5.pusher, { x: 0, y: 30, z: 0, w: 70, d: 40, h: 30, mat: "choco" });
    M.cuboid(s5.pusher, { x: 10, y: 0, z: 6, w: 50, d: 30, h: 18, mat: "creme" });
    const signPost = M.obj(s5, { x: 720, y: -230 });
    M.cuboid(signPost, { x: 100, y: 10, z: 0, w: 14, d: 14, h: 90, mat: "choco" });
    s5.sign = M.standee(signPost, { x: 0, y: 24, z: 90, w: 220, h: 70, bg: "var(--choco)" });
    M.faceText(s5.sign.face, "BRILLANT", { size: 42, color: "var(--caramel-vif)" });
    s5.cross = [];
    for (const rot of [17, -17]) {
      const bar = document.createElement("div");
      bar.style.cssText = "position:absolute;left:-10px;top:30px;width:240px;height:10px;background:var(--rouge-vif);transform-origin:50% 50%";
      bar.style.transform = "rotate(" + rot + "deg)";
      s5.sign.face.appendChild(bar);
      gsap.set(bar, { scaleX: 0 });
      s5.cross.push(bar);
    }

    // ---- S6 test du clou : établi, portique + marteau, portes miniatures.
    const s6 = M.obj(iso, { x: 160, y: 200, id: P + "-s6" });
    R.s6 = s6;
    M.shadow(s6, { w: 480, d: 120, ext: 40 });
    M.cuboid(s6, { w: 480, d: 120, h: 60, mat: "rouge" });
    M.cuboid(s6, { x: 200, y: -60, z: 0, w: 24, d: 24, h: 300, mat: "rouge" });
    M.cuboid(s6, { x: 200, y: -60, z: 300, w: 24, d: 150, h: 24, mat: "rouge" });
    s6.hammer = M.obj(s6, { x: 212, y: 60, z: 230 }); // marteau levé au repos
    M.cuboid(s6.hammer, { x: -8, y: -8, z: 40, w: 16, d: 16, h: 100, mat: "creme" });
    M.cuboid(s6.hammer, { x: -26, y: -20, z: 0, w: 52, d: 40, h: 40, mat: "choco" });
    s6.nail = M.obj(s6, { x: 208, y: 56, z: 96 });
    M.cuboid(s6.nail, { x: 0, y: 0, z: 0, w: 8, d: 8, h: 54, mat: "creme" });
    M.cuboid(s6.nail, { x: -5, y: -5, z: 54, w: 18, d: 18, h: 4, mat: "creme" });
    gsap.set(s6.nail, { visibility: "hidden" }); // posé par la scène 6
    // Une seule taille de barre dans toute la scène : sur l'établi = calée sous une porte.
    // Centrée sous le marteau (x 212, y 60).
    s6.BAR = { len: 60, d: 34, h: 22 };
    s6.testBar = M.obj(s6, { x: 182, y: 43, z: 60 });
    s6.placo = M.barPlaco(s6.testBar, { ...s6.BAR, seed: 70, shadow: false });
    s6.mordu = M.barMordu(s6.testBar, { ...s6.BAR, seed: 71, shadow: false });
    gsap.set(s6.mordu, { visibility: "hidden" });
    gsap.set(s6.testBar, { visibility: "hidden" }); // l'établi est vide au repos
    // 13 portes miniatures, le long de y, à l'est de l'établi.
    s6.doors = [];
    for (let i = 0; i < 13; i++) {
      const d = M.obj(s6, { x: 560, y: -120 + i * 46 });
      M.cuboid(d, { x: 0, y: 0, z: 0, w: 12, d: 6, h: 92, mat: "creme" });
      M.cuboid(d, { x: 0, y: 40, z: 0, w: 12, d: 6, h: 92, mat: "creme" });
      M.cuboid(d, { x: 0, y: 0, z: 92, w: 12, d: 46, h: 6, mat: "creme" });
      d.panel = M.obj(d, { x: 4, y: 6, z: 8 });
      M.cuboid(d.panel, { w: 4, d: 34, h: 82, mat: "caramel" });
      // Cale = une barre grise entière, posée à plat devant la porte (côté caméra).
      d.wedge = M.obj(d, { x: 14, y: 6, z: 0 });
      M.barPlaco(d.wedge, { ...s6.BAR, seed: i === 3 ? 70 : 100 + i, shadow: false });
      gsap.set(d.wedge, { scale: 0 });
      s6.doors.push(d);
    }
    const draftSign = M.obj(s6, { x: 640, y: 434 });
    M.cuboid(draftSign, { x: 30, y: 4, z: 0, w: 8, d: 8, h: 60, mat: "choco" });
    const ds = M.standee(draftSign, { x: 0, y: 12, z: 60, w: 112, h: 36, bg: "var(--creme)" });
    M.faceText(ds.face, "COURANT D'AIR", { size: 16, color: "var(--choco)" });
    s6.draftSign = draftSign;
    gsap.set(draftSign, { scale: 0 });

    [R.slab, R.wordmark, R.console, R.s3, R.s4, R.s5, R.s6].forEach(factoryShadow);
    return R;
  }
  window.MORDU.factory = factory;

  window.MORDU.CAM = CAM;
  window.MORDU.chantier = chantier;
})();
