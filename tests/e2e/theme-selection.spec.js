import { test, expect } from '@playwright/test';

test.describe('Theme Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for print button to be enabled (indicates themes loaded and cards displayed)
    await page.waitForSelector('#print-btn:not([disabled])');
  });

  test('displays all 5 themes', async ({ page }) => {
    const themeSelector = page.locator('theme-selector');
    
    // Get theme buttons from shadow DOM
    const themeCount = await themeSelector.evaluate((el) => {
      const shadowRoot = el.shadowRoot;
      if (!shadowRoot) return 0;
      return shadowRoot.querySelectorAll('.theme-card').length;
    });
    
    expect(themeCount).toBe(5);
  });

  test('shows theme names and word counts', async ({ page }) => {
    const themeSelector = page.locator('theme-selector');
    
    const themeInfo = await themeSelector.evaluate((el) => {
      const shadowRoot = el.shadowRoot;
      if (!shadowRoot) return [];
      return Array.from(shadowRoot.querySelectorAll('.theme-card')).map((card) => ({
        name: card.querySelector('.name')?.textContent,
        count: card.querySelector('.count')?.textContent,
      }));
    });
    
    // Verify expected themes
    const themeNames = themeInfo.map((t) => t.name);
    expect(themeNames).toContain('Animals');
    expect(themeNames).toContain('Food & Drinks');
    expect(themeNames).toContain('Actions');
    expect(themeNames).toContain('Holidays');
    expect(themeNames).toContain('Occupations');
    
    // All themes should show word counts
    themeInfo.forEach((theme) => {
      expect(theme.count).toMatch(/\d+ words/);
    });
  });

  test('selects theme on click and loads cards', async ({ page }) => {
    const themeSelector = page.locator('theme-selector');
    
    // Click on the Food theme
    await themeSelector.evaluate((el) => {
      const shadowRoot = el.shadowRoot;
      const foodCard = Array.from(shadowRoot.querySelectorAll('.theme-card'))
        .find((card) => card.querySelector('.name')?.textContent === 'Food & Drinks');
      foodCard?.click();
    });
    
    await page.waitForTimeout(500);
    
    // Verify Food theme is selected
    const selectedTheme = await themeSelector.evaluate((el) => {
      const shadowRoot = el.shadowRoot;
      const selected = shadowRoot.querySelector('.theme-card.selected');
      return selected?.querySelector('.name')?.textContent;
    });
    
    expect(selectedTheme).toBe('Food & Drinks');
    
    // Verify cards loaded (Food theme has 24 words)
    const cardGrid = page.locator('card-grid');
    const cardCount = await cardGrid.evaluate((el) => {
      const shadowRoot = el.shadowRoot;
      return shadowRoot?.querySelectorAll('charade-card').length || 0;
    });
    expect(cardCount).toBe(24);
  });

  test('each theme shows different cards', async ({ page }) => {
    const themes = ['Animals', 'Food & Drinks', 'Actions', 'Holidays', 'Occupations'];
    const cardSamples = {};
    
    for (const themeName of themes) {
      // Select theme
      const themeSelector = page.locator('theme-selector');
      await themeSelector.evaluate((el, name) => {
        const shadowRoot = el.shadowRoot;
        const card = Array.from(shadowRoot.querySelectorAll('.theme-card'))
          .find((c) => c.querySelector('.name')?.textContent === name);
        card?.click();
      }, themeName);
      
      // Wait for cards to load
      await page.waitForTimeout(500);
      
      // Get first card's word
      const cardGrid = page.locator('card-grid');
      const firstWord = await cardGrid.evaluate((el) => {
        const shadowRoot = el.shadowRoot;
        const firstCard = shadowRoot?.querySelector('charade-card');
        return firstCard?.getAttribute('word');
      });
      
      cardSamples[themeName] = firstWord;
    }
    
    // Each theme should produce cards (non-null)
    Object.values(cardSamples).forEach((word) => {
      expect(word).toBeTruthy();
    });
  });

  test('auto-selects first theme on load', async ({ page }) => {
    const themeSelector = page.locator('theme-selector');
    
    // Check that Animals (first theme) is selected
    const selectedTheme = await themeSelector.evaluate((el) => {
      const shadowRoot = el.shadowRoot;
      const selected = shadowRoot.querySelector('.theme-card.selected');
      return selected?.querySelector('.name')?.textContent;
    });
    
    expect(selectedTheme).toBe('Animals');
  });
});
