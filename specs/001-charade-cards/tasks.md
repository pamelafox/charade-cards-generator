# Tasks: Printable Charade Cards Generator

**Input**: Design documents from `/specs/001-charade-cards/`  
**Prerequisites**: plan.md ✓, spec.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Paths relative to repository root

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [X] T001 Create directory structure: css/, js/components/, js/services/, data/themes/, tests/unit/, tests/e2e/
- [X] T002 [P] Create index.html with Bootstrap 5 CDN, module script imports, and base layout
- [X] T003 [P] Create css/app.css with minimal app-specific overrides
- [X] T004 [P] Create .nojekyll file for GitHub Pages
- [X] T005 [P] Configure ESLint for vanilla JS in eslint.config.js
- [X] T006 [P] Configure Prettier in .prettierrc
- [X] T007 [P] Create package.json with vitest and playwright dev dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create js/services/card-service.js with loadThemes(), loadThemeData(), generateCards() stubs
- [X] T009 Create js/services/print-service.js with preparePrint(), triggerPrint() stubs
- [X] T010 [P] Create data/themes.json with ThemeIndex structure (version, empty themes array)
- [X] T011 Create js/components/charade-card.js Web Component with word/emoji attributes and Shadow DOM
- [X] T012 Create css/print.css with @page rules, card grid layout, and cut guides

**Checkpoint**: Foundation ready—user story implementation can begin

---

## Phase 3: User Story 1 - Generate Printable Cards (Priority: P1) 🎯 MVP

**Goal**: User selects a theme, generates emoji-based cards, and prints a cuttable grid

**Independent Test**: Open app → Select "Animals" → Click Generate → Print preview shows 12 cards in grid with cut guides

### Implementation for User Story 1

- [X] T013 [US1] Create data/themes/animals.json with 12+ words (text, emoji, difficulty)
- [X] T014 [US1] Update data/themes.json to include animals theme in themes array
- [X] T015 [US1] Implement loadThemes() in js/services/card-service.js to fetch themes.json
- [X] T016 [US1] Implement loadThemeData() in js/services/card-service.js to fetch theme/{id}.json
- [X] T017 [US1] Implement generateCards() in js/services/card-service.js with shuffle and cardCount logic
- [X] T018 [US1] Complete js/components/charade-card.js render() with emoji display and print-friendly CSS
- [X] T019 [US1] Create js/components/card-grid.js Web Component to render array of charade-card elements
- [X] T020 [US1] Implement preparePrint() in js/services/print-service.js to apply print class to body
- [X] T021 [US1] Implement triggerPrint() in js/services/print-service.js to call window.print()
- [X] T022 [US1] Create js/app.js with theme load on DOMContentLoaded and generate button handler
- [X] T023 [US1] Update index.html with card-grid element, generate button, and print button
- [X] T024 [US1] Add loading spinner state while fetching theme data
- [X] T025 [US1] Handle edge case: theme has fewer words than cardCount (show available count)

**Checkpoint**: MVP complete—app generates and prints emoji charade cards from one theme

---

## Phase 4: User Story 2 - Theme Selection (Priority: P2)

**Goal**: User browses 5+ themes and selects one for card generation

**Independent Test**: Open app → See 5 themes listed with icons and descriptions → Select different themes → Each generates relevant cards

### Implementation for User Story 2

- [X] T026 [P] [US2] Create data/themes/food.json with 10+ words
- [X] T027 [P] [US2] Create data/themes/actions.json with 10+ words
- [X] T028 [P] [US2] Create data/themes/holidays.json with 10+ words
- [X] T029 [P] [US2] Create data/themes/occupations.json with 10+ words
- [X] T030 [US2] Update data/themes.json with all 5 themes (animals, food, actions, holidays, occupations)
- [X] T031 [US2] Create js/components/theme-selector.js Web Component with theme list rendering
- [X] T032 [US2] Add theme-selected CustomEvent dispatch in theme-selector.js
- [X] T033 [US2] Update js/app.js to listen for theme-selected event and update card generation
- [X] T034 [US2] Update index.html with theme-selector element placement
- [X] T035 [US2] Add word count preview in theme-selector for each theme
- [X] T036 [US2] Style theme-selector with Bootstrap card components

**Checkpoint**: Full theme selection working—5 themes available with distinct content

---

## Phase 5: Testing

