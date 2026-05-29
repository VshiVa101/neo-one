# User Flows

Owner: leo

## Purpose

Document the primary user journeys through the Neo MVP site, showing how users accomplish key tasks from entry to completion.

---

## Overview

Based on research with Marco (fan/collector), Sabrina (event organizer), and Elena (publisher/curator), we identified **4 primary user flows** that the MVP must support:

1. **Discovery Flow** — First-time visitor exploring Neo's work
2. **Purchase Flow** — Collector buying artwork via email-based cart
3. **Social/FOMO Flow** — Fan checking upcoming events and social links
4. **Commission Flow** — Professional inquiry for custom work

<aside>
⚙️

**Technical Approach:** Hand-coded HTML/CSS/JS = 2 static pages (Home + Calendar) + JSON-based dynamic generation (Artwork Detail)

</aside>

---

## Flow 1: Discovery & Browsing

- User Goal & Persona
    
    **As a** first-time visitor or returning fan
    
    **I want to** explore Neo's artwork in a curated gallery
    
    **So that** I can discover new pieces and appreciate the full portfolio
    
    **Primary Persona:** **Marco** (Fan/Collector) — "I want to see everything Neo has created, organized and easy to browse."
    
- Flow Steps
    
    ```jsx
    1. User arrives at site URL
       ↓
    2. Landing Screen: Advisement/Intro Video
       │  (sets tone, filters audience, establishes brand)
       ↓
    3. User clicks "Enter" / Eye icon
       ↓
    4. HOME page loads
       │  • Hero Section (Logo + Brand Statement)
       │  • Dynamic Gallery Grid (30-40 artworks from CMS)
       ↓
    5. User browses gallery (scroll, hover for preview)
       ↓
    6. User clicks on artwork thumbnail
       ↓
    7. ARTWORK DETAIL page (CMS template)
       │  • High-res viewer with zoom
       │  • Technical specs (year, medium, dimensions)
       │  • Action panel: [Add to Cart] [Back to Gallery]
       ↓
    8. User clicks "Discovery" / Zoom button
       ↓
    9. Full-screen hi-res view
       ↓
    10. User returns to gallery or explores more artworks
    ```
    
- Key Interactions & Success Criteria
    
    
    **Key Interactions:**
    
    - **Gallery Grid:** Masonry layout, hover states, lazy loading
    - **Artwork Card:** Thumbnail → Preview overlay → Full detail page
    - **Navigation:** Persistent eye icon (symbolic nav), back button
    - **Zoom Viewer:** Click to zoom, pan to explore details
    
    **Success Criteria:**
    
    - User can browse all 30-40 artworks without friction
    - High-res images load smoothly (optimized WebP)
    - Navigation is intuitive (no dead ends)
    - Artwork details are comprehensive (year, medium, story)

---

## Flow 2: Purchase

- User Goal & Persona
    
    **As a** collector or buyer
    
    **I want to** select artwork and send a purchase request to Neo
    
    **So that** I can acquire pieces I'm interested in
    
    **Primary Persona:** **Marco** (Fan/Collector) — "I want a simple way to buy prints or originals without complex checkout."
    
- Flow Steps
    
    ```jsx
    1. User browses Dynamic Gallery on HOME
       ↓
    2. User clicks on artwork thumbnail
       ↓
    3. ARTWORK DETAIL page loads
       │  • High-res viewer
       │  • Specs & pricing info (if available)
       │  • [Add to Cart] button
       ↓
    4. User clicks [Add to Cart]
       │  → Artwork added to session cart (visual feedback)
       ↓
    5. User continues browsing or proceeds to checkout
       │  (Cart icon shows count: "2 items")
       ↓
    6. User clicks [Cart] icon or [Contact] button
       ↓
    7. CONTACT FORM modal/section appears
       │  Unified form for all inquiries:
       │  • Name, Email, Message fields
       │  • Cart contents auto-included if present
       │  • Same form structure for purchase/commission/general
       ↓
    8. User fills out form and clicks [Send]
       ↓
    9. Email sent to Neo with cart details
       ↓
    10. User receives confirmation message
        "Neo will contact you within 24-48 hours with payment details."
       ↓
    11. Neo replies via email with payment link
       ↓
    12. User completes payment (external flow: PayPal/Stripe)
       ↓
    13. User receives confirmation + tracking code (if applicable)
    ```
    
