# Production Deployment Checklist

**Project:** Balcha Venkata Parswanadh Portfolio
**Deployment Target:** Vercel (recommended) or similar Next.js hosting
**Domain:** parswanadh.me

---

## CRITICAL ISSUES - MUST FIX BEFORE DEPLOYMENT

### Placeholder URLs Found
- [ ] **CRITICAL:** Update `https://yourdomain.com` in app/layout.tsx (line 138, 183, 188)
- [ ] **CRITICAL:** Verify OG image `/parshu_img.jpeg` exists in public/ folder
- [ ] **CRITICAL:** Remove or update fake `aggregateRatingJsonLd` (lines 197-204 in layout.tsx)

---

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] `.env.local` exists with proper API keys (if any required)
- [ ] `.env.example` is up-to-date with all required variables
- [ ] `.gitignore` includes `.env.local` and `.env.production`
- [ ] **Verify:** No API keys hardcoded in source code
- [ ] Document all environment variables in this checklist

**Required Environment Variables:**
```bash
# Add any required variables here
# ANALYZE=false (for bundle analyzer)
```

### 2. Code Quality & Build Verification
- [ ] TypeScript compilation passes (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] No TypeScript errors
- [ ] No console.log statements in production code
- [ ] All dependencies are up-to-date
- [ ] No deprecated package warnings

### 3. SEO Configuration
- [ ] Metadata complete in `app/layout.tsx`
- [ ] All placeholder URLs replaced with actual domain
- [ ] Sitemap generation configured (`app/sitemap.ts` exists)
- [ ] Robots.txt configured (`public/robots.txt` or `app/robots.ts`)
- [ ] OG images exist and are optimized
- [ ] Structured data (JSON-LD) is correct
- [ ] All schema.org URLs use actual domain
- [ ] Remove fake ratings from structured data

### 4. Performance Optimization
- [ ] Bundle size optimized (check with `ANALYZE=true npm run build`)
- [ ] Images optimized (WebP/AVIF formats)
- [ ] Code splitting enabled (dynamic imports in layout.tsx)
- [ ] Lazy loading enabled for heavy components
- [ ] Cache headers configured in next.config.js
- [ ] Font optimization (Google Fonts with display: swap)
- [ ] No unused dependencies

### 5. Security Verification
- [ ] No exposed API keys in code
- [ ] Environment variables properly secured
- [ ] Security headers configured in next.config.js
- [ ] CSP headers (if needed)
- [ ] CORS configured correctly for API routes
- [ ] Rate limiting enabled for API routes
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] No `.env.local` or `.env.production` in git

### 6. Assets & Static Files
- [ ] Favicon exists: `/public/icon-192.svg`
- [ ] Apple touch icon exists: `/public/apple-touch-icon.svg`
- [ ] PWA manifest exists: `/public/manifest.json`
- [ ] Service worker exists: `/public/sw.js`
- [ ] OG image exists: `/public/parshu_img.jpeg` (or updated path)
- [ ] Resume PDF exists (if linked): `/public/resume.pdf`
- [ ] All images referenced in code exist

### 7. Testing
- [ ] All critical tests pass
- [ ] E2E tests pass (Playwright)
- [ ] Unit tests pass (Vitest)
- [ ] Manual testing on mobile devices
- [ ] Manual testing on different browsers
- [ ] Accessibility audit passes (Lighthouse)
- [ ] Performance score >90 (Lighthouse)
- [ ] SEO score >90 (Lighthouse)

### 8. PWA Configuration
- [ ] Manifest.json is correct
- [ ] Service worker registered correctly
- [ ] Offline functionality works
- [ ] Install prompt works (if applicable)
- [ ] Icons are correct sizes (192x192, 512x512)

### 9. Git Status
- [ ] All changes committed
- [ ] Working directory clean
- [ ] On correct branch (master/main)
- [ ] No sensitive files in git history
- [ ] `.gitignore` is comprehensive

---

## Deployment Steps

### For Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Connect GitHub repository to Vercel
   # Import project: https://vercel.com/new
   ```

2. **Configure Project Settings**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables** (in Vercel Dashboard)
   ```bash
   NODE_ENV=production
   ```

4. **Assign Domain**
   - Add custom domain: `parswanadh.me`
   - Configure DNS records (see DNS Configuration section)

5. **Deploy**
   - Push to master branch OR
   - Deploy manually from Vercel dashboard

6. **Verify Deployment**
   - Check deployment logs for errors
   - Verify site is accessible
   - Run post-deployment verification

### For Vercel CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Or with specific domain
vercel --prod --yes
```

### For Other Platforms (Netlify, Railway, etc.)

1. Build the project: `npm run build`
2. Deploy the `.next` folder OR
3. Connect repository and use platform's Next.js integration

---

## Post-Deployment Verification

### Critical Checks
- [ ] Site loads at https://parswanadh.me
- [ ] SSL certificate is valid
- [ ] All pages return 200 status
- [ ] No 404 errors on critical assets
- [ ] Images load correctly
- [ ] Forms submit (if any)
- [ ] API routes work (if any)

