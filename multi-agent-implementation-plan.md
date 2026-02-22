# Multi-Agent Implementation Plan

**Project:** Portfolio Multi-Agent Chat Feature
**Target Start:** February 2026
**Estimated Duration:** 3 weeks
**Priority:** High

---

## Overview

Transform the single-agent "Iris" chat into a multi-agent system where users can interact with different AI models from Groq, each optimized for specific use cases. This will provide users with more choice, faster responses for simple queries, and specialized assistance for technical discussions.

---

## Phase 1: Core Multi-Model Support (Week 1)

### 1.1 Backend Infrastructure Updates

#### File: `lib/groq.ts` - Add Model Parameter Support
**Changes Required:**
```typescript
// Add model configuration types
export interface GroqModelConfig {
  id: string
  name: string
  contextWindow: number
  maxTokens: number
  temperature: number
}

// Export model constants
export const GROQ_MODELS: Record<string, GroqModelConfig> = {
  'llama-3.3-70b-versatile': {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B Versatile',
    contextWindow: 128000,
    maxTokens: 1024,
    temperature: 0.7
  },
  'llama-3.1-8b-instant': {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B Instant',
    contextWindow: 128000,
    maxTokens: 1024,
    temperature: 0.7
  },
  'mixtral-8x7b-32768': {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    contextWindow: 32768,
    maxTokens: 1024,
    temperature: 0.7
  }
}

// Update function signatures
export async function* streamMessages(
  messages: GroqMessage[],
  model: string = 'llama-3.3-70b-versatile'
): AsyncGenerator<string, void, unknown>

export async function sendMessage(
  messages: GroqMessage[],
  model: string = 'llama-3.3-70b-versatile'
): Promise<string>
```

**Implementation Steps:**
1. Create `GROQ_MODELS` constant with model configurations
2. Update `streamMessages()` to accept `model` parameter
3. Update `sendMessage()` to accept `model` parameter
4. Add model validation helper function
5. Add fallback chain logic

---

#### File: `app/api/chat/route.ts` - Handle Model Selection
**Changes Required:**
```typescript
// Add model extraction from request body
const { messages, context, model = 'llama-3.3-70b-versatile' } = body

// Validate model
const validModels = Object.keys(GROQ_MODELS)
if (!validModels.includes(model)) {
  return new Response(
    JSON.stringify({ error: 'Invalid model selected' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  )
}

// Pass model to streamMessages
for await (const chunk of streamMessages(enhancedMessages, model)) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
}

// Add model info to response headers
headers: {
  'X-Groq-Model': model,
  // ... existing headers
}
```

**Implementation Steps:**
1. Extract `model` parameter from request body
2. Validate model against `GROQ_MODELS` keys
3. Pass model to `streamMessages()` function
4. Add model info to response headers for debugging
5. Add model-specific rate limiting (optional)

---

### 1.2 Agent Configuration System

#### File: `lib/agent-config.ts` - NEW FILE
**Purpose:** Centralize agent configurations
```typescript
import { GROQ_MODELS } from './groq'

export interface AgentConfig {
  id: string
  name: string
  model: string
  icon: string
  color: string
  description: string
  longDescription: string
  systemPrompt: string
  capabilities: string[]
  examples: string[]
  responseStyle: 'detailed' | 'concise' | 'technical'
}

export const AGENTS: Record<string, AgentConfig> = {
  iris: {
    id: 'iris',
    name: 'Iris',
    model: 'llama-3.3-70b-versatile',
    icon: 'sparkles',
    color: 'accent-primary',
    description: 'Full portfolio assistant',
    longDescription: 'Your complete guide to Balcha\'s portfolio. Ask me anything about projects, skills, experience, or research.',
    systemPrompt: BASE_IRIS_SYSTEM_PROMPT, // Import from IrisAssistant
    capabilities: ['projects', 'experience', 'navigation', 'voice', 'research'],
    examples: [
      'What are Balcha\'s top skills?',
      'Tell me about PRO_CODE',
      'Explain AUTO-GIT',
      'Show me Balcha\'s AI projects'
    ],
    responseStyle: 'detailed'
  },
  spark: {
    id: 'spark',
    name: 'Spark',
    model: 'llama-3.1-8b-instant',
    icon: 'zap',
    color: 'accent-secondary',
    description: 'Quick answers & navigation',
    longDescription: 'Fast responses for simple questions and quick navigation around the portfolio.',
    systemPrompt: `You are Spark, Balcha's quick-response assistant.

