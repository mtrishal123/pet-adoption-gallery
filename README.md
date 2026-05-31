# 🐾 PawfectMatch — Pet Adoption Gallery

A responsive, themeable pet-adoption gallery built with **React 19 + TypeScript + Vite**.
Browse adoptable pets, search/filter/sort them, shortlist favorites, and select multiple
photos to download as a single ZIP.

> Built as a front-end take-home challenge. Every requirement from the brief is implemented,
> plus a handful of extras (dark mode, an adoption shortlist, filters, animations,
> accessibility, and tests).

---

## ✨ Features


| Requirement | Where it lives |
| --- | --- |
| `GET /pets` with **`fetch`** | [`src/api/pets.ts`](src/api/pets.ts) → served by a Vite middleware in [`vite.config.ts`](vite.config.ts) |
| Compelling, interactive image gallery | [`src/components/PetCard.tsx`](src/components/PetCard.tsx), [`src/pages/GalleryPage.tsx`](src/pages/GalleryPage.tsx) |
| Select images & **download** them | [`src/components/SelectionBar.tsx`](src/components/SelectionBar.tsx), [`src/utils/download.ts`](src/utils/download.ts) |
| Selected **count** + estimated **total file size** | [`src/components/SelectionBar.tsx`](src/components/SelectionBar.tsx) |
| **Select All / Clear Selection** | [`src/components/SelectionBar.tsx`](src/components/SelectionBar.tsx) |
| **Sort** by Name A–Z / Z–A, Date newest / oldest | [`src/utils/petQuery.ts`](src/utils/petQuery.ts), [`src/components/Toolbar.tsx`](src/components/Toolbar.tsx) |
| **Search** by title or description | [`src/utils/petQuery.ts`](src/utils/petQuery.ts), [`src/hooks/useDebounce.ts`](src/hooks/useDebounce.ts) |
| **styled-components** for all UI | every component + [`src/theme/`](src/theme/) |
| **react-router-dom**: detail view `/pets/:id`, About page, others | [`src/App.tsx`](src/App.tsx), [`src/pages/`](src/pages/) |
| **Custom data hook** with loading / error / empty states | [`src/hooks/usePets.ts`](src/hooks/usePets.ts) |
| Global + local state; **selection persists across routes** | [`src/context/`](src/context/) |
| **Infinite scroll** | [`src/hooks/useInfiniteScroll.ts`](src/hooks/useInfiniteScroll.ts) |
| **Responsive** 1 / 2 / 4 columns | [`src/components/GalleryGrid.ts`](src/components/GalleryGrid.ts) |
| Documented code | comments throughout |

### Extras

- 🌗 **Light / dark theme** toggle (respects OS preference, persisted).
- ❤️ **Adoption shortlist** ("favorites") persisted to `localStorage`, separate from the
  transient download selection.
- 🔎 **Species filter** (All / Dogs / Cats) alongside search & sort.
- 💀 **Skeleton loaders**, hover/scale **animations**, and a sticky animated selection bar.
- ♿ **Accessibility**: semantic landmarks, `aria-*` on controls, visible focus rings,
  keyboard-friendly inputs, and a `prefers-reduced-motion` fallback.
- 🧪 **20 unit/integration tests** (Vitest + Testing Library).

---

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server (serves the app **and** the mock `GET /pets`). |
| `npm run build` | Type-check (`tsc -b`) and build for production. |
| `npm run preview` | Preview the production build (also serves `GET /pets`). |
| `npm run lint` | Run ESLint. |
| `npm run test` | Run Vitest in watch mode. |
| `npm run test:run` | Run the test suite once. |

---

## 🏗️ Architecture & key decisions

### The `/pets` endpoint

There's no separate backend, but the spec asks for a real `fetch('/pets')`. Rather than
fetching a static file, a tiny **Vite middleware** ([`vite.config.ts`](vite.config.ts))
serves the dataset at the exact path `GET /pets` in both `dev` and `preview`. It adds a
small artificial latency so the loading/skeleton states are observable, and matches `/pets`
*exactly* so client-side routes like `/pets/:id` still fall through to the SPA. The data
itself ([`src/data/pets.ts`](src/data/pets.ts)) is deterministic and uses real, stable pet
photos from the `dog.ceo` and TheCatAPI (`cdn2.thecatapi.com`) CDNs.

### Data loading

[`usePets`](src/hooks/usePets.ts) is the custom hook. It models state as an explicit union —
`'loading' | 'error' | 'empty' | 'success'` — which forces the UI to handle each case
deliberately (see the `switch`-like rendering in [`GalleryPage`](src/pages/GalleryPage.tsx)).
It also cancels in-flight requests via `AbortController` and exposes a `refetch` for retries.
The hook is shared app-wide through [`PetsProvider`](src/context/PetsContext.tsx), so
deep-linking to a detail page and navigating back never refetches.

### State management

Three React contexts, each chosen for its lifetime:

- **Selection** ([`SelectionContext`](src/context/SelectionContext.tsx)) — which pets are
  selected for download. Lives above the router (survives navigation) and is mirrored to
  `sessionStorage` (survives refresh within a session).
- **Favorites** ([`FavoritesContext`](src/context/FavoritesContext.tsx)) — the adoption
  shortlist, persisted to `localStorage` (survives across sessions).
- **Theme** ([`ThemeContext`](src/context/ThemeContext.tsx)) — light/dark, persisted and
  wired into styled-components' `ThemeProvider`.

Local UI state (search text, sort, filter, pagination window) stays local to
[`GalleryPage`](src/pages/GalleryPage.tsx).

### Search / filter / sort

All pure and unit-tested in [`petQuery.ts`](src/utils/petQuery.ts); the gallery derives its
visible list with a single `useMemo`. The search term is debounced so typing stays snappy.

### Downloads

[`downloadPetsAsZip`](src/utils/download.ts) fetches each selected image as a blob in
parallel and bundles them with **JSZip**, avoiding the browser's multi-download blocking and
gracefully skipping (and reporting) any image that fails.

---

## 🗂️ Project structure

```
src/
├── api/            # fetch wrapper for /pets
├── components/     # presentational + composite UI (styled-components)
├── context/        # Theme, Pets, Selection, Favorites providers
├── data/           # deterministic mock dataset (served by Vite middleware)
├── hooks/          # usePets, useInfiniteScroll, useDebounce, usePersistentState
├── pages/          # Gallery, PetDetail, Favorites, About, NotFound
├── theme/          # design tokens + GlobalStyle
├── types/          # domain types
└── utils/          # formatting, query logic, zip download (+ tests)
```

---

## 🧰 Tech stack

React 19 · TypeScript · Vite · styled-components · react-router-dom · JSZip · Vitest +
Testing Library.
