# Add Quantity Controls and Improve Cart Layout

This plan outlines the changes to `src/contexts/CartContext.tsx` to add quantity management for products and refine the cart's user interface.

## Proposed Changes

### [Component Name] [CartContext](file:///c:/Users/leon9/Desktop/neo-one-def-vibed/src/contexts/CartContext.tsx)

#### [MODIFY] [CartContext.tsx](file:///c:/Users/leon9/Desktop/neo-one-def-vibed/src/contexts/CartContext.tsx)
- **Update Interfaces**:
    - Add `quantity: number` to `CartItem`.
    - Add `updateQuantity: (nid: string, delta: number) => void` to `CartContextType`.
- **Logic Updates**:
    - Modify `addToCart`: If item exists, increment `quantity`.
    - Implement `updateQuantity`: Adjust quantity and remove item if it reaches 0.
- **UI Enhancements**:
    - **Quantity Controls**: Add "+" and "-" buttons to the items in the cart's top bar.
    - **Centering & Gaps**:
        - Use `mx-auto` and better flexbox/grid alignment to center the cart content.
        - Add responsive padding (`p-6 md:p-12 lg:p-20`) to create a gap from the viewport edges.
        - Ensure the items list scrolls horizontally if needed or wraps elegantly.
    - **Aesthetics**: Use premium styles (glassmorphism, subtle borders, micro-animations) for the new controls.

## Verification Plan

### Automated Tests
- N/A (Manual verification is more appropriate for UI/UX changes).

### Manual Verification
1. Open the cart.
2. Add a product and verify it appears with quantity 1.
3. Add the same product again and verify quantity becomes 2.
4. Click "+" and "-" in the cart to change quantity.
5. Verify item is removed when quantity reaches 0.
6. Check responsiveness by resizing the browser window.
7. Confirm the cart content is centered and has appropriate gaps from the edges.
