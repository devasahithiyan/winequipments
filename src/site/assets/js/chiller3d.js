/* WebGL model of a Win process chiller for partials/chiller360.html.
   Geometry adapted from the photo-referenced model in the "WIn equipments Chatgpt" workspace (commit 79594a6),
   built from the October 2026 photographs in images/chiller-reference/. Normalized illustration coordinates,
   not a fabrication drawing. Only labels visible on the real unit are drawn (CONTROLLER, POWER ON, HP TRIP,
   HP GAUGE), plus the Win Equipments logo at the owner's request.
   chiller360.js owns drag / keys / scroll / parts-list state and calls view.set(ry, rx, open).
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

export async function init(opts) {
  const stage = opts.stage, hotspots = opts.hotspots || [], reduce = !!opts.reduce;
  try { await document.fonts.load('700 64px Archivo'); } catch (e) { /* Arial fallback */ }

  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  /* phones and small CPUs render at a lower pixel ratio; desktops up to 1.75 */
  const lowEnd = (navigator.hardwareConcurrency || 4) <= 4 || matchMedia('(max-width: 767px)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowEnd ? 1.35 : 1.75));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.VSMShadowMap;
  renderer.shadowMap.autoUpdate = false;   /* shadows re-render only when the model moves, not for the spinning fan */
  renderer.setClearColor(0x000000, 0);
  const cvs = renderer.domElement;
  cvs.className = 'c3__canvas';
  cvs.setAttribute('aria-hidden', 'true');

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(32, 1, 0.1, 60);
  const model = new T.Group(); scene.add(model);
  const geometryCache = new Map();
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const mat = (color, metalness, roughness, extra) => new T.MeshPhysicalMaterial(Object.assign({ color, metalness, roughness }, extra || {}));

  /* fine stochastic surface height for the powder coat and foam texture seen in the photos */
  const noise = document.createElement('canvas'); noise.width = noise.height = 128;
  const nctx = noise.getContext('2d'), px = nctx.createImageData(128, 128);
  let seed = 41;
  for (let i = 0; i < px.data.length; i += 4) { seed = (seed * 1664525 + 1013904223) >>> 0; const v = 110 + (seed % 70); px.data[i] = px.data[i + 1] = px.data[i + 2] = v; px.data[i + 3] = 255; }
  nctx.putImageData(px, 0, 0);
  const grain = new T.CanvasTexture(noise); grain.wrapS = grain.wrapT = T.RepeatWrapping; grain.repeat.set(5, 5);

  const blue = mat('#0b7ec0', 0.4, 0.38, { clearcoat: 0.3, clearcoatRoughness: 0.42, bumpMap: grain, bumpScale: 0.009 });
  const cream = mat('#ecebdc', 0.2, 0.42, { clearcoat: 0.23, bumpMap: grain, bumpScale: 0.002 });
  const black = mat('#101619', 0.35, 0.21, { clearcoat: 0.75, clearcoatRoughness: 0.16 });
  const rubber = mat('#191d1e', 0, 0.9, { bumpMap: grain, bumpScale: 0.014 });
  const foam = mat('#252827', 0, 0.96, { bumpMap: grain, bumpScale: 0.025 });
  const chrome = mat('#a6b0b5', 0.95, 0.25), steel = mat('#849297', 0.83, 0.4, { bumpMap: grain, bumpScale: 0.003 });
  const copper = mat('#bd683f', 0.88, 0.29), red = mat('#d94326', 0.24, 0.26, { clearcoat: 0.45 });
  const white = mat('#e6e8df', 0.05, 0.32), dark = mat('#101b1c', 0.12, 0.5), green = mat('#147e56', 0.3, 0.25);
  const brass = mat('#b8994e', 0.86, 0.34), amber = mat('#eeb32b', 0.3, 0.23);

  const group = (parent) => { const g = new T.Group(); (parent || model).add(g); return g; };
  const frame = group(), fan = group(), tank = group(), compressor = group(), pump = group(), pipes = group(), cabinet = group();
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

  /* ---------- blue folded steel chassis ---------- */
  box(2.3, 0.12, 2.14, blue, frame, 0, 0.28, 0);
  for (const x of [-1.07, 1.07]) for (const z of [-0.99, 0.99]) {
    box(0.14, 3.32, 0.14, blue, frame, x, 1.7, z);
    box(0.24, 0.16, 0.26, blue, frame, x, 0.08, z);
    bolt(frame, x, 3.48, z, 'y');
  }
  box(2.3, 0.13, 2.14, blue, frame, 0, 3.35, 0);
  for (const z of [-1.03, 1.03]) { box(2.16, 0.11, 0.1, blue, frame, 0, 2.2, z); box(2.16, 0.2, 0.1, blue, frame, 0, 0.43, z); }
  for (const x of [-1.09, 1.09]) { box(0.1, 0.12, 2, blue, frame, x, 2.73, 0); box(0.1, 0.23, 2, blue, frame, x, 0.43, 0); }
  /* front service rail with the service valve and pressure switch (seen when the lower panel is off) */
  box(2.03, 0.18, 0.09, blue, frame, 0, 0.88, 0.91);

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

  /* ---------- control cabinet: fixed hinges and gauge, door on a pivot at its hinge line ---------- */
  for (const y of [2.45, 3.08]) { box(0.11, 0.16, 0.038, black, cabinet, -0.96, y, 1.119); bolt(cabinet, -0.98, y + 0.04, 1.143); bolt(cabinet, -0.98, y - 0.04, 1.143); }
  cyl(0.15, 0.15, 0.046, chrome, cabinet, -1.02, 2.16, 1.12, 48).rotation.x = Math.PI / 2;
  cyl(0.124, 0.124, 0.012, white, cabinet, -1.02, 2.16, 1.154, 48).rotation.x = Math.PI / 2;
  plate(canvasTex(256, 256, (g) => {
    g.fillStyle = '#f0f1e5'; g.fillRect(0, 0, 256, 256); g.translate(128, 128);
    for (let i = 0; i < 33; i++) { const a = (0.75 + i / 32 * 1.5) * Math.PI; g.save(); g.rotate(a); g.strokeStyle = i > 25 ? '#b04634' : '#243c3c'; g.lineWidth = i % 4 === 0 ? 4 : 2; g.beginPath(); g.moveTo(0, -100); g.lineTo(0, i % 4 === 0 ? -82 : -91); g.stroke(); g.restore(); }
    g.strokeStyle = '#212d2c'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(-49, -57); g.stroke();
    g.font = '20px Arial'; g.fillStyle = '#354d4a'; g.textAlign = 'center'; g.fillText('bar', 0, 52);
  }), 0.246, 0.246, cabinet, -1.02, 2.16, 1.163);
  decal('HP GAUGE', 0.31, 0.06, cabinet, -1.02, 2.38, 1.1, '#0b7ec0', '#eaf2f1', 42);
  /* the electrical box behind the door, with contactors on a rail */
  box(0.45, 0.74, 0.28, cream, cabinet, 0.55, 2.71, 0.81);
  box(0.4, 0.03, 0.02, steel, cabinet, 0.55, 2.86, 0.96, 0.004);
  for (const x of [0.41, 0.55, 0.69]) box(0.1, 0.18, 0.06, x === 0.55 ? dark : steel, cabinet, x, 2.86, 0.98, 0.01);
  box(0.36, 0.05, 0.04, green, cabinet, 0.55, 2.56, 0.97, 0.008);
  const doorPivot = group(cabinet); doorPivot.position.set(-0.98, 0, 1.1); doorPivot.userData.keep = true;
  const door = group(doorPivot); door.position.set(0.98, 0, -1.1);   /* children keep model coordinates */
  box(1.96, 0.86, 0.048, cream, door, 0, 2.76, 1.075);
  box(0.28, 0.3, 0.022, black, door, 0.7, 2.79, 1.117);
  box(0.12, 0.24, 0.045, dark, door, 0.7, 2.79, 1.14);
  box(0.09, 0.21, 0.018, steel, door, 0.7, 2.79, 1.152);
  box(0.39, 0.19, 0.037, black, door, -0.06, 2.93, 1.121);
  decal('15.0', 0.25, 0.1, door, -0.1, 2.93, 1.143, '#111e21', '#7cc88e', 88);   /* illustrative readout, not live */
  decal('CONTROLLER', 0.4, 0.06, door, -0.06, 2.78, 1.118, '#ecebdc', '#16252d', 44);
  for (const b of [[-0.23, green, 'POWER ON'], [0.22, amber, 'HP TRIP']]) {
    cyl(0.055, 0.055, 0.022, chrome, door, b[0], 2.57, 1.12).rotation.x = Math.PI / 2;
    cyl(0.043, 0.043, 0.033, b[1], door, b[0], 2.57, 1.145).rotation.x = Math.PI / 2;
    decal(b[2], 0.37, 0.06, door, b[0], 2.44, 1.112, '#ecebdc', '#16252d', 47);
  }
  for (const y of [2.4, 3.13]) box(0.06, 0.07, 0.035, black, door, 0.92, y, 1.124);

  /* ---------- removable panels with real capsule-shaped openings ---------- */
  const ventPanel = (w, h, columns, rows, front) => {
    const shape = new T.Shape(); shape.moveTo(-w / 2, -h / 2); shape.lineTo(w / 2, -h / 2); shape.lineTo(w / 2, h / 2); shape.lineTo(-w / 2, h / 2); shape.closePath();
    const sw = (w - 0.42) / columns * 0.72, sh = 0.072, dx = (w - 0.42) / columns;
    for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
      const x = (col - (columns - 1) / 2) * dx, y = (row - (rows - 1) / 2) * 0.14 - (front ? 0.22 : 0.28), r = sh / 2, a = sw / 2 - r, p = new T.Path();
      p.moveTo(x - a, y + r); p.lineTo(x + a, y + r); p.absarc(x + a, y, r, Math.PI / 2, -Math.PI / 2, true); p.lineTo(x - a, y - r); p.absarc(x - a, y, r, -Math.PI / 2, Math.PI / 2, true); shape.holes.push(p);
    }
    const g = new T.ExtrudeGeometry(shape, { depth: 0.028, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.006, bevelSegments: 1, curveSegments: 5 }); g.translate(0, 0, -0.014);
    return g;
  };
  const panels = [];
  /* corner bolts are one instanced mesh per panel so they can back out before the panel lifts */
  const boltHead = new T.CylinderGeometry(0.028, 0.028, 0.022, 6).rotateX(Math.PI / 2);
  const boltWasher = new T.CylinderGeometry(0.04, 0.04, 0.007, 16).rotateX(Math.PI / 2);
  const addPanel = (name, w, h, columns, rows, x, y, z, rotation, front) => {
    const g = group(); g.position.set(x, y, z); g.rotation.order = 'YXZ'; g.rotation.y = rotation;
    g.userData.keep = true;
    const pm = cream.clone(); pm.transparent = true;
    const hm = chrome.clone(); hm.transparent = true;
    const wm = steel.clone(); wm.transparent = true;
    mesh(ventPanel(w, h, columns, rows, front), pm, g);
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
  label(addPanel('front', 1.94, 1.77, 4, 5, 0, 1.35, 1.079, 0, true), logoTex, 0.62, 0.35, 0, 0.55);   /* Win Equipments logo, owner's request */
  const rightPanel = addPanel('right', 1.89, 2.82, 5, 9, 1.109, 1.84, 0, Math.PI / 2);
  label(rightPanel, stickerTex, 0.26, 0.36, -0.6, 1.0);
  label(rightPanel, canvasTex(200, 140, (g, w, h) => { g.fillStyle = '#f4f5ef'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(30,40,35,0.45)'; g.lineWidth = 3; g.strokeRect(6, 6, w - 12, h - 12); for (let y = 30; y < h - 10; y += 18) { g.beginPath(); g.moveTo(10, y); g.lineTo(w - 10, y); g.stroke(); } }), 0.3, 0.21, 0.62, 1.12);
  addPanel('left', 1.89, 2.82, 5, 9, -1.109, 1.84, 0, -Math.PI / 2);
  addPanel('back', 1.96, 2.82, 5, 9, 0, 1.84, -1.049, Math.PI);

  /* ---------- foam-insulated tank with metal lid, seams and sight glass ---------- */
  box(1.26, 1.79, 1.19, foam, tank, -0.15, 1.41, -0.22, 0.035);
  for (const z of [-0.62, 0.12]) box(0.012, 1.74, 0.02, rubber, tank, -0.782, 1.41, z, 0.004);   /* insulation sheet seams */
  box(0.02, 1.74, 0.012, rubber, tank, 0.2, 1.41, 0.382, 0.004);
  box(1.29, 0.065, 1.22, steel, tank, -0.15, 2.335, -0.22, 0.012);
  for (const z of [-0.83, 0.39]) box(1.26, 0.025, 0.026, rubber, tank, -0.15, 0.54, z);
  for (const x of [-0.72, 0.42]) for (const z of [-0.76, 0.31]) bolt(tank, x, 2.37, z, 'y');
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

  /* ---------- pump: finned motor, red end cover, cast body, PVC unions and blue valve ---------- */
  cyl(0.205, 0.205, 0.62, steel, pump, 0.58, 0.61, 0.2).rotation.x = Math.PI / 2;
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; box(0.025, 0.045, 0.54, steel, pump, 0.58 + Math.sin(a) * 0.215, 0.61 + Math.cos(a) * 0.215, 0.2, 0.004).rotation.z = -a; }
  cyl(0.224, 0.224, 0.12, red, pump, 0.58, 0.61, 0.55).rotation.x = Math.PI / 2;
  cyl(0.155, 0.155, 0.014, black, pump, 0.58, 0.61, 0.617).rotation.x = Math.PI / 2;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; cyl(0.018, 0.018, 0.017, steel, pump, 0.58 + 0.12 * Math.cos(a), 0.61 + 0.12 * Math.sin(a), 0.635).rotation.x = Math.PI / 2; }
  box(0.23, 0.11, 0.32, steel, pump, 0.58, 0.39, 0.22);
  for (const x of [0.43, 0.73]) for (const z of [0.06, 0.39]) bolt(pump, x, 0.44, z, 'y');
  cyl(0.23, 0.18, 0.23, steel, pump, 0.58, 0.61, -0.21).rotation.x = Math.PI / 2;
  cyl(0.13, 0.13, 0.22, steel, pump, 0.58, 0.79, -0.24);
  pipe([[0.58, 0.83, -0.24], [0.58, 0.97, -0.24], [0.9, 1.02, -0.24], [0.91, 1.42, -0.24]], 0.078, white, pump);
  for (const y of [1.09, 1.3]) cyl(0.105, 0.105, 0.11, white, pump, 0.91, y, -0.24);
  cyl(0.09, 0.09, 0.15, white, pump, 0.91, 1.52, -0.24);
  box(0.36, 0.045, 0.095, mat('#2457c9', 0.2, 0.35), pump, 0.91, 1.64, -0.24);
  pipe([[0.58, 0.61, -0.34], [0.58, 0.61, -0.55], [0.31, 0.61, -0.6], [0.31, 0.61, -0.72]], 0.066, white, pump);
  box(0.24, 0.15, 0.2, black, pump, 0.58, 0.86, 0.17);
  plate(canvasTex(256, 96, (g, w, h) => { g.fillStyle = '#dfe3ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0392b'; g.fillRect(0, 0, 40, h); g.fillStyle = 'rgba(30,40,60,0.4)'; for (let y = 14; y < h - 8; y += 14) g.fillRect(52, y, w - 64, 5); }), 0.3, 0.11, pump, 0.58, 0.83, 0.42);
  cyl(0.08, 0.08, 0.13, chrome, pump, 0.88, 0.43, 0.51).rotation.z = Math.PI / 2;

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
  /* sight glass on the copper line up the right-hand side */
  cyl(0.032, 0.032, 0.09, brass, pipes, 0.91, 1.8, 0.31, 12);
  cyl(0.02, 0.02, 0.012, mat('#9fc3b8', 0.1, 0.05, { transmission: 0.5, thickness: 0.05 }), pipes, 0.945, 1.8, 0.31, 16).rotation.z = Math.PI / 2;

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
  bake(model); bake(door); bake(rotor);
  panels.forEach((p) => { bake(p.g); placeBolts(p, 0); });
  geometryCache.forEach((g) => g.dispose());

  /* ---------- light: studio reflections, soft key shadow, interior lamp that comes up as it opens ---------- */
  const studio = new T.Scene(); studio.background = new T.Color('#697879');
  studio.add(new T.Mesh(new T.BoxGeometry(14, 12, 14), new T.MeshBasicMaterial({ color: '#5b6666', side: T.BackSide })));
  for (const l of [[-4, 4, 2, 4, 7, Math.PI / 2], [4, 3, 0, 3, 6, -Math.PI / 2], [0, 5, -3, 7, 3, 0]]) {
    const m = new T.Mesh(new T.PlaneGeometry(l[3], l[4]), new T.MeshBasicMaterial({ color: '#fff8e7' })); m.position.set(l[0], l[1], l[2]); m.rotation.y = l[5]; studio.add(m);
  }
  const pmrem = new T.PMREMGenerator(renderer); scene.environment = pmrem.fromScene(studio, 0.08).texture; scene.environmentIntensity = 0.75; pmrem.dispose();
  scene.add(new T.HemisphereLight('#e4efee', '#59625f', 1.7));
  const key = new T.DirectionalLight('#fff2da', 3.4); key.position.set(-3.2, 7.5, 4.2); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -3.6, right: 3.6, top: 4.6, bottom: -2.6, near: 4, far: 16 });
  key.shadow.normalBias = 0.02; key.shadow.bias = -0.0004; key.shadow.radius = 9; key.shadow.blurSamples = 16; scene.add(key);
  const fill = new T.DirectionalLight('#c0e3ff', 1.5); fill.position.set(4, 4, -2); scene.add(fill);
  const frontLight = new T.DirectionalLight('#e1f0de', 1.1); frontLight.position.set(1, 2, 6); scene.add(frontLight);
  const lamp = new T.PointLight('#fff1dc', 0, 6, 2); lamp.position.set(0.3, 2.55, 1.6); model.add(lamp);
  const floor = new T.Mesh(new T.PlaneGeometry(40, 40), new T.ShadowMaterial({ opacity: 0.13 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  /* ---------- contact shadow: the unit rendered from below into a blurred texture, darker where it touches the floor ---------- */
  const CS = 7, CS_H = 2.4;
  const rtA = new T.WebGLRenderTarget(512, 512), rtB = new T.WebGLRenderTarget(512, 512);
  rtA.texture.generateMipmaps = rtB.texture.generateMipmaps = false;
  const csGeo = new T.PlaneGeometry(CS, CS).rotateX(Math.PI / 2);
  const csPlane = new T.Mesh(csGeo, new T.MeshBasicMaterial({ map: rtA.texture, opacity: 0.8, transparent: true, depthWrite: false }));
  csPlane.renderOrder = 1; csPlane.scale.y = -1; csPlane.position.y = 0.003; scene.add(csPlane);
  const blurPlane = new T.Mesh(csGeo); blurPlane.visible = false; scene.add(blurPlane);
  const csCam = new T.OrthographicCamera(-CS / 2, CS / 2, CS / 2, -CS / 2, 0, CS_H); csCam.rotation.x = Math.PI / 2; scene.add(csCam);
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
  const blur = (amount) => {
    blurPlane.visible = true;
    blurPlane.material = hBlur; hBlur.uniforms.tDiffuse.value = rtA.texture; hBlur.uniforms.d.value = amount / 256;
    renderer.setRenderTarget(rtB); renderer.render(blurPlane, csCam);
    blurPlane.material = vBlur; vBlur.uniforms.tDiffuse.value = rtB.texture; vBlur.uniforms.d.value = amount / 256;
    renderer.setRenderTarget(rtA); renderer.render(blurPlane, csCam);
    blurPlane.visible = false;
  };
  const updateContact = () => {
    floor.visible = csPlane.visible = false;
    scene.overrideMaterial = depthMat;
    renderer.setRenderTarget(rtA); renderer.clear(); renderer.render(scene, csCam);
    scene.overrideMaterial = null;
    blur(3.4); blur(1.3);
    renderer.setRenderTarget(null);
    floor.visible = csPlane.visible = true;
  };

  /* ---------- hotspot anchors: closed = on the casing, open = on the part ---------- */
  const anchor = (obj, p, n) => ({ obj, p: V(p[0], p[1], p[2]), n: V(n[0], n[1], n[2]).normalize() });
  const doorAnchor = anchor(door, [-0.06, 2.93, 1.16], [0, 0, 1]);
  const fanAnchor = anchor(model, [0, 3.82, 0.1], [0, 1, 0.5]);
  const CLOSED = {
    1: doorAnchor, 2: fanAnchor,
    3: anchor(model, [-0.62, 1.0, 1.11], [0, 0, 1]),
    4: anchor(model, [-1.14, 1.75, -0.2], [-1, 0, 0]),
    5: anchor(model, [0.58, 0.75, 1.11], [0, 0, 1]),
    6: anchor(model, [1.14, 1.6, 0.25], [1, 0, 0])
  };
  const OPEN = {
    1: doorAnchor, 2: fanAnchor,
    3: anchor(model, [-0.67, 0.95, 0.93], [0, 0, 1]),
    4: anchor(model, [-0.83, 1.6, -0.14], [-1, 0, 0]),
    5: anchor(model, [0.8, 0.61, 0.5], [1, 0, 0.3]),   /* side of the red end cover: hidden behind the front rail from the left */
    6: anchor(model, [0.91, 1.3, -0.12], [1, 0, 0.3])
  };

  /* ---------- camera, layout, opening ---------- */
  const target = V(0, 1.85, 0);
  let baseDist = 9, dist = 9, elev = 14 * Math.PI / 180, open = 0, fanSpeed = 1, shapeDirty = true;
  const placeCamera = () => {
    const e = ease(open);
    dist = baseDist * (1 - 0.05 * e);
    const ty = target.y - 0.08 * e;
    camera.position.set(0, ty + dist * Math.sin(elev), dist * Math.cos(elev));
    camera.lookAt(0, ty, 0);
  };
  const frameFor = (w, h) => {
    camera.aspect = w / h;
    const half = Math.tan(camera.fov * Math.PI / 360);
    baseDist = Math.max(2.25 / half, 1.75 / (half * camera.aspect)) + 1.2;
    camera.updateProjectionMatrix();
    placeCamera();
  };
  const fit = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    frameFor(w, h);
  };
  const applyOpen = () => {
    const d = lin(open, WIN.door);
    doorPivot.rotation.y = -1.85 * (d <= 0 ? 0 : backOut(d));
    panels.forEach((p) => {
      const t = lin(open, p.win);
      const unscrew = ease(clamp01(t / 0.28)), pull = ease(clamp01((t - 0.22) / 0.25)), away = ease(clamp01((t - 0.4) / 0.6));
      if (t !== p.last) { placeBolts(p, unscrew); p.last = t; }
      p.g.position.copy(p.origin).addScaledVector(p.n, 0.12 * pull + 0.55 * away);
      p.g.position.y = p.origin.y + 0.05 * pull - 0.45 * away * away;
      p.g.rotation.x = 0.22 * away;   /* the top tips outward as the panel comes away */
      const op = 1 - clamp01((away - 0.35) / 0.55);
      p.fades.forEach((m) => { m.opacity = op; });
      p.g.visible = op > 0.01;
      const cast = away < 0.3;
      if (p.cast !== cast) { p.cast = cast; p.g.traverse((o) => { if (o.isMesh) o.castShadow = cast; }); }
    });
    lamp.intensity = 2.6 * phase(open, WIN.light);
    fanSpeed = 1 - phase(open, WIN.fan);   /* the fan spins down: a unit is opened with the power off */
    shapeDirty = true;
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
    const w = stage.clientWidth, h = stage.clientHeight, sp = ease(open), set = sp >= 0.5 ? OPEN : CLOSED;
    hotspots.forEach((el, k) => {
      const a = set[el.dataset.hs];
      if (!a) return;
      /* closed markers leave as it starts to open; open markers arrive one after another once it is open */
      const fade = sp >= 0.5 ? clamp01((sp - 0.62 - k * 0.05) / 0.1) : clamp01((0.38 - sp) / 0.1);
      const q = project(a, w, h), away = q.facing < 0.05 || fade < 0.2;
      el.classList.toggle('is-away', away);
      el.style.opacity = away ? '' : fade.toFixed(2);
      el.style.left = q.x.toFixed(1) + 'px';
      el.style.top = q.y.toFixed(1) + 'px';
    });
  };

  /* ---------- render loop: renders only when something changed; the fan keeps it running while it spins ---------- */
  let raf = 0, need = true, inView = true, last = 0, alive = true;
  const spin = !reduce;
  const draw = () => {
    model.updateMatrixWorld(true);
    if (shapeDirty) { updateContact(); renderer.shadowMap.needsUpdate = true; shapeDirty = false; }
    placeHotspots();
    renderer.render(scene, camera);
  };
  /* slow devices: if the first frames average under ~40 fps, drop once to pixel ratio 1 and a smaller, cheaper shadow */
  const samples = [];
  let degraded = false;
  const degrade = () => {
    degraded = true;
    renderer.setPixelRatio(1);
    key.shadow.mapSize.set(512, 512); key.shadow.blurSamples = 8;
    if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; }
    fit(); shapeDirty = true; need = true;
  };
  const tick = (t) => {
    raf = 0;
    if (!alive) return;
    const raw = last ? t - last : 0;
    const dt = Math.min(50, raw); last = t;
    if (!degraded && raw > 0 && samples.length < 45) {
      samples.push(raw);
      if (samples.length === 45) { const s = samples.slice(5); if (s.reduce((a, b) => a + b, 0) / s.length > 24) degrade(); }
    }
    const spinning = spin && inView && fanSpeed > 0.002;
    if (spinning) { rotor.rotation.y -= dt * 0.006 * fanSpeed; need = true; }
    if (need) { draw(); need = false; }
    if (spinning && !document.hidden) raf = requestAnimationFrame(tick);
    else last = 0;
  };
  const request = () => { if (!raf && alive) raf = requestAnimationFrame(tick); };

  stage.insertBefore(cvs, stage.firstChild);
  stage.appendChild(layer);
  hotspots.forEach((el) => layer.appendChild(el));
  fit();

  const ro = new ResizeObserver(() => { fit(); need = true; request(); });
  ro.observe(stage);
  const io = new IntersectionObserver((en) => { inView = en[en.length - 1].isIntersecting; if (inView) { need = true; request(); } }, { threshold: 0.05 });
  io.observe(stage);
  const onVis = () => { if (!document.hidden) request(); };
  document.addEventListener('visibilitychange', onVis);

  const destroy = () => {
    alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    homes.forEach((hm) => { hm.el.removeAttribute('style'); hm.el.classList.remove('is-away'); hm.parent.insertBefore(hm.el, hm.next); });
    layer.remove(); cvs.remove(); rtA.dispose(); rtB.dispose(); renderer.dispose();
  };
  cvs.addEventListener('webglcontextlost', (e) => { e.preventDefault(); destroy(); if (opts.onLost) opts.onLost(); });
  layer.addEventListener('click', (e) => { const hs = e.target.closest('.c3__hs'); if (hs && opts.onSelect) opts.onSelect(hs.dataset.hs); });

  applyOpen();
  draw();
  request();

  return {
    set(ry, rx, o) {
      model.rotation.y = ry * Math.PI / 180;
      elev = -rx * Math.PI / 180;
      const next = clamp01(o || 0);
      if (next !== open) { open = next; applyOpen(); }
      placeCamera();
      shapeDirty = true; need = true; request();
    },
    /* a still at a given size (for diagram images and video frames), plus where each part's marker falls */
    capture(w, h, background, fanAngle) {
      if (fanAngle !== undefined) rotor.rotation.y = fanAngle;
      const pr = renderer.getPixelRatio();
      renderer.setPixelRatio(1); renderer.setSize(w, h, false); frameFor(w, h);
      shapeDirty = true; draw();
      const out = document.createElement('canvas'); out.width = w; out.height = h;
      const g = out.getContext('2d');
      if (background) { g.fillStyle = background; g.fillRect(0, 0, w, h); }
      g.drawImage(cvs, 0, 0, w, h);
      const set = ease(open) >= 0.5 ? OPEN : CLOSED;
      const spots = hotspots.map((el) => { const q = project(set[el.dataset.hs], w, h); return { n: el.dataset.hs, x: q.x, y: q.y, visible: q.facing > 0.05 }; });
      renderer.setPixelRatio(pr); fit(); shapeDirty = true; need = true; request();
      return { canvas: out, spots };
    },
    destroy
  };
}