KEEP RESPONSES BRIEF:
- Maximum 2 sentences per response
- Be direct and helpful
- Focus on navigation and basic facts
- If the question is complex, suggest switching to Iris

Balcha B.Tech at Amrita Vishwa Vidyapeetham, Bangalore.
Top skills: Generative AI, Embedded Systems, Computer Vision, Robotics.
Key projects: PRO_CODE, AUTO-GIT, GPT-OSS Vision, Parshu-STT.`,
    capabilities: ['faq', 'navigation', 'quick-info'],
    examples: [
      'How can I contact Balcha?',
      'Navigate to projects',
      'What is this portfolio about?'
    ],
    responseStyle: 'concise'
  },
  code: {
    id: 'code',
    name: 'Code',
    model: 'mixtral-8x7b-32768',
    icon: 'code',
    color: 'success',
    description: 'Technical project specialist',
    longDescription: 'Deep technical discussions about projects, architecture, and implementation details.',
    systemPrompt: `You are Code, Balcha's technical assistant.

SPECIALIZE IN:
- Code explanations
- Architecture discussions
- Technical deep-dives
- Implementation details
- Technology stack details

BE TECHNICAL BUT CLEAR:
- Use technical terms appropriately
- Explain complex concepts clearly
- Provide code examples when helpful
- Focus on the "how" and "why"

Balcha's key projects:
- PRO_CODE: Local AI coding assistant using Ollama + ChromaDB
- AUTO-GIT: Multi-agent system with parallel LLM orchestration
- GPT-OSS Vision: Q-Former + GPT-OSS for satellite imagery
- Parshu-STT: Windows voice transcription with global hotkey`,
    capabilities: ['code', 'architecture', 'technical', 'implementation'],
    examples: [
      'How does AUTO-GIT orchestrate agents?',
      'Explain the architecture of PRO_CODE',
      'What technologies are used in Parshu-STT?'
    ],
    responseStyle: 'technical'
  }
}

export function getAgentById(id: string): AgentConfig | undefined {
  return AGENTS[id]
}

export function getDefaultAgent(): AgentConfig {
  return AGENTS.iris
}

export function getAgentByModel(model: string): AgentConfig | undefined {
  return Object.values(AGENTS).find(agent => agent.model === model)
}
```

**Implementation Steps:**
1. Create `lib/agent-config.ts` file
2. Define `AgentConfig` interface
3. Create `AGENTS` constant with 3 agent configs
4. Add helper functions (`getAgentById`, `getDefaultAgent`)
5. Export for use in components

---

### 1.3 UI Component Updates

#### File: `components/IrisAssistant.tsx` - Add Agent Selection
**Changes Required:**
```typescript
// Add agent state
const [currentAgent, setCurrentAgent] = useState<AgentConfig>(getDefaultAgent())
const [showAgentSelector, setShowAgentSelector] = useState(false)

// Update handleSendMessage to use current agent's model
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'system', content: currentAgent.systemPrompt },
      ...getConversationHistory(10),
      { role: 'user', content: userMessage }
    ],
    context: { /* ... */ },
    model: currentAgent.model // Pass selected model
  })
})

// Add agent selector UI
{showAgentSelector && (
  <div className="px-4 py-3 border-b border-border-default">
    <p className="text-xs text-text-tertiary mb-2">Choose your assistant:</p>
    <div className="grid grid-cols-1 gap-2">
      {Object.values(AGENTS).map(agent => (
        <button
          key={agent.id}
          onClick={() => {
            setCurrentAgent(agent)
            setShowAgentSelector(false)
          }}
          className={`p-3 rounded-lg border transition-all text-left ${
            currentAgent.id === agent.id
              ? 'border-accent-primary bg-accent-primary/10'
              : 'border-border-default bg-bg-elevated hover:bg-bg-tertiary'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Icon name={agent.icon} className={`w-4 h-4 text-${agent.color}`} />
            <span className="font-semibold text-sm">{agent.name}</span>
          </div>
          <p className="text-xs text-text-secondary">{agent.description}</p>
        </button>
      ))}
    </div>
  </div>
)}
```

**Implementation Steps:**
1. Import `AgentConfig` and `AGENTS` from `lib/agent-config`
2. Add `currentAgent` state
3. Update system prompt to use `currentAgent.systemPrompt`
4. Pass `currentAgent.model` to API
5. Add agent selector UI in header
6. Add agent switcher button in header
7. Persist selected agent in localStorage

---

### 1.4 State Management Updates

#### File: `lib/iris-session.ts` - Add Agent Tracking
**Changes Required:**
```typescript
// Update Session interface
interface Session {
  startTime: number
  messages: Message[]
  topicsDiscussed: string[]
  navigationHistory: string[]
  currentAgent: string // NEW
  agentHistory: Array<{agent: string, timestamp: number}> // NEW
}

