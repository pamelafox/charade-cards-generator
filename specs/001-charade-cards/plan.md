# Implementation Plan: Printable Charade Cards Generator

**Branch**: `001-charade-cards` | **Date**: 2026-01-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-charade-cards/spec.md`

## Summary

Static web app that generates printable charade cards from pre-computed JSON data. Users select a theme, configure card count, and print a grid of cards with words and emoji/Wikipedia images. Built with vanilla HTML, Web Components, and Bootstrap CSS; deployed to GitHub Pages.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2022 (no transpilation)  
**Primary Dependencies**: Bootstrap 5.x (CDN), Web Components API (native)  
**Storage**: Static JSON files (pre-computed card data, no backend)  
**Testing**: Playwright for E2E; Vitest for unit tests (no build step required)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)  
**Project Type**: Single static web app  
**Performance Goals**: FCP < 1.5s, interactive < 3s, print render < 500ms  
**Constraints**: No build system, no backend, GitHub Pages hosting  
**Scale/Scope**: 5+ themes, 50+ total words, single-page app

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality
- [x] **Linting**: ESLint configured for vanilla JS; Prettier for formatting
- [x] **Readability**: Web Components enforce single responsibility; clear naming conventions
- [x] **Type Safety**: JSDoc type annotations for all public functions (no TypeScript build step)
- [x] **No Dead Code**: Enforced via ESLint rules
- [x] **Complexity**: Print layout logic may approach limit; will document if exceeded

### II. Testing Standards
- [x] **Coverage**: Unit tests for card generation logic; E2E for print flow
- [x] **Test Types**: Unit (Vitest), E2E (Playwright)
- [x] **Test Independence**: Each test operates on isolated card data
- [ ] **80% Coverage**: Target achievable; print-specific code harder to unit test

### III. User Experience Consistency
- [x] **Design System**: Bootstrap 5 provides consistent components
- [x] **Error Handling**: Graceful fallback for failed image loads; clear empty states
- [x] **Loading States**: Spinner for theme loading; skeleton for card preview
- [x] **Accessibility**: Semantic HTML, keyboard nav, ARIA labels on interactive elements
- [x] **Responsive**: Bootstrap grid; print-specific media queries for paper sizes

### IV. Performance Requirements
- [x] **Response Time**: Static files + CDN; FCP target achievable
- [x] **Resource Limits**: Minimal JS bundle; lazy-load Wikipedia images
- [x] **Caching**: Bootstrap from CDN cache; browser caching for static assets
- [x] **Measurement**: Lighthouse CI in GitHub Actions

**Constitution Status**: ✅ PASS (no violations requiring justification)

## Project Structure

### Documentation (this feature)

```text
specs/001-charade-cards/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (JSON schemas)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
index.html                 # Single page entry point
css/
├── print.css              # Print-specific styles (media queries)
└── app.css                # App-specific overrides (minimal)

js/
├── app.js                 # Main entry, theme loading, event handling
├── components/
│   ├── theme-selector.js  # <theme-selector> Web Component
│   ├── card-grid.js       # <card-grid> Web Component
│   └── charade-card.js    # <charade-card> Web Component
└── services/
    ├── card-service.js    # Card generation logic
    └── print-service.js   # Print preparation and triggering

data/
├── themes.json            # Theme index (id, name, description, wordCount)
└── themes/
    ├── animals.json       # Individual theme data
    ├── food.json
    ├── actions.json
    ├── holidays.json
    └── occupations.json

tests/
├── unit/
│   ├── card-service.test.js
│   └── print-service.test.js
└── e2e/
    ├── print-flow.spec.js
    └── theme-selection.spec.js
```

**Structure Decision**: Single static web app. No build system—JS modules loaded via `type="module"`. Bootstrap via CDN. All card data pre-computed in JSON files under `data/`.

## Complexity Tracking

> No violations requiring justification. Design adheres to constitution.
