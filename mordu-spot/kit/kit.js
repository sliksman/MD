/* ==========================================================================
   MORDU — kit partagé (chargé par index.html, visible dans chaque scène)
   Fabriques DOM déterministes : aucun hasard non seedé, aucune horloge.

   Repère monde : x vers la droite-bas de l'écran, y vers la gauche-bas,
   z vers le haut. Faces visibles : dessus, sud (+y, gauche), est (+x, droite).
   ========================================================================== */
(function () {
  "use strict";

  const RAD = Math.PI / 180;
  const ISO_X = 54.7356; // arctan(√2) : isométrie vraie
  const COS_X = Math.cos(ISO_X * RAD);
  const SIN_X = Math.sin(ISO_X * RAD);
  const C45 = Math.SQRT1_2;

  // ---------- utilitaires ---------------------------------------------------
  function el(tag, cls, parent) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  }
  function px(n) {
    return n + "px";
  }
  // PRNG seedé (mulberry32) : même graine → même décor à chaque rendu.
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Projection d'un point monde vers l'écran (avant la caméra).
  function project(x, y, z) {
    const x1 = C45 * (x - y);
    const y1 = C45 * (x + y);
    return { x: x1, y: y1 * COS_X - (z || 0) * SIN_X };
  }
  // État caméra qui centre le point monde p à l'échelle s.
  // dx/dy : décalage écran du point centré (px à l'échelle finale).
  function focus(p, s, dx, dy) {
    const q = project(p.x || 0, p.y || 0, p.z || 0);
    return { x: -s * q.x + (dx || 0), y: -s * q.y + (dy || 0), scale: s };
  }

  // ---------- scène ---------------------------------------------------------
  function stage(rootEl, opts) {
    opts = opts || {};
    const st = el("div", "stage" + (opts.gris ? " world-gris" : ""), rootEl);
    const cam = el("div", "cam", st);
    const iso = el("div", "iso", cam);
    const hud = el("div", "hud", st);
    if (opts.cam) gsap.set(cam, opts.cam);
    return { stage: st, cam: cam, iso: iso, hud: hud };
  }

  function obj(parent, o) {
    o = o || {};
    const n = el("div", "obj" + (o.cls ? " " + o.cls : ""), parent);
    if (o.id) n.id = o.id;
    gsap.set(n, { x: o.x || 0, y: o.y || 0, z: o.z || 0 });
    return n;
  }

  // ---------- cuboïde à six faces ------------------------------------------
  // Faces : b (dessous), top, s (sud, gauche écran), n, e (est, droite écran), w.
  function cuboid(parent, o) {
    const w = o.w, d = o.d, h = o.h;
    const n = obj(parent, o);
    n.classList.add("mat-" + (o.mat || "rouge"));
    const spec = [
      ["b", w, d, "translate3d(0px," + d + "px,0px) rotateX(180deg)"],
      ["top", w, d, "translate3d(0px,0px," + h + "px)"],
      ["s", w, h, "translate3d(0px," + d + "px," + h + "px) rotateX(-90deg)"],
      ["n", w, h, "translate3d(" + w + "px,0px," + h + "px) rotateZ(180deg) rotateX(-90deg)"],
      ["e", d, h, "translate3d(" + w + "px," + d + "px," + h + "px) rotateZ(-90deg) rotateX(-90deg)"],
      ["w", d, h, "translate3d(0px,0px," + h + "px) rotateZ(90deg) rotateX(-90deg)"],
    ];
    n.faces = {};
    for (const [k, fw, fh, tf] of spec) {
      const f = el("div", "face f-" + k, n);
      f.style.width = px(fw);
      f.style.height = px(fh);
      f.style.transform = tf;
      n.faces[k] = f;
    }
    n.dims = { w: w, d: d, h: h };
    return n;
  }

  // Ombre portée plate : parallélogramme au sol, débordant côté est.
  function shadow(parent, o) {
    const s = el("div", "shadow", parent);
    s.style.width = px(o.w + (o.ext == null ? 18 : o.ext));
    s.style.height = px(o.d);
    s.style.transform = "translate3d(" + px(o.x || 0) + "," + px(o.y || 0) + ",0.6px)";
    return s;
  }

  // Objet posable : racine au sol (glisse en x/y), corps en z (tombe), ombre fixe au sol.
  function prop(parent, o) {
    const root = obj(parent, { x: o.x, y: o.y, z: 0, id: o.id });
    const sh = o.noShadow ? null : shadow(root, { w: o.w, d: o.d, ext: o.ext });
    const body = obj(root, { z: o.z || 0 });
    return { root: root, body: body, shadow: sh };
  }

  // Décor : contenu HTML/SVG posé sur une face.
  function decal(face, html) {
    const d = el("div", "decal", face);
    d.innerHTML = html;
    return d;
  }
  function faceText(face, text, o) {
    o = o || {};
    const t = el("div", "face-text " + (o.text ? "t-text" : "t-display"), face);
    t.textContent = text;
    t.style.fontSize = px(o.size || 20);
    if (o.color) t.style.color = o.color;
    if (o.rotate) t.style.transform = "rotate(" + o.rotate + "deg)";
    if (o.align) t.style.justifyContent = o.align;
    if (o.pad) t.style.padding = o.pad;
    if (o.ls) t.style.letterSpacing = o.ls;
    return t;
  }

  // ---------- éléments de décor --------------------------------------------
  function slab(parent, o) {
    o = o || {};
    const s = o.size || 1200;
    const t = o.thick || 60;
    return cuboid(parent, {
      x: -s / 2 + (o.x || 0),
      y: -s / 2 + (o.y || 0),
      z: -t,
      w: s,
      d: o.depth || s,
      h: t,
      mat: o.mat || "rouge",
      id: o.id,
    });
  }

  // Cacahuète vue de dessus (SVG), couleurs de la palette.
  function peanutSVG(broken) {
    const body = broken
      ? '<path d="M6 14 C6 6 16 4 20 10 L24 8 L22 14 L27 13 C30 20 22 26 16 22 C10 26 6 20 6 14Z" fill="var(--peau)" stroke="var(--caramel)" stroke-width="1.6"/>'
      : '<path d="M4 15 C4 7 13 5 17 10 C21 5 34 6 34 15 C34 24 21 25 17 20 C13 25 4 23 4 15Z" fill="var(--peau)" stroke="var(--caramel)" stroke-width="1.6"/>' +
        '<path d="M11 12 L12 13 M24 11 L25 12 M27 17 L28 18 M9 18 L10 19" stroke="var(--caramel)" stroke-width="1.2"/>';
    return '<svg viewBox="0 0 38 30">' + body + "</svg>";
  }
  // Pièce plate posée à plat (sur un convoyeur, au sol).
  function flat(parent, o) {
    const n = obj(parent, o);
    const f = el("div", "face f-top flat", n);
    f.style.width = px(o.w);
    f.style.height = px(o.d);
    f.style.background = "transparent";
    if (o.html) decal(f, o.html);
    n.face = f;
    return n;
  }
  // Panneau debout (face au sud), pour écrans, étiquettes, filaments.
  function standee(parent, o) {
    const n = obj(parent, o);
    const f = el("div", "face standee", n);
    f.style.width = px(o.w);
    f.style.height = px(o.h);
    f.style.background = o.bg || "transparent";
    f.style.transform = "translate3d(0px,0px," + px(o.h) + ") rotateX(-90deg)";
    if (o.html) decal(f, o.html);
    n.face = f;
    return n;
  }

  // ---------- barres --------------------------------------------------------
  function barMordu(parent, o) {
    o = o || {};
    const L = o.len || 200, D = o.d || 64, H = o.h || 44;
    const g = obj(parent, { x: o.x, y: o.y, z: o.z, id: o.id });
    if (o.shadow !== false && !o.z) shadow(g, { w: L, d: D, ext: 16 });
    if (o.wrapped) {
      const b = cuboid(g, { w: L, d: D, h: H, mat: "rouge" });
      faceText(b.faces.top, "MORDU", { size: Math.round(D * 0.7), ls: "0.02em" });
      const side = faceText(b.faces.s, "CARAMEL CACAHUÈTE", { text: true, size: Math.round(H * 0.24), ls: "0.14em" });
      side.style.fontWeight = "600";
      decal(
        b.faces.top,
        '<svg viewBox="0 0 ' + L + " " + D + '"><circle cx="' + (L - 22) + '" cy="' + (D - 16) + '" r="11" fill="var(--creme)"/>' +
          '<text x="' + (L - 22) + '" y="' + (D - 12.5) + '" text-anchor="middle" font-family="Anton" font-size="10" fill="var(--rouge)">20g</text></svg>'
      );
      // Soudures crantées aux extrémités.
      for (const sx of [-14, L]) {
        const seal = cuboid(g, { x: sx, y: -3, z: H * 0.18, w: 14, d: D + 6, h: H * 0.64, mat: "rouge" });
        decal(
          seal.faces.top,
          '<svg viewBox="0 0 14 ' + (D + 6) + '" preserveAspectRatio="none"><path d="M4 0V' + (D + 6) + "M8 0V" + (D + 6) + "M12 0V" + (D + 6) + '" stroke="var(--rouge-vif)" stroke-width="1.2"/></svg>'
        );
      }
      g.body = b;
      return g;
    }
    const b = cuboid(g, { w: L, d: D, h: H, mat: "choco" });
    // Relief mat discret sur le dessus (positions seedées).
    const r = rng(o.seed || 7);
    let bumps = "";
    for (let i = 0; i < 10; i++) {
      bumps += '<ellipse cx="' + (10 + r() * (L - 20)).toFixed(1) + '" cy="' + (8 + r() * (D - 16)).toFixed(1) + '" rx="5" ry="3" fill="var(--l)"/>';
    }
    decal(b.faces.top, '<svg viewBox="0 0 ' + L + " " + D + '">' + bumps + "</svg>");
    if (o.cut) {
      // Coupe sur la face est : enrobage, nougatine crème, caramel, cacahuètes entières.
      decal(
        b.faces.e,
        '<svg viewBox="0 0 ' + D + " " + H + '" preserveAspectRatio="none">' +
          '<rect x="4" y="4" width="' + (D - 8) + '" height="' + (H - 8) + '" fill="var(--peau)"/>' +
          '<rect x="4" y="4" width="' + (D - 8) + '" height="' + (H * 0.42) + '" fill="var(--caramel)"/>' +
          '<path d="M' + D * 0.12 + " " + H * 0.34 + " q" + D * 0.1 + " -" + H * 0.22 + " " + D * 0.24 + " -" + H * 0.04 + " q" + D * 0.06 + " " + H * 0.14 + " -" + D * 0.06 + " " + H * 0.2 + ' z" fill="var(--creme)"/>' +
          '<ellipse cx="' + D * 0.66 + '" cy="' + H * 0.26 + '" rx="' + D * 0.13 + '" ry="' + H * 0.1 + '" fill="var(--creme)" transform="rotate(-18 ' + D * 0.66 + " " + H * 0.26 + ')"/>' +
          '<ellipse cx="' + D * 0.83 + '" cy="' + H * 0.42 + '" rx="' + D * 0.05 + '" ry="' + H * 0.05 + '" fill="var(--creme)"/>' +
          '<rect x="4" y="' + H * 0.48 + '" width="' + (D - 8) + '" height="1.5" fill="var(--caramel)"/>' +
          "</svg>"
      );
    }
    g.body = b;
    return g;
  }

  function barPlaco(parent, o) {
    o = o || {};
    const L = o.len || 200, D = o.d || 64, H = o.h || 44;
    const g = obj(parent, { x: o.x, y: o.y, z: o.z, id: o.id });
    if (o.shadow !== false && !o.z) shadow(g, { w: L, d: D, ext: 16 });
    const b = cuboid(g, { w: L, d: D, h: H, mat: "gris" });
    const r = rng(o.seed || 3);
    const dots = function (W, Hh, n) {
      let s = "";
      for (let i = 0; i < n; i++) {
        s += '<circle cx="' + (r() * W).toFixed(1) + '" cy="' + (r() * Hh).toFixed(1) + '" r="' + (1 + r() * 1.4).toFixed(2) + '" fill="var(--r)"/>';
      }
      return '<svg viewBox="0 0 ' + W + " " + Hh + '">' + s + "</svg>";
    };
    decal(b.faces.top, dots(L, D, 26));
    decal(b.faces.s, dots(L, H, 16));
    decal(b.faces.e, dots(D, H, 6));
    g.body = b;
    return g;
  }

  // ---------- l'opérateur ---------------------------------------------------
  // Style « jouet » : peu de blocs, grands, silhouette nette. Face au sud.
  // Origine : centre des pieds. Hauteur ≈ 270. Aucun volume ne s'interpénètre
  // (les contacts se font face contre face) pour un tri de profondeur propre.
  function operator(parent, o) {
    o = o || {};
    const g = obj(parent, { x: o.x, y: o.y, z: o.z, id: o.id });
    const parts = {};
    const worker = o.variant === "worker";
    const m = function (name) {
      return o.paint || name;
    };
    shadow(g, { x: -54, y: -30, w: 108, d: 60, ext: 44 });
    // Chaussures, jambes.
    cuboid(g, { x: -46, y: -18, z: 0, w: 40, d: 48, h: 14, mat: m("bracelet") });
    cuboid(g, { x: 6, y: -18, z: 0, w: 40, d: 48, h: 14, mat: m("bracelet") });
    cuboid(g, { x: -43, y: -16, z: 14, w: 34, d: 32, h: 50, mat: m("choco") });
    cuboid(g, { x: 9, y: -16, z: 14, w: 34, d: 32, h: 50, mat: m("choco") });
    // Torse large.
    parts.torso = cuboid(g, { x: -54, y: -30, z: 64, w: 108, d: 60, h: 92, mat: m("tshirt") });
    // Bras : pivot à l'épaule (rotationX / rotationY pour tamponner, pointer).
    function arm(side) {
      const pivot = obj(g, { x: side * 69, y: 0, z: 152 });
      cuboid(pivot, { x: -15, y: -17, z: -44, w: 30, d: 34, h: 44, mat: m("tshirt") });
      cuboid(pivot, { x: -12, y: -14, z: -104, w: 24, d: 28, h: 60, mat: m("peau") });
      cuboid(pivot, { x: -13, y: -15, z: -92, w: 26, d: 30, h: 9, mat: m("bracelet") });
      cuboid(pivot, { x: -13, y: -15, z: -79, w: 26, d: 30, h: 4, mat: m("bracelet") });
      return pivot;
    }
    parts.armL = arm(-1);
    parts.armR = arm(1);
    // Tête : grosse, comme un jouet.
    const head = obj(g, { z: 156 });
    parts.head = head;
    const skull = cuboid(head, { x: -42, y: -42, z: 0, w: 84, d: 84, h: 84, mat: m("peau") });
    if (worker) {
      decal(
        skull.faces.s,
        '<svg viewBox="0 0 84 84">' +
          '<rect x="18" y="30" width="16" height="4" fill="var(--choco)"/><rect x="50" y="30" width="16" height="4" fill="var(--choco)"/>' +
          '<circle cx="26" cy="41" r="3.2" fill="var(--choco)"/><circle cx="58" cy="41" r="3.2" fill="var(--choco)"/>' +
          '<rect x="30" y="66" width="24" height="3" fill="var(--choco)"/></svg>'
      );
      cuboid(head, { x: -6, y: 42, z: 30, w: 12, d: 7, h: 15, mat: m("peau") });
      // Nuque : cheveux courts (vus de dos sur le chantier).
      cuboid(head, { x: -42, y: -48, z: 26, w: 84, d: 6, h: 58, mat: m("choco") });
      // Casque de chantier.
      cuboid(head, { x: -46, y: -46, z: 84, w: 92, d: 92, h: 26, mat: m(o.helmet || "caramel") });
      cuboid(head, { x: -46, y: 46, z: 84, w: 92, d: 16, h: 6, mat: m(o.helmet || "caramel") });
      cuboid(head, { x: -14, y: -40, z: 110, w: 28, d: 80, h: 6, mat: m(o.helmet || "caramel") });
    } else {
      decal(
        skull.faces.s,
        '<svg viewBox="0 0 84 84">' +
          '<rect x="14" y="22" width="22" height="5" fill="var(--roux)"/>' +
          '<rect x="48" y="22" width="22" height="5" fill="var(--roux)"/>' +
          '<circle cx="25" cy="37" r="3.2" fill="var(--choco)"/>' +
          '<circle cx="59" cy="37" r="3.2" fill="var(--choco)"/>' +
          '<circle cx="25" cy="37" r="12.5" fill="none" stroke="var(--or)" stroke-width="2.2"/>' +
          '<circle cx="59" cy="37" r="12.5" fill="none" stroke="var(--or)" stroke-width="2.2"/>' +
          '<path d="M37.5 36 Q42 32.5 46.5 36" fill="none" stroke="var(--or)" stroke-width="2"/>' +
          '<path d="M12.5 35 L0 33" stroke="var(--or)" stroke-width="2"/><path d="M71.5 35 L84 33" stroke="var(--or)" stroke-width="2"/>' +
          "</svg>"
      );
      decal(skull.faces.e, '<svg viewBox="0 0 84 84"><path d="M0 33 L56 31" stroke="var(--or)" stroke-width="2"/></svg>');
      // Nez, moustache, barbe en deux gradins, favoris.
      cuboid(head, { x: -6, y: 42, z: 30, w: 12, d: 7, h: 15, mat: m("peau") });
      cuboid(head, { x: -26, y: 42, z: 22, w: 52, d: 7, h: 8, mat: m("roux") });
      cuboid(head, { x: -43, y: 42, z: -6, w: 86, d: 12, h: 28, mat: m("roux") });
      cuboid(head, { x: -31, y: 30, z: -26, w: 62, d: 28, h: 20, mat: m("roux") });
      cuboid(head, { x: 42, y: 0, z: 10, w: 6, d: 42, h: 40, mat: m("roux") });
      cuboid(head, { x: -48, y: 0, z: 10, w: 6, d: 42, h: 40, mat: m("roux") });
      // Tignasse : calotte, arrière, côtés, frange balayée, deux mèches pivotées.
      cuboid(head, { x: -48, y: -50, z: 84, w: 96, d: 92, h: 24, mat: m("roux") });
      cuboid(head, { x: -48, y: -52, z: 22, w: 96, d: 10, h: 62, mat: m("roux") });
      cuboid(head, { x: 42, y: -42, z: 44, w: 8, d: 42, h: 40, mat: m("roux") });
      cuboid(head, { x: -50, y: -42, z: 44, w: 8, d: 42, h: 40, mat: m("roux") });
      cuboid(head, { x: -46, y: 42, z: 70, w: 64, d: 5, h: 14, mat: m("roux") });
      const tuftA = cuboid(head, { x: -40, y: -34, z: 108, w: 50, d: 46, h: 18, mat: m("roux") });
      gsap.set(tuftA, { rotationZ: 12 });
      const tuftB = cuboid(head, { x: 6, y: -6, z: 108, w: 38, d: 40, h: 13, mat: m("roux") });
      gsap.set(tuftB, { rotationZ: -14 });
    }
    g.parts = parts;
    return g;
  }

  // ---------- machines ------------------------------------------------------
  function conveyor(parent, o) {
    o = o || {};
    const L = o.len || 600, W = o.w || 90, H = o.h || 70, mat = o.mat || "rouge";
    const g = obj(parent, { x: o.x, y: o.y, z: o.z, id: o.id });
    shadow(g, { w: L, d: W, ext: 24 });
    const frame = cuboid(g, { w: L, d: W, h: H, mat: mat });
    let rollers = "";
    for (let i = 20; i < L; i += 40) rollers += '<circle cx="' + i + '" cy="' + (H * 0.3) + '" r="6" fill="var(--r)"/>';
    decal(frame.faces.s, '<svg viewBox="0 0 ' + L + " " + H + '">' + rollers + "</svg>");
    const belt = cuboid(g, { x: 0, y: 6, z: H, w: L, d: W - 12, h: 5, mat: "choco" });
    belt.faces.top.style.overflow = "hidden";
    const stripes = el("div", "belt-stripes", belt.faces.top);
    stripes.style.position = "absolute";
    stripes.style.left = "0";
    stripes.style.top = "0";
    stripes.style.width = px(L + 60);
    stripes.style.height = "100%";
    let s = "";
    for (let i = 0; i < L + 60; i += 30) s += '<rect x="' + i + '" y="0" width="3" height="' + (W - 12) + '" fill="var(--l)"/>';
    stripes.innerHTML = '<svg viewBox="0 0 ' + (L + 60) + " " + (W - 12) + '" style="display:block;width:100%;height:100%">' + s + "</svg>";
    g.belt = belt;
    g.stripes = stripes; // tween x de 0 à -30 (× n) pour faire défiler
    g.top = H + 5;
    return g;
  }

  function stamp(parent, o) {
    o = o || {};
    const g = obj(parent, { x: o.x, y: o.y, z: o.z, id: o.id });
    const base = cuboid(g, { x: -32, y: -22, z: 0, w: 64, d: 44, h: 16, mat: "choco" });
    cuboid(g, { x: -9, y: -9, z: 16, w: 18, d: 18, h: 38, mat: "creme" });
    cuboid(g, { x: -15, y: -15, z: 54, w: 30, d: 30, h: 14, mat: o.mat || "caramel" });
    faceText(base.faces.s, o.text || "OK", { size: 12, color: "var(--creme)" });
    return g;
  }
  // Empreinte de tampon, à poser à plat.
  function stampMark(parent, o) {
    const ok = o.ok !== false;
    const color = ok ? "var(--caramel-vif)" : "var(--rouge-vif)";
    const w = o.w || (ok ? 60 : 120), d = o.d || 34;
    return flat(parent, {
      x: o.x, y: o.y, z: o.z, w: w, d: d, id: o.id,
      html:
        '<div class="t-display" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;border:3px solid ' + color +
        ";color:" + color + ";font-size:" + Math.round(d * 0.62) + 'px;box-sizing:border-box">' + (o.text || (ok ? "OK" : "REFUSÉE")) + "</div>",
    });
  }

  function ruler(parent, o) {
    o = o || {};
    const L = o.len || 400;
    const g = obj(parent, { x: o.x, y: o.y, z: o.z, id: o.id });
    shadow(g, { w: L, d: 28, ext: 8 });
    const r = cuboid(g, { w: L, d: 28, h: 8, mat: "creme" });
    let t = "";
    const step = o.step || 20;
    for (let i = 0, k = 0; i <= L; i += step, k++) {
      t += '<rect x="' + Math.min(i, L - 2) + '" y="0" width="2" height="' + (k % 5 === 0 ? 16 : 8) + '" fill="var(--choco)"/>';
    }
    decal(r.faces.top, '<svg viewBox="0 0 ' + L + ' 28">' + t + "</svg>");
    g.body = r;
    return g;
  }

  // ---------- wordmark 3D debout -------------------------------------------
  // Lettres extrudées (couches empilées vers le nord), charnière au sol pour
  // se dresser une à une (rotationX 90 → 0 sur letters[i]).
  const ANTON_W = { M: 0.6, O: 0.5, R: 0.5, D: 0.5, U: 0.5 };
  function wordmark(parent, o) {
    o = o || {};
    const size = o.size || 220;
    const depth = o.depth || 30;
    const step = 2;
    const text = o.text || "MORDU";
    const gap = o.gap == null ? size * 0.05 : o.gap;
    let total = 0;
    const widths = [];
    for (const ch of text) {
      const w = (ANTON_W[ch] || 0.5) * size;
      widths.push(w);
      total += w + gap;
    }
    total -= gap;
    const g = obj(parent, { x: (o.x || 0) - total / 2, y: o.y, z: o.z, id: o.id, cls: "mat-creme" });
    g.letters = [];
    let cx = 0;
    [...text].forEach(function (ch, i) {
      const hinge = obj(g, { x: cx });
      const n = Math.round(depth / step);
      for (let k = n; k >= 0; k--) {
        const layer = el("div", "face t-display wm-layer", hinge);
        layer.textContent = ch;
        layer.style.width = px(widths[i]);
        layer.style.height = px(size);
        layer.style.fontSize = px(size * 1.0);
        layer.style.lineHeight = px(size * 1.12);
        layer.style.textAlign = "center";
        layer.style.background = "transparent";
        layer.style.backfaceVisibility = "visible";
        layer.style.color = k === 0 ? "var(--creme)" : "var(--l)";
        layer.style.transform = "translate3d(0px," + px(-k * step) + "," + px(size) + ") rotateX(-90deg)";
      }
      g.letters.push(hinge);
      cx += widths[i] + gap;
    });
    g.width = total;
    return g;
  }

  // ---------- HUD 2D --------------------------------------------------------
  function badge(hud, num, label, id) {
    const b = el("div", "badge", hud);
    if (id) b.id = id;
    const n = el("span", "t-display num", b);
    n.textContent = num;
    const l = el("span", "t-display lbl", b);
    l.textContent = label;
    b.num = n;
    b.lbl = l;
    return b;
  }

  // Label 2D : entre par bloc (glissement masqué), jamais en fondu.
  // tl.fromTo(l.inner, {yPercent: 110}, {yPercent: 0}) pour entrer, -110 pour sortir.
  function hudLabel(hud, text, o) {
    o = o || {};
    const wrap = el("div", "hud-label", hud);
    if (o.id) wrap.id = o.id;
    if (o.top != null) wrap.style.top = px(o.top);
    if (o.align) wrap.style.justifyContent = o.align;
    const size = o.size || 150;
    wrap.style.height = px(Math.round(size * 1.28));
    const inner = el("span", "t-display hud-label-inner", wrap);
    inner.textContent = text;
    inner.style.fontSize = px(size);
    inner.style.lineHeight = px(Math.round(size * 1.28));
    if (o.color) inner.style.color = o.color;
    if (o.band) inner.classList.add("band");
    gsap.set(inner, { yPercent: 110 });
    return { wrap: wrap, inner: inner };
  }
  function labelIn(tl, l, t, d) {
    tl.fromTo(l.inner, { yPercent: 110 }, { yPercent: 0, duration: d || 0.32, ease: "power3.out" }, t);
  }
  function labelOut(tl, l, t, d) {
    tl.to(l.inner, { yPercent: -110, duration: d || 0.2, ease: "power2.in" }, t);
  }

  // ---------- sous-titres ---------------------------------------------------
  // lines : [{start, end, words:[{w, t}] }] en temps de la composition.
  // Groupes déjà découpés par sync.mjs ; un seul groupe visible à la fois.
  function subtitles(rootEl, groups, tl) {
    const wrap = el("div", "subs", rootEl);
    groups.forEach(function (gr, gi) {
      const band = el("div", "subs-group", wrap);
      band.id = "sub-g" + gi;
      gsap.set(band, { autoAlpha: 0 });
      const line = el("div", "subs-line t-text", band);
      const spans = gr.words.map(function (wd) {
        const s = el("span", "subs-word", line);
        s.textContent = wd.w;
        return s;
      });
      tl.set(band, { autoAlpha: 1 }, gr.start);
      gr.words.forEach(function (wd, wi) {
        tl.fromTo(spans[wi], { opacity: 0.42 }, { opacity: 1, duration: 0.08, ease: "none" }, wd.t);
      });
      tl.set(band, { autoAlpha: 0 }, gr.end);
    });
    return wrap;
  }

  window.MORDU = {
    rng: rng,
    project: project,
    focus: focus,
    stage: stage,
    obj: obj,
    cuboid: cuboid,
    shadow: shadow,
    prop: prop,
    decal: decal,
    faceText: faceText,
    slab: slab,
    flat: flat,
    standee: standee,
    peanutSVG: peanutSVG,
    barMordu: barMordu,
    barPlaco: barPlaco,
    operator: operator,
    conveyor: conveyor,
    stamp: stamp,
    stampMark: stampMark,
    ruler: ruler,
    wordmark: wordmark,
    badge: badge,
    hudLabel: hudLabel,
    labelIn: labelIn,
    labelOut: labelOut,
    subtitles: subtitles,
    T: function () {
      return window.MORDU_TIMELINE;
    },
  };
})();
