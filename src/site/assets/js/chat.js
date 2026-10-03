/* Win Equipments AI assistant. Loaded on first tap of the launcher. */
window.WinChat = (() => {
  const ENDPOINT = '/api_chat.php';
  const KEY = 'win_chat_v4';
  const WA = 'https://wa.me/919597228969';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const h1 = (document.querySelector('h1')?.textContent || '').trim();
  const onProduct = /^\/products\/[^/]+\.html$/.test(location.pathname) && document.querySelector('.p-hero');
  const SUGGEST = onProduct
    ? [`Which ${h1.replace(/s$/, '')} model do I need?`, 'What details do you need for a quote?', 'Which dryer suits a 30 HP compressor?', 'Chiller for 100 LPM with 5 °C rise']
    : ['Which dryer suits a 30 HP compressor?', 'Refrigerated or desiccant dryer?', 'Chiller for 100 LPM with 5 °C rise', 'Round or square cooling tower?'];
  const quoteHref = document.getElementById('quote') ? '#quote' : '/contactus.html#quote';

  let panel, log, form, input, sendBtn, launcher;
  let history = [];
  let busy = false;

  try { history = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (_) { history = []; }
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-12))); } catch (_) {} };

  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const format = (text) => {
    let h = esc(text);
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*\*/g, '');
    h = h.replace(/(https?:\/\/[^\s<)]+[^\s<).,])/g, (u) => {
      const label = u.includes('wa.me') ? 'WhatsApp us' : u.replace(/^https?:\/\/(www\.)?winequipments\.com/, '').replace(/\.html(#.*)?$/, '').replace(/^\/products\//, '').replace(/-/g, ' ') || u;
      return `<a href="${u}"${u.includes('winequipments.com') ? '' : ' target="_blank" rel="noopener"'}>${label}</a>`;
    });
    return h.split(/\n{2,}/).map((p) => {
      const lines = p.split('\n');
      if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) return '<ul>' + lines.map((l) => `<li>${l.replace(/^\s*[-•*]\s+/, '')}</li>`).join('') + '</ul>';
      return `<p>${lines.join('<br>')}</p>`;
    }).join('');
  };
  const scroll = () => { log.scrollTop = log.scrollHeight; };

  const row = (role) => {
    const r = document.createElement('div');
    r.className = `chat__row chat__row--${role}`;
    if (role === 'bot') r.innerHTML = '<span class="chat__avatar" aria-hidden="true"><svg><use href="#i-spark"/></svg></span>';
    const b = document.createElement('div');
    b.className = `chat__msg chat__msg--${role}`;
    r.appendChild(b);
    log.appendChild(r);
    return b;
  };

  const add = (role, text) => {
    const b = row(role);
    b.innerHTML = role === 'user' ? `<p>${esc(text)}</p>` : format(text);
    scroll();
    return b;
  };

  /* reveal the reply word by word so it reads like a live answer */
  const reveal = (text) => new Promise((done) => {
    const b = row('bot');
    if (reduce) { b.innerHTML = format(text); scroll(); return done(b); }
    const words = text.split(/(\s+)/);
    let i = 0;
    b.classList.add('is-streaming');
    const tick = () => {
      i = Math.min(words.length, i + 3);
      b.innerHTML = format(words.slice(0, i).join(''));
      scroll();
      if (i < words.length) setTimeout(tick, 28);
      else { b.classList.remove('is-streaming'); done(b); }
    };
    tick();
  });

  const nextSteps = () => {
    log.querySelector('.chat__next')?.remove();
    const n = document.createElement('div');
    n.className = 'chat__next';
    n.innerHTML = `<a href="${quoteHref}" data-chat-quote>Request a quote</a><a href="${WA}?text=${encodeURIComponent('Hello Win Equipments, I have an enquiry.')}" target="_blank" rel="noopener" data-track="whatsapp_click"><svg aria-hidden="true"><use href="#i-wa"/></svg>WhatsApp an engineer</a>`;
    n.querySelector('[data-chat-quote]').addEventListener('click', () => { if (window.innerWidth < 640 || quoteHref.startsWith('#')) close(false); });
    log.appendChild(n);
    scroll();
  };

  const typing = (on) => {
    let t = log.querySelector('.chat__thinking');
    if (on && !t) {
      t = document.createElement('div');
      t.className = 'chat__row chat__row--bot chat__thinking';
      t.innerHTML = '<span class="chat__avatar is-busy" aria-hidden="true"><svg><use href="#i-spark"/></svg></span><div class="chat__msg chat__msg--bot"><span class="chat__shimmer">Thinking</span><span class="chat__dots"><i></i><i></i><i></i></span></div>';
      t.setAttribute('role', 'status');
      log.appendChild(t);
      scroll();
    } else if (!on && t) t.remove();
  };

  const send = async (text) => {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    log.querySelector('.chat__suggest')?.remove();
    log.querySelector('.chat__next')?.remove();
    add('user', text);
    history.push({ role: 'user', content: text });
    save();
    input.value = '';
    typing(true);
    let reply = '';
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(-7, -1), page: { path: location.pathname, title: h1.slice(0, 120) } }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      const data = await r.json();
      reply = data && data.success && data.reply ? data.reply : '';
    } catch (_) { reply = ''; }
    typing(false);
    if (!reply) reply = `I couldn't reach the assistant just now. Our engineers can help directly on WhatsApp: ${WA} or call **+91 95972 28969**.`;
    await reveal(reply);
    history.push({ role: 'assistant', content: reply });
    save();
    nextSteps();
    (window.dataLayer = window.dataLayer || []).push({ event: 'chat_message', page: location.pathname });
    busy = false;
    sendBtn.disabled = false;
    if (window.innerWidth >= 640) input.focus();
  };

  const welcome = () => {
    add('bot', onProduct
      ? `Hi, I'm the Win Equipments AI assistant. Ask me anything about **${h1}**: models, capacities, sizing or what we need to quote.`
      : "Hi, I'm the Win Equipments AI assistant. Ask me about our air dryers, chillers and cooling towers, or give me your compressor HP, water flow or heat load and I'll suggest a model.");
    const s = document.createElement('div');
    s.className = 'chat__suggest';
    s.innerHTML = '<p>Try asking</p>';
    SUGGEST.forEach((q) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = q;
      b.addEventListener('click', () => send(q));
      s.appendChild(b);
    });
    log.appendChild(s);
  };

  const reset = () => {
    if (busy) return;
    history = [];
    save();
    log.innerHTML = '';
    welcome();
    input.focus();
  };

  const build = () => {
    panel = document.createElement('section');
    panel.className = 'chat';
    panel.id = 'chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Win Equipments AI assistant');
    panel.innerHTML = `
      <header class="chat__head">
        <span class="chat__badge" aria-hidden="true"><svg><use href="#i-spark"/></svg></span>
        <div class="chat__title"><strong>Win AI assistant</strong><span><i class="chat__live" aria-hidden="true"></i>AI · answers from our catalogues</span></div>
        <button type="button" class="chat__icon" data-chat-reset aria-label="Start a new chat" title="New chat"><svg aria-hidden="true"><use href="#i-refresh"/></svg></button>
        <button type="button" class="chat__icon" data-chat-close aria-label="Close chat"><svg aria-hidden="true"><use href="#i-close"/></svg></button>
      </header>
      <div class="chat__log" aria-live="polite"></div>
      <form class="chat__form">
        <div class="chat__field">
          <label class="visually-hidden" for="chat-input">Ask the AI assistant</label>
          <input id="chat-input" class="chat__input" type="text" maxlength="600" autocomplete="off" enterkeyhint="send" placeholder="Ask about a product, model or sizing">
          <button type="submit" class="chat__send" aria-label="Send"><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>
        </div>
        <p class="chat__note">AI-generated answers can be wrong. Our engineers confirm every selection and quotation.</p>
      </form>`;
    document.body.appendChild(panel);
    log = panel.querySelector('.chat__log');
    form = panel.querySelector('.chat__form');
    input = panel.querySelector('.chat__input');
    sendBtn = panel.querySelector('.chat__send');
    form.addEventListener('submit', (e) => { e.preventDefault(); send(input.value); });
    panel.querySelector('[data-chat-close]').addEventListener('click', () => close());
    panel.querySelector('[data-chat-reset]').addEventListener('click', reset);
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    if (history.length) {
      history.forEach((m) => add(m.role === 'user' ? 'user' : 'bot', m.content));
      nextSteps();
    } else welcome();
  };

  const open = () => {
    if (!panel) build();
    panel.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('chat-open');
    scroll();
    setTimeout(() => input.focus(), 50);
  };
  const close = (refocus = true) => {
    panel.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('chat-open');
    if (refocus) launcher.focus();
  };
  const toggle = () => (panel && panel.classList.contains('is-open') ? close() : open());

  return { init(btn) { launcher = btn; btn.addEventListener('click', toggle); open(); } };
})();
