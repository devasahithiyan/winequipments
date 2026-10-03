(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  window.dataLayer = window.dataLayer || [];
  const track = (event, data = {}) => window.dataLayer.push({ event, page: location.pathname, ...data });

  /* analytics hooks */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-track]');
    if (t) track(t.dataset.track, { href: t.getAttribute('href') });
  });

  /* mobile menu sheet */
  const sheet = $('#menu-sheet');
  const toggle = $('.menu-toggle');
  let lastFocus = null;
  const openMenu = () => {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('is-open'));
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    $('[data-menu-close]', sheet).focus();
  };
  const closeMenu = (restore = true) => {
    sheet.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (!sheet.classList.contains('is-open')) sheet.hidden = true; }, 260);
    if (restore && lastFocus) lastFocus.focus();
  };
  if (sheet && toggle) {
    toggle.addEventListener('click', openMenu);
    $('[data-menu-close]', sheet).addEventListener('click', () => closeMenu());
    sheet.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
      if (e.key !== 'Tab') return;
      const f = $$('a[href], button, input, summary', sheet).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    sheet.addEventListener('click', (e) => { if (e.target.closest('a[href]')) closeMenu(false); });

    const filter = $('#menu-filter');
    const tree = $('#menu-tree');
    const results = $('#menu-results');
    const empty = $('#menu-empty');
    const items = $$('a[data-name]', tree).map((a) => ({ a, text: (a.dataset.name || '').toLowerCase() }));
    filter.addEventListener('input', () => {
      const q = filter.value.trim().toLowerCase();
      if (!q) { tree.hidden = false; results.hidden = true; empty.hidden = true; return; }
      const words = q.split(/\s+/);
      const hits = items.filter((i) => words.every((w) => i.text.includes(w.replace(/s$/, ''))));
      results.innerHTML = '';
      hits.forEach(({ a }) => {
        const li = document.createElement('li');
        const c = a.cloneNode(true);
        c.removeAttribute('data-name');
        li.appendChild(c);
        results.appendChild(li);
      });
      tree.hidden = true;
      results.hidden = !hits.length;
      empty.hidden = !!hits.length;
    });
  }

  /* desktop mega menu */
  const megaBtn = $('[data-mega]');
  const mega = $('#mega-products');
  if (megaBtn && mega) {
    const setMega = (open) => { mega.hidden = !open; megaBtn.setAttribute('aria-expanded', String(open)); };
    megaBtn.addEventListener('click', () => setMega(mega.hidden));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mega.hidden) { setMega(false); megaBtn.focus(); } });
    document.addEventListener('click', (e) => { if (!mega.hidden && !e.target.closest('#mega-products, [data-mega]')) setMega(false); });
    mega.addEventListener('click', (e) => { if (e.target.closest('a')) setMega(false); });
  }

  /* quote links: scroll to form, prefill model */
  const quote = $('#quote');
  const goQuote = (model) => {
    if (!quote) return;
    const form = $('form[data-rfq]', quote);
    if (model && form) {
      const sel = $('[name="selected_model"]', form);
      if (sel) { sel.value = model; $('.form-more', form).open = true; }
      const req = $('[name="operating_parameters"]', form);
      if (req && !req.value) req.value = `Quotation for ${model}`;
    }
    quote.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    const first = form && $('#f-name', form);
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 450);
    track('quote_intent', { model: model || '' });
  };
  document.addEventListener('click', (e) => {
    const m = e.target.closest('[data-quote-model]');
    const l = e.target.closest('[data-quote-link]');
    if (m) { e.preventDefault(); goQuote(m.dataset.quoteModel); }
    else if (l && quote) { e.preventDefault(); goQuote(); }
  });
  if (location.hash && quote) {
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.classList.contains('model')) { const d = $('details', target); if (d) d.open = true; }
  }

  /* duty finder */
  $$('[data-explorer]').forEach((ex) => {
    const input = $('[data-duty]', ex);
    const out = $('[data-finder-result]', ex);
    if (!input || !out) return;
    const unit = ex.dataset.unit;
    const rows = $$('.model[data-cap]', ex).filter((r) => r.dataset.cap !== '');
    const trs = $$('tr[data-cap]', ex);
    const run = () => {
      const v = parseFloat(input.value);
      rows.forEach((r) => r.classList.remove('is-match'));
      trs.forEach((r) => r.classList.remove('is-match'));
      if (!v || v <= 0) { out.textContent = out.dataset.default || out.textContent; return; }
      const hit = rows.find((r) => parseFloat(r.dataset.cap) >= v);
      if (!hit) {
        out.innerHTML = `${v} ${unit} is above our standard range. <a href="#quote" data-quote-link>Ask our engineers</a> for a larger or multiple-unit solution.`;
        return;
      }
      const model = hit.dataset.model;
      hit.classList.add('is-match');
      const tr = trs[rows.indexOf(hit)];
      if (tr) tr.classList.add('is-match');
      out.innerHTML = `<strong>${model}</strong> covers ${v} ${unit} (rated ${hit.dataset.cap} ${unit}). <a href="#${hit.id}" data-jump>View model</a> · <a href="#quote" data-quote-model="${model}">Quote ${model}</a>`;
      track('duty_finder', { value: v, model });
    };
    out.dataset.default = out.textContent;
    input.addEventListener('input', run);
    out.addEventListener('click', (e) => {
      const j = e.target.closest('[data-jump]');
      if (!j) return;
      e.preventDefault();
      const id = j.getAttribute('href').slice(1);
      const li = document.getElementById(id);
      const visible = li && li.offsetParent !== null;
      const target = visible ? li : $(`#t-${id}`, ex);
      if (visible) { const d = $('details', li); if (d) d.open = true; }
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* WRD correction calculator */
  const corr = $('[data-correction]');
  if (corr) {
    const flow = $('[data-c-flow]', corr);
    const res = $('[data-c-result]', corr);
    const duty = $('[data-duty]');
    const calc = () => {
      const q = parseFloat(flow.value);
      if (!q) return;
      const f = $$('[data-c-factor]', corr).reduce((acc, s) => acc * parseFloat(s.value), 1);
      const nominal = Math.ceil(q / f);
      res.innerHTML = `Dryer nominal capacity needed: <strong>${nominal} CFM</strong> (${q} ÷ ${f.toFixed(3)}).`;
      if (duty) { duty.value = nominal; duty.dispatchEvent(new Event('input')); const m = $('.model.is-match'); if (m) res.innerHTML += ` Selected: <a href="#specs">${m.dataset.model}</a>.`; }
    };
    corr.addEventListener('input', calc);
    corr.addEventListener('change', calc);
  }

  /* forms */
  $$('form[data-rfq]').forEach((form) => {
    const status = $('[data-status]', form);
    const success = form.nextElementSibling;
    const validate = (el) => {
      const field = el.closest('.field');
      if (!field) return true;
      let ok = el.checkValidity();
      if (el.type === 'tel' && el.value) ok = el.value.replace(/\D/g, '').length >= 10;
      field.classList.toggle('has-error', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    $$('input[required], input[type="email"], input[type="tel"]', form).forEach((el) => {
      el.addEventListener('blur', () => { if (el.value || el.closest('.field').classList.contains('has-error')) validate(el); });
      el.addEventListener('input', () => { if (el.closest('.field').classList.contains('has-error')) validate(el); });
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fields = $$('input[required], input[type="email"], input[type="tel"]', form);
      const bad = fields.filter((el) => !validate(el));
      if (bad.length) { bad[0].focus(); return; }
      const btn = $('button[type="submit"]', form);
      btn.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.textContent = 'Sending…';
      status.className = 'form-status';
      try {
        const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
        const data = await r.json().catch(() => ({}));
        if (!r.ok || data.success === false) throw new Error(data.message || 'send failed');
        const ref = data.ref || data.reference || data.refId || '';
        const refEl = success && $('[data-ref]', success);
        if (refEl) refEl.textContent = ref || 'received';
        form.classList.add('is-sent');
        if (success) success.focus();
        track('quote_submit', { product: (form.equipment_type || {}).value || '' });
      } catch (err) {
        status.className = 'form-status is-error';
        status.innerHTML = 'We could not send your enquiry. Please WhatsApp or call +91 95972 28969, or email info@winequipments.com.';
        btn.removeAttribute('aria-busy'); btn.disabled = false; btn.textContent = 'Send enquiry';
      }
    });
  });

  /* action bar: hide while the enquiry form is on screen or a field has focus */
  const bar = $('#action-bar');
  if (bar && !('IntersectionObserver' in window)) bar.classList.add('is-ready');
  if (bar && 'IntersectionObserver' in window) {
    const vis = {};
    let typing = false;
    const update = () => { bar.classList.toggle('is-hidden', typing || Object.values(vis).some(Boolean)); bar.classList.add('is-ready'); };
    $$('#quote, .site-footer').forEach((el, i) => new IntersectionObserver((en) => { vis[i] = en[en.length - 1].isIntersecting; update(); }, { threshold: 0.02 }).observe(el));
    const heroCta = $('.h-hero__ctas, .hero .btn-row, .p-hero .btn-row, .hub-hero .btn-row');
    if (heroCta) new IntersectionObserver((en) => { const e = en[en.length - 1]; vis.hero = e.isIntersecting; update(); }).observe(heroCta);
    document.addEventListener('focusin', (e) => { if (e.target.matches('input, textarea, select') && !e.target.closest('.action-bar')) { typing = true; update(); } });
    document.addEventListener('focusout', () => { typing = false; update(); });
  }

  /* sub-navigation active state */
  const sublinks = $$('.subnav a');
  if (sublinks.length && 'IntersectionObserver' in window) {
    const map = new Map(sublinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((en) => {
      en.forEach((x) => { if (x.isIntersecting) { sublinks.forEach((a) => a.classList.remove('is-active')); const a = map.get(x.target.id); if (a) { a.classList.add('is-active'); a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } } });
    }, { rootMargin: '-30% 0px -60% 0px' });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* chart: give the process line its own length for the draw-on */
  $$('.chart .process').forEach((p) => { try { p.style.setProperty('--len', Math.ceil(p.getTotalLength())); } catch (_) {} });
})();

/* shared motion: reveal on scroll, headline split, count-up, process fill, parallax */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('static');
  const hasIO = 'IntersectionObserver' in window;
  if (!reduce && hasIO) document.documentElement.classList.add('motion');

  const title = $('[data-split]');
  if (title && !reduce) {
    const text = title.textContent.trim();
    title.setAttribute('aria-label', text);
    title.innerHTML = text.split(/\s+/).map((w, i) => `<span class="w" aria-hidden="true" style="--i:${i}">${w}</span>`).join(' ');
  }

  if (!reduce && hasIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('[data-reveal]').forEach((el) => io.observe(el));
  }

  const counters = $$('[data-count]');
  if (counters.length && hasIO && !reduce) {
    const fmt = (n) => n.toLocaleString('en-IN');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target;
        const to = parseInt(el.dataset.count, 10);
        const from = parseInt(el.dataset.from || '0', 10);
        const t0 = performance.now();
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / 1400);
          el.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 4))));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
  }

  const steps = $('[data-steps]');
  const par = $('[data-parallax] img');
  if (!reduce && (steps || par)) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      if (steps) {
        const r = steps.getBoundingClientRect();
        steps.style.setProperty('--p', Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.25))).toFixed(3));
      }
      if (par) {
        const r = par.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) par.style.setProperty('--py', `${(-6 + ((r.top + r.height / 2 - vh / 2) / vh) * 8).toFixed(2)}%`);
      }
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  } else if (steps) steps.style.setProperty('--p', '1');

  /* header: solid after scroll */
  const header = $('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();

/* product gallery */
(() => {
  document.querySelectorAll('[data-gallery]').forEach((g) => {
    const shots = Array.from(g.querySelectorAll('[data-shot]'));
    const thumbs = Array.from(g.querySelectorAll('[data-thumb]'));
    shots.forEach((s) => (s.hidden = false));
    thumbs.forEach((t) => t.addEventListener('click', () => {
      const n = t.dataset.thumb;
      shots.forEach((s) => s.classList.toggle('is-active', s.dataset.shot === n));
      thumbs.forEach((b) => { const on = b === t; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    }));
  });
})();

/* chat launcher: load the assistant on first tap */
(() => {
  const btn = document.querySelector('.chat-launcher');
  if (!btn) return;
  const load = () => {
    btn.removeEventListener('click', load);
    btn.setAttribute('aria-busy', 'true');
    const sc = document.createElement('script');
    sc.src = btn.dataset.chatSrc;
    sc.onload = () => { btn.removeAttribute('aria-busy'); window.WinChat.init(btn); };
    sc.onerror = () => { btn.removeAttribute('aria-busy'); location.href = 'https://wa.me/919597228969'; };
    document.head.appendChild(sc);
    (window.dataLayer = window.dataLayer || []).push({ event: 'chat_open', page: location.pathname });
  };
  btn.addEventListener('click', load);
})();

/* photo rails + lightbox */
(() => {
  const rails = document.querySelectorAll('[data-rail]');
  if (!rails.length) return;
  rails.forEach((rail) => {
    const list = rail.querySelector('[data-rail-list]');
    const prev = rail.querySelector('[data-rail-prev]');
    const next = rail.querySelector('[data-rail-next]');
    const step = () => (list.firstElementChild ? list.firstElementChild.getBoundingClientRect().width + 12 : 300) * (innerWidth >= 1024 ? 2 : 1);
    const sync = () => {
      prev.disabled = list.scrollLeft < 8;
      next.disabled = list.scrollLeft + list.clientWidth > list.scrollWidth - 8;
    };
    prev.addEventListener('click', () => list.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => list.scrollBy({ left: step(), behavior: 'smooth' }));
    list.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();
  });

  let lb, img, cap, count, items = [], idx = 0, opener = null;
  const build = () => {
    lb = document.createElement('dialog');
    lb.className = 'lb';
    lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML = `<div class="lb__top"><span class="lb__count" aria-live="polite"></span><button type="button" class="lb__close" aria-label="Close photo"><svg aria-hidden="true"><use href="#i-close"/></svg></button></div>
      <div class="lb__stage"><img class="lb__img" alt=""><button type="button" class="lb__nav lb__nav--prev" aria-label="Previous photo"><svg aria-hidden="true"><use href="#i-chev"/></svg></button><button type="button" class="lb__nav lb__nav--next" aria-label="Next photo"><svg aria-hidden="true"><use href="#i-chev"/></svg></button></div>
      <p class="lb__cap"></p>`;
    document.body.appendChild(lb);
    img = lb.querySelector('.lb__img'); cap = lb.querySelector('.lb__cap'); count = lb.querySelector('.lb__count');
    lb.querySelector('.lb__close').addEventListener('click', () => lb.close());
    lb.querySelector('.lb__nav--prev').addEventListener('click', () => show(idx - 1));
    lb.querySelector('.lb__nav--next').addEventListener('click', () => show(idx + 1));
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    lb.addEventListener('close', () => { document.body.classList.remove('lb-open'); opener?.focus(); });
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb__stage')) lb.close(); });
    let sx = null;
    const stage = lb.querySelector('.lb__stage');
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    });
  };
  const show = (n) => {
    idx = (n + items.length) % items.length;
    const a = items[idx];
    const thumb = a.querySelector('img');
    img.classList.add('is-loading');
    img.onload = () => img.classList.remove('is-loading');
    img.src = a.href;
    img.alt = thumb ? thumb.alt : '';
    cap.textContent = a.dataset.lbCaption || '';
    count.textContent = `${idx + 1} / ${items.length}`;
    const pre = new Image(); pre.src = items[(idx + 1) % items.length].href;
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-lightbox] a.rail__link');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (!lb) build();
    if (typeof lb.showModal !== 'function') { location.href = a.href; return; }
    items = Array.from(a.closest('[data-lightbox]').querySelectorAll('a.rail__link'));
    opener = a;
    show(items.indexOf(a));
    lb.showModal();
    document.body.classList.add('lb-open');
    (window.dataLayer = window.dataLayer || []).push({ event: 'photo_open', page: location.pathname });
  });
})();

/* the old site registered a service worker; make sure none is left controlling the page */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
}
