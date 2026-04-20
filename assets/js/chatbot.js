// Basic website chatbot for quick navigation and support guidance

(function initChatbot() {
  function createMessage(text) {
    const div = document.createElement('div');
    div.className = 'chatbot-message bot';
    div.innerHTML = text;
    return div;
  }

  function scrollToBottom(body) {
    body.scrollTop = body.scrollHeight;
  }

  function buildReply(action) {
    const replies = {
      products: 'You can browse our full catalog on the <a href="products.html">Products page</a>. If you share your use case, we can guide you to the best category.',
      quote: 'Great choice. Please use the <a href="quote.html">Quote form</a> and include quantities and timelines so our team can respond faster.',
      contact: 'You can reach AlphaGrid at <a href="mailto:sales@alphagrid.co.za">sales@alphagrid.co.za</a> or call <a href="tel:+27650529081">+27 65 052 9081</a>.',
      partners: 'AlphaGrid works with trusted partners including Narada, Huber+Suhner, and Emtelle to deliver proven solutions.'
    };

    return replies[action] || 'Thanks for your message. You can also use the Contact page for direct support.';
  }

  const container = document.createElement('div');
  container.innerHTML = `
    <button class="chatbot-trigger" id="chatbot-trigger" aria-label="Open chatbot">💬</button>

    <section class="chatbot-panel" id="chatbot-panel" aria-live="polite" aria-label="AlphaGrid Assistant">
      <div class="chatbot-header">
        <div class="chatbot-title">AlphaGrid Assistant</div>
        <div class="chatbot-subtitle">Quick help for products and quotes</div>
      </div>
      <div class="chatbot-body" id="chatbot-body"></div>
      <div class="chatbot-quick-actions">
        <button class="chatbot-chip" data-action="products">Find products</button>
        <button class="chatbot-chip" data-action="quote">Request quote</button>
        <button class="chatbot-chip" data-action="contact">Contact team</button>
        <button class="chatbot-chip" data-action="partners">Our partners</button>
      </div>
      <div class="chatbot-footer">Mon-Fri support | Typical response within 24 hours</div>
    </section>
  `;

  document.body.appendChild(container);

  const trigger = document.getElementById('chatbot-trigger');
  const panel = document.getElementById('chatbot-panel');
  const body = document.getElementById('chatbot-body');

  body.appendChild(createMessage('Hi, welcome to AlphaGrid. How can I help you today?'));
  body.appendChild(createMessage('Use the quick options below for product discovery, quotes, or direct contact.'));

  trigger.addEventListener('click', () => {
    panel.classList.toggle('active');
  });

  panel.querySelectorAll('.chatbot-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const action = chip.dataset.action;
      body.appendChild(createMessage(buildReply(action)));
      scrollToBottom(body);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      panel.classList.remove('active');
    }
  });

  document.addEventListener('click', (event) => {
    const clickedInsidePanel = panel.contains(event.target);
    const clickedTrigger = trigger.contains(event.target);
    if (!clickedInsidePanel && !clickedTrigger) {
      panel.classList.remove('active');
    }
  });
})();
