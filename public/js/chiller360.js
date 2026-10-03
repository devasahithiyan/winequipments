/* 360° chiller model (partials/chiller360.html). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('static');
  const hasIO = 'IntersectionObserver' in window;
  /* 360° chiller: drag / keys / buttons rotate a CSS-3D model; parts list turns it to each hotspot */
  const c3 = $('[data-c3]');
  if (c3) {
    const stage = $('[data-c3-stage]', c3);
    const model = $('[data-c3-model]', c3);
    const deg = $('[data-c3-deg]', c3);
    const playBtn = $('[data-c3-play]', c3);
    const parts = $$('[data-part]');
    const faces = $$('.c3__face', model).map((f) => ({ el: f, a: { front: 0, left: -90, back: 180, right: 90 }[f.className.match(/--(\w+)/)[1]] }));
    const HOME = { ry: 35, rx: -14 };
    const VIEW = { front: { ry: 18, rx: -12 }, left: { ry: 68, rx: -12 }, back: { ry: 200, rx: -12 }, top: { ry: 30, rx: -46 } };
    let ry = HOME.ry, rx = HOME.rx, vel = 0, anim = null, playing = !reduce, inView = false, last = 0;

    const render = () => {
      model.style.setProperty('--ry', `${ry}deg`);
      model.style.setProperty('--rx', `${rx}deg`);
      faces.forEach((f) => {
        if (f.a === undefined) return;
        const c = Math.cos(((f.a + ry + 25) * Math.PI) / 180);
        f.el.style.setProperty('--dark', (0.34 * (1 - Math.max(0, c))).toFixed(3));
      });
      deg.textContent = `${String(Math.round(((ry % 360) + 360) % 360)).padStart(3, '0')}°`;
    };
    const setPlaying = (on) => {
      playing = on && !reduce;
      playBtn.setAttribute('aria-pressed', String(playing));
      playBtn.textContent = playing ? 'Pause' : 'Auto-rotate';
    };
    const tweenTo = (tRy, tRx = rx) => {
      cancelAnimationFrame(anim);
      vel = 0;
      const d = ((tRy - ry) % 360 + 540) % 360 - 180; // shortest way round
      const from = { ry, rx }, to = { ry: ry + d, rx: tRx };
      if (reduce) { ry = to.ry; rx = to.rx; return render(); }
      const t0 = performance.now(), dur = 700;
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

    /* auto-rotate + inertia loop */
    const loop = (t) => {
      const dt = Math.min(50, t - (last || t));
      last = t;
      if (!dragging && Math.abs(vel) > 0.01) { ry += vel * dt; vel *= 0.92; render(); }
      else if (!dragging && playing && inView && !document.hidden) { ry += 0.012 * dt; render(); }
      requestAnimationFrame(loop);
    };

    /* drag (horizontal turns, vertical tilts a little; vertical scrolling still works on touch) */
    let dragging = false, sx = 0, sy = 0, px = 0, pt = 0, axis = null;
    stage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
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
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); touched(); tweenTo(ry + (e.key === 'ArrowRight' ? 30 : -30)); }
    });
    $$('[data-c3-rot]', c3).forEach((b) => b.addEventListener('click', () => { touched(); tweenTo(ry + Number(b.dataset.c3Rot)); }));
    $('[data-c3-reset]', c3).addEventListener('click', () => { touched(); tweenTo(HOME.ry, HOME.rx); });
    playBtn.addEventListener('click', () => { setPlaying(!playing); if (playing) stage.classList.remove('is-touched'); });

    /* parts list <-> hotspots */
    const select = (n, turn) => {
      parts.forEach((b) => {
        const on = b.dataset.part === String(n);
        b.setAttribute('aria-expanded', String(on));
        b.parentElement.classList.toggle('is-active', on);
        if (on && turn) { touched(); const v = VIEW[b.dataset.face]; tweenTo(v.ry, v.rx); }
      });
      $$('.c3__hs', model).forEach((h) => h.classList.toggle('is-active', h.dataset.hs === String(n)));
    };
    parts.forEach((b) => b.addEventListener('click', () => select(b.dataset.part, true)));
    select(1, false);

    if (hasIO) new IntersectionObserver((en) => { inView = en[0].isIntersecting; }, { threshold: 0.2 }).observe(stage);
    else inView = true;
    setPlaying(!reduce);
    render();
    requestAnimationFrame(loop);
  }

})();
