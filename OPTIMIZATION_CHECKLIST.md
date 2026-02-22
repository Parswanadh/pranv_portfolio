# Performance Optimization Checklist

## CRITICAL - Do This Week

- [ ] **Lazy load Architecture3D component**
  - File: app/architecture/page.tsx
  - Impact: -600 KB from main bundle
  - Command: Edit page to use dynamic import

- [ ] **Optimize profile image**
  - File: public/parshu_img.jpeg (201 KB)
  - Target: Convert to WebP <50 KB
  - Command: Use squoosh.app or ImageMagick

- [ ] **Install bundle analyzer**
  - Command: npm install @next/bundle-analyzer --save-dev
  - Update next.config.js with analyzer wrapper

## HIGH PRIORITY - Do This Month

- [ ] **Split ProjectDemo component**
  - File: components/ProjectDemo.tsx (1,385 lines)
  - Action: Move demo content to data/ directory
  - Target: Reduce to <300 lines

- [ ] **Replace Framer Motion with CSS**
  - Files: MagneticButton, MagneticWrapper, ScrollProgress
  - Action: Use CSS transforms for simple animations
  - Impact: Reduce Framer Motion usage by 40%

- [ ] **Reduce font families**
  - File: app/layout.tsx
  - Action: Remove Source_Serif_4 font
  - Impact: Save ~30 KB

## MEDIUM PRIORITY - Next Quarter

- [ ] **Add route prefetching**
  - File: app/page.tsx
  - Action: Add prefetch="intent" to key links

- [ ] **Defer service worker**
  - File: app/layout.tsx
  - Action: Change strategy to "lazyOnload"

- [ ] **Add resource hints**
  - File: app/layout.tsx
  - Action: Add preconnect for Google Fonts

- [ ] **Check reduced motion**
  - File: components/WebGpuParticles.tsx
  - Action: Respect prefers-reduced-motion

## Testing Commands

```bash
# Analyze bundle
npm install @next/bundle-analyzer --save-dev
ANALYZE=true npm run build

# Run Lighthouse
npx lighthouse http://localhost:3002 --view

# Check build size
npm run build
du -sh .next/static

# Test on mobile
# Open Chrome DevTools > Device Toolbar > iPhone 12
```

## Expected Results

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Bundle Size | 6.6 MB | ~2.5 MB | <3 MB |
| LCP | 3.5s | ~1.8s | <2.5s |
| Performance Score | 72 | ~85 | >85 |
| FID | 80ms | <80ms | <100ms |
| CLS | 0.05 | <0.05 | <0.1 |

## Success Criteria

- [ ] Lighthouse Performance score > 85
- [ ] Total bundle size < 3 MB
- [ ] LCP < 2.5 seconds
- [ ] No console errors
- [ ] All animations smooth
- [ ] Mobile performance good
