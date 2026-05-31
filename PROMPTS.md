# AI Prompt Log

This file logs the prompts/messages sent to AI tools (Claude / Claude Code) while building
this project, as requested by the challenge. It's a chronological summary of the direction I
gave the assistant; minor follow-ups and clarifications are paraphrased.

---

## 1. Kickoff — the challenge brief

Pasted the full take-home brief and asked the assistant to build the front end using **React
and TypeScript**, implementing all listed requirements:

- `GET /pets` via `fetch`; present images + data in a compelling, interactive way
- select images & download them, with a selected count + estimated total file size
- Select All / Clear Selection
- sort by Name A–Z / Z–A and Date newest / oldest
- search bar filtering by title or description
- styled-components for the UI
- react-router-dom with a `/pets/:id` detail view, an About Me page, and other relevant pages
- a custom data hook handling loading / error / empty states
- effective global + local state, with selection persisting across route navigation
- pagination or infinite scroll
- responsive layout (1 column mobile / 2 tablet / 4 desktop)
- documented code, plus freedom to add creative extras

## 2. Scope decisions (answers to the assistant's clarifying questions)

- **Gallery loading:** infinite scroll.
- **Download:** bundle selected images into a single ZIP (JSZip).
- **Extras to include:** dark/light theme toggle, favorites/adoption shortlist, filters +
  animations, and accessibility + unit tests.
- **Repo deliverables:** build the app, set up git with clean commits, and maintain this
  `PROMPTS.md`.

## 3. Implementation guidance given throughout

- Serve the data at the literal `/pets` path with a Vite dev/preview middleware so the app
  makes a genuine `fetch('/pets')` call instead of loading a static file, and use real,
  stable pet photos (dog.ceo + cataas) with deterministic mock metadata.
- Model the data hook's state as an explicit `loading | error | empty | success` union and
  share it via context so the detail page and gallery don't double-fetch.
- Keep download selection in context + `sessionStorage` (survives navigation and refresh)
  and favorites in `localStorage` (survives sessions).
- Keep search/filter/sort logic pure and unit-tested; debounce the search input.
- Make it accessible (ARIA, focus rings, reduced-motion) and responsive (1/2/4 columns).
- Ensure `npm run lint`, `npm run build`, and `npm run test:run` all pass cleanly; fix the
  strict `react-hooks` lint findings properly (e.g. use the "adjust state during render"
  pattern instead of an extra effect) rather than blanket-disabling rules.
- Write README documentation mapping each requirement to where it's implemented, and a
  short PROMPTS log (this file).

---

### Tools used

- **Claude Code** (Anthropic) — pair-programming the implementation, tests, and docs.
