# Walkthrough - UI & Interaction Refinements

This walkthrough summarizes the latest improvements made to the Neo-One Art Hub, focusing on 3D eye behavior, mobile responsiveness, and UI consistency.

## 3D Eye Improvements

- **Mobile Pointing Precision**: Increased the rotation magnitude on mobile touch events (`Math.PI / 2` instead of `Math.PI / 4`) to ensure the pupil accurately points to the edges of the screen upon interaction.
- **Vortex & Flip Synchronization**: Fixed the rotation order to `YXZ` to enable a clean Z-axis roll (vortex) regardless of the eye's target orientation.

## Artwork Detail Interface

- **Button Uniformity**: All UI buttons (Prev, Next, Back, Info, Cart) have been set to a consistent size (`50px` on mobile, `70px` on desktop) for a balanced, premium feel.
- **Pre-order Alignment**: Adjusted the height of the pre-order image button to match the circular buttons, ensuring perfect alignment in the bottom bar.
- **Info Flip**: Relocated the info toggle to the bottom bar, keeping the main artwork view clean.

## Home & Clusters

- **Deck Hover Interaction**: In the expanded cluster view, mazzis (decks) now come to the foreground simply by hovering over them, removing the need to drag the mouse to the screen margins.
- **BrandedTitle Component**: Introduced a new `BrandedTitle` component that ensures consistent Neo-ONE branding (uppercase/colored O, N, E) for cluster titles and other headers.

## Documentation Versioning

- Added this walkthrough to track implementation details.
- Pushed all changes to `main`.
