/* WebGL model of a WCP 100 process chiller for partials/chiller360.html.
   Loaded on demand by chiller360.js, which keeps the drag / keys / parts-list logic and calls view.set(ry, rx).
   Built from primitives, proportions read from the WCP 100 photos (images/works/air-cooled-chiller-wcp100.jpg,
   images/Products/chiller.png): blue tube frame, white panels, perforated condenser grille with the coil behind it,
   four fans on top behind wire guards, controls and nameplate panels, perforated lower side panel, feet.
   Note: no template literals here; the build's minifier mangles them. */
import * as THREE from 'three';
import { RoomEnvironment } from '/js/vendor/RoomEnvironment.js?v=170';

/* proportions (metres-ish, only ratios matter) */
const W = 1.0, D = 0.9, H = 1.32, T = 0.042, FOOT = 0.05, RAIL_B = T * 1.6;
const Y_SPLIT = FOOT + 0.55 * (H - FOOT);      /* front/side mid rail, from the photo */
const X_SPLIT = 0.41;                           /* controls panel share of the lower front */
const SIDE_SPLIT = 0.36;                        /* narrow rear panel share of the upper side */
const C = { blue: 0x1d3fae, panel: 0xe9ebe5, dark: 0x16191b, screw: 0x6a716c, fan: 0x23272a, wire: 0x111314 };

const FACES = {
  front: { n: new THREE.Vector3(0, 0, 1), r: new THREE.Vector3(1, 0, 0), rot: 0, half: W / 2, depth: D / 2 },
  back: { n: new THREE.Vector3(0, 0, -1), r: new THREE.Vector3(-1, 0, 0), rot: Math.PI, half: W / 2, depth: D / 2 },
  left: { n: new THREE.Vector3(-1, 0, 0), r: new THREE.Vector3(0, 0, 1), rot: -Math.PI / 2, half: D / 2, depth: W / 2 },
  right: { n: new THREE.Vector3(1, 0, 0), r: new THREE.Vector3(0, 0, -1), rot: Math.PI / 2, half: D / 2, depth: W / 2 }
};

/* hotspot anchors: data-hs number -> point on the casing + outward normal */
const ANCHORS = {
  1: { face: 'front', u: -W / 2 + T + X_SPLIT * (W - 2 * T) / 2, y: (FOOT + RAIL_B + Y_SPLIT) / 2 + 0.06 },
  2: { face: 'front', u: 0.14, y: (Y_SPLIT + H) / 2 - 0.02 },
  3: { face: 'left', u: 0.05, y: FOOT + 0.27 * (H - FOOT) },
  4: { face: 'left', u: -0.12, y: Y_SPLIT + 0.2 },
  5: { top: true },
  6: { face: 'back', u: -0.2, y: FOOT + 0.25 * (H - FOOT) }
};

/* ---------- canvas textures ---------- */
const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const tex = (c, color) => { const t = new THREE.CanvasTexture(c); if (color) t.colorSpace = THREE.SRGBColorSpace; return t; };

/* perforated sheet: white = metal, black = hole (used as alphaMap) */
function perfAlpha(wM, hM, region, pitch, hole) {
  const ppm = 900, c = canvas(Math.round(wM * ppm), Math.round(hM * ppm)), g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#000';
  const x0 = region[0] * ppm, y0 = region[1] * ppm, x1 = region[2] * ppm, y1 = region[3] * ppm, p = pitch * ppm, s = hole * ppm;
  for (let y = y0; y + s <= y1; y += p) for (let x = x0; x + s <= x1; x += p) g.fillRect(x, y, s, s);
  return tex(c, false);
}

/* condenser coil seen through the grille: fine vertical fins, horizontal copper tube rows */
function coilTex() {
  const c = canvas(512, 256), g = c.getContext('2d');
  for (let x = 0; x < 512; x += 3) { g.fillStyle = x % 6 ? '#8e9599' : '#6f767a'; g.fillRect(x, 0, 3, 256); }
  for (let y = 10; y < 256; y += 32) {
    const gr = g.createLinearGradient(0, y, 0, y + 9);
    gr.addColorStop(0, '#5a4a3c'); gr.addColorStop(0.5, '#b07a52'); gr.addColorStop(1, '#4a3c30');
    g.fillStyle = gr; g.fillRect(0, y, 512, 9);
  }
  const t = tex(c, true); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 4);
  return t;
}

