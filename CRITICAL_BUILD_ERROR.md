# 🔴 CRITICAL BUILD ERROR - Production Blocked

**Severity**: BLOCKING DEPLOYMENT
**Date**: 2026-02-18
**Status**: BUILD FAILING

---

## 🚨 Error Summary

**Build Command**: `npm run build`
**Status**: ❌ FAILING
**Impact**: Cannot deploy to production, project detail pages returning 404

---

## The Error

```
Error: Event handlers cannot be passed to Client Component props.
  {onClick: function onClick, className: ..., children: ...}
            ^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

**Error Code**: `Event handlers cannot be passed to Client Component props`

**Occurrences**: Multiple times during static page generation

---

## Root Cause

In Next.js 14 App Router:
- **Server Components** cannot pass functions (event handlers) to **Client Components**
- This happens when a Server Component tries to pass `onClick` or other event handlers as props
- The build process fails during static generation when it encounters this pattern

---

## Why This Breaks Project Pages

The build process:
1. Starts generating static pages (0/37)
2. Successfully compiles
3. Begins collecting page data
4. **FAILS** when trying to generate pages with onClick handlers passed from Server to Client components
5. Build stops, leaving `/projects/[slug]` pages ungenerated
6. Result: 404 errors on all project detail pages

---

## Common Causes

### 1. **Direct onClick in Server Component**
```tsx
// ❌ WRONG - Server Component passing onClick
export default function ServerPage() {
  return <ClientButton onClick={() => handleClick()} />
}
```

### 2. **onClick in Data Passed to Client Component**
```tsx
// ❌ WRONG - Server passing function in data
export default function ServerPage() {
  const items = [{ onClick: () => handleClick() }]
  return <ClientList items={items} />
}
```

### 3. **Components Missing 'use client' Directive**
```tsx
// ❌ WRONG - Component with onClick but no 'use client'
export default function MyComponent() {
  return <button onClick={handleClick}>Click</button>
}
```

---

## Required Fixes

### Immediate Actions:

1. **Audit all components with onClick handlers**
   - Find which Server Components are passing onClick to Client Components
   - Check for missing 'use client' directives

2. **Fix Server/Client component boundaries**
   - Add 'use client' to components that need onClick
   - OR move onClick handlers to the Client Component that uses them
   - OR use data attributes and handle events in child components

3. **Common patterns to fix**:

```tsx
// ✅ CORRECT - Client Component handles its own events
'use client'
export default function ClientButton() {
  return <button onClick={handleClick}>Click</button>
}

// ✅ CORRECT - Pass data, not functions
export default function ServerPage() {
  const action = '/api/submit'  // Pass string, not function
  return <ClientForm action={action} />
}

// ✅ CORRECT - Use callback pattern
export default function ClientForm({ action }) {
  const handleSubmit = () => { /* handle action */ }
  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## Files to Check

Based on the error pattern, check these files:

### High Priority:
1. `app/projects/[slug]/page.tsx` - Project detail pages
2. `components/ProjectDemo.tsx` - Likely has onClick handlers
3. `components/ProjectContent.tsx` - May have interactive elements
4. `components/Header.tsx` - Has many onClick handlers
5. `app/page.tsx` - Homepage with interactive elements

### Medium Priority:
6. All components in `components/` directory with onClick
7. All page components that use interactive components

---

## Fix Strategy

### Phase 1: Identify (5 min)
1. Search for all `onClick=` in the codebase
2. Check which files are missing `'use client'`
3. Find Server Components passing functions to Client Components

### Phase 2: Fix (15 min)
1. Add `'use client'` to components that need it
2. Restructure Server/Client component boundaries
3. Remove function props from Server to Client components

### Phase 3: Verify (10 min)
1. Run `npm run build` again
2. Check if build completes successfully
3. Test project detail pages work

---

## Testing Commands

```bash
# Check for 'use client' directives
grep -r "use client" app/ components/

# Find all onClick handlers
grep -r "onClick=" app/ components/

# Run build (this should fail currently)
npm run build

# After fixes, run build again
npm run build

# Test in dev mode
npm run dev
```

---

## Expected Outcome

After fixing:
- ✅ `npm run build` completes successfully
- ✅ All 37 static pages generate
- ✅ `/projects/[slug]` pages work without 404 errors
- ✅ Production deployment is unblocked

---

## Priority

🔴 **CRITICAL** - This is blocking:
- Production deployment
- Project detail pages from working
- Static page generation
- User ability to view project details

---

## Assignment

**Assigned to**: Code-Simplifier teammate (currently running)

**Task**: Fix all Server/Client component boundary issues preventing build

**Deliverable**: Successful production build with all pages generating correctly

---

**Next Step**: Code-Simplifier should prioritize fixing these build errors before continuing with other optimizations.

---

**Report Created**: 2026-02-18 06:55:00
**Status**: 🔴 BLOCKING DEPLOYMENT
**Action Required**: IMMEDIATE
