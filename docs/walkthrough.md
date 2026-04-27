# Walkthrough - UI & Interaction Refinements

This walkthrough summarizes the latest improvements made to the Neo-One Art Hub, focusing on 3D eye behavior, mobile responsiveness, and UI consistency.

## 3D Eye Improvements

- **Tracking Architecture Fix**: The 3D eye now uses a two-layer transform model:
  - outer group = look/tracking toward cursor or touch target;
  - inner group = living animations (flip, roll/vortex, vibration).
  This prevents periodic animations from stealing or locking the look-at axes.
- **Desktop Cursor Tracking**: Desktop input updates from global mouse movement and mouse down events, so the eye continuously follows the cursor and also responds immediately to clicks.
- **Mobile Touch Tracking**: Mobile input updates from `touchstart`, `touchmove`, `touchend`, and `touchcancel`. The eye points to the user touch while the finger is active, remains fixed for ~1 second after release, then returns to idle floating.
- **Synthetic Mouse Guard**: Mobile browsers can emit fake mouse events after touch. These are ignored briefly after touch so the eye does not get stuck in desktop/mouse mode.
- **GLB Instance Safety**: The GLB scene is cloned per `EyeScene` instance. This avoids shared `Object3D` conflicts when multiple eyes exist during route transitions or layered layouts.
- **Living Animations Preserved**: The slow flip, fast pupil-axis roll/vortex, and periodic vibration remain active, but they run only on the inner animation group so the eye stays alive without breaking tracking.

## Artwork Detail Interface

- **Button Uniformity**: All UI buttons (Prev, Next, Back, Info, Cart) have been set to a consistent size (`50px` on mobile, `70px` on desktop) for a balanced, premium feel.
- **Pre-order Alignment**: Adjusted the height of the pre-order image button to match the circular buttons, ensuring perfect alignment in the bottom bar.
- **Info Flip**: Relocated the info toggle to the bottom bar, keeping the main artwork view clean.

## Home & Clusters

- **Deck Hover Interaction**: In the expanded cluster view, mazzis (decks) now come to the foreground simply by hovering over them, removing the need to drag the mouse to the screen margins.
- **BrandedTitle Component**: Introduced a new `BrandedTitle` component that ensures consistent Neo-ONE branding (uppercase/colored O, N, E) for cluster titles and other headers.

## Documentation Versioning

- Keep this walkthrough aligned with interaction-level implementation details that future models must preserve.
- For the 3D eye, never remove the living animations unless explicitly requested. If tracking breaks, prefer separating transform layers instead of deleting motion.
- Before pushing to `main`, verify `pnpm tsc --noEmit`, update internal docs, and confirm only intentional files are staged.
