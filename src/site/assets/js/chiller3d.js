/* WebGL model of a Win process chiller for partials/chiller360.html.
   Geometry adapted from the photo-referenced model in the "WIn equipments Chatgpt" workspace (commit 79594a6),
   built from the October 2026 photographs in images/chiller-reference/. Normalized illustration coordinates,
   not a fabrication drawing. Only labels visible on the real unit are drawn (CONTROLLER, POWER ON, HP TRIP,
   HP GAUGE), plus the Win Equipments logo at the owner's request.
   chiller360.js owns drag / keys / scroll / modes / parts-list state and calls view.set(ry, rx, state).
   No template literals here: the build's minifier mangles them. */
import * as T from 'three';
import { mergeGeometries } from '/js/vendor/BufferGeometryUtils.js?v=170';

/* the unit opens in this order (fractions of open 0..1): door, front panel, right, left, back; the fan spins down first */
const WIN = { fan: [0, 0.3], door: [0.04, 0.42], front: [0.12, 0.58], right: [0.26, 0.72], left: [0.36, 0.82], back: [0.46, 0.94], light: [0.25, 0.75] };
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const ease = (t) => t * t * (3 - 2 * t);
const lin = (p, w) => clamp01((p - w[0]) / (w[1] - w[0]));
const phase = (p, w) => ease(lin(p, w));
const backOut = (t) => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };   /* small overshoot, settles at 1 */
/* cabinet proportions estimated from the photos: a closed folded sheet-metal body, squatter than it is tall-looking in pictures */
const BODY = { w: 2.0, d: 2.35, plinth: 0.22, top: 2.5, t: 0.035, fold: 0.05 };   /* control face narrower than the vented sides, as photographed */
const PAL = 0.14;      /* the wooden pallet it stands on in every photo */
const K = 0.78;        /* the interior parts (authored at the first model's size) are scaled in to fit this body */
const DROP = -0.915;   /* the fan pack and the controls sit lower, on the new lid */

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
  const castTex = bumps(2400, 1, 4, 1, 3.6, 4, 11);   /* sand-cast pump body */
  const foamTex = bumps(520, 4, 12, 3, 2.2, 2, 23);   /* closed-cell insulation */
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
  /* paint colours sampled from the photographs (exterior, rear and pump-side views) */
  const blue = mat('#0779bd', 0.15, 0.42, { clearcoat: 0.45, clearcoatRoughness: 0.3, normalMap: peel, normalScale: new T.Vector2(0.35, 0.35), roughnessMap: rough });
  const cream = mat('#ebe5d2', 0.08, 0.46, { clearcoat: 0.3, clearcoatRoughness: 0.42, normalMap: peel, normalScale: new T.Vector2(0.22, 0.22), roughnessMap: rough });
  const shellBlue = blue.clone();   /* the cabinet's own paint, so the exploded view can fade it on its own */
  const black = mat('#101619', 0.35, 0.18, { clearcoat: 0.95, clearcoatRoughness: 0.1 });
  const rubber = mat('#191d1e', 0, 0.9, { bumpMap: grain, bumpScale: 0.014 });
  const foam = mat('#26292a', 0, 0.97, { normalMap: foamTex, normalScale: new T.Vector2(0.9, 0.9) });
  const cast = mat('#7e868a', 0.55, 0.62, { normalMap: castTex, normalScale: new T.Vector2(0.7, 0.7) });
  const lidSteel = mat('#b9bec0', 0.6, 0.34, { roughnessMap: rough });
  const chrome = mat('#a6b0b5', 0.95, 0.25), steel = mat('#849297', 0.83, 0.4, { bumpMap: grain, bumpScale: 0.003, roughnessMap: rough });
  const copper = mat('#bd683f', 0.88, 0.29), red = mat('#d94326', 0.24, 0.22, { clearcoat: 0.8, clearcoatRoughness: 0.15 });
  const white = mat('#e6e8df', 0.05, 0.32), dark = mat('#101b1c', 0.12, 0.5), green = mat('#147e56', 0.3, 0.25);
  const brass = mat('#b8994e', 0.86, 0.34), amber = mat('#eeb32b', 0.3, 0.23);

  const group = (parent) => { const g = new T.Group(); (parent || model).add(g); return g; };
  const shell = group(), fan = group(), tank = group(), compressor = group(), pump = group(), pipes = group(), cabinet = group();
  [fan, tank, compressor, pump, pipes, cabinet].forEach((g) => { g.userData.keep = true; });   /* separate for exploded view and isolate */
  const mesh = (geo, material, parent, x, y, z) => { const m = new T.Mesh(geo, material); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
  const box = (w, h, d, material, parent, x, y, z, bevel) => {
    bevel = bevel === undefined ? 0.015 : bevel;
    const key = [w, h, d, bevel].join(','); let geo = geometryCache.get(key);
    if (!geo) {
      const r = Math.min(bevel, w / 5, h / 5, d / 5), a = w / 2 - r, b = h / 2 - r, s = new T.Shape();
      s.moveTo(-a, -b); s.lineTo(a, -b); s.lineTo(a, b); s.lineTo(-a, b); s.closePath();
      geo = new T.ExtrudeGeometry(s, { depth: d - 2 * r, steps: 1, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 2, curveSegments: 2 });
      geo.translate(0, 0, -d / 2 + r); geometryCache.set(key, geo);
    }
    return mesh(geo, material, parent, x, y, z);
  };
  const cyl = (rt, rb, h, material, parent, x, y, z, seg) => mesh(new T.CylinderGeometry(rt, rb, h, seg || 24), material, parent, x, y, z);
  const sphere = (r, material, parent, x, y, z, sx, sy, sz) => { const m = mesh(new T.SphereGeometry(r, 24, 12), material, parent, x, y, z); m.scale.set(sx || 1, sy || 1, sz || 1); return m; };
  const torus = (r, tube, material, parent, x, y, z) => mesh(new T.TorusGeometry(r, tube, 6, 40), material, parent, x, y, z);
  const pipe = (points, r, material, parent, conduit) => {
    const curve = new T.CatmullRomCurve3(points.map((p) => V(p[0], p[1], p[2])), false, 'centripetal');
    const m = mesh(new T.TubeGeometry(curve, Math.max(20, points.length * 10), r, r < 0.012 ? 5 : 8, false), material, parent || pipes);
    m.castShadow = false;
    if (conduit) {
      const count = Math.ceil(curve.getLength() / 0.04), rings = new T.InstancedMesh(new T.TorusGeometry(r + 0.005, 0.009, 5, 10), rubber, count);
      const obj = new T.Object3D(), forward = V(0, 0, 1);
      for (let i = 0; i < count; i++) { const t = i / Math.max(1, count - 1); obj.position.copy(curve.getPointAt(t)); obj.quaternion.setFromUnitVectors(forward, curve.getTangentAt(t)); obj.updateMatrix(); rings.setMatrixAt(i, obj.matrix); }
      (parent || pipes).add(rings);
    }
    return m;
  };
  const bolt = (parent, x, y, z, axis) => {
    const b = cyl(0.028, 0.028, 0.022, chrome, parent, x, y, z, 6);
    if (axis === 'z' || !axis) b.rotation.x = Math.PI / 2; else if (axis === 'x') b.rotation.z = Math.PI / 2;
    const w = cyl(0.04, 0.04, 0.007, steel, parent, x, y, z, 20); w.rotation.copy(b.rotation);
  };
  const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; };
  const plate = (tex, w, h, parent, x, y, z, ry) => { const m = mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: tex, roughness: 0.6, metalness: 0.05 }), parent, x, y, z); m.castShadow = false; if (ry) m.rotation.y = ry; return m; };
  /* a label exactly as printed on the real unit */
  const decal = (text, w, h, parent, x, y, z, background, color, fontSize) => plate(canvasTex(512, Math.round(512 * h / w), (g, cw, ch) => {
    g.fillStyle = background; g.fillRect(0, 0, cw, ch); g.fillStyle = color;
    g.font = '600 ' + fontSize + 'px Archivo, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, cw / 2, ch / 2);
  }), w, h, parent, x, y, z);
  /* the Win Equipments logo, redrawn at texture resolution from images/logo.png */
  const logoTex = canvasTex(564, 318, (g, w, h) => {
    g.fillStyle = '#46b14c'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff'; g.fillRect(10, 168, w - 20, 66);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '700 142px Archivo, Arial, sans-serif';
    ['W', 'I', 'N'].forEach((ch, i) => g.fillText(ch, w / 2 + (i - 1) * 168, 88));
    g.fillStyle = '#3a3d3f'; g.font = '600 66px Archivo, Arial, sans-serif'; g.fillText('EQUIPMENTS', w / 2, 203);
    g.fillStyle = '#fff'; g.font = '600 26px Archivo, Arial, sans-serif'; g.fillText('Save Water & Power', w / 2, 276);
  });
  /* plain, unreadable stickers standing in for the real instruction sheet and nameplate */
  const stickerTex = canvasTex(160, 220, (g, w, h) => {
    g.fillStyle = '#f4f5ef'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2f9a52'; g.fillRect(0, 0, w, 24); g.fillRect(0, 128, w, 20);
    g.fillStyle = 'rgba(30,40,35,0.35)';
    for (let y = 36; y < 120; y += 12) g.fillRect(12, y, w - 24 - (y % 3) * 14, 4);
    for (let y = 158; y < 210; y += 12) g.fillRect(12, y, w - 40, 4);
  });

  await pause();
  /* ---------- folded sheet-metal cabinet: blue faces with windows for the cream panels, solid lid, slotted plinth ---------- */
  const rrect = (path, x, y, w, h, r) => {
    path.moveTo(x + r, y); path.lineTo(x + w - r, y); path.quadraticCurveTo(x + w, y, x + w, y + r); path.lineTo(x + w, y + h - r);
    path.quadraticCurveTo(x + w, y + h, x + w - r, y + h); path.lineTo(x + r, y + h); path.quadraticCurveTo(x, y + h, x, y + h - r);
    path.lineTo(x, y + r); path.quadraticCurveTo(x, y, x + r, y);
  };
  const sheet = (w, h, holes, depth, round) => {
    const sh = new T.Shape(); rrect(sh, -w / 2, -h / 2, w, h, 0.035);
    holes.forEach((q) => { const ph = new T.Path(); rrect(ph, q[0], q[1], q[2] - q[0], q[3] - q[1], 0.025); sh.holes.push(ph); });
    if (round) { const ph = new T.Path(); ph.absarc(0, 0, round, 0, Math.PI * 2, true); sh.holes.push(ph); }
    const g = new T.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2, curveSegments: 6 });
    g.translate(0, 0, -depth / 2);
    return g;
  };
  /* window sizes shared by the cabinet faces and the panels that sit in them */
  const WINF = BODY.w / 2 - 0.16, WINS = BODY.d / 2 - 0.2;
  {
    const t = BODY.t, R = BODY.fold, hw = BODY.w / 2, hd = BODY.d / 2;
    const yc = (BODY.plinth + BODY.top - R) / 2, hb = BODY.top - R - BODY.plinth, rel = (y) => y - yc;
    mesh(sheet(BODY.w - 2 * R, hb, [[-WINF, rel(0.3), WINF, rel(1.3)], [-WINF - 0.01, rel(1.4), WINF + 0.01, rel(2.3)]], t), shellBlue, shell, 0, yc, hd - t / 2);
    mesh(sheet(BODY.w - 2 * R, hb, [[-WINF, rel(0.3), WINF, rel(2.32)]], t), shellBlue, shell, 0, yc, -hd + t / 2);
    for (const sx of [-1, 1]) mesh(sheet(BODY.d - 2 * R, hb, [[-WINS, rel(0.3), WINS, rel(2.32)]], t), shellBlue, shell, sx * (hw - t / 2), yc, 0).rotation.y = Math.PI / 2;
    mesh(sheet(BODY.w - 2 * R, BODY.d - 2 * R, [], t, 0.62), shellBlue, shell, 0, BODY.top - t / 2, 0).rotation.x = -Math.PI / 2;
    /* rounded folds: quarter cylinders on the upright edges and round the lid, quarter spheres in the top corners;
       their curves catch the bright highlight line the real sheet metal shows */
    const Q = Math.PI / 2;
    /* [x side, z side, cylinder theta start, sphere phi start] for each corner */
    [[1, 1, 0, Q], [1, -1, Q, 2 * Q], [-1, -1, 2 * Q, 3 * Q], [-1, 1, 3 * Q, 0]].forEach((c) => {
      mesh(new T.CylinderGeometry(R, R, hb, 14, 1, true, c[2], Q), shellBlue, shell, c[0] * (hw - R), yc, c[1] * (hd - R));
      mesh(new T.SphereGeometry(R, 14, 8, c[3], Q, 0, Q), shellBlue, shell, c[0] * (hw - R), BODY.top - R, c[1] * (hd - R));
    });
    for (const sz of [-1, 1]) { const g = new T.CylinderGeometry(R, R, BODY.w - 2 * R, 14, 1, true, sz > 0 ? 0 : Q, Q); g.rotateZ(Math.PI / 2); mesh(g, shellBlue, shell, 0, BODY.top - R, sz * (hd - R)); }
    for (const sx of [-1, 1]) { const g = new T.CylinderGeometry(R, R, BODY.d - 2 * R, 14, 1, true, sx > 0 ? Q : 2 * Q, Q); g.rotateX(Math.PI / 2); mesh(g, shellBlue, shell, sx * (hw - R), BODY.top - R, 0); }
    box(BODY.w - 0.08, 0.03, BODY.d - 0.08, shellBlue, shell, 0, BODY.plinth + 0.015, 0, 0.006);   /* base tray */
    /* plinth with forklift slots on every side, dark inside */
    const ph = BODY.plinth, slot = (a, b) => [a, -0.05, b, 0.04];
    for (const sz of [-1, 1]) mesh(sheet(BODY.w, ph, [slot(-0.78, -0.36), slot(0.36, 0.78)], t), shellBlue, shell, 0, ph / 2, sz * (hd - t / 2));
    for (const sx of [-1, 1]) mesh(sheet(BODY.d, ph, [slot(-0.72, -0.3), slot(0.3, 0.72)], t), shellBlue, shell, sx * (hw - t / 2), ph / 2, 0).rotation.y = Math.PI / 2;
    box(BODY.w - 0.1, ph - 0.02, BODY.d - 0.1, dark, shell, 0, ph / 2, 0, 0.004);
    /* service bracket behind the lower front panel: carries the service valve and pressure switch */
    box(BODY.w - 0.4, 0.14, 0.06, shellBlue, shell, 0, 0.69, 0.74, 0.008);
    /* on the lid: grey funnel fitting on a white stub, and a small blue port (both visible in the photos) */
    const grey = mat('#7f868b', 0.05, 0.5, { side: T.DoubleSide });
    cyl(0.045, 0.045, 0.12, white, shell, -0.5, BODY.top + 0.06, -0.9, 16);
    cyl(0.045, 0.045, 0.16, white, shell, -0.58, BODY.top + 0.11, -0.9, 16).rotation.z = Math.PI / 2;
    const funnel = mesh(new T.LatheGeometry([[0.045, 0], [0.05, 0.08], [0.15, 0.24], [0.155, 0.27], [0.04, 0.1]].map((q) => new T.Vector2(q[0], q[1])), 28), grey, shell, -0.66, BODY.top + 0.11, -0.9);
    funnel.rotation.z = Math.PI / 2;
    cyl(0.065, 0.065, 0.05, shellBlue, shell, -0.72, BODY.top + 0.025, 0.92, 20);
    /* rear: cable gland low on the right, with the supply cable looped on the floor */
    cyl(0.042, 0.042, 0.07, chrome, shell, 0.72, 0.27, -hd - 0.03, 16).rotation.x = Math.PI / 2;
    pipe([[0.72, 0.27, -hd - 0.06], [0.72, 0.1, -hd - 0.09], [0.6, 0.017, -hd - 0.1], [0.2, 0.017, -hd - 0.11], [0.05, 0.017, -hd - 0.05], [0.3, 0.017, -hd - 0.02]], 0.016, rubber, shell);
  }

  /* ---------- wooden pallet: the unit stands on one in every photograph ---------- */
  {
    const wood = new T.MeshStandardMaterial({ roughness: 0.86, metalness: 0, map: canvasTex(512, 128, (g, w, h) => {
      g.fillStyle = '#a77a4c'; g.fillRect(0, 0, w, h);
      let sd = 3;
      const rnd = () => (sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296;
      for (let k = 0; k < 70; k++) {
        const y0 = rnd() * h, amp = 2 + rnd() * 5, ph = rnd() * 6, c = Math.round(110 + rnd() * 50);
        g.strokeStyle = 'rgba(' + c + ',' + Math.round(c * 0.68) + ',' + Math.round(c * 0.4) + ',' + (0.25 + rnd() * 0.35).toFixed(2) + ')'; g.lineWidth = 1 + rnd() * 2;
        g.beginPath(); for (let x = 0; x <= w; x += 8) { const y = y0 + Math.sin(x / 60 + ph) * amp; if (x) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke();
      }
      g.fillStyle = 'rgba(70,45,25,0.45)'; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 6 + rnd() * 6, 3 + rnd() * 3, 0, 0, Math.PI * 2); g.fill(); }
    }) });
    const L = BODY.d + 0.25, X = BODY.w / 2 + 0.08;
    for (const x of [-X, -X / 2, 0, X / 2, X]) box(0.3, 0.034, L, wood, shell, x, -0.017, 0, 0.006);          /* deck boards */
    for (const z of [-L / 2 + 0.06, 0, L / 2 - 0.06]) box(2 * X + 0.3, 0.075, 0.1, wood, shell, 0, -0.072, z, 0.006);   /* stringers */
    for (const x of [-X, 0, X]) box(0.3, 0.03, L, wood, shell, x, -0.125, 0, 0.006);                          /* bottom boards */
  }
  model.position.y = PAL;

  await pause();
  /* ---------- top condenser pack, axial fan and wire guard ---------- */
  box(1.91, 0.43, 1.8, dark, fan, 0, 3.05, 0);
  const fins = new T.InstancedMesh(new T.BoxGeometry(1.82, 0.3, 0.014), steel, 48), fObj = new T.Object3D();
  for (let i = 0; i < 48; i++) { fObj.position.set(0, 3.07, -0.79 + i * 0.0335); fObj.updateMatrix(); fins.setMatrixAt(i, fObj.matrix); }
  fan.add(fins);
  for (const x of [-0.82, 0.82]) pipe([[x, 2.88, -0.78], [x, 2.88, 0.78]], 0.035, copper, fan);
  cyl(0.69, 0.69, 0.08, blue, fan, 0, 3.45, 0, 64);
  cyl(0.65, 0.65, 0.09, dark, fan, 0, 3.49, 0, 64);
  const rotor = group(fan); rotor.position.set(0, 3.53, 0); rotor.userData.keep = true;
  for (let j = 0; j < 4; j++) {
    const s = new T.Shape(); s.moveTo(0.1, -0.05); s.bezierCurveTo(0.35, -0.24, 0.58, -0.17, 0.61, 0.08); s.bezierCurveTo(0.44, 0.13, 0.25, 0.2, 0.1, 0.07); s.closePath();
    const blade = mesh(new T.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.006, bevelSegments: 2 }), black, rotor, 0, 0, 0);
    blade.rotation.x = -Math.PI / 2; blade.rotation.z = j * Math.PI / 2;
  }
  cyl(0.13, 0.13, 0.09, black, rotor, 0, 0.03, 0);
  for (const y of [3.5, 3.55, 3.6, 3.65, 3.7]) torus(0.69, 0.009, black, fan, 0, y, 0).rotation.x = Math.PI / 2;
  for (const r of [0.17, 0.28, 0.39, 0.5, 0.6]) torus(r, 0.009, black, fan, 0, 3.72, 0).rotation.x = Math.PI / 2;
  for (let j = 0; j < 12; j++) { const a = j * Math.PI / 6; pipe([[0.1 * Math.cos(a), 3.76, 0.1 * Math.sin(a)], [0.68 * Math.cos(a), 3.72, 0.68 * Math.sin(a)], [0.69 * Math.cos(a), 3.51, 0.69 * Math.sin(a)]], 0.009, black, fan); }
  box(0.31, 0.1, 0.28, black, fan, 0, 3.79, 0);
  for (const x of [-0.57, 0.57]) for (const z of [-0.57, 0.57]) { box(0.1, 0.13, 0.11, steel, fan, x, 3.47, z); bolt(fan, x, 3.53, z, 'y'); }
  pipe([[0, 3.8, 0.08], [0.24, 3.77, 0.21], [0.56, 3.54, 0.62], [0.8, 3.42, 0.88]], 0.028, rubber, fan, true);

  /* ---------- control cabinet: fixed hinges and gauge, door on a pivot at its hinge line (sized from the front window) ---------- */
  const HX = -WINF - 0.005, DW = 2 * WINF - 0.01, GX = -WINF - 0.07;
  for (const y of [2.45, 3.08]) { box(0.1, 0.16, 0.038, black, cabinet, HX + 0.02, y, 1.119); bolt(cabinet, HX, y + 0.04, 1.143); bolt(cabinet, HX, y - 0.04, 1.143); }
  cyl(0.12, 0.12, 0.046, chrome, cabinet, GX, 2.16, 1.12, 48).rotation.x = Math.PI / 2;
  cyl(0.1, 0.1, 0.012, white, cabinet, GX, 2.16, 1.154, 48).rotation.x = Math.PI / 2;
  plate(canvasTex(256, 256, (g) => {
    g.fillStyle = '#f0f1e5'; g.fillRect(0, 0, 256, 256); g.translate(128, 128);
    for (let i = 0; i < 33; i++) { const a = (0.75 + i / 32 * 1.5) * Math.PI; g.save(); g.rotate(a); g.strokeStyle = i > 25 ? '#b04634' : '#243c3c'; g.lineWidth = i % 4 === 0 ? 4 : 2; g.beginPath(); g.moveTo(0, -100); g.lineTo(0, i % 4 === 0 ? -82 : -91); g.stroke(); g.restore(); }
    g.strokeStyle = '#212d2c'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(-49, -57); g.stroke();
    g.font = '20px Arial'; g.fillStyle = '#354d4a'; g.textAlign = 'center'; g.fillText('bar', 0, 52);
  }), 0.198, 0.198, cabinet, GX, 2.16, 1.163);
  decal('HP GAUGE', 0.22, 0.045, cabinet, GX, 2.34, 1.1, '#0779bd', '#eaf2f1', 42);
  /* the electrical box behind the door, with contactors on a rail */
  const BX = WINF * 0.54;
  box(0.45, 0.74, 0.28, cream, cabinet, BX, 2.71, 0.81);
  box(0.4, 0.03, 0.02, steel, cabinet, BX, 2.86, 0.96, 0.004);
  for (const dx of [-0.14, 0, 0.14]) box(0.1, 0.18, 0.06, dx === 0 ? dark : steel, cabinet, BX + dx, 2.86, 0.98, 0.01);
  box(0.36, 0.05, 0.04, green, cabinet, BX, 2.56, 0.97, 0.008);
  const doorPivot = group(cabinet); doorPivot.position.set(HX, 0, 1.1); doorPivot.userData.keep = true;
  const door = group(doorPivot); door.position.set(-HX, 0, -1.1);   /* children keep model coordinates */
  box(DW, 0.86, 0.048, cream, door, 0, 2.76, 1.075);
  const handleX = WINF - 0.27;
  box(0.24, 0.3, 0.022, black, door, handleX, 2.79, 1.117);
  box(0.11, 0.24, 0.045, dark, door, handleX, 2.79, 1.14);
  box(0.08, 0.21, 0.018, steel, door, handleX, 2.79, 1.152);
  box(0.39, 0.19, 0.037, black, door, -0.08, 2.93, 1.121);
  decal('15.0', 0.25, 0.1, door, -0.12, 2.93, 1.143, '#111e21', '#7cc88e', 88);   /* illustrative readout, not live */
  decal('CONTROLLER', 0.4, 0.06, door, -0.08, 2.78, 1.118, '#ecebdc', '#16252d', 44);
  for (const b of [[-0.27, green, 'POWER ON'], [0.12, amber, 'HP TRIP']]) {
    cyl(0.055, 0.055, 0.022, chrome, door, b[0], 2.57, 1.12).rotation.x = Math.PI / 2;
    cyl(0.043, 0.043, 0.033, b[1], door, b[0], 2.57, 1.145).rotation.x = Math.PI / 2;
    decal(b[2], 0.32, 0.06, door, b[0], 2.44, 1.112, '#ecebdc', '#16252d', 47);
  }
  for (const y of [2.4, 3.13]) box(0.06, 0.07, 0.035, black, door, WINF - 0.07, y, 1.124);

  await pause();
  /* ---------- removable panels with real capsule-shaped openings ---------- */
  const capsule = (shape, x, y, sw, sh) => {
    const r = sh / 2, a = sw / 2 - r, p = new T.Path();
    p.moveTo(x - a, y + r); p.lineTo(x + a, y + r); p.absarc(x + a, y, r, Math.PI / 2, -Math.PI / 2, true); p.lineTo(x - a, y - r); p.absarc(x - a, y, r, -Math.PI / 2, Math.PI / 2, true);
    shape.holes.push(p);
  };
  /* v: { grid: [columns, rows, yOffset] } or { brick: [rows, blockWidth, centreX, centreY] } */
  const ventPanel = (w, h, v) => {
    const shape = new T.Shape(); shape.moveTo(-w / 2, -h / 2); shape.lineTo(w / 2, -h / 2); shape.lineTo(w / 2, h / 2); shape.lineTo(-w / 2, h / 2); shape.closePath();
    if (v.grid) {
      const [columns, rows, yo] = v.grid, dx = (w - 0.42) / columns, sw = dx * 0.72;
      for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) capsule(shape, (col - (columns - 1) / 2) * dx, (row - (rows - 1) / 2) * 0.14 + yo, sw, 0.072);
    } else {
      const [rows, bw, cx, cy] = v.brick, px = 0.235, py = 0.118, sw = 0.168, sh = 0.074, cols = Math.floor(bw / px);
      for (let row = 0; row < rows; row++) {
        const odd = row % 2, n = cols - odd;
        for (let col = 0; col < n; col++) capsule(shape, cx + (col - (n - 1) / 2) * px, cy + (row - (rows - 1) / 2) * py, sw, sh);
      }
    }
    const g = new T.ExtrudeGeometry(shape, { depth: 0.028, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.006, bevelSegments: 1, curveSegments: 5 }); g.translate(0, 0, -0.014);
    return g;
  };
  const panels = [];
  /* corner bolts are one instanced mesh per panel so they can back out before the panel lifts */
  const boltHead = new T.CylinderGeometry(0.028, 0.028, 0.022, 6).rotateX(Math.PI / 2);
  const boltWasher = new T.CylinderGeometry(0.04, 0.04, 0.007, 16).rotateX(Math.PI / 2);
  const addPanel = (name, w, h, vents, x, y, z, rotation) => {
    const g = group(); g.position.set(x, y, z); g.rotation.order = 'YXZ'; g.rotation.y = rotation;
    g.userData.keep = true;
    const pm = cream.clone(); pm.transparent = true;
    const hm = chrome.clone(); hm.transparent = true;
    const wm = steel.clone(); wm.transparent = true;
    mesh(ventPanel(w, h, vents), pm, g);
    const spots = [];
    for (const xx of [-w / 2 + 0.045, w / 2 - 0.045]) for (const yy of [-h / 2 + 0.05, h / 2 - 0.05]) spots.push([xx, yy]);
    const heads = new T.InstancedMesh(boltHead, hm, 4), washers = new T.InstancedMesh(boltWasher, wm, 4);
    heads.castShadow = washers.castShadow = true; heads.frustumCulled = washers.frustumCulled = false;
    g.add(heads, washers);
    const fades = [pm, hm, wm];
    panels.push({ g, origin: g.position.clone(), rot: rotation, n: V(Math.sin(rotation), 0, Math.cos(rotation)), fades, win: WIN[name], spots, heads, washers, last: -1 });
    return { g, fades };
  };
  const bo = new T.Object3D();
  const placeBolts = (p, t) => {   /* t 0..1: unscrew (two turns) and back out 45 mm */
    p.spots.forEach((s, i) => {
      bo.position.set(s[0], s[1], 0.025 + 0.045 * t); bo.rotation.set(0, 0, -t * Math.PI * 4); bo.updateMatrix();
      p.heads.setMatrixAt(i, bo.matrix);
      bo.position.z = 0.025 + 0.045 * t - 0.012; bo.updateMatrix();
      p.washers.setMatrixAt(i, bo.matrix);
    });
    p.heads.instanceMatrix.needsUpdate = p.washers.instanceMatrix.needsUpdate = true;
  };
  const label = (p, tex, w, h, x, y) => { const m = plate(tex, w, h, p.g, x, y, 0.026); m.material.transparent = true; p.fades.push(m.material); };
  /* panels sit 8 mm inside their window edges and 12 mm behind the face, so a thin shadow seam shows all round */
  const PW = 2 * WINF - 0.016, SW = 2 * WINS - 0.016, PIN = 0.012;
  label(addPanel('front', PW, 0.984, { grid: [4, 4, -0.22] }, 0, 0.8, BODY.d / 2 - PIN, 0), logoTex, 0.62, 0.35, 0, 0.24);   /* Win Equipments logo, owner's request */
  const rightPanel = addPanel('right', SW, 2.004, { brick: [11, SW - 0.4, 0.05, -0.18] }, BODY.w / 2 - PIN, 1.31, 0, Math.PI / 2);
  label(rightPanel, stickerTex, 0.26, 0.36, -0.68, 0.7);
  label(rightPanel, canvasTex(200, 140, (g, w, h) => { g.fillStyle = '#f4f5ef'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(30,40,35,0.45)'; g.lineWidth = 3; g.strokeRect(6, 6, w - 12, h - 12); for (let y = 30; y < h - 10; y += 18) { g.beginPath(); g.moveTo(10, y); g.lineTo(w - 10, y); g.stroke(); } }), 0.3, 0.21, 0.68, 0.82);
  addPanel('left', SW, 2.004, { brick: [11, SW - 0.4, 0, -0.18] }, -BODY.w / 2 + PIN, 1.31, 0, -Math.PI / 2);
  const backPanel = addPanel('back', PW, 2.004, { brick: [10, PW - 0.62, -0.12, -0.14] }, 0, 1.31, -BODY.d / 2 + PIN, Math.PI);
  /* rear: the level-gauge window on the tank side, and a plain earth-symbol label by the cable gland */
  label(backPanel, canvasTex(48, 220, (g, w, h) => { g.fillStyle = '#15191b'; g.fillRect(0, 0, w, h); g.fillStyle = '#9fb7ae'; g.fillRect(14, 22, w - 28, h - 44); g.fillStyle = '#c9a85a'; g.fillRect(16, 6, w - 32, 10); g.fillRect(16, h - 16, w - 32, 10); }), 0.09, 0.42, 0.62, 0.22);
  label(backPanel, canvasTex(96, 96, (g, w, h) => { g.fillStyle = '#f2c018'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 6; g.beginPath(); g.moveTo(48, 16); g.lineTo(48, 50); g.moveTo(22, 50); g.lineTo(74, 50); g.moveTo(30, 62); g.lineTo(66, 62); g.moveTo(39, 74); g.lineTo(57, 74); g.stroke(); }), 0.07, 0.07, -0.68, -0.86);

  await pause();
  /* ---------- foam-insulated tank with metal lid, seams and sight glass ---------- */
  box(1.26, 1.79, 1.19, foam, tank, -0.15, 1.41, -0.22, 0.035);
  for (const z of [-0.62, 0.12]) box(0.012, 1.74, 0.02, rubber, tank, -0.782, 1.41, z, 0.004);   /* insulation sheet seams */
  box(0.02, 1.74, 0.012, rubber, tank, 0.2, 1.41, 0.382, 0.004);
  box(1.31, 0.11, 1.24, lidSteel, tank, -0.15, 2.357, -0.22, 0.02);   /* thick bright metal lid, as photographed */
  for (const z of [-0.83, 0.39]) box(1.26, 0.025, 0.026, rubber, tank, -0.15, 0.54, z);
  for (const x of [-0.72, 0.42]) for (const z of [-0.76, 0.31]) bolt(tank, x, 2.415, z, 'y');
  box(0.16, 0.61, 0.026, black, tank, -0.783, 1.42, -0.14).rotation.y = -Math.PI / 2;
  box(0.065, 0.44, 0.035, mat('#85aca1', 0.1, 0.15, { transmission: 0.35, thickness: 0.1 }), tank, -0.806, 1.42, -0.14).rotation.y = -Math.PI / 2;
  for (const y of [1.14, 1.7]) cyl(0.036, 0.036, 0.035, brass, tank, -0.811, y, -0.14).rotation.z = Math.PI / 2;
  pipe([[-0.62, 2.36, 0.2], [-0.62, 2.29, 0.46], [-0.63, 1.5, 0.48], [-0.44, 1.2, 0.5]], 0.058, rubber, tank);

  /* ---------- hermetic compressor: pressed shell, welded seam, rubber feet ---------- */
  const profile = [[0.06, 0], [0.22, 0.01], [0.28, 0.07], [0.31, 0.18], [0.31, 0.83], [0.285, 0.97], [0.22, 1.04], [0.05, 1.07], [0, 1.07]].map((p) => new T.Vector2(p[0], p[1]));
  mesh(new T.LatheGeometry(profile, 48), black, compressor, -0.67, 0.38, 0.61);
  torus(0.312, 0.015, steel, compressor, -0.67, 0.97, 0.61).rotation.x = Math.PI / 2;
  box(0.28, 0.2, 0.1, black, compressor, -0.67, 1.2, 0.95);
  for (const x of [-0.93, -0.41]) for (const z of [0.4, 0.82]) { box(0.11, 0.04, 0.13, steel, compressor, x, 0.38, z); cyl(0.045, 0.045, 0.07, rubber, compressor, x, 0.32, z); bolt(compressor, x, 0.41, z, 'y'); }
  plate(canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#e3e8df'; g.fillRect(0, 0, w, h); g.fillStyle = '#3b5aa8'; g.fillRect(0, 0, w, 18); g.fillStyle = 'rgba(30,40,45,0.4)'; for (let y = 30; y < h - 8; y += 14) g.fillRect(10, y, w - 20 - (y % 3) * 20, 5); }), 0.28, 0.14, compressor, -0.67, 0.82, 0.922);
  pipe([[-0.67, 1.45, 0.62], [-0.67, 1.68, 0.61], [-0.37, 1.79, 0.55], [-0.2, 1.94, 0.41]], 0.064, rubber);
  pipe([[-0.86, 1.31, 0.66], [-0.94, 1.51, 0.66], [-0.94, 2.55, 0.4], [-0.78, 2.85, -0.2]], 0.023, copper);

  /* ---------- pump: finned cast motor, red end cover, cast body, PVC unions and blue valve (built at photo size) ---------- */
  const pumpBody = group(pump);
  cyl(0.205, 0.205, 0.62, cast, pumpBody, 0.58, 0.61, 0.2).rotation.x = Math.PI / 2;
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; box(0.025, 0.045, 0.54, cast, pumpBody, 0.58 + Math.sin(a) * 0.215, 0.61 + Math.cos(a) * 0.215, 0.2, 0.004).rotation.z = -a; }
  cyl(0.224, 0.224, 0.12, red, pumpBody, 0.58, 0.61, 0.55).rotation.x = Math.PI / 2;
  cyl(0.155, 0.155, 0.014, black, pumpBody, 0.58, 0.61, 0.617).rotation.x = Math.PI / 2;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; cyl(0.018, 0.018, 0.017, steel, pumpBody, 0.58 + 0.12 * Math.cos(a), 0.61 + 0.12 * Math.sin(a), 0.635).rotation.x = Math.PI / 2; }
  plate(canvasTex(128, 64, (g, w, h) => { g.fillStyle = '#f3f1e8'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8b21e'; g.fillRect(0, 0, w, 14); g.fillStyle = 'rgba(40,40,40,0.4)'; for (let y = 22; y < h - 6; y += 10) g.fillRect(8, y, w - 16 - (y % 3) * 10, 4); }), 0.11, 0.055, pumpBody, 0.58, 0.8, 0.614);   /* plain label on the red cover */
  box(0.23, 0.11, 0.32, cast, pumpBody, 0.58, 0.39, 0.22);
  for (const x of [0.43, 0.73]) for (const z of [0.06, 0.39]) bolt(pumpBody, x, 0.44, z, 'y');
  cyl(0.23, 0.18, 0.23, cast, pumpBody, 0.58, 0.61, -0.21).rotation.x = Math.PI / 2;
  cyl(0.13, 0.13, 0.22, cast, pumpBody, 0.58, 0.79, -0.24);
  pipe([[0.58, 0.83, -0.24], [0.58, 0.97, -0.24], [0.9, 1.02, -0.24], [0.91, 1.42, -0.24]], 0.1, white, pumpBody);
  for (const y of [1.09, 1.3]) cyl(0.13, 0.13, 0.12, white, pumpBody, 0.91, y, -0.24);
  cyl(0.115, 0.115, 0.17, white, pumpBody, 0.91, 1.53, -0.24);
  cyl(0.02, 0.02, 0.08, steel, pumpBody, 0.91, 1.64, -0.24);
  box(0.46, 0.055, 0.12, mat('#2457c9', 0.2, 0.3, { clearcoat: 0.6 }), pumpBody, 0.95, 1.69, -0.24);
  pipe([[0.58, 0.61, -0.34], [0.58, 0.61, -0.55], [0.31, 0.61, -0.6], [0.31, 0.61, -0.72]], 0.086, white, pumpBody);
  box(0.24, 0.15, 0.2, black, pumpBody, 0.58, 0.86, 0.17);
  plate(canvasTex(256, 96, (g, w, h) => { g.fillStyle = '#dfe3ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0392b'; g.fillRect(0, 0, 40, h); g.fillStyle = 'rgba(30,40,60,0.4)'; for (let y = 14; y < h - 8; y += 14) g.fillRect(52, y, w - 64, 5); }), 0.3, 0.11, pumpBody, 0.58, 0.83, 0.42);
  cyl(0.08, 0.08, 0.13, chrome, pumpBody, 0.88, 0.43, 0.51).rotation.z = Math.PI / 2;
  /* the pump in the photos is bigger relative to the cabinet: grow it about its own base so it stays on the floor and on its pipes */
  const PS = 1.2, PC = V(0.58, 0.335, 0.2);
  pumpBody.scale.setScalar(PS); pumpBody.position.copy(PC).multiplyScalar(1 - PS);

  await pause();
  /* ---------- copper lines, foam insulation and ribbed conduits along the photographed routes ---------- */
  pipe([[-0.91, 0.57, 0.73], [-0.93, 0.56, 0.19], [-0.94, 0.59, -0.55], [-0.79, 2.5, -0.65], [-0.55, 2.88, -0.73]], 0.021, copper);
  pipe([[0.43, 2.35, 0.05], [0.58, 2.5, 0.07], [0.91, 2.54, 0.22], [0.91, 1.07, 0.4], [0.84, 0.4, 0.48]], 0.023, copper);
  pipe([[-0.87, 1.06, 0.87], [-0.96, 0.9, 0.89], [-0.88, 0.43, 0.9], [-0.15, 0.42, 0.9], [0.65, 0.44, 0.61]], 0.024, rubber, pipes, true);
  pipe([[0.53, 2.51, 0.65], [0.8, 2.34, 0.65], [0.98, 1.97, 0.5], [0.98, 1.3, 0.25], [0.64, 0.86, 0.18]], 0.029, rubber, pipes, true);
  pipe([[0.52, 2.5, 0.65], [0.23, 2.57, 0.59], [-0.43, 2.5, 0.62], [-0.85, 1.79, 0.8], [-0.67, 1.25, 0.96]], 0.027, rubber, pipes, true);
  pipe([[0.55, 2.5, 0.71], [0.96, 2.4, 0.81], [1.02, 1.08, 0.93], [0.91, 0.34, 0.97]], 0.015, green);
  pipe([[-0.29, 0.45, 0.92], [-0.29, 0.79, 0.98], [-0.29, 1.08, 0.98]], 0.025, copper);
  sphere(0.11, red, pipes, -0.29, 0.91, 1.03, 1, 1, 0.25);     /* service valve knob */
  box(0.28, 0.27, 0.16, cream, pipes, 0.36, 0.91, 0.99);       /* pressure switch */
  box(0.12, 0.08, 0.01, mat('#3c4a44', 0.1, 0.3), pipes, 0.36, 0.95, 1.072, 0.003);
  /* filter drier on the liquid line, with brass flare nuts (black drier visible beside the pump in the photos) */
  cyl(0.045, 0.045, 0.22, black, pipes, 0, 0.62, 0.82).rotation.z = Math.PI / 2;
  for (const x of [-0.125, 0.125]) cyl(0.03, 0.03, 0.04, brass, pipes, x, 0.62, 0.82, 6).rotation.z = Math.PI / 2;
  box(0.1, 0.06, 0.004, white, pipes, 0, 0.62, 0.866, 0.002);
  pipe([[0.15, 0.62, 0.82], [0.25, 0.62, 0.82], [0.31, 0.71, 0.86]], 0.012, copper);
  pipe([[-0.15, 0.62, 0.82], [-0.24, 0.6, 0.85], [-0.29, 0.5, 0.91]], 0.012, copper);
  /* more of the wiring the photos show: ribbed conduits with cable ties, tight copper bends, a copper coil at the tank lid */
  const tieGeo = new T.TorusGeometry(0.036, 0.007, 5, 14);
  const conduit = (pts, ties) => {
    pipe(pts, 0.028, rubber, pipes, true);
    const curve = new T.CatmullRomCurve3(pts.map((q) => V(q[0], q[1], q[2])), false, 'centripetal'), o = new T.Object3D(), fwd = V(0, 0, 1);
    ties.forEach((t) => { const m = mesh(tieGeo, black, pipes, 0, 0, 0); m.position.copy(curve.getPointAt(t)); m.quaternion.setFromUnitVectors(fwd, curve.getTangentAt(t)); m.castShadow = false; });
  };
  conduit([[0.55, 2.55, 1.15], [0.2, 2.35, 1.2], [-0.45, 2.15, 1.18], [-1.05, 1.7, 1.1], [-1.1, 0.9, 0.95], [-0.85, 0.45, 0.85]], [0.3, 0.62]);
  conduit([[0.7, 2.5, 1.15], [1.05, 2.2, 1.1], [1.12, 1.3, 0.75], [1.05, 0.55, 0.35], [0.8, 0.45, 0.1]], [0.4, 0.75]);
  conduit([[-1.05, 0.42, -0.9], [-0.4, 0.4, -1.15], [0.5, 0.41, -1.1], [1.05, 0.45, -0.6], [1.12, 1.2, -0.95], [0.7, 2.35, -1.05], [0.1, 2.5, -0.8]], [0.2, 0.5, 0.8]);
  conduit([[-0.95, 2.45, -0.2], [-1.1, 2.0, 0.3], [-1.05, 1.4, 0.6], [-0.8, 1.1, 0.7]], [0.5]);
  pipe([[0.43, 2.35, 0.05], [0.43, 2.15, 0.05], [0.62, 2.12, 0.05], [0.62, 1.85, 0.1], [0.45, 1.82, 0.1], [0.45, 1.55, 0.15]], 0.012, copper);
  pipe([[-0.5, 2.42, 0.3], [-0.5, 2.62, 0.3], [-0.3, 2.64, 0.32], [-0.3, 2.42, 0.32]], 0.014, copper);
  const coil = [];
  for (let k = 0; k <= 48; k++) { const a = k / 48 * Math.PI * 6; coil.push([-0.35 + 0.07 * Math.cos(a), 2.44 + k * 0.0028, -0.1 + 0.07 * Math.sin(a)]); }
  pipe(coil, 0.009, copper);
  /* inner perforated partition on the pump side, behind the valve */
  {
    const w = 0.6, h = 1.2, sh = new T.Shape(); sh.moveTo(-w / 2, -h / 2); sh.lineTo(w / 2, -h / 2); sh.lineTo(w / 2, h / 2); sh.lineTo(-w / 2, h / 2); sh.closePath();
    for (let y = -h / 2 + 0.1; y <= h / 2 - 0.1; y += 0.085) for (let x = -w / 2 + 0.08; x <= w / 2 - 0.08; x += 0.085) { const ph = new T.Path(); ph.absarc(x, y, 0.03, 0, Math.PI * 2, true); sh.holes.push(ph); }
    const g = new T.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: false, curveSegments: 6 }); g.translate(0, 0, -0.006);
    mesh(g, cream, pipes, 0.7, 1.6, -0.95).rotation.y = Math.PI / 2;
  }
  /* sight glass on the copper line up the right-hand side */
  cyl(0.032, 0.032, 0.09, brass, pipes, 0.91, 1.8, 0.31, 12);
  cyl(0.02, 0.02, 0.012, mat('#9fc3b8', 0.1, 0.05, { transmission: 0.5, thickness: 0.05 }), pipes, 0.945, 1.8, 0.31, 16).rotation.z = Math.PI / 2;

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
  /* place the groups in the squatter body: fan pack and controls drop onto the lid, interior parts scale in */
  const BASE = new Map([[fan, V(0, DROP, 0)], [cabinet, V(0, DROP, BODY.d / 2 - 1.07)], [tank, V(0, -0.11, 0)], [compressor, V(0, 0, 0)], [pump, V(0, 0, 0)], [pipes, V(0, 0, 0)]]);
  BASE.forEach((pos, g) => g.position.copy(pos));
  [tank, compressor, pump, pipes].forEach((g) => g.scale.setScalar(K));
  bake(model);
  [fan, cabinet, tank, compressor, pump, pipes, door, rotor].forEach(bake);
  /* the pipework and cabinet get their own material copies so the exploded view can fade just them */
  const pipeFades = [];
  pipes.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.transparent = true; pipeFades.push(o.material); } });
  panels.forEach((p) => { bake(p.g); placeBolts(p, 0); });
  await pause();
  geometryCache.forEach((g) => g.dispose());

  await pause();
  /* ---------- light: studio reflections, soft key shadow, interior lamp that comes up as it opens ---------- */
  const studio = new T.Scene(); studio.background = new T.Color('#697879');
  studio.add(new T.Mesh(new T.BoxGeometry(14, 12, 14), new T.MeshBasicMaterial({ color: '#5b6666', side: T.BackSide })));
  for (const l of [[-4, 4, 2, 4, 7, Math.PI / 2], [4, 3, 0, 3, 6, -Math.PI / 2], [0, 5, -3, 7, 3, 0]]) {
    const m = new T.Mesh(new T.PlaneGeometry(l[3], l[4]), new T.MeshBasicMaterial({ color: '#fff8e7' })); m.position.set(l[0], l[1], l[2]); m.rotation.y = l[5]; studio.add(m);
  }
  const pmrem = new T.PMREMGenerator(renderer), envTarget = pmrem.fromScene(studio, 0.08); extras.add(envTarget); scene.environment = envTarget.texture; scene.environmentIntensity = 0.66; pmrem.dispose();
  studio.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });
  scene.add(new T.HemisphereLight('#e4efee', '#4f5754', 1.45));
  const key = new T.DirectionalLight('#fff2da', 3.4); key.position.set(-3.2, 7.5, 4.2); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -3.6, right: 3.6, top: 4.6, bottom: -2.6, near: 4, far: 16 });
  key.shadow.normalBias = 0.02; key.shadow.bias = -0.0004; key.shadow.radius = 9; key.shadow.blurSamples = 16; scene.add(key);
  const fill = new T.DirectionalLight('#c0e3ff', 1.5); fill.position.set(4, 4, -2); scene.add(fill);
  const frontLight = new T.DirectionalLight('#e1f0de', 1.1); frontLight.position.set(1, 2, 6); scene.add(frontLight);
  const lamp = new T.PointLight('#fff1dc', 0, 6, 2); lamp.position.set(0.3, 1.7, 1.55); model.add(lamp);
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

  /* ---------- hotspot anchors: closed = on the casing, open = on the part (anchored to the part's group, so they follow it) ---------- */
  const anchor = (obj, p, n) => ({ obj, p: V(p[0], p[1], p[2]), n: V(n[0], n[1], n[2]).normalize() });
  const doorAnchor = anchor(door, [-0.06, 2.93, 1.16], [0, 0, 1]);
  const fanAnchor = anchor(fan, [0, 3.82, 0.1], [0, 1, 0.5]);
  const CLOSED = {
    1: doorAnchor, 2: fanAnchor,
    3: anchor(model, [-0.55, 0.62, BODY.d / 2 + 0.04], [0, 0, 1]),
    4: anchor(model, [-BODY.w / 2 - 0.04, 1.3, -0.2], [-1, 0, 0]),
    5: anchor(model, [0.5, 0.55, BODY.d / 2 + 0.04], [0, 0, 1]),
    6: anchor(model, [BODY.w / 2 + 0.04, 1.25, 0.25], [1, 0, 0])
  };
  const OPEN = {
    1: doorAnchor, 2: fanAnchor,
    3: anchor(compressor, [-0.67, 0.95, 0.93], [0, 0, 1]),
    4: anchor(tank, [-0.83, 1.6, -0.14], [-1, 0, 0]),
    5: anchor(pumpBody, [0.8, 0.61, 0.5], [1, 0, 0.3]),   /* side of the red end cover: hidden behind the front bracket from the left */
    6: anchor(pipes, [0.91, 1.3, -0.12], [1, 0, 0.3])
  };

  /* ---------- exploded view: each part moves out along its own line; pipework and cabinet fade ---------- */
  const EXPLODE = new Map([[fan, V(0, 0.95, 0)], [cabinet, V(0, 0.32, 0.62)], [compressor, V(-0.68, 0, 0.58)], [pump, V(0.72, 0, 0.62)], [tank, V(0, 0.12, -0.72)], [pipes, V(0, 0, 0)]]);

  /* ---------- isolate: the chosen part stays solid, everything else turns to a pale ghost ---------- */
  const ghost = new T.MeshBasicMaterial({ color: '#a9bccb', transparent: true, opacity: 0.12, depthWrite: false });
  const PART_GROUPS = { 1: [cabinet], 2: [fan], 3: [compressor], 4: [tank], 5: [pump], 6: [pipes] };
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

  await pause();
  /* ---------- how it works: dashes flow along both circuits (authored in the interior's coordinates, scaled like the pipes) ---------- */
  const flow = group(); flow.scale.setScalar(K); flow.userData.keep = true;
  const flowItems = [];
  const flowMat = (hex, repeat) => new T.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: new T.Color(hex) }, uOpacity: { value: 0 }, uRepeat: { value: repeat }, uSpeed: { value: reduce ? 0 : 0.9 } },
    transparent: true, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv;\nvoid main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform float uTime;\nuniform float uOpacity;\nuniform float uRepeat;\nuniform float uSpeed;\nuniform vec3 uColor;\nvarying vec2 vUv;\nvoid main() {\n  float s = fract(vUv.x * uRepeat - uTime * uSpeed);\n  float a = smoothstep(0.0, 0.1, s) * (1.0 - smoothstep(0.55, 0.62, s));\n  vec3 c = mix(uColor * 0.6, uColor * 1.2, s);\n  gl_FragColor = vec4(c, (0.22 + 0.78 * a) * uOpacity);\n  #include <colorspace_fragment>\n}'
  });
  const flowPath = (points, hex, steps) => {
    const curve = new T.CatmullRomCurve3(points.map((q) => V(q[0], q[1], q[2])), false, 'centripetal');
    const m = new T.Mesh(new T.TubeGeometry(curve, Math.max(40, points.length * 16), 0.045, 8, false), flowMat(hex, curve.getLength() / 0.22));
    m.renderOrder = 10; m.userData.flow = true; m.frustumCulled = false;
    flow.add(m); flowItems.push({ m, steps });
  };
  const C = { warm: '#f39a3d', chilled: '#2f8bff', hot: '#e8402a', liquid: '#f2735a', cold: '#36d1ff' };
  /* water: warm return from the process into the tank (step 1); chilled water from the tank through the pump back out (step 4) */
  flowPath([[1.75, 2.1, 0.0], [1.2, 2.1, 0.02], [0.6, 2.25, -0.1], [-0.1, 2.45, -0.2], [-0.15, 1.9, -0.25]], C.warm, [1]);
  flowPath([[0.31, 0.61, -0.72], [0.58, 0.61, -0.55], [0.58, 0.61, -0.21], [0.58, 0.97, -0.24], [0.9, 1.02, -0.24], [0.91, 1.64, -0.24], [1.3, 1.66, -0.24], [1.8, 1.66, -0.24]], C.chilled, [4]);
  /* refrigerant: cold vapour from the evaporator to the compressor (step 2); hot gas to the condenser, warm liquid back (step 3) */
  flowPath([[-0.15, 2.42, 0.3], [-0.2, 1.94, 0.41], [-0.37, 1.79, 0.55], [-0.67, 1.68, 0.61], [-0.67, 1.45, 0.62]], C.cold, [2]);
  flowPath([[-0.86, 1.31, 0.66], [-0.94, 1.51, 0.66], [-0.94, 2.55, 0.4], [-0.78, 2.85, -0.2], [-0.2, 2.86, -0.4], [0.43, 2.82, 0.05]], C.hot, [3]);
  flowPath([[0.43, 2.82, 0.05], [0.58, 2.5, 0.07], [0.91, 2.54, 0.22], [0.91, 1.07, 0.4], [0.84, 0.5, 0.5], [0.15, 0.62, 0.82], [-0.1, 0.9, 0.7], [-0.15, 2.42, 0.3]], C.liquid, [3]);
  /* the evaporator point, at the tank connection (type not shown: it is not confirmed for this unit) */
  const evap = new T.Mesh(new T.TorusGeometry(0.16, 0.018, 8, 40), new T.MeshBasicMaterial({ color: C.cold, transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
  evap.rotation.x = Math.PI / 2; evap.position.set(-0.15, 2.45, 0.3); evap.renderOrder = 11; evap.userData.flow = true; flow.add(evap);
  /* heat leaving through the fan: upward chevrons above the guard (step 3) */
  const heatTex = canvasTex(128, 128, (g) => { g.strokeStyle = '#ffffff'; g.lineWidth = 16; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(24, 84); g.lineTo(64, 44); g.lineTo(104, 84); g.stroke(); });
  const heat = [];
  for (let k = 0; k < 6; k++) {
    const sp = new T.Sprite(new T.SpriteMaterial({ map: heatTex, color: '#ff6a3d', transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    sp.scale.set(0.32, 0.32, 1); sp.visible = false; sp.renderOrder = 12; sp.userData.flow = true; sp.userData.x = (k % 3 - 1) * 0.42; sp.userData.ph = k / 6;
    model.add(sp); heat.push(sp);
  }

  /* ---------- state, camera, layout ---------- */
  const target = V(0, 1.4 + PAL, 0);
  const st = { open: 0, explode: 0, flow: 0, step: 1, zoom: 1, isolate: 0, still: false };
  let baseDist = 9, dist = 9, elev = 14 * Math.PI / 180, fanSpeed = 1, shapeDirty = true, shadowDirty = true, flowTime = 0;
  const placeCamera = () => {
    const e = ease(st.open), x = ease(st.explode), f = ease(st.flow);
    dist = baseDist * (1 - 0.05 * e + 0.42 * x + 0.16 * f) * st.zoom;
    const ty = target.y - 0.06 * e + 0.38 * x - (st.still ? 0 : 0.55) * f;   /* how it works: the unit sits above the caption card (not in stills) */
    camera.position.set(0, ty + dist * Math.sin(elev), dist * Math.cos(elev));
    camera.lookAt(0, ty, 0);
  };
  let composer = null, gtao = null, useAO = false, stillFrame = false;
  const frameFor = (w, h) => {
    camera.aspect = w / h;
    /* The poster is a 4:5 capture. Match object-fit: contain at every stage size. */
    const half = Math.tan(32 * Math.PI / 360), referenceAspect = 4 / 5;
    baseDist = Math.max(1.78 / half, 1.65 / (half * referenceAspect)) + 1.25;
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
    /* opening: door, bolts, panels, lamp */
    const d = lin(st.open, WIN.door);
    doorPivot.rotation.y = -1.85 * (d <= 0 ? 0 : backOut(d)) * (1 - ease(Math.max(st.explode, st.flow)));   /* the door shuts for the exploded and how-it-works views */
    panels.forEach((p) => {
      const t = lin(st.open, p.win);
      const unscrew = ease(clamp01(t / 0.28)), pull = ease(clamp01((t - 0.22) / 0.25)), away = ease(clamp01((t - 0.4) / 0.6));
      if (t !== p.last) { placeBolts(p, unscrew); p.last = t; }
      p.g.position.copy(p.origin).addScaledVector(p.n, 0.12 * pull + 0.55 * away);
      p.g.position.y = p.origin.y + 0.05 * pull - 0.45 * away * away;
      p.g.rotation.x = 0.22 * away;
      const op = 1 - clamp01((away - 0.35) / 0.55);
      p.fades.forEach((m) => { m.opacity = op; });
      p.g.visible = op > 0.01;
      const cast = away < 0.3;
      if (p.cast !== cast) { p.cast = cast; p.g.traverse((o) => { if (o.isMesh) o.castShadow = cast; }); }
    });
    lamp.intensity = 2.6 * phase(st.open, WIN.light);
    /* exploded: parts move out, pipework and cabinet fade */
    const x = ease(st.explode);
    EXPLODE.forEach((vec, g) => g.position.copy(BASE.get(g)).addScaledVector(vec, x));
    pipeFades.forEach((m) => { m.opacity = 1 - 0.85 * x; });
    shellBlue.opacity = 1 - 0.72 * x;
    if (shellBlue.transparent !== x > 0.001) { shellBlue.transparent = x > 0.001; shellBlue.needsUpdate = true; }
    /* flow: fade the circuits in; the current step is bright, the rest dim */
    const f = ease(st.flow);
    flowItems.forEach((it) => { it.m.material.uniforms.uOpacity.value = f * (!st.step || it.steps.indexOf(st.step) >= 0 ? 1 : 0.16); });   /* step 0: both circuits at once */
    flow.visible = f > 0.002;
    if (f <= 0.002) { heat.forEach((sp) => { sp.visible = false; }); evap.material.opacity = 0; }   /* nothing lingers after leaving the flow view */
    /* the fan runs while the flow is shown, and spins down as the unit is opened for service */
    fanSpeed = Math.max(1 - phase(st.open, WIN.fan), f);
    applyIsolate(st.isolate);
    shapeDirty = true;
  };
  const animateFlow = () => {
    const f = ease(st.flow);
    flowItems.forEach((it) => { it.m.material.uniforms.uTime.value = flowTime; });
    const evapOn = f * (!st.step || st.step === 2 ? 1 : 0.15);
    evap.material.opacity = evapOn * (0.55 + 0.45 * Math.sin(flowTime * 4));
    evap.scale.setScalar(1 + 0.12 * Math.sin(flowTime * 4));
    const heatOn = f * (!st.step || st.step === 3 ? 1 : 0);
    heat.forEach((sp) => {
      const u = (flowTime * 0.45 + sp.userData.ph) % 1;
      sp.position.set(sp.userData.x, BODY.top + 0.45 + u * 0.75, (sp.userData.ph - 0.5) * 0.5);
      sp.material.opacity = heatOn * Math.sin(Math.PI * u) * 0.9;
      sp.visible = heatOn > 0.01;
    });
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
    const w = stage.clientWidth, h = stage.clientHeight, sp = ease(st.open), set = sp >= 0.5 ? OPEN : CLOSED;
    const exploding = st.explode > 0.02 && st.explode < 0.98, hideAll = st.flow > 0.2 || exploding;
    hotspots.forEach((el, k) => {
      const a = set[el.dataset.hs];
      if (!a) return;
      const fade = sp >= 0.5 ? clamp01((sp - 0.62 - k * 0.05) / 0.1) : clamp01((0.38 - sp) / 0.1);
      const q = project(a, w, h);
      /* in the exploded view parts face every way; show every marker */
      const away = hideAll || (isolated && el.dataset.hs !== String(isolated)) || (st.explode < 0.98 && q.facing < 0.05) || fade < 0.2;
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
  const initial = opts.initialView || { ry: 35, rx: -14, zoom: 1 };
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
      const next = { open: clamp01(s.open || 0), explode: clamp01(s.explode || 0), flow: clamp01(s.flow || 0), step: s.step === undefined ? 1 : s.step, zoom: Math.max(0.65, Math.min(1.25, s.zoom || 1)), isolate: s.isolate || 0, still: !!s.still };
      const changed = next.open !== st.open || next.explode !== st.explode || next.flow !== st.flow || next.step !== st.step || next.isolate !== st.isolate;
      Object.assign(st, next);
      if (changed) applyState();
      placeCamera();
      need = true; request();
    },
    /* a still at a given size (diagram images, video frames), plus where each part's marker falls */
    capture(w, h, background, fanAngle, time) {
      if (fanAngle !== undefined) rotor.rotation.y = fanAngle;
      if (time !== undefined) flowTime = time;
      const pr = renderer.getPixelRatio();
      renderer.setPixelRatio(1); renderer.setSize(w, h, false); frameFor(w, h);
      shapeDirty = true; stillFrame = true; draw(); stillFrame = false;
      const out = document.createElement('canvas'); out.width = w; out.height = h;
      const g = out.getContext('2d');
      if (background) { g.fillStyle = background; g.fillRect(0, 0, w, h); }
      g.drawImage(cvs, 0, 0, w, h);
      const set = ease(st.open) >= 0.5 ? OPEN : CLOSED;
      const spots = hotspots.map((el) => { const q = project(set[el.dataset.hs], w, h); return { n: el.dataset.hs, x: q.x, y: q.y, visible: st.explode > 0.98 || q.facing > 0.05 }; });
      renderer.setPixelRatio(pr); fit(); shapeDirty = true; need = true; request();
      return { canvas: out, spots };
    },
    destroy
  };
  } catch (e) { cleanup(); throw e; }
}
