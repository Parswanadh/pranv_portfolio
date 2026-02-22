# Hybrid Persona Portfolio Website — Execution Plan

> **Persona**: Builder + Engineer + Researcher + Academic + Tinkerer + Systems Thinker  
> **Fused Style**: Quantum Terminal Research Lab  

---

## Stage 1 — Research Scan Summary

### Design Norms
- Dark themes dominant (70%+ of developer/researcher portfolios)
- Monospace typography signals technical competence
- Project-centric hierarchy (work > credentials)
- Minimalist navigation (4-6 sections)
- GitHub/LinkedIn integration as standard

### Emerging Trends
- Command palette navigation (VS Code/Raycast influence)
- Terminal boot sequences with fake logs
- Interactive 3D/graph visualizations
- Bento grid layouts
- Research paper-style sections (Abstract → Method → Results)
- Live AI/agent demos embedded

---

## Stage 2 — Style Archetypes

### Terminal/Hacker
| Attribute | Specification |
|-----------|---------------|
| Visual | Black/green, scanlines, ASCII art, cursor blink |
| Typography | Monospace only (JetBrains Mono, Fira Code) |
| Motion | Typing animation, glitch effects, boot sequences |
| Strengths | Technical credibility, memorable, fast performance |
| Weaknesses | Alienating to non-technical, mobile challenges |

### Brutalist
| Attribute | Specification |
|-----------|---------------|
| Visual | Raw, system fonts, harsh contrast, no rounded corners |
| Typography | Browser defaults or dramatic scale contrast |
| Motion | None or deliberately janky, hard cuts |
| Strengths | Extremely memorable, fastest performance |
| Weaknesses | Polarizing, may read as unprofessional |

### Research Lab / Academic
| Attribute | Specification |
|-----------|---------------|
| Visual | Clean, structured, paper-like, muted accents |
| Typography | Serif primary (Crimson, Garamond), proper hierarchy |
| Motion | Minimal, subtle fade-ins only |
| Strengths | High credibility, content-first, timeless |
| Weaknesses | Can feel dry, not memorable visually |

### Cinematic
| Attribute | Specification |
|-----------|---------------|
| Visual | Widescreen, film-grain, dramatic lighting, full-bleed |
| Typography | Display fonts for headers, clean sans body |
| Motion | Slow transitions (800-1200ms), parallax, camera pan |
| Strengths | Impressive visually, emotional impact |
| Weaknesses | Heavy page weight, accessibility concerns |

### Retro Computer
| Attribute | Specification |
|-----------|---------------|
| Visual | 8-bit pixels, CRT glow, limited palettes, bitmap fonts |
| Typography | Pixel fonts (VT323, Press Start 2P) |
| Motion | Frame-by-frame, instant transitions, flicker |
| Strengths | Highly differentiated, fun, surprisingly fast |
| Weaknesses | Niche appeal, readability issues, hard on mobile |

### Cyberpunk / Quantum-Graph
| Attribute | Specification |
|-----------|---------------|
| Visual | Neon accents, glitch, network graphs, HUD overlays |
| Typography | Tech sans-serifs (Orbitron, Exo), glowing text |
| Motion | Constant subtle animation, particles, WebGL shaders |
| Strengths | High impact, perfect for AI/ML, signals cutting-edge |
| Weaknesses | GPU-intensive, mobile compatibility issues |

---

## Stage 3 — Competitive Scoring Matrix

| Archetype | Credibility | Cinematic | Research Clarity | Uniqueness | Hacker Energy | Performance |
|-----------|:-----------:|:---------:|:----------------:|:----------:|:-------------:|:-----------:|
| Terminal | 8 | 5 | 6 | 8 | **10** | **10** |
| Brutalist | 6 | 4 | 5 | **10** | 7 | **10** |
| Research | **10** | 4 | **10** | 4 | 3 | 9 |
| Cinematic | 7 | **10** | 5 | 6 | 4 | 5 |
| Retro | 5 | 6 | 4 | 9 | 8 | 8 |
| Cyberpunk | 8 | 9 | 6 | 8 | 7 | 4 |

