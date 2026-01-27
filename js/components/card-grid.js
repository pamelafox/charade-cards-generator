/**
 * CardGrid Web Component
 * Renders an array of charade-card elements in a grid layout
 *
 * @element card-grid
 */
class CardGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._cards = [];
  }

  /**
   * Set the cards to display
   * @param {Array<{word: string, wordEs?: string, image: string, isEmoji: boolean}>} cards
   */
  set cards(cards) {
    this._cards = cards || [];
    this.render();
  }

  /**
   * Get the current cards
   * @returns {Array<{word: string, wordEs?: string, image: string, isEmoji: boolean}>}
   */
  get cards() {
    return this._cards;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const cardElements = this._cards
      .map((card) => {
        const wordAttr = card.word ? `word="${this.escapeHtml(card.word)}"` : '';
        const wordEsAttr = card.wordEs ? `word-es="${this.escapeHtml(card.wordEs)}"` : '';
        const wordZhAttr = card.wordZh ? `word-zh="${this.escapeHtml(card.wordZh)}"` : '';
        const wordArAttr = card.wordAr ? `word-ar="${this.escapeHtml(card.wordAr)}"` : '';
        return `<charade-card ${wordAttr} ${wordEsAttr} ${wordZhAttr} ${wordArAttr} emoji="${this.escapeHtml(card.image)}"></charade-card>`;
      })
      .join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .grid charade-card {
          aspect-ratio: 1;
          min-height: 150px;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
        }
        
        @media print {
          .grid {
            gap: 0;
            display: grid;
            grid-template-columns: repeat(3, 2.5in);
            grid-auto-rows: 2.5in;
          }
          
          .grid charade-card {
            width: 2.5in;
            height: 2.5in;
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      </style>
      ${
        this._cards.length > 0
          ? `<div class="grid">${cardElements}</div>`
          : `<div class="empty-state">
              <p>Select a theme to display charade cards.</p>
            </div>`
      }
    `;
  }

  /**
   * Escape HTML special characters to prevent XSS
   * @param {string} text
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

customElements.define('card-grid', CardGrid);

export { CardGrid };
