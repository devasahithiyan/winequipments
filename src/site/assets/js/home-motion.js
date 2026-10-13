/* Homepage motion: scroll-linked hero depth and spring entrances, built on Motion (vendor/motion.min.js).
   Loaded after the page is idle so it never delays first paint; skipped for reduced motion. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('static');
  const hero = document.querySelector('[data-cine]');
  if (reduce || !hero) return;

  const boot = () => {
    const s = document.createElement('script');
    s.src = '/js/vendor/motion.min.js?v=14';
    s.onload = run;
    document.head.appendChild(s);
  };

  const run = () => {
    const { animate, scroll, inView, spring, stagger } = window.Motion || {};
    if (!animate || !scroll || !inView) return;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    /* hero: as you scroll past, the backdrop drifts slower than the copy, the stage sinks back and the copy eases away */
    const reel = $('.cine__reel', hero);
    const copy = $('.cine__copy', hero);
    const machines = $('.cine__machines', hero);
    const grid = $('.cine__grid', hero);
    const opts = { target: hero, offset: ['start start', 'end start'] };
    if (reel) scroll(animate(reel, { y: [0, 90], scale: [1, 1.06] }, { ease: 'linear' }), opts);
    if (copy) scroll(animate(copy, { y: [0, -50], opacity: [1, 0.15] }, { ease: 'linear' }), opts);
    if (machines) scroll(animate(machines, { y: [0, 40], scale: [1, 0.94] }, { ease: 'linear' }), opts);

    /* hero: on a desktop the stage and blueprint grid lean gently toward the pointer */
    if (machines && grid && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const ring = $('.cine__ring', hero);
      let raf = 0;
      hero.addEventListener('pointermove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = hero.getBoundingClientRect();
          const dx = (e.clientX - r.left) / r.width - 0.5;
          const dy = (e.clientY - r.top) / r.height - 0.5;
          animate(machines, { x: dx * 18, rotateY: dx * 6 }, { type: spring, stiffness: 120, damping: 20 });
          animate(grid, { x: dx * -14, y: dy * -10 }, { type: spring, stiffness: 90, damping: 22 });
          if (ring) animate(ring, { x: dx * 10, y: dy * 8 }, { type: spring, stiffness: 90, damping: 22 });
        });
      });
      hero.addEventListener('pointerleave', () => {
        animate(machines, { x: 0, rotateY: 0 }, { type: spring, stiffness: 120, damping: 22 });
        animate(grid, { x: 0, y: 0 }, { type: spring, stiffness: 90, damping: 22 });
        if (ring) animate(ring, { x: 0, y: 0 }, { type: spring, stiffness: 90, damping: 22 });
      });
    }

    /* product range: each cut-out rises onto its stage and settles as it reaches the middle of the screen */
    $$('.h-range__fig picture').forEach((pic) => {
      scroll(animate(pic, { y: [48, 0], scale: [0.94, 1] }, { ease: 'easeOut' }), {
        target: pic.closest('.h-range__fig'), offset: ['start end', 'center center']
      });
    });

    /* "how we work": step numbers pop in with a spring as each step arrives */
    $$('.h-step__n').forEach((n) => {
      n.style.transform = 'scale(0.6)';
      inView(n, () => {
        animate(n, { scale: 1 }, { type: spring, stiffness: 420, damping: 16, delay: 0.15 });
      }, { amount: 0.8 });
    });

    /* industry tiles: gentle lift on hover where a pointer exists */
    if (matchMedia('(hover: hover)').matches) {
      $$('.h-ind__grid a').forEach((el) => {
        el.addEventListener('pointerenter', () => animate(el, { y: -4 }, { type: spring, stiffness: 300, damping: 20 }));
        el.addEventListener('pointerleave', () => animate(el, { y: 0 }, { type: spring, stiffness: 300, damping: 24 }));
      });
    }
  };

  if (document.readyState === 'complete') (window.requestIdleCallback || setTimeout)(boot);
  else addEventListener('load', () => (window.requestIdleCallback || setTimeout)(boot));
})();