### Audience Fit
| Audience | Best Archetypes | Avoid |
|----------|-----------------|-------|
| Research Labs | Research, Terminal, Cyberpunk | Retro, Cinematic |
| Robotics/AI/Infra | Cyberpunk, Terminal, Research | Retro, Brutalist |
| Startup/VC | Cinematic, Cyberpunk, Brutalist | Research |
| Collaborators/Peers | Terminal, Brutalist, Retro | Research, Cinematic |

---

## Stage 4 — Synthesis: Fused Style Recommendation

### "Quantum Terminal Research Lab"

**DNA Blend:**
- 40% Terminal/Hacker (navigation, boot, typography)
- 25% Cyberpunk/Quantum (graphs, accents, hero)
- 20% Research Lab (content structure, citations)
- 10% Cinematic (scroll transitions, camera effects)
- 5% Retro (amber warmth, nostalgic nods)

---

## Stage 5 — Execution Blueprint

### 1. Sitemap + Section Hierarchy

```
/                           → Home (Hero + Graph + Boot)
├── /projects               → Projects Grid
│   └── /projects/[slug]    → Project Detail
├── /agents                 → AI Agents Showcase
│   └── /agents/[slug]      → Agent Detail + Live Demo
├── /tools                  → Tools Built/Written
├── /leadership             → Leadership Experience
├── /research               → Research Publications
│   └── /research/[slug]    → Paper Detail (Case Study)
├── /about                  → Extended Bio
├── /resume                 → Resume Page
└── /contact                → Contact Surface
```

**Priority Hierarchy:** Projects/Agents → Tools → Leadership → Research

---

### 2. Brutalist Wireframe — Home Page

```
┌──────────────────────────────────────────────────────────┐
│ [CMD+K]                                        [≡ MENU] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│        ╔══════════════════════════════════════╗          │
│        ║   QUANTUM GRAPH (Interactive Hero)   ║          │
│        ╚══════════════════════════════════════╝          │
│                                                          │
│  > SYSTEM BOOT... OK                                     │
│  > LOADING PERSONA... OK                                 │
│  > [NAME] | [TAGLINE]                                    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ FEATURED PROJECTS ─────────────────────────── [→ ALL]   │
│ ┌────────┐ ┌────────┐ ┌────────┐                        │
│ │ Proj 1 │ │ Proj 2 │ │ Proj 3 │                        │
│ └────────┘ └────────┘ └────────┘                        │
├──────────────────────────────────────────────────────────┤
│ ACTIVE AGENTS ──────────────────────────────── [→ ALL]   │
│ [Agent1: ● online] [Agent2: ● online]                    │
├──────────────────────────────────────────────────────────┤
│ ──────────────────────────────────────────────────────── │
│ PORTFOLIO v2.0 | BUILT WITH [STACK] | © 2025            │
│ > [GitHub] [LinkedIn] [Email]                            │
└──────────────────────────────────────────────────────────┘
```

---

### 3. Typography System

| Role | Font Stack | Reasoning |
|------|------------|-----------|
| **Headers/Code** | `JetBrains Mono`, `Fira Code`, `SF Mono`, monospace | Technical authority, ligatures |
| **Body/UI** | `Inter`, `IBM Plex Sans`, system-ui, sans-serif | Modern, accessible, variable |
| **Research** | `Source Serif Pro`, `Crimson Text`, Georgia, serif | Academic gravitas (optional accent) |

**Type Scale:**
```css
--text-xs: 0.75rem;     /* 12px - captions */
--text-sm: 0.875rem;    /* 14px - small */
--text-base: 1rem;      /* 16px - body */
--text-lg: 1.125rem;    /* 18px - lead */
--text-xl: 1.25rem;     /* 20px - h4 */
--text-2xl: 1.5rem;     /* 24px - h3 */
--text-3xl: 2rem;       /* 32px - h2 */
--text-4xl: 2.5rem;     /* 40px - h1 */
--text-5xl: 3.5rem;     /* 56px - hero */
--text-6xl: 4.5rem;     /* 72px - display */
```

