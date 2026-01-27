# Quickstart: Printable Charade Cards Generator

**Feature**: 001-charade-cards  
**Date**: 2026-01-27

## Prerequisites

- Node.js 18+ (for development tools only; not required for deployment)
- Modern browser (Chrome, Firefox, Safari, or Edge)
- Git

## Setup

```bash
# Clone repository
git clone <repository-url>
cd speckit-project

# No build step required! The app runs directly from source.
```

## Development

### Start Local Server

```bash
# Option 1: Python (usually pre-installed)
python3 -m http.server 8000

# Option 2: Node.js
npx serve .

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Open http://localhost:8000 in your browser.

### File Structure

```
├── index.html              # Entry point
├── css/
│   ├── app.css             # Application styles
│   └── print.css           # Print-specific styles
├── js/
│   ├── app.js              # Main application
│   ├── components/         # Web Components
│   │   ├── theme-selector.js
│   │   ├── card-grid.js
│   │   └── charade-card.js
│   └── services/
│       ├── card-service.js
│       └── print-service.js
├── data/
│   ├── themes.json         # Theme index
│   └── themes/             # Individual theme files
└── tests/
    ├── unit/
    └── e2e/
```

## Running Tests

### Unit Tests

```bash
# Run once
npx vitest run

# Watch mode
npx vitest
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npx playwright test

# Run with UI
npx playwright test --ui
```

## Adding Content

### Add a New Theme

1. Create `data/themes/your-theme.json`:

```json
{
  "id": "your-theme",
  "name": "Your Theme",
  "description": "A description of your theme (10-200 chars)",
  "icon": "🎯",
  "words": [
    { "text": "Word One", "emoji": "🎯", "difficulty": "easy" },
    { "text": "Word Two", "emoji": "🎪", "difficulty": "medium" }
  ]
}
```

2. Add to `data/themes.json`:

```json
{
  "version": "1.1.0",
  "themes": [
    // ... existing themes
    {
      "id": "your-theme",
      "name": "Your Theme",
      "description": "A description of your theme",
      "wordCount": 2,
      "icon": "🎯"
    }
  ]
}
```

3. Validate schema:

```bash
npx ajv validate -s specs/001-charade-cards/contracts/theme-data.schema.json -d data/themes/your-theme.json
```

### Add Wikipedia Images to Words

```json
{
  "text": "Elephant",
  "emoji": "🐘",
  "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/200px-African_Bush_Elephant.jpg",
  "imageLicense": "CC0",
  "difficulty": "easy"
}
```

> ⚠️ Only use images with verified public domain licenses: PD, CC0, PD-old, PD-US

## Deployment

### GitHub Pages

1. Push to `main` branch
2. GitHub Actions automatically deploys (see `.github/workflows/deploy.yml`)
3. Access at `https://<username>.github.io/<repo>/`

### Manual Deployment

The entire project directory can be uploaded to any static hosting:
- No build step required
- All files served as-is
- Ensure `.nojekyll` file exists (prevents Jekyll processing)

## Verification Checklist

After setup, verify the following:

- [ ] `http://localhost:8000` loads the app
- [ ] Theme selector shows 5+ themes
- [ ] Selecting a theme loads words
- [ ] "Generate" button creates card grid
- [ ] Print preview (Ctrl/Cmd+P) shows cards in grid
- [ ] Cards have visible cut guides
- [ ] Unit tests pass: `npx vitest run`
- [ ] E2E tests pass: `npx playwright test`

## Troubleshooting

### "Failed to load themes.json"
- Ensure you're running a local server (not opening `file://` directly)
- Check browser console for CORS errors

### Cards don't print correctly
- Use Chrome for best print CSS support
- Check that `css/print.css` is linked with `media="print"`
- Verify `@page` size matches your paper

### Tests fail to run
- Ensure Node.js 18+ is installed
- Run `npx playwright install` for E2E tests

## Key Commands Reference

| Task | Command |
|------|---------|
| Start server | `python3 -m http.server 8000` |
| Run unit tests | `npx vitest run` |
| Run E2E tests | `npx playwright test` |
| Validate JSON | `npx ajv validate -s <schema> -d <file>` |
| Format code | `npx prettier --write "**/*.{js,css,html}"` |
| Lint code | `npx eslint js/` |
