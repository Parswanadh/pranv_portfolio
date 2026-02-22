# Web Researcher Memory

## Tool Availability
- `gemini` CLI tool is **NOT** available in this environment
- Use knowledge from training data (cutoff August 2025) for web research
- For live web searches, would need browser automation or API integration

## Research Methodology

When conducting web research without live search tools:
1. Use training knowledge (current through August 2025)
2. Focus on stable, well-documented best practices
3. Provide version numbers with dates to indicate currency
4. Always cite official documentation sources
5. Note when information may have changed after training cutoff

## Research Outputs

### WEB_RESEARCH.md Structure
When creating research reports, include:
- Executive summary of key findings
- Detailed best practices by topic
- Code examples where relevant
- Performance benchmarks and targets
- Common pitfalls to avoid
- Implementation priority checklist
- Comprehensive sources section with URLs

### Research Topics Covered

#### Portfolio Modernization (2025)
- Three.js & React Three Fiber optimization
- Next.js App Router performance
- Portfolio design trends
- WebGL/Canvas performance
- Accessibility for 3D applications
- Bundle size optimization

## Key Sources to Reference

### Official Documentation
- Next.js: https://nextjs.org/docs
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Three.js: https://threejs.org/docs/
- Web.dev: https://web.dev/
- WCAG: https://www.w3.org/WAI/WCAG21/quickref/

### Performance Tools
- Lighthouse: Built into Chrome DevTools
- Bundle Analyzer: @next/bundle-analyzer
- PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/

### 2025 Standards
- LCP: ≤2.5s
- INP: ≤200ms
- CLS: ≤0.1
- Initial JS bundle: ≤200KB (desktop), ≤150KB (mobile)
- 3D FPS: 60fps desktop, 30fps mobile minimum

## Project-Specific Notes

### Current Stack (from package.json)
- Next.js: 14.2.35 (can upgrade to 15)
- React: 18.3.0
- Framer Motion: 11.0.0
- No Three.js currently installed

### Optimization Opportunities Identified
1. Add Three.js for 3D elements (if needed)
2. Implement Server Components more aggressively
3. Add bundle analyzer
4. Set up performance monitoring
5. Improve accessibility implementation

## Research Outputs

### GROQ_MODELS_RESEARCH.md (February 2026)
Complete research report on Groq models for multi-agent chat implementation:
- 5 production-ready Groq models documented
- Model comparison table with capabilities
- Recommended 3-agent configuration
- Implementation strategy with code examples
- Performance benchmarks and cost considerations
- Best practices for multi-agent systems

### multi-agent-implementation-plan.md (February 2026)
3-week implementation roadmap for multi-agent chat:
- Phase 1: Core multi-model support (API changes, agent config system)
- Phase 2: Agent personalities (visual differentiation, system prompts)
- Phase 3: Smart routing (automatic model selection, context sharing)
- Testing strategy and deployment plan
- Risk mitigation and success metrics

## Groq Models Quick Reference

### Available Models (as of August 2025)
1. **llama-3.3-70b-versatile** - Best overall, 128K context, currently in use
2. **llama-3.1-8b-instant** - Fastest, 128K context, ideal for quick responses
3. **mixtral-8x7b-32768** - Technical/coding focus, 32K context
4. **gemma2-9b-it** - Concise/factual, 8K context
5. **qwen-2.5-7b-instruct** - Multilingual support, 32K context

### Recommended Agent Configuration
- **Iris** (Primary): Llama 3.3 70B - Full portfolio assistant
- **Spark** (Fast): Llama 3.1 8B - Quick answers & navigation
- **Code** (Technical): Mixtral 8x7B - Code & architecture discussions

### Implementation Files
- Current: `components/IrisAssistant.tsx` (single agent)
- API: `app/api/chat/route.ts` (needs model parameter)
- Library: `lib/groq.ts` (needs dynamic model support)
- New: `lib/agent-config.ts` (agent configurations)
- New: `lib/agent-router.ts` (smart routing logic)

## Future Research Needs
- Live web search capability via API
- Browser automation for testing
- Integration with CI/CD for performance budgets
- Verify current Groq model catalog and pricing (post-August 2025)