---

### 4. Color/Theme Tokens

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --bg-tertiary: #1a1a1a;
  --bg-elevated: #242424;
  --bg-overlay: rgba(0, 0, 0, 0.8);

  /* Amber Accent Palette */
  --accent-primary: #f5a623;
  --accent-secondary: #d4a574;
  --accent-tertiary: #8b7355;
  --accent-glow: rgba(245, 166, 35, 0.4);
  
  /* Graph Colors */
  --graph-node: #f5a623;
  --graph-node-hover: #ffd700;
  --graph-edge: rgba(245, 166, 35, 0.25);
  --graph-edge-active: rgba(245, 166, 35, 0.6);
  
  /* Text */
  --text-primary: #e8e8e8;
  --text-secondary: #888888;
  --text-tertiary: #555555;
  --text-accent: #f5a623;
  
  /* Terminal/Log Colors */
  --log-success: #4caf50;
  --log-warning: #ff9800;
  --log-error: #ff5252;
  --log-info: #64b5f6;
  
  /* Borders */
  --border-default: #2a2a2a;
  --border-hover: #3a3a3a;
  --border-accent: rgba(245, 166, 35, 0.3);
}
```

---

### 5. Motion/Interactions

| Pattern | Specification |
|---------|---------------|
| **Transitions** | Fast: 150ms, Base: 250ms, Slow: 400ms, Cinematic: 800ms |
| **Terminal Typing** | Character reveal at 40ms intervals |
| **Section Entry** | `translateY(20px)` + opacity fade, 400ms |
| **Camera Pan** | 3% parallax on mouse move (desktop only) |
| **Graph Pulse** | Subtle `scale(1.02)` on active nodes, 800ms loop |
| **Cursor Blink** | Opacity toggle, 600ms interval |
| **Performance** | `prefers-reduced-motion` respected, 60fps target |

---

### 6. Navigation Model — Teleport/Command Palette

**Trigger:** `Cmd+K` (Mac) / `Ctrl+K` (Windows)

**Commands:**
```
> goto /projects
> goto /agents
> theme dark | light | system
> download resume
> contact email
> easter [secret commands]
```

**Features:**
- Searchable sections, projects, commands
- Recent items prioritized
- Vim-style: `j/k` navigation, `Enter` to select
- Fallback: Hamburger menu, bottom sheet on mobile

---

### 7. Terminal Animation + Fake Log Concept

**Boot Sequence (First Visit):**
```
[2025.01.19 14:55:27] INITIALIZING PORTFOLIO SYSTEM...
[2025.01.19 14:55:27] > Loading neural graph... OK
[2025.01.19 14:55:28] > Mounting project manifests... 24 found
[2025.01.19 14:55:28] > Spawning agent processes... 3 active
[2025.01.19 14:55:29] > Compiling research corpus... OK
[2025.01.19 14:55:29] SYSTEM READY
[2025.01.19 14:55:29] > Welcome, visitor.
[2025.01.19 14:55:29] > Press Cmd+K to navigate, or scroll to explore.
█
```

**Spec:**
- Duration: ~3 seconds
- Skip: "Press any key to skip"
- Storage: `localStorage.hasSeenBoot` to skip on return
- Dynamic: Real timestamps, project count from CMS

---

### 8. Quantum Graph Component

**Hero Graph (Home Page):**
- Full-viewport background, interactive
- Nodes: Skills, projects, concepts, agents
- Edges: Relationships, dependencies
- Interactions: Hover highlights connected nodes, click navigates

**Technical Spec:**
- Engine: Three.js or vanilla WebGL
- Fallback: CSS-animated SVG for low-power devices
- Node count: 30-50 max
- Edge rendering: Lines with ambient glow

**Graph Modes:**
1. **Background Mode** — Decorative, no interaction
2. **Interactive Mode** — Click navigates, hover inspects
3. **Explanatory Mode** — Research pages, concept relationships

---

### 9. Live AI Agent Demos

**Component Structure:**
```
AgentDemo
├── AgentHeader (name, status badge, version)
├── AgentDescription (1-2 line summary)
├── DemoInterface
│   ├── InputArea (prompt input)
│   ├── OutputArea (streaming response)
│   └── ActionButtons (try sample, reset, copy)
├── MetricsPanel (optional: latency, tokens)
└── SourceLink (GitHub, paper)
```

**Modes:**
- **Live API** — Real endpoint (rate-limited)
- **Recorded** — Pre-recorded session playback
- **Simulated** — Local mock with delays

---

### 10. Research Case-Study Template

```
┌─────────────────────────────────────────────────┐
│ [Paper Title]                                   │
│ [Authors] | [Venue/Year] | [Status Badge]       │
├─────────────────────────────────────────────────┤
│ ABSTRACT                                        │
│ [Serif text, 150-300 words]                     │
├─────────────────────────────────────────────────┤
│ KEY CONTRIBUTIONS                               │
│ • Contribution 1                                │
│ • Contribution 2                                │
├─────────────────────────────────────────────────┤
│ METHODOLOGY                                     │
│ [Visual diagram or flowchart]                   │
├─────────────────────────────────────────────────┤
│ CITATIONS / BIBTEX                              │
│ [Copy] [Download .bib]                          │
└─────────────────────────────────────────────────┘
```

**Metadata:** title, authors, venue, year, abstract, keywords, doi, pdfUrl, codeUrl

---

### 11. Persona & Tagline Options

| Style | Tagline |
|-------|---------|
| **Poetic** | "Architecting intelligence at the edge of chaos" |
| **Poetic** | "Where systems thinking meets shipyard velocity" |
| **Terminal** | `> ./parsh --mode=builder --verbose` |
| **Terminal** | "ROOT ACCESS: Engineering × Research × Execution" |
| **Technical** | "AI Systems Engineer \| Researcher \| Builder" |
| **Hybrid** | "Systems Builder \| AI Researcher \| Shipping Code Since [YEAR]" |

**Subline:** "I build agents, prototype ideas, and write about the future."

---

### 12. Resume Embedding

| Format | Implementation |
|--------|----------------|
| **Inline PDF** | pdf.js or native iframe, dark-themed |
| **Download** | "Download PDF" button with tracking |
| **HTML Version** | Structured `/resume` page mirroring PDF |
| **SEO** | JSON-LD structured data |

---

### 13. Contact Surfaces

```
📧 Email:    [email@domain.com]     [Copy] [Open]
🐙 GitHub:   [github.com/handle]    [Open]
💼 LinkedIn: [linkedin.com/in/...]  [Open]
💬 WhatsApp: [wa.me/number]         [Open Chat]
```

**Optional:** Twitter/X, Calendly, Discord, RSS

---

### 14. Footer (Retro Credits)

```
──────────────────────────────────────────────────
PORTFOLIO v2.0 | BUILT WITH [STACK] | © 2025
LAST COMPILE: [TIMESTAMP] | UPTIME: [DAYS]d
> "The best way to predict the future is to build it."
──────────────────────────────────────────────────
[GitHub] [LinkedIn] [Email] [RSS]
```

**Dynamic:** Real build timestamp, uptime counter, rotating quotes

---

### 15. Agent Army Specification

> [!IMPORTANT]
> **Constraint: NO WEB SEARCH.** All agents work exclusively with local filesystem, terminal, MCP tools, and context from previous agents.

#### Architecture Overview

Based on research from Manus AI, Devin, and Claude Code best practices:
- **Manus Pattern:** Multi-agent system with event-driven loop (Analyze → Select Tools → Execute → Observe)
- **Devin Pattern:** Internal planner + sandboxed environment (VM, browser, terminal)
- **Claude Code Pattern:** `.claude/agents/` directory, YAML frontmatter, single responsibility

#### Agent Roster (15 Agents, 6 Tiers)

##### TIER 1: ORCHESTRATION

| Agent | Role | Model | Tools |
|-------|------|-------|-------|
| **orchestrator** | Task decomposition, delegation, coordination, synthesis | opus | all |
| **planner** | Architecture decisions, implementation plans, component boundaries | opus | file read/write |

##### TIER 2: DEVELOPMENT

| Agent | Role | Model | Tools |
|-------|------|-------|-------|
| **frontend-developer** | React/Next.js components, CSS, responsiveness | sonnet | file read/write, view code |
| **backend-developer** | API routes, data fetching, server logic | sonnet | file read/write, terminal |
| **systems-engineer** | Build config, deployment, Docker, CI/CD | sonnet | terminal, file read/write |
| **animator** | CSS animations, Three.js, WebGL, transitions | sonnet | file read/write |

##### TIER 3: QUALITY

| Agent | Role | Model | Tools |
|-------|------|-------|-------|
| **code-reviewer** | Review changes, best practices, security, performance | sonnet | file read, grep |
| **accessibility-auditor** | WCAG compliance, keyboard nav, ARIA, screen reader | sonnet | file read |
| **performance-analyst** | Bundle analysis, Core Web Vitals, lazy loading | sonnet | terminal, file read |

##### TIER 4: PERSPECTIVE

| Agent | Role | Model | Tools |
|-------|------|-------|-------|
| **multi-perspective-critic** | Review from recruiter, VC, researcher, peer viewpoints | sonnet | file read |
| **ux-critic** | Flow analysis, cognitive load, discoverability | sonnet | file read |

##### TIER 5: REASONING

| Agent | Role | Model | Tools |
|-------|------|-------|-------|
| **sequential-thinker** | Chain-of-thought for complex problems, debugging | opus | MCP sequential-thinking |
| **debugger** | Error analysis, root cause, fix generation | sonnet | file read/write, terminal, grep |

##### TIER 6: TESTING

| Agent | Role | Model | Tools |
|-------|------|-------|-------|
| **test-writer** | Unit tests, integration tests, coverage | sonnet | file read/write |
| **playwright-tester** | E2E browser automation, visual regression, a11y | sonnet | Playwright MCP |

---

#### Coordination Model

```
User Request
     ↓