// Add agent tracking functions
export function setCurrentAgent(agentId: string): void {
  const session = getSession()
  session.currentAgent = agentId
  session.agentHistory.push({
    agent: agentId,
    timestamp: Date.now()
  })
  saveSession(session)
}

export function getCurrentAgent(): string {
  const session = getSession()
  return session.currentAgent || 'iris'
}

export function getAgentHistory(): Array<{agent: string, timestamp: number}> {
  const session = getSession()
  return session.agentHistory || []
}
```

**Implementation Steps:**
1. Update `Session` interface to include agent tracking
2. Add `setCurrentAgent()` function
3. Add `getCurrentAgent()` function
4. Add `getAgentHistory()` function
5. Initialize session with default agent

---

## Phase 2: Agent Personalities (Week 2)

### 2.1 Visual Differentiation

#### Create Agent-Specific Styling
**File:** `components/AgentAvatar.tsx` - NEW FILE
```typescript
interface AgentAvatarProps {
  agentId: string
  size?: 'sm' | 'md' | 'lg'
  speaking?: boolean
}

export function AgentAvatar({ agentId, size = 'md', speaking }: AgentAvatarProps) {
  const agent = getAgentById(agentId)
  if (!agent) return null

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br flex items-center justify-center`}
         style={{
           from: `var(--color-${agent.color}-primary)`,
           to: `var(--color-${agent.color}-secondary)`
         }}>
      <Icon name={agent.icon} className={iconSize[size]} />
      {speaking && <SpeakingIndicator />}
    </div>
  )
}
```

---

### 2.2 Agent-Specific System Prompts

#### Refine System Prompts
**Tasks:**
1. Test each system prompt with real queries
2. Adjust tone and style based on responses
3. Add agent-specific instructions for:
   - Response length
   - Technical depth
   - Personality markers
   - Domain expertise

**Example Refinements:**
- **Spark:** Add instruction to suggest Iris for complex questions
- **Code:** Add instruction to provide code examples
- **Iris:** Add instruction to offer voice responses

---

### 2.3 Agent Switching UX

#### Implement Smooth Agent Transitions
**Features:**
1. Show notification when switching agents
2. Offer to summarize conversation for new agent
3. Maintain context across agent switches
4. Allow quick switch from message suggestions

**UI Components:**
```typescript
// Agent switch notification
<div className="px-4 py-2 bg-accent-primary/10 border-l-4 border-accent-primary">
  <p className="text-sm">
    Switched to <strong>{currentAgent.name}</strong>
  </p>
  <p className="text-xs text-text-secondary mt-1">
    {currentAgent.longDescription}
  </p>
</div>

// Suggestion to switch agents
{messages.length > 3 && currentAgent.id === 'spark' && (
  <button onClick={() => setCurrentAgent(getAgentById('iris')!)}>
    Continue with Iris for detailed answers
  </button>
)}
```

---

## Phase 3: Smart Routing (Week 3)

### 3.1 Automatic Model Selection

#### File: `lib/agent-router.ts` - NEW FILE
**Purpose:** Intelligently route questions to appropriate agents
```typescript
interface RoutingRule {
  agent: string
  keywords: string[]
  minComplexity?: number
  requiresTechnical?: boolean
}

export const ROUTING_RULES: RoutingRule[] = [
  {
    agent: 'code',
    keywords: ['architecture', 'code', 'implementation', 'how does', 'algorithm', 'api', 'database'],
    requiresTechnical: true
  },
  {
    agent: 'spark',
    keywords: ['navigate', 'contact', 'email', 'where is', 'show me', 'quick', 'simple'],
    minComplexity: 3
  },
  {
    agent: 'iris',
    keywords: [], // Default - catch all
    minComplexity: 4
  }
]

export function routeMessage(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()
  const complexity = calculateComplexity(userMessage)

  // Check technical questions
  if (ROUTING_RULES[0].keywords.some(k => lowerMessage.includes(k))) {
    return 'code'
  }

  // Check simple questions
  if (complexity < 4 && ROUTING_RULES[1].keywords.some(k => lowerMessage.includes(k))) {
    return 'spark'
  }

  // Default to Iris
  return 'iris'
}

function calculateComplexity(message: string): number {
  // Simple heuristic: word count, question marks, technical terms
  const words = message.split(' ').length
  const technicalTerms = (message.match(/architecture|implementation|algorithm|api/gi) || []).length
  return Math.min(10, Math.ceil(words / 5) + technicalTerms)
}
```

**Implementation Steps:**
1. Create routing rules based on keywords
2. Implement complexity scoring
3. Add manual override option
4. Show "Recommended agent" indicator
5. Allow user to accept/override suggestion

---

### 3.2 Context Sharing Between Agents

#### Implement Context Transfer
**Features:**
1. Summarize conversation when switching agents
2. Highlight key topics discussed
3. Maintain topic tracking across agents
4. Provide context to new agent

```typescript
// Add to agent-config.ts
export function generateContextSummary(messages: Message[], targetAgent: string): string {
  const topics = extractTopics(messages)
  const recentMessages = messages.slice(-5)

  return `
CONTEXT FOR ${targetAgent.toUpperCase()}:
- Previous topics: ${topics.join(', ')}
- Conversation length: ${messages.length} messages
- Most recent topic: ${topics[topics.length - 1] || 'None'}

RECENT EXCHANGES:
${recentMessages.map(m => `${m.role}: ${m.content.slice(0, 100)}`).join('\n')}

Please continue the conversation naturally.
  `
}
```

---

### 3.3 Performance Optimization

#### Implement Caching Strategy
```typescript
// lib/agent-cache.ts
interface CacheEntry {
  response: string
  agent: string
  timestamp: number
}

const cache = new Map<string, CacheEntry>()

export function getCachedResponse(question: string, agent: string): string | null {
  const key = `${agent}:${question.toLowerCase().trim()}`
  const entry = cache.get(key)

  if (entry && Date.now() - entry.timestamp < 3600000) { // 1 hour
    return entry.response
  }
  return null
}

export function cacheResponse(question: string, agent: string, response: string): void {
  const key = `${agent}:${question.toLowerCase().trim()}`
  cache.set(key, { response, agent, timestamp: Date.now() })
}
```

**Use Cases:**
- Cache FAQ responses for Spark
- Cache project descriptions for Iris
- Invalidate cache after session reset

---

## Testing Strategy

### Unit Tests (Vitest)
```typescript
// __tests__/agent-config.test.ts
import { describe, it, expect } from 'vitest'
import { AGENTS, getAgentById, getDefaultAgent } from '@/lib/agent-config'

describe('Agent Config', () => {
  it('should have all required agents', () => {
    expect(Object.keys(AGENTS)).toContain('iris')
    expect(Object.keys(AGENTS)).toContain('spark')
    expect(Object.keys(AGENTS)).toContain('code')
  })

  it('should return correct agent by ID', () => {
    expect(getAgentById('iris')?.name).toBe('Iris')
  })

  it('should return Iris as default', () => {
    expect(getDefaultAgent().id).toBe('iris')
  })
})
```

---

### Integration Tests (Playwright)
```typescript
// e2e/multi-agent.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Multi-Agent Chat', () => {
  test('should allow switching between agents', async ({ page }) => {
    await page.goto('/')
    await page.click('[aria-label="Chat with Iris"]')

    // Switch to Spark
    await page.click('text=Switch Agent')
    await page.click('text=Spark')
    await expect(page.locator('text=Spark')).toBeVisible()
  })

  test('should maintain conversation when switching agents', async ({ page }) => {
    await page.goto('/')
    await page.click('[aria-label="Chat with Iris"]')

    // Send message to Iris
    await page.fill('input[placeholder="Ask Iris anything..."]', 'Hello')
    await page.press('input[placeholder="Ask Iris anything..."]', 'Enter')

    // Switch to Code
    await page.click('text=Switch Agent')
    await page.click('text=Code')

    // Context should be maintained
    await expect(page.locator('text=Hello')).toBeVisible()
  })
})
```

---

### Manual Testing Checklist
- [ ] All 3 agents respond correctly
- [ ] Agent switching works smoothly
- [ ] System prompts are applied correctly
- [ ] Context is maintained across switches
- [ ] Voice works with all agents
- [ ] Navigation suggestions work
- [ ] Rate limiting per agent
- [ ] Error handling for invalid models
- [ ] Mobile responsive
- [ ] Performance acceptable

---

## Deployment Plan

### Pre-Deployment
1. **Code Review**
   - Review all changes for security
   - Validate input handling
   - Check error handling
   - Verify rate limiting

2. **Testing**
   - Run all unit tests
   - Run integration tests
   - Manual QA session
   - Performance testing

3. **Documentation**
   - Update README
   - Document new features
   - Create user guide
   - Update API docs

### Deployment Steps
1. Create feature branch
2. Merge changes
3. Deploy to staging
4. Run smoke tests
5. Deploy to production
6. Monitor for 24 hours
7. Gather user feedback

### Rollback Plan
1. Revert to previous commit
2. Restore old IrisAssistant.tsx
3. Remove agent-config.ts
4. Clear caches
5. Verify functionality

---

## Success Metrics

### User Engagement
- Number of agent switches per session
- Most used agents
- Average conversation length per agent
- User satisfaction scores

### Performance
- Response time per agent
- Error rates
- API call success rate
- Cache hit rate

### Business Value
- Time users spend with portfolio
- Questions answered successfully
- Navigation to key pages
- Contact form submissions

---

## Timeline Summary

| Week | Tasks | Deliverables |
|------|-------|--------------|
| **Week 1** | Core Multi-Model Support | - Updated `lib/groq.ts`<br>- Updated `/api/chat/route.ts`<br>- Created `lib/agent-config.ts`<br>- Added agent selector UI<br>- Updated session management |
| **Week 2** | Agent Personalities | - Agent avatars<br>- Refined system prompts<br>- Visual differentiation<br>- Smooth agent transitions |
| **Week 3** | Smart Routing & Polish | - Automatic routing<br>- Context sharing<br>- Performance optimization<br>- Testing & deployment |

---

## Resources Needed

### Development
- 1 Full-stack developer (60 hours total)
- Code review time (10 hours)
- Testing time (15 hours)

### Tools & Services
- Groq Cloud account (existing)
- Monitoring/analytics setup
- Testing infrastructure

### Documentation
- User guide
- API documentation
- Component documentation

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Groq API downtime | High | Implement fallback chain, show error messages |
| Poor model quality | Medium | Extensive testing, fallback to Llama 3.3 |
| User confusion | Low | Clear agent descriptions, default to Iris |
| Performance issues | Medium | Caching, rate limiting, monitor usage |
| Increased costs | Medium | Track usage, optimize routing |

---

## Next Steps

1. **Review this plan** with team
2. **Prioritize features** based on timeline
3. **Set up development environment**
4. **Create feature branch:** `feature/multi-agent-chat`
5. **Begin Phase 1** implementation

---

*Created by: Web Researcher Agent*
*Date: February 2026*
*Based on: GROQ_MODELS_RESEARCH.md*
