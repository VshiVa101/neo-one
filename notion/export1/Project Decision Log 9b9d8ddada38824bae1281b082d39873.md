# Project Decision Log

Owner: leo

# Purpose

This page documents strategic decisions made during the Neo-one project development. Each entry explains the context, options considered, rationale, and impact of key choices that shaped the project's final form.

---

## Decisions Log

### Week 1 - Kickoff & Empathize

- **Zero-Budget Constraint as Portfolio Strength** | Week 1 Kickoff | Impact: **Critical**
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Accept zero-budget constraint and frame it as portfolio strength rather than limitation | • Solo designer + Student status
    • Neo's financial constraints (emerging artist)
    • Portfolio case study requirements
    • Industry reality: Most startups = limited budget | **A**: Delay project until budget available
    ✓ Better tools ✗ No timeline
    
    **B**: Request Neo invest in tools
    ✓ Premium features ✗ Financial burden on client
    
    **C**: Embrace constraint as case study narrative
    ✓ Realistic problem-solving showcase ✗ Technical limitations | **Portfolio strategy:** Hiring managers value resourcefulness over tool budgets. Real constraint = real problem-solving showcase.
    
    **Tools selected:**
    • Figma Free (professional-grade prototyping)
    • Webflow Starter (CMS + hosting)
    • Notion (project hub)
    
    **Narrative advantage:** "Delivered professional site with $0 budget" demonstrates ROI thinking and constraint-driven design. | • **Defines entire project scope** (2-page limit, CMS-driven architecture)
    • **Portfolio differentiator** vs. theoretical exercises
    • **Career skill:** Working within constraints = daily reality for designers
    • **All subsequent decisions flow from this** |
- **Google UX Methodology as Framework** | Week 1 Kickoff | Impact: **Critical**
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Follow Google UX Design Certificate methodology (Design Thinking + Product Lifecycle) |   • Learning context: Paused Coursera certificate
      • Portfolio goal: Demonstrate industry-standard process
      • Neo's trust: Needed methodology credibility
      • Job market: Employers expect structured process | **A**: Freestyle/ad-hoc design process
    ✓ Flexibility ✗ No credibility, hard to document
    
    **B**: Lean UX only
    ✓ Fast iteration ✗ Skips research rigor
    
    **C**: Google UX standards (Design Thinking + Lean UX hybrid)
    ✓ Rigorous + Agile ✗ Longer timeline | **Belief in methodology:** Trust in Google's forma mentis and processes as industry-leading approach.
    
    **Portfolio credibility:** Hiring managers recognize Google standards. Certificate completion = job application strength.
    
    **Process documentation:** Every phase produces portfolio artifacts (personas, journeys, wireframes, usability studies).
    
    **Learning goal:** This IS the final certificate project—must demonstrate mastery.
    
    **Phases enforced:**
    1. Empathize (interviews, empathy maps)
    2. Define (personas, problem statements)
    3. Ideate (competitive audit, HMW, sketching)
    4. Prototype (lo-fi → hi-fi)
    5. Test (usability study on live staging site) |   • **Governs 9-week roadmap structure**
      • **Portfolio quality:** Rich case study narrative with documented process
      • **Certificate completion:** Real project fulfills course requirement
      • **Career positioning:** "Google-certified methodology" on resume
      • **All deliverables trace to this framework** |
- **Webflow Development Platform** | Week 1-3 (Jan 2026) | Impact: **High** — *Initial decision, later revised Week 4*
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Use Webflow Starter plan for no-code development with code customization capability |   • Zero-budget constraint
      • Timeline: 9 weeks (design + dev)
      • Learning goal: T-shaped designer (UX + front-end depth)
      • Need for deployment solution | **A**: Webflow (no-code + custom code)
    ✓ Visual dev, code export, hosting ✗ Starter plan limits, platform lock-in
    **B**: WordPress
    ✓ Popular CMS ✗ Requires hosting/plugins, security overhead
    **C**: Hand-code from scratch
    ✓ Full control ✗ Steeper learning curve, hosting complexity | **Google UX Certificate recommendation:** Webflow taught in course as industry-standard tool.
    **Code customization depth:** Webflow allows custom HTML/CSS/JS injection → showcase front-end developer capabilities beyond visual design.
    **Integrated hosting:** Fast, secure, zero-configuration deployment included in free tier.
    **Learning efficiency:** Visual dev accelerates prototyping while custom code sections demonstrate technical skill. |   • **Set initial architecture:** 2-page limit drove CMS-first IA
      • **Tool learning investment:** Week 1-3 spent mastering Webflow
      • **Portfolio positioning:** Positioned as "designer who codes"
      • **Later revised:** See Week 4 strategic pivot to Antigravity |