[ORCHESTRATOR] ← Opus model, full context
     ↓
┌────────────┐
│  PLANNER   │ → Creates implementation_plan.md
└─────┬──────┘
      ↓
[Task Decomposition]
      ↓
┌─────────────────────────────────────────────────────────┐
│              PARALLEL EXECUTION                         │
│  [frontend-developer] [animator] [systems-engineer]    │
│  [backend-developer]                                    │
└────────────────────────┬────────────────────────────────┘
                         ↓
                  [Code Complete]
                         ↓
┌─────────────────────────────────────────────────────────┐
│              QUALITY GATES                              │
│  [code-reviewer] → [accessibility-auditor]             │
│  [performance-analyst]                                  │
└────────────────────────┬────────────────────────────────┘
                         ↓
              [Fixes if needed → back to dev]
                         ↓
┌─────────────────────────────────────────────────────────┐
│              PERSPECTIVE REVIEW                         │
│  [multi-perspective-critic] [ux-critic]                │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              TESTING LAYER                              │
│  [test-writer] → [playwright-tester]                   │
└────────────────────────┬────────────────────────────────┘
                         ↓
            [ORCHESTRATOR consolidates]
                         ↓
              Human Review (notify_user)
```

---

#### Handoff Protocol

1. Agent completes task → writes to artifact file
2. Updates `progress.md` with status
3. Returns to orchestrator with summary
4. Orchestrator routes to next agent

#### Shared State Artifacts

| File | Purpose |
|------|---------|
| `progress.md` | Current status, blockers, completed items |
| `implementation_plan.md` | Technical specification |
| `review_notes.md` | Accumulated feedback from quality/perspective agents |
| `test_results.md` | Test outcomes, failures, coverage |

---

#### Agent File Format (`.claude/agents/`)

```markdown
---
name: agent-name
description: |
  Clear description with MUST BE USED triggers.
  Example: "MUST BE USED for all CSS animation work."
