/**
 * Musico AI Chat Assistant — Powered by Gemma 4
 * Handles chat UI, message history, and API communication.
 */

(function () {
  // ── State ─────────────────────────────────────────────────────────────────
  const chatHistory = []; // { role: 'user'|'model', content: string }
  let isOpen = false;
  let isLoading = false;

  // ── DOM Refs ──────────────────────────────────────────────────────────────
  const fab = document.getElementById('ai-chat-fab');
  const chatWindow = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-chat-close');
  const messagesEl = document.getElementById('ai-messages');
  const inputEl = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-chat-send');
  const badge = fab ? fab.querySelector('.ai-badge') : null;

  if (!fab || !chatWindow) return; // Guard if not on a page with AI chat

  // ── Quick Chips ───────────────────────────────────────────────────────────
  const CHIPS = [
    '🎵 Recommend songs',
    '😢 Sad songs',
    '💃 Dance hits',
    '❤️ Romantic vibes',
    '🎤 Arijit Singh picks',
    '🎧 Lo-Fi chill',
    '🙏 Devotional songs',
  ];

  function renderChips() {
    const container = document.querySelector('.ai-quick-chips');
    if (!container) return;
    CHIPS.forEach(chip => {
      const btn = document.createElement('button');
      btn.className = 'ai-chip';
      btn.textContent = chip;
      btn.addEventListener('click', () => {
        if (isLoading) return;
        inputEl.value = chip.replace(/^[^\s]+\s/, ''); // strip emoji prefix
        sendMessage();
      });
      container.appendChild(btn);
    });
  }

  // ── Toggle Chat ───────────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    chatWindow.classList.add('open');
    fab.style.transform = 'rotate(20deg) scale(0.9)';
    if (badge) { badge.classList.remove('visible'); }
    setTimeout(() => inputEl.focus(), 300);

    // Show welcome message on first open
    if (messagesEl.children.length === 0) {
      appendBotMessage("Hey! 👋 I'm **Musico AI**, powered by Gemma 4. Ask me for song recommendations, artist info, or just tell me your mood and I'll find the perfect music for you! 🎵");
    }
  }

  function closeChat() {
    isOpen = false;
    chatWindow.classList.remove('open');
    fab.style.transform = '';
  }

  fab.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !chatWindow.contains(e.target) && !fab.contains(e.target)) {
      closeChat();
    }
  });

  // ── Message Rendering ─────────────────────────────────────────────────────
  function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'ai-message user';
    div.innerHTML = `
      <div class="msg-avatar">👤</div>
      <div class="ai-bubble">${escapeHtml(text)}</div>
    `;
    messagesEl.appendChild(div);
    scrollBottom();
  }

  function appendBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'ai-message bot';
    div.innerHTML = `
      <div class="msg-avatar">🎵</div>
      <div class="ai-bubble">${renderMarkdown(text)}</div>
    `;
    messagesEl.appendChild(div);
    scrollBottom();
    return div;
  }

  function showTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'ai-typing-indicator';
    div.id = 'ai-typing';
    div.innerHTML = `
      <div class="msg-avatar" style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#6c63ff,#1db954);display:flex;align-items:center;justify-content:center;font-size:13px;color:white;">🎵</div>
      <div class="ai-typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    messagesEl.appendChild(div);
    scrollBottom();
    return div;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('ai-typing');
    if (el) el.remove();
  }

  function scrollBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ── Simple markdown → HTML (bold, italic, newlines) ───────────────────────
  function renderMarkdown(text) {
    return escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Send Message ──────────────────────────────────────────────────────────
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    // Reset input
    inputEl.value = '';
    inputEl.style.height = 'auto';

    // Render user bubble
    appendUserMessage(text);

    // Push to history
    chatHistory.push({ role: 'user', content: text });

    // Lock UI
    isLoading = true;
    sendBtn.disabled = true;

    // Typing indicator
    showTypingIndicator();

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: text,
          history: chatHistory.slice(0, -1), // history before this message
        }),
      });

      removeTypingIndicator();

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        appendBotMessage(errData.error || 'Something went wrong. Please try again. 😔');
        return;
      }

      const data = await res.json();
      const reply = data.reply || 'I couldn\'t generate a response. Please try again.';

      appendBotMessage(reply);

      // Push model reply to history
      chatHistory.push({ role: 'model', content: reply });

      // Keep history manageable (last 20 turns)
      if (chatHistory.length > 20) chatHistory.splice(0, 2);

      // Show badge if chat is closed
      if (!isOpen && badge) {
        badge.textContent = '1';
        badge.classList.add('visible');
      }
    } catch (err) {
      removeTypingIndicator();
      appendBotMessage('Network error. Please check your connection and try again. 🔌');
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  // ── Input Events ──────────────────────────────────────────────────────────
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  // Auto-resize textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  });

  // ── Init ──────────────────────────────────────────────────────────────────
  renderChips();
})();
