(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('static');
  const hasIO = 'IntersectionObserver' in window;
  /* cinematic hero: slow crossfade through real works photos */
  const cine = $('[data-cine]');
  if (cine) {
    const shots = $$('[data-cine-shot]', cine);
    const bars = $$('[data-cine-go]', cine);
    const num = $('[data-cine-num]', cine);
    const cap = $('[data-cine-cap]', cine);
    const DUR = 6500;
    let i = 0, timer = null;
    cine.style.setProperty('--dur', `${DUR}ms`);
    const warm = () => shots.forEach((s) => { const im = s.querySelector('img'); if (im && im.loading === 'lazy') im.loading = 'eager'; });
    const show = (n) => {
      i = (n + shots.length) % shots.length;
      shots.forEach((s, k) => s.classList.toggle('is-active', k === i));
      bars.forEach((b, k) => { b.classList.toggle('is-active', k === i); b.classList.toggle('is-done', k < i); });
      num.textContent = String(i + 1).padStart(2, '0');
      cap.textContent = shots[i].dataset.cap;
      const im = shots[i].querySelector('img');
      if (im) { im.style.animation = 'none'; void im.offsetWidth; im.style.animation = ''; }
      const bar = bars[i] && bars[i].querySelector('i');
      if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
    };
    const play = () => {
      if (reduce) return;
      clearTimeout(timer);
      cine.classList.add('is-playing');
      timer = setTimeout(() => { show(i + 1); play(); }, DUR);
    };
    const stop = () => { clearTimeout(timer); cine.classList.remove('is-playing'); };
    bars.forEach((b, k) => b.addEventListener('click', () => { warm(); show(k); play(); }));
    /* swap in the works film when the connection and settings allow it */
    const video = $('[data-cine-video]', cine);
    const conn = navigator.connection || {};
    if (video && !reduce && !conn.saveData && !/(^|-)2g$/.test(conn.effectiveType || '')) {
      const tall = matchMedia('(max-width: 759px) and (orientation: portrait)').matches;
      const sources = tall ? [[video.dataset.srcTall, 'video/mp4']] : [[video.dataset.srcWideWebm, 'video/webm'], [video.dataset.srcWide, 'video/mp4']];
      const start = () => {
        sources.forEach(([src, type]) => { const s = document.createElement('source'); s.src = src; s.type = type; video.appendChild(s); });
        video.addEventListener('playing', () => {
          cine.classList.add('has-video'); stop();
          num.textContent = '▶'; cap.textContent = 'Filmed at our Arasur works';
        }, { once: true });
        video.load();
        video.play().catch(() => {});
      };
      if (document.readyState === 'complete') setTimeout(start, 300); else addEventListener('load', () => setTimeout(start, 300), { once: true });
      document.addEventListener('visibilitychange', () => { if (cine.classList.contains('has-video')) document.hidden ? video.pause() : video.play().catch(() => {}); });
    }
    if (!reduce) {
      setTimeout(warm, 1500);
      if (hasIO) new IntersectionObserver((en) => { if (cine.classList.contains('has-video')) return; en[0].isIntersecting ? play() : stop(); }, { threshold: 0.2 }).observe(cine);
      else play();
      document.addEventListener('visibilitychange', () => { if (cine.classList.contains('has-video')) return; document.hidden ? stop() : play(); });
    }
  }

  /* range showcase: pinned text follows the figure in view (desktop) */
  const figs = $$('[data-range-fig]');
  const texts = $$('[data-range-text]');
  if (figs.length && hasIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const n = e.target.dataset.rangeFig;
        texts.forEach((t) => t.classList.toggle('is-active', t.dataset.rangeText === n));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    figs.forEach((f) => io.observe(f));
  }

})();
