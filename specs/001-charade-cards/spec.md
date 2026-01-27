# Feature Specification: Printable Charade Cards Generator

**Feature Branch**: `001-charade-cards`  
**Created**: 2026-01-27  
**Status**: Draft  
**Input**: User description: "I want to make a static app that generates printable charade cards across different themes. Each printable should be easy to cut into squares. Each card needs a word and a picture. I want the pictures to all be either emojis or public domain images from Wikipedia."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Printable Cards (Priority: P1)

A user visits the app, selects a theme (e.g., "Animals"), and generates a printable page of charade cards. Each card displays a word and a corresponding picture (emoji). The user prints the page and cuts along the grid lines to create individual cards for their charade game.

**Why this priority**: This is the core functionality—without printable cards, there is no product. Emoji-based cards provide immediate value with no external dependencies.

**Independent Test**: Can be fully tested by selecting a theme, generating cards, and printing a page. Delivers a complete, usable set of charade cards.

**Acceptance Scenarios**:

1. **Given** the user is on the app, **When** they select a theme and click "Generate", **Then** a printable page of cards is displayed with words and emoji pictures.
2. **Given** a printable page is displayed, **When** the user prints it, **Then** the cards are arranged in a grid that can be easily cut into uniform squares.
3. **Given** the user generates cards, **When** viewing the printable output, **Then** each card shows one word and one corresponding picture clearly visible.

---

### User Story 2 - Theme Selection (Priority: P2)

A user browses multiple available themes (Animals, Food, Actions, Holidays, etc.) and selects one that fits their party or event. The app shows a preview of available words in the theme before generating.

**Why this priority**: Theme variety makes the app useful for different occasions and age groups; however, a single hardcoded theme could still deliver P1 value.

**Independent Test**: Can be tested by viewing all available themes, selecting different themes, and verifying each produces relevant cards.

**Acceptance Scenarios**:

1. **Given** the user is on the app, **When** they view the theme list, **Then** at least 5 distinct themes are displayed with descriptive names.
2. **Given** multiple themes exist, **When** the user selects different themes, **Then** each theme produces cards with words and pictures relevant to that theme.

---

### User Story 3 - Wikipedia Image Cards (Priority: P3)

A user generates cards using public domain images from Wikipedia instead of emojis for a more visually rich experience. The app fetches appropriate images and displays them on the cards.

**Why this priority**: Wikipedia images enhance visual appeal but add complexity (external fetching, image licensing verification, layout challenges). Emoji cards (P1) provide a complete experience without this.

**Independent Test**: Can be tested by selecting "Wikipedia images" option, generating cards, and verifying images appear correctly and are public domain.

**Acceptance Scenarios**:

1. **Given** the user selects Wikipedia image mode, **When** they generate cards, **Then** each card displays a relevant public domain image from Wikipedia.
2. **Given** Wikipedia images are used, **When** the user prints the page, **Then** images render clearly at print resolution.

---

### Edge Cases

- What happens when a theme has fewer words than the number of cards requested? System displays all available words and indicates the count.
- How does the system handle failed Wikipedia image fetches? Falls back to emoji for that card with no broken image displays.
- What happens if the browser cannot print? System provides option to download as PDF or image file.
- How does the system handle very long words? Text scales down to fit within the card boundary while remaining legible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a selection of at least 5 themes for users to choose from.
- **FR-002**: System MUST generate a grid of charade cards arranged for easy cutting (uniform square layout with visible cut guides).
- **FR-003**: Each card MUST display exactly one word and one corresponding picture.
- **FR-004**: System MUST support emoji as the default picture source for all themes.
- **FR-005**: System MUST support public domain images from Wikipedia as an alternative picture source.
- **FR-006**: Printable output MUST fit standard paper sizes (Letter 8.5"×11" or A4) without content clipping.
- **FR-007**: System MUST function as a static app (no server-side processing required).
- **FR-008**: System MUST allow users to specify how many cards to generate per page.
- **FR-009**: Cards MUST be legible when printed in black and white.
- **FR-010**: System MUST provide print-friendly styling (no navigation elements, appropriate margins).

### Key Entities

- **Theme**: A category of related charade words (e.g., "Animals", "Food"). Contains a name, description, and collection of words.
- **Word**: A single charade prompt within a theme. Has text, associated emoji, and optional Wikipedia image reference.
- **Card**: A printable unit combining one word with one picture. Has dimensions suitable for cutting.
- **Card Sheet**: A printable page containing multiple cards in a grid layout. Has paper size and card count configuration.

## Assumptions

- Standard print resolution (300 DPI) is sufficient for card legibility.
- Users have access to a printer or PDF export capability in their browser.
- Emoji rendering is consistent enough across modern browsers for this use case.
- Wikipedia Commons API is accessible for public domain image retrieval.
- 6-12 cards per page is a reasonable default grid size for standard paper.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can generate and print a sheet of charade cards within 30 seconds of arriving at the app.
- **SC-002**: 95% of generated cards display correctly when printed (word and picture visible, within card boundaries).
- **SC-003**: Cards can be cut into uniform squares with no more than 2mm variance using standard scissors.
- **SC-004**: App loads and becomes interactive within 3 seconds on a standard broadband connection.
- **SC-005**: At least 50 unique words are available across all themes combined.
- **SC-006**: Printed cards remain legible at arm's length (approximately 50cm viewing distance).
