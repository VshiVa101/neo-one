# Business Parameters

Owner: leo

(1-1)

# 📉 Business Requirements & Technical Constraints

> Context: Before initiating the design process, I analyzed the project assignment to define the operational boundaries. These requirements serve as the "North Star" that aligns user needs with business viability and technical reality.
> 

---

- ←Content Table

# 01. Business Parameters (The Assignment)

| **Parameter** | **Definition** | **Impact on Design Strategy** |
| --- | --- | --- |
| **Goal** | **Centralization** | Create a unified "Digital Home" to reduce reliance on Etsy/Instagram and establish Neo's independent brand presence. |
| **Budget** | **$0 (Zero-Budget)** | Must rely entirely on free-tier tools. No paid plugins, hosting fees, or advertising budget. |
| **Timeline**
**9 Weeks** (Jan 5 – Mar 8, 2026)	**Fixed deadline. Antigravity-assisted development allows for rapid iteration and full control.** |  |  |
| **Role** | **End-to-End Solo** | Responsible for Research, UX/UI Design, and Antigravity Development—wearing multiple hats throughout. |
| **Methodology** | **Design Thinking + Product Development Life Cycle** | Dual framework approach combining user-centered problem-solving with structured product delivery. |

---

# 02. Technical Approach as Design Driver

*The project uses Antigravity-assisted HTML/CSS/JS development with JSON-based CMS. This approach provides full control over implementation while maintaining rapid development through AI pair programming.*

| **Technical Consideration** | **The Conflict** | **The Design Solution** |
| --- | --- | --- |
| **Free Hosting Limitations** | GitHub Pages / Netlify free tiers have storage and bandwidth caps | Curate 30-40 best artworks instead of full archive; optimize all images to WebP format; implement lazy loading |
| **CMS Complexity** | Traditional CMS platforms (WordPress, Webflow) require subscriptions or have content policies | Build custom JSON-based CMS that Neo can update via simple data files; full ownership and control |
| **Performance Constraints** | High-res artwork files (2000px+) slow mobile load times | Multi-resolution image strategy: thumbnails for gallery, progressive loading for detail view, modal zoom for full quality |
| **No Backend Infrastructure** | Contact forms typically require server-side processing | Use Formspree free tier for form handling; emails sent directly to Neo without backend setup |

### Why Constraints Are Strategic

These limitations aren't just technical hurdles—they're **forcing functions** that create better design decisions:

- **Quality over quantity:** Curating 30 works forces us to showcase only the best, creating a premium feel
- **Simplified navigation:** 2-page architecture reduces cognitive load and creates a cohesive narrative
- **Performance focus:** Storage limits force optimization, resulting in faster load times for all users

---

# 03. Tools & Systems

| **Category** | **Tool** | **Usage** |
| --- | --- | --- |
| **🎨 Design** | **Figma** (Free Tier) | Wireframing, high-fidelity UI design, interactive prototyping, and asset creation |
| **💻 Development** | **Antigravity + Hand-coding** | AI-assisted hand-coding, JSON-based CMS, responsive design, Git version control |
| **🗣️ Research** | **Discord** | Direct access to 500+ fans for zero-cost user interviews and usability testing |
| **📝 Management** | **Notion** | Documentation, sprint planning, research synthesis, and case study creation |

---

# 04. Quality Standards (Success Metrics)

Even with zero budget, the project maintains professional quality benchmarks:

