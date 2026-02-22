# Build Issues Analysis - Production Build Failure

## Problem Summary

**Status:** 🔴 CRITICAL - Production build fails

The Next.js production build fails during static page generation with the error:
```
Error: Event handlers cannot be passed to Client Component props.
{onClick: function onClick, className: ..., children: ...}
```

## Root Cause

In Next.js 13+ App Router, Server Components cannot pass functions (event handlers) as props to Client Components. This causes serialization errors during static page generation (SSR).

## Investigation Steps

### 1. Identify the Problematic Page

The error occurs during static generation, so check these files:

```bash
# Find all Server Components (no 'use client' directive)
find app -name "page.tsx" -o -name "layout.tsx" | xargs grep -L "'use client'"

# Check if any are passing functions to Client Components
grep -r "onClick=" app/ --include="*.tsx"
```

### 2. Common Patterns That Cause This Issue

#### Pattern 1: Server Component passing onClick to Client Component
```tsx
// ❌ WRONG - Server Component
export default function Page() {
  return <ClientButton onClick={() => console.log('click')} />
}

// ✅ CORRECT - Move handler to Client Component
// page.tsx (Server Component)
export default function Page() {
  return <ClientButton />
}

// ClientButton.tsx (Client Component)
'use client'
export function ClientButton() {
  const handleClick = () => console.log('click')
  return <button onClick={handleClick}>Click me</button>
}
```

#### Pattern 2: Server Component with inline event handler
```tsx
// ❌ WRONG - Server Component
export default function Page() {
  return (
    <div onClick={() => router.push('/about')}>
      About
    </div>
  )
}
```

### 3. Specific Files to Check

Based on the error and codebase structure, check:

1. **app/page.tsx** - Home page
2. **app/projects/page.tsx** - Projects listing
3. **app/projects/[slug]/page.tsx** - Project details
4. **app/layout.tsx** - Root layout
5. **components/** - Any components used by the above

### 4. How to Debug

```bash
# Build with verbose output
npm run build 2>&1 | tee build-log.txt

# Look for the first occurrence of the error
grep -A 10 "Event handlers cannot be passed" build-log.txt

# Check which page is being generated when error occurs
grep -B 5 "Event handlers cannot be passed" build-log.txt
```

## Potential Fixes

### Option 1: Convert Server Component to Client Component

If a page needs to pass event handlers, add `'use client'` at the top:

```tsx
'use client' // Add this

export default function Page() {
  const handleClick = () => { ... }
  return <ClientComponent onClick={handleClick} />
}
```

**Trade-off:** Loses SSR benefits for that page

### Option 2: Move Event Handlers to Client Component

Keep Server Component for SSR, move interactivity to child:

```tsx
// page.tsx (Server Component)
export default function Page() {
  return <InteractiveClientWrapper />
}

// InteractiveClientWrapper.tsx (Client Component)
'use client'
export function InteractiveClientWrapper() {
  const handleClick = () => { ... }
  return <button onClick={handleClick}>Click</button>
}
```

**Trade-off:** More component nesting

### Option 3: Disable Static Generation for Problematic Pages

Force dynamic rendering for specific pages:

```tsx
// page.tsx
export const dynamic = 'force-dynamic'

export default function Page() {
  // ...
}
```

**Trade-off:** No static generation, slower initial load

### Option 4: Use Data Attributes Instead of Event Handlers

Pass data, let Client Component handle events:

```tsx
// page.tsx (Server Component)
export default function Page() {
  return <ClientComponent action="navigate" target="/about" />
}

// ClientComponent.tsx (Client Component)
'use client'
export function ClientComponent({ action, target }) {
  const handleClick = () => {
    if (action === 'navigate') router.push(target)
  }
  return <button onClick={handleClick}>Go</button>
}
```

**Trade-off:** Less direct, more boilerplate

## Immediate Action Items

1. **Identify the specific page/component causing the error**
   - Check build log for which page is being generated
   - Look for Server Components passing onClick, onChange, etc.

2. **Apply the appropriate fix**
   - Prefer Option 2 (move handlers to Client Component)
   - Use Option 3 (force-dynamic) as temporary workaround

3. **Verify the fix**
   ```bash
   npm run build
   ```

4. **Test in development**
   ```bash
   npm run dev
   # Test the affected pages
   ```

## Files Modified So Far

During testing, these files were fixed for TypeScript/ESLint errors:
- `components/ErrorBoundary.tsx` - Added displayName
- `components/ProjectDemo.tsx` - Exported CodeSnippet
- `lib/proactive-suggestions.ts` - Made prompt optional
- `lib/utils/image-optimizer.ts` - Added React imports
- `src/test/components/ContactForm.test.tsx` - Fixed syntax
- `src/test/lib/env-validation.test.ts` - Fixed syntax
- `src/test.bak/` - Removed

These fixes resolved linting/type errors but NOT the build failure.

## Next Steps

1. Build-Fixer team should investigate the static generation error
2. Identify which Server Component is passing event handlers
3. Refactor to avoid passing functions during SSR
4. Verify production build succeeds
5. Re-run full test suite on production build

## References

- Next.js Docs: https://nextjs.org/docs/getting-started/react-essentials
- Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Client Components: https://nextjs.org/docs/app/building-your-application/rendering/client-components

---

**Created:** 2026-02-18
**Status:** 🔴 BLOCKING DEPLOYMENT
**Priority:** CRITICAL
