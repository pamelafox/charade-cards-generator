# Data Model: Printable Charade Cards Generator

**Feature**: 001-charade-cards  
**Date**: 2026-01-27

## Overview

All data is stored as static JSON files. There is no database or backend; data is pre-computed and bundled with the static site.

---

## Entities

### Theme

A category of related charade words.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier (kebab-case, e.g., "animals") |
| `name` | string | ✓ | Display name (e.g., "Animals") |
| `description` | string | ✓ | Brief description for theme selection UI |
| `wordCount` | number | ✓ | Total words available in theme |
| `icon` | string | ✓ | Emoji representing the theme |

**Validation Rules**:
- `id`: lowercase letters and hyphens only, 2-30 characters
- `name`: 2-50 characters
- `description`: 10-200 characters
- `wordCount`: positive integer, minimum 10

**Example**:
```json
{
  "id": "animals",
  "name": "Animals",
  "description": "Common animals perfect for all ages",
  "wordCount": 24,
  "icon": "🐾"
}
```

---

### Word

A single charade prompt within a theme.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | ✓ | The word to act out |
| `emoji` | string | ✓ | Emoji representation |
| `imageUrl` | string | ✗ | Wikipedia Commons thumbnail URL (optional) |
| `imageLicense` | string | ✗ | License identifier (required if imageUrl present) |
| `difficulty` | string | ✗ | "easy" \| "medium" \| "hard" (default: "medium") |

**Validation Rules**:
- `text`: 1-40 characters, no special characters except spaces and hyphens
- `emoji`: single emoji or emoji sequence (1-4 code points)
- `imageUrl`: must be HTTPS URL from `upload.wikimedia.org` domain
- `imageLicense`: one of "PD", "CC0", "PD-old", "PD-US"
- `difficulty`: enum value if present

**Example**:
```json
{
  "text": "Elephant",
  "emoji": "🐘",
  "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/200px-African_Bush_Elephant.jpg",
  "imageLicense": "CC0",
  "difficulty": "easy"
}
```

---

### ThemeData

Complete theme file containing metadata and all words.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Theme identifier (matches Theme.id) |
| `name` | string | ✓ | Theme display name |
| `description` | string | ✓ | Theme description |
| `icon` | string | ✓ | Theme icon emoji |
| `words` | Word[] | ✓ | Array of Word objects |

**File Location**: `data/themes/{id}.json`

**Example** (`data/themes/animals.json`):
```json
{
  "id": "animals",
  "name": "Animals",
  "description": "Common animals perfect for all ages",
  "icon": "🐾",
  "words": [
    { "text": "Dog", "emoji": "🐕", "difficulty": "easy" },
    { "text": "Cat", "emoji": "🐱", "difficulty": "easy" },
    { "text": "Elephant", "emoji": "🐘", "difficulty": "easy" }
  ]
}
```

---

### ThemeIndex

Index file listing all available themes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `themes` | ThemeSummary[] | ✓ | Array of theme summaries |
| `version` | string | ✓ | Data version for cache invalidation |

**ThemeSummary** (subset of Theme):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Theme identifier |
| `name` | string | ✓ | Display name |
| `description` | string | ✓ | Brief description |
| `wordCount` | number | ✓ | Total words |
| `icon` | string | ✓ | Theme icon emoji |

**File Location**: `data/themes.json`

**Example**:
```json
{
  "version": "1.0.0",
  "themes": [
    { "id": "animals", "name": "Animals", "description": "Common animals perfect for all ages", "wordCount": 24, "icon": "🐾" },
    { "id": "food", "name": "Food & Drinks", "description": "Delicious items to act out", "wordCount": 20, "icon": "🍕" },
    { "id": "actions", "name": "Actions", "description": "Verbs and activities", "wordCount": 18, "icon": "🏃" },
    { "id": "holidays", "name": "Holidays", "description": "Holiday-themed words", "wordCount": 15, "icon": "🎄" },
    { "id": "occupations", "name": "Occupations", "description": "Jobs and professions", "wordCount": 16, "icon": "👷" }
  ]
}
```

---

### CardConfig

Runtime configuration for card generation (not persisted).

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `themeId` | string | ✓ | - | Selected theme |
| `cardCount` | number | ✗ | 12 | Cards per page (6 or 12) |
| `imageMode` | string | ✗ | "emoji" | "emoji" \| "wikipedia" |
| `shuffle` | boolean | ✗ | true | Randomize card order |

**Validation Rules**:
- `cardCount`: 6 or 12 only (fits grid layouts)
- `imageMode`: "wikipedia" only available if theme has images

---

### GeneratedCard

Output card ready for rendering (not persisted).

| Field | Type | Description |
|-------|------|-------------|
| `word` | string | Word text |
| `image` | string | Emoji or image URL based on mode |
| `isEmoji` | boolean | True if image is emoji |

---

## Data Flow

```
┌─────────────────┐      ┌──────────────────┐
│ data/themes.json│──────▶│ Theme Selection  │
└─────────────────┘      │ (ThemeIndex)     │
                          └────────┬─────────┘
                                   │ User selects theme
                                   ▼
┌─────────────────────┐   ┌──────────────────┐
│data/themes/{id}.json│───▶│ Card Generation  │
│ (ThemeData)         │   │ (CardConfig)     │
└─────────────────────┘   └────────┬─────────┘
                                   │ Generate cards
                                   ▼
                          ┌──────────────────┐
                          │ GeneratedCard[]  │
                          │ (render to grid) │
                          └──────────────────┘
```

---

## File Structure

```
data/
├── themes.json              # ThemeIndex
└── themes/
    ├── animals.json         # ThemeData
    ├── food.json            # ThemeData
    ├── actions.json         # ThemeData
    ├── holidays.json        # ThemeData
    └── occupations.json     # ThemeData
```

---

## Relationships

```
ThemeIndex (1) ────contains────▶ (many) ThemeSummary
     │
     │ references by id
     ▼
ThemeData (1) ────contains────▶ (many) Word

CardConfig ────selects────▶ ThemeData
     │
     │ generates
     ▼
GeneratedCard[] (runtime only)
```