model: sonnet
tools:
  - Read
  - Edit
  - Terminal
---
# Agent Name

## Role
[Single sentence defining primary responsibility]

## Expertise
[Domain knowledge and specializations]

## Approach
[How the agent works through tasks]

## Constraints
- What it cannot/should not do
- Scope limitations
- Handoff triggers

## Output Format
[Expected deliverables and structure]
```

---

#### Example: frontend-developer.md

```markdown
---
name: frontend-developer
description: |
  MUST BE USED for React/Next.js component implementation.
  Handles JSX, CSS, responsive layouts, and component architecture.
model: sonnet
tools:
  - Read
  - Edit
---
# Frontend Developer

## Role
Implement production-ready React components with proper styling.

## Expertise
React 18+, Next.js 14+ App Router, CSS Modules, responsive design.

## Approach
1. Review design spec and component requirements
2. Create component file structure
3. Implement JSX with semantic HTML
4. Add styling (CSS Modules)
5. Ensure responsive breakpoints

## Constraints
- Do not implement API routes (handoff to backend-developer)
- Do not implement complex animations (handoff to animator)
- Do not write tests (handoff to test-writer)

## Output Format
Component files with corresponding CSS modules.
```

#### Example: code-reviewer.md

```markdown
---
name: code-reviewer
description: |
  MUST BE USED after any code implementation task.
  Reviews for quality, performance, security, and best practices.