**Purpose**: Validate core functionality before polish/deployment

- [X] T037 [P] Create tests/unit/card-service.test.js with tests for generateCards() shuffle and cardCount
- [X] T038 [P] Create tests/unit/print-service.test.js with tests for triggerPrint()
- [X] T039 Create tests/e2e/print-flow.spec.js: load app → select theme → generate → verify card grid
- [X] T040 Create tests/e2e/theme-selection.spec.js: verify all 5 themes load and produce cards
- [X] T041 Add npm test script to package.json (vitest run && playwright test)

**Checkpoint**: Tests pass—ready for polish and deployment

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting all user stories

- [ ] T048 [P] Create .github/workflows/deploy.yml for GitHub Pages deployment
- [ ] T051 Run quickstart.md verification checklist

---

## Future: User Story 3 - Wikipedia Image Cards (Priority: P3) 🔮

> **DEFERRED**: Implement after MVP+Themes are stable

**Goal**: User toggles to Wikipedia image mode for visually richer cards

**Independent Test**: Open app → Select theme → Toggle "Wikipedia images" → Generate → Cards show Wikipedia images instead of emoji

### Implementation for User Story 3

- [ ] T052 [US3] Add imageUrl and imageLicense fields to animals.json for 6+ words
- [ ] T053 [US3] Add imageUrl and imageLicense fields to food.json for 6+ words
- [ ] T054 [US3] Update js/components/charade-card.js to accept image-url attribute and render img element
- [ ] T055 [US3] Add image/emoji toggle logic in charade-card.js based on isEmoji flag
- [ ] T056 [US3] Update generateCards() in card-service.js to respect imageMode config
- [ ] T057 [US3] Add image mode toggle UI (radio buttons or switch) in index.html
- [ ] T058 [US3] Update js/app.js to pass imageMode to generateCards()
- [ ] T059 [US3] Handle failed image loads: fallback to emoji with onerror handler
- [ ] T060 [US3] Add lazy loading attribute to Wikipedia images for performance

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ─── BLOCKS ALL USER STORIES
    ↓
Phase 3 (US1: Print Cards) ─── MVP CHECKPOINT
    ↓
Phase 4 (US2: Theme Selection)
    ↓
Phase 5 (Testing) ─── QUALITY GATE
    ↓
Phase 6 (Polish) ─── DEPLOY
    ↓
Future (US3: Wikipedia Images) ─── DEFERRED
```

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational—delivers working MVP with single theme
- **US2 (P2)**: Builds on US1 theme loading—adds theme selection UI and content
- **US3 (P3)**: DEFERRED—implement after initial release

### Parallel Opportunities

**Phase 1** (all parallel):
```
T002, T003, T004, T005, T006, T007 can run simultaneously
```

**Phase 4** (theme data files parallel):
```
T026, T027, T028, T029 can run simultaneously (different JSON files)
```

**Phase 5** (test files parallel):
```
T037, T038 can run simultaneously (different test files)
```

**Phase 6** (independent tasks):
```
T042, T043, T047, T048, T049 can run simultaneously
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T012)
3. Complete Phase 3: US1 (T013-T025)
4. **STOP**: Test with animals theme, verify print output
5. Deploy to GitHub Pages if acceptable

### Incremental Delivery

| Increment | Stories | Value Delivered |
|-----------|---------|-----------------|
| MVP | US1 | Single theme, printable emoji cards |
| +Themes | US1+US2 | 5 themes, full selection UI |
| Polish | US1+US2 | Accessibility, performance, deployment |
| Future | +US3 | Wikipedia image option (deferred) |

---

## Task Summary

| Phase | Task Count | Parallel Tasks |
|-------|------------|----------------|
| Setup | 7 | 6 |
| Foundational | 5 | 1 |
| US1 (P1) | 13 | 0 |
| US2 (P2) | 11 | 4 |
| Testing | 5 | 2 |
| Polish | 10 | 5 |
| **Current Total** | **51** | **18** |
| Future (US3) | 9 | 0 |

---

## Notes

- Testing phase added after US2 to validate before polish/deploy
- All theme JSON files must validate against contracts/theme-data.schema.json
- Web Components use Shadow DOM for style encapsulation
- Print CSS uses fixed dimensions (inches) for consistent physical card size
- Wikipedia images are pre-curated in JSON—no runtime API calls
