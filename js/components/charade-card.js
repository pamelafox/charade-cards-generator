/**
 * CharadeCard Web Component
 * Displays a single charade card with word(s) and emoji
 *
 * @element charade-card
 * @attr {string} word - The primary word to display
 * @attr {string} word-es - The Spanish translation (optional)
 * @attr {string} word-zh - The Chinese translation (optional)
 * @attr {string} word-ar - The Arabic translation (optional)
 * @attr {string} emoji - The emoji to display
 */
class CharadeCard extends HTMLElement {
  static get observedAttributes() {
    return ['word', 'word-es', 'word-zh', 'word-ar', 'emoji'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const word = this.getAttribute('word') || '';
    const wordEs = this.getAttribute('word-es') || '';
    const wordZh = this.getAttribute('word-zh') || '';
    const wordAr = this.getAttribute('word-ar') || '';
    const emoji = this.getAttribute('emoji') || '';

    const wordCount = [word, wordEs, wordZh, wordAr].filter(Boolean).length;
    const hasMultiple = wordCount > 1;
    
    // Calculate font size based on longest word length and word count
    const maxLen = Math.max(word.length, wordEs.length, wordZh.length * 2, wordAr.length);
    let fontSize;
    if (wordCount >= 3) {
      // 3+ languages - smaller
      if (maxLen <= 6) fontSize = '1.3rem';
      else if (maxLen <= 10) fontSize = '1.1rem';
      else fontSize = '0.95rem';
    } else if (hasMultiple) {
      // Dual language - scale based on length
      if (maxLen <= 6) fontSize = '1.8rem';
      else if (maxLen <= 10) fontSize = '1.5rem';
      else if (maxLen <= 14) fontSize = '1.25rem';
      else fontSize = '1.05rem';
    } else {
      // Single language - can be larger
      if (maxLen <= 6) fontSize = '2rem';
      else if (maxLen <= 10) fontSize = '1.6rem';
      else if (maxLen <= 14) fontSize = '1.3rem';
      else fontSize = '1.1rem';
    }

    // Build word HTML - separate lines for multiple languages
    let wordHtml = '';
    if (word) {
      wordHtml += `<span class="word-line">${word}</span>`;
    }
    if (wordEs) {
      wordHtml += `<span class="word-line secondary">${wordEs}</span>`;
    }
    if (wordZh) {
      wordHtml += `<span class="word-line chinese">${wordZh}</span>`;
    }
    if (wordAr) {
      wordHtml += `<span class="word-line arabic">${wordAr}</span>`;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .card {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px dashed #ccc;
          box-sizing: border-box;
          padding: 0.5rem;
          overflow: hidden;
        }
        
        .emoji {
          font-size: 4.5rem;
          line-height: 1;
          margin-bottom: 0.2rem;
        }
        
        .words {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: ${hasMultiple ? '0.1rem' : '0'};
          max-width: 100%;
        }
        
        .word-line {
          font-family: 'Nunito', sans-serif;
          font-size: ${fontSize};
          font-weight: 800;
          text-align: center;
          word-wrap: break-word;
          max-width: 100%;
          line-height: 1.15;
        }
        
        .word-line.secondary {
          font-family: 'Lora', serif;
          font-style: italic;
          font-weight: 500;
          margin-top: 0.4em;
        }
        
        .word-line.chinese {
          font-family: 'Noto Sans SC', sans-serif;
          font-weight: 700;
          margin-top: 0.4em;
        }
        
        .word-line.arabic {
          font-family: 'Noto Sans Arabic', sans-serif;
          font-weight: 700;
          direction: rtl;
          margin-top: 0.4em;
        }
        
        @media print {
          :host {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .card {
            border: 1px dashed #999;
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      </style>
      <div class="card">
        <span class="emoji">${emoji}</span>
        <div class="words">${wordHtml}</div>
      </div>
    `;
  }
}

customElements.define('charade-card', CharadeCard);

export { CharadeCard };
