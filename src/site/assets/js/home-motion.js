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

    /* hero: on a desktop the machines and blueprint grid lean gently toward the pointer.
       One rAF loop eases toward the pointer and writes the individual `translate` property, so it never fights the scroll-linked transforms and never creates animations per move */
    if (machines && grid && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let tx = 0, cx = 0, raf = 0;
      const tick = () => {
        cx += (tx - cx) * 0.08;
        if (Math.abs(tx - cx) < 0.05) cx = tx;
        machines.style.translate = `${cx.toFixed(2)}px 0`;
        grid.style.translate = `${(-cx * 0.7).toFixed(2)}px 0`;
        raf = cx === tx ? 0 : requestAnimationFrame(tick);
      };
      const go = (x) => { tx = x; if (!raf && !hero.classList.contains('is-off')) raf = requestAnimationFrame(tick); };
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        go(((e.clientX - r.left) / r.width - 0.5) * 18);
      }, { passive: true });
      hero.addEventListener('pointerleave', () => go(0));
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
