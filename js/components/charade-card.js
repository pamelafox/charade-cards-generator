/**
 * CharadeCard Web Component
 * Displays a single charade card with word(s) and emoji
 *
 * @element charade-card
 * @attr {string} word - The primary word to display
 * @attr {string} word-es - The Spanish translation (optional)
 * @attr {string} emoji - The emoji to display
 */
class CharadeCard extends HTMLElement {
  static get observedAttributes() {
    return ['word', 'word-es', 'emoji'];
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
    const emoji = this.getAttribute('emoji') || '';

    // Build word display based on available languages
    const words = [];
    if (word) words.push(word);
    if (wordEs) words.push(wordEs);
    
    const wordDisplay = words.join(' / ');
    const hasMultiple = words.length > 1;

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
        }
        
        .emoji {
          font-size: 3rem;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        
        .word {
          font-size: ${hasMultiple ? '1rem' : '1.25rem'};
          font-weight: 600;
          text-align: center;
          word-wrap: break-word;
          max-width: 100%;
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
        <span class="word">${wordDisplay}</span>
      </div>
    `;
  }
}

customElements.define('charade-card', CharadeCard);

export { CharadeCard };
