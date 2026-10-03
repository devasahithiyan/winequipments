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
    if (!reduce) {
      setTimeout(warm, 1500);
      if (hasIO) new IntersectionObserver((en) => { en[0].isIntersecting ? play() : stop(); }, { threshold: 0.2 }).observe(cine);
      else play();
      document.addEventListener('visibilitychange', () => { document.hidden ? stop() : play(); });
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
