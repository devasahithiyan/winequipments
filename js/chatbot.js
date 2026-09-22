/**
 * Win Equipments – AI Technical Sales & Sizing Assistant Widget
 * Integrates with /api_chat.php (Free LLM Inference with Offline Engineering Fallback)
 */

(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.__WIN_AI_INITIALIZED__) return;
  window.__WIN_AI_INITIALIZED__ = true;

  const STORAGE_KEY = 'win_equipments_ai_chat_history';
  const ENDPOINT = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    ? '/api_chat.php'
    : 'api_chat.php';

  let chatHistory = [];
  let isOpen = false;

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }

  function initChatbot() {
    loadStoredHistory();
    createWidgetDOM();
    bindEvents();
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
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory.slice(-10)));
    } catch (e) {}
  }

  function createWidgetDOM() {
    // 1. Launcher Button
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

    // 2. Chat Window
    const windowEl = document.createElement('div');
    windowEl.id = 'winAiWindow';
    windowEl.className = 'win-ai-chat-window';
    windowEl.innerHTML = `
      <div class="win-ai-chat-header">
        <div class="win-ai-chat-title-group">
          <div class="win-ai-avatar"><i class="fas fa-headset"></i></div>
          <div class="win-ai-header-text">
            <h4>Win Technical Support</h4>
            <span><span class="ai-online-pulse"></span> Online • Factory Engineering Desk</span>
          </div>
        </div>
        <button type="button" class="win-ai-chat-close" id="winAiClose" aria-label="Close Chat">&times;</button>
      </div>

      <div class="win-ai-chips-container" id="winAiChips">
        <button type="button" class="win-ai-chip" data-query="How do I size an air dryer for my compressor?"><i class="fas fa-bolt"></i> Size Air Dryer</button>
        <button type="button" class="win-ai-chip" data-query="What chiller tonnage do I need for injection molding / laser cutting?"><i class="fas fa-snowflake"></i> Chiller Sizing</button>
        <button type="button" class="win-ai-chip" data-query="Tell me about your FRP Cooling Towers and TR ratings"><i class="fas fa-industry"></i> Cooling Towers</button>
        <button type="button" class="win-ai-chip" data-query="How can I get an official quotation and price list?"><i class="fas fa-file-invoice"></i> Get Quotation</button>
      </div>

      <div class="win-ai-chat-messages" id="winAiMessages"></div>

      <form class="win-ai-chat-input-bar" id="winAiForm">
        <input type="text" id="winAiInput" placeholder="Ask about sizing, CFM, chillers, pricing..." autocomplete="off" required>
        <button type="submit" class="win-ai-chat-send-btn" id="winAiSend" aria-label="Send message">
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    `;
    document.body.appendChild(windowEl);

    // Render initial messages
    renderMessages();
  }

  function bindEvents() {
    const launcher = document.getElementById('winAiLauncher');
    const closeBtn = document.getElementById('winAiClose');
    const form = document.getElementById('winAiForm');
    const input = document.getElementById('winAiInput');
    const chipsContainer = document.getElementById('winAiChips');

    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendMessage(text);
    });

    chipsContainer.addEventListener('click', function (e) {
      const chip = e.target.closest('.win-ai-chip');
      if (chip) {
        const query = chip.getAttribute('data-query');
        if (query) {
          sendMessage(query);
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
    const input = document.getElementById('winAiInput');
    windowEl.classList.add('is-open');
    isOpen = true;
    setTimeout(() => input.focus(), 200);
    scrollToBottom();
  }

  function closeChat() {
    const windowEl = document.getElementById('winAiWindow');
    windowEl.classList.remove('is-open');
    isOpen = false;
  }

  function renderMessages() {
    const container = document.getElementById('winAiMessages');
    container.innerHTML = '';

    if (chatHistory.length === 0) {
      // Default welcome message
      appendMessageDOM('bot', 
        "Welcome to **Win Equipments**! I am your AI Technical Application Engineer.\n\n" +
        "I can help you calculate air dryer CFM, size process chillers, verify cooling tower TR, or connect you directly with our Arasur works.\n\n" +
        "What equipment are you planning for your plant?"
      );
    } else {
      chatHistory.forEach(msg => {
        appendMessageDOM(msg.role === 'user' ? 'user' : 'bot', msg.content);
      });
    }
    scrollToBottom();
  }

  function appendMessageDOM(sender, text) {
    const container = document.getElementById('winAiMessages');
    const msgEl = document.createElement('div');
    msgEl.className = `win-ai-msg win-ai-msg-${sender}`;
    msgEl.innerHTML = formatMarkdown(text);
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

  function formatMarkdown(text) {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Bullet lists
    escaped = escaped.replace(/(?:^|\n)[-•*]\s+(.*)/g, '<br>• $1');

    // Auto-link WhatsApp URLs
    escaped = escaped.replace(/(https:\/\/wa\.me\/[0-9]+(?:\?[^\s<]+)?)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');

    // Auto-link standard URLs
    escaped = escaped.replace(/(https?:\/\/[^\s<]+)/g, function(url) {
      if (url.includes('wa.me')) return url; // Already linked
      return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
    });

    // Convert newlines to breaks
    escaped = escaped.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

    return escaped;
  }

  function sendMessage(text) {
    appendMessageDOM('user', text);
    chatHistory.push({ role: 'user', content: text });
    saveHistory();

    const sendBtn = document.getElementById('winAiSend');
    const input = document.getElementById('winAiInput');
    sendBtn.disabled = true;
    input.disabled = true;

    showTypingIndicator();

    fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: text,
        history: chatHistory.slice(-6)
      })
    })
      .then(res => res.json())
      .then(data => {
        removeTypingIndicator();
        if (data && data.success && data.reply) {
          appendMessageDOM('bot', data.reply);
          chatHistory.push({ role: 'assistant', content: data.reply });
          saveHistory();
        } else {
          appendMessageDOM('bot', 
            "Thank you for your inquiry! You can reach our senior application engineers directly at **+91 95972 28969** or message us on WhatsApp: https://wa.me/919597228969"
          );
        }
      })
      .catch(err => {
        removeTypingIndicator();
        console.error('AI chat error:', err);
        appendMessageDOM('bot', 
          "Our engineering team is standing by to assist you directly. Please contact us on WhatsApp: https://wa.me/919597228969 or call **+91 95972 28969**."
        );
      })
      .finally(() => {
        sendBtn.disabled = false;
        input.disabled = false;
        input.focus();
      });
  }
})();
