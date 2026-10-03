/* Multi-angle photo viewer (partials/photo_spin.html). */
(() => {
  const root = document.querySelector('[data-spin]');
  if (!root) return;
  const stage = root.querySelector('[data-spin-stage]');
  const frames = Array.from(root.querySelectorAll('[data-spin-frame]'));
  const thumbs = Array.from(root.querySelectorAll('[data-spin-go]'));
  const count = root.querySelector('[data-spin-count]');
  const cap = root.querySelector('[data-spin-cap]');
  const caps = thumbs.map((t) => t.getAttribute('aria-label').replace(/^View \d+: /, ''));
  const n = frames.length;
  let idx = 0;

  const warm = () => frames.forEach((f) => { const img = f.querySelector('img'); if (img && img.loading === 'lazy') img.loading = 'eager'; });
  const show = (i) => {
    idx = (i + n) % n;
    frames.forEach((f, k) => { const on = k === idx; f.classList.toggle('is-active', on); f.setAttribute('aria-hidden', String(!on)); });
    thumbs.forEach((t, k) => { const on = k === idx; t.classList.toggle('is-active', on); t.setAttribute('aria-pressed', String(on)); });
    count.textContent = `${idx + 1} / ${n}`;
    cap.textContent = caps[idx];
  };
  const touched = () => { stage.classList.add('is-touched'); warm(); };

  root.querySelectorAll('[data-spin-step]').forEach((b) => b.addEventListener('click', () => { touched(); show(idx + Number(b.dataset.spinStep)); }));
  thumbs.forEach((t, k) => t.addEventListener('click', () => { touched(); show(k); }));
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); touched(); show(idx + (e.key === 'ArrowRight' ? 1 : -1)); }
  });

  /* drag: every ~60 px of horizontal movement steps one view; vertical scrolling still works on touch */
  let down = false, sx = 0, sy = 0, last = 0, axis = null;
  stage.addEventListener('pointerdown', (e) => { if (e.button !== 0) return; down = true; axis = e.pointerType === 'mouse' ? 'x' : null; sx = last = e.clientX; sy = e.clientY; warm(); });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    if (!axis) {
      if (Math.abs(e.clientX - sx) > 6 && Math.abs(e.clientX - sx) > Math.abs(e.clientY - sy)) { axis = 'x'; stage.setPointerCapture?.(e.pointerId); }
      else if (Math.abs(e.clientY - sy) > 6) { down = false; return; } else return;
    }
    const step = Math.min(90, Math.max(50, stage.clientWidth / 8));
    if (Math.abs(e.clientX - last) >= step) { touched(); show(idx + (e.clientX < last ? 1 : -1)); last = e.clientX; }
  });
  const up = () => { down = false; };
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  stage.addEventListener('dragstart', (e) => e.preventDefault());
})();