function label(g, text, x, y, size, color, weight) {
  g.font = (weight || 600) + ' ' + size + 'px Archivo, Arial, sans-serif';
  g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, x, y);
}

/* control panel artwork; button positions are shared with the 3D buttons */
const BUTTONS = [
  [0.27, 0.42, 0x1f9a3a, 'PUMP ON'], [0.5, 0.42, 0x1f9a3a, 'COMP ON'], [0.73, 0.42, 0x2b5fd3, 'RESET'],
  [0.27, 0.56, 0xd3302b, 'PUMP OLR'], [0.5, 0.56, 0xd3302b, 'COMP OLR'], [0.73, 0.56, 0xd3302b, 'HP/LP TRIP'],
  [0.38, 0.7, 0xd3302b, 'ANTI FREEZE'], [0.62, 0.7, 0xd3302b, 'PHASE FAILURE']
];
function controlsTex(wM, hM) {
  const c = canvas(512, Math.round(512 * hM / wM)), g = c.getContext('2d'), w = c.width, h = c.height;
  g.fillStyle = '#e9ebe5'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#1b1f22'; g.fillRect(w * 0.36, h * 0.17, w * 0.28, h * 0.055);
  label(g, '15.0', w * 0.5, h * 0.198, h * 0.04, '#ff5b4a', 700);
  label(g, 'CONTROLLER', w * 0.5, h * 0.255, h * 0.02, '#3a3f3c', 600);
  BUTTONS.forEach((b) => label(g, b[3], w * b[0], h * (b[1] + 0.045), h * 0.019, '#2c3a8c', 650));
  return tex(c, true);
}
function brandTex(wM, hM) {
  const c = canvas(512, Math.round(512 * hM / wM)), g = c.getContext('2d'), w = c.width, h = c.height;
  g.fillStyle = '#e9ebe5'; g.fillRect(0, 0, w, h);
  label(g, 'WIN', w * 0.5, h * 0.27, h * 0.13, '#0d8a3a', 800);
  label(g, 'WCP 100', w * 0.5, h * 0.42, h * 0.075, '#0f7a34', 700);
  return tex(c, true);
}
function stickerTex() {
  const c = canvas(128, 176), g = c.getContext('2d');
  g.fillStyle = '#f2c018'; g.fillRect(0, 0, 128, 176);
  g.fillStyle = '#d12a1f'; g.fillRect(0, 0, 128, 22);
  g.fillStyle = 'rgba(40,30,0,0.35)';
  for (let y = 34; y < 168; y += 11) g.fillRect(10, y, 108 - (y % 3) * 14, 3);
  return tex(c, true);
}
function contactShadowTex() {
  const c = canvas(256, 256), g = c.getContext('2d');
  g.filter = 'blur(18px)'; g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(52, 56, 152, 144);
  return tex(c, false);
}

/* ---------- geometry helpers ---------- */
function tubeGeo(len, a, b, r) {
  const s = new THREE.Shape(), x = a / 2, y = b / 2;
  s.moveTo(-x + r, -y); s.lineTo(x - r, -y); s.quadraticCurveTo(x, -y, x, -y + r); s.lineTo(x, y - r); s.quadraticCurveTo(x, y, x - r, y);
  s.lineTo(-x + r, y); s.quadraticCurveTo(-x, y, -x, y - r); s.lineTo(-x, -y + r); s.quadraticCurveTo(-x, -y, -x + r, -y);
  const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false, curveSegments: 3 });
  g.translate(0, 0, -len / 2);
  return g;
}

