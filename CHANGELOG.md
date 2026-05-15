# Changelog

All notable changes to this project will be documented in this file.


## [1.3.1] - 2026-05-15

### 📝 TEXT WRAPPING & UI REFINEMENT

- **Global Text Wrapping**: Implemented a site-wide CSS solution to prevent word-breaking on window resize/zoom, excluding `.hero` sections. Uses `overflow-wrap: anywhere`, `word-break: keep-all`, and `hyphens: none`.
- **Layout Integrity**: Forced `overflow-x: hidden` on `html` and `body` to prevent unintended horizontal scrolling.
- **Calendar UX**: Refined grab-to-scroll interactions and alignment for the social bar and calendar event items.

## [1.3.0] - 2026-05-14

### 🗓️ CALENDAR, AUDIO & NAVIGATION POLISH

- **Calendar Implementation**: Fully functional `/calendar` page with monthly events, horizontal grab-to-scroll, and social bar repositioned to bottom-center.
- **Audio Experience**: Restricted "explosion" entrance animation to Hero-to-Home transitions only. Removed "banana" audio from CRT noise manager; replaced site background music with `banana.mp3`.
- **Visual Refinement**: Updated `EventDetail` with new asset `bbjdhsgfshdjyg.png` and forced black text/branding for readability.
- **Bugfixes & Stability**: Resolved memory leak in `useAuth.ts` via `useCallback`, fixed Cloudinary image resolution utility (`getImageUrl`), and restored Expanded Cluster view layout/branding.

## [1.2.2] - 2026-05-12

### 🖱️ CALENDAR GRAB-TO-SCROLL & SOCIALBAR REFACTOR

- **SocialBar horizontal repositioning**: Relocated from left sidebar to fixed bottom center. Now uses framer-motion `drag="x"` for horizontal grab-to-scroll across the entire footer area, including directly on social icons.
- **Grab vs Click disambiguation**: Added `hasDragged` ref with `onDragStart`/`onDragEnd` lifecycle. On drag, the `<a>` `onClick` gate calls `preventDefault()`, preventing accidental link navigation after long-press grab.
- **Native drag suppression**: Suppressed browser ghost-image drag on desktop via `draggable={false}`, `-webkit-user-drag: none`, `onDragStart` `preventDefault()` on `<a>` and `<Image>` elements. Added `select-none` throughout to prevent text selection.
- **Hover refactor**: Moved icon hover effects from framer-motion `whileHover` (which blocked parent drag gesture propagation) to pure CSS `group-hover:` with cubic-bezier spring-like transitions.
- **CalendarClient.tsx MonthRow**: Extracted inline `MonthRow` component. Month event lists now use `drag="x"` with `cursor-grab`/`active:cursor-grabbing` instead of native `overflow-x-auto`.

## [1.2.1] - 2026-05-07

### 🧹 STABILIZZAZIONE WORKFLOW & ALLINEAMENTO METADATI
Release di stabilizzazione: allineati tutti i metadati di progetto (version, changelog, checklist) a v1.2.1.

- **Meta**: `package.json` version allineato a `1.2.1`.
- **Docs**: `DEPLOYMENT_CHECKLIST.md` aggiornato a v1.2.1 / 2026-05-07.
- **Docs**: `NEO_ALIGNMENT.md` recuperato da archivio in `docs/` per handoff multi-agente.
- **Chore**: `CHANGELOG.md` entry [1.2.1] creata. Git stash di test non pronti droppato.
- **Cleanup**: working tree pulito, build `v1.2.1` gia' deployata su Vercel.

## [1.2.0] - 2026-04-29

### 🚀 THE TURNING POINT: SYSTEM CONSOLIDATION & STABILIZATION
Questo è il commit di riferimento per la stabilità del progetto. Segna il passaggio da sviluppo esplorativo a sistema di produzione.

- **Core Infrastructure**: Allineate tutte le dipendenze `@payloadcms/*` alla versione `3.80.0` per garantire stabilità e compatibilità del modulo email.
- **Project Cleanup**: Rimossi oltre 60MB di asset duplicati e codice orfano del template. Pulizia profonda delle directory `public/` e `src/app/(frontend)`.
- **Documentation Master**: Creato `docs/NEO_MASTER_RULES.md` come singola fonte di verità per lo sviluppo futuro. Archiviati 6+ file di documentazione obsoleta in `docs/archive/`.
- **Email Engine**: Implementato e configurato l'adapter Resend per l'invio delle notifiche dal form Checkout/Inquiry.
- **Development DX**: Aggiunto comando `pnpm backup` per esportazioni atomiche del database e consolidate le utility di gestione immagini (`getImageUrl`).
- **Git Hardening**: Ottimizzato `.gitignore` per escludere file di sistema, log e asset sorgente pesanti, rendendo il repository snello e pronto al versionamento professionale.

## [1.1.2] - 2026-04-27

- **Bugfix / Core UX**: Reworked `EyeScene` 3D eye tracking so desktop follows the cursor continuously and mobile points to user touches, holds the target briefly, then returns to idle floating.
- **3D Architecture**: Separated eye tracking from "living" animations by using an outer tracking group and an inner animation group, preserving capovolgimento lento, fast roll/vortex, and periodic vibration without letting them block pointer response.
- **Reliability**: Cloned the cached GLB scene per `EyeScene` instance to avoid Object3D contention when multiple eyes/canvases are mounted during transitions or across routes.
- **Navigation Fix**: Restored default click navigation for non-landing eye instances while keeping the landing Hero explicitly locked behind the Matrix gateway.
- **Documentation**: Added/updated internal alignment notes for future model handoffs, versioning continuity, 3D-eye implementation constraints, and safe release practice.
- **Deployment**: Versioned on `main` and pushed to `origin/main` so Vercel can trigger a production build.

## [1.1.1] - 2026-04-23

- **Bugfix**: Fixed caching issues causing stale cluster rendering by implementing `noStore()` in `actions.ts`.
- **UI/UX**: Made the Expanded Gallery Overlay text display statically (always visible) instead of appearing only on hover, improving discoverability.
- **Data Integrity**: Added `sort: 'sortOrder'` to the fetch query to preserve Payload's order natively on the frontend.
- **Data Integrity**: Increased the artwork limit per cluster from 200 to 1000 to ensure complete data fetching for large clusters.

## [1.1.0] - 2026-04-15

- Release `v1.1.0` — docs & onboarding, account creation, audio fixes, route guards.
- Created/updated Neo onboarding and XnConvert workflow (`docs/NEO_ONBOARDING.md`).
- `scripts/create-neo-user.ts`: made idempotent — updates password if user exists, improved error logging.
- Added client audio assets to `public/media` and improved `TransitionOverlay` to log play errors.
- Guarded server routes and sitemap generation against missing `pages` / `posts` collections to prevent build-time crashes.
- Temporarily set `typescript.ignoreBuildErrors` in `next.config.ts` to unblock Vercel; reminder to revert after regenerating types.
- Minor doc fixes: `DEPLOYMENT_CHECKLIST.md`, `MASTER_SPEC.md`, `README.md` updated with release notes.

## [1.0.0] - initial

- Initial template baseline.
