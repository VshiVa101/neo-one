# Site Architecture

Owner: leo

## Purpose

Define the complete site structure for Neo's MVP, maintaining strategic 2-page discipline while using Antigravity-assisted development.

---

## Page Structure

| **Type** | **Page** | **Sections / Content** | **URL** |
| --- | --- | --- | --- |
| 📄 Static 1 | **HOME** |   • Hero Section (Logo + Advisement)
  • Dynamic Gallery (CMS - 30-40 artworks)
  • Navigation Hub (CTA to Calendar)
  • Contact Form button (cart purchases + requests/commissions) | `/` |
| 📄 Static 2 | **CALENDAR** |   • Event Tracker (Drop & Stream)
  • Linktree Hub (external links: Discord, IG, YT)
  • Contact Form button (cart purchases + requests/commissions) | `/calendar` |
| 🖼️ CMS Template | **ARTWORK DETAIL** |   • High-Res Viewer (zoom)
  • Technical Specifications
  • "Add to Cart" Button | `/artwork/{slug}` |

---

## Site Hierarchy

```jsx
🏠 NEO Website (MVP)
│
├─── 📄 HOME (/)
│    │
│    ├─ Hero Section
│    │   └─ Logo + Advisement
│    │
│    ├─ Dynamic Gallery (CMS: 30-40 artworks)
│    │   └─ [Click artwork] ───────────────┐
│    │                                     │
│    └─ Nav (eye)                          │
│        └─ [CTA → Calendar] ─┐            │
│                             │            │
│                             ▼            ▼
├────   📄 CALENDAR(/calendar)           🖼️ ARTWORK DETAIL
     │                                 (CMS Template)                   [Cart]         
     ├─ Event Tracker                  /artwork/{slug}                      │ 
     │   └─ Drop & Stream dates             │                               │ 
     │                                      ├─ High-Res Viewer (zoom)       │ 
     ├─ Linktree Hub┤                       │                               │
     │   └─ [EXIT] Discord,Bandcamp         ├─ Technical Specifications     │ 
     │             Instagram,Etsy           │                               │ 
     │             YouTube,Instagram        └─ [Add to Cart]───────────────→│ 
     │                                                                      │
     └─ Unified Contact Form ◄──────────────────────────────────────────────┴
         ├─ [cart] → Send purchase email to Neo
         └─ [commiss] → Request / Custom commission

```

---

## Architecture Rationale

The site architecture uses Antigravity-assisted HTML/CSS/JS with **Home** and **Calendar** as primary static pages, while artwork details are generated dynamically from **JSON data**.

### NEO - Structural Sitemap (MVP)

**1. HOME (Static Page 1)** `[URL: /]`

- **Hero Section (Logo - Advisement)**
    - Brand Identity & Intro (Centralization of digital presence)
    - *Advisement/Notice*: Key message or "Brand Statement"
- **Dynamic Gallery (Gallery-Shop)**
    - Curated CMS grid (30-40 best artworks)
    - Function: "Showcase" without direct checkout
    - *Interaction:* Clicking on an artwork leads to *CMS Artwork Detail Template*
- **Navigation Hub**
    - Call-to-Action (CTA) or Menu to navigate to **Calendar** page

**2. CALENDAR (Static Page 2)** `[URL: /calendar]` *(Note: Corresponds to the "Follow-up Page")*

- **Event Tracker**
    - Calendar of upcoming Drops and Streams (to manage "FOMO")
- **Linktree Integration**
    - Aggregator of external links (Discord, Instagram, YouTube) integrated into the design
- **Commission Flow (Contact System)**
    - Structured contact form for professional inquiries (replaces e-commerce cart)

**3. ARTWORK DETAIL (JSON-generated)** `[URL: /artwork/{slug}]` *(Dynamic Page)*

- Detailed artwork display (High-Res)
- Technical specifications
- **CTA Inquiry:** Redirects to *Commission Flow* on Calendar page

---

## Update Notes

### Technical Decisions

- **2-Page Strategic Discipline:** The architecture maintains a focused 2-page structure (**Home** and **Calendar**) as a strategic design constraint, with artwork details handled via JSON-generated dynamic pages
- **Gallery-Shop:** The "Shop" is functionally a gallery that directs to the "Commission Flow" for purchase/contact via email

### Integration Strategy

- **Linktree Integration:** Added as a central section of the Calendar page to keep the ecosystem connected
- **Unified Contact Form:** Single form handles both purchase inquiries (with cart data) and custom commission requests

---

## User Flows Reference

<aside>
🔄

**Detailed user flows documented separately**

For complete flow diagrams, personas, and success criteria, see User Flows

**4 Primary Flows:**

- **Discovery & Browsing** — First-time visitor exploring portfolio
- **Purchase** — Collector buying artwork via cart + email
- **Social & FOMO** — Fan checking events and social links
- **Commissions & Requests** — Professional inquiry for custom work
</aside>

---