export async function init(opts) {
  const stage = opts.stage, hotspots = opts.hotspots || [], reduce = !!opts.reduce;
  try { await document.fonts.load('800 64px Archivo'); } catch (e) { /* fall back to Arial */ }

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.setClearColor(0x000000, 0);
  const cvs = renderer.domElement;
  cvs.className = 'c3__canvas';
  cvs.setAttribute('aria-hidden', 'true');
  const aniso = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.85;
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(-1.6, 5.5, 2.4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 6; key.shadow.blurSamples = 16;
  Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 2, far: 10 });
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  scene.add(key);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.12 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
  scene.add(floor);

  const unit = new THREE.Group();
  scene.add(unit);

  const M = {
    blue: new THREE.MeshPhysicalMaterial({ color: C.blue, roughness: 0.42, metalness: 0.08, clearcoat: 0.35, clearcoatRoughness: 0.35 }),
    panel: new THREE.MeshPhysicalMaterial({ color: C.panel, roughness: 0.55, clearcoat: 0.12, clearcoatRoughness: 0.6 }),
    dark: new THREE.MeshStandardMaterial({ color: C.dark, roughness: 1 }),
    screw: new THREE.MeshStandardMaterial({ color: C.screw, roughness: 0.35, metalness: 0.8 }),
    fan: new THREE.MeshStandardMaterial({ color: C.fan, roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide }),
    wire: new THREE.MeshStandardMaterial({ color: C.wire, roughness: 0.4, metalness: 0.6 })
  };
  const add = (mesh, cast) => { mesh.castShadow = cast !== false; mesh.receiveShadow = true; unit.add(mesh); return mesh; };
  const box = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return add(m); };

  /* dark interior so nothing shows through the grilles */
  box(W - 0.12, H - FOOT - 0.12, D - 0.12, M.dark, 0, FOOT + (H - FOOT) / 2, 0);

  /* frame: posts, top + bottom rails, feet */
  const tube = (len, axis, x, y, z, a, b) => {
    const g = tubeGeo(len, a || T, b || T, 0.006);
    if (axis === 'x') g.rotateY(Math.PI / 2); else if (axis === 'y') g.rotateX(Math.PI / 2);
    const m = new THREE.Mesh(g, M.blue); m.position.set(x, y, z); return add(m);
  };
  const px = W / 2 - T / 2, pz = D / 2 - T / 2;
  [[-px, -pz], [px, -pz], [-px, pz], [px, pz]].forEach((p) => tube(H - FOOT, 'y', p[0], FOOT + (H - FOOT) / 2, p[1]));
  [-pz, pz].forEach((z) => { tube(W - 2 * T, 'x', 0, H - T / 2, z); tube(W - 2 * T, 'x', 0, FOOT + RAIL_B / 2, z, T, RAIL_B); });
  [-px, px].forEach((x) => { tube(D - 2 * T, 'z', x, H - T / 2, 0); tube(D - 2 * T, 'z', x, FOOT + RAIL_B / 2, 0, T, RAIL_B); });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach((s) => box(0.11, FOOT, 0.07, M.blue, s[0] * (W / 2 - 0.055), FOOT / 2, s[1] * (D / 2 - 0.035)));

  /* place a thing on a face: u along the face (from its centre), y absolute height, off outward from the casing */
  const onFace = (obj, face, u, y, off) => {
    const f = FACES[face];
    obj.rotation.y = f.rot;
    obj.position.copy(f.n).multiplyScalar(f.depth + off).addScaledVector(f.r, u).setY(y);
    return obj;
  };
  /* rails across a face (horizontal) and up a face (vertical), set into the frame plane */
  const hRail = (face, y, from, to) => { const f = FACES[face], g = tubeGeo(to - from, T, T, 0.006); g.rotateY(Math.PI / 2); add(onFace(new THREE.Mesh(g, M.blue), face, (from + to) / 2, y, -T / 2)); };
  const vRail = (face, u, y0, y1) => { const g = tubeGeo(y1 - y0, T, T, 0.006); g.rotateX(Math.PI / 2); add(onFace(new THREE.Mesh(g, M.blue), face, u, (y0 + y1) / 2, -T / 2)); };

  /* panels: inset 9 mm behind the frame; screws in the corners */
  const screwPos = [];
  const panel = (face, u0, u1, y0, y1, mat, screws) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(u1 - u0, y1 - y0), mat);
    add(onFace(m, face, (u0 + u1) / 2, (y0 + y1) / 2, -0.009), !mat.alphaMap);
    if (screws !== false) {
      const i = 0.022;
      [[u0 + i, y0 + i], [u1 - i, y0 + i], [u0 + i, y1 - i], [u1 - i, y1 - i]].forEach((p) => screwPos.push([face, p[0], p[1]]));
    }
    return m;
  };
  const inner = (face) => FACES[face].half - T;
  const yb = FOOT + RAIL_B, yt = H - T, ys0 = Y_SPLIT - T / 2, ys1 = Y_SPLIT + T / 2;

  /* front: perforated condenser panel over the coil, controls + nameplate below */
  {
    const hw = inner('front'), pw = 2 * hw, ph = yt - ys1;
    const alpha = perfAlpha(pw, ph, [0.03, 0.24 * ph, pw - 0.03, ph - 0.03], 0.021, 0.014);
    alpha.anisotropy = aniso;
    panel('front', -hw, hw, ys1, yt, new THREE.MeshPhysicalMaterial({ color: C.panel, roughness: 0.55, clearcoat: 0.12, alphaMap: alpha, alphaTest: 0.5, side: THREE.DoubleSide }));
    const coil = new THREE.Mesh(new THREE.PlaneGeometry(pw - 0.04, ph * 0.74), new THREE.MeshStandardMaterial({ map: coilTex(), roughness: 0.55, metalness: 0.55 }));
    add(onFace(coil, 'front', 0, ys1 + 0.03 + ph * 0.37, -0.045), false);
    hRail('front', Y_SPLIT, -hw, hw);
    const xm = -hw + X_SPLIT * pw;
    vRail('front', xm, yb, ys0);
    const lw = xm - T / 2 + hw, lh = ys0 - yb;
    const ctrl = controlsTex(lw, lh); ctrl.anisotropy = aniso;
    panel('front', -hw, xm - T / 2, yb, ys0, new THREE.MeshPhysicalMaterial({ map: ctrl, roughness: 0.55, clearcoat: 0.12 }));
    const brand = brandTex(hw - xm - T / 2, lh); brand.anisotropy = aniso;
    panel('front', xm + T / 2, hw, yb, ys0, new THREE.MeshPhysicalMaterial({ map: brand, roughness: 0.55, clearcoat: 0.12 }));
    /* push buttons: bezel + coloured cap */
    const bez = new THREE.CylinderGeometry(0.017, 0.017, 0.008, 20), cap = new THREE.CylinderGeometry(0.012, 0.013, 0.012, 20);
    bez.rotateX(Math.PI / 2); cap.rotateX(Math.PI / 2);
    BUTTONS.forEach((b) => {
      const u = -hw + b[0] * lw, y = ys0 - b[1] * lh;
      add(onFace(new THREE.Mesh(bez, M.screw), 'front', u, y, -0.005), false);
      add(onFace(new THREE.Mesh(cap, new THREE.MeshPhysicalMaterial({ color: b[2], roughness: 0.25, clearcoat: 1, emissive: b[2], emissiveIntensity: 0.12 })), 'front', u, y, 0.002), false);
    });
  }

  /* sides: two upper panels (sticker on the larger), perforated lower panel on the left side */
  ['left', 'right'].forEach((face) => {
    const hw = inner(face), pw = 2 * hw, um = -hw + SIDE_SPLIT * pw;
    hRail(face, Y_SPLIT, -hw, hw);
    vRail(face, um, ys1, yt);
    panel(face, -hw, um - T / 2, ys1, yt, M.panel);
    panel(face, um + T / 2, hw, ys1, yt, M.panel);
    if (face === 'left') {
      const lh = ys0 - yb, alpha = perfAlpha(pw, lh, [0.05, 0.06, pw - 0.05, lh - 0.05], 0.016, 0.01);
      alpha.anisotropy = aniso;
      panel(face, -hw, hw, yb, ys0, new THREE.MeshPhysicalMaterial({ color: C.panel, roughness: 0.55, clearcoat: 0.12, alphaMap: alpha, alphaTest: 0.5, side: THREE.DoubleSide }));
      const st = new THREE.Mesh(new THREE.PlaneGeometry(0.085, 0.118), new THREE.MeshStandardMaterial({ map: stickerTex(), roughness: 0.4 }));
      add(onFace(st, face, um + T / 2 + 0.07, yt - 0.1, -0.008), false);
    } else panel(face, -hw, hw, yb, ys0, M.panel);
  });

  /* back: split panels */
  {
    const hw = inner('back');
    hRail('back', Y_SPLIT, -hw, hw);
    vRail('back', 0, yb, yt);
    panel('back', -hw, -T / 2, ys1, yt, M.panel); panel('back', T / 2, hw, ys1, yt, M.panel);
    panel('back', -hw, -T / 2, yb, ys0, M.panel); panel('back', T / 2, hw, yb, ys0, M.panel);
  }

  /* top panel + four fans behind wire guards */
  const top = new THREE.Mesh(new THREE.PlaneGeometry(W - 2 * T, D - 2 * T), M.panel);
  top.rotation.x = -Math.PI / 2; top.position.y = H - 0.008; add(top);
  const blades = [];
  {
    const R = 0.19, bladeShape = new THREE.Shape();
    bladeShape.moveTo(0.03, -0.02); bladeShape.quadraticCurveTo(R * 0.6, -0.07, R * 0.93, -0.035);
    bladeShape.quadraticCurveTo(R * 0.98, 0.03, R * 0.85, 0.05); bladeShape.quadraticCurveTo(R * 0.5, 0.045, 0.03, 0.02);
    const bladeGeo = new THREE.ShapeGeometry(bladeShape, 6); bladeGeo.rotateX(-Math.PI / 2);
    const shroud = new THREE.CylinderGeometry(R + 0.012, R + 0.012, 0.05, 48, 1, true);
    const ring = (r) => { const g = new THREE.TorusGeometry(r, 0.0022, 5, 56); g.rotateX(Math.PI / 2); return g; };
    const spoke = new THREE.CylinderGeometry(0.002, 0.002, R * 2, 4); spoke.rotateZ(Math.PI / 2);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach((s) => {
      const g = new THREE.Group();
      g.position.set(s[0] * W / 4.2, H, s[1] * D / 4.2);
      const sh = new THREE.Mesh(shroud, M.fan); sh.position.y = 0.017; g.add(sh);
      const floorDisc = new THREE.Mesh(new THREE.CircleGeometry(R + 0.01, 40), M.dark); floorDisc.rotation.x = -Math.PI / 2; floorDisc.position.y = -0.006; g.add(floorDisc);
      const rotor = new THREE.Group(); rotor.position.y = 0.012;
      for (let k = 0; k < 5; k++) { const b = new THREE.Mesh(bladeGeo, M.fan); b.rotation.set(0.32, (k / 5) * Math.PI * 2, 0, 'YXZ'); rotor.add(b); }
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 24), M.fan); rotor.add(hub);
      g.add(rotor); blades.push(rotor);
      [0.22, 0.42, 0.62, 0.82, 1.0].forEach((k) => { const m = new THREE.Mesh(ring(R * k + 0.004), M.wire); m.position.y = 0.046; g.add(m); });
      for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(spoke, M.wire); m.rotation.y = (k / 4) * Math.PI; m.position.y = 0.046; g.add(m); }
      g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      unit.add(g);
    });
  }

  /* screw heads, one instanced mesh */
  {
    const g = new THREE.CylinderGeometry(0.0055, 0.0055, 0.004, 10); g.rotateX(Math.PI / 2);
    const im = new THREE.InstancedMesh(g, M.screw, screwPos.length), d = new THREE.Object3D();
    screwPos.forEach((s, i) => { onFace(d, s[0], s[1], s[2], -0.006); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
    add(im, false);
  }

  /* soft contact shadow that turns with the unit */
  const cs = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.9, D * 1.9), new THREE.MeshBasicMaterial({ map: contactShadowTex(), transparent: true, depthWrite: false }));
  cs.rotation.x = -Math.PI / 2; cs.position.y = 0.001; unit.add(cs);

  /* ---------- camera, hotspots, render loop ---------- */
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  const target = new THREE.Vector3(0, H * 0.56, 0);
  let dist = 4, elev = 14 * Math.PI / 180;
  const placeCamera = () => {
    camera.position.set(0, target.y + dist * Math.sin(elev), dist * Math.cos(elev));
    camera.lookAt(target);
  };
  const fit = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const half = Math.tan((camera.fov * Math.PI) / 360);
    const needH = (H + 0.16) / 2 / 0.8, needW = 0.74 / 0.86 / camera.aspect;
    dist = Math.max(needH, needW) / half + 0.55;
    camera.updateProjectionMatrix();
    placeCamera();
  };

  const layer = document.createElement('div');
  layer.className = 'c3__hsl';
  layer.setAttribute('aria-hidden', 'true');
  const homes = hotspots.map((el) => ({ el, parent: el.parentNode, next: el.nextSibling, style: el.getAttribute('style') }));
  const anchors = hotspots.map((el) => {
    const a = ANCHORS[el.dataset.hs];
    if (!a) return null;
    if (a.top) return { p: new THREE.Vector3(0, H + 0.03, 0), n: new THREE.Vector3(0, 1, 0) };
    const f = FACES[a.face];
    return { p: f.n.clone().multiplyScalar(f.depth + 0.004).addScaledVector(f.r, a.u).setY(a.y), n: f.n.clone() };
  });
  const v = new THREE.Vector3(), nW = new THREE.Vector3(), toCam = new THREE.Vector3();
  const placeHotspots = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    hotspots.forEach((el, i) => {
      const a = anchors[i];
      if (!a) return;
      v.copy(a.p).applyMatrix4(unit.matrixWorld);
      nW.copy(a.n).transformDirection(unit.matrixWorld);
      toCam.copy(camera.position).sub(v).normalize();
      el.classList.toggle('is-away', nW.dot(toCam) < 0.04);
      v.project(camera);
      el.style.left = ((v.x + 1) / 2 * w).toFixed(1) + 'px';
      el.style.top = ((1 - v.y) / 2 * h).toFixed(1) + 'px';
    });
  };

  let raf = 0, need = true, inView = true, last = 0, alive = true;
  const spin = !reduce;
  const frame = (t) => {
    raf = 0;
    if (!alive) return;
    const dt = Math.min(50, t - (last || t)); last = t;
    if (spin && inView) { blades.forEach((b, i) => { b.rotation.y -= dt * (0.0042 + i * 0.0002); }); need = true; }
    if (need) { unit.updateMatrixWorld(); placeHotspots(); renderer.render(scene, camera); need = false; }
    if (spin && inView && !document.hidden) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  const request = () => { if (!raf && alive) raf = requestAnimationFrame(frame); };

  stage.insertBefore(cvs, stage.firstChild);
  stage.appendChild(layer);
  hotspots.forEach((el) => { el.removeAttribute('style'); layer.appendChild(el); });
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
    homes.forEach((h) => { if (h.style) h.el.setAttribute('style', h.style); h.el.classList.remove('is-away'); h.parent.insertBefore(h.el, h.next); });
    layer.remove(); cvs.remove(); renderer.dispose();
  };
  cvs.addEventListener('webglcontextlost', (e) => { e.preventDefault(); destroy(); if (opts.onLost) opts.onLost(); });
  layer.addEventListener('click', (e) => { const hs = e.target.closest('.c3__hs'); if (hs && opts.onSelect) opts.onSelect(hs.dataset.hs); });

  /* first frame, then reveal */
  unit.updateMatrixWorld(); placeHotspots(); renderer.render(scene, camera);
  request();

  return {
    set(ry, rx) {
      unit.rotation.y = (ry * Math.PI) / 180;
      elev = (-rx * Math.PI) / 180;
      placeCamera();
      need = true; request();
    },
    destroy
  };
}
