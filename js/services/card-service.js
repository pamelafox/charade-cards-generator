/**
 * Card Service - handles theme loading and card generation
 * @module card-service
 */

/**
 * @typedef {Object} ThemeSummary
 * @property {string} id - Theme identifier
 * @property {string} name - Display name
 * @property {string} description - Theme description
 * @property {number} wordCount - Number of words in theme
 * @property {string} icon - Emoji icon
 */

/**
 * @typedef {Object} Word
 * @property {string} text - Word to act out (English)
 * @property {string} [es] - Spanish translation
 * @property {string} emoji - Emoji representation
 * @property {string} [difficulty] - easy|medium|hard
 */

/**
 * @typedef {Object} ThemeData
 * @property {string} id - Theme identifier
 * @property {string} name - Display name
 * @property {string} description - Theme description
 * @property {string} icon - Emoji icon
 * @property {Word[]} words - Array of words
 */

/**
 * @typedef {Object} GeneratedCard
 * @property {string} [word] - English word text
 * @property {string} [wordEs] - Spanish word text
 * @property {string} image - Emoji or image URL
 * @property {boolean} isEmoji - True if image is emoji
 */

/**
 * Load all available themes from the index
 * @returns {Promise<ThemeSummary[]>}
 */
export async function loadThemes() {
  const response = await fetch('data/themes.json');
  if (!response.ok) {
    throw new Error(`Failed to load themes: ${response.statusText}`);
  }
  const data = await response.json();
  return data.themes;
}

/**
 * Load complete theme data by ID
 * @param {string} themeId - Theme identifier
 * @returns {Promise<ThemeData|null>}
 */
export async function loadThemeData(themeId) {
  const response = await fetch(`data/themes/${themeId}.json`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to load theme ${themeId}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {any[]} array - Array to shuffle
 * @returns {any[]} - Shuffled copy of the array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate cards from theme data
 * @param {ThemeData} themeData - Theme data object
 * @param {Object} [options] - Generation options
 * @param {number} [options.cardCount=12] - Number of cards to generate
 * @param {boolean} [options.shuffle=true] - Whether to shuffle cards
 * @param {string[]} [options.languages=['en']] - Languages to include ('en', 'es')
 * @param {string[]} [options.difficulties=['easy','medium','hard']] - Difficulties to include
 * @returns {GeneratedCard[]}
 */
export function generateCards(themeData, options = {}) {
  const { cardCount = 12, shuffle = true, languages = ['en'], difficulties = ['easy', 'medium', 'hard'] } = options;

  if (!themeData || !themeData.words || themeData.words.length === 0) {
    return [];
  }

  // Filter by difficulty first
  let words = themeData.words.filter((word) => 
    !word.difficulty || difficulties.includes(word.difficulty)
  );

  // Optionally shuffle
  if (shuffle) {
    words = shuffleArray(words);
  }

  // Limit to requested card count (or available words if fewer)
  const availableCount = Math.min(cardCount, words.length);
  words = words.slice(0, availableCount);

  // Transform to GeneratedCard format with language support
  return words.map((word) => {
    const card = {
      image: word.emoji,
      isEmoji: true,
    };
    
    // Include English if selected
    if (languages.includes('en')) {
      card.word = word.text;
    }
    
    // Include Spanish if selected and available
    if (languages.includes('es') && word.es) {
      card.wordEs = word.es;
    }
    
    return card;
  });
}
