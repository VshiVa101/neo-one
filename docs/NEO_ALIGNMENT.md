# Neo-One — Internal Alignment & Handoff

**File:** `docs/NEO_ALIGNMENT.md`
**Purpose:** single operational handoff document for future models/agents working on Neo-One.
**Last updated:** 2026-05-15
**Current release context:** v1.3.1

---

## 1. Why this document exists

Neo-One is a visually driven, interaction-heavy Payload/Next.js project. The most important risk is not only breaking TypeScript or build output: it is breaking the emotional identity of the site.

This document exists to preserve continuity between different AI models, coding sessions, and release steps.

Before making meaningful changes, read this document together with:

1. `AGENTS.md`
2. `MASTER_SPEC.md`
3. `CHANGELOG.md`
4. `docs/walkthrough.md`
5. `docs/NEO_ONBOARDING.md`
6. `DEPLOYMENT_CHECKLIST.md`

If these documents disagree, use this priority order:

1. `AGENTS.md` for security, Payload, and versioning rules
2. `MASTER_SPEC.md` for roadmap and product direction
3. `docs/NEO_ALIGNMENT.md` for handoff and implementation continuity
4. `CHANGELOG.md` for historical release facts
5. feature-specific files and code comments

---

## 2. Project identity

Neo-One is not a generic Payload template anymore.

It is an art hub / interactive showcase where the interface must feel:

- alive
- premium
- slightly dangerous
- tactile
- cinematic
- custom, never template-like

The 3D eye is the central visual and navigational motif. Treat it as a core product surface, not as decorative UI.

---

## 3. Critical contract: 3D Eye behavior

### 3.1 Expected user behavior

The 3D eye must obey this contract:

#### Desktop

- The eye follows the cursor continuously.
- It should react immediately to mouse movement.
- It should also update on click/mousedown, even if the cursor did not move much.
- It must remain visually alive while tracking.

#### Mobile / touch devices

- On `touchstart`, the eye points to the touched screen position.
- On `touchmove`, the eye follows the moving finger.
- On `touchend`, the eye keeps looking at the last touch point for about 1 second.
- After that, it returns to idle floating.
- It must not get stuck in synthetic desktop/mouse mode after touch.

#### Idle

- When there is no active pointer/touch target, the eye floats gently.
- Idle motion must not overpower user-driven tracking.

---

### 3.2 Animations that must be preserved

Do not remove these animations unless the user explicitly asks for their removal:

1. **Slow periodic flip / capovolgimento lento**
2. **Fast roll/vortex around the pupil axis**
3. **Short periodic vibration / twitch**

These animations are part of the identity of the site. They make the eye feel alive.

If tracking breaks, do not solve it by deleting the animations. Solve it architecturally.

---

### 3.3 Correct architecture

The preferred architecture is a two-layer transform structure:

- **Outer group:** look-at / tracking
  - yaw and pitch toward cursor/touch target
  - scale/hover response
  - dominant user intent

- **Inner group:** living animation layer
  - flip
  - roll/vortex
  - vibration

This prevents the living animations from stealing or locking the look-at axes.

Avoid combining tracking and periodic animations directly on the same transform when the result makes the eye unable to follow pointer/touch input.

---

### 3.4 GLB instance safety

`useGLTF` caches loaded assets. If the same cached `scene` object is rendered directly in multiple `EyeScene` instances, multiple Canvas/layout transitions can contend for the same `Object3D`.

Rule:

- clone the GLB scene per `EyeScene` instance, e.g. `gltfScene.clone(true)` or equivalent.

Reason:

- a `THREE.Object3D` can only have one parent at a time.
- Neo-One can briefly mount multiple eyes during route transitions or layered layouts.
- shared GLB scene instances can cause visual corruption, axis weirdness, or disappearing/reparented models.

---

### 3.5 Known anti-patterns for the 3D eye

Avoid these unless there is a very specific reason and visual testing confirms correctness:

- using a single group for both tracking and all animations;
- making user pointer tracking depend on periodic animation state;
- storing base rotations in `userData` without a clear reset strategy;
- using custom Euler `rotation.order` as a patch for broken transform layering;
- removing flip/roll/vibration to "fix" tracking;
- rendering cached GLB scenes directly without cloning;
- relying only on `mousemove` for mobile/touch behavior;
- allowing mobile synthetic mouse events to override touch state.

---

## 4. Current 3D Eye implementation summary

Primary file:

- `src/components/EyeScene.tsx`

Core responsibilities:

- load optimized GLB: `/occhione-opt.glb`
- clone scene per instance
- track global mouse/touch coordinates relative to each eye container
- manage desktop cursor tracking
- manage mobile touch target with short post-touch fixation
- ignore synthetic mouse events after touch
- render circular Hero text only when requested
- keep Hero click locked until Matrix gateway unlocks
- keep non-Hero eye instances navigable by default

Important routes/components using `EyeScene`:

- `src/app/(frontend)/HeroClient.tsx`
- `src/components/home/ClusterLayout.tsx`
- `src/app/(frontend)/artwork/[nid]/page.tsx`
- `src/app/(frontend)/cluster/[slug]/page.tsx`

When changing `EyeScene`, test at least:

