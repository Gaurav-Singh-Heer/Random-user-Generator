# 🛠️ October Updates — Random User Explorer

This document explains, **step by step**, the major upgrade that turned the simple
single-user fetch demo into a full **Random User Explorer**.

> ✅ **No existing files were renamed.** All original files (`components/api.jsx`,
> `components/userCard.jsx`, `src/App.jsx`, `src/App.css`, etc.) kept their names.
> New capabilities were added either inside those files or as new sibling files.

---

## 📦 What was added / changed

**New files**

| File | Purpose |
|------|---------|
| `components/useLocalStorage.jsx` | A reusable hook that mirrors `useState` to `localStorage` (favorites + theme persist across reloads). |
| `components/exportUtils.jsx` | Browser-side helpers to export the current user list as **JSON** or **CSV**, plus a `userId()` helper. |
| `components/FilterPanel.jsx` | Controlled panel for the API query (gender, nationality, count, seed) and client-side search/sort. |
| `components/UserGrid.jsx` | Renders the users in a responsive grid and shows **skeleton loaders** while fetching. |

**Updated files** (same names)

| File | Change |
|------|--------|
| `components/api.jsx` | Added query-param support (`results`, `gender`, `nat`, `seed`) and real error handling. Still backwards compatible. |
| `components/userCard.jsx` | Added favorite star, click-to-copy email/phone, accessible `alt` text, copy toast. |
| `src/App.jsx` | Rewritten as the Explorer: batch fetch, filters, grid, favorites, search/sort, export, theme toggle, loading/error states. |
| `src/App.css` | Theme tokens (dark/light), grid layout, filter panel, toolbar, skeletons — original card design preserved. |
| `package.json` | Project `name` changed from `10-fetch-an-api` to `random-user-generator`. |

---

## 🔢 Step-by-step implementation

### Step 1 — Make the API flexible (`components/api.jsx`)

The original function always hit `https://randomuser.me/api/` and returned one user
with no error handling. We:

1. Added `buildUserUrl()` which assembles a query string from an options object using
   `URLSearchParams`.
2. Supported the parameters the API actually offers:
   - `results` → how many users to fetch,
   - `gender` → `male` / `female` (skipped when `all`),
   - `nat` → nationality code(s), e.g. `us` or `us,gb`,
   - `seed` → reproducible result sets.
3. Threw an `Error` when `response.ok` is false so the UI can show a retry message.

> **Backwards compatible:** `getRandomUser()` with no arguments still returns a single
> user, exactly like before.

```js
export const getRandomUser = async (options = {}) => {
  const response = await fetch(buildUserUrl(options), { method: "GET" });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
};
```

### Step 2 — Persist state across reloads (`components/useLocalStorage.jsx`)

A tiny custom hook that behaves like `useState` but reads its initial value from
`localStorage` and writes back on every change. It is wrapped in `try/catch` so it
degrades gracefully in private-mode browsers. Used for **favorites** and **theme**.

### Step 3 — Export the data (`components/exportUtils.jsx`)

Random user data is commonly used for seeding/testing, so we added:

- `exportAsJSON(users)` — pretty-printed JSON download.
- `exportAsCSV(users)` — flattens each user to key fields and escapes quotes correctly.
- `userId(user)` — returns `login.uuid` (fallback: email) as a stable React key and
  favorite identifier.

Both exports build a `Blob`, create a temporary `<a download>` and revoke the object URL.

### Step 4 — Build the filter/search panel (`components/FilterPanel.jsx`)

A fully **controlled** component. The parent owns a `filters` object; the panel calls
`onChange` with the updated copy. It drives two kinds of filtering:

- **Server-side** (needs a new fetch): gender, nationality, count, seed → “Generate”.
- **Client-side** (instant): search box + sort dropdown.

### Step 5 — Render many users with loading states (`components/UserGrid.jsx`)

- Maps over the users and reuses the existing `UserCard` (unchanged import path).
- While `loading`, renders six `.skeleton` placeholder cards instead of plain text.
- Shows an empty-state message when nothing matches.

### Step 6 — Upgrade the card (`components/userCard.jsx`)

- Added an optional **favorite star** (only shown when `onToggleFavorite` is passed).
- **Click-to-copy** on email and phone via `navigator.clipboard`, with a small toast.
- Fixed accessibility: image `alt` is now the user's real name.
- The `useState` hook was moved **above** the early return to satisfy the Rules of Hooks
  (caught by ESLint).

### Step 7 — Wire it all together (`src/App.jsx`)

The Explorer now holds:

- `users`, `loading`, `error` — the fetch lifecycle.
- `filters` — the controlled filter object.
- `favorites` + `theme` — persisted via `useLocalStorage`.
- `useMemo` for derived lists (favorites view, then search + sort) so re-renders stay cheap.
- A toolbar to toggle **Favorites only**, show the visible count, and export JSON/CSV.
- An **error banner** with a Retry button, and a **theme toggle** that sets
  `document.documentElement.dataset.theme`.

### Step 8 — Style and theme (`src/App.css`)

- Introduced CSS custom properties under `:root[data-theme="dark|light"]` for a real
  **dark/light** switch.
- Added a responsive **grid** (`repeat(auto-fill, minmax(260px, 1fr))`), filter panel,
  toolbar, error banner, and shimmering **skeleton** animation.
- The original card gradient, hover lift, image rotate, and shine animation were **kept**.

---

## ✅ Verification

```bash
npm install
npm run lint     # passes clean
npm run build    # production build succeeds
npm run dev      # run locally
```

---

## 🧭 Possible next steps

- Add **React Router** for a per-user detail page (with a map from lat/long).
- Migrate to **TypeScript** and **TanStack Query** for typed, cached fetching.
- Add **Vitest + React Testing Library** unit tests.
- Export individual users as **vCard**.