| **Standard** | **Target** | **Implementation** |
| --- | --- | --- |
| **📱 Responsiveness** | Fluid experience across all devices | Mobile-first design (Priority #1 for Discord users), with tablet and desktop breakpoints |
| **⚡ Performance** | Google Lighthouse score of **90+** | All assets converted to WebP, lazy loading, minified code, and optimized CMS queries |
| **♿ Accessibility** | WCAG 2.1 AA Compliance | Proper contrast ratios (4.5:1 minimum), alt text for all images, semantic HTML, and ARIA labels |
| **🎯 User Experience** | Task completion rate >85% | **Two-round validation:** (1) Figma prototype testing with 3-5 Discord users (Week 6), (2) Final staging site QA with Neo and peer reviewer pre-deploy |

---

# 05. Dual Framework Approach: Where Google Meets Reality

This project integrates **two complementary frameworks** to balance theoretical rigor with practical execution:

| **Framework** | **Purpose** | **Why It Matters** |
| --- | --- | --- |
| **Design Thinking** (Google UX) | User-centered problem-solving methodology | Ensures every design decision is validated by real user needs through the 5 phases: Empathize → Define → Ideate → Prototype → Test |
| **Product Development Life Cycle** | End-to-end product delivery structure | Provides clear milestones from concept to launch (Brainstorm → Define → Design → Test → Launch), keeping stakeholders aligned and the project on schedule |

### The Integration

Rather than treating these as separate processes, I've **woven them together** to create a hybrid approach that maintains user empathy while delivering a shippable product:

| **Weeks** | **Design Thinking Phase** | **Product Life Cycle Stage** | **What Happens** |
| --- | --- | --- | --- |
| **1-2** | **Empathize & Define** | **Brainstorm & Define** | Understanding users through research, then narrowing focus to specific problems and solutions |
| **3-4** | **Ideate & Prototype** | **Design** | Generating multiple solutions through sketching, then creating high-fidelity designs ready for development |
| **5-6** | **Prototype & Test** | **Design & Validation** | Hi-fi mockups in Figma and interactive prototype with usability testing (Friday Week 6) |

**Key Strategic Decision:** Usability testing occurs in **Week 6 on an interactive Figma prototype** before development begins. This validates the design direction early, allowing any major changes to be made in Figma rather than in code. Testing on Friday Week 6 provides a full weekend to synthesize findings before development kicks off Monday Week 7.

# 06. Project Roadmap: Integrated Timeline

[.6 Project Roadmap: Integrated Timeline ](6%20Project%20Roadmap%20Integrated%20Timeline%20072d8ddada388396954e81b47326f1c4.md)

---

# 07. Testing Strategy: Why Week 6?

**The Reality Check:** Testing early in Figma (Week 6) allows us to catch UX issues before committing to code, reducing costly rework during development.

**Strategic Decision:**

- **Week 6 Friday:** Conduct usability testing on interactive Figma prototype with 3-5 Discord community members
- **Weekend synthesis:** Analyze findings and prioritize P0/P1 issues
- **Week 7 start:** Begin development with validated design direction
- **Benefits:**
    - Catch navigation and flow issues before coding
    - Validate complex interactions (cluster expansion, Hi-Rez modal, Backstory reveal)
    - Test mobile responsiveness in Figma's device preview
    - Make design iterations quickly in Figma vs. re-coding
    - Enter development with confidence in user experience

This approach balances **design validation** with **efficient development**: test the interactions early, then build with certainty.

---

# 08. Post-MVP Roadmap

**This project doesn't end at launch.** The MVP is a validation milestone with a clear evolution path:

### Immediate Post-Launch (March 2026):

- **Analytics Setup:** Monitor user behavior (heatmaps, scroll depth, conversion rates)
- **Qualitative Feedback:** Survey Discord community members about their experience
- **Content Rhythm:** Establish monthly gallery refresh cadence
- **Performance Monitoring:** Track Lighthouse scores under real traffic

### Phase 2 Evolution (Q2 2026):

- **Scale Decision:** Based on metrics, decide whether to scale hosting infrastructure or optimize current solution
- **Feature Expansion:** Implement Phase 2 features based on user feedback (newsletter, expanded shop, full archive)

### Long-term Vision (2026+):

- **Creator Economy Playbook:** Document the zero-budget website process for other emerging artists
- **Portfolio Impact:** Use this end-to-end project to demonstrate UX research, design, and development skills

---

⇩back to Overview or Go to Home**:** 

[OVERVIEW](OVERVIEW%2036ed8ddada388334abf101fd8e531429.md)

[Neo-one](Neo-one%202abd8ddada38831db00d81b531766164.md)