1. `/` landing/Hero flow
2. `/home`
3. one `/artwork/[nid]` page
4. one `/cluster/[slug]` page
5. desktop mouse movement
6. mobile/touch emulation
7. click navigation on non-Hero eye instances
8. Hero lock/unlock behavior

---

## 5. Payload CMS security rules

Follow `AGENTS.md` as the authoritative rule source.

### 5.1 Local API access control

When passing `user` to Payload Local API, always set:

```typescript
overrideAccess: false
```

Incorrect pattern:

```typescript
await payload.find({
  collection: 'posts',
  user: someUser,
})
```

Correct pattern:

```typescript
await payload.find({
  collection: 'posts',
  user: someUser,
  overrideAccess: false,
})
```

Reason:

- Payload Local API bypasses access control by default.
- Passing `user` alone is not enough.

---

### 5.2 Transaction safety in hooks

Inside hooks, always pass `req` to nested operations:

```typescript
await req.payload.create({
  collection: 'audit-log',
  data: {
    docId: doc.id,
  },
  req,
})
```

Reason:

- keeps operations in the same transaction
- prevents partial writes and data corruption risk

---

### 5.3 Prevent hook loops

When a hook updates the same or related collection, use context flags:

```typescript
if (context.skipHooks) return

await req.payload.update({
  collection: 'posts',
  id: doc.id,
  data: {
    views: nextViews,
  },
  context: {
    skipHooks: true,
  },
  req,
})
```

---

### 5.4 Secrets

Never commit:

- database URLs
- Payload secret
- Cloudinary secrets
- Vercel tokens
- admin passwords
- `.env` files
- exported production data containing credentials

Use Vercel dashboard or local environment variables.

---

## 6. Validation rules before commit

Before committing, run at minimum:

```bash
pnpm tsc --noEmit
```

If schema/collection/global changes were made, also run:

```bash
pnpm generate:types
```

If admin components/import map paths changed, also run:

```bash
pnpm generate:importmap
```

If possible, also run:

```bash
pnpm build
```

Known note:

- If `tsconfig.tsbuildinfo` changes only because of local validation, do not include it in the commit unless intentionally required.

---

## 7. Documentation update rules

For each meaningful feature or bugfix, update the relevant docs:

### Always consider

- `CHANGELOG.md`

### If roadmap/state changed

- `MASTER_SPEC.md`

### If UI/interaction behavior changed

- `docs/walkthrough.md`

### If future models need handoff context

- `docs/NEO_ALIGNMENT.md`

### If Neo/user workflow changed

- `docs/NEO_ONBOARDING.md`

### If deployment process changed

- `DEPLOYMENT_CHECKLIST.md`

Documentation should explain:

- what changed
- why it changed
- what future agents must preserve
- what must not be repeated

---

## 8. Versioning workflow

The project has two versioning modes.

### 8.1 Simple versioning

Use when the user asks for a local checkpoint only.

Steps:

1. validate
2. update docs if needed
3. commit locally
4. do not push

### 8.2 Main versioning / production versioning

Use when the user asks to push to main or deploy through Vercel.

Steps:

1. confirm branch is `main`
2. inspect `git status`
3. validate with `pnpm tsc --noEmit`
4. update internal docs
5. ensure no generated/cache-only files are staged accidentally
6. commit with a clear message
7. push to `origin main`
8. Vercel should build automatically

Suggested commit style:

```bash
fix(eye): restore tracking with living animations
```

or:

```bash
docs(alignment): document 3d eye handoff contract
```

For combined code + docs:

```bash
fix(eye): stabilize tracking and document handoff rules
```

---

## 9. Vercel deployment continuity

Vercel is expected to redeploy on push to `origin main`.

After pushing:

1. check that push succeeded
2. wait for Vercel build
3. if build fails, inspect Vercel logs first
4. reproduce locally with `pnpm build` if needed
5. do not make blind production patches without identifying the failing step

Environment variables must be managed in Vercel dashboard, not in Git.

---

## 10. Communication style for future models

The user works visually and strategically. Good responses should be:

- direct
- technical when needed
- honest about risk
- concise but not vague
- in Italian unless the user asks otherwise

When finishing a task, report:

1. files changed
2. validation performed
3. known warnings or limitations
4. next step or deployment status

Avoid:

- empty praise
- hiding failures
- changing scope without permission
- removing key visual behavior as a shortcut
- touching database/destructive operations without explicit approval

---

## 11. Current handoff snapshot — v1.3.0

Current completed fix:

- `EyeScene` desktop and mobile tracking optimized with transform layering.
- GLB cloned per instance to avoid Object3D contention.
- Calendar page fully implemented with horizontal grab-to-scroll.
- SocialBar moved to bottom-center with drag navigation.
- Restricted explosion entrance animation to Hero -> Home transition only.
- Audio refactor: removed banana noise from CRT, implemented `banana.mp3` as global background music.
- EventDetail styled with custom irregular background and high-contrast black text.
- Cloudinary URL resolution fixed via centralized utility.
- **v1.3.1 Fix**: Global text wrapping strategy implemented to prevent word-breaking on resize, with `overflow-x: hidden` on root to prevent horizontal scroll.

Current next product focus from roadmap:

- P3 Mobile Polish
- P4 Audio Experience Improvements
- P5 Checkout / E-commerce finalization

Do not start the next roadmap item unless the user asks to proceed.
