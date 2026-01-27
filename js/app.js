/**
 * Main application entry point
 * @module app
 */

import { loadThemes, loadThemeData, generateCards } from './services/card-service.js';
import { triggerPrint } from './services/print-service.js';

/** @type {import('./services/card-service.js').ThemeData|null} */
let currentThemeData = null;

/**
 * Get DOM elements
 */
function getElements() {
  return {
    themeContainer: document.getElementById('theme-container'),
    printBtn: document.getElementById('print-btn'),
    cardGrid: document.getElementById('card-grid'),
    loadingSpinner: document.getElementById('loading-spinner'),
    langEn: document.getElementById('lang-en'),
    langEs: document.getElementById('lang-es'),
    diffEasy: document.getElementById('diff-easy'),
    diffMedium: document.getElementById('diff-medium'),
    diffHard: document.getElementById('diff-hard'),
  };
}

/**
 * Get currently selected languages
 * @returns {string[]}
 */
function getSelectedLanguages() {
  const { langEn, langEs } = getElements();
  const languages = [];
  if (langEn?.checked) languages.push('en');
  if (langEs?.checked) languages.push('es');
  return languages.length > 0 ? languages : ['en']; // Default to English if none selected
}

/**
 * Get currently selected difficulties
 * @returns {string[]}
 */
function getSelectedDifficulties() {
  const { diffEasy, diffMedium, diffHard } = getElements();
  const difficulties = [];
  if (diffEasy?.checked) difficulties.push('easy');
  if (diffMedium?.checked) difficulties.push('medium');
  if (diffHard?.checked) difficulties.push('hard');
  return difficulties.length > 0 ? difficulties : ['easy', 'medium', 'hard']; // Default to all if none selected
}

/**
 * Show/hide loading spinner
 * @param {boolean} show
 */
function setLoading(show) {
  const { loadingSpinner } = getElements();
  if (show) {
    loadingSpinner?.classList.remove('d-none');
  } else {
    loadingSpinner?.classList.add('d-none');
  }
}

/**
 * Display cards with current theme and language settings
 */
function displayCards() {
  const { cardGrid, printBtn } = getElements();

  if (!currentThemeData) return;

  const cards = generateCards(currentThemeData, {
    cardCount: currentThemeData.words.length,
    shuffle: false,
    languages: getSelectedLanguages(),
    difficulties: getSelectedDifficulties(),
  });

  if (cardGrid) {
    cardGrid.cards = cards;
  }

  if (cards.length > 0) {
    printBtn?.removeAttribute('disabled');
  }
}

/**
 * Handle theme selection - load and display all cards immediately
 * @param {CustomEvent} event
 */
async function handleThemeSelected(event) {
  const { themeId } = event.detail;

  setLoading(true);

  try {
    currentThemeData = await loadThemeData(themeId);

    if (!currentThemeData) {
      console.error('Theme data not available');
      return;
    }

    displayCards();
  } catch (error) {
    console.error('Failed to load theme data:', error);
  } finally {
    setLoading(false);
  }
}

/**
 * Handle filter checkbox change (language or difficulty)
 */
function handleFilterChange() {
  if (currentThemeData) {
    displayCards();
  }
}

/**
 * Handle print button click
 */
function handlePrint() {
  triggerPrint();
}

/**
 * Initialize the application
 */
async function init() {
  const { themeContainer, printBtn, langEn, langEs, diffEasy, diffMedium, diffHard } = getElements();

  // Load themes
  try {
    const themes = await loadThemes();

    // Create and insert theme selector
    const themeSelector = document.createElement('theme-selector');
    themeSelector.themes = themes;
    themeContainer?.appendChild(themeSelector);

    // Listen for theme selection
    themeSelector.addEventListener('theme-selected', handleThemeSelected);

    // Auto-select first theme
    if (themes.length > 0) {
      themeSelector.selectTheme(themes[0].id);
    }
  } catch (error) {
    console.error('Failed to load themes:', error);
    if (themeContainer) {
      themeContainer.innerHTML =
        '<div class="alert alert-danger">Failed to load themes. Please refresh the page.</div>';
    }
  }

  // Set up filter checkbox handlers
  langEn?.addEventListener('change', handleFilterChange);
  langEs?.addEventListener('change', handleFilterChange);
  diffEasy?.addEventListener('change', handleFilterChange);
  diffMedium?.addEventListener('change', handleFilterChange);
  diffHard?.addEventListener('change', handleFilterChange);

  // Set up button handlers
  printBtn?.addEventListener('click', handlePrint);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
