# Bundle Size Breakdown

## Total JavaScript Size: ~15 MB uncompressed (~6.6 MB compressed)

## Critical Bundles

### 1. main-app.js (5.8 MB) - CRITICAL ISSUE
**Contains:**
- React framework
- Next.js runtime
- Three.js (unnecessarily included)
- Framer Motion
- All page layouts
- Shared components

**Problem:** Three.js is bundled even though it's only used on /architecture page

**Solution:** 
- Move Architecture3D to separate chunk
- Lazy load Three.js dependencies
- Split by route

---

### 2. app/layout.js (3.75 MB) - CRITICAL ISSUE
**Contains:**
- Root layout component
- All dynamic imports (not actually split)
- Font loading
- Service worker registration
- Global providers

**Problem:** Dynamic imports in layout are not properly code-split

**Solution:**
- Verify dynamic imports are working
- Check if ssr: false is respected
- Consider moving some components to page-level

---

### 3. app/page.js (2.91 MB) - HIGH PRIORITY
**Contains:**
- Homepage component
- All bento grid components
- Featured projects data
- Magnetic effects
- Framer Motion animations

**Problem:** Too much inline data and components

**Solution:**
- Move static data to separate files
- Lazy load non-critical bento cards
- Consider CSS-only animations for some effects

---

## Medium-Sized Chunks

### 4. b536a0f1.js (688 KB)
**Likely contains:** Framer Motion or similar animation library

### 5. 910.js (209 KB)
**Likely contains:** Part of React/Next.js framework

### 6. fd9d1056.js (173 KB)
**Likely contains:** Utility functions or middleware

---

## Page-Specific Chunks

### Homepage: app/page.js (2.91 MB)
### Layout: app/layout-aef3ccc9.js (67 KB) - GOOD size
### Projects: app/projects/[slug]/page.js (39 KB) - GOOD size
### Agents: app/agents/page.js (28 KB) - EXCELLENT size

## Analysis

**Good News:**
- Route-based chunks are small (28-67 KB)
- Projects page well-optimized
- Agents page very efficient

**Bad News:**
- Main bundles are massive
- Three.js leaking into main bundle
- Layout chunk too large

## Recommendations

1. **Install bundle analyzer**
   ```bash
   npm install @next/bundle-analyzer
   ```

2. **Add to next.config.js**
   ```js
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })
   
   module.exports = withBundleAnalyzer({
     // your config
   })
   ```

3. **Run analyzer**
   ```bash
   ANALYZE=true npm run build
   ```

4. **Fix Three.js bundle issue**
   - Ensure Architecture3D is truly lazy loaded
   - Check for other Three.js imports
   - Verify no direct imports in layout or pages