- **Discord Community as Research Source** | Week 1 - Empathize | Impact: **High**
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Recruit 5-7 users from Neo's Discord community for user interviews |   • Zero budget = can't pay participants
      • Timeline: Week 1 only for recruitment + interviews
      • Neo's audience: Active Discord community (fans, event attendees)
      • Research goal: Understand real user needs vs. assumptions | **A**: Guerrilla testing (random people)
    ✓ Diverse sample ✗ Not actual target users
    
    **B**: Paid participants ([UserTesting.com](http://UserTesting.com))
    ✓ Professional setup ✗ $$$, not Neo's real audience
    
    **C**: Neo's Discord community
    ✓ Real users, engaged, free ✗ Potential bias (already fans) | **Authenticity:** These ARE the users. Neo's Discord = target audience (fans, event-goers, collectors).
    
    **Access:** Neo recruits via Discord announcement. Personal connection = higher participation rate.
    
    **Bias mitigation:** Interview protocol designed to surface pain points, not just praise. Asked about frustrations with current platforms (YouTube, Instagram, Etsy).
    
    **Result:** 7 interviews conducted → 3 distinct personas emerged (Marco, Sabrina, Elena). |   • **Personas grounded in real data** (not assumptions)
      • **Validated business goals** (centralization, event FOMO, commission flow)
      • **Portfolio credibility:** Real user research documented with evidence
      • **Risk mitigated:** Early validation prevented building wrong features |

---

### Week 2 - Define

- **3-Persona Strategy: Sabrina Primary, Marco + Elena Secondary** | Week 2 - Define | Impact: **High**
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Create 3 distinct personas with **Sabrina (Immersive Seeker)** as primary focus for MVP |   • User research: 7 interviews clustered into 3 user groups
      • MVP constraint: Can't serve all needs equally in 9 weeks
      • Timeline: Prioritization essential
      • Business goal: Balance fan engagement + sales + professional reach | **A**: Single persona (Sabrina only)
    ✓ Laser focus ✗ Ignores other user segments
    
    **B**: 5+ personas (full audience map)
    ✓ Comprehensive ✗ Scope creep, no focus
    
    **C**: 3 personas (1 primary + 2 secondary)
    ✓ Balanced scope, phased approach ✗ Requires feature prioritization discipline | **Research insight:** 3 distinct behavioral patterns emerged from interviews:
      • **Sabrina** (Immersive Seeker): Emotional connection, contemplative browsing, atmosphere-driven
      • **Marco** (Rebellious Apprentice): Study tool, technique deep-dive, archive needs
      • **Elena** (Event Organizer): Professional inquiry, event booking, quick access
    
    **MVP prioritization logic:** Sabrina represents largest user segment (fans/collectors) AND her needs drive brand differentiation (atmosphere, contemplation vs. transactional platforms like Etsy).
    
    **Phased strategy:** Marco + Elena needs addressed in post-MVP (searchable archive, advanced filters, professional inquiry forms). |   • **Focused MVP scope:** Atmospheric features prioritized (soundtrack, hover states, symbolism)
      • **Portfolio narrative:** Demonstrates user segmentation + prioritization skills
      • **Future roadmap clarity:** Marco/Elena = Phase 2 features already identified
      • **Design decisions traceable:** Every choice references Sabrina's journey |

---

### Week 3 - Ideate

- **Mobile-First Wireframing Strategy** | 20 Jan 2026 | Week 3 - Ideate (Pre-Wireframing) | Impact: **Medium**
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Focus paper wireframes on mobile variants exploration, defer desktop versions to digital wireframing phase |   • Paper wireframing session planned for Week 3
      • Time constraint: 2-3 hours for wireframes before Neo sync
      • Mobile-first priority: 60%+ expected mobile traffic
      • Need validation from Neo on design direction | **A**: Mobile + Desktop coverage (duplicates)
    ✓ Complete documentation ✗ No alternative exploration
    
    **B**: Desktop-only focus
    ✓ Precise layouts ✗ Wrong priority order
    
    **C**: Mobile variants + desktop later in Figma
    ✓ Exploration + efficiency ✗ Incomplete paper docs | **Mobile-first principle:** 60%+ traffic is mobile, solve core UX there first. Desktop is primarily spatial adaptation, not new interaction patterns.
    
    **Validation strategy:** Better to show Neo 3 mobile alternatives for same screen than 1 mobile + 1 desktop of same concept. Client chooses direction, THEN scale to desktop.
    
    **Tool optimization:** Paper = fast exploration/alternatives. Figma = precise grids/spacing for desktop layouts. Use each tool for its strength.
    
    **Transferability:** Mobile constraints are hardest to solve (thumb zones, small screen). Mobile → Desktop is easier than Desktop → Mobile. |   • **Maximizes wireframe value:** 15+ mobile variants vs. 7-8 mobile+desktop duplicates
      • **Better client sync:** More alternatives = more informed design direction choice
      • **Efficient tool use:** Paper for exploration, digital for precision
      • **Risk mitigation:** Validate mobile UX (hardest constraint) before investing in desktop |
- **AI-Powered Meeting Documentation** | 24 Jan 2026 | Week 3 - Ideate | Impact: **High**
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Implement Notion Meet (AI transcription) for weekly client syncs |   • Team: 2-person (Designer + Artist)
      • Timeline: Weekly 90min syncs
      • Constraints: Zero budget
      • Trigger: Manual notes fragmenting attention in high-density tactical discussions | **A**: Manual notes
    ✓ Control ✗ Splits focus
    
    **B**: Slack transcription
    ✓ Chat history ✗ Paid plan, overkill
    
    **C**: Notion Meet
    ✓ Integrated, free, AI summary ✗ No Sync 1 record | Balanced presence + documentation + zero cost. Workspace integration eliminated tool sprawl.
    
    Trade-off: Lost Sync 1 details[[1]](Mon%2019%2001%2026%20-%20Define%20%E2%86%92%20Ideate%205bdd8ddada3883458f66011eeb592e5a.md) |   • 15min saved/meeting
      • Verbatim client feedback captured
      • Case study evidence trail established
      • Repeatable system for future projects |
- **Layered Color System for Process Navigation Table** | 24 Jan 2026 | Week 3 - Ideate | Impact: **Medium**
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Implement layered color-coding system for project hub navigation table |   • Single hub page organizing 18+ deliverables
      • 4 dimensions: Product Phase, Design Phase, Methods, Data
      • Constraint: Notion's limited styling options
      • Challenge: Creating visual hierarchy without custom CSS | **A**: Default table (borders only)
    ✓ Clean ✗ No visual hierarchy
    
    **B**: Row colors only
    ✓ Simple ✗ Doesn't show relationships
    
    **C**: Layered column + cell colors
    ✓ Depth perception, scannable ✗ Risk of visual noise | Applied Material Design depth principles to flat table structure. Color layers create "card stack" metaphor:
    
      • Gray (Life Phase) = base layer
      • Purple (Design Phase) = mid layer
      • Brown (Methods) = top layer
      • White (Data) = content space
    
    Matches Notion stylesheet consistency. Overcame technical limitation: column colors blocked row colors, solved by strategic cell-level coloring. |   • Visual scanability increased (instant phase recognition)
      • Information chunking improved navigation
      • Portfolio storytelling: demonstrates design systems thinking
      • Reusable pattern for future Notion project hubs |
    
    ![Dark mode: Layered color effect with card stack metaphor](Screenshot_2026-01-24_150206.png)
    
    Dark mode: Layered color effect with card stack metaphor
    
    ![Light mode: Border definition maintains hierarchy](Screenshot_2026-01-24_150213.png)
    
    Light mode: Border definition maintains hierarchy
    
- **HMW Scope Decisions: Balancing MVP Constraints with User Needs** | 25 Jan 2026 | Week 3 - Ideate | Impact: **Critical**
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Prioritized **immersive interaction features** (soundtrack, hover states, symbolism) for MVP scope |   • HMW question for Sabrina: "Create atmosphere that encourages contemplation"
      • Constraint: Webflow Starter plan (limited interactions)
      • User need: Emotional connection vs. quick scrolling
      • Risk: Feature complexity vs. timeline | **A**: Minimal static gallery
    ✓ Fast to build ✗ Fails user need
    
    **B**: Post-MVP enhancement
    ✓ Safe timeline ✗ Core differentiator lost
    
    **C**: In-scope MVP
    ✓ Meets user need ✗ Technical risk | **User-centered rationale**: Sabrina's journey shows emotional exploration is *primary* need, not secondary. Without atmosphere features, site becomes transactional—exact problem we're solving.
    
    **Technical validation needed**: Must confirm Webflow Starter can handle:
      • Audio player (background soundtrack)
      • Custom cursor hover states
      • Symbol-based navigation
    
    **Trade-off**: Accepting higher MVP complexity to preserve core value prop. If tech blockers emerge, fallback = simplified hover interactions only. |   • **Portfolio narrative**: Shows prioritization based on user research, not arbitrary feature lists
      • **Risk flagged**: Technical feasibility check required before wireframing
      • **Differentiator preserved**: Atmosphere = competitive advantage vs. generic artist portfolios |
    | Excluded **conversation/community features** from scope (artist dialogue, event community connection) |   • HMW questions: "Make artwork feel like conversation" (Sabrina), "Connect community when can't attend" (Elena)
      • Constraint: Content control risk, moderation overhead
      • Business goal: Neo as independent artist, not platform moderator | **A**: Comments system
    ✓ Direct feedback ✗ Moderation burden
    
    **B**: Forum/Discord integration
    ✓ Community hub ✗ Tool sprawl, off-site
    
    **C**: Out of scope
    ✓ Preserves control ✗ Limits engagement | **Business constraint**: Neo is solo artist, not community manager. User-generated content requires:
      • Daily moderation (time sink)
      • Legal liability management
      • Content quality control
    
    **Strategic choice**: Preserve Neo's control over narrative and content. Alternative engagement = curated newsletter/journal (post-MVP).
    
    **User need addressed differently**: "Conversation" through rich artwork descriptions + artist statements. "Community" through event marketing. |   • **Scope protection**: Avoided feature creep into platform territory
      • **Business alignment**: Matches Neo's capacity and independence goals
      • **Future roadmap**: Community features flagged for post-MVP if demand validated |
    | Split **artistic evolution visualization** into MVP (curated capstones) vs. Post-MVP (full timeline/study tool) |   • HMW questions: "Visualize artistic evolution as personal journey" (Sabrina), "Make site study tool for art students" (Marco)
      • Constraint: Content volume (100+ artworks), CMS complexity
      • User needs: Casual viewer wants highlights, students want deep archive | **A**: Full chronological archive
    ✓ Complete ✗ Overwhelming
    
    **B**: Curated gallery only
    ✓ Focused ✗ Misses student use case
    
    **C**: Phased approach
    ✓ Balanced ✗ Requires future build | **User segmentation insight**: Different users need different depth:
      • Sabrina (Immersive Seeker) = Curated journey with rich captions
      • Marco (Rebellious Apprentice) = Zoomable details + searchable archive
    
    **MVP prioritization**: Serve primary persona (Sabrina) first. Marco's study needs = post-MVP enhancement with:
      • Advanced search/filtering
      • Technique/medium tags
      • Dedicated "Artistic Growth" page
    
    **Content strategy**: Neo selects 15-20 capstone works that show evolution arc. Future: expand CMS for full catalog. |   • **Prevents scope creep**: Clear MVP boundary
      • **Serves primary user**: Sabrina's contemplative journey prioritized
      • **Portfolio learning**: Demonstrates user segmentation informing phased rollout
      • **Technical efficiency**: Smaller initial CMS = faster launch |
    | Designed **commission form with tone options** (Insulti / Leccate / Richieste) as MVP feature |   • HMW question: "Make commission process feel exclusive and personal"
      • Business goal: Differentiate from transactional platforms (Etsy)
      • Brand positioning: Raw, underground, anti-establishment
      • User need: Personal connection before purchase | **A**: Standard contact form
    ✓ Professional ✗ Generic
    
    **B**: Complex intake wizard
    ✓ Detailed ✗ Friction
    
    **C**: Tone-based form
    ✓ Brand-aligned, unique ✗ Unconventional risk | **Brand differentiation**: Form itself becomes brand expression. "Insulti/Leccate/Richieste" options:
      • **Insulti** = Provocative/irreverent requests
      • **Leccate** = Flattering/admiring commissions
      • **Richieste** = Standard inquiries
    
    **User psychology**: Self-selection creates playful engagement, filters audience (people who "get" Neo's humor self-identify).
    
    **Risk mitigation needed**: Validate with Neo that tone aligns with his comfort level for client interactions. Test copy with sample users to avoid alienating serious buyers. |   • **Unique differentiator**: No competitor has personality-driven form UX
      • **Portfolio showcase**: Demonstrates brand strategy informing micro-interactions
      • **Validation required**: User testing crucial (could backfire if tone misread)
      • **Technical simplicity**: Easy to implement in Webflow forms |
- **Unified Contact Form: Simplification Over Complexity** | 26 Jan 2026 | Week 3 - Ideate (Paper Wireframing) | Impact: **Medium**
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Unified contact form for all scenarios (purchase, commission, general inquiry) instead of dual-mode form |   • Paper wireframing phase revealed UX complexity
      • Initial spec: form adapts based on cart state (WITH/WITHOUT items)
      • Webflow Starter constraint: simpler = better
      • User cognitive load: mode-switching creates confusion | **A**: Dual-mode form (cart vs. no-cart)
    ✓ Tailored experience ✗ Complexity, mode confusion
    
    **B**: Separate forms (purchase vs. commission)
    ✓ Clear separation ✗ Navigation friction, duplicate fields
    
    **C**: Unified multifunctional form
    ✓ Simple, consistent ✗ Less contextual customization | **UX simplification:** Single form structure eliminates mode-switching confusion. User sees same interface regardless of cart state.
    
    **Technical simplification:** No conditional logic needed. Cart contents simply included in email payload if present, omitted if empty.
    
    **Cognitive load reduction:** User doesn't need to understand "cart mode" vs "inquiry mode"—just fills out form.
    
    **Implementation efficiency:** Lighter Webflow build, fewer form variants to maintain.
    
    **Discovered during wireframing:** Drawing dual-mode flow revealed unnecessary complexity that doesn't serve user needs. |   • **Reduces site complexity** (fewer conditional states to design/build)
      • **Improves UX consistency** (same form, every time)
      • **Faster Webflow implementation** (single form setup)
      • **Easier maintenance** (one form to update, not two)
      • **Portfolio lesson:** Wireframing reveals over-engineering before build phase |

---

### Week 4 - Strategic Pivot

- **Strategic Pivot: Antigravity Hand-Coding** | Week 4 (Late Jan 2026) | Impact: **Critical**
    
    
    | **Decision** | **Context** | **Options** | **Rationale** | **Impact** |
    | --- | --- | --- | --- | --- |
    | Pivot from Webflow to Antigravity-assisted hand-coding (HTML/CSS/JS + JSON CMS) |   • Timeline revision: 9 weeks total
      • Weeks 1-3: Webflow selected + learned
      • Week 4: Tool re-evaluation triggered
      • **CRITICAL BLOCKER discovered:** Content censorship risk | **A**: Continue with Webflow
    ✓ No switching cost ✗ Censorship risk, less learning depth
    **B**: WordPress alternative
    ✓ Mature platform ✗ Doesn't solve core issues
    **C**: Pivot to Antigravity hand-coding
    ✓ Full control, censorship-proof, Google ecosystem ✗ Switching cost, steeper curve | **CRITICAL BLOCKER — Content censorship:** Webflow's content policy would flag/censor Neo's explicit artwork. Cannot risk site takedown or content restrictions. Antigravity (AI-assisted development tool) allows autonomous hosting = full control.
    
    **Technical constraint unlocker (with strategic discipline):** Antigravity removes Webflow Starter's 2-page technical limit. However, **2-page constraint deliberately maintained as strategic design discipline** — MVP scope focus, lean delivery, no scope creep. Pivot is NOT to expand page count, but to gain content control + deeper learning.
    
    **Note on tool naming:** Antigravity is the AI-assisted development tool used for this project (analogous to Cursor AI, Replit Agent, etc.) — provides AI pair programming for HTML/CSS/JS implementation.
    
    **Market trend analysis:** Industry shifting toward functional mockups as designer-to-developer handoff. Designers increasingly expected to deliver interactive prototypes + production-ready code.
    
    **Vibe coding = emerging core skill:** AI-assisted coding ("vibe coding") becoming integral part of modern design workflow. Implementing now = career positioning advantage.
    
    **Learning depth priority:** Hand-coding with AI assistance provides deeper front-end skill development than no-code platforms. Production-grade HTML/CSS/JS proficiency = stronger job market differentiation.
    
    **Client empowerment:** JSON-based content management allows Neo to update artworks/events via structured data files without designer dependency. |   • **Provides full technical control** (no platform constraints)
      • **Censorship-proof deployment:** Can host anywhere (Netlify, Vercel, custom)
      • **Skill development:** Production-grade code = portfolio differentiation
      • **Market positioning:** "Designer who codes with AI" = 2026 competitive advantage
      • **Switching cost acknowledged:** Week 1-3 Webflow learning investment not wasted (understanding no-code platforms = valuable context) |

---

- **[Next Decision - Template Ready]** | [Date] | [Phase]