- Key Interactions & Success Criteria
    
    
    **Key Interactions:**
    
    - **Add to Cart:** Instant feedback (animation, cart count update)
    - **Cart Persistence:** Session-based (no login required)
    - **Contact Form:** Unified multifunctional form
        - Single form structure for all scenarios
        - Cart contents automatically included in email if present
        - Works for purchase, commission, and general inquiries
    - **Email Flow:** Automated confirmation, manual Neo response
    
    **Success Criteria:**
    
    - User can browse all 30-40 artworks without friction
    - Form validation prevents incomplete submissions
    - Cart contents are clearly displayed in email to Neo
    - User receives immediate feedback ("Message sent!")

---

## Flow 3: Social & FOMO

- User Goal & Persona
    
    **As a** fan or community member
    
    **I want to** check upcoming events and connect on social platforms
    
    **So that** I don't miss new drops, streams, or Discord announcements
    
    **Primary Persona:** **Elena** (FOMO-driven follower) — "I need to know when Neo is releasing new work or going live."
    
- Flow Steps
    
    ```jsx
    1. User lands on HOME page
       ↓
    2. User sees Eye icon navigation
       ↓
    3. User clicks Eye → opens nav menu
       │  • [Home] (current)
       │  • [Calendar] ← destination
       ↓
    4. CALENDAR page loads
       │  • Event Tracker (upcoming drops & streams)
       │  • Linktree Hub (social links)
       │  • Contact Form (optional)
       ↓
    5. User browses Event Tracker
       │  • Next Drop: Feb 15, 2026 — "Dark Series Vol. 2"
       │  • Next Stream: Feb 10, 2026 — YouTube Live Drawing
       ↓
    6. User clicks [Share] icon to share event
       │  → Opens native share sheet (Twitter, IG, copy link)
       ↓
    7. User scrolls to Linktree Hub
       │  • Discord (community)
       │  • Instagram (portfolio updates)
       │  • YouTube (streams & timelapses)
       │  • Bandcamp (soundtrack/music)
       │  • Etsy (prints shop)
       ↓
    8. User clicks external link (e.g., Discord)
       │  → Opens in new tab (exits site)
    ```
    
- Key Interactions & Success Criteria
    
    
    **Key Interactions:**
    
    - **Eye Icon Navigation:** Symbolic, brand-aligned, hover reveals labels
    - **Event Tracker:** Calendar view or list format, upcoming dates highlighted
    - **Share Button:** Native browser share API (mobile-friendly)
    - **Linktree Hub:** Icon grid with labels, external links open in new tab
    
    **Success Criteria:**
    
    - User can quickly find upcoming event dates
    - Social links are clearly labeled and functional
    - Share feature works on mobile and desktop
    - Design maintains Neo's brand (dark, atmospheric, symbolic)

---

## Flow 4: Commissions & Requests

- User Goal & Persona
    
    **As a** event organizer or publisher
    
    **I want to** send a custom commission or collaboration request to Neo
    
    **So that** I can hire Neo for professional work
    
    **Primary Persona:** **Sabrina** (Event Organizer) — "I need to commission Neo for event posters and merch designs."
    
- Flow Steps
    
    ```jsx
    1. User browses HOME gallery
       │  (sees Neo's style, confirms fit for project)
       ↓
    2. User clicks [?] button or [Contact] link
       │  (visible in nav or footer)
       ↓
    3. CONTACT FORM modal/section appears
       │  • Name, Email (required)
       │  • Subject: [Dropdown] → "Commission / Custom Work"
       │  • Message: [Textarea] for project details
       │  • Attach Files (optional: reference images, brief)
       ↓
    4. User fills out form:
       │  • Name: "Sabrina Rossi"
       │  • Email: "sabrina@festivalxyz.com"
       │  • Subject: "Commission Request"
       │  • Message: "Hi Neo, I organize the XYZ Festival and need..."
       ↓
    5. User clicks [Send]
       ↓
    6. Form validation checks (all required fields filled)
       ↓
    7. Email sent to Neo with inquiry details
       ↓
    8. User receives confirmation:
       "Thanks for reaching out! Neo will reply within 24-48 hours."
       ↓
    9. Neo replies via email with:
       │  • Availability
       │  • Pricing estimate
       │  • Portfolio examples relevant to request
       ↓
    10. User and Neo continue conversation via email
        (negotiation, contract, project kickoff)
    ```
    
- Key Interactions & Success Criteria
    
    
    **Key Interactions:**
    
    - **Contact Button:** Persistent in nav or sticky footer
    - **Form Fields:** Minimal but sufficient (name, email, subject, message)
    - **Subject Dropdown:** Pre-defined options (Commission, Purchase, General)
    - **File Attachment:** Optional (for briefs, reference images)
    - **Confirmation Message:** Immediate feedback ("Message sent!")
    
    **Success Criteria:**
    
    - Form is easy to find (no hidden "Contact" page)
    - Validation prevents spam (reCAPTCHA or honeypot)
    - Neo receives structured emails (clear subject, sender info)
    - User knows what to expect (response time, next steps)

---

## Flow Intersections & Edge Cases

- Cross-Flow Scenarios
    
    **Scenario 1: Discovery → Purchase**
    
    - User browses gallery → clicks artwork → adds to cart → sends purchase email
    - **Key touchpoint:** Artwork Detail page must clearly show [Add to Cart]
    
    **Scenario 2: Social → Discovery**
    
    - User checks Calendar for event → clicks back to Home → browses related artwork
    - **Key touchpoint:** Navigation must allow easy return to Home from Calendar
    
    **Scenario 3: Commission → Discovery**
    
    - User arrives via referral → browses portfolio → sends commission request
    - **Key touchpoint:** Gallery must showcase range/style before Contact form

**Error States**

**Empty Cart Checkout:**

- User clicks [Contact] without cart items → Same unified form opens
- **Solution:** Form structure remains consistent; cart data simply absent from email if empty

**Failed Form Submission:**

- Network error or validation failure → Show error message + retry button
- **Solution:** Client-side validation + error handling

**Dead Link in Linktree:**

- External link (Discord, IG) is broken → User sees 404
- **Solution:** Periodic link checking, fallback message if link fails

---

## Design Implications for Wireframes

- Homepage Must Include
    - [ ]  Hero Section (Logo + Advisement)
    - [ ]  Dynamic Gallery Grid (masonry layout, hover states)
    - [ ]  Eye Icon Navigation (persistent, symbolic)
    - [ ]  Cart Icon (shows item count)
    - [ ]  Contact Button (sticky or in footer)
- Calendar Page Must Include
    - [ ]  Event Tracker (upcoming drops/streams)
    - [ ]  Linktree Hub (social platform icons + labels)
    - [ ]  Share Button (per event or global)
    - [ ]  Contact Form (for commissions)
- Artwork Detail Page Must Include
    - [ ]  High-Res Viewer (zoom, pan)
    - [ ]  Technical Specs (year, medium, dimensions)
    - [ ]  [Add to Cart] Button (clear CTA)
    - [ ]  [Back to Gallery] Navigation
    - [ ]  Related Artworks (optional: "You might also like...")
- Contact Form Must Include
    - [ ]  Name, Email (required)
    - [ ]  Subject Dropdown (Commission, Purchase, General)
    - [ ]  Message Textarea
    - [ ]  Cart Contents Display (if applicable)
    - [ ]  [Send] Button + Confirmation Message

---