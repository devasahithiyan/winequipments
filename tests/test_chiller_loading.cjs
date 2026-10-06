/* Lifecycle checks for the real controller, with a controllable renderer and clock.
   Run: node --experimental-vm-modules tests/test_chiller_loading.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/site/assets/js/chiller360.js', 'utf8');
const settle = () => new Promise(setImmediate);
function deferred() { let resolve; const promise = new Promise(r => resolve = r); return { promise, resolve }; }
class Element {
  constructor(dataset = {}) {
    this.dataset = dataset; this.attrs = {}; this.events = {}; this.style = {}; this.hidden = false;
    const classes = new Set();
    this.classList = { add: (...v) => v.forEach(x => classes.add(x)), remove: (...v) => v.forEach(x => classes.delete(x)), contains: x => classes.has(x), toggle: (x, on) => { if (on) classes.add(x); else classes.delete(x); } };
    this.offsetHeight = 600;
  }
  setAttribute(k, v) { this.attrs[k] = v; }
  addEventListener(k, fn) { (this.events[k] ||= []).push(fn); }
  removeEventListener(k, fn) { this.events[k] = (this.events[k] || []).filter(f => f !== fn); }
  fire(k, detail = {}) { for (const fn of this.events[k] || []) fn({ target: this, stopPropagation() {}, preventDefault() {}, ...detail }); }
  getBoundingClientRect() { return { top: this.top || 0 }; }
  focus() { this.focused = true; }
}
async function harness({ desktop = false, reduce = false, supported = true, memory = 8 } = {}) {
  const nodes = new Map(), arrays = new Map(), observers = [];
  const node = s => { if (!nodes.has(s)) nodes.set(s, new Element()); return nodes.get(s); };
  const section = node('.c3'), stage = node('[data-c3-stage]'), scroller = node('[data-c3-scroll]'), grid = node('.c3__grid');
  for (const el of [section, stage, node('[data-c3]'), node('[data-c3-poster="lite"]'), node('[data-c3-poster="standard"]')]) {
    el.querySelector = node; el.querySelectorAll = s => arrays.get(s) || [];
  }
  node('[data-c3]').closest = () => section;
  const modes = ['closed', 'open', 'exploded', 'flow'].map(v => new Element({ c3Mode: v }));
  const parts = Array.from({ length: 6 }, (_, i) => { const el = new Element({ part: String(i + 1), ry: '12', rx: '-10' }); el.parentElement = new Element(); return el; });
  arrays.set('[data-c3-mode]', modes); arrays.set('[data-part]', parts);
  arrays.set('.c3__hs', Array.from({ length: 6 }, (_, i) => new Element({ hs: String(i + 1) })));
  arrays.set('[data-c3-step]', Array.from({ length: 4 }, (_, i) => new Element({ c3Step: String(i + 1), ry: '0', rx: '-14' })));
  node('img').decode = async () => {};
  const moduleURLs = [];
  let clock = 0, seq = 0, initCalls = 0, destroyed = 0, activated = 0, failure = false, gate = null, options, initFailure = false;
  const timers = new Map(), frames = new Map(), states = [];
  const view = { destroy() { destroyed++; }, activate() { activated++; }, set(ry, rx, s) { states.push({ ry, rx, ...s }); } };
  const context = vm.createContext({
    URL, AbortController, Promise, console, innerHeight: 900,
    location: { search: reduce ? '?static=1' : '' }, navigator: { hardwareConcurrency: 8, deviceMemory: memory },
    document: { currentScript: { src: 'http://local/js/chiller360.js?v=test' }, querySelector: node, querySelectorAll: s => arrays.get(s) || [], hidden: false, activeElement: null,
      createElement: () => ({ getContext: () => supported ? { getExtension: () => ({ loseContext() {} }) } : null }) },
    window: { IntersectionObserver: true, ResizeObserver: true, addEventListener() {} }, HTMLScriptElement: { supports: () => supported },
    performance: { now: () => clock }, getComputedStyle: () => ({ top: '128px' }),
    addEventListener() {},
    matchMedia: s => ({ matches: s.includes('min-height') ? desktop && !reduce : s.includes('prefers-reduced-motion') ? reduce : s.includes('max-width') ? !desktop : false, addEventListener() {} }),
    IntersectionObserver: class { constructor(fn, opts) { this.fn = fn; this.opts = opts; observers.push(this); } observe() {} disconnect() {} },
    setTimeout: (fn, delay) => { const id = ++seq; timers.set(id, { fn, at: clock + delay }); return id; }, clearTimeout: id => timers.delete(id),
    setInterval: () => ++seq, clearInterval() {},
    requestAnimationFrame: fn => { const id = ++seq; frames.set(id, fn); return id; }, cancelAnimationFrame: id => frames.delete(id)
  });
  new vm.Script(source, { importModuleDynamically: async url => {
    moduleURLs.push(url);
    if (failure) throw new Error('Network failure');
    const mod = new vm.SyntheticModule(['init'], function() { this.setExport('init', async opts => { initCalls++; options = opts; if (initFailure) throw new Error('Renderer failure'); opts.onPhase(); if (gate) await gate.promise; return view; }); }, { context });
    await mod.link(() => {}); await mod.evaluate(); return mod;
  } }).runInContext(context);
  await settle();
  async function frame(ms = 16) {
    clock += ms;
    for (const [id, t] of [...timers]) if (t.at <= clock) { timers.delete(id); t.fn(); }
    for (const [id, fn] of [...frames]) { frames.delete(id); fn(clock); }
    await settle();
  }
  return { section, stage, scroller, grid, modes, node, view, states, frame, moduleURLs,
    click: () => node('[data-c3-load]').fire('click'),
    near: () => observers.find(o => o.opts?.rootMargin)?.fn([{ isIntersecting: true }]),
    failImport: v => { failure = v; }, failInit: v => { initFailure = v; }, gate: () => { gate = deferred(); return gate; },
    get stats() { return { initCalls, destroyed, activated, options }; },
    async ready() { for (let i = 0; i < 35; i++) await frame(); assert.equal(section.dataset.c3State, 'ready'); }
  };
}
(async () => {
  let h = await harness();
  assert.equal(h.section.dataset.c3State, 'poster');
  assert.equal(h.node('[data-c3-toolbar]').inert, true);
  h.click(); h.click(); await settle();
  assert.equal(h.stats.initCalls, 1, 'Repeated clicks must not duplicate the renderer');
  assert.equal(h.stage.attrs['aria-busy'], 'true');
  assert.equal(h.stats.activated, 0, 'Animation must wait for reveal');
  await h.ready();
  assert.equal(h.stats.activated, 1); assert.equal(h.node('[data-c3-toolbar]').inert, false);
  assert.equal(h.states[0].open, 0); assert.equal(h.states[0].ry, 35);
  h.stats.options.onLost();
  assert.equal(h.section.dataset.c3State, 'error'); assert.equal(h.node('[data-c3-load]').disabled, false);
  h.click(); await h.ready();

  h = await harness(); h.failImport(true); h.click(); await settle();
  assert.equal(h.section.dataset.c3State, 'error');
  h.failImport(false); h.click(); await h.ready();
  assert.notEqual(h.moduleURLs[0], h.moduleURLs[1], 'Retry must bypass a cached module failure');

  h = await harness(); h.failInit(true); h.click(); await settle();
  assert.equal(h.section.dataset.c3State, 'error');
  h.failInit(false); h.click(); await h.ready();

  h = await harness(); const gate = h.gate(); h.click(); await settle();
  await h.frame(200); assert.equal(h.node('[data-c3-status]').hidden, false);
  assert.equal(h.node('[data-c3-status-text]').textContent, 'Preparing view…');
  await h.frame(30000); assert.equal(h.section.dataset.c3State, 'error');
  assert.equal(h.stats.options.signal.aborted, true);
  gate.resolve(); await settle(); assert.equal(h.stats.destroyed, 1, 'Late renderer must be disposed');
  assert.equal(h.section.dataset.c3State, 'error');
  h.click(); await h.ready();

  h = await harness({ supported: false });
  assert.equal(h.section.dataset.c3State, 'unavailable');
  assert.equal(h.node('[data-c3-load]').hidden, true); h.click(); assert.equal(h.stats.initCalls, 0);

  h = await harness({ reduce: true, memory: 4 }); h.click(); await settle();
  assert.equal(h.stats.options.lite, true); await h.frame(); await h.frame();
  assert.equal(h.section.dataset.c3State, 'ready', 'Reduced motion skips the reveal delay');

  h = await harness({ desktop: true });
  assert.equal(h.section.classList.contains('is-scrub'), true, 'Desktop layout is reserved before loading');
  assert.equal(h.node('[data-c3-load]').hidden, true);
  const reserved = h.scroller.style.height;
  h.scroller.offsetHeight = 1410; h.scroller.top = -180;
  h.near(); await h.ready();
  assert.equal(h.scroller.style.height, reserved); assert.equal(h.states[0].open, 0);
  console.log('Chiller lifecycle: all checks passed (load, reveal, retry, timeout, late completion, context loss, unsupported, reduced motion, desktop reservation).');
})().catch(e => { console.error(e); process.exitCode = 1; });
