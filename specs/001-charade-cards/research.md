# Research: Printable Charade Cards Generator

**Feature**: 001-charade-cards  
**Date**: 2026-01-27

## 1. Web Components for Vanilla JavaScript

### Decision
Use native Web Components (Custom Elements + Shadow DOM) for encapsulated, reusable UI components.

### Rationale
- Native browser support (Chrome, Firefox, Safari, Edge) eliminates build dependencies
- Shadow DOM provides CSS encapsulation without BEM/naming conventions
- `<template>` elements enable declarative markup without string concatenation
- Custom Elements integrate naturally with Bootstrap via `class` attributes in light DOM

### Alternatives Considered
- **Lit**: Adds build complexity; project constraint forbids build systems
- **Alpine.js**: Lighter but less encapsulation; mixing concerns in HTML attributes
- **Plain DOM manipulation**: Works but leads to scattered, harder-to-test code

### Implementation Pattern
```javascript
// js/components/charade-card.js
class CharadeCard extends HTMLElement {
  static get observedAttributes() { return ['word', 'emoji', 'image-url']; }
  
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
    const emoji = this.getAttribute('emoji') || '';
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card { /* print-friendly styles */ }
      </style>
      <div class="card">
        <span class="emoji">${emoji}</span>
        <span class="word">${word}</span>
      </div>
    `;
  }
}
customElements.define('charade-card', CharadeCard);
```

---

## 2. Print CSS for Card Grids

### Decision
Use CSS Grid with `@media print` rules and explicit page-break controls for uniform card cutting.

### Rationale
- CSS Grid provides precise control over card dimensions and gaps
- `@page` rules control margins for Letter/A4 paper
- `break-inside: avoid` prevents cards from splitting across pages
- Fixed dimensions (inches/cm) ensure consistent physical size when printed

### Alternatives Considered
- **Flexbox**: Less precise for fixed-dimension grids; wrapping behavior harder to control
- **Table layout**: Semantic mismatch; print behavior less predictable
- **JavaScript-based PDF generation**: Adds complexity; browser print is sufficient

### Implementation Pattern
```css
/* css/print.css */
@media print {
  @page {
    size: letter;
    margin: 0.5in;
  }
  
  .card-grid {
    display: grid;
    grid-template-columns: repeat(3, 2.5in);
    grid-template-rows: repeat(4, 2.5in);
    gap: 0;
  }
  
  .charade-card {
    width: 2.5in;
    height: 2.5in;
    border: 1px dashed #999; /* Cut guide */
    break-inside: avoid;
    page-break-inside: avoid;
  }
  
  /* Hide non-printable elements */
  .no-print, nav, .theme-selector { display: none !important; }
}
```

### Card Size Calculations
- **Letter (8.5" × 11")**: 0.5" margins → 7.5" × 10" printable
- **3×4 grid**: 2.5" × 2.5" cards (12 cards per page)
- **2×3 grid**: 3.5" × 3.33" cards (6 cards per page, larger text)

---

## 3. Wikipedia Commons API for Public Domain Images

### Decision
Use Wikimedia Commons API to fetch images marked as public domain (CC0, PD-old, etc.). Pre-compute image URLs at build time to avoid runtime API calls.

### Rationale
- Static JSON eliminates runtime API dependencies
- Pre-verification ensures all images are truly public domain
- Thumbnail URLs work offline once cached
- Avoids CORS and rate-limiting issues at runtime

### Alternatives Considered
- **Runtime API calls**: Slower, CORS issues, rate limits, licensing verification at runtime
- **Self-hosted images**: Copyright liability; storage costs for GitHub Pages
- **Emoji only**: Simpler but less visual variety (already supported as P1)

### Pre-computation Approach
```javascript
// scripts/fetch-wikipedia-images.js (run during content curation)
// NOT part of the deployed app
async function fetchImageUrl(searchTerm) {
  const params = new URLSearchParams({
    action: 'query',
    titles: searchTerm,
    prop: 'pageimages',
    format: 'json',
    pithumbsize: 200,
    origin: '*'
  });
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`);
  const data = await response.json();
  // Extract thumbnail URL, verify license, store in JSON
}
```

### Licensing Verification
Only include images with these licenses:
- Public Domain (PD-old, PD-US, PD-self)
- CC0 (Creative Commons Zero)
- Document license in each theme JSON file

---

## 4. Bootstrap 5 Integration (CDN, No Build)

### Decision
Include Bootstrap 5 via CDN; use Bootstrap classes in light DOM; keep Shadow DOM styles minimal.

### Rationale
- CDN provides caching benefits across sites
- No build step required
- Bootstrap grid handles responsive preview layout
- Print styles override Bootstrap for paper output

### Alternatives Considered
- **Tailwind CSS**: Requires build step for purging
- **Custom CSS only**: More work; less consistent
- **Bootstrap npm package**: Requires bundler

### Implementation Pattern
```html
<!-- index.html -->
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" crossorigin="anonymous">
  <link href="css/app.css" rel="stylesheet">
  <link href="css/print.css" rel="stylesheet" media="print">
</head>
```

### Bootstrap + Web Components
- Use Bootstrap classes on custom element's light DOM children
- Shadow DOM contains only component-specific styles
- `::slotted()` selector for styling slotted Bootstrap content

---

## 5. Testing Without Build System

### Decision
Use Vitest for unit tests (runs ES modules natively) and Playwright for E2E tests.

### Rationale
- Vitest supports ES modules without bundling
- Playwright tests actual browser behavior, including print preview
- Both work with `npx` without global installation
- GitHub Actions integration straightforward

### Alternatives Considered
- **Jest**: Requires transformation for ES modules
- **Mocha**: More setup for module support
- **Cypress**: Heavier; print testing limited

### Implementation Pattern
```javascript
// tests/unit/card-service.test.js
import { describe, it, expect } from 'vitest';
import { generateCards } from '../../js/services/card-service.js';

describe('generateCards', () => {
  it('returns requested number of cards', () => {
    const cards = generateCards('animals', 6);
    expect(cards).toHaveLength(6);
  });
  
  it('shuffles cards by default', () => {
    const cards1 = generateCards('animals', 12);
    const cards2 = generateCards('animals', 12);
    expect(cards1).not.toEqual(cards2);
  });
});
```

### E2E Print Testing
```javascript
// tests/e2e/print-flow.spec.js
import { test, expect } from '@playwright/test';

test('print layout shows 12 cards in grid', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-theme="animals"]');
  await page.click('#generate-btn');
  
  // Emulate print media
  await page.emulateMedia({ media: 'print' });
  
  const cards = await page.locator('charade-card').count();
  expect(cards).toBe(12);
});
```

---

## 6. GitHub Pages Deployment

### Decision
Deploy to GitHub Pages using GitHub Actions; no Jekyll processing needed.

### Rationale
- Free hosting for static sites
- Automatic HTTPS
- GitHub Actions provides CI/CD pipeline
- `.nojekyll` file disables Jekyll processing

### Configuration
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npx vitest run && npx playwright test
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## Summary of Decisions

| Topic | Decision | Key Benefit |
|-------|----------|-------------|
| UI Components | Native Web Components | No build, encapsulated |
| Print Layout | CSS Grid + @media print | Precise card dimensions |
| Images | Pre-computed Wikipedia URLs | Offline-capable, verified licenses |
| CSS Framework | Bootstrap 5 CDN | No build, cached globally |
| Unit Testing | Vitest | ES module support native |
| E2E Testing | Playwright | Print media emulation |
| Deployment | GitHub Pages + Actions | Free, automated CI/CD |