model: sonnet
tools:
  - Read
  - Grep
---
# Code Reviewer

## Role
Review all code changes for quality and best practices.

## Approach
1. Read changed files
2. Check for security issues
3. Verify performance patterns
4. Confirm accessibility basics
5. Generate actionable feedback

## Constraints
- Do not modify files directly
- Provide recommendations only

## Output Format
- **Critical Issues:** Must fix
- **Recommendations:** Should consider
- **Observations:** Minor notes
```


### 16. Playwright MCP Refinement Pipeline

**Phase 1: Visual Regression**
- Screenshot comparison on key pages
- Breakpoints: mobile (375px), tablet (768px), desktop (1280px)

**Phase 2: Interaction Testing**
- Command palette open/close/search
- Navigation to all routes
- Terminal boot sequence timing
- Graph interactivity

**Phase 3: Performance Validation**
- Lighthouse CI thresholds:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- Bundle size monitoring

**Phase 4: Accessibility Audit**
- Axe-core integration
- Keyboard navigation flow
- Color contrast validation

**Iteration Loop:**
```
Run Tests → Collect Failures → Subagent Fix → Re-test → Pass/Fail Gate
```

---

### 17. Hosting Guidance

**Local Development:**
- Framework: Next.js 14+ (App Router) or Vite + React
- Command: `npm run dev` on port 3000
- Environment: `.env.local` for secrets

**Production — Vercel Free Tier:**
- Automatic GitHub deploys
- Preview on PRs
- Edge functions for API routes
- Custom domain (free)

**Self-Hosted Alternative:**
- Docker container
- Nginx reverse proxy
- PM2 for process management
- Cloudflare CDN

**Deployment Checklist:**
- [ ] Environment variables configured
- [ ] Custom domain + SSL
- [ ] Analytics enabled
- [ ] robots.txt + sitemap.xml
- [ ] Open Graph meta tags
- [ ] Favicon + PWA manifest

---

## Verification Plan

### Automated Testing (Playwright)
```bash
# Run full test suite
npx playwright test

# Visual regression
npx playwright test --project=visual

# Accessibility audit
npx playwright test --project=a11y
```

### Manual Verification
1. **Boot Sequence:** Visit site in incognito, verify 3-second terminal animation plays
2. **Command Palette:** Press `Cmd+K`, type "projects", verify navigation
3. **Graph Interaction:** Hover nodes, verify highlighting and pulse
4. **Mobile Responsive:** Test on 375px width, verify layout and navigation
5. **Performance:** Run Lighthouse, verify Core Web Vitals pass

---

> [!IMPORTANT]
> This plan is structured for direct execution by Claude Code + subagents.
> All specifications are actionable. No clarification required.
