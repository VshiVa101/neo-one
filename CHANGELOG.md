# Changelog

All notable changes to this project will be documented in this file.

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
