(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('static');
  const hasIO = 'IntersectionObserver' in window;
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
