# Data Cluster Syntex

Owner: leo

(2-3)

# 📊 UX Research Synthesis

**Method:** 7 semi-structured interviews • **Duration:** 30-60 min • **Dates:** Jan 6-9, 2026

---

## Key Research Questions & Answers

| # | **Question** | **Finding** |
| --- | --- | --- |
| 1 | How does platform fragmentation affect emotional connection? | Fragmentation creates frustration. Censorship (Instagram) and inability to zoom diminish the immersive experience users crave. Centralization is validated. |
| 2 | What trust signals are needed before purchasing? | (1) Dimensions/materials, (2) Shipping method, (3) Scarcity/limited edition, (4) Personal touch (signature, story). Authenticity > polish. |
| 3 | Archive (utility) or Experience (entertainment)? | **Both.** Users need searchable archive AND immersive viewing. Dual-mode navigation required. |

---

## Critical Pain Points

| **Pain Point** | **Severity** | **Evidence** | **MVP Solution** |
| --- | --- | --- | --- |
| Cannot zoom on artwork details | 🔴 Critical | 5/7 participants | High-res lightbox viewer with pinch-zoom |
| Content scattered across platforms | 🔴 Critical | 6/7 participants | Centralized, uncensored gallery |
| Mobile-first consumption | 🔴 Critical | 6/7 use mobile primarily | Mobile breakpoint = design priority #1 |
| FOMO on events/updates | 🟠 High | 4/7 missed events | Event calendar with iCal export |
| Difficulty finding old artworks | 🟡 Medium | 4/7 mentioned | Filter by year/style/series |

---

## User Behavior Patterns

| **Category** | **Insight** | **Design Implication** |
| --- | --- | --- |
| **Device Usage** | 6/7 mobile-first (daily check-ins, sharing) <br> Desktop for deep dives & purchases | Mobile breakpoints critical; desktop optimized for detail viewing |
| **Platform Habits** | YouTube primary (7/7) <br> Instagram reluctant (censorship frustration) <br> Discord for community only | YouTube embed/link prominent; Instagram not critical; Discord separate |
| **Content Priority** | (1) Visual impact on entry (5/7) <br> (2) Gallery access (6/7) <br> (3) Navigation to sections | Hero with bold artwork; gallery accessible within 1 click |
| **Emotional Response** | "Overwhelming/immersive" experience <br> Frustrated by platform limits <br> Small community intimacy valued | Dark backgrounds, minimal chrome around art; preserve Discord exclusivity |

---

## Brand Perception

| **Style Descriptors** | **Color Associations** | **Metaphors** |
| --- | --- | --- |
| • Transgressive/Hardcore (4/7) <br> • Detailed/Technical (4/7) <br> • Dark/Mysterious (3/7) <br> • Overwhelming (2/7) | **Duality confirmed:** <br> Black/white/gray + Neon pink/green <br> → Dark base + vibrant accents | Lava lamp (hypnotic, warm) <br> Rough texture objects <br> LSD tab (psychedelic) <br> → Tactile, provocative, immersive |

---

## Commerce & Trust Requirements

### Pre-Purchase Information (Priority Order)

| **Priority** | **Information** | **Quote Evidence** |
| --- | --- | --- |
| 🔴 Critical | Dimensions, Materials, Shipping method | *"Come me lo spediscono? In un tubo?"* (Scazzo) |
| 🟠 High | Limited edition info, Price | *"Un pezzo numerato e non ristampato"* (Scazzo) |
| 🟡 Medium | Story behind artwork, Certificate | *"Un bigliettino con un grazie, una firma"* (Charlie) |

### Authenticity Signals

**Physical:** Signature • Certificate • Edition numbering (e.g., "15/50")

**Material:** Paper > plastic • Quality packaging

**Emotional:** Artist's story • Personal note • Scarcity

---

## Proto-Personas

| **Persona** | **Age** | **Behavior** | **Pain Point** | **Priority Need** |
| --- | --- | --- | --- | --- |
| **Detail Seeker** <br> *(Sabrina, Charlie)* | 25-35 | Desktop + mobile <br> Studies technique | Can't zoom/appreciate details | High-res zoom, complete archive |
| **Community Member** <br> *(Scazzo, Alexis, MK)* | 18-25 | Mobile-first <br> Event-focused | Misses announcements | Event calendar, collaboration opps |
| **Casual Fan** <br> *(Enola)* | 16-20 | Mobile-only <br> Algorithm-driven | Doesn't know where to find content | Easy sharing, chronological view |

---

## MVP Feature Validation

| **Feature** | **User Demand** | **Status** | **Notes** |
| --- | --- | --- | --- |
| High-res Gallery + Zoom | 5/7 critical mentions | ✅ Must-Have | Dark bg, WebP, lazy load |
| Uncensored Archive | 4/7 + censorship complaints | ✅ Must-Have | Competitive advantage |
| Mobile-Optimized UI | 6/7 mobile-first | ✅ Must-Have | 44x44px touch targets |
| Event Calendar | 4/7 FOMO mentions | ✅ Must-Have | Advance notice, iCal export |
| Shop w/ Trust Signals | All interested | ✅ Must-Have | Dimensions, materials, scarcity |
| Filter: Year/Style | 4/7 mentioned | ✅ Should-Have | "Evolution view" |
| Music Section | 3/7 strong interest | ⚠️ Phase 2 | Not launch-critical |

---

## Design Principles

| **Principle** | **Implementation** |
| --- | --- |
| **Dual-Mode Experience** | Archive mode (searchable, filterable) + Immersive mode (curated, full-screen) |
| **Mobile-First** | Design/test mobile → scale to desktop (not reverse) |
| **Detail Obsession** | Minimum 2000px images, lightbox zoom, dark backgrounds |
| **Raw Authenticity** | No corporate polish, preserve artist voice, accept imperfection |
| **Trust Through Transparency** | Show dimensions, materials, shipping, scarcity clearly |

---

## Anti-Patterns (Do NOT Include)

❌ Comment sections on artworks → toxicity risk

❌ Replicate Discord → community lives there

❌ Auto-play media → disruptive

❌ Account required to browse → friction

❌ Over-explain artworks → kills mystery

---

## Visual Design Direction

**Color Palette:**

![palette.png](palette.png)

Base: #000000 (deep black)-#FFFFFF (stark white)
Accent 1: #FF66CC(bubble gum fizz)

Accent 2: #FF0080(Neon Pink)
Accent 2:  #66FF00 (neon grass)

**Typography:** Custom handwritten (Neo) + Clean sans-serif

**Layout:** Minimal chrome, 90s web nostalgia, bold contrast

**Mobile Grid:** 2 columns → Desktop: 3-4 columns

![Screenshot 2026-01-14 162730.png](Screenshot_2026-01-14_162730%201.png)

![Screenshot 2026-01-14 162711.png](Screenshot_2026-01-14_162711%201.png)

---