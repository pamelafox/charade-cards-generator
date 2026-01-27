# Contracts: Printable Charade Cards Generator

**Feature**: 001-charade-cards  
**Date**: 2026-01-27

## Overview

This is a static application with no HTTP API. Contracts define the JSON data file schemas that must be adhered to for the application to function correctly.

## JSON Schema Files

| Schema | Purpose | Location |
|--------|---------|----------|
| [theme-index.schema.json](theme-index.schema.json) | Validates `data/themes.json` | `data/themes.json` |
| [theme-data.schema.json](theme-data.schema.json) | Validates theme files | `data/themes/{id}.json` |

## Validation

JSON schemas should be validated:

1. **At authoring time**: IDE extensions (e.g., Red Hat YAML/JSON) can validate against schemas
2. **In CI**: Use `ajv-cli` to validate all data files before deployment

### CI Validation Example

```bash
# Install ajv-cli
npm install -g ajv-cli

# Validate theme index
ajv validate -s specs/001-charade-cards/contracts/theme-index.schema.json -d data/themes.json

# Validate all theme files
for file in data/themes/*.json; do
  ajv validate -s specs/001-charade-cards/contracts/theme-data.schema.json -d "$file"
done
```

## JavaScript Module Interface

Since there's no backend, the "API" is the JavaScript module interface for card generation:

### card-service.js

```typescript
// Type definitions (JSDoc annotations in actual code)

interface CardConfig {
  themeId: string;
  cardCount?: 6 | 12;      // default: 12
  imageMode?: 'emoji' | 'wikipedia';  // default: 'emoji'
  shuffle?: boolean;       // default: true
}

interface GeneratedCard {
  word: string;
  image: string;           // emoji character or URL
  isEmoji: boolean;
}

/**
 * Load theme index from static JSON
 * @returns {Promise<ThemeIndex>}
 */
function loadThemes(): Promise<ThemeIndex>;

/**
 * Load a specific theme's word data
 * @param {string} themeId - Theme identifier
 * @returns {Promise<ThemeData>}
 */
function loadThemeData(themeId: string): Promise<ThemeData>;

/**
 * Generate cards based on configuration
 * @param {CardConfig} config - Card generation options
 * @returns {Promise<GeneratedCard[]>}
 */
function generateCards(config: CardConfig): Promise<GeneratedCard[]>;
```

### print-service.js

```typescript
interface PrintConfig {
  paperSize?: 'letter' | 'a4';  // default: 'letter'
  cardCount?: 6 | 12;           // default: 12
}

/**
 * Prepare the page for printing
 * @param {PrintConfig} config - Print options
 */
function preparePrint(config: PrintConfig): void;

/**
 * Trigger browser print dialog
 */
function triggerPrint(): void;
```

## Event Contracts

Web Components communicate via Custom Events:

### theme-selector

```javascript
// Dispatched when user selects a theme
// event.detail: { themeId: string }
new CustomEvent('theme-selected', { 
  detail: { themeId: 'animals' },
  bubbles: true 
});
```

### card-grid

```javascript
// Dispatched when cards are ready for printing
// event.detail: { cardCount: number }
new CustomEvent('cards-ready', {
  detail: { cardCount: 12 },
  bubbles: true
});
```