### SEO Verification
- [ ] Check robots.txt: https://parswanadh.me/robots.txt
- [ ] Check sitemap.xml: https://parswanadh.me/sitemap.xml
- [ ] Check manifest.json: https://parswanadh.me/manifest.json
- [ ] Test with Google Rich Results Test
- [ ] Submit sitemap to Google Search Console
- [ ] Verify Open Graph tags (use Facebook debugger)
- [ ] Verify Twitter cards (use Card validator)

### Performance Verification
- [ ] Run Lighthouse audit (score >90)
- [ ] Check PageSpeed Insights
- [ ] Verify bundle size (<200KB initial)
- [ ] Check Time to First Byte (TTFB <600ms)
- [ ] Verify lazy loading works
- [ ] Check Web Vitals (LCP, FID, CLS)

### Functionality Verification
- [ ] Navigation works on all pages
- [ ] Iris AI assistant loads (if enabled)
- [ ] Command palette works (Ctrl/Cmd + K)
- [ ] Search functionality works
- [ ] Swipe navigation works (mobile)
- [ ] PWA installs correctly
- [ ] Offline mode works

### Monitoring Setup
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Set up analytics (Google Analytics, Vercel Analytics)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure alerts for downtime

---

## Rollback Plan

### Quick Rollback (Vercel)
```bash
# Via Vercel Dashboard
# 1. Go to Deployments tab
# 2. Find previous working deployment
# 3. Click "Promote to Production"

# Or rollback to specific deployment
vercel rollback [deployment-url]
```

### Git Rollback
```bash
# Reset to previous commit
git revert HEAD

# Or hard reset (use with caution)
git reset --hard HEAD~1
git push --force

# Then redeploy
```

### Rollback Checklist
- [ ] Identify broken deployment
- [ ] Rollback to last known good version
- [ ] Verify rollback was successful
- [ ] Communicate with users (if applicable)
- [ ] Investigate root cause
- [ ] Fix issue in staging/dev
- [ ] Test thoroughly
- [ ] Redeploy when fixed

---

## DNS Configuration

### For Vercel + Custom Domain

1. **A Record** (if using root domain)
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel's IPv4)
   ```

2. **CNAME Record** (if using www)
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **AAAA Record** (IPv6, optional)
   ```
   Type: AAAA
   Name: @
   Value: 2600:1f18:2587:8302::3 (Vercel's IPv6)
   ```

### DNS Propagation
- Typically takes 24-48 hours
- Usually completes within 1-2 hours
- Check propagation: https://dnschecker.org

### SSL Certificate
- Automatically provisioned by Vercel
- May take up to 24 hours to activate
- Check status in Vercel dashboard

---

## Environment Variables Reference

### Production Variables
```bash
# Node Environment
NODE_ENV=production

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API Keys (If needed for features)
# Add your API keys here
```

### Development Variables (Not for Production)
```bash
NODE_ENV=development
```

---

## Monitoring & Analytics Setup

### Vercel Analytics (Built-in)
```bash
# Automatic with Vercel deployment
# View in Vercel Dashboard > Analytics
```

### Google Analytics (Optional)
1. Create GA4 property
2. Add measurement ID to environment variables
3. Update app/layout.tsx with GA script

### Error Tracking (Optional)
- **Sentry:** https://sentry.io
- **LogRocket:** https://logrocket.com
- **Vercel Logs:** Built-in with Vercel

### Uptime Monitoring (Optional)
- **UptimeRobot:** https://uptimerobot.com
- **Pingdom:** https://pingdom.com
- **StatusCake:** https://statuscake.com

---

## Troubleshooting

### Build Failures
1. Check deployment logs
2. Verify environment variables
3. Check for type errors: `npm run build`
4. Verify no missing dependencies

### Runtime Errors
1. Check browser console
2. Check Vercel logs
3. Verify API routes
4. Check environment variables

### SEO Issues
1. Verify metadata in app/layout.tsx
2. Check robots.txt and sitemap.xml
3. Use Google Search Console
4. Test with Rich Results Test

### Performance Issues
1. Run bundle analyzer: `ANALYZE=true npm run build`
2. Check image sizes
3. Verify lazy loading
4. Review Lighthouse report

---

## Deployment Best Practices

1. **Always deploy to a preview environment first**
2. **Test thoroughly before promoting to production**
3. **Keep backups of working deployments**
4. **Monitor after deployment**
5. **Have a rollback plan ready**
6. **Document any deployment-specific issues**
7. **Keep deployment scripts version controlled**
8. **Use environment-specific branches**

---

## Contact & Support

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **DNS Help:** Contact your domain registrar

---

## Checklist Status

- [ ] All pre-deployment items complete
- [ ] All critical issues resolved
- [ ] Deployment completed successfully
- [ ] Post-deployment verification passed
- [ ] Monitoring configured

**Last Updated:** 2026-02-18
**Next Review:** After each deployment
