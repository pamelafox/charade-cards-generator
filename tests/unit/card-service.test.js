import { describe, it, expect } from 'vitest';
import { generateCards } from '../../js/services/card-service.js';

describe('generateCards', () => {
  const mockThemeData = {
    id: 'test-theme',
    name: 'Test Theme',
    description: 'A test theme',
    icon: '🧪',
    words: [
      { text: 'Word1', emoji: '1️⃣', difficulty: 'easy' },
      { text: 'Word2', emoji: '2️⃣', difficulty: 'easy' },
      { text: 'Word3', emoji: '3️⃣', difficulty: 'medium' },
      { text: 'Word4', emoji: '4️⃣', difficulty: 'medium' },
      { text: 'Word5', emoji: '5️⃣', difficulty: 'hard' },
      { text: 'Word6', emoji: '6️⃣', difficulty: 'hard' },
      { text: 'Word7', emoji: '7️⃣', difficulty: 'easy' },
      { text: 'Word8', emoji: '8️⃣', difficulty: 'easy' },
      { text: 'Word9', emoji: '9️⃣', difficulty: 'medium' },
      { text: 'Word10', emoji: '🔟', difficulty: 'medium' },
      { text: 'Word11', emoji: '⬆️', difficulty: 'hard' },
      { text: 'Word12', emoji: '⬇️', difficulty: 'hard' },
    ],
  };

  describe('cardCount', () => {
    it('returns 12 cards by default', () => {
      const cards = generateCards(mockThemeData, { shuffle: false });
      expect(cards).toHaveLength(12);
    });

    it('returns requested number of cards', () => {
      const cards = generateCards(mockThemeData, { cardCount: 6, shuffle: false });
      expect(cards).toHaveLength(6);
    });

    it('returns available cards when theme has fewer than requested', () => {
      const smallTheme = {
        ...mockThemeData,
        words: mockThemeData.words.slice(0, 5),
      };
      const cards = generateCards(smallTheme, { cardCount: 12, shuffle: false });
      expect(cards).toHaveLength(5);
    });

    it('returns empty array for null themeData', () => {
      const cards = generateCards(null);
      expect(cards).toEqual([]);
    });

    it('returns empty array for theme with no words', () => {
      const emptyTheme = { ...mockThemeData, words: [] };
      const cards = generateCards(emptyTheme);
      expect(cards).toEqual([]);
    });
  });

  describe('shuffle', () => {
    it('shuffles cards by default', () => {
      // Run multiple times to ensure shuffle is happening
      const results = new Set();
      for (let i = 0; i < 10; i++) {
        const cards = generateCards(mockThemeData);
        results.add(cards.map((c) => c.word).join(','));
      }
      // With 12 cards, we should get different orderings
      expect(results.size).toBeGreaterThan(1);
    });

    it('does not shuffle when shuffle=false', () => {
      const cards1 = generateCards(mockThemeData, { shuffle: false });
      const cards2 = generateCards(mockThemeData, { shuffle: false });
      expect(cards1.map((c) => c.word)).toEqual(cards2.map((c) => c.word));
    });

    it('preserves first N words when not shuffling', () => {
      const cards = generateCards(mockThemeData, { cardCount: 3, shuffle: false });
      expect(cards[0].word).toBe('Word1');
      expect(cards[1].word).toBe('Word2');
      expect(cards[2].word).toBe('Word3');
    });
  });

  describe('card format', () => {
    it('transforms words to GeneratedCard format', () => {
      const cards = generateCards(mockThemeData, { cardCount: 1, shuffle: false });
      expect(cards[0]).toEqual({
        word: 'Word1',
        image: '1️⃣',
        isEmoji: true,
      });
    });

    it('sets isEmoji to true for all cards', () => {
      const cards = generateCards(mockThemeData, { shuffle: false });
      cards.forEach((card) => {
        expect(card.isEmoji).toBe(true);
      });
    });
  });
});
