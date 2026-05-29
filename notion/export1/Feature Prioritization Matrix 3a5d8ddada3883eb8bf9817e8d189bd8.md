# Feature Prioritization Matrix

Owner: leo

## Purpose

Prioritize features based on user impact and technical effort to define clear MVP boundaries.

---

## Prioritization Framework

### User Impact (UI)

- **High (3)**: Directly solves primary user pain point, blocks core user journey if missing
- **Medium (2)**: Enhances experience significantly, supports secondary needs
- **Low (1)**: Nice-to-have, minimal impact on user satisfaction

### Technical Effort (TE)

- **High (3)**: Complex implementation, requires advanced JavaScript or learning new techniques (5+ hours)
- **Medium (2)**: Moderate complexity, standard HTML/CSS/JS patterns (2-5 hours)
- **Low (1)**: Simple, quick implementation using basic web technologies (<2 hours)

**Priority Score = UI / TE** (higher = better ROI)

---

## Feature Matrix

| **Feature** | **User Impact** | **Tech Effort** | **Score** | **Priority** | **Decision** |
| --- | --- | --- | --- | --- | --- |
| **P0 — Critical MVP Features (Must Have)** |  |  |  |  |  |
| Dynamic Gallery (JSON-based) | High (3) | Medium (2) | 1.5 | P0 | **MVP** — Core value prop, JSON data structure |
| Artwork Detail Page (zoom) | High (3) | Medium (2) | 1.5 | P0 | **MVP** — Solves Marco's pain |
| Event Calendar/Tracker | High (3) | Low (1) | 3.0 | P0 | **MVP** — Solves Elena's FOMO |
| Commission Form (custom tone) | High (3) | Low (1) | 3.0 | P0 | **MVP** — Business goal: independence |
| Responsive Design (mobile) | High (3) | Medium (2) | 1.5 | P0 | **MVP** — 60%+ mobile traffic expected |
| Uncensored Hosting | High (3) | Low (1) | 3.0 | P0 | **MVP** — Brand differentiator |
| **P1 — High-Value MVP Features (Should Have)** |  |  |  |  |  |
| Rich Artwork Descriptions | High (3) | Low (1) | 3.0 | P1 | **MVP** — Solves Sabrina's context need |
| Custom Cursor Hover States | Medium (2) | Medium (2) | 1.0 | P1 | **MVP** — Atmosphere feature (validation needed) |
| Symbolism-based Navigation | Medium (2) | Medium (2) | 1.0 | P1 | **MVP** — Brand consistency |
| Linktree Hub (external links) | Medium (2) | Low (1) | 2.0 | P1 | **MVP** — Low effort, high utility |
| Informal Event Copy/Tone | Medium (2) | Low (1) | 2.0 | P1 | **MVP** — Content strategy (no dev) |
| **P2 — Nice-to-Have MVP Features (Could Have)** |  |  |  |  |  |
| Thematic Soundtrack | Medium (2) | High (3) | 0.67 | P2 | **Conditional MVP** — Test tech feasibility first |
| No Cookies Policy Badge | Low (1) | Low (1) | 1.0 | P2 | **MVP** — Easy win for brand |
| Cart System (multi-item) | Low (1) | High (3) | 0.33 | P2 | **Simplified MVP** — Email-based instead |
| **Post-MVP — Future Enhancements** |  |  |  |  |  |
| Artistic Evolution Timeline | Medium (2) | High (3) | 0.67 | Post-MVP | Serves secondary persona (Marco) |
| Dedicated Study Page | Low (1) | High (3) | 0.33 | Post-MVP | Scope creep, niche audience |
| Comment System (conversation) | Medium (2) | High (3) | 0.67 | Post-MVP | Content control risk, moderation burden |
| Community Features (forums) | Low (1) | High (3) | 0.33 | Post-MVP | Out of scope: Neo as platform |
| Social Proof (purchase reviews) | Medium (2) | Medium (2) | 1.0 | Post-MVP | Needs purchase volume first |
| Advanced Search/Filtering | Low (1) | Medium (2) | 0.5 | Post-MVP | Overkill for 30-40 artworks |
| Publishing Platform (collaborations) | Low (1) | High (3) | 0.33 | Post-MVP | Vision feature, not launch need |

