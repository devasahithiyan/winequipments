/* Win Equipments chat assistant. Loaded on first tap of the launcher. */
window.WinChat = (() => {
  const ENDPOINT = '/api_chat.php';
  const KEY = 'win_chat_v3';
  const WA = 'https://wa.me/919597228969';
  const SUGGEST = [
    'Which dryer suits a 30 HP compressor?',
    'Refrigerated or desiccant dryer?',
    'Chiller for 100 LPM with 5 °C rise',
    'Round or square cooling tower?'
  ];
  let panel, log, form, input, sendBtn, launcher;
  let history = [];
  let busy = false;

  try { history = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (_) { history = []; }
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-12))); } catch (_) {} };

  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const format = (text) => {
    let h = esc(text);
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/(https?:\/\/[^\s<)]+[^\s<).,])/g, (u) => {
      const label = u.includes('wa.me') ? 'WhatsApp us' : u.replace(/^https?:\/\/(www\.)?winequipments\.com/, '').replace(/\.html(#.*)?$/, '').replace(/^\/products\//, '') || u;
      return `<a href="${u}"${u.includes('winequipments.com') ? '' : ' target="_blank" rel="noopener"'}>${label}</a>`;
    });
    return h.split(/\n{2,}/).map((p) => {
      const lines = p.split('\n');
      if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) return '<ul>' + lines.map((l) => `<li>${l.replace(/^\s*[-•*]\s+/, '')}</li>`).join('') + '</ul>';
      return `<p>${lines.join('<br>')}</p>`;
    }).join('');
  };

  const add = (role, text) => {
    const el = document.createElement('div');
    el.className = `chat__msg chat__msg--${role}`;
    el.innerHTML = role === 'user' ? `<p>${esc(text)}</p>` : format(text);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  };

  const typing = (on) => {
    let t = log.querySelector('.chat__typing');
    if (on && !t) {
      t = document.createElement('div');
      t.className = 'chat__msg chat__msg--bot chat__typing';
      t.setAttribute('aria-label', 'Assistant is typing');
      t.innerHTML = '<span></span><span></span><span></span>';
      log.appendChild(t);
      log.scrollTop = log.scrollHeight;
    } else if (!on && t) t.remove();
  };

  const send = async (text) => {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    log.querySelector('.chat__suggest')?.remove();
    add('user', text);
    history.push({ role: 'user', content: text });
    save();
    input.value = '';
    typing(true);
    let reply = '';
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 18000);
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(-7, -1) }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      const data = await r.json();
      reply = data && data.success && data.reply ? data.reply : '';
    } catch (_) { reply = ''; }
    typing(false);
    if (!reply) reply = `I couldn't reach the assistant just now. Our engineers can help directly on WhatsApp: ${WA} or call **+91 95972 28969**.`;
    add('bot', reply);
    history.push({ role: 'assistant', content: reply });
    save();
    (window.dataLayer = window.dataLayer || []).push({ event: 'chat_message', page: location.pathname });
    busy = false;
    sendBtn.disabled = false;
    input.focus();
  };

  const build = () => {
    panel = document.createElement('section');
    panel.className = 'chat';
    panel.id = 'chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat with Win Equipments');
    panel.innerHTML = `
      <header class="chat__head">
        <div><strong>Ask Win Equipments</strong><span>Product and sizing help · answers from our catalogues</span></div>
        <button type="button" class="chat__icon" data-chat-close aria-label="Close chat"><svg aria-hidden="true"><use href="#i-close"/></svg></button>
      </header>
      <div class="chat__log" aria-live="polite"></div>
      <div class="chat__handoff"><a href="${WA}?text=${encodeURIComponent('Hello Win Equipments, I have an enquiry.')}" target="_blank" rel="noopener" data-track="whatsapp_click"><svg aria-hidden="true"><use href="#i-wa"/></svg>Talk to an engineer on WhatsApp</a></div>
      <form class="chat__form">
        <label class="visually-hidden" for="chat-input">Your question</label>
        <input id="chat-input" class="chat__input" type="text" maxlength="600" autocomplete="off" enterkeyhint="send" placeholder="Ask about a product, model or sizing">
        <button type="submit" class="chat__send" aria-label="Send"><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>
      </form>`;
    document.body.appendChild(panel);
    log = panel.querySelector('.chat__log');
    form = panel.querySelector('.chat__form');
    input = panel.querySelector('.chat__input');
    sendBtn = panel.querySelector('.chat__send');
    form.addEventListener('submit', (e) => { e.preventDefault(); send(input.value); });
    panel.querySelector('[data-chat-close]').addEventListener('click', close);
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    if (history.length) {
      history.forEach((m) => add(m.role === 'user' ? 'user' : 'bot', m.content));
    } else {
      add('bot', 'Hello! Ask me about our air dryers, chillers and cooling towers, or tell me your compressor HP, flow or heat load and I\'ll suggest a model.');
      const s = document.createElement('div');
      s.className = 'chat__suggest';
      SUGGEST.forEach((q) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = q;
        b.addEventListener('click', () => send(q));
        s.appendChild(b);
      });
      log.appendChild(s);
    }
  };

  const open = () => {
    if (!panel) build();
    panel.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('chat-open');
    setTimeout(() => input.focus(), 50);
  };
  const close = () => {
    panel.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('chat-open');
    launcher.focus();
  };
  const toggle = () => (panel && panel.classList.contains('is-open') ? close() : open());

  return { init(btn) { launcher = btn; btn.addEventListener('click', toggle); open(); } };
})();
