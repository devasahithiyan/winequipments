/* WebGL model of a Win heatless desiccant (twin-tower) dryer for partials/dryer360.html.
   Geometry ported from the photo-referenced model in the "WIn equipments Chatgpt" workspace (src/site/assets/js/desiccant-model.js),
   built from images/Products/dessicantdryer.png and images/works/desiccant-dryer-twin-tower.jpg, and rebuilt on the same renderer,
   lighting, loading and capture code as chiller3d.js. The outside follows the photographed unit; the bed, the screens, the layout
   behind the control door and the air paths are illustrations (the inside is not photographed). Only labels visible on the real unit
   are drawn: TOWER-1, TOWER-2, WIN, POWER ON, DRYER ON. No model number, rating or reading is implied.
   dryer360 (chiller360.js, configured from the page) owns drag / keys / modes / parts-list state and calls view.set(ry, rx, state).
   No template literals here: the build's minifier mangles them. */
import * as T from 'three';
import { mergeGeometries } from '/js/vendor/BufferGeometryUtils.js?v=170';

/* the unit opens in this order (fractions of open 0..1): the control door, then the lamp inside */
const WIN = { door: [0.04, 0.5], light: [0.25, 0.75] };
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const ease = (t) => t * t * (3 - 2 * t);
const lin = (p, w) => clamp01((p - w[0]) / (w[1] - w[0]));
const phase = (p, w) => ease(lin(p, w));
const backOut = (t) => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };   /* small overshoot, settles at 1 */
export async function init(opts) {
  const stage = opts.stage, hotspots = opts.hotspots || [], reduce = !!opts.reduce;
  const check = () => { if (opts.signal?.aborted) throw new DOMException('Loading cancelled', 'AbortError'); };
  check();
  try { await document.fonts.load('700 64px Archivo'); } catch (e) { /* Arial fallback */ }
  check();

  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  /* phones and small CPUs render at a lower pixel ratio; desktops up to 1.5 (Retina at 2x costs 4x the pixels for little gain) */
  const lowEnd = (navigator.hardwareConcurrency || 4) <= 4 || matchMedia('(max-width: 767px)').matches;
  /* lite (phones, tablets, low-end PCs): no shadow map, no clearcoat or surface maps, pixel ratio 1 */
  const lite = !!opts.lite || lowEnd;
  const maxPR = Math.min(window.devicePixelRatio || 1, opts.lite ? 1 : lowEnd ? 1.25 : 1.5);
  renderer.setPixelRatio(maxPR);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.NeutralToneMapping;   /* photographic roll-off that keeps the paint's saturation */
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.VSMShadowMap;
  renderer.shadowMap.autoUpdate = false;   /* shadows re-render only when the model moves, not for the spinning fan */
  renderer.setClearColor(0x000000, 0);
  const cvs = renderer.domElement;
  cvs.className = 'c3__canvas';
  cvs.setAttribute('aria-hidden', 'true');

  const scene = new T.Scene();
  let disposed = false;
  const extras = new Set();
  const release = () => {
    if (disposed) return;
    disposed = true;
    const resources = new Set(extras);
    scene.traverse((o) => {
      if (o.geometry) resources.add(o.geometry);
      if (o.shadow) o.shadow.dispose();
      (Array.isArray(o.material) ? o.material : [o.material]).filter(Boolean).forEach((m) => {
        resources.add(m);
        Object.values(m).forEach((v) => { if (v?.isTexture) resources.add(v); });
      });
    });
    resources.forEach((r) => r.dispose());
    cvs.remove(); renderer.dispose();
  };
  let cleanup = release;
  try {
  const camera = new T.PerspectiveCamera(32, 1, 0.1, 60);
  const model = new T.Group(); scene.add(model);
  const geometryCache = new Map();
  /* building the model is split into chunks with a yield between them, so a slow phone keeps scrolling while it builds */
  const pause = async () => { await new Promise((r) => setTimeout(r, 0)); check(); };
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const mat = (color, metalness, roughness, extra) => new T.MeshPhysicalMaterial(Object.assign({ color, metalness, roughness }, extra || {}));

  /* fine stochastic surface height for the powder coat and foam texture seen in the photos */
  const noise = document.createElement('canvas'); noise.width = noise.height = 128;
  const nctx = noise.getContext('2d'), px = nctx.createImageData(128, 128);
  let seed = 41;
  for (let i = 0; i < px.data.length; i += 4) { seed = (seed * 1664525 + 1013904223) >>> 0; const v = 110 + (seed % 70); px.data[i] = px.data[i + 1] = px.data[i + 2] = v; px.data[i + 3] = 255; }
  nctx.putImageData(px, 0, 0);
  const grain = new T.CanvasTexture(noise); grain.wrapS = grain.wrapT = T.RepeatWrapping; grain.repeat.set(5, 5);

  /* bump textures: random blobs, blurred, turned into a tileable normal map (powder coat, cast iron, foam) */
  const bumps = (count, rMin, rMax, blur, strength, repeat, seed) => {
    const n = 256, a = document.createElement('canvas'), b = document.createElement('canvas');
    a.width = a.height = b.width = b.height = n;
    const ga = a.getContext('2d'), gb = b.getContext('2d');
    ga.fillStyle = '#808080'; ga.fillRect(0, 0, n, n);
    let sd = seed;
    const rnd = () => (sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296;
    for (let i = 0; i < count; i++) {
      const v = Math.round(95 + rnd() * 70), x = rnd() * n, y = rnd() * n, r = rMin + rnd() * (rMax - rMin);
      ga.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
      for (const ox of [-n, 0, n]) for (const oy of [-n, 0, n]) { ga.beginPath(); ga.arc(x + ox, y + oy, r, 0, Math.PI * 2); ga.fill(); }
    }
    gb.filter = 'blur(' + blur + 'px)'; gb.drawImage(a, 0, 0);
    const src = gb.getImageData(0, 0, n, n).data, out = gb.createImageData(n, n);
    const h = (x, y) => src[((((y + n) % n) * n) + ((x + n) % n)) * 4] / 255;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const dx = (h(x + 1, y) - h(x - 1, y)) * strength, dy = (h(x, y + 1) - h(x, y - 1)) * strength, l = Math.hypot(dx, dy, 1), i = (y * n + x) * 4;
      out.data[i] = (-dx / l * 0.5 + 0.5) * 255; out.data[i + 1] = (-dy / l * 0.5 + 0.5) * 255; out.data[i + 2] = (1 / l * 0.5 + 0.5) * 255; out.data[i + 3] = 255;
    }
    gb.putImageData(out, 0, 0);
    const t = new T.CanvasTexture(b); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat, repeat);
    return t;
  };
  const peel = bumps(1400, 2, 7, 2, 2.4, 3, 7);       /* orange-peel powder coat */
  /* soft, low-frequency roughness variation so no painted surface looks perfectly uniform */
  const rough = (() => {
    const n = 128, c = document.createElement('canvas'), d = document.createElement('canvas'); c.width = c.height = d.width = d.height = n;
    const g = c.getContext('2d'); g.fillStyle = 'rgb(225,225,225)'; g.fillRect(0, 0, n, n);
    let sd = 5;
    const rnd = () => (sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296;
    for (let i = 0; i < 60; i++) { const v = Math.round(190 + rnd() * 65), x = rnd() * n, y = rnd() * n, r = 6 + rnd() * 18; g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; for (const ox of [-n, 0, n]) for (const oy of [-n, 0, n]) { g.beginPath(); g.arc(x + ox, y + oy, r, 0, Math.PI * 2); g.fill(); } }
    const gd = d.getContext('2d'); gd.filter = 'blur(6px)'; gd.drawImage(c, 0, 0);
    const t = new T.CanvasTexture(d); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(1.5, 1.5);
    return t;
  })();
  /* silver paint sampled from the photographed unit; internals are plain metal and ceramic */
  const paint = mat('#c3cccd', 0.42, 0.45, { clearcoat: 0.3, clearcoatRoughness: 0.45, normalMap: peel, normalScale: new T.Vector2(0.3, 0.3), roughnessMap: rough });
  const paintDS = paint.clone(); paintDS.side = T.DoubleSide;           /* rear half of each vessel (open towards the cutaway) */
  const shellPaint = paint.clone(); shellPaint.side = T.DoubleSide;     /* front sector of each vessel: fades for the cutaway */
  const cutMetal = mat('#89979a', 0.86, 0.32), cutFace = cutMetal.clone(); cutFace.side = T.DoubleSide;
  const lining = mat('#8d9a9c', 0.85, 0.34); lining.side = T.BackSide;
  const shellLining = lining.clone();
  const weld = mat('#9aadb0', 0.6, 0.5), zinc = mat('#aab4b5', 0.95, 0.24), steel = mat('#849297', 0.83, 0.4, { bumpMap: grain, bumpScale: 0.003, roughnessMap: rough });
  const chrome = mat('#a6b0b5', 0.95, 0.25);
  const dark = mat('#161d1c', 0.3, 0.45), black = mat('#101619', 0.35, 0.2, { clearcoat: 0.8, clearcoatRoughness: 0.15 });
  const rubber = mat('#191d1e', 0, 0.9, { bumpMap: grain, bumpScale: 0.014 });
  const brass = mat('#ad8d46', 0.82, 0.32), copper = mat('#bd683f', 0.88, 0.29);
  const ceramic = mat('#d9c9a6', 0, 0.9, { bumpMap: grain, bumpScale: 0.015 });
  const screenMat = mat('#98aba7', 0.88, 0.38), electrical = mat('#dce3d8', 0.05, 0.6);
  const red = mat('#d94326', 0.24, 0.22, { clearcoat: 0.8, clearcoatRoughness: 0.15 }), green = mat('#16a05a', 0.2, 0.25);
  const wireMats = [mat('#b14c36', 0.1, 0.55), mat('#3b6991', 0.1, 0.55), mat('#2f7347', 0.1, 0.55)];

  const group = (parent, id) => { const g = new T.Group(); (parent || model).add(g); if (id) g.userData.part = id; return g; };
  const keep = (g) => { g.userData.keep = true; return g; };
  /* every part that moves or isolates stays its own group; the rest is merged by material */
  const frame = keep(group()), vesselA = keep(group()), vesselB = keep(group()), shellA = keep(group()), shellB = keep(group());
  const bedA = keep(group()), bedB = keep(group()), screensA = keep(group()), screensB = keep(group());
  const manifolds = keep(group()), valves = keep(group()), purge = keep(group()), filters = keep(group()), cabinet = keep(group());
  const mesh = (geo, material, parent, x, y, z) => { const m = new T.Mesh(geo, material); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
  const box = (w, h, d, material, parent, x, y, z, bevel) => {
    bevel = bevel === undefined ? 0.012 : bevel;
    const key = [w, h, d, bevel].join(','); let geo = geometryCache.get(key);
    if (!geo) {
      const r = Math.min(bevel, w / 5, h / 5, d / 5), a = w / 2 - r, b = h / 2 - r, s = new T.Shape();
      s.moveTo(-a, -b); s.lineTo(a, -b); s.lineTo(a, b); s.lineTo(-a, b); s.closePath();
      geo = new T.ExtrudeGeometry(s, { depth: d - 2 * r, steps: 1, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 2, curveSegments: 2 });
      geo.translate(0, 0, -d / 2 + r); geometryCache.set(key, geo);
    }
    return mesh(geo, material, parent, x, y, z);
  };
  const cyl = (r, h, material, parent, x, y, z, seg) => mesh(new T.CylinderGeometry(r, r, h, seg || 32), material, parent, x, y, z);
  const torus = (r, tube, material, parent, x, y, z) => mesh(new T.TorusGeometry(r, tube, 8, 48), material, parent, x, y, z);
  const pipe = (points, r, material, parent) => {
    const curve = new T.CatmullRomCurve3(points.map((p) => V(p[0], p[1], p[2])), false, 'centripetal');
    const m = mesh(new T.TubeGeometry(curve, Math.max(24, points.length * 8), r, r < 0.03 ? 6 : 12, false), material, parent);
    m.castShadow = r > 0.05;
    return m;
  };
  const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; };
  const decal = (map, w, h, parent, x, y, z) => { const m = mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map, transparent: true, depthWrite: false }), parent, x, y, z); m.castShadow = m.receiveShadow = false; return m; };

  await pause();
  /* ---------- steel frame: four corner posts, base and top rails, as photographed ---------- */
  for (const x of [-1.48, 1.48]) for (const z of [-0.77, 0.77]) {
    box(0.095, 0.13, 0.095, paint, frame, x, 0.085, z); box(0.09, 1.9, 0.09, paint, frame, x, 1.05, z); box(0.22, 0.025, 0.24, paint, frame, x, 0.025, z);
    for (const dx of [-0.075, 0.075]) cyl(0.023, 0.025, zinc, frame, x + dx, 0.045, z, 6);
  }
  for (const z of [-0.77, 0.77]) { box(3.04, 0.1, 0.1, paint, frame, 0, 0.17, z); box(3.04, 0.09, 0.09, paint, frame, 0, 2.05, z); }
  for (const x of [-1.48, 1.48]) box(0.1, 0.1, 1.55, paint, frame, x, 0.17, 0);
  box(3.02, 0.08, 0.09, paint, frame, 0, 0.2, 0);
  for (const x of [-0.85, 0.85]) box(0.12, 0.1, 1.5, paint, frame, x, 0.2, 0);

  /* ---------- labels exactly as printed on the real unit: TOWER-1, TOWER-2, WIN, and the dial faces ---------- */
  const gaugeFace = canvasTex(256, 256, (g) => {
    g.fillStyle = '#e8ece7'; g.beginPath(); g.arc(128, 128, 120, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#17231f'; g.lineWidth = 3;
    for (let i = 0; i < 41; i++) { const a = Math.PI * 0.75 + i / 40 * Math.PI * 1.5, r = i % 5 === 0 ? 85 : 97; g.beginPath(); g.moveTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); g.lineTo(128 + Math.cos(a) * 110, 128 + Math.sin(a) * 110); g.stroke(); }
    g.lineWidth = 5; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + Math.cos(Math.PI * 0.75) * 78, 128 + Math.sin(Math.PI * 0.75) * 78); g.stroke();   /* needle at rest: no reading is implied */
  });
  const nameTex = (text, big) => canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = big ? '#0b8a3e' : '#1d3a8a'; g.font = '700 ' + (big ? 108 : 58) + 'px Archivo, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2);
  });
  /* the Win Equipments logo, redrawn at texture resolution from images/logo.png, wrapped onto the vessel where the WIN lettering is */
  const logoTex = canvasTex(564, 318, (g, w, h) => {
    g.fillStyle = '#46b14c'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff'; g.fillRect(10, 168, w - 20, 66);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff'; g.font = '700 142px Archivo, Arial, sans-serif';
    ['W', 'I', 'N'].forEach((ch, i) => g.fillText(ch, w / 2 + (i - 1) * 168, 88));
    g.fillStyle = '#3a3d3f'; g.font = '600 66px Archivo, Arial, sans-serif'; g.fillText('EQUIPMENTS', w / 2, 203);
    g.fillStyle = '#fff'; g.font = '600 26px Archivo, Arial, sans-serif'; g.fillText('Save Water & Power', w / 2, 276);
  });
  const logoMat = new T.MeshStandardMaterial({ map: logoTex, roughness: 0.5, metalness: 0.05 });
  const lampLabel = canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = '#e6ece8'; g.font = '600 34px Archivo, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('POWER ON', w * 0.21, h / 2); g.fillText('DRYER ON', w * 0.735, h / 2);
  });

  await pause();
  /* ---------- the two pressure vessels: welded dished shell, lined, with a removable front sector for the cutaway ---------- */
  const profile = [[0.16, 0.55], [0.16, 0.69], [0.26, 0.73], [0.4, 0.8], [0.52, 0.91], [0.58, 1.03], [0.58, 3.17], [0.54, 3.28], [0.44, 3.38], [0.3, 3.45], [0.16, 3.49], [0.16, 3.68]].map((p) => new T.Vector2(p[0], p[1]));
  const inner = profile.map((p) => new T.Vector2(Math.max(0.12, p.x - 0.025), p.y));
  const cutStart = -Math.PI * 0.38, cutLength = Math.PI * 0.76, restStart = Math.PI * 0.38, restLength = Math.PI * 1.24;
  const arcWeld = (R, y, start, length, parent) => {   /* a thin torus sector, in the lathe's own angle convention */
    const g = new T.TorusGeometry(R, 0.014, 6, 36, length); g.rotateX(Math.PI / 2); g.rotateY(start + length - Math.PI / 2);
    mesh(g, weld, parent, 0, y, 0).castShadow = false;
  };
  const wallEdge = (angle, parent) => {
    const vertices = [], indices = [];
    profile.forEach((p, i) => { for (const r of [p.x, Math.max(0.12, p.x - 0.025)]) vertices.push(Math.sin(angle) * r, p.y, Math.cos(angle) * r); if (i < profile.length - 1) { const v = i * 2; indices.push(v, v + 1, v + 2, v + 1, v + 3, v + 2); } });
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(vertices, 3)); g.setIndex(indices); g.computeVertexNormals();
    mesh(g, cutFace, parent).castShadow = false;
  };
  /* bed support screen: a perforated disc, built once and shared */
  const screenGeo = (() => {
    const shape = new T.Shape(); shape.absarc(0, 0, 0.525, 0, Math.PI * 2, false);
    for (let ring = 1; ring <= 4; ring++) { const count = ring * 8; for (let i = 0; i < count; i++) { const a = i / count * Math.PI * 2, hole = new T.Path(); hole.absarc(Math.cos(a) * ring * 0.104, Math.sin(a) * ring * 0.104, 0.023, 0, Math.PI * 2, true); shape.holes.push(hole); } }
    const g = new T.ExtrudeGeometry(shape, { depth: 0.025, bevelEnabled: false, curveSegments: 8 }); g.rotateX(Math.PI / 2); return g;
  })();
  const rimGeo = new T.TorusGeometry(0.525, 0.016, 6, 48).rotateX(Math.PI / 2);
  /* desiccant: tiny loose spheres, poured in at random from screen to screen (a few thousand per tower: only the layer you can see is
     modelled as separate beads, over a darker core that fills the middle). Beads are smaller on phones and low-end devices. */
  const BEAD = lite ? 0.024 : 0.016, BED_LO = 1.12, BED_HI = 2.98, BED_R = 0.535, SKIN = lite ? 0.07 : 0.075;
  const beadGeo = new T.IcosahedronGeometry(BEAD, 0);
  const towers = [{ x: -0.8, vessel: vesselA, shell: shellA, bed: bedA, screens: screensA, id: 'A' }, { x: 0.8, vessel: vesselB, shell: shellB, bed: bedB, screens: screensB, id: 'B' }];
  const fades = [shellPaint, shellLining];
  towers.forEach((t, index) => {
    const v = t.vessel, s = t.shell;
    v.position.x = t.x; s.position.x = t.x;
    mesh(new T.LatheGeometry(profile, 64, restStart, restLength), paintDS, v);
    mesh(new T.LatheGeometry(inner, 64, restStart, restLength), lining, v).castShadow = false;
    mesh(new T.LatheGeometry(profile, 40, cutStart, cutLength), shellPaint, s);
    mesh(new T.LatheGeometry(inner, 40, cutStart, cutLength), shellLining, s).castShadow = false;
    for (const y of [1.03, 3.17]) { arcWeld(0.582, y, restStart, restLength, v); arcWeld(0.582, y, cutStart, cutLength, s); }
    for (const a of [cutStart, cutStart + cutLength]) wallEdge(a, v);
    /* pressure gauge on the front sector, TOWER label and the Win mark, as photographed */
    const gx = index ? 0.32 : 0.22;
    const gg = group(s); gg.position.set(gx, 2.85, 0.59);
    const body = cyl(0.145, 0.075, zinc, gg); body.rotation.x = Math.PI / 2; torus(0.136, 0.018, zinc, gg, 0, 0, 0.045); decal(gaugeFace, 0.25, 0.25, gg, 0, 0, 0.05);
    decal(nameTex(index ? 'TOWER-1' : 'TOWER-2'), 0.46, 0.115, s, 0, 2.31, 0.589);
    if (!index) {   /* the logo follows the curve of the vessel (radius 0.58), below the frame's top rail so it is not hidden */
      const lw = 0.56, lh = lw * 318 / 564, patch = new T.CylinderGeometry(0.585, 0.585, lh, 24, 1, true, -lw / 0.585 / 2, lw / 0.585);
      const logo = mesh(patch, logoMat, s, 0, 1.5, 0); logo.castShadow = false;
    }
    /* relief fitting and lifting eye on the head, flanges top and bottom */
    const rg = group(v); rg.position.set(0.3, 3.43, 0.08);
    const stem = cyl(0.035, 0.22, brass, rg, 0, 0.08, 0); stem.rotation.z = -0.3; cyl(0.05, 0.055, brass, rg, 0.028, 0.19, 0, 8);
    torus(0.06, 0.018, zinc, v, -0.18, 3.67, 0);
    for (const y of [3.67, 0.57]) {
      cyl(0.25, 0.065, paint, v, 0, y, 0, 40); torus(0.21, 0.018, cutMetal, v, 0, y, 0).rotation.x = Math.PI / 2;
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; cyl(0.027, 0.08, zinc, v, Math.sin(a) * 0.205, y + 0.055, Math.cos(a) * 0.205, 6); }
    }
    box(0.18, 0.08, 0.12, paint, v, -0.42, 1.1, 0); box(0.18, 0.08, 0.12, paint, v, 0.42, 1.1, 0);
    /* illustrative bed: loosely poured beads, jittered off a grid so no rows or layers show, filling the tower from screen to screen */
    t.bed.position.x = t.x; t.bed.visible = false;
    const packing = [], pitch = BEAD * 2.08, r0 = BED_R - SKIN; let sd = 191 + index * 7919;
    const rnd = () => (sd = (1664525 * sd + 1013904223) >>> 0) / 4294967296;
    const nx = Math.ceil(BED_R / pitch);
    for (let y = BED_LO + BEAD; y <= BED_HI; y += pitch) for (let row = -nx, ox = rnd(), oz = rnd(); row <= nx; row++) for (let col = -nx; col <= nx; col++) {
      const px = (col + ox + (rnd() - 0.5) * 0.8) * pitch, pz = (row + oz + (rnd() - 0.5) * 0.8) * pitch, py = y + (rnd() - 0.5) * pitch * 0.7, rr = Math.hypot(px, pz);
      if (rr >= r0 && rr <= BED_R && py >= BED_LO && py <= BED_HI + BEAD * 0.4) packing.push([px, py, pz]);
    }
    const beads = new T.InstancedMesh(beadGeo, ceramic, packing.length), dummy = new T.Object3D();
    t.beadH = new Float32Array(packing.length); t.beadBase = new Float32Array(packing.length * 3); t.beadCol = new T.Color();
    packing.forEach((p, i) => {
      dummy.position.set(p[0], p[1], p[2]); dummy.scale.setScalar(0.82 + rnd() * 0.3); dummy.rotation.set(rnd() * 6.28, rnd() * 6.28, 0); dummy.updateMatrix();
      t.beadCol.setHSL(0.11 + rnd() * 0.012, 0.12 + rnd() * 0.1, 0.6 + rnd() * 0.16);
      beads.setMatrixAt(i, dummy.matrix); beads.setColorAt(i, t.beadCol);
      t.beadH[i] = (p[1] - BED_LO) / (BED_HI - BED_LO); t.beadBase[i * 3] = t.beadCol.r; t.beadBase[i * 3 + 1] = t.beadCol.g; t.beadBase[i * 3 + 2] = t.beadCol.b;
    });
    beads.receiveShadow = true; t.bed.add(beads); t.beads = beads;
    /* the core under the visible beads: a darker tube whose vertex colours follow the same moisture front */
    const coreGeo = new T.CylinderGeometry(r0 + BEAD * 0.6, r0 + BEAD * 0.6, BED_HI - BED_LO, 28, 40, true);
    const cp = coreGeo.attributes.position, cc = new Float32Array(cp.count * 3);
    t.coreH = new Float32Array(cp.count); t.coreCol = cc;
    for (let i = 0; i < cp.count; i++) { t.coreH[i] = cp.getY(i) / (BED_HI - BED_LO) + 0.5; cc[i * 3] = 0.43; cc[i * 3 + 1] = 0.38; cc[i * 3 + 2] = 0.29; }
    coreGeo.setAttribute('color', new T.BufferAttribute(cc, 3));
    t.core = new T.Mesh(coreGeo, new T.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }));
    t.core.position.y = (BED_LO + BED_HI) / 2; t.bed.add(t.core);
    /* upper and lower support screens */
    t.screens.position.x = t.x; t.screens.visible = false;
    t.lower = group(t.screens); t.lower.position.y = 1.075; t.upper = group(t.screens); t.upper.position.y = 3.02;
    for (const g of [t.lower, t.upper]) { mesh(screenGeo, screenMat, g); mesh(rimGeo, zinc, g).castShadow = false; }
  });

  await pause();
  /* ---------- air manifolds, purge line, valves, mufflers, rear housings ---------- */
  pipe([[-0.8, 3.72, 0], [-0.8, 4.05, 0], [-0.6, 4.22, 0], [0.6, 4.22, 0], [0.8, 4.05, 0], [0.8, 3.72, 0]], 0.13, paint, manifolds);
  pipe([[-1.7, 0.43, 0], [-0.8, 0.43, 0], [0, 0.43, 0], [0.8, 0.43, 0], [1.7, 0.43, 0]], 0.125, paint, manifolds);
  for (const x of [-0.8, 0.8]) pipe([[x, 0.43, 0], [x, 0.51, 0], [x, 0.56, 0]], 0.13, paint, manifolds);
  for (const x of [-0.45, 0.45]) {
    const f = cyl(0.22, 0.08, paint, manifolds, x, 4.22, 0); f.rotation.z = Math.PI / 2;
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, b = cyl(0.026, 0.105, zinc, manifolds, x + 0.07, 4.22 + Math.sin(a) * 0.18, Math.cos(a) * 0.18, 6); b.rotation.z = Math.PI / 2; }
  }
  pipe([[-0.8, 3.8, 0.26], [-0.6, 3.83, 0.35], [0, 3.83, 0.35], [0.6, 3.83, 0.35], [0.8, 3.8, 0.26]], 0.027, brass, purge);
  box(0.12, 0.11, 0.09, brass, purge, 0, 3.82, 0.35); box(0.2, 0.018, 0.04, dark, purge, 0, 3.91, 0.35);
  for (const x of [-0.8, 0.8]) {
    const collar = cyl(0.21, 0.085, dark, valves, x, 0.43, 0); collar.rotation.z = Math.PI / 2;
    box(0.23, 0.18, 0.24, dark, valves, x, 0.65, 0.02); box(0.14, 0.15, 0.16, cutMetal, valves, x, 0.82, 0.02); box(0.055, 0.085, 0.09, black, valves, x + 0.13, 0.67, 0.09);
    pipe([[x, 0.74, 0.15], [x, 0.93, 0.27], [0, 1.25, 0.27]], 0.013, black, valves);
  }
  for (const x of [-1.2, 1.2]) {
    cyl(0.07, 0.35, cutMetal, purge, x, 0.67, -0.28);
    for (let i = 0; i < 8; i++) torus(0.073, 0.006, dark, purge, x, 0.53 + i * 0.036, -0.28).rotation.x = Math.PI / 2;
    pipe([[x, 0.48, -0.28], [x, 0.43, -0.08]], 0.035, brass, purge);
  }
  /* main inlet comes in at the front, centre, and meets the base pipe at a tee; an inlet valve on each side sends it to one tower. The dry outlet
     leaves from the middle of the top header. Valve positions are an illustration of the principle, not the piping of a particular model. */
  const flangeZ = (z, y, x, parent, r) => { const f = cyl(r || 0.21, 0.06, paint, parent, x, y, z, 36); f.rotation.x = Math.PI / 2; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, b = cyl(0.022, 0.085, zinc, parent, x + Math.cos(a) * ((r || 0.21) - 0.04), y + Math.sin(a) * ((r || 0.21) - 0.04), z, 6); b.rotation.x = Math.PI / 2; } };
  pipe([[0, 0.43, 0], [0, 0.43, 0.7], [0, 0.43, 1.42]], 0.13, paint, manifolds);
  flangeZ(1.44, 0.43, 0, manifolds); flangeZ(0.55, 0.43, 0, manifolds, 0.19);
  const hub = mesh(new T.SphereGeometry(0.15, 24, 16), paint, manifolds, 0, 0.43, 0);
  for (const x of [-1.72, 1.72]) { const cap = cyl(0.17, 0.045, paint, manifolds, x, 0.43, 0, 32); cap.rotation.z = Math.PI / 2; }
  pipe([[0, 4.22, 0], [0, 4.22, 0.55], [0, 4.22, 1.0]], 0.13, paint, manifolds);
  flangeZ(1.02, 4.22, 0, manifolds);
  const leverMat = mat('#c9a227', 0.5, 0.35), VALVE = [];   /* [inlet A, inlet B, exhaust A, exhaust B] */
  for (const [kind, x, size] of [['in', -0.4, 1.4], ['in', 0.4, 1.4], ['ex', -1.02, 1], ['ex', 1.02, 1]]) {
    box(0.17 * size, 0.27 * size, 0.27 * size, dark, valves, x, 0.43, 0);
    for (const dx of [-1, 1]) { const f = cyl(0.17 * size, 0.025, paint, valves, x + dx * 0.1 * size, 0.43, 0, 28); f.rotation.z = Math.PI / 2; }
    cyl(0.05 * size, 0.15 * size, cutMetal, valves, x, 0.43 + 0.2 * size, 0, 16);
    const lever = keep(group(valves)); lever.position.set(x, 0.43 + 0.3 * size, 0);
    const bar = new T.Mesh(new T.BoxGeometry(0.26 * size, 0.026, 0.045), leverMat); bar.castShadow = true; lever.add(bar);
    const knob = new T.Mesh(new T.SphereGeometry(0.03, 12, 8), leverMat); knob.position.x = 0.13 * size; lever.add(knob);
    const lampMat = new T.MeshBasicMaterial({ color: '#7a2a22' });
    const lamp = keep(group(valves)); const lm = new T.Mesh(new T.CylinderGeometry(0.036 * size, 0.036 * size, 0.024, 16), lampMat); lm.rotation.x = Math.PI / 2; lamp.add(lm); lamp.position.set(x, 0.43 - 0.03 * size, 0.138 * size);
    VALVE.push({ lever, lampMat, cur: 0, tgt: 0, kind });
  }

  /* the two small vessels behind the frame: one past the left end and one between the towers, under the control box */
  for (const x of [-1.46, 0.02]) {
    cyl(0.15, 1.45, paint, filters, x, 1.55, -0.45, 32);
    const top = mesh(new T.SphereGeometry(0.15, 24, 12), paint, filters, x, 2.275, -0.45); top.scale.y = 0.45;
    torus(0.15, 0.02, zinc, filters, x, 1.95, -0.45).rotation.x = Math.PI / 2; cyl(0.04, 0.14, brass, filters, x, 0.75, -0.45, 12);
  }
  pipe([[-0.17, 1.85, 0.94], [-0.1, 1.1, 0.7], [0, 0.95, 0.45]], 0.012, black, valves);

  await pause();
  /* ---------- control box on the upper rail: hinged door with the two lamps and the switch, timer and terminals behind it ---------- */
  cabinet.position.set(0, 2.43, 0.82);
  for (const x of [-0.16, 0.16]) box(0.025, 0.09, 0.06, zinc, cabinet, x, -0.325, -0.14);
  box(0.47, 0.59, 0.02, dark, cabinet, 0, 0, -0.105);
  for (const x of [-0.226, 0.226]) box(0.018, 0.59, 0.23, dark, cabinet, x, 0, 0);
  for (const y of [-0.286, 0.286]) box(0.47, 0.018, 0.23, dark, cabinet, 0, y, 0);
  const doorPivot = keep(group(cabinet)); doorPivot.position.set(-0.236, 0, 0.125);
  box(0.47, 0.59, 0.025, dark, doorPivot, 0.236, 0, 0);
  for (const y of [-0.2, 0.2]) cyl(0.013, 0.065, zinc, cabinet, -0.235, y, 0.125, 8);
  for (const p of [[0.12, red], [0.33, green]]) { const l = cyl(0.026, 0.016, p[1], doorPivot, p[0], 0.15, 0.026, 20); l.rotation.x = Math.PI / 2; torus(0.03, 0.006, zinc, doorPivot, p[0], 0.15, 0.032); }
  decal(lampLabel, 0.4, 0.1, doorPivot, 0.236, 0.23, 0.0275);
  box(0.055, 0.09, 0.018, electrical, doorPivot, 0.235, -0.1, 0.026); box(0.021, 0.05, 0.024, black, doorPivot, 0.235, -0.1, 0.034);
  const mech = group(cabinet); box(0.4, 0.51, 0.008, electrical, mech, 0, 0, -0.087);
  for (const x of [-0.17, 0.17]) for (const y of [-0.22, 0.22]) cyl(0.008, 0.013, zinc, mech, x, y, -0.075, 6).rotation.x = Math.PI / 2;
  box(0.36, 0.025, 0.018, zinc, mech, 0, -0.17, -0.062);
  for (let i = 0; i < 7; i++) { const x = -0.13 + i * 0.043; box(0.037, 0.065, 0.052, electrical, mech, x, -0.15, -0.035); box(0.028, 0.016, 0.008, dark, mech, x, -0.15, -0.005); for (const y of [-0.175, -0.125]) cyl(0.007, 0.008, brass, mech, x, y, -0.003, 6).rotation.x = Math.PI / 2; }
  box(0.12, 0.17, 0.07, electrical, mech, -0.08, 0.08, -0.043); box(0.09, 0.065, 0.008, dark, mech, -0.08, 0.09, -0.003);
  box(0.17, 0.19, 0.04, cutMetal, mech, 0.095, 0.07, -0.057); cyl(0.065, 0.045, dark, mech, 0.095, 0.07, -0.014).rotation.x = Math.PI / 2;
  for (let i = 0; i < 6; i++) box(0.016, 0.034, 0.015, brass, mech, 0.095 + Math.sin(i / 6 * Math.PI * 2) * 0.064, 0.07 + Math.cos(i / 6 * Math.PI * 2) * 0.064, 0.015);
  for (let i = 0; i < 7; i++) { const x = -0.13 + i * 0.043; pipe([[x, -0.115, -0.025], [x, -0.07, -0.03], [-0.17 + i * 0.051, -0.015, -0.035], [-0.17 + i * 0.051, 0.18, -0.04]], 0.004, wireMats[i % 3], mech); }
  pipe([[-0.2, -0.21, 0.02], [-0.26, -0.22, 0.15], [-0.31, -0.13, 0.23]], 0.006, black, cabinet); cyl(0.021, 0.035, black, cabinet, -0.17, -0.31, -0.02);

  await pause();
  /* ---------- merge static meshes by material: hundreds of draw calls become a few dozen ---------- */
  const bake = (root) => {
    root.updateMatrixWorld(true);
    const inv = new T.Matrix4().copy(root.matrixWorld).invert(), rel = new T.Matrix4();
    const buckets = new Map(), drop = [];
    const visit = (o) => {
      for (const c of o.children) {
        if (c.userData.keep) continue;
        if (c.isMesh && !c.isInstancedMesh) {
          const k = c.material.uuid + (c.castShadow ? '|s' : '|n');
          let b = buckets.get(k);
          if (!b) { b = { mat: c.material, cast: c.castShadow, geos: [] }; buckets.set(k, b); }
          const g = c.geometry.index ? c.geometry.toNonIndexed() : c.geometry.clone();
          g.clearGroups();
          Object.keys(g.attributes).forEach((n) => { if (n !== 'position' && n !== 'normal' && n !== 'uv') g.deleteAttribute(n); });
          if (!g.attributes.uv) g.setAttribute('uv', new T.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
          g.applyMatrix4(rel.multiplyMatrices(inv, c.matrixWorld));
          b.geos.push(g); drop.push(c);
        }
        visit(c);
      }
    };
    visit(root);
    drop.forEach((c) => c.parent.remove(c));
    buckets.forEach((b) => {
      const m = new T.Mesh(mergeGeometries(b.geos), b.mat);
      m.castShadow = b.cast; m.receiveShadow = true;
      b.geos.forEach((g) => g.dispose());
      root.add(m);
    });
  };
  /* merge each part's static meshes by material, so a few dozen draw calls replace hundreds */
  [frame, vesselA, vesselB, shellA, shellB, manifolds, valves, purge, filters, cabinet, doorPivot].forEach(bake);
  geometryCache.forEach((g) => g.dispose());
  const rotor = new T.Object3D();   /* this unit has no fan; the viewer API keeps the same shape as the chiller's */

  /* ---------- light: studio reflections, soft key shadow, interior lamp that comes up as it opens ---------- */
  const studio = new T.Scene(); studio.background = new T.Color('#697879');
  studio.add(new T.Mesh(new T.BoxGeometry(14, 12, 14), new T.MeshBasicMaterial({ color: '#5b6666', side: T.BackSide })));
  for (const l of [[-4, 4, 2, 4, 7, Math.PI / 2], [4, 3, 0, 3, 6, -Math.PI / 2], [0, 5, -3, 7, 3, 0]]) {
    const m = new T.Mesh(new T.PlaneGeometry(l[3], l[4]), new T.MeshBasicMaterial({ color: '#fff8e7' })); m.position.set(l[0], l[1], l[2]); m.rotation.y = l[5]; studio.add(m);
  }
  const pmrem = new T.PMREMGenerator(renderer), envTarget = pmrem.fromScene(studio, 0.08); extras.add(envTarget); scene.environment = envTarget.texture; scene.environmentIntensity = 0.66; pmrem.dispose();
  studio.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });
  scene.add(new T.HemisphereLight('#e4efee', '#4f5754', 1.45));
  const key = new T.DirectionalLight('#fff2da', 3.4); key.position.set(-3.4, 8.5, 4.6); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -4.2, right: 4.2, top: 6.2, bottom: -2.6, near: 3, far: 20 });
  key.shadow.normalBias = 0.02; key.shadow.bias = -0.0004; key.shadow.radius = 9; key.shadow.blurSamples = 16; scene.add(key);
  const fill = new T.DirectionalLight('#c0e3ff', 1.5); fill.position.set(4, 4, -2); scene.add(fill);
  const frontLight = new T.DirectionalLight('#e1f0de', 1.1); frontLight.position.set(1, 2, 6); scene.add(frontLight);
  const lamp = new T.PointLight('#fff1dc', 0, 6, 2); lamp.position.set(0, 2.1, 1.5); model.add(lamp);
  const floor = new T.Mesh(new T.PlaneGeometry(40, 40), new T.ShadowMaterial({ opacity: 0.13 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  await pause();
  /* ---------- contact shadow: the unit rendered from below into a blurred texture, darker where it touches the floor ---------- */
  const CS = 7, CS_H = 2.4;
  const rtA = new T.WebGLRenderTarget(512, 512), rtB = new T.WebGLRenderTarget(512, 512);
  extras.add(rtA); extras.add(rtB);
  rtA.texture.generateMipmaps = rtB.texture.generateMipmaps = false;
  const csGeo = new T.PlaneGeometry(CS, CS).rotateX(Math.PI / 2);
  const csPlane = new T.Mesh(csGeo, new T.MeshBasicMaterial({ map: rtA.texture, opacity: 0.8, transparent: true, depthWrite: false }));
  /* the rig turns with the model, so the baked contact shadow stays valid while the unit is rotated */
  const csRig = new T.Group(); scene.add(csRig);
  csPlane.renderOrder = 1; csPlane.scale.y = -1; csPlane.position.y = 0.003; csRig.add(csPlane);
  const blurPlane = new T.Mesh(csGeo); blurPlane.visible = false; csRig.add(blurPlane);
  const csCam = new T.OrthographicCamera(-CS / 2, CS / 2, CS / 2, -CS / 2, 0, CS_H); csCam.rotation.x = Math.PI / 2; csRig.add(csCam);
  const depthMat = new T.MeshDepthMaterial(); depthMat.userData.darkness = { value: 1.25 };
  depthMat.onBeforeCompile = (sh) => {
    sh.uniforms.darkness = depthMat.userData.darkness;
    sh.fragmentShader = 'uniform float darkness;\n' + sh.fragmentShader.replace('gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );', 'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );');
  };
  depthMat.depthTest = depthMat.depthWrite = false;
  const blurMat = (horizontal) => {
    let taps = '';
    [[-4, 0.051], [-3, 0.0918], [-2, 0.12245], [-1, 0.1531], [0, 0.1633], [1, 0.1531], [2, 0.12245], [3, 0.0918], [4, 0.051]].forEach((tp) => {
      const o = tp[0].toFixed(1) + ' * d';
      taps += 's += texture2D(tDiffuse, vUv + vec2(' + (horizontal ? o + ', 0.0' : '0.0, ' + o) + ')) * ' + tp[1] + ';\n';
    });
    return new T.ShaderMaterial({
      uniforms: { tDiffuse: { value: null }, d: { value: 1 / 256 } }, depthTest: false,
      vertexShader: 'varying vec2 vUv;\nvoid main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform sampler2D tDiffuse;\nuniform float d;\nvarying vec2 vUv;\nvoid main() { vec4 s = vec4(0.0);\n' + taps + 'gl_FragColor = s; }'
    });
  };
  const hBlur = blurMat(true), vBlur = blurMat(false);
  extras.add(depthMat); extras.add(hBlur); extras.add(vBlur);
  const blur = (amount) => {
    blurPlane.visible = true;
    blurPlane.material = hBlur; hBlur.uniforms.tDiffuse.value = rtA.texture; hBlur.uniforms.d.value = amount / 256;
    renderer.setRenderTarget(rtB); renderer.render(blurPlane, csCam);
    blurPlane.material = vBlur; vBlur.uniforms.tDiffuse.value = rtB.texture; vBlur.uniforms.d.value = amount / 256;
    renderer.setRenderTarget(rtA); renderer.render(blurPlane, csCam);
    blurPlane.visible = false;
  };
  const updateContact = () => {
    ghosted.forEach((o) => { o.visible = false; });   /* only solid parts darken the floor */
    floor.visible = csPlane.visible = false;
    scene.overrideMaterial = depthMat;
    renderer.setRenderTarget(rtA); renderer.clear(); renderer.render(scene, csCam);
    scene.overrideMaterial = null;
    blur(3.4); blur(1.3);
    renderer.setRenderTarget(null);
    floor.visible = csPlane.visible = true;
    ghosted.forEach((o) => { o.visible = true; });
  };

  /* ---------- hotspot anchors: closed = on the outside, open = on the part (anchored to the part's group, so they follow it) ---------- */
  const anchor = (obj, p, n) => ({ obj, p: V(p[0], p[1], p[2]), n: V(n[0], n[1], n[2]).normalize() });
  const CLOSED = {
    1: anchor(cabinet, [0, 0.02, 0.15], [0, 0, 1]),
    2: anchor(model, [-1.05, 2.6, 0.36], [-0.5, 0, 1]),
    3: anchor(model, [0.8, 1.95, 0.6], [0.15, 0, 1]),
    4: anchor(manifolds, [0, 4.36, 0.06], [0, 0.5, 1]),
    5: anchor(valves, [-0.8, 0.74, 0.26], [0, 0, 1]),
    6: anchor(frame, [1.1, 2.05, 0.82], [0, 0, 1]),
    7: anchor(filters, [-1.46, 1.9, -0.3], [-1, 0, 0.5])
  };
  const EXPLODED = Object.assign({}, CLOSED, {
    2: anchor(shellA, [0, 3.0, 0.5], [0, 0.3, 1]),
    3: anchor(bedA, [0, 2.0, 0.5], [0, 0, 1])
  });
  const OPEN = Object.assign({}, CLOSED, {
    1: anchor(cabinet, [0, 0.05, 0.02], [0, 0, 1]),
    2: anchor(vesselA, [-0.56, 2.7, 0.1], [-1, 0, 0.35]),
    3: anchor(bedA, [0, 2.75, 0.45], [0, 0, 1])
  });

  /* ---------- isolate: the chosen part stays solid, everything else turns to a pale ghost ---------- */
  const ghost = new T.MeshBasicMaterial({ color: '#a9bccb', transparent: true, opacity: 0.12, depthWrite: false });
  const PART_GROUPS = { 1: [cabinet], 2: [vesselA, vesselB, shellA, shellB], 3: [bedA, bedB, screensA, screensB], 4: [manifolds], 5: [valves, purge], 6: [frame], 7: [filters] };
  let isolated = 0;
  const ghosted = [];
  const applyIsolate = (n) => {
    if (n === isolated) return;
    isolated = n;
    ghosted.length = 0;
    const keepSet = new Set(PART_GROUPS[n] || []);
    const inKept = (o) => { for (let q = o; q && q !== model; q = q.parent) if (keepSet.has(q)) return true; return false; };
    model.traverse((o) => {
      if (!o.isMesh || o.userData.flow) return;
      if (!o.userData.mat) { o.userData.mat = o.material; o.userData.cast = o.castShadow; }
      const solid = !n || inKept(o);
      o.material = solid ? o.userData.mat : ghost;
      o.castShadow = solid ? o.userData.cast : false;   /* ghosts cast no shadow */
      if (!solid) ghosted.push(o);
    });
  };

  /* ---------- exploded view: dashed guides join each separated piece to where it sat ---------- */
  const guideMat = new T.LineDashedMaterial({ color: '#7c9a8b', transparent: true, opacity: 0.5, dashSize: 0.065, gapSize: 0.045 });
  const guides = [];
  towers.forEach((t, index) => {
    for (const kind of ['shell', 'upper', 'lower']) {
      const line = new T.Line(new T.BufferGeometry().setFromPoints([V(0, 0, 0), V(0, 0, 0)]), guideMat);
      line.visible = false; line.frustumCulled = false; model.add(line); guides.push({ line, t, kind, sign: index ? 1 : -1 });
    }
  });

  await pause();
  /* ---------- how it works: dashes flow along the air paths (illustrative; the real internal piping is not photographed) ---------- */
  const flow = group(); flow.userData.keep = true;
  const flowItems = [];
  const flowMat = (hex, repeat) => new T.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: new T.Color(hex) }, uOpacity: { value: 0 }, uRepeat: { value: repeat }, uSpeed: { value: reduce ? 0 : 0.9 } },
    transparent: true, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv;\nvoid main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform float uTime;\nuniform float uOpacity;\nuniform float uRepeat;\nuniform float uSpeed;\nuniform vec3 uColor;\nvarying vec2 vUv;\nvoid main() {\n  float s = fract(vUv.x * uRepeat - uTime * uSpeed);\n  float a = smoothstep(0.0, 0.1, s) * (1.0 - smoothstep(0.55, 0.62, s));\n  vec3 c = mix(uColor * 0.6, uColor * 1.2, s);\n  gl_FragColor = vec4(c, (0.22 + 0.78 * a) * uOpacity);\n  #include <colorspace_fragment>\n}'
  });
  const flowPath = (points, hex, steps, dim) => {
    const curve = new T.CatmullRomCurve3(points.map((q) => V(q[0], q[1], q[2])), false, 'centripetal');
    const m = new T.Mesh(new T.TubeGeometry(curve, Math.max(40, points.length * 16), 0.04, 8, false), flowMat(hex, curve.getLength() / 0.22));
    m.renderOrder = 10; m.userData.flow = true; m.frustumCulled = false;
    flow.add(m); flowItems.push({ m, steps, dim: dim || [] });
  };
  const C = { wet: '#f39a3d', dry: '#2f8bff', purge: '#36d1ff' };
  /* The cycle, in six steps. Tower A is on line while Tower B is purged, both at the same time; then the towers swap.
       1 wet air in   2 adsorb   3 purge (B, while A keeps drying)   4 repressurise B   5 switch   6 the same, swapped.
     sign mirrors the paths across the centre line for the swapped half. */
  const flowSet = (sign, on, dimOn) => {
    const m = (pts) => pts.map((q) => [q[0] * sign, q[1], q[2]]);
    flowPath(m([[0, 0.43, 0], [-0.4, 0.43, 0], [-0.78, 0.43, 0], [-0.8, 0.6, 0], [-0.8, 1.1, 0]]), C.wet, on.wetIn, dimOn);      /* through the inlet valve and into the bottom of the tower */
    flowPath(m([[-0.8, 1.1, 0], [-0.8, 2.05, 0], [-0.8, 3.0, 0]]), C.wet, on.bed, dimOn);                                              /* up through the desiccant bed */
    flowPath(m([[-0.8, 3.0, 0], [-0.8, 3.72, 0], [-0.8, 4.05, 0], [-0.6, 4.22, 0], [0, 4.22, 0], [0, 4.22, 0.5], [0, 4.22, 1.0]]), C.dry, on.dry, dimOn);   /* dry air leaves through the top outlet */
    flowPath(m([[0, 4.22, 0], [0.6, 4.22, 0], [0.8, 4.05, 0], [0.8, 3.72, 0], [0.8, 3.0, 0], [0.8, 1.1, 0], [0.8, 0.56, 0], [1.05, 0.43, -0.05], [1.2, 0.45, -0.28], [1.2, 0.85, -0.28]]), C.purge, on.purge, dimOn);   /* purge down the other tower and out of the muffler */
  };
  flowPath([[0, 0.43, 1.45], [0, 0.43, 0.7], [0, 0.43, 0]], C.wet, [1, 2, 3, 4, 6], [5]);   /* the main inlet, at the front, feeds whichever tower is on line */
  flowSet(1, { wetIn: [1, 2, 3, 4], bed: [2, 3, 4], dry: [2, 3, 4], purge: [3] }, [5]);
  flowSet(-1, { wetIn: [6], bed: [6], dry: [6], purge: [6] }, [5]);
  /* Tower B refills with dry air before the switch (step 4): a short slow path down from the top header */
  flowPath([[0, 4.22, 0], [0.6, 4.22, 0], [0.8, 4.05, 0], [0.8, 3.72, 0], [0.8, 3.0, 0], [0.8, 2.3, 0]], C.dry, [4]);

  /* soft sprites: damp air leaving the purge mufflers, and a glow where the timer and the valves act at the switch */
  const softTex = canvasTex(64, 64, (g, w, h) => { const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); r.addColorStop(0, 'rgba(255,255,255,0.95)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
  const puffs = [], glows = [];
  for (const mx of [-1.2, 1.2]) for (let k = 0; k < 5; k++) {
    const sp = new T.Sprite(new T.SpriteMaterial({ map: softTex, color: '#cfe4ee', transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    sp.visible = false; sp.renderOrder = 12; sp.userData.flow = true; sp.userData.x = mx; sp.userData.ph = k / 5; model.add(sp); puffs.push(sp);
  }
  for (const gp of [[0, 2.45, 1.0, 1.0], [-0.8, 0.68, 0.3, 0.8], [0.8, 0.68, 0.3, 0.8]]) {
    const sp = new T.Sprite(new T.SpriteMaterial({ map: softTex, color: '#ffa31a', transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    sp.position.set(gp[0], gp[1], gp[2]); sp.scale.set(gp[3], gp[3], 1); sp.visible = false; sp.renderOrder = 12; sp.userData.flow = true; model.add(sp); glows.push(sp);
  }
  /* Valves per step: [inlet A, inlet B, exhaust A, exhaust B], 1 = open. Tower A is on line in steps 1 to 4, Tower B in step 6. */
  const VS = { 0: [1, 0, 0, 0], 1: [1, 0, 0, 0], 2: [1, 0, 0, 0], 3: [1, 0, 0, 1], 4: [1, 0, 0, 0], 5: [0.5, 0.5, 0, 0], 6: [0, 1, 1, 0] };
  const OPEN_C = new T.Color('#3fd16b'), MID_C = new T.Color('#f0a81c'), SHUT_C = new T.Color('#7a2a22');
  const paintValves = () => VALVE.forEach((vv) => {
    vv.lever.rotation.y = (1 - vv.cur) * Math.PI / 2;
    if (vv.cur > 0.5) vv.lampMat.color.copy(MID_C).lerp(OPEN_C, (vv.cur - 0.5) * 2); else vv.lampMat.color.copy(SHUT_C).lerp(MID_C, vv.cur * 2);
  });
  const setValves = (instant) => {
    const set = VS[st.step] || VS[0], on = ease(st.flow) > 0.002;
    VALVE.forEach((vv, i) => { vv.tgt = on ? set[i] : VS[0][i]; if (instant || !on || reduce) vv.cur = vv.tgt; });
    paintValves();
  };
  /* The moisture front: the wetted part of each bed. A tower that is drying wets from the bottom up; a purged tower dries from the top down.
     Heights are fractions of the bed. This is an illustration of the principle, not a measurement. */
  const WET = new T.Color('#5f86a0');
  const FRONT_TARGET = { 0: [0.5, 0.5], 1: [0.1, 0.85], 2: [0.85, 0.85], 3: [0.85, 0.1], 4: [0.85, 0.1], 5: [0.85, 0.1], 6: [0.1, 0.85] };
  const front = [0.1, 0.85];
  let frontLock = false;   /* stills and video frames set the wetted zones themselves */
  let lastFlowT = 0, paintedFront = [-1, -1], paintedF = -1, paintClock = 0;
  const paintBeds = (f, force) => {
    if (!force && Math.abs(f - paintedF) < 0.004 && Math.abs(front[0] - paintedFront[0]) < 0.004 && Math.abs(front[1] - paintedFront[1]) < 0.004) return;
    paintedF = f; paintedFront = front.slice();
    towers.forEach((t, i) => {
      const arr = t.beads.instanceColor.array, n = t.beadH.length;
      for (let k = 0; k < n; k++) {
        const wet = clamp01((front[i] - t.beadH[k]) / 0.12 + 0.5) * 0.8 * f, b = k * 3;
        arr[b] = t.beadBase[b] + (WET.r - t.beadBase[b]) * wet; arr[b + 1] = t.beadBase[b + 1] + (WET.g - t.beadBase[b + 1]) * wet; arr[b + 2] = t.beadBase[b + 2] + (WET.b - t.beadBase[b + 2]) * wet;
      }
      t.beads.instanceColor.needsUpdate = true;
      const cc = t.coreCol;
      for (let k = 0; k < t.coreH.length; k++) {
        const wet = clamp01((front[i] - t.coreH[k]) / 0.12 + 0.5) * 0.8 * f, b = k * 3;
        cc[b] = 0.43 + (WET.r * 0.6 - 0.43) * wet; cc[b + 1] = 0.38 + (WET.g * 0.6 - 0.38) * wet; cc[b + 2] = 0.29 + (WET.b * 0.6 - 0.29) * wet;
      }
      t.core.geometry.attributes.color.needsUpdate = true;
    });
  };

  /* ---------- state, camera, layout ---------- */
  const target = V(0, 2.0, 0);
  const st = { open: 0, explode: 0, flow: 0, step: 1, zoom: 1, focus: 0, lift: true, inset: 0, isolate: 0, still: false };
  let viewW = 1, viewH = 1;
  let baseDist = 9, dist = 9, elev = 14 * Math.PI / 180, fanSpeed = 0, shapeDirty = true, shadowDirty = true, flowTime = 0;
  const placeCamera = () => {
    const e = ease(st.open), x = ease(st.explode), f = ease(st.flow);
    /* how it works: the caption card covers the bottom st.inset pixels of the stage, so the model is framed in the space above it */
    const inset = st.still ? 0 : Math.min(st.inset * f, viewH * 0.55);
    dist = baseDist * (1 - 0.04 * e + 0.2 * x + (st.inset ? 0.04 : st.lift ? 0.24 : 0.08) * f) * st.zoom * (viewH / (viewH - inset));
    const ty = target.y + 0.1 * x + st.focus - (st.still || !st.lift || st.inset ? 0 : 0.85) * f;   /* how it works: the unit sits above the caption card (not in stills) */
    camera.position.set(0, ty + dist * Math.sin(elev), dist * Math.cos(elev));
    camera.lookAt(0, ty, 0);
    if (inset > 0.5) camera.setViewOffset(viewW, viewH, 0, inset / 2, viewW, viewH); else if (camera.view && camera.view.enabled) camera.clearViewOffset();
  };
  let composer = null, gtao = null, useAO = false, stillFrame = false;
  const frameFor = (w, h) => {
    viewW = w; viewH = h;
    camera.aspect = w / h;
    /* The poster is a 4:5 capture. Match object-fit: contain at every stage size. */
    const half = Math.tan(32 * Math.PI / 360), referenceAspect = 4 / 5;
    baseDist = Math.max(2.6 / half, 2.0 / (half * referenceAspect)) + 1.25;
    camera.fov = 2 * Math.atan(half * Math.max(1, referenceAspect / camera.aspect)) * 180 / Math.PI;
    camera.updateProjectionMatrix();
    if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(w, h); }
    placeCamera();
  };
  const fit = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    frameFor(w, h);
  };
  const applyState = () => {
    const o = ease(st.open), x = ease(st.explode), f = ease(st.flow);
    /* cutaway: the cabinet door swings open and the front sector of each vessel fades out; the air view needs the same view of the inside */
    const d = lin(st.open, WIN.door);
    doorPivot.rotation.y = -1.85 * (d <= 0 ? 0 : backOut(d)) * (1 - ease(Math.max(st.explode, st.flow)));   /* the door shuts for the exploded and how-it-works views */
    const cut = Math.max(o, f), sOp = 1 - cut * (1 - x);   /* exploded: the shells come back, as separate pieces */
    fades.forEach((m) => { m.opacity = sOp; const tr = sOp < 0.999; if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; } });
    const cast = sOp > 0.5;
    towers.forEach((t) => {
      t.shell.visible = sOp > 0.01;
      if (t.cast !== cast) { t.cast = cast; t.shell.traverse((q) => { if (!q.isMesh) return; if (q.userData.c0 === undefined) q.userData.c0 = q.castShadow; q.castShadow = cast && q.userData.c0; }); }
      const inside = cut > 0.02 || x > 0.02 || st.isolate === 3;
      t.bed.visible = inside; t.screens.visible = inside;
    });
    lamp.intensity = 3 * phase(st.open, WIN.light) + 1.4 * f;
    /* exploded: shell sectors move out and turn, beds come forward, screens part above and below */
    towers.forEach((t, index) => {
      const sign = index ? 1 : -1;
      t.shell.position.set(t.x + sign * x * 1.05, 0, x * 0.92); t.shell.rotation.y = sign * x * 0.18;
      t.bed.position.set(t.x, x * 0.18, x * 0.85);
      t.upper.position.set(0, 3.02 + x * 0.7, x * 0.85); t.lower.position.set(0, 1.075 - x * 0.48, x * 0.85);
    });
    guideMat.opacity = 0.5 * x;
    guides.forEach((g) => {
      g.line.visible = x > 0.02;
      if (!g.line.visible) return;
      const sx = g.t.x, sg = g.sign;
      const from = g.kind === 'shell' ? V(sx, 2.31, 0.59) : V(sx + sg * 0.52, g.kind === 'upper' ? 3.02 : 1.075, 0);
      const to = g.kind === 'shell' ? V(sx + sg * x * 1.05, 2.31, 0.59 + x * 0.92) : V(sx + sg * 0.52, g.kind === 'upper' ? 3.02 + x * 0.7 : 1.075 - x * 0.48, x * 0.85);
      const pos = g.line.geometry.attributes.position;
      pos.setXYZ(0, from.x, from.y, from.z); pos.setXYZ(1, to.x, to.y, to.z); pos.needsUpdate = true; g.line.computeLineDistances();
    });
    /* flow: fade the paths in; the current step is bright, the rest dim. Step 0 shows the first set of paths together. */
    flowItems.forEach((it) => { const on = it.steps.indexOf(st.step) >= 0 || (!st.step && it.steps.indexOf(1) >= 0); it.m.material.uniforms.uOpacity.value = f * (on ? 1 : it.dim.indexOf(st.step) >= 0 ? 0.3 : 0.08); });
    setValves(false);
    if (f <= 0.002) paintBeds(0);   /* leaving the air view: the beds go back to plain granules */
    flow.visible = f > 0.002;
    applyIsolate(st.isolate);
    shapeDirty = true;
  };
  const animateFlow = () => {
    const f = ease(st.flow), dt = Math.min(0.1, Math.max(0, flowTime - lastFlowT)); lastFlowT = flowTime;
    flowItems.forEach((it) => { it.m.material.uniforms.uTime.value = flowTime; });
    /* the wetted zones creep towards their targets (at once when motion is reduced) */
    const tg = FRONT_TARGET[st.step] || FRONT_TARGET[0];
    if (!frontLock) for (let i = 0; i < 2; i++) front[i] = reduce ? tg[i] : front[i] + Math.max(-0.2 * dt, Math.min(0.2 * dt, tg[i] - front[i]));
    paintBeds(f);
    VALVE.forEach((vv) => { vv.cur += Math.max(-3 * dt, Math.min(3 * dt, vv.tgt - vv.cur)); }); paintValves();
    /* damp air out of the purge muffler: B's in step 3, A's in step 6 */
    puffs.forEach((sp) => {
      const on = f * ((sp.userData.x > 0 && st.step === 3) || (sp.userData.x < 0 && st.step === 6) ? 1 : 0), u = (flowTime * 0.55 + sp.userData.ph) % 1;
      sp.position.set(sp.userData.x + (sp.userData.ph - 0.5) * 0.14 + Math.sin(u * 6) * 0.03, 0.95 + u * 0.8, -0.28);
      sp.scale.setScalar(0.2 + u * 0.32); sp.material.opacity = on * Math.sin(Math.PI * u) * 0.75; sp.visible = on > 0.01;
    });
    /* the timer and the valves glow at the switch */
    const pulse = f * (st.step === 5 ? 0.4 + 0.25 * Math.sin(flowTime * 6) : 0);
    glows.forEach((sp) => { sp.material.opacity = pulse; sp.visible = pulse > 0.01; });
  };

  const layer = document.createElement('div');
  layer.className = 'c3__hsl';
  layer.setAttribute('aria-hidden', 'true');
  const homes = hotspots.map((el) => ({ el, parent: el.parentNode, next: el.nextSibling }));
  const v = V(0, 0, 0), nW = V(0, 0, 0), toCam = V(0, 0, 0);
  const project = (a, w, h) => {
    v.copy(a.p).applyMatrix4(a.obj.matrixWorld);
    nW.copy(a.n).transformDirection(a.obj.matrixWorld);
    toCam.copy(camera.position).sub(v).normalize();
    const facing = nW.dot(toCam);
    v.project(camera);
    return { x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h, facing };
  };
  const placeHotspots = () => {
    const w = stage.clientWidth, h = stage.clientHeight, sp = ease(st.open), set = st.explode > 0.3 ? EXPLODED : sp >= 0.5 ? OPEN : CLOSED;
    const hideAll = st.flow > 0.2;
    hotspots.forEach((el, k) => {
      const a = set[el.dataset.hs];
      if (!a) return;
      const fade = sp >= 0.5 ? clamp01((sp - 0.55 - k * 0.04) / 0.1) : clamp01((0.38 - sp) / 0.1);
      const q = project(a, w, h);
      /* in the exploded view parts face every way; show every marker */
      const away = hideAll || (isolated && el.dataset.hs !== String(isolated)) || (st.explode < 0.98 && q.facing < 0.05) || fade < 0.2 || q.x < 14 || q.x > w - 14 || q.y < 14 || q.y > h - 14;   /* zoomed in on another part: markers outside the stage go away */
      el.classList.toggle('is-away', away);
      el.style.opacity = away ? '' : fade.toFixed(2);
      el.style.left = q.x.toFixed(1) + 'px';
      el.style.top = q.y.toFixed(1) + 'px';
    });
  };

  /* ---------- render loop: on demand; the fan and the flow keep it running while they move ---------- */
  let raf = 0, need = true, inView = true, last = 0, alive = true;
  let activated = !opts.deferAnimation;
  const spin = !reduce;
  const draw = () => {
    csRig.rotation.y = model.rotation.y;
    scene.updateMatrixWorld();
    if (shapeDirty) { updateContact(); shapeDirty = false; shadowDirty = true; }
    if (shadowDirty) { renderer.shadowMap.needsUpdate = true; shadowDirty = false; }
    placeHotspots();
    if (st.flow > 0.002) animateFlow();
    /* ambient occlusion only for stills, and only when nothing see-through is on screen (ghosts and flow lines would confuse it) */
    if (useAO && stillFrame && !st.isolate && st.flow < 0.002) composer.render(); else renderer.render(scene, camera);
  };
  /* quality steps down (never back up) whenever frames run slow: first pixel ratio, then shadow map size, then the shadow blur */
  let level = 0, slow = 0, frames = 0;
  const degrade = () => {
    level++;
    if (level === 1) renderer.setPixelRatio(Math.min(maxPR, 1));
    else if (level === 2) { key.shadow.mapSize.set(512, 512); key.shadow.blurSamples = 8; if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; } }
    else if (level === 3) { renderer.setPixelRatio(0.75); key.shadow.blurSamples = 4; }
    fit(); shadowDirty = true; need = true;
  };
  /* the fan alone is ambient motion: it runs at 30 fps and winds down after 12 s without input, so an idle page does not keep the GPU busy */
  let active = performance.now(), sinceDraw = 0;
  const IDLE = 12000;
  const tick = (t) => {
    raf = 0;
    if (!alive) return;
    const raw = last ? t - last : 0;
    const dt = Math.min(50, raw); last = t;
    const wind = clamp01(1 - (t - active - IDLE) / 1500);   /* 1 while in use, easing to 0 once idle */
    const spinning = activated && spin && inView && fanSpeed * wind > 0.002;
    const flowing = activated && inView && st.flow > 0.002 && !reduce;
    sinceDraw += raw;
    if (spinning) rotor.rotation.y -= dt * 0.006 * fanSpeed * wind;
    if (flowing) flowTime += dt / 1000;
    const ambientOnly = !need && !flowing;
    if ((spinning || flowing) && !(ambientOnly && sinceDraw < 30)) need = true;
    if (need) {
      const t0 = performance.now();
      draw(); need = false; sinceDraw = 0;
      /* slow frames: rAF interval over ~28 ms, or the draw call itself blocking for over 20 ms */
      if (level < 3 && raw > 0) {
        frames++;
        if (raw > 28 || performance.now() - t0 > 20) slow++;
        if (frames >= 30) { if (slow > 12) degrade(); frames = slow = 0; }
      }
    }
    if ((spinning || flowing) && !document.hidden) raf = requestAnimationFrame(tick);
    else last = 0;
  };
  const request = () => { if (!raf && alive) raf = requestAnimationFrame(tick); };

  stage.insertBefore(cvs, stage.firstChild);
  stage.appendChild(layer);
  hotspots.forEach((el) => layer.appendChild(el));
  fit();

  /* ambient occlusion (GTAO) is for the rendered stills and video only (opts.ao); in the live viewer it cost too much GPU */
  if (opts.ao) {
    Promise.all([
      import('/js/vendor/postprocessing/EffectComposer.js'), import('/js/vendor/postprocessing/RenderPass.js'),
      import('/js/vendor/postprocessing/GTAOPass.js'), import('/js/vendor/postprocessing/OutputPass.js')
    ]).then((mods) => {
      if (!alive) return;
      const w = stage.clientWidth || 800, h = stage.clientHeight || 600;
      composer = new mods[0].EffectComposer(renderer, new T.WebGLRenderTarget(w, h, { type: T.HalfFloatType, samples: 4 }));
      composer.addPass(new mods[1].RenderPass(scene, camera));
      gtao = new mods[2].GTAOPass(scene, camera, w, h);
      gtao.output = mods[2].GTAOPass.OUTPUT.Default;
      gtao.blendIntensity = 0.85;
      gtao.updateGtaoMaterial({ radius: 0.32, distanceExponent: 1.6, thickness: 1.2, scale: 1, samples: 12, distanceFallOff: 1, screenSpaceRadius: false });
      gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, radiusExponent: 1, rings: 2, samples: 12 });
      composer.addPass(gtao);
      composer.addPass(new mods[3].OutputPass());
      useAO = true; fit();
    }).catch(() => { useAO = false; });
  }

  const ro = new ResizeObserver(() => { fit(); need = true; request(); });
  ro.observe(stage);
  const io = new IntersectionObserver((en) => { inView = en[en.length - 1].isIntersecting; if (inView) { active = performance.now(); need = true; request(); } }, { threshold: 0.05 });
  io.observe(stage);
  const onVis = () => { if (!document.hidden) request(); };
  document.addEventListener('visibilitychange', onVis);

  const destroy = () => {
    if (!alive) return;
    alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    opts.signal?.removeEventListener('abort', destroy);
    homes.forEach((hm) => { hm.el.removeAttribute('style'); hm.el.classList.remove('is-away'); hm.parent.insertBefore(hm.el, hm.next); });
    layer.remove();
    if (composer) composer.dispose();
    release();
  };
  cleanup = destroy;
  opts.signal?.addEventListener('abort', destroy, { once: true });
  cvs.addEventListener('webglcontextlost', (e) => { e.preventDefault(); destroy(); if (opts.onLost) opts.onLost(); });
  layer.addEventListener('click', (e) => { const hs = e.target.closest('.c3__hs'); if (hs && opts.onSelect) opts.onSelect(hs.dataset.hs); });

  if (lite) {
    renderer.shadowMap.enabled = false; key.castShadow = false;
    scene.traverse((o) => {
      if (!o.isMesh) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
        if (!m.isMeshStandardMaterial) return;
        m.normalMap = null; m.roughnessMap = null;
        if (m.isMeshPhysicalMaterial) m.clearcoat = 0;
        m.needsUpdate = true;
      });
    });
  }
  const initial = opts.initialView || { ry: 28, rx: -12, zoom: 1 };
  model.rotation.y = initial.ry * Math.PI / 180;
  elev = -initial.rx * Math.PI / 180;
  st.zoom = initial.zoom || 1;
  rotor.rotation.y = 0;
  applyState(); placeCamera();
  await pause();
  /* compile every shader before the first frame (in parallel where the browser supports it), so the page does not stall on it */
  opts.onPhase?.('preparing');
  try { await renderer.compileAsync(scene, camera); } catch (e) { /* compiled on first draw instead */ }
  check();
  if (!alive) return null;
  draw();
  request();

  return {
    activate() { activated = true; active = performance.now(); request(); },
    /* state: { open, explode, flow (0..1), step (1-4), zoom (0.65-1.25), isolate (0 or part number) } */
    set(ry, rx, s) {
      const rot = ry * Math.PI / 180;
      if (rot !== model.rotation.y) { model.rotation.y = rot; shadowDirty = true; }
      active = performance.now();
      elev = -rx * Math.PI / 180;
      s = s || {};
      const next = { open: clamp01(s.open || 0), explode: clamp01(s.explode || 0), flow: clamp01(s.flow || 0), step: s.step === undefined ? 1 : s.step, zoom: Math.max(0.5, Math.min(1.25, s.zoom || 1)), focus: Math.max(-1.6, Math.min(1.6, Number(s.focus) || 0)), lift: s.lift !== false, inset: Math.max(0, Number(s.inset) || 0), isolate: s.isolate || 0, still: !!s.still };
      const changed = next.open !== st.open || next.explode !== st.explode || next.flow !== st.flow || next.step !== st.step || next.isolate !== st.isolate;
      Object.assign(st, next);
      if (changed) applyState();
      placeCamera();
      need = true; request();
    },
    /* a still at a given size (diagram images, video frames), plus where each part's marker falls */
    capture(w, h, background, fanAngle, time, fronts) {
      if (fanAngle !== undefined) rotor.rotation.y = fanAngle;
      if (time !== undefined) flowTime = time;
      if (fronts) { front[0] = fronts[0]; front[1] = fronts[1]; frontLock = true; lastFlowT = flowTime; setValves(true); }
      const pr = renderer.getPixelRatio();
      renderer.setPixelRatio(1); renderer.setSize(w, h, false); frameFor(w, h);
      shapeDirty = true; stillFrame = true; draw(); stillFrame = false;
      const out = document.createElement('canvas'); out.width = w; out.height = h;
      const g = out.getContext('2d');
      if (background) { g.fillStyle = background; g.fillRect(0, 0, w, h); }
      g.drawImage(cvs, 0, 0, w, h);
      frontLock = false;
      const set = st.explode > 0.3 ? EXPLODED : ease(st.open) >= 0.5 ? OPEN : CLOSED;
      const spots = hotspots.map((el) => { const q = project(set[el.dataset.hs], w, h); return { n: el.dataset.hs, x: q.x, y: q.y, visible: st.explode > 0.98 || q.facing > 0.05 }; });
      renderer.setPixelRatio(pr); fit(); shapeDirty = true; need = true; request();
      return { canvas: out, spots };
    },
    destroy
  };
  } catch (e) { cleanup(); throw e; }
}
