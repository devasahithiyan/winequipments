/**
 * Win Equipments – Technical Sizing & Application Engineering Assistant
 * Resilient, Zero-Failure Client Engine with Dynamic Suggestions & Grounded Knowledge
 */

(function () {
  'use strict';

  // Prevent multiple executions
  if (window.__WIN_TECHNICAL_DESK_INITIALIZED__) return;
  window.__WIN_TECHNICAL_DESK_INITIALIZED__ = true;

  const STORAGE_KEY = 'win_equipments_chat_history_v2';
  const ENDPOINT = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    ? '/api_chat.php'
    : 'api_chat.php';

  const OFFICIAL_PHONE_1 = '+91 95972 28969';
  const OFFICIAL_PHONE_2 = '+91 95972 28975';
  const OFFICIAL_WA_URL = 'https://wa.me/919597228969';

  let chatHistory = [];
  let isOpen = false;
  let teaserDismissed = false;

  // Suggestion Questions (Categorized & Pre-configured)
  const SUGGESTIONS = [
    {
      icon: 'fas fa-wind',
      title: 'Size Air Dryer for Compressor',
      subtitle: 'Formula: HP × 4.2 ≈ CFM at 45°C ambient',
      query: 'How do I size an air dryer for my air compressor?'
    },
    {
      icon: 'fas fa-snowflake',
      title: 'Calculate Chiller Tonnage (TR)',
      subtitle: 'Flow LPM × ΔT °C calculation for machines',
      query: 'How do I calculate required process chiller TR for my machinery?'
    },
    {
      icon: 'fas fa-water',
      title: 'FRP Cooling Tower TR Selection',
      subtitle: 'Round vs Square, wet-bulb approach & CTI specs',
      query: 'How do I select an FRP cooling tower based on water flow rate and wet bulb?'
    },
    {
      icon: 'fas fa-file-invoice',
      title: 'Request Factory Quotation & Price',
      subtitle: 'Direct manufacturer pricing & CAD fitment drawings',
      query: 'How can I get an official quotation and price list from your Arasur works?'
    },
    {
      icon: 'fas fa-sliders-h',
      title: 'Refrigerated vs Desiccant Dryer',
      subtitle: 'When to choose +3°C PDP vs -40°C deep dew point',
      query: 'What is the difference between Refrigerated (+3°C PDP) and Desiccant (-40°C PDP) air dryers?'
    },
    {
      icon: 'fas fa-phone-alt',
      title: 'Speak with Application Engineer',
      subtitle: 'Direct consultation: +91 95972 28969',
      query: 'I would like to speak directly with an application engineer.'
    }
  ];

  // Initialize immediately on DOM ready or inline
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDesk);
  } else {
    initDesk();
  }

  function initDesk() {
    loadStoredHistory();
    createWidgetDOM();
    bindEvents();
    initTeaser();
  }

  function loadStoredHistory() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        chatHistory = JSON.parse(stored);
      }
    } catch (e) {
      chatHistory = [];
    }
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory.slice(-12)));
    } catch (e) {}
  }

  function createWidgetDOM() {
    // Remove any legacy elements if present
    const oldLauncher = document.getElementById('winAiLauncher');
    if (oldLauncher) oldLauncher.remove();
    const oldWindow = document.getElementById('winAiWindow');
    if (oldWindow) oldWindow.remove();
    const oldTeaser = document.getElementById('winAiTeaser');
    if (oldTeaser) oldTeaser.remove();

    // 1. Proactive Teaser Bubble
    const teaser = document.createElement('div');
    teaser.id = 'winAiTeaser';
    teaser.className = 'win-ai-teaser';
    teaser.style.display = 'none';
    teaser.innerHTML = `
      <div class="win-ai-teaser-icon"><i class="fas fa-headset"></i></div>
      <div class="win-ai-teaser-text">
        Need sizing help for <strong>Chillers</strong> or <strong>Air Dryers</strong>?
      </div>
      <button type="button" class="win-ai-teaser-close" id="winTeaserClose" aria-label="Dismiss">&times;</button>
    `;
    document.body.appendChild(teaser);

    // 2. Floating Launcher Button
    const launcher = document.createElement('div');
    launcher.id = 'winAiLauncher';
    launcher.className = 'win-ai-chat-launcher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('aria-label', 'Open Technical Support Desk');
    launcher.innerHTML = `
      <div class="ai-icon-bubble"><i class="fas fa-headset"></i></div>
      <span>Technical Desk</span>
      <span class="ai-online-pulse"></span>
    `;
    document.body.appendChild(launcher);

    // 3. Main Chat Window
    const windowEl = document.createElement('div');
    windowEl.id = 'winAiWindow';
    windowEl.className = 'win-ai-chat-window';
    windowEl.innerHTML = `
      <div class="win-ai-chat-header">
        <div class="win-ai-chat-title-group">
          <div class="win-ai-avatar"><i class="fas fa-headset"></i></div>
          <div class="win-ai-header-text">
            <h4>Win Technical Desk</h4>
            <span><span class="ai-online-pulse"></span> Arasur Works • Factory Sizing Desk</span>
          </div>
        </div>
        <div class="win-ai-header-actions">
          <a href="tel:+919597228969" class="win-header-action-btn call-btn" title="Call Senior Engineer (+91 95972 28969)">
            <i class="fas fa-phone-alt"></i>
          </a>
          <a href="${OFFICIAL_WA_URL}" target="_blank" rel="noopener" class="win-header-action-btn wa-btn" title="WhatsApp Sizing Desk">
            <i class="fab fa-whatsapp"></i>
          </a>
          <button type="button" class="win-header-action-btn" id="winAiReset" title="Restart / Show Suggestions">
            <i class="fas fa-redo-alt"></i>
          </button>
          <button type="button" class="win-header-action-btn" id="winAiClose" title="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="win-ai-chat-messages" id="winAiMessages"></div>

      <form class="win-ai-chat-input-bar" id="winAiForm">
        <input type="text" id="winAiInput" placeholder="Ask about sizing, CFM, TR, pricing, 45°C duty..." autocomplete="off" required>
        <button type="submit" class="win-ai-chat-send-btn" id="winAiSend" aria-label="Send message">
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    `;
    document.body.appendChild(windowEl);

    // Render Initial View (Suggestions or Existing History)
    renderMessages();
  }

  function initTeaser() {
    // Show teaser after 1.8s if chat hasn't been opened
    setTimeout(() => {
      if (!isOpen && !teaserDismissed && chatHistory.length === 0) {
        const teaser = document.getElementById('winAiTeaser');
        if (teaser) teaser.style.display = 'flex';
      }
    }, 1800);
  }

  function bindEvents() {
    const launcher = document.getElementById('winAiLauncher');
    const teaser = document.getElementById('winAiTeaser');
    const teaserClose = document.getElementById('winTeaserClose');
    const closeBtn = document.getElementById('winAiClose');
    const resetBtn = document.getElementById('winAiReset');
    const form = document.getElementById('winAiForm');
    const input = document.getElementById('winAiInput');
    const messagesContainer = document.getElementById('winAiMessages');

    launcher.addEventListener('click', toggleChat);

    if (teaser) {
      teaser.addEventListener('click', function (e) {
        if (e.target.closest('#winTeaserClose')) return;
        openChat();
      });
    }

    if (teaserClose) {
      teaserClose.addEventListener('click', function (e) {
        e.stopPropagation();
        teaserDismissed = true;
        teaser.style.display = 'none';
      });
    }

    closeBtn.addEventListener('click', closeChat);

    resetBtn.addEventListener('click', function () {
      chatHistory = [];
      sessionStorage.removeItem(STORAGE_KEY);
      renderMessages();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendMessage(text);
    });

    // Handle suggestion clicks & action button clicks
    messagesContainer.addEventListener('click', function (e) {
      const card = e.target.closest('.win-ai-suggestion-card');
      if (card) {
        const query = card.getAttribute('data-query');
        if (query) {
          sendMessage(query);
        }
        return;
      }

      const rfqBtn = e.target.closest('.win-ai-action-btn.rfq');
      if (rfqBtn) {
        closeChat();
        const rfqSection = document.getElementById('rfq-section') || document.getElementById('quick-rfq');
        if (rfqSection) {
          rfqSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    });
  }

  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  function openChat() {
    const windowEl = document.getElementById('winAiWindow');
    const teaser = document.getElementById('winAiTeaser');
    const input = document.getElementById('winAiInput');
    if (teaser) teaser.style.display = 'none';
    teaserDismissed = true;

    windowEl.classList.add('is-open');
    isOpen = true;
    setTimeout(() => {
      if (input) input.focus();
    }, 200);
    scrollToBottom();
  }

  function closeChat() {
    const windowEl = document.getElementById('winAiWindow');
    if (windowEl) windowEl.classList.remove('is-open');
    isOpen = false;
  }

  function renderMessages() {
    const container = document.getElementById('winAiMessages');
    if (!container) return;
    container.innerHTML = '';

    if (chatHistory.length === 0) {
      // PRE-QUESTION SUGGESTION WELCOME SCREEN
      renderWelcomeScreen(container);
    } else {
      chatHistory.forEach(msg => {
        appendMessageDOM(msg.role === 'user' ? 'user' : 'bot', msg.content, false);
      });
    }
    scrollToBottom();
  }

  function renderWelcomeScreen(container) {
    const welcomeCard = document.createElement('div');
    welcomeCard.className = 'win-ai-welcome-card';
    welcomeCard.innerHTML = `
      <div class="win-ai-welcome-header">
        <i class="fas fa-shield-alt"></i>
        <span>Direct Factory Engineering Support</span>
      </div>
      <p>
        Welcome to <strong>Win Equipments Arasur Works</strong>. Our senior application engineers can calculate precise equipment capacity, verify 45°C ambient operating boundaries, and issue direct factory quotations.
      </p>
      <div class="win-ai-suggestions-title">
        <i class="fas fa-lightbulb"></i> Frequently Asked Technical Questions:
      </div>
      <div class="win-ai-suggestions-grid">
        ${SUGGESTIONS.map(item => `
          <button type="button" class="win-ai-suggestion-card" data-query="${escapeHtml(item.query)}">
            <div class="win-ai-sugg-icon"><i class="${item.icon}"></i></div>
            <div class="win-ai-sugg-content">
              <div class="win-ai-sugg-title">${escapeHtml(item.title)}</div>
              <div class="win-ai-sugg-sub">${escapeHtml(item.subtitle)}</div>
            </div>
            <i class="fas fa-chevron-right" style="color:#94A3B8;font-size:0.75rem;"></i>
          </button>
        `).join('')}
      </div>
    `;
    container.appendChild(welcomeCard);
  }

  function appendMessageDOM(sender, text, isNew = true) {
    const container = document.getElementById('winAiMessages');
    const msgEl = document.createElement('div');
    msgEl.className = `win-ai-msg win-ai-msg-${sender}`;
    msgEl.innerHTML = formatMarkdown(text);

    // If it's a bot answer, append quick action buttons
    if (sender === 'bot') {
      const actionsEl = document.createElement('div');
      actionsEl.className = 'win-ai-msg-actions';
      actionsEl.innerHTML = `
        <a href="#rfq-section" class="win-ai-action-btn rfq"><i class="fas fa-file-contract"></i> Request Official RFQ</a>
        <a href="${OFFICIAL_WA_URL}" target="_blank" rel="noopener" class="win-ai-action-btn wa"><i class="fab fa-whatsapp"></i> WhatsApp Engineer</a>
        <a href="tel:+919597228969" class="win-ai-action-btn call"><i class="fas fa-phone-alt"></i> Call +91 95972 28969</a>
      `;
      msgEl.appendChild(actionsEl);
    }

    container.appendChild(msgEl);
    scrollToBottom();
    return msgEl;
  }

  function showTypingIndicator() {
    const container = document.getElementById('winAiMessages');
    const typingEl = document.createElement('div');
    typingEl.id = 'winAiTyping';
    typingEl.className = 'win-ai-msg win-ai-msg-bot win-ai-typing';
    typingEl.innerHTML = `
      <span class="win-ai-typing-dot"></span>
      <span class="win-ai-typing-dot"></span>
      <span class="win-ai-typing-dot"></span>
    `;
    container.appendChild(typingEl);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const typingEl = document.getElementById('winAiTyping');
    if (typingEl) typingEl.remove();
  }

  function scrollToBottom() {
    const container = document.getElementById('winAiMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Bullet lines
    escaped = escaped.replace(/(?:^|\n)[-•*]\s+(.*)/g, '<br><i class="fas fa-check" style="color:#0284C7;font-size:0.75rem;margin-right:4px;"></i> $1');

    // Auto-link WhatsApp URLs
    escaped = escaped.replace(/(https:\/\/wa\.me\/[0-9]+(?:\?[^\s<]+)?)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');

    // Auto-link standard URLs
    escaped = escaped.replace(/(https?:\/\/[^\s<]+)/g, function(url) {
      if (url.includes('wa.me')) return url;
      return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
    });

    // Convert double newlines to breaks
    escaped = escaped.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

    return escaped;
  }

  /* ── Grounded Local Engineering Knowledge Fallback ── */
  function getLocalEngineeringAnswer(userQuery) {
    const q = userQuery.toLowerCase();

    // 1. Air Dryer CFM Sizing
    if (q.includes('dryer') || q.includes('cfm') || q.includes('compressor')) {
      return (
        "**Air Dryer Sizing Rules of Thumb (45°C Ambient):**\n\n" +
        "- **Piston & Screw Sizing Formula:** Compressor Motor HP × 4.2 ≈ Required Dryer CFM.\n" +
        "- **Standard Matched Models:**\n" +
        "  - 10 HP Compressor → **WRD 40 S (40 CFM)**\n" +
        "  - 20 HP Compressor → **WRD 80 S (80 CFM)**\n" +
        "  - 30 HP Compressor → **WRD 150 S (150 CFM)**\n" +
        "  - 50 HP Compressor → **WRD 200 S (200 CFM)**\n" +
        "  - 100 HP Compressor → **WRD 500 S (500 CFM)**\n\n" +
        "All Win Equipments WRD series dryers deliver guaranteed **+3°C Pressure Dew Point (ISO 8573-1 Class 4)** with zero air loss electronic drains."
      );
    }

    // 2. Chiller TR Sizing
    if (q.includes('chiller') || q.includes('tr') || q.includes('tonnage') || q.includes('cooling')) {
      return (
        "**Process Chiller Capacity Sizing (WCP Series):**\n\n" +
        "- **Thermodynamic Formula:** `TR = [Water Flow (LPM) × ΔT (°C) × 4.186] ÷ 211`\n" +
        "- **Plant Process Guidelines:**\n" +
        "  - **Plastic Injection Molding:** 0.15 to 0.25 TR per kg/hr of resin processed.\n" +
        "  - **Fiber Laser Cutting:** 1.0 TR per kW of laser optical power.\n" +
        "  - **Aluminum Anodizing (WAN Series):** Sulfuric acid bath cooling (18°C–21°C) with Grade 2 Titanium PHE.\n" +
        "  - **Medical Imaging (WMS Series):** Dual-circuit redundant chillers for MRI & CT scanners."
      );
    }

    // 3. Cooling Towers
    if (q.includes('tower') || q.includes('cooling tower') || q.includes('frp')) {
      return (
        "**FRP Cooling Towers (WCT Series):**\n\n" +
        "- **Capacity Range:** 10 TR to 1,500 TR in round bottle aerodynamic and modular square configurations.\n" +
        "- **Water Flow Benchmark:** ~13 LPM (3.0 GPM) per 1.0 TR of heat rejection.\n" +
        "- **Construction:** Heavy-duty isophthalic FRP resin, UV-resistant gel coat, brass rotary sprinkler head, and virgin PVC honeycomb cross-flute fills."
      );
    }

    // 4. Quotation & Pricing
    if (q.includes('quote') || q.includes('quotation') || q.includes('price') || q.includes('cost')) {
      return (
        "**Official Factory Quotations:**\n\n" +
        "Because Win Equipments is a **direct manufacturer (Arasur, Coimbatore)** with zero distributor markups, official proposals include detailed technical sizing, GA fitment drawings, and factory-direct pricing.\n\n" +
        "You can submit an instant request using the button below or contact our sales desk directly at **" + OFFICIAL_PHONE_1 + "**."
      );
    }

    // Default Fallback
    return (
      "Win Equipments is a direct industrial manufacturer established in 2008 in Arasur, Coimbatore, specializing in **Refrigerated Air Dryers (20–2000 CFM)**, **Process Water Chillers (1–150 TR)**, and **FRP Cooling Towers (10–1500 TR)**.\n\n" +
      "Our engineering team is standing by to help you size equipment or prepare factory quotations. Please call **" + OFFICIAL_PHONE_1 + "** or message us on WhatsApp: " + OFFICIAL_WA_URL
    );
  }

  function sendMessage(text) {
    appendMessageDOM('user', text);
    chatHistory.push({ role: 'user', content: text });
    saveHistory();

    const sendBtn = document.getElementById('winAiSend');
    const input = document.getElementById('winAiInput');
    if (sendBtn) sendBtn.disabled = true;
    if (input) input.disabled = true;

    showTypingIndicator();

    // Set a quick safety timeout for fetch (3.5s) to guarantee instantaneous response
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: text,
        history: chatHistory.slice(-6)
      }),
      signal: controller.signal
    })
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        removeTypingIndicator();
        if (data && data.success && data.reply) {
          appendMessageDOM('bot', data.reply);
          chatHistory.push({ role: 'assistant', content: data.reply });
          saveHistory();
        } else {
          // Fallback to grounded local answer
          const localAnswer = getLocalEngineeringAnswer(text);
          appendMessageDOM('bot', localAnswer);
          chatHistory.push({ role: 'assistant', content: localAnswer });
          saveHistory();
        }
      })
      .catch(err => {
        clearTimeout(timeoutId);
        removeTypingIndicator();
        // Zero failure fallback: answer immediately with verified local knowledge
        const localAnswer = getLocalEngineeringAnswer(text);
        appendMessageDOM('bot', localAnswer);
        chatHistory.push({ role: 'assistant', content: localAnswer });
        saveHistory();
      })
      .finally(() => {
        if (sendBtn) sendBtn.disabled = false;
        if (input) {
          input.disabled = false;
          input.focus();
        }
      });
  }
})();
