# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev   # next dev
npm run build       # next build (static export, output: 'export' — see Mobile below)
npm run start        # next start (serve production build)
npm run lint          # next lint
```

No test runner is configured in this repo. Env vars (`.env`): `NEXT_PUBLIC_API_URL` (note the socket client in `src/service/socketService.ts` actually reads `NEXT_PUBLIC_SOCKET_URL`, falling back to `http://localhost:3001` — set it if pointing at a non-default backend), `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_APPLE_CLIENT_ID`, `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY`, `NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY`.

## Architecture

Next.js (App Router) frontend for a real-time multiplayer bluffing/trivia game, wrapped natively for iOS/Android via Capacitor. It's a thin client over a NestJS + Socket.IO backend (sibling `Palo-back` repo) — almost all game state is server-authoritative and pushed to clients via socket events; REST is only used for question admin upload, auth, entitlements, and (on native) purchases.

### Routing vs. UI split

`src/app/**/page.tsx` files are intentionally thin — each just renders a component from `src/page/<feature>/`:
- `app/page.tsx` → `page/home/Home.tsx` (+ `useHome.ts`)
- `app/setup/page.tsx` → `page/setupProfile/setupProfile.tsx` (+ `useSetupProfile.ts`)
- `app/room/page.tsx` → `page/room/room.tsx` (+ `useRoom.ts`) — **note:** this is `/room?roomId=X`, a query param, not a `[roomId]` dynamic segment. It was migrated off the dynamic segment specifically because `output: 'export'` (required for Capacitor) can't pre-render a path segment whose value is only known at runtime. Read `roomId` via `useSearchParams()`, not `useParams()`, and wrap any page using it in `<Suspense>` (see `app/room/page.tsx`/`app/setup/page.tsx`) — Next's static export requires that for `useSearchParams()`.
- `app/login/page.tsx` → `page/auth/Login.tsx` (+ `useLogin.ts`)
- `app/purchases/page.tsx` → `page/purchases/Purchases.tsx` (+ `usePurchases.ts`)
- `app/admin/addImageQuestion/page.tsx` → `page/admin/addImageQuestion.tsx`

Each `page/<feature>/` pairs a presentational component with a `use<Feature>.ts` hook that holds all state/socket-event wiring for that screen. `src/components/game/*` are the presentational pieces composed inside `room.tsx` (category picker, bluff input, voting, results, timer, waiting overlays, etc.); `src/components/ui/*` are shadcn/ui primitives (New York style, neutral base color, see `components.json`).

### Realtime layer

- **`src/service/socketService.ts`** — the single Socket.IO client instance and every emit helper (`createRoom`, `joinRoom`, `startGame`, `chooseCategory`, `submitGuess`, `submitVote`, `nextRound`, `endGame`, `forceFinalResults`, `sendSelectedCategories`, `updatePlayer`, `leaveRoom`), plus passthroughs for `on`/`off`. All server communication goes through this module — there's no separate REST client for game actions.
- **`src/page/room/useRoom.ts`** — the core client state machine. Mirrors the backend's `GamePhase` (`src/model/Quizz1Phases.ts`) and reconstructs room state from whatever socket events land (`joinedRoom`, `roundStarted`, `questionReady`, `votingStarted`, `resultsReady`, `gameEnded`, `showFinalResult`, `categoriesForRound`, `adminSelectedCategories`, `playerUpdated`, etc.). Handles reconnect: on `joinedRoom`, if the game is already in progress and the local player isn't marked `joinedLate`, it replays state via `reconnectGameState`; otherwise it shows a "waiting for game end" state. Also runs the local countdown timer (`timer` state) — the authoritative phase timeout lives on the backend; this is purely a UI countdown.
- **`src/model/*`** — TypeScript types (`GameRoom`, `Player`, `GameConfig`, `ComputedGuess`, `Quizz1Phases`) that must be kept in sync by hand with the equivalent types in the backend's `GameService.ts` — there is no shared/generated types package between the two repos.

