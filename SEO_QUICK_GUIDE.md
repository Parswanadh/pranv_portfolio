# SEO Quick Reference Guide

## Essential SEO Checklist

### ✅ Completed
- [x] Comprehensive metadata for all pages
- [x] Open Graph images (1200x630)
- [x] Twitter cards implementation
- [x] Sitemap.xml generation
- [x] Robots.txt configuration
- [x] Structured data (JSON-LD)
- [x] Dynamic SEO for project pages
- [x] Cross-platform compatibility

### 🔧 Quick Fixes Needed
- [ ] Replace `yourdomain.com` with actual domain
- [ ] Add actual Twitter handle in metadata
- [ ] Create real OG image (1200x630)
- [ ] Configure Google Search Console
- [ ] Set up Google Analytics 4

## File Structure
```
/
├── app/
│   ├── layout.tsx              # Main SEO metadata
│   ├── robots.ts              # Next.js robots config
│   ├── sitemap.ts             # Dynamic sitemap
│   ├── page.tsx               # Home page SEO
│   ├── projects/
│   │   ├── page.tsx           # Projects page SEO
│   │   └── [slug]/page.tsx    # Dynamic project SEO
│   ├── contact/page.tsx       # Contact page SEO
│   └── resume/page.tsx        # Resume page SEO
├── components/
│   └── JsonLd.tsx            # JSON-LD component
├── public/
│   ├── robots.txt             # Static robots file
│   ├── og-image.jpg          # Open Graph image
│   └── verify-seo.txt        # SEO verification
└── SEO_OPTIMIZATION_REPORT.md # Full documentation
```

## Metadata Templates

### Home Page
```tsx
{
  title: 'Balcha Venkata Parswanadh | AI & Embedded Systems Engineer',
  description: 'B.Tech student specializing in Generative AI, embedded systems, and hardware-software co-design.',
  keywords: ['portfolio', 'Generative AI', 'Embedded Systems', 'LLM', 'Computer Vision', 'IoT'],
  openGraph: {
    title: 'Balcha Venkata Parswanadh | AI & Embedded Systems Engineer',
    description: 'Building intelligent systems at the edge of innovation',
    type: 'website',
    images: ['/og-image.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balcha Venkata Parswanadh | AI & Embedded Systems Engineer',
    description: 'Building intelligent systems at the edge of innovation',
    images: ['/og-image.jpg']
  }
}
```

### Project Page
```tsx
{
  title: `${project.title} | Balcha Venkata Parswanadh`,
  description: project.description,
  keywords: [
    project.title.toLowerCase(),
    project.category.toLowerCase(),
    ...project.techStack.map(tech => tech.toLowerCase())
  ],
  openGraph: {
    title: project.title,
    description: project.description,
    type: 'website',
    url: `https://yourdomain.com/projects/${project.slug}`,
    images: ['/og-image.jpg']
  }
}
```

## Common SEO Issues to Avoid

1. **Missing Meta Descriptions**
   - All pages have descriptions under 160 characters
   - Descriptions include primary keywords

2. **Duplicate Content**
   - Dynamic routing prevents duplicate pages
   - Proper canonical URLs implemented

3. **Slow Loading**
   - Images optimized with Next.js Image component
   - Code splitting implemented
   - Lazy loading for non-critical components

4. **Mobile Unfriendliness**
   - Responsive design with Tailwind CSS
   - Mobile-first approach
   - Touch-friendly navigation

## Testing Commands

### Local Development
```bash
npm run dev
# Visit http://localhost:3000/sitemap.xml
# Visit http://localhost:3000/robots.txt
```

### Build Verification
```bash
npm run build
npm start
```

### SEO Testing URLs
- Sitemap: http://localhost:3000/sitemap.xml
- Robots: http://localhost:3000/robots.txt
- JSON-LD: View page source → Search for "application/ld+json"

## Performance Metrics

### Target Scores
- Google PageSpeed: 90+ (Mobile), 95+ (Desktop)
- Lighthouse: 90+ across all categories
- Web Vitals:
  - LCP: < 2.5s
  - INP: < 200ms
  - CLS: < 0.1

## Maintenance Checklist

### Weekly
- [ ] Check search console for new issues
- [ ] Monitor Core Web Vitals
- [ ] Review keyword rankings

### Monthly
- [ ] Update project descriptions if needed
- [ ] Check backlink profile
- [ ] Update sitemap with new projects

### Quarterly
- [ ] Content audit and optimization
- [ ] Technical SEO review
- [ ] Competitor analysis

---

*Created: 2026-02-18*
*Last Updated: 2026-02-18*