# Decision Log: Project Odyssey

## Decision 1: Dual-Mode Architecture (Mission Mode vs. Executive Mode)
- **Alternative 1:** Standard 3D scrolling portfolio.
- **Alternative 2:** Pure text dashboard.
- **Decision:** Combine both. Let the user transition between them within 800ms.
- **Trade-offs:** Higher initial load times, resolved via code-splitting.

## Decision 2: Centralized Link Registry (`ALL_PROJECTS`)
- **Alternative:** Hardcoded href values in cards.
- **Decision:** Single source of truth. Prevents broken links.
- **Trade-offs:** Slightly more setup overhead.