### Player identity & persistence

`src/utils/usePlayerStore.ts` (Zustand) persists the local player's `id`/`name`/`avatar` to `localStorage` (`player_data`) — this is the *guest* game identity, used for every player regardless of login state, and is what re-associates a socket reconnect with an existing room seat. It's entirely separate from the account system below.

### Accounts & entitlements (optional — only needed to buy something)

- **Auth is Google/Apple Sign-In only**, no passwords. `src/utils/useAuthStore.ts` (Zustand) holds the JWT + user, persisted to `localStorage`. `src/page/auth/useLogin.ts` drives Google Identity Services / Sign in with Apple JS (loaded via `<Script>` tags in `page/auth/Login.tsx`) and posts the resulting `id_token` to the backend's `/api/auth/google`/`/api/auth/apple`, which returns our own JWT.
- **`src/service/authService.ts`** is the REST client for everything account-related: login, `getCategoryCatalog`, and the dev-only `unlockCategory` stub (backend-gated behind `ALLOW_TEST_UNLOCK`, see the backend `CLAUDE.md`).
- **Room-level, not per-player**: only whoever *creates* a room needs to be logged in to unlock premium categories for that room — `socketService.createRoom` sends the JWT as `authToken`, and the backend resolves it to `GameRoom.adminUserId`. Guests never need an account.
- **`src/model/category.ts`**'s `CategoryCatalogEntry` (`key`, `label`, `isPremium`, `priceCents`, `unlocked`) is what `PlayerSelection.tsx` renders — locked categories show a lock icon; clicking one calls `useRoom.ts`'s `handleRequestUnlockCategory`, which branches on `purchasesAvailable()` (see Mobile below).

### Mobile (Capacitor) & purchases

- The app is wrapped with **Capacitor** (`capacitor.config.ts`, `ios/`, `android/`) — `next.config.ts` sets `output: 'export'` so `next build` produces a static `out/` folder that both a plain web host and Capacitor's `webDir` consume. Loop after any web change: `next build && npx cap sync`, then `npx cap open ios`/`android` to build/run natively.
- **`src/service/purchasesService.ts`** wraps `@revenuecat/purchases-capacitor`. `purchasesAvailable()` (`Capacitor.isNativePlatform()`) gates all of it off in a plain browser tab — RevenueCat's native SDK only works inside the wrapped app, matching Apple's own requirement that IAP only exists in-app. `src/utils/PurchasesInitializer.tsx` (wraps the whole app in `app/layout.tsx`) configures RevenueCat once on mount and calls `Purchases.logIn(userId)`/`logOut()` whenever `useAuthStore`'s user changes — this is what ties a real purchase to our own account rather than an anonymous RevenueCat identity.
- A purchase itself (`purchasesService.purchaseCategory`) doesn't unlock anything client-side — RevenueCat verifies it with Apple/Google, then calls the backend's webhook, which grants the entitlement. The frontend just re-fetches the catalog a couple seconds after a successful purchase call to pick up the change.

### i18n

`i18n.ts` (project root) statically imports `public/locales/{fr,en,ar}/common.json` and configures `i18next`/`react-i18next` with `fr` as default/fallback language. `src/hooks/useHtmlLangDir.ts` + `src/components/utils/LanguageSelect.tsx` handle switching language and `dir` (for Arabic RTL). Language selection is also sent to the backend as part of `GameConfig.lang` so it can fetch questions in the right language.

### Styling

Tailwind v4 (`postcss.config.mjs` + `@tailwindcss/postcss`), shadcn/ui components under `src/components/ui`, theming variables in `src/styles/theme-vars.css` / `src/styles/theme.ts`. Path alias `@/*` → `src/*`.

### Admin question upload

`page/admin/addImageQuestion.tsx` posts multipart form data (image + per-language translations JSON) directly to the backend's `POST /api/upload-question` endpoint — this is the one place the app talks HTTP instead of sockets.
