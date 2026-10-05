/* Chiller viewer (partials/chiller360.html): the real photo is the poster; when the viewer comes near, the WebGL model
   (chiller3d.js) loads and this script drives it: drag / keys / buttons rotate, the Open button and (on large screens)
   scrolling through the section open the unit, and the parts list turns the model to each part. */
(() => {
  const ver = (document.currentScript && new URL(document.currentScript.src).search) || '';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('static');
  const hasIO = 'IntersectionObserver' in window;
  const c3 = $('[data-c3]');
  if (!c3) return;

  const section = c3.closest('.c3'), scroller = $('[data-c3-scroll]', section), grid = $('.c3__grid', section);
  const stage = $('[data-c3-stage]', c3), deg = $('[data-c3-deg]', c3);
  const playBtn = $('[data-c3-play]', c3), openBtn = $('[data-c3-open]', c3), openLabel = $('span', openBtn);
  const parts = $$('[data-part]', section), hotspots = $$('.c3__hs', stage);
  const HOME = { ry: 35, rx: -14 }, OPEN_VIEW = { ry: 24, rx: -16 };
  let ry = HOME.ry, rx = HOME.rx, vel = 0, anim = null, playing = false, inView = false, last = 0, view3d = null;
  let btnP = 0, btnTarget = 0, btnAnim = 0, scrollP = 0, openP = 0, oriented = false;

  const render = () => {
    deg.textContent = String(Math.round(((ry % 360) + 360) % 360)).padStart(3, '0') + '°';
    if (view3d) view3d.set(ry, rx, openP);
  };
  const setPlaying = (on) => {
    playing = on && !reduce && !!view3d;
    playBtn.setAttribute('aria-pressed', String(playing));
    playBtn.textContent = playing ? 'Pause' : 'Auto-rotate';
  };
  const tweenTo = (tRy, tRx = rx) => {
    cancelAnimationFrame(anim);
    vel = 0;
    const d = ((tRy - ry) % 360 + 540) % 360 - 180; // shortest way round
    const from = { ry, rx }, to = { ry: ry + d, rx: tRx };
    if (reduce) { ry = to.ry; rx = to.rx; return render(); }
    const t0 = performance.now(), dur = 800;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      ry = from.ry + (to.ry - from.ry) * e;
      rx = from.rx + (to.rx - from.rx) * e;
      render();
      if (k < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  };
  const touched = () => { stage.classList.add('is-touched'); setPlaying(false); };

  /* opening: the button holds it open, scrolling can open it too; whichever is further wins */
  const syncOpen = () => {
    const p = Math.max(btnP, scrollP);
    if (p === openP) return;
    const was = openP;
    openP = p;
    if (was < 0.02 && p >= 0.02 && !oriented) { oriented = true; setPlaying(false); tweenTo(OPEN_VIEW.ry, OPEN_VIEW.rx); }
    else if (p < 0.02 && was >= 0.02) oriented = false;
    const isOpen = btnTarget === 1 || p > 0.5;
    openBtn.setAttribute('aria-pressed', String(isOpen));
    openLabel.textContent = isOpen ? 'Close the unit' : 'Open the unit';
    stage.classList.toggle('is-open', p > 0.5);
    render();
  };
  const tweenOpen = (to) => {
    btnTarget = to;
    cancelAnimationFrame(btnAnim);
    if (reduce) { btnP = to; return syncOpen(); }
    const from = btnP, t0 = performance.now(), dur = 1500 * Math.abs(to - from) || 1;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      btnP = from + (to - from) * (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
      syncOpen();
      if (k < 1) btnAnim = requestAnimationFrame(step);
    };
    btnAnim = requestAnimationFrame(step);
  };
  openBtn.addEventListener('click', () => {
    touched();
    const isOpen = btnTarget === 1 || openP > 0.5;
    if (isOpen && scrollP > btnP) { btnP = scrollP; scrollP = 0; }   // closing from a scrolled-open state
    tweenOpen(isOpen ? 0 : 1);
  });

  /* large screens: the viewer pins while you scroll through the section, and the scroll opens the unit */
  const scrubMQ = matchMedia('(min-width: 1024px) and (min-height: 720px) and (hover: hover) and (prefers-reduced-motion: no-preference)');
  const scrubbing = () => !!view3d && scrubMQ.matches && !location.search.includes('static');
  const onScroll = () => {
    if (!section.classList.contains('is-scrub')) return;
    const r = scroller.getBoundingClientRect(), top = parseFloat(getComputedStyle(grid).top) || 0;
    const run = scroller.offsetHeight - grid.offsetHeight;
    const p = Math.min(1, Math.max(0, (top - r.top) / (run * 0.75)));
    if (p !== scrollP) { scrollP = p; syncOpen(); }
  };
  const layout = () => {
    const on = scrubbing();
    section.classList.toggle('is-scrub', on);
    scroller.style.height = on ? (grid.offsetHeight + Math.round(innerHeight * 0.9)) + 'px' : '';
    if (on) onScroll(); else if (scrollP) { scrollP = 0; syncOpen(); }
  };
  let scrollTick = false;
  addEventListener('scroll', () => { if (!scrollTick) { scrollTick = true; requestAnimationFrame(() => { scrollTick = false; onScroll(); }); } }, { passive: true });
  addEventListener('resize', layout);
  scrubMQ.addEventListener('change', layout);

  /* auto-rotate + inertia loop */
  const loop = (t) => {
    const dt = Math.min(50, t - (last || t));
    last = t;
    if (view3d && !dragging && Math.abs(vel) > 0.01) { ry += vel * dt; vel *= 0.92; render(); }
    else if (view3d && !dragging && playing && inView && !document.hidden) { ry += 0.012 * dt; render(); }
    requestAnimationFrame(loop);
  };

  /* drag: horizontal turns, vertical tilts a little on a mouse; vertical scrolling still works on touch */
  let dragging = false, sx = 0, sy = 0, px = 0, pt = 0, axis = null;
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || !view3d || e.target.closest('.c3__hs')) return;
    dragging = true; axis = e.pointerType === 'mouse' ? 'x' : null;
    sx = px = e.clientX; sy = e.clientY; pt = performance.now(); vel = 0;
    cancelAnimationFrame(anim);
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    if (!axis) {
      if (Math.abs(e.clientX - sx) > 6 && Math.abs(e.clientX - sx) > Math.abs(e.clientY - sy)) { axis = 'x'; stage.setPointerCapture?.(e.pointerId); }
      else if (Math.abs(e.clientY - sy) > 6) { dragging = false; return; }
      else return;
    }
    const now = performance.now(), dx = e.clientX - px;
    ry += dx * 0.45;
    if (e.pointerType === 'mouse') rx = Math.max(-40, Math.min(-4, rx - e.movementY * 0.25));
    vel = (dx * 0.27) / Math.max(1, now - pt);
    px = e.clientX; pt = now;
    touched();
    render();
  });
  const end = () => { if (dragging && performance.now() - pt > 80) vel = 0; dragging = false; };
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);

  stage.addEventListener('keydown', (e) => {
    if (!view3d) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); touched(); tweenTo(ry + (e.key === 'ArrowRight' ? 30 : -30)); }
  });
  $$('[data-c3-rot]', c3).forEach((b) => b.addEventListener('click', () => { touched(); tweenTo(ry + Number(b.dataset.c3Rot)); }));
  $('[data-c3-reset]', c3).addEventListener('click', () => { touched(); tweenTo(openP > 0.5 ? OPEN_VIEW.ry : HOME.ry, openP > 0.5 ? OPEN_VIEW.rx : HOME.rx); });
  playBtn.addEventListener('click', () => { setPlaying(!playing); if (playing) stage.classList.remove('is-touched'); });

  /* parts list <-> hotspots: picking a part turns the model to it */
  const select = (n, turn) => {
    parts.forEach((b) => {
      const on = b.dataset.part === String(n);
      b.setAttribute('aria-expanded', String(on));
      b.parentElement.classList.toggle('is-active', on);
      if (on && turn && view3d) { touched(); tweenTo(Number(b.dataset.ry), Number(b.dataset.rx)); }
    });
    hotspots.forEach((h) => h.classList.toggle('is-active', h.dataset.hs === String(n)));
  };
  parts.forEach((b) => b.addEventListener('click', () => select(b.dataset.part, true)));
  select(1, false);

  if (hasIO) new IntersectionObserver((en) => { inView = en[0].isIntersecting; }, { threshold: 0.2 }).observe(stage);
  else inView = true;

  /* load the WebGL model as the viewer approaches; any failure leaves the real photo in place */
  const webgl = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (_) { return false; } };
  const saveData = navigator.connection && navigator.connection.saveData;
  let loading = false;
  const controls = $$('.c3__controls [hidden]', c3);
  const upgrade = () => {
    if (loading || view3d || saveData || !webgl() || !HTMLScriptElement.supports?.('importmap')) return;
    loading = true;
    import('/js/chiller3d.js' + ver).then((m) => m.init({
      stage, reduce, hotspots,
      onSelect: (n) => select(n, true),
      onLost: () => {
        view3d = null; section.classList.remove('has-3d'); stage.classList.remove('is-3d');
        controls.forEach((b) => { b.hidden = true; });
        layout();
      }
    })).then((v) => {
      view3d = v;
      controls.forEach((b) => { b.hidden = false; });
      section.classList.add('has-3d');
      render();
      requestAnimationFrame(() => stage.classList.add('is-3d'));
      layout();
    }).catch(() => { loading = false; });
  };
  if (hasIO) {
    const near = new IntersectionObserver((en) => { if (en.some((e) => e.isIntersecting)) { near.disconnect(); upgrade(); } }, { rootMargin: '400px 0px' });
    near.observe(stage);
  } else upgrade();
  render();
  requestAnimationFrame(loop);
})();