---

## MVP Scope Summary

### Must-Have (P0) — 6 features

**Non-negotiable for launch:**

- Dynamic Gallery (CMS)
- Artwork Detail Page with zoom
- Event Calendar/Tracker
- Commission Form (custom tone)
- Responsive Design
- Uncensored Hosting

**Rationale:** These features directly solve the three primary user pain points (Marco's quality access, Sabrina's context need, Elena's FOMO) and business goals (independence from Etsy).

### Should-Have (P1) — 5 features

**High value, include if time permits:**

- Rich Artwork Descriptions
- Custom Cursor Hover States
- Symbolism-based Navigation
- Linktree Hub
- Informal Event Tone

**Rationale:** These features enhance the experience and brand differentiation but aren't blockers for core user journeys. Most are low-effort.

### Could-Have (P2) — 3 features

**Nice-to-have, cut if timeline pressures:**

- Thematic Soundtrack (conditional on tech validation)
- No Cookies Policy Badge
- Cart System → **Simplified to email-based flow**

**Rationale:** Lower ROI due to high effort or low impact. Soundtrack requires feasibility check before committing.

### Post-MVP — 7 features

**Explicitly out of scope for Week 8 launch:**

- Artistic Evolution Timeline
- Dedicated Study Page
- Comment/Conversation System
- Community Features
- Social Proof Reviews
- Advanced Search/Filtering
- Publishing Platform

**Rationale:** These features either serve secondary personas, require content volume to be valuable, or represent scope creep into platform territory beyond Neo's capacity.

---

## Technical Feasibility Flags

### Validation Required Before Wireframing

**🚩 Thematic Soundtrack:**

- **Risk:** Audio autoplay policies and user experience considerations
- **Action:** Research HTML5 audio best practices + test with sample implementation
- **Fallback:** Drop to Post-MVP if tech blocker confirmed

**🚩 Custom Cursor Hover States:**

- **Risk:** Custom cursor requires CSS/JS and cross-browser compatibility testing
- **Action:** Test cursor override with vanilla JavaScript
- **Fallback:** Simplify to standard hover effects (color change, scale)

**🚩 High-Res Zoom (Artwork Detail):**

- **Risk:** Large image files (2000px+) may slow page load on mobile
- **Action:** Implement lazy loading + test performance on 3G connection
- **Fallback:** Optimize images to 1500px max, accept reduced zoom depth

---

## Design Implications

### For Paper Wireframes

**Focus wireframe variations on P0 features only:**

- Homepage: Gallery layout + navigation to Calendar
- Calendar Page: Event list + Linktree + Form CTA
- Artwork Detail: Image viewer + zoom interaction + Add-to-cart

**Defer P1/P2 details:**

- Don't wireframe soundtrack controls yet (tech validation needed)
- Don't design custom cursors in wireframes (visual polish phase)
- Show placeholder for descriptions, finalize tone in copy phase

### For Prototype (Week 4)

**High-fidelity mockups should include:**

- P0 features: fully designed and interactive
- P1 features: designed if time permits, interactive if easy
- P2 features: skip unless trivial to add

### Metrics for Usability Testing

**P0 features must meet these thresholds:**

- **Gallery browsing:** 85%+ users successfully find and click artwork
- **Event discovery:** 90%+ users find next event date in <30 seconds
- **Commission flow:** 80%+ users successfully submit form
- **Mobile experience:** 100% P0 features functional on mobile (no critical bugs)

**P1/P2 features:** Test if time allows, but failing metrics don't block launch

---