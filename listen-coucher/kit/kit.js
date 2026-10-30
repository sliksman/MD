/* Listen — Nuits blanches ép. 3 — kit partagé.
   Dessin 2D « fausse 3D » (SVG 1080×1920) repris de la planche storyboard v2 validée,
   + petits helpers d'animation seek-safe. Lu par toutes les scènes : window.LS. */
(function () {
  const C = {
    night0: "#121633", night1: "#1d2350", fog: "#8fa3d9",
    amber: "#F5B85A", amberDark: "#d9963c", cream: "#F1EDE4", skin: "#d9b08c", skinDark: "#b48a68",
    duvet: "#3d4c96", duvetDark: "#2c3878", duvetEdge: "#5868b0", wood: "#4a3a5c", woodDark: "#352a45",
    cyan: "#3BD6F5", violet: "#7B5CFF", magenta: "#E04FD8", rain: "#9cc8ff", ink: "#1a1a2a",
  };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const T = () => window.LS_TIMELINE;

  // ---------------------------------------------------------------- temps
  // Temps absolu d'un mot : LS.w("L19", 2). Temps local d'une scène : LS.scene("s08").at(abs).
  function w(lineId, idx) {
    const l = T().vo[lineId];
    if (!l) throw new Error("réplique inconnue " + lineId);
    if (idx === "end") return l.end;
    if (idx < 0) idx = l.timed.length + idx;
    return l.timed[idx].t;
  }
  function scene(id) {
    const s = T().scenes[id];
    return Object.assign({}, s, {
      at: (abs) => Math.max(0, Math.round((abs - s.hostStart) * 1000) / 1000),
      w: (lineId, idx) => Math.max(0, Math.round((w(lineId, idx) - s.hostStart) * 1000) / 1000),
    });
  }

  // ---------------------------------------------------------------- defs
  function defs(P) {
    return `<defs>
  <radialGradient id="${P}gVig" cx="50%" cy="45%" r="75%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
  <linearGradient id="${P}gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2150"/><stop offset="1" stop-color="#0f1230"/></linearGradient>
  <radialGradient id="${P}gNight" cx="50%" cy="42%" r="75%"><stop offset="0" stop-color="${C.night1}"/><stop offset="1" stop-color="${C.night0}"/></radialGradient>
  <radialGradient id="${P}gFog" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${C.fog}" stop-opacity=".22"/><stop offset="1" stop-color="${C.fog}" stop-opacity="0"/></radialGradient>
  <radialGradient id="${P}gHalo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#cfe2ff" stop-opacity=".62"/><stop offset=".45" stop-color="#8fb8ff" stop-opacity=".26"/><stop offset="1" stop-color="#8fb8ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="${P}gWarm" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd28a" stop-opacity=".5"/><stop offset="1" stop-color="#ffd28a" stop-opacity="0"/></radialGradient>
  <radialGradient id="${P}gLamp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffcf86" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf86" stop-opacity="0"/></radialGradient>
  <radialGradient id="${P}gNeonGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${C.violet}" stop-opacity=".45"/><stop offset="1" stop-color="${C.violet}" stop-opacity="0"/></radialGradient>
  <linearGradient id="${P}gDuvet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.duvet}"/><stop offset="1" stop-color="${C.duvetDark}"/></linearGradient>
  <linearGradient id="${P}gWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.wood}"/><stop offset="1" stop-color="${C.woodDark}"/></linearGradient>
  <radialGradient id="${P}gPillow" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#f4f0e8"/><stop offset="1" stop-color="#c9c2b6"/></radialGradient>
  <radialGradient id="${P}gSkin" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#e8c4a2"/><stop offset="1" stop-color="${C.skinDark}"/></radialGradient>
  <linearGradient id="${P}gCool" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fb2ff" stop-opacity=".55"/><stop offset="1" stop-color="#7fb2ff" stop-opacity="0"/></linearGradient>
  <linearGradient id="${P}gNeon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.cyan}"/><stop offset=".5" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.magenta}"/></linearGradient>
  <linearGradient id="${P}gCard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a7fb8"/><stop offset="1" stop-color="#1d4f86"/></linearGradient>
  <pattern id="${P}pHatch" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="#3a3352"/><line x1="0" y1="0" x2="0" y2="18" stroke="#5a5078" stroke-width="6"/></pattern>
  <filter id="${P}fGlowS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="${P}fGlowA" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="${P}fGlowN" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="${P}fBlurL" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="${P}fShadow" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity=".55"/></filter>
  <filter id="${P}fGrain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter>
</defs>`;
  }

  // ---------------------------------------------------------------- art (lié à un préfixe d'ids)
  function art(P) {
    const u = (id) => `url(#${P}${id})`;
    const A = {};
    A.u = u;
    A.id = (name) => P + name;

    A.bg = () => `<rect width="1080" height="1920" fill="${u("gNight")}"/><ellipse cx="540" cy="900" rx="760" ry="900" fill="${u("gFog")}" opacity=".55"/>`;
    A.floorTop = () => {
      let l = `<rect x="-200" y="-200" width="1480" height="2320" fill="#171b40"/>`;
      for (let i = -2; i < 11; i++) l += `<rect x="${i * 120}" y="-200" width="118" height="2320" fill="${Math.abs(i) % 2 ? "#1a1f47" : "#181c42"}"/>`;
      for (let i = -2; i < 11; i++) for (let j = 0; j < 7; j++) { const y = ((j * 380 + (i + 2) * 170) % 2300) - 200; l += `<line x1="${i * 120}" y1="${y}" x2="${i * 120 + 118}" y2="${y}" stroke="#0f1232" stroke-width="3"/>`; }
      return l + `<ellipse cx="540" cy="900" rx="700" ry="900" fill="${u("gFog")}" opacity=".5"/>`;
    };
    A.vignette = () => `<rect width="1080" height="1920" fill="${u("gVig")}"/>`;
    A.floorIso = (y0 = 1150) => {
      let l = `<path d="M-200 ${y0} H1280 V2200 H-200 Z" fill="${u("gFloor")}"/>`;
      for (let i = -8; i < 16; i++) l += `<line x1="${540 + i * 90}" y1="${y0}" x2="${540 + i * 260}" y2="2200" stroke="#0f1232" stroke-width="3" opacity=".7"/>`;
      return l + `<ellipse cx="520" cy="${y0 + 330}" rx="440" ry="120" fill="#2b2f63" opacity=".55"/>`;
    };
    A.grain = () => `<rect width="1080" height="1920" filter="${u("fGrain")}" opacity=".06" pointer-events="none"/>`;

    // pastille Catcharium : trait + point d'ancrage + bulle. Groupes nommés pour l'animation.
    A.pill = (name, x, y, text, ax, ay, o = {}) => {
      const size = o.size || 40, dot = o.dot || "#fff";
      const wdt = o.w || text.length * size * 0.56 + size * 1.3, h = size * 1.75;
      const lx = x - wdt / 2, ly = y - h / 2;
      let line = "";
      if (ax !== undefined) {
        const sx = ax < lx ? lx : ax > lx + wdt ? lx + wdt : ax;
        const sy = ax >= lx && ax <= lx + wdt ? (ay < ly ? ly : ly + h) : y;
        line = `<line id="${P}${name}-ln" x1="${sx}" y1="${sy}" x2="${ax}" y2="${ay}" stroke="#fff" stroke-opacity=".8" stroke-width="3"/>
        <circle id="${P}${name}-dot" cx="${ax}" cy="${ay}" r="11" fill="${dot}" filter="${u("fGlowS")}"/>`;
      }
      return `<g id="${P}${name}">${line}<g id="${P}${name}-b"><rect x="${lx}" y="${ly}" width="${wdt}" height="${h}" rx="${h / 2}" fill="#14162a" fill-opacity=".84" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
      <text x="${x}" y="${y + size * 0.36}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="${size}" fill="${C.cream}">${esc(text)}</text>${o.extra || ""}</g></g>`;
    };

    const fmt = (main) => main.split(/(\*[^*]+\*)/).filter(Boolean).map((p) =>
      p.startsWith("*") ? `<tspan fill="${C.amber}">${esc(p.slice(1, -1))}</tspan>` : esc(p)).join("");
    // titre : surtitre capitales espacées + serif italique (1 ou 2 lignes). Chaque ligne est animable.
    A.title = (name, over, lines, y = 300, o = {}) => {
      const size = o.size || 96, x = o.x || 500;
      let s = `<g id="${P}${name}">`;
      if (over) s += `<text id="${P}${name}-over" x="${x}" y="${y - (lines.length > 1 ? 120 : 110)}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="27" letter-spacing="8" fill="${C.cream}" fill-opacity=".85">${esc(over)}</text>`;
      lines.forEach((ln, i) => {
        s += `<text id="${P}${name}-l${i}" x="${x}" y="${y + i * (size * 1.08)}" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="${size}" fill="${C.cream}" filter="${u("fShadow")}">${fmt(ln)}</text>`;
      });
      return s + `</g>`;
    };
    A.bigNum = (name, n, label, x = 150, y = 330) => `<g id="${P}${name}">
      <circle id="${P}${name}-seed" cx="${x + 65}" cy="${y - 90}" r="22" fill="${C.amber}" filter="${u("fGlowS")}"/>
      <circle id="${P}${name}-ring" cx="${x + 65}" cy="${y - 90}" r="60" fill="none" stroke="${C.amber}" stroke-width="10" opacity="0"/>
      <text id="${P}${name}-n" x="${x}" y="${y}" font-family="Fraunces" font-style="italic" font-weight="700" font-size="230" fill="${C.amber}" filter="${u("fShadow")}">${n}</text>
      <text id="${P}${name}-over" x="${x + 150}" y="${y - 120}" font-family="Nunito" font-weight="800" font-size="27" letter-spacing="8" fill="${C.cream}" fill-opacity=".85">ASTUCE ${n}</text>
      <text id="${P}${name}-lab" x="${x + 150}" y="${y - 50}" font-family="Fraunces" font-style="italic" font-weight="500" font-size="62" fill="${C.cream}">${esc(label)}</text></g>`;

    // points lumineux le long d'une polyligne ; chaque point est un <circle class="dot">
    A.dots = (name, pts, o = {}) => {
      const step = o.step || 34, r = o.r || 8, color = o.color || "#fff", op = o.opacity ?? 1;
      let out = "", acc = 0, i = 0;
      for (let k = 0; k < pts.length - 1; k++) {
        const [x1, y1] = pts[k], [x2, y2] = pts[k + 1];
        const len = Math.hypot(x2 - x1, y2 - y1) || 1;
        while (acc <= len) {
          const t = acc / len;
          if (!(o.gapEvery && i % o.gapEvery >= o.gapEvery - 2))
            out += `<circle class="dot" cx="${(x1 + (x2 - x1) * t).toFixed(1)}" cy="${(y1 + (y2 - y1) * t).toFixed(1)}" r="${r}" fill="${color}"/>`;
          acc += step; i++;
        }
        acc -= len;
      }
      return `<g id="${P}${name}" opacity="${op}" filter="${u(o.glow || "fGlowS")}">${out}</g>`;
    };
    A.arc = (cx, cy, rad, a0, a1, n = 40) => { const p = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; p.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]); } return p; };
    A.ell = (cx, cy, rx, ry, a0 = 0, a1 = 360, n = 90) => { const p = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return p; };

    // yeux : groupe ouvert (blancs + pupilles) + paupières (rect couleur peau, scaleY 0 → 1 pour fermer)
    A.eyes = (name, x1, x2, y, r = 11) => `<g id="${P}${name}">
      <g id="${P}${name}-open"><circle cx="${x1}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x2}" cy="${y}" r="${r}" fill="#fff"/>
      <g id="${P}${name}-pup"><circle cx="${x1 + 1}" cy="${y + 2}" r="${r * 0.46}" fill="${C.ink}"/><circle cx="${x2 + 1}" cy="${y + 2}" r="${r * 0.46}" fill="${C.ink}"/></g></g>
      <rect id="${P}${name}-lidL" x="${x1 - r - 3}" y="${y - r - 3}" width="${2 * r + 6}" height="${2 * r + 6}" fill="#dcb391"/>
      <rect id="${P}${name}-lidR" x="${x2 - r - 3}" y="${y - r - 3}" width="${2 * r + 6}" height="${2 * r + 6}" fill="#dcb391"/>
      <g id="${P}${name}-shut" opacity="0"><path d="M${x1 - r} ${y} q${r} ${r * 0.8} ${2 * r} 0 M${x2 - r} ${y} q${r} ${r * 0.8} ${2 * r} 0" stroke="#5b4636" stroke-width="${r * 0.45}" fill="none" stroke-linecap="round"/></g></g>`;

    // téléphone posé (vue du dessus) : écran noir + calque néon (opacity 0 → 1)
    A.phoneTop = (name, x, y, wdt = 70, hgt = 128) => `<g id="${P}${name}">
      <rect x="${x}" y="${y}" width="${wdt}" height="${hgt}" rx="14" fill="#0b0d1a" stroke="#fff" stroke-opacity=".18" stroke-width="3"/>
      <g id="${P}${name}-on" opacity="0"><ellipse cx="${x + wdt / 2}" cy="${y + hgt / 2}" rx="${wdt * 1.6}" ry="${hgt * 1.1}" fill="${u("gNeonGlow")}"/>
      <rect x="${x}" y="${y}" width="${wdt}" height="${hgt}" rx="14" fill="#0b0d1a" stroke="${u("gNeon")}" stroke-width="5" filter="${u("fGlowN")}"/>
      <circle cx="${x + wdt / 2}" cy="${y + hgt / 2}" r="${wdt * 0.28}" fill="none" stroke="${u("gNeon")}" stroke-width="6"/></g></g>`;

    // réveil : plusieurs affichages superposés, un seul visible
    A.clock = (name, x, y, times, size = 22, wdt = 58, hgt = 34, color = C.amber) => `<g id="${P}${name}"><rect x="${x}" y="${y}" width="${wdt}" height="${hgt}" rx="8" fill="#1a1b30"/>
      ${times.map((tm, i) => `<text id="${P}${name}-${i}" x="${x + wdt / 2}" y="${y + hgt * 0.76}" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${size}" fill="${color}" opacity="${i ? 0 : 1}">${tm}</text>`).join("")}</g>`;

    // lit vu du dessus (repère : coin haut-gauche du lit à x-40,y-40)
    A.bedTop = (o = {}) => {
      const x = 400, y = 640;
      return `<g id="${P}bed">
      <ellipse cx="${x + 140}" cy="${y + 520}" rx="330" ry="560" fill="#000" opacity=".28" filter="${u("fBlurL")}"/>
      <rect x="${x - 250}" y="${y - 20}" width="190" height="230" rx="22" fill="${u("gWood")}"/>
      <rect x="${x - 240}" y="${y - 10}" width="170" height="210" rx="16" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="3"/>
      ${A.clock("clk", x - 125, y + 10, o.clock || ["07:00"])}
      ${A.phoneTop("phone", x - 205, y + 40)}
      <rect x="${x - 40}" y="${y - 40}" width="360" height="1000" rx="38" fill="${u("gWood")}"/>
      <rect x="${x - 20}" y="${y - 20}" width="320" height="960" rx="28" fill="#cfc8bb"/>
      <rect x="${x + 20}" y="${y}" width="240" height="150" rx="50" fill="${u("gPillow")}"/>
      <g id="${P}head"><circle cx="${x + 142}" cy="${y + 96}" r="66" fill="${u("gSkin")}"/>${A.eyes("eyes", x + 120, x + 164, y + 100, 11)}</g>
      <g id="${P}duvet"><path d="M${x - 20} ${y + 190} h320 v720 q0 30 -30 30 h-260 q-30 0 -30 -30 z" fill="${u("gDuvet")}"/>
      <path d="M${x - 20} ${y + 190} h320 v40 h-320 z" fill="${C.duvetEdge}"/></g></g>`;
    };

    // lit en plongée (3/4)
    A.bedIso = (o = {}) => {
      const x = 360, y = o.y || 640;
      return `<g id="${P}bed">
      <ellipse cx="${x + 150}" cy="${y + 560}" rx="420" ry="80" fill="#000" opacity=".35" filter="${u("fBlurL")}"/>
      <ellipse id="${P}lamp" cx="${x - 170}" cy="${y + 20}" rx="260" ry="200" fill="${u("gLamp")}" opacity="0"/>
      <path d="M${x - 250} ${y + 30} h170 l-10 60 h-150 z" fill="#5a4a6e"/>
      <rect x="${x - 260}" y="${y + 90}" width="170" height="220" rx="10" fill="${u("gWood")}"/>
      <path d="M${x - 240} ${y + 30} l20 -70 h40 l20 70 z" fill="#8a7aa0"/><rect x="${x - 205}" y="${y - 40}" width="8" height="10" fill="#8a7aa0"/>
      ${A.clock("clk", x - 150, y + 40, o.clock || ["23:04"], 20, 56, 34)}
      <g id="${P}phone"><rect x="${x - 210}" y="${y + 50}" width="54" height="30" rx="8" fill="#0b0d1a" stroke="#fff" stroke-opacity=".2" stroke-width="3"/></g>
      <path d="M${x - 30} ${y} h380 l60 420 h-500 z" fill="#cfc8bb"/>
      <g id="${P}pillow"><rect x="${x + 60}" y="${y + 20}" width="220" height="110" rx="45" fill="${u("gPillow")}"/></g>
      <g id="${P}head"><circle cx="${x + 165}" cy="${y + 70}" r="58" fill="${u("gSkin")}"/>${A.eyes("eyes", x + 145, x + 187, y + 70, 12)}</g>
      <g id="${P}duvet"><path d="M${x - 45} ${y + 140} h410 l50 280 h-510 z" fill="${u("gDuvet")}"/>
      <path d="M${x - 45} ${y + 140} h410 l5 30 h-420 z" fill="${C.duvetEdge}"/></g>
      <path d="M${x - 90} ${y + 420} h500 v110 h-500 z" fill="${u("gWood")}"/>
      <path d="M${x - 90} ${y + 420} h500 v14 h-500 z" fill="#6a5a80"/></g>`;
    };

    // plante de pied (vue de face, talon en bas) ; sock=true → chaussette, sinon pied nu
    const SOLE = "M-34 92 Q-52 30 -56 -30 Q-62 -98 -10 -110 Q52 -120 58 -58 Q60 -20 34 8 Q20 30 34 62 Q38 112 -2 114 Q-30 114 -34 92 Z";
    A.sole = (name, cx, cy, dir = 1, k = 1.35, sock = true) => {
      const cid = `${P}${name}-c`;
      const toes = `<g fill="${sock ? "none" : C.skin}" stroke="${sock ? "#c9862f" : C.skinDark}" stroke-width="3">${sock ? `<path d="M-30 -104 q8 -8 16 0 M-8 -110 q9 -9 18 0 M14 -108 q8 -8 16 0 M34 -96 q7 -7 14 2"/>` : `<circle cx="-34" cy="-104" r="15"/><circle cx="-8" cy="-116" r="13"/><circle cx="14" cy="-114" r="11"/><circle cx="32" cy="-104" r="9"/><circle cx="46" cy="-90" r="8"/>`}</g>`;
      const body = sock
        ? `<path d="${SOLE}" fill="${C.amber}"/><g clip-path="url(#${cid})"><ellipse cx="0" cy="-92" rx="70" ry="40" fill="${C.amberDark}"/><ellipse cx="-4" cy="100" rx="46" ry="30" fill="${C.amberDark}"/><path d="M-48 -20 Q0 -8 50 -24" stroke="#e3a447" stroke-width="5" fill="none"/></g>`
        : `<path d="${SOLE}" fill="${u("gSkin")}"/><g clip-path="url(#${cid})"><ellipse cx="0" cy="40" rx="30" ry="50" fill="#c79878" opacity=".5"/></g>`;
      return `<g id="${P}${name}"><g transform="translate(${cx} ${cy}) scale(${k * dir} ${k})">
        <clipPath id="${cid}"><path d="${SOLE}"/></clipPath>${sock ? "" : toes}${body}${sock ? toes : ""}
        <path d="${SOLE}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/></g></g>`;
    };

    // coupe du lit (strates de couette, poche d'air, drap, matelas, cadre) + jambe de profil + chaussette
    A.cutStrata = () => `<rect x="-100" y="420" width="1280" height="600" fill="#2c3878"/>
      <rect x="-100" y="420" width="1280" height="70" fill="#3d4c96"/><rect x="-100" y="560" width="1280" height="110" fill="#33418a" opacity=".75"/><rect x="-100" y="720" width="1280" height="90" fill="#25306a" opacity=".8"/>
      <path d="M-120 820 Q300 790 560 800 Q620 600 700 610 Q800 620 790 820 Q790 1010 700 1012 H-120 Z" fill="#151a45"/>
      <rect x="-100" y="1010" width="1280" height="150" fill="#d9d2c4"/><rect x="-100" y="1050" width="1280" height="8" fill="#c3baa9"/><rect x="-100" y="1110" width="1280" height="8" fill="#c3baa9"/>
      <rect x="-100" y="1160" width="1280" height="900" fill="${u("gWood")}"/><rect x="-100" y="1160" width="1280" height="16" fill="#6a5a80"/>`;
    // dessus de couette (ce qui recouvre la coupe avant qu'elle s'ouvre)
    A.duvetTop = (name) => `<g id="${P}${name}"><rect x="-100" y="420" width="1280" height="600" fill="${u("gDuvet")}"/>
      <path d="M-100 420 h1280 v40 h-1280z" fill="${C.duvetEdge}"/><path d="M-100 700 Q540 640 1180 720" stroke="#5868b0" stroke-width="6" fill="none" opacity=".5"/>
      <path d="M-100 1010 h1280 v12 h-1280z" fill="#1d2766"/></g>`;
    const LEG = "M-120 860 L560 868 C600 860 615 800 625 740 Q635 670 680 655 Q730 645 735 700 L738 900 Q740 1008 670 1008 Q620 1008 585 990 C500 1008 380 1012 260 1000 L-120 1004 Z";
    A.legSide = (name) => `<g id="${P}${name}"><path d="${LEG}" fill="${u("gSkin")}"/>
      <path d="M-120 860 L560 868" stroke="#f0d2b4" stroke-width="6" opacity=".6"/>
      <path d="M120 1002 Q 300 1020 520 996" stroke="#000" stroke-opacity=".12" stroke-width="10" fill="none"/>
      <path id="${P}${name}-cool" d="M-120 862 L540 868 L540 1004 L-120 1004 Z" fill="${u("gCool")}" opacity="0"/></g>`;
    A.sockSide = (name) => {
      const SOCK = "M500 864 L560 868 C600 860 615 800 625 740 Q635 670 680 655 Q730 645 735 700 L738 900 Q740 1008 670 1008 Q620 1008 585 990 C560 998 530 1002 500 1004 Z";
      return `<g id="${P}${name}"><clipPath id="${P}${name}-c"><path d="${SOCK}"/></clipPath>
      <g id="${P}${name}-glow" opacity="0" filter="${u("fGlowA")}"><path d="${SOCK}" fill="${C.amber}"/></g>
      <path d="${SOCK}" fill="${C.amber}"/>
      <g clip-path="url(#${P}${name}-c)"><ellipse cx="700" cy="660" rx="60" ry="50" fill="${C.amberDark}"/><ellipse cx="700" cy="990" rx="70" ry="48" fill="${C.amberDark}"/>
      <rect x="500" y="850" width="14" height="170" fill="${C.amberDark}"/><rect x="526" y="850" width="14" height="170" fill="${C.amberDark}"/></g>
      <path d="${SOCK}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/></g>`;
    };

    // tête en gros plan (yeux animables) + couette en bas
    A.headClose = (cx = 500, cy = 760, r = 170, o = {}) => `<g id="${P}head">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${u("gSkin")}"/>
      <ellipse id="${P}cheeks" cx="${cx}" cy="${cy + r * 0.25}" rx="${r * 0.62}" ry="${r * 0.12}" fill="#e8907a" opacity="0"/>
      ${A.eyes("eyes", cx - r * 0.35, cx + r * 0.35, cy - r * 0.12, r * 0.106)}</g>
      ${o.noDuvet ? "" : `<g id="${P}duvet"><rect x="${cx - 130}" y="${cy + r * 0.82}" width="260" height="380" rx="120" fill="${u("gDuvet")}"/>
      <path d="M-100 1080 q640 -120 1280 0 V2100 H-100 Z" fill="${u("gDuvet")}"/><path d="M-100 1080 q640 -120 1280 0 v36 q-640 -120 -1280 0 Z" fill="${C.duvetEdge}"/></g>`}`;

    // tête qui dépasse en bas (bulle de pensée au-dessus)
    A.headBottom = () => `<g id="${P}headB"><path d="M-100 1560 q640 -100 1280 0 V2100 H-100 Z" fill="${u("gDuvet")}"/>
      <circle cx="540" cy="1620" r="150" fill="${u("gSkin")}"/>${A.eyes("eyes", 490, 590, 1600, 15)}
      <path d="M-100 1700 q640 -90 1280 0 V2100 H-100 Z" fill="${u("gDuvet")}"/></g>
      <g id="${P}trail" fill="#fff" opacity=".55"><circle cx="560" cy="1440" r="14"/><circle cx="580" cy="1380" r="20"/></g>`;
    // bulle vue du dessus (courbes de niveau, comme l'étang)
    A.bubble = (cx = 500, cy = 820, rx = 400, ry = 340) => `<g id="${P}bubble">
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1a2058" stroke="#fff" stroke-opacity=".2" stroke-width="3"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.78}" ry="${ry * 0.78}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.55}" ry="${ry * 0.55}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="2"/></g>`;
    A.apple = (name, cx, cy, k = 1) => `<g id="${P}${name}"><g transform="translate(${cx} ${cy}) scale(${k})">
      <ellipse cx="0" cy="88" rx="110" ry="22" fill="#000" opacity=".35"/>
      <circle cx="-35" cy="0" r="85" fill="#d4513f"/><circle cx="35" cy="0" r="85" fill="#c4473a"/>
      <ellipse cx="-45" cy="-35" rx="30" ry="18" fill="#fff" opacity=".35"/>
      <path d="M0 -80 q5 -40 25 -55" stroke="#5a3a25" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M15 -105 q40 -30 70 -5 q-35 25 -70 5z" fill="#6aa04a"/></g></g>`;
    A.umbrella = (name, cx, cy, k = 1) => `<g id="${P}${name}"><g transform="translate(${cx} ${cy}) scale(${k})">
      <ellipse cx="0" cy="150" rx="90" ry="16" fill="#000" opacity=".3"/>
      <path d="M-150 -20 Q-150 -170 0 -170 Q150 -170 150 -20 Q125 -45 100 -20 Q75 -45 50 -20 Q25 -45 0 -20 Q-25 -45 -50 -20 Q-75 -45 -100 -20 Q-125 -45 -150 -20 Z" fill="#5f7fd0"/>
      <path d="M0 -170 Q-60 -110 -50 -20 M0 -170 Q60 -110 50 -20" stroke="#4a66b4" stroke-width="5" fill="none"/>
      <line x1="0" y1="-20" x2="0" y2="120" stroke="#ddd" stroke-width="10"/><path d="M0 120 q0 30 -30 30" stroke="#ddd" stroke-width="10" fill="none" stroke-linecap="round"/></g></g>`;
    A.chair = (name, cx, cy, k = 1) => `<g id="${P}${name}"><g transform="translate(${cx} ${cy}) scale(${k})">
      <ellipse cx="10" cy="160" rx="110" ry="16" fill="#000" opacity=".35"/>
      <path d="M-80 -160 h28 v190 h-28z" fill="#a8743f"/><path d="M-78 -140 h24 v40 h-24z" fill="#c08a52"/>
      <path d="M-95 30 h200 l-12 30 h-176z" fill="#c08a52"/>
      <path d="M-80 60 h20 v100 h-20z M80 60 h20 v100 h-20z" fill="#8f6236"/><path d="M-10 60 h14 v80 h-14z M44 60 h14 v80 h-14z" fill="#6f4a28" opacity=".7"/></g></g>`;

    // mur en coupe : chambre à gauche, cuisine du voisin à droite
    A.wallCut = () => `<g id="${P}building">
      <rect x="-100" y="1200" width="1280" height="900" fill="#1b1830"/>
      ${[0, 1, 2].map((i) => `<rect x="${80 + i * 330}" y="1300" width="230" height="300" rx="6" fill="#24203d" stroke="#3a3352" stroke-width="4"/>`).join("")}
      <rect x="-100" y="1700" width="1280" height="70" fill="#2a2440"/>
      <rect x="-100" y="1080" width="1280" height="120" fill="#2a2440"/><rect x="-100" y="1080" width="1280" height="10" fill="#4a3f66"/>
      <rect x="-100" y="420" width="1280" height="70" fill="#2a2440"/><rect x="-100" y="-200" width="1280" height="620" fill="#1b1830"/>
      <rect x="-100" y="490" width="710" height="590" fill="#1a1f45"/>
      <rect x="680" y="490" width="500" height="590" fill="#2b2238"/>
      <rect x="740" y="860" width="420" height="220" fill="#3a3046"/><rect x="740" y="850" width="420" height="18" fill="#6c5c78"/>
      <rect x="770" y="600" width="140" height="110" fill="#3a3046" stroke="#6c5c78" stroke-width="4" stroke-dasharray="10 8"/>
      <rect x="610" y="420" width="70" height="780" fill="${u("pHatch")}"/></g>
      <g id="${P}neighbor">
        <ellipse cx="860" cy="1072" rx="70" ry="12" fill="#000" opacity=".4"/>
        <rect x="830" y="900" width="26" height="170" rx="12" fill="#3d3550"/><rect x="866" y="900" width="26" height="170" rx="12" fill="#3d3550"/>
        <rect x="815" y="760" width="90" height="160" rx="30" fill="#c0603e"/>
        <circle cx="860" cy="715" r="44" fill="${u("gSkin")}"/><path d="M812 705 q48 -60 96 0 z" fill="${C.amber}"/>
        <g id="${P}drill"><rect x="740" y="790" width="100" height="24" rx="12" fill="#c0603e"/>
        <rect x="705" y="778" width="62" height="40" rx="8" fill="#2f3b2f"/><rect x="684" y="792" width="26" height="10" fill="#9aa"/></g></g>
      <g id="${P}room">
        <ellipse cx="300" cy="1075" rx="280" ry="16" fill="#000" opacity=".4"/>
        <rect x="60" y="930" width="470" height="140" rx="14" fill="${u("gWood")}"/>
        <rect x="60" y="890" width="470" height="50" rx="14" fill="#cfc8bb"/>
        <rect x="90" y="845" width="130" height="60" rx="26" fill="${u("gPillow")}"/>
        <g id="${P}head"><circle cx="160" cy="845" r="48" fill="${u("gSkin")}"/>${A.eyes("eyes", 146, 178, 838, 10)}</g>
        <path d="M200 880 h330 v60 h-330 z" fill="${u("gDuvet")}"/>
        <rect x="540" y="930" width="66" height="140" rx="8" fill="${u("gWood")}"/>
        <rect x="548" y="908" width="48" height="24" rx="6" fill="#0b0d1a" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
        <g id="${P}phone-on" opacity="0"><ellipse cx="572" cy="915" rx="120" ry="90" fill="${u("gNeonGlow")}"/><rect x="548" y="908" width="48" height="24" rx="6" fill="#0b0d1a" stroke="${u("gNeon")}" stroke-width="4" filter="${u("fGlowN")}"/></g>
      </g>`;

    // téléphone en gros plan : interface Listen reconstruite d'après les captures App Store
    A.phoneUI = (x, y, wdt = 560, o = {}) => {
      const TRACK = o.track || "Pluie régulière", SUB = o.sub || "Sons de l'eau", SECT = o.section || "SONS DE L'EAU";
      const s = wdt / 560, Q = (v) => v * s, hgt = wdt * 2.05;
      const chips = ["Bali", "Indonésie", "tropical", "vent", "Thaïlande"];
      let cx = x + Q(40), chipSvg = "";
      for (const c of chips) {
        const cw = Q(c.length * 11 + 40);
        chipSvg += `<rect x="${cx}" y="${y + Q(400)}" width="${cw}" height="${Q(52)}" rx="${Q(26)}" fill="#1b1f3a" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>
        <text x="${cx + cw / 2}" y="${y + Q(434)}" text-anchor="middle" font-family="Poppins" font-weight="400" font-size="${Q(20)}" fill="#e6e8f2">${c}</text>`;
        cx += cw + Q(12);
      }
      return `<g id="${P}phoneBig">
      <rect id="${P}bezelGlow" x="${x - Q(18)}" y="${y - Q(18)}" width="${wdt + Q(36)}" height="${hgt + Q(36)}" rx="${Q(90)}" fill="#05060c" stroke="${u("gNeon")}" stroke-width="${Q(6)}" filter="${u("fGlowN")}"/>
      <rect x="${x}" y="${y}" width="${wdt}" height="${hgt}" rx="${Q(72)}" fill="#0d1020"/>
      <clipPath id="${P}screenClip"><rect x="${x}" y="${y}" width="${wdt}" height="${hgt}" rx="${Q(72)}"/></clipPath>
      <g id="${P}ui" clip-path="url(#${P}screenClip)">
      <text x="${x + Q(60)}" y="${y + Q(56)}" font-family="Poppins" font-weight="600" font-size="${Q(24)}" fill="#fff">00:11</text>
      <rect x="${x + Q(40)}" y="${y + Q(120)}" width="${Q(70)}" height="${Q(6)}" rx="${Q(3)}" fill="${C.violet}"/>
      <text x="${x + Q(40)}" y="${y + Q(180)}" font-family="Poppins" font-weight="600" font-size="${Q(17)}" letter-spacing="${Q(4)}" fill="#b8bdd6">AMBIANCES CALMES</text>
      <text x="${x + Q(40)}" y="${y + Q(232)}" font-family="Poppins" font-weight="700" font-size="${Q(36)}" fill="#fff">Concentration et sommeil</text>
      <rect x="${x + Q(40)}" y="${y + Q(275)}" width="${wdt - Q(80)}" height="${Q(84)}" rx="${Q(42)}" fill="#161a33" stroke="#fff" stroke-opacity=".1" stroke-width="2"/>
      <text x="${x + Q(100)}" y="${y + Q(326)}" font-family="Poppins" font-weight="400" font-size="${Q(22)}" fill="#a3a9c8">Rechercher des sons relaxants</text>
      ${chipSvg}
      <text x="${x + Q(40)}" y="${y + Q(520)}" font-family="Poppins" font-weight="600" font-size="${Q(17)}" letter-spacing="${Q(4)}" fill="#b8bdd6">NOTRE SÉLECTION</text>
      <text x="${x + Q(40)}" y="${y + Q(562)}" font-family="Poppins" font-weight="700" font-size="${Q(30)}" fill="#fff">Collections</text>
      <rect x="${x + Q(40)}" y="${y + Q(590)}" width="${Q(300)}" height="${Q(300)}" rx="${Q(34)}" fill="${u("gCard")}"/>
      <text x="${x + Q(66)}" y="${y + Q(642)}" font-family="Poppins" font-weight="700" font-size="${Q(28)}" fill="#fff">Sons de l'eau</text>
      <text x="${x + Q(66)}" y="${y + Q(674)}" font-family="Poppins" font-weight="400" font-size="${Q(18)}" fill="#dbe6ff">32 sons</text>
      <rect x="${x + Q(360)}" y="${y + Q(590)}" width="${Q(300)}" height="${Q(300)}" rx="${Q(34)}" fill="${u("gCard")}" opacity=".8"/>
      <text x="${x + Q(386)}" y="${y + Q(642)}" font-family="Poppins" font-weight="700" font-size="${Q(28)}" fill="#fff">À la plage</text>
      <text x="${x + Q(386)}" y="${y + Q(674)}" font-family="Poppins" font-weight="400" font-size="${Q(18)}" fill="#dbe6ff">37 sons</text>
      <text x="${x + Q(40)}" y="${y + Q(950)}" font-family="Poppins" font-weight="600" font-size="${Q(17)}" letter-spacing="${Q(4)}" fill="#b8bdd6">${SECT}</text>
      <g id="${P}track"><rect id="${P}trackBg" x="${x + Q(40)}" y="${y + Q(975)}" width="${wdt - Q(80)}" height="${Q(110)}" rx="${Q(26)}" fill="#161a33" stroke="#fff" stroke-opacity=".15" stroke-width="${Q(3)}"/>
      <rect id="${P}trackHi" x="${x + Q(40)}" y="${y + Q(975)}" width="${wdt - Q(80)}" height="${Q(110)}" rx="${Q(26)}" fill="#1a2350" stroke="${C.rain}" stroke-width="${Q(4)}" opacity="0"/>
      <rect x="${x + Q(56)}" y="${y + Q(990)}" width="${Q(80)}" height="${Q(80)}" rx="${Q(18)}" fill="${u("gCard")}"/>
      <text x="${x + Q(156)}" y="${y + Q(1028)}" font-family="Poppins" font-weight="700" font-size="${Q(26)}" fill="#fff">${TRACK}</text>
      <text x="${x + Q(156)}" y="${y + Q(1060)}" font-family="Poppins" font-weight="400" font-size="${Q(18)}" fill="#b8c4ee">${SUB}</text>
      <circle cx="${x + wdt - Q(90)}" cy="${y + Q(1030)}" r="${Q(30)}" fill="#fff"/>
      <path id="${P}play" d="M${x + wdt - Q(98)} ${y + Q(1016)} l${Q(24)} ${Q(14)} l-${Q(24)} ${Q(14)} z" fill="#1a2350"/>
      <g id="${P}pause" opacity="0"><rect x="${x + wdt - Q(100)}" y="${y + Q(1016)}" width="${Q(7)}" height="${Q(28)}" fill="#1a2350"/><rect x="${x + wdt - Q(87)}" y="${y + Q(1016)}" width="${Q(7)}" height="${Q(28)}" fill="#1a2350"/></g>
      <circle id="${P}tap" cx="${x + wdt - Q(90)}" cy="${y + Q(1030)}" r="${Q(56)}" fill="none" stroke="#fff" stroke-width="${Q(4)}" opacity="0"/></g>
      </g>
      <rect id="${P}screenOff" x="${x}" y="${y}" width="${wdt}" height="${hgt}" rx="${Q(72)}" fill="#05060c"/>
      <rect x="${x + wdt / 2 - Q(80)}" y="${y + Q(22)}" width="${Q(160)}" height="${Q(46)}" rx="${Q(23)}" fill="#000"/></g>`;
    };
    A.listenIcon = (x, y, s = 120) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.23}" fill="#05060c" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>
      <circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s * 0.3}" fill="none" stroke="${u("gNeon")}" stroke-width="${s * 0.075}" filter="${u("fGlowN")}"/>`;
    // pluie fine (points), placement pseudo-aléatoire déterministe
    A.rain = (name, n = 60, x0 = 0, x1 = 1080, y0 = 0, y1 = 1920, color = C.rain) => {
      let s = "";
      for (let i = 0; i < n; i++) s += `<circle cx="${x0 + ((i * 137.5) % (x1 - x0))}" cy="${y0 + ((i * 263.7) % (y1 - y0))}" r="${3 + (i % 3)}" fill="${color}" opacity="${0.35 + (i % 4) * 0.12}"/>`;
      return `<g id="${P}${name}">${s}</g>`;
    };

    // ================= ÉPISODE 1 : « Pourquoi tu te couches toujours trop tard » =================
    const COLD = "#9cc8ff";
    // canapé vu de dessus, personnage affalé, téléphone devant le visage (halo d'écran bleu froid)
    A.couchTop = (o = {}) => {
      const x = 540, y = 900, pw = o.phoneOn === false ? 0 : 1;
      return `<g id="${P}couch">
      <ellipse cx="${x}" cy="${y + 380}" rx="470" ry="520" fill="#000" opacity=".3" filter="${u("fBlurL")}"/>
      <rect x="${x - 300}" y="${y - 400}" width="600" height="800" rx="64" fill="#3b3666"/>
      <rect x="${x - 300}" y="${y - 400}" width="600" height="150" rx="56" fill="#4a4480"/>
      <rect x="${x - 300}" y="${y - 300}" width="90" height="700" rx="40" fill="#463f78"/>
      <rect x="${x + 210}" y="${y - 300}" width="90" height="700" rx="40" fill="#463f78"/>
      <rect x="${x - 205}" y="${y - 240}" width="410" height="610" rx="30" fill="#413b70"/>
      <path d="M${x} ${y - 240} v610" stroke="#2d2955" stroke-width="5"/>
      <rect x="${x - 190}" y="${y - 120}" width="150" height="230" rx="40" fill="#5a52a0" transform="rotate(-8 ${x - 115} ${y})"/>
      <!-- jambes -->
      <rect x="${x - 92}" y="${y + 30}" width="74" height="330" rx="36" fill="#2c3060" transform="rotate(4 ${x - 72} ${y + 180})"/>
      <rect x="${x + 18}" y="${y + 30}" width="74" height="330" rx="36" fill="#262a58" transform="rotate(-6 ${x + 72} ${y + 180})"/>
      <!-- buste -->
      <ellipse cx="${x}" cy="${y - 70}" rx="104" ry="122" fill="${u("gDuvet")}"/>
      <!-- tête -->
      <g id="${P}head"><circle cx="${x}" cy="${y - 250}" r="78" fill="${u("gSkin")}"/>${A.eyes("eyes", x - 28, x + 28, y - 232, 13)}</g>
      ${o.held === false ? "" : `<!-- bras + téléphone -->
      <g id="${P}phoneHeld"><rect x="${x - 112}" y="${y - 190}" width="46" height="150" rx="23" fill="#3a49a0" transform="rotate(-22 ${x - 89} ${y - 115})"/>
      <rect x="${x + 66}" y="${y - 190}" width="46" height="150" rx="23" fill="#3a49a0" transform="rotate(22 ${x + 89} ${y - 115})"/>
      <rect x="${x - 55}" y="${y - 175}" width="110" height="170" rx="18" fill="#0b0d1a" transform="rotate(-3 ${x} ${y - 90})"/>
      <rect id="${P}screen" x="${x - 47}" y="${y - 167}" width="94" height="154" rx="13" fill="#dcebff" transform="rotate(-3 ${x} ${y - 90})"/></g>
      <ellipse id="${P}halo" cx="${x}" cy="${y - 150}" rx="${o.halo || 430}" ry="${(o.halo || 430) * 0.95}" fill="${u("gHalo")}" opacity="${pw}"/>`}
      </g>`;
    };
    // grosse horloge numérique (affichages superposés, un seul visible) — bleu froid = « écran », ambre = « décision »
    A.bigClock = (name, x, y, times, o = {}) => A.clock(name, x, y, times, o.size || 150, o.w || 420, o.h || 190, o.color || COLD)
      .replace(`fill="#1a1b30"`, `fill="#0c0f2a" stroke="#fff" stroke-opacity=".14" stroke-width="3"`).replace(`rx="8"`, `rx="30"`);
    // alarme de fin : bande ambre inclinée qui traverse l'écran (cloche + texte), traînées de vitesse
    A.alarmBand = (name, o = {}) => {
      const cx = o.cx ?? 540, cy = o.cy ?? 860, r = o.rot ?? -7;
      return `<g id="${P}${name}" transform="rotate(${r} ${cx} ${cy})">
      <rect x="${cx - 1100}" y="${cy - 66}" width="1000" height="22" rx="11" fill="${C.amber}" opacity=".35"/>
      <rect x="${cx - 900}" y="${cy + 30}" width="800" height="18" rx="9" fill="${C.amber}" opacity=".22"/>
      <g id="${P}${name}-b"><rect x="${cx - 560}" y="${cy - 105}" width="1120" height="210" rx="50" fill="${C.amber}"/>
      <rect x="${cx - 560}" y="${cy - 105}" width="1120" height="210" rx="50" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4"/>
      <g transform="translate(${cx - 470} ${cy - 62}) scale(1.7)" fill="#2a1d3a"><path d="M25 0 c-10 0 -17 8 -17 18 v14 l-8 12 h50 l-8 -12 v-14 c0 -10 -7 -18 -17 -18z"/><circle cx="25" cy="52" r="6"/></g>
      <text x="${cx - 330}" y="${cy + 28}" font-family="Nunito" font-weight="900" font-size="${o.size || 96}" fill="#2a1d3a">${o.text || "ALARME · 23:30"}</text>
      <text x="${cx - 330}" y="${cy + 80}" font-family="Fraunces" font-style="italic" font-weight="500" font-size="46" fill="#4a3a22">${o.sub || "pour t'arrêter"}</text></g>
      </g>`;
    };
    // carte de la journée : cadran 24 h en anneau, courbes de niveau façon carte (clin d'œil à l'étang de Catcharium)
    const polar = (cx, cy, r, deg) => [cx + r * Math.cos((deg - 90) * Math.PI / 180), cy + r * Math.sin((deg - 90) * Math.PI / 180)];
    const arcPath = (cx, cy, r, h0, h1) => {
      const a0 = h0 / 24 * 360, a1 = h1 / 24 * 360, [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1);
      return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    };
    A.hourPt = (cx, cy, r, h) => polar(cx, cy, r, h / 24 * 360);
    A.dayMap = (name, cx, cy, R, o = {}) => {
      const seg = [[7, 8.5, "#5b6ec0"], [8.5, 12.5, "#4a5aa8"], [12.5, 13.5, "#6b7ccc"], [13.5, 18.5, "#4a5aa8"], [18.5, 20, "#5b6ec0"], [20, 22, "#6b7ccc"], [22, 24.57, COLD]];
      const w = o.w || 96;
      let s = `<g id="${P}${name}">`;
      if (o.plate !== false) s += `<ellipse cx="${cx}" cy="${cy + 46}" rx="${R * 1.46}" ry="${R * 1.46}" fill="#000" opacity=".42" filter="${u("fBlurL")}"/><circle cx="${cx}" cy="${cy}" r="${R * 1.46}" fill="#1b2050"/><circle cx="${cx}" cy="${cy}" r="${R * 1.46}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${R * 1.2 + w * 0.5}" fill="none" stroke="#0e1130" stroke-opacity=".55" stroke-width="4"/>`;
      [0.5, 0.74, 1.2, 1.42].forEach((k) => (s += `<circle cx="${cx}" cy="${cy}" r="${R * k}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="2"/>`));
      s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="${w + 26}"/>`;
      seg.forEach(([a, b, c], i) => (s += `<path id="${P}${name}-s${i}" d="${arcPath(cx, cy, R, a, b)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="butt"/>`));
      seg.forEach(([a, b]) => { s += `<path d="${arcPath(cx, cy, R + w / 2 - 3, a, b)}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="5"/><path d="${arcPath(cx, cy, R - w / 2 + 3, a, b)}" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="6"/>`; });
      s += `<path id="${P}${name}-sleep" d="${arcPath(cx, cy, R, 0.57, 7)}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="${w}" stroke-dasharray="4 16" stroke-linecap="round"/>`;
      s += `<path id="${P}${name}-carve" d="${arcPath(cx, cy, R, o.carve ? o.carve[0] : 22.1, o.carve ? o.carve[1] : 22.43)}" fill="none" stroke="${C.amber}" stroke-width="${w + 14}" opacity="${o.carve ? 1 : 0}" filter="${u("fGlowS")}"/>`;
      [0, 6, 12, 18].forEach((h) => { const [x, y] = polar(cx, cy, R * 1.0 + w * 0.5 + 34, h / 24 * 360); s += `<text x="${x.toFixed(1)}" y="${(y + 12).toFixed(1)}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="${C.cream}" fill-opacity=".7">${String(h).padStart(2, "0")}h</text>`; });
      return s + `</g>`;
    };
    // petits objets (astuce 2 : montrés, pas dits)
    A.book = (name, cx, cy, k = 1) => `<g id="${P}${name}"><g transform="translate(${cx} ${cy}) scale(${k})">
      <ellipse cx="0" cy="112" rx="110" ry="18" fill="#000" opacity=".3"/>
      <path d="M-100 -90 h185 a14 14 0 0 1 14 14 v168 a14 14 0 0 1 -14 14 h-185 z" fill="#5f7fd0"/>
      <path d="M-100 -90 h22 v196 h-22z" fill="#4a66b4"/><rect x="-62" y="-52" width="110" height="18" rx="9" fill="${C.cream}" opacity=".85"/><rect x="-62" y="-14" width="70" height="12" rx="6" fill="${C.cream}" opacity=".5"/>
      <path d="M-78 106 h172 v10 h-172z" fill="${C.cream}"/></g></g>`;
    A.notebook = (name, cx, cy, k = 1) => `<g id="${P}${name}"><g transform="translate(${cx} ${cy}) scale(${k})">
      <ellipse cx="0" cy="112" rx="100" ry="18" fill="#000" opacity=".3"/>
      <rect x="-80" y="-96" width="170" height="216" rx="16" fill="${C.cream}"/>
      ${[-70, -30, 10, 50, 90].map((y) => `<line x1="-56" y1="${y}" x2="72" y2="${y}" stroke="#b9b3a6" stroke-width="3"/>`).join("")}
      ${[-80, -48, -16, 16, 48, 80].map((y) => `<circle cx="-80" cy="${y}" r="9" fill="#3a3560"/>`).join("")}
      <rect x="40" y="-96" width="22" height="86" fill="${C.amber}"/></g></g>`;
    A.record = (name, cx, cy, k = 1) => `<g id="${P}${name}"><g transform="translate(${cx} ${cy}) scale(${k})">
      <ellipse cx="0" cy="112" rx="108" ry="18" fill="#000" opacity=".3"/>
      <circle cx="0" cy="0" r="108" fill="#15122a"/>${[30, 50, 70, 90].map((r) => `<circle r="${r}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>`).join("")}
      <circle r="34" fill="${C.amber}"/><circle r="6" fill="#15122a"/><path d="M-70 -70 q70 -50 140 0" stroke="#fff" stroke-opacity=".18" stroke-width="8" fill="none" stroke-linecap="round"/></g></g>`;
    // téléphone posé face contre table (écran éteint) avec petit rayonnement chaud (son de café)
    A.warmDots = (name, cx, cy, n = 3, r0 = 150, dr = 120) => { let s = ""; for (let i = 0; i < n; i++) s += A.dots(`${name}${i}`, A.arc(cx, cy, r0 + i * dr, -52 + i * 3, 52 - i * 3), { step: 26, r: 8, color: "#ffd28a", glow: "fGlowA" }); return s; };

    // table de chevet vue de dessus
    A.sideTable = (name, cx, cy, w = 380, h = 520) => `<g id="${P}${name}">
      <ellipse cx="${cx}" cy="${cy + 40}" rx="${w * 0.62}" ry="${h * 0.6}" fill="#000" opacity=".4" filter="${u("fBlurL")}"/>
      <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="36" fill="${u("gWood")}"/>
      <rect x="${cx - w / 2 + 14}" y="${cy - h / 2 + 14}" width="${w - 28}" height="${h - 28}" rx="26" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>
      ${[0.2, 0.4, 0.6, 0.8].map((k) => `<line x1="${cx - w / 2 + 30}" y1="${cy - h / 2 + h * k}" x2="${cx + w / 2 - 30}" y2="${cy - h / 2 + h * k}" stroke="#000" stroke-opacity=".12" stroke-width="3"/>`).join("")}</g>`;
    // réveil physique vu de dessus : deux cloches, face sombre, heure en numérique
    A.alarmClock = (name, cx, cy, k = 1, o = {}) => {
      const body = o.color || "#d9d4e8", face = "#0c0f2a", tcol = o.tcolor || C.amber;
      return `<g id="${P}${name}"><g transform="translate(${cx} ${cy}) rotate(${o.rot || 0}) scale(${k})" opacity="${o.opacity ?? 1}">
      <ellipse cx="6" cy="22" rx="112" ry="112" fill="#000" opacity=".4" filter="${u("fBlurL")}"/>
      <g transform="rotate(-32)"><ellipse cx="0" cy="-104" rx="44" ry="30" fill="${C.amber}"/><ellipse cx="0" cy="-110" rx="30" ry="16" fill="#fff" opacity=".28"/></g>
      <g transform="rotate(32)"><ellipse cx="0" cy="-104" rx="44" ry="30" fill="${C.amber}"/><ellipse cx="0" cy="-110" rx="30" ry="16" fill="#fff" opacity=".28"/></g>
      <rect x="-9" y="-124" width="18" height="30" rx="6" fill="#b88a3a"/>
      <circle id="${P}${name}-body" r="92" fill="${body}"/><circle r="92" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4"/>
      <circle r="70" fill="${face}"/>
      ${(o.times || [o.time || "23:30"]).map((tm, i) => `<text id="${P}${name}-t${i}" x="0" y="16" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${o.size || 46}" fill="${tcol}" opacity="${i ? 0 : 1}">${tm}</text>`).join("")}
      <path d="M-48 -34 q48 -28 96 0" stroke="#fff" stroke-opacity=".16" stroke-width="6" fill="none" stroke-linecap="round"/>
      <rect x="-34" y="92" width="26" height="18" rx="6" fill="#8d88a6"/><rect x="8" y="92" width="26" height="18" rx="6" fill="#8d88a6"/></g></g>`;
    };
    // personnage vu de dessus, dormeur/éveillé au centre d'une carte (tête + épaules)
    A.personTop = (name, cx, cy, k = 1, o = {}) => `<g id="${P}${name}"><g transform="translate(${cx} ${cy}) scale(${k})">
      <ellipse cx="0" cy="14" rx="124" ry="96" fill="#000" opacity=".35" filter="${u("fBlurL")}"/>
      <ellipse cx="0" cy="66" rx="82" ry="60" fill="${u("gDuvet")}"/>
      <circle cx="0" cy="-12" r="62" fill="${u("gSkin")}"/>
      ${A.eyes(name + "Eyes", -22, 22, 0, 10)}</g></g>`;
    return A;
  }

  // ---------------------------------------------------------------- scène
  // Monte le décor d'une scène : <div.ls-stage><div.ls-tilt><svg>defs + cam + hud</svg></div></div>
  function stage(root, id, world, hud) {
    const P = id + "-";
    root.innerHTML = `<div class="ls-stage" id="${P}stage"><div class="ls-tilt" id="${P}tilt">
      <svg viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" data-layout-allow-overflow>${defs(P)}
      <g id="${P}cam" data-layout-allow-overflow>${world}</g><g id="${P}hud">${hud || ""}</g>${art(P).vignette()}${art(P).grain()}</svg></div></div>`;
    const $ = (name) => root.querySelector("#" + P + name);
    const lidEls = root.querySelectorAll('[id$="-lidL"],[id$="-lidR"]');
    if (lidEls.length) gsap.set(lidEls, { scaleY: 0, transformOrigin: "50% 0%" });
    return { $, P, stage: $("stage"), tilt: $("tilt"), cam: $("cam"), hud: $("hud") };
  }

  // ---------------------------------------------------------------- animation (seek-safe)
  const pop = (tl, el, t, o = {}) => {
    if (!el) return;
    tl.fromTo(el, { scale: o.from ?? 0.4, opacity: 0, transformOrigin: o.origin || "50% 50%" },
      { scale: 1, opacity: 1, duration: o.d || 0.32, ease: o.ease || "back.out(2.4)" }, t);
  };
  const hide = (tl, el, t, d = 0.25) => el && tl.to(el, { opacity: 0, scale: 0.85, duration: d, ease: "power2.in", transformOrigin: "50% 50%" }, t);
  // pastille : point d'ancrage → trait → bulle
  function pill(tl, S, name, t) {
    const dot = S.$(name + "-dot"), ln = S.$(name + "-ln"), b = S.$(name + "-b");
    if (dot) tl.fromTo(dot, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.22, ease: "back.out(3.5)" }, t);
    if (ln) tl.fromTo(ln, { opacity: 0 }, { opacity: 1, duration: 0.1 }, t + 0.06);
    pop(tl, b, t + 0.1, { from: 0.45, d: 0.3, ease: "back.out(2.6)" });
  }
  function pillOut(tl, S, name, t) { const g = S.$(name); if (g) tl.to(g, { opacity: 0, scale: 0.9, transformOrigin: "50% 50%", duration: 0.2, ease: "power2.in" }, t); }
  // apparition point par point d'un groupe de .dot
  function drawDots(tl, g, t, d = 0.6, o = {}) {
    if (!g) return;
    const ds = g.querySelectorAll(".dot");
    tl.fromTo(ds, { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)", immediateRender: o.ir ?? true, stagger: { each: d / Math.max(1, ds.length), from: o.from || "start" } }, t);
  }
  // pulsation (scintillement) finie d'un groupe de .dot
  function shimmer(tl, g, t, until, o = {}) {
    if (!g || until <= t) return;
    const ds = g.querySelectorAll(".dot"), per = o.per || 0.9;
    const reps = Math.max(0, Math.floor((until - t) / per) - 1);
    tl.to(ds, { opacity: o.low ?? 0.35, duration: per / 2, ease: "sine.inOut", yoyo: true, repeat: reps * 2 + 1, stagger: { each: per / Math.max(1, ds.length) * 2, repeat: 0 } }, t);
  }
  function blink(tl, S, t, name = "eyes") {
    const L = S.$(name + "-lidL"), R = S.$(name + "-lidR");
    tl.fromTo([L, R], { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 0.07, ease: "power1.in", yoyo: true, repeat: 1 }, t);
  }
  function lids(tl, S, t, amount, d = 0.3, name = "eyes") {
    tl.to([S.$(name + "-lidL"), S.$(name + "-lidR")], { scaleY: amount, transformOrigin: "50% 0%", duration: d, ease: "power2.inOut" }, t);
  }
  function initLids(S, amount = 0, name = "eyes") { gsap.set([S.$(name + "-lidL"), S.$(name + "-lidR")], { scaleY: amount, transformOrigin: "50% 0%" }); }
  function shut(tl, S, t, closed = true, name = "eyes") {
    tl.to(S.$(name + "-open"), { opacity: closed ? 0 : 1, duration: 0.2 }, t);
    tl.to(S.$(name + "-shut"), { opacity: closed ? 1 : 0, duration: 0.2 }, t);
    tl.to([S.$(name + "-lidL"), S.$(name + "-lidR")], { opacity: closed ? 0 : 1, duration: 0.2 }, t);
  }
  // fondu d'entrée de scène (chevauchement avec la précédente)
  function fadeIn(tl, S, sc) { if (sc.fadeIn > 0) tl.fromTo(S.stage, { opacity: 0 }, { opacity: 1, duration: sc.fadeIn, ease: "none" }, 0); }
  // caméra : transformations SVG sur #cam autour du centre 540,960
  function cam(tl, S, from, to, t, d, ease = "power2.inOut") {
    tl.fromTo(S.cam, Object.assign({ svgOrigin: "540 960" }, from), Object.assign({ svgOrigin: "540 960", duration: d, ease }, to), t);
  }
  // chiffre d'astuce qui claque : graine → chiffre surdimensionné qui retombe + onde de choc + secousse
  function slam(tl, S, name, t) {
    const g = S.$(name);
    if (g) tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t - 0.02);
    tl.fromTo(S.$(name + "-seed"), { scale: 1, opacity: 1, transformOrigin: "50% 50%" }, { scale: 0, opacity: 0, duration: 0.12, ease: "power2.in" }, t - 0.12);
    tl.fromTo(S.$(name + "-n"), { scale: 2.4, opacity: 0, rotation: -14, transformOrigin: "40% 60%" }, { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: "back.out(2.2)" }, t);
    tl.fromTo(S.$(name + "-ring"), { scale: 0.3, opacity: 1, transformOrigin: "50% 50%" }, { scale: 3.2, opacity: 0, duration: 0.5, ease: "power2.out" }, t + 0.12);
    tl.fromTo(S.$(name + "-over"), { opacity: 0, x: -30 }, { opacity: 0.85, x: 0, duration: 0.25, ease: "power3.out" }, t + 0.15);
    punch(tl, S, t + 0.1, 0.05);
  }
  // petit coup de caméra (sur le calque d'inclinaison, indépendant des mouvements de caméra)
  function punch(tl, S, t, amt = 0.035) {
    tl.fromTo(S.tilt, { scale: 1 }, { scale: 1 + amt, duration: 0.08, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, t);
  }
  function setText(tl, el, t, values, d) {
    const o = { v: 0 };
    tl.fromTo(o, { v: 0 }, { v: values.length - 1, duration: d, ease: "power1.inOut", onUpdate: () => { el.textContent = values[Math.round(o.v)]; } }, t);
  }

  window.LS = { C, w, scene, art, stage, pop, slam, punch, hide, pill, pillOut, drawDots, shimmer, blink, lids, initLids, shut, fadeIn, cam, setText, esc };
})();
