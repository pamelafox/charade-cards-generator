/**
 * ThemeSelector Web Component
 * Displays themes as Bootstrap-style cards with selection
 *
 * @element theme-selector
 * @fires theme-selected - When a theme is selected
 */
class ThemeSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._themes = [];
    this._selectedThemeId = null;
  }

  /**
   * Set available themes
   * @param {Array<{id: string, name: string, description: string, wordCount: number, icon: string}>} themes
   */
  set themes(themes) {
    this._themes = themes || [];
    this.render();
  }

  get themes() {
    return this._themes;
  }

  get selectedThemeId() {
    return this._selectedThemeId;
  }

  connectedCallback() {
    this.render();
    this.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event
   */
  handleKeydown(event) {
    if (!this._themes.length) return;

    const currentIndex = this._themes.findIndex((t) => t.id === this._selectedThemeId);
    let newIndex = currentIndex;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      newIndex = (currentIndex + 1) % this._themes.length;
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      newIndex = (currentIndex - 1 + this._themes.length) % this._themes.length;
      event.preventDefault();
    }

    if (newIndex !== currentIndex) {
      this.selectTheme(this._themes[newIndex].id);
      this.shadowRoot.querySelector(`[data-theme-id="${this._themes[newIndex].id}"]`)?.focus();
    }
  }

  render() {
    const themeCards = this._themes
      .map(
        (theme) => `
        <button 
          class="theme-card ${theme.id === this._selectedThemeId ? 'selected' : ''}"
          data-theme-id="${theme.id}"
          type="button"
          aria-pressed="${theme.id === this._selectedThemeId}"
          aria-label="${theme.name}: ${theme.description}"
        >
          <span class="icon">${theme.icon}</span>
          <div class="content">
            <span class="name">${theme.name}</span>
            <span class="description">${theme.description}</span>
            <span class="count">${theme.wordCount} words</span>
          </div>
        </button>
      `
      )
      .join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .theme-card {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid #dee2e6;
          border-radius: 0.5rem;
          background: white;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          width: 100%;
        }
        
        .theme-card:hover {
          border-color: #0d6efd;
          background: #f8f9fa;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .theme-card:focus {
          outline: 2px solid #0d6efd;
          outline-offset: 2px;
        }
        
        .theme-card.selected {
          border-color: #0d6efd;
          background: #e7f1ff;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
        }
        
        .icon {
          font-size: 2rem;
          line-height: 1;
          flex-shrink: 0;
        }
        
        .content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }
        
        .name {
          font-weight: 600;
          font-size: 1rem;
        }
        
        .description {
          color: #6c757d;
          font-size: 0.875rem;
          line-height: 1.3;
        }
        
        .count {
          color: #0d6efd;
          font-size: 0.75rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }
        
        .empty-state {
          color: #6c757d;
          padding: 1rem;
          text-align: center;
        }
      </style>
      ${
        this._themes.length > 0
          ? `<div class="theme-grid" role="listbox" aria-label="Select a theme">${themeCards}</div>`
          : `<div class="empty-state">Loading themes...</div>`
      }
    `;

    // Add click handlers
    this.shadowRoot.querySelectorAll('.theme-card').forEach((card) => {
      card.addEventListener('click', () => this.selectTheme(card.dataset.themeId));
    });
  }

  /**
   * Select a theme and dispatch event
   * @param {string} themeId
   */
  selectTheme(themeId) {
    this._selectedThemeId = themeId;
    this.render();

    this.dispatchEvent(
      new CustomEvent('theme-selected', {
        detail: { themeId },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('theme-selector', ThemeSelector);

export { ThemeSelector };
