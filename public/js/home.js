(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('static');
  const hasIO = 'IntersectionObserver' in window;
  /* hero product switcher */
  const sw = $('[data-switcher]');
  if (sw) {
    const tabs = $$('[role="tab"]', sw);
    const slides = $$('.h-show__slide', sw);
    const specs = $$('[data-specs]', sw);
    const DUR = 5200;
    let idx = 0;
    let timer = null;
    slides.forEach((s) => (s.hidden = false));
    specs.forEach((s, i) => (s.hidden = i !== 0));
    sw.style.setProperty('--dur', `${DUR}ms`);
    const show = (n, focus) => {
      if (n === idx) return;
      const prev = idx;
      idx = (n + slides.length) % slides.length;
      slides[prev].classList.remove('is-active');
      slides[prev].classList.add('is-leaving');
      setTimeout(() => slides[prev].classList.remove('is-leaving'), 700);
      slides[idx].classList.add('is-active');
      tabs.forEach((t, i) => {
        const on = i === idx;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      specs.forEach((s, i) => { s.hidden = i !== idx; s.classList.toggle('is-active', i === idx); });
      if (focus) tabs[idx].focus();
    };
    const play = () => {
      if (reduce) return;
      stop();
      sw.classList.add('is-playing');
      const bar = $('.h-show__tab.is-active .h-show__bar', sw);
      if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
      timer = setTimeout(() => { show(idx + 1); play(); }, DUR);
    };
    const stop = () => { clearTimeout(timer); sw.classList.remove('is-playing'); };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => { show(i); stop(); });
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          show(idx + (e.key === 'ArrowRight' ? 1 : -1), true);
          stop();
        }
      });
    });
    sw.addEventListener('pointerenter', stop);
    sw.addEventListener('pointerleave', () => { if (!sw.contains(document.activeElement)) play(); });
    sw.addEventListener('focusin', stop);
    if (hasIO) {
      new IntersectionObserver((en) => { en[0].isIntersecting ? play() : stop(); }, { threshold: 0.3 }).observe(sw);
    } else play();
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
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
