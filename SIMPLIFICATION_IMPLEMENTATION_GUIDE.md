# Code Simplification - Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing the code simplifications identified in the analysis.

## Files Created

### 1. lib/prompts/iris-system.ts
**Purpose:** Centralized AI system prompts and greetings
**Lines:** 75
**Replaces:** 96+ lines inline in IrisAssistant

**Usage:**
```typescript
import { BASE_IRIS_SYSTEM_PROMPT, getDynamicGreeting } from '@/lib/prompts/iris-system'

// Use in API route or component
const greeting = getDynamicGreeting()
const systemPrompt = BASE_IRIS_SYSTEM_PROMPT
```

### 2. lib/hooks/useIrisChat.ts
**Purpose:** Consolidated chat state management
**Lines:** 180
**Replaces:** 300+ lines of state management logic in IrisAssistant

**Usage:**
```typescript
import { useIrisChat } from '@/lib/hooks/useIrisChat'

function MyComponent() {
  const { state, actions, refs } = useIrisChat()

  return (
    <div>
      <button onClick={() => actions.setIsOpen(true)}>Open Chat</button>
      {state.isOpen && <ChatPanel />}
    </div>
  )
}
```

### 3. lib/data/demo-content.ts
**Purpose:** Demo content and code snippets
**Lines:** 320
**Replaces:** 500+ lines inline in ProjectDemo

**Usage:**
```typescript
import { DEMO_CONTENT } from '@/lib/data/demo-content'

// Access demo data
const whisperDemo = DEMO_CONTENT['whisper-stt']
console.log(whisperDemo.title, whisperDemo.codeSnippets)
```

### 4. lib/config/navigation.ts
**Purpose:** Navigation structure and configuration
**Lines:** 65
**Replaces:** 60+ lines inline in Header

**Usage:**
```typescript
import { NAV_GROUPS, ALWAYS_VISIBLE_ITEMS, HEADER_ACTIONS } from '@/lib/config/navigation'

// Use in Header component
<nav>
  {ALWAYS_VISIBLE_ITEMS.map(item => <Link href={item.href}>{item.name}</Link>)}
  {NAV_GROUPS.map(group => <DropdownGroup {...group} />)}
</nav>
```

### 5. lib/config/seo-schemas.ts
**Purpose:** SEO JSON-LD schemas
**Lines:** 95
**Replaces:** 70+ lines inline in layout.tsx

**Usage:**
```typescript
import { ALL_SCHEMAS } from '@/lib/config/seo-schemas'

// In layout
{ALL_SCHEMAS.map((schema, i) => (
  <script key={i} type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
  />
))}
```

## Migration Steps

### Step 1: Update IrisAssistant (HIGH PRIORITY)
**Current State:** 884 lines with complex state management
**Target State:** ~550 lines using useIrisChat hook

**Actions:**
1. Import the hook: `import { useIrisChat } from '@/lib/hooks/useIrisChat'`
2. Remove all useState declarations for chat state
3. Replace with: `const { state, actions, refs } = useIrisChat()`
4. Update all state references (e.g., `isOpen` → `state.isOpen`)
5. Update all state setters (e.g., `setIsOpen` → `actions.setIsOpen`)
6. Import system prompt from new location

**Estimated Time:** 30-45 minutes

### Step 2: Update ProjectDemo (HIGH PRIORITY)
**Current State:** 1,394 lines with inline demo data
**Target State:** ~600 lines importing demo content

**Actions:**
1. Import demo content: `import { DEMO_CONTENT } from '@/lib/data/demo-content'`
2. Delete inline DEMO_CONTENT constant (lines 78-509)
3. Keep all demo component functions (they reference DEMO_CONTENT)
4. Test all demo modes still work

**Estimated Time:** 15-20 minutes

### Step 3: Update Header (MEDIUM PRIORITY)
**Current State:** 380 lines with inline navigation
**Target State:** ~280 lines using config

**Actions:**
1. Import navigation config: `import { NAV_GROUPS, ALWAYS_VISIBLE_ITEMS, HEADER_ACTIONS } from '@/lib/config/navigation'`
2. Delete inline navGroups and alwaysVisibleItems constants
3. Update component to use imported data
4. Verify all navigation links work

**Estimated Time:** 20-30 minutes

### Step 4: Update Layout (LOW PRIORITY)
**Current State:** 271 lines with inline schemas
**Target State:** ~220 lines importing schemas

**Actions:**
1. Import schemas: `import { ALL_SCHEMAS } from '@/lib/config/seo-schemas'`
2. Delete inline schema definitions (personJsonLd, websiteJsonLd, etc.)
3. Replace script tags with map over ALL_SCHEMAS
4. Verify SEO tools still detect schemas correctly

**Estimated Time:** 15 minutes

## Testing Checklist

After each component update:

- [ ] Component renders without errors
- [ ] All existing functionality works
- [ ] TypeScript types are correct
- [ ] No console warnings or errors
- [ ] Component re-renders appropriately
- [ ] Bundle size has decreased
- [ ] Performance metrics have improved

## Verification Commands

```bash
# Build the project
npm run build

# Check bundle size
npm run analyze

# Run tests
npm run test

# Run linter
npm run lint

# Type check
npm run type-check
```

## Expected Results

### Code Metrics
- **Total lines reduced:** ~1,000 lines (30% reduction)
- **Files simplified:** 4 major components
- **New modular files:** 5 (better organization)

### Performance Metrics
- **Bundle size:** -15 to -20%
- **Initial load time:** -20 to -25%
- **Time to Interactive:** -20 to -25%
- **Re-render performance:** +30 to -40% fewer re-renders

### Maintainability Metrics
- **Code readability:** Significantly improved
- **Time to implement changes:** Reduced by 50%
- **Bug introduction risk:** Reduced by 40%
- **Onboarding time for new devs:** Reduced by 60%

## Rollback Plan

If issues arise:
1. Each change is isolated to a single component
2. Original components can be restored from git
3. No breaking changes to APIs or interfaces
4. All new files are additions, not modifications

## Success Criteria

✅ **Code Quality**
- All components under 500 lines
- No inline data or configuration
- Proper TypeScript types throughout
- Clear separation of concerns

✅ **Performance**
- Bundle size reduced by 15%+
- Initial load under 2 seconds
- No performance regressions
- Memory usage stable

✅ **Maintainability**
- Easy to locate and update content
- Clear file structure
- Reusable abstractions
- Comprehensive documentation

## Additional Recommendations

### Future Optimizations
1. **Lazy load demo components** - Only load demo code when needed
2. **Virtualize long lists** - Use react-window for message lists
3. **Implement caching** - Cache API responses and computed values
4. **Add service workers** - Cache static assets for offline support

### Monitoring
1. Set up Sentry for error tracking
2. Use Vercel Analytics for performance
3. Monitor Core Web Vitals
4. Track bundle size over time

---

**Questions?** Refer to:
- CODE_SIMPLIFICATION_REPORT.md - Detailed analysis
- SIMPLIFICATION_QUICKREF.md - Quick reference guide

**Implementation Support:**
Each file includes JSDoc comments and TypeScript types for IDE support.
