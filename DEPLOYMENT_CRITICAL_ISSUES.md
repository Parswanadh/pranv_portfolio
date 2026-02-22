# Deployment Critical Issues - Quick Fix Guide

**Status:** Must fix before production deployment
**Date:** 2026-02-18

---

## Critical Issues Found

### 1. Placeholder URLs in SEO Schema (HIGH PRIORITY)
**File:** `app/layout.tsx`

**Lines to fix:**
- Line 138: `image: 'https://yourdomain.com/parshu_img.jpeg'`
- Line 183: `url: 'https://yourdomain.com/icon-192.svg'`
- Line 188: `target: 'https://yourdomain.com/search?q={search_term_string}'`

**Fix:**
Replace `https://yourdomain.com` with `https://parswanadh.me`

### 2. Fake Aggregate Ratings (MEDIUM PRIORITY)
**File:** `app/layout.tsx`
**Lines:** 197-204

**Issue:** Hardcoded fake ratings in JSON-LD schema
```javascript
const aggregateRatingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  ratingValue: '4.8',
  reviewCount: '25',
  bestRating: '5',
  worstRating: '1'
}
```

**Fix Options:**
1. Remove this schema entirely (recommended for personal portfolio)
2. Replace with actual review system
3. Update with real data if available

### 3. Missing Resume PDF
**Status:** `resume.pdf` not found in `/public`

**Impact:** If `/resume` page links to this file, it will show 404

**Fix:**
- Add resume PDF to `/public/resume.pdf`
- OR update the resume page to not reference this file

---

## Assets Verification

### Existing Assets
- [x] `/public/parshu_img.jpeg` - EXISTS
- [x] `/public/icon-192.svg` - EXISTS
- [x] `/public/icon-512.svg` - EXISTS
- [x] `/public/apple-touch-icon.svg` - EXISTS
- [x] `/public/manifest.json` - EXISTS
- [x] `/public/sw.js` - EXISTS
- [x] `/public/robots.txt` - EXISTS
- [ ] `/public/resume.pdf` - MISSING

---

## Quick Fix Commands

### Fix Placeholder URLs in layout.tsx
```bash
# Backup first
cp app/layout.tsx app/layout.tsx.backup

# Replace yourdomain.com with parswanadh.me
sed -i 's/https:\/\/yourdomain\.com/https:\/\/parswanadh.me/g' app/layout.tsx
```

### Or manually edit:
Open `app/layout.tsx` and replace all instances of `https://yourdomain.com` with `https://parswanadh.me`

---

## Pre-Deployment Build Test

```bash
# Clean install
rm -rf node_modules .next
npm install

# Build for production
npm run build

# If build fails, check output for errors
```

---

## After Fixes - Verification Checklist

- [ ] All `yourdomain.com` URLs replaced with actual domain
- [ ] Fake ratings removed or replaced with real data
- [ ] Resume PDF added OR resume page updated
- [ ] Production build succeeds
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All images load correctly

---

## Ready to Deploy?

Once all critical issues are fixed:

1. Commit changes: `git add . && git commit -m "Fix critical deployment issues"`
2. Push to master: `git push origin master`
3. Deploy to Vercel (automatic if connected)
4. Run post-deployment checks from `DEPLOYMENT_CHECKLIST.md`

---

**Next Steps:**
1. Fix critical issues above
2. Run `npm run build` to verify
3. Deploy to staging/preview
4. Test thoroughly
5. Deploy to production

**Documents to Review:**
- `DEPLOYMENT_CHECKLIST.md` - Full deployment checklist
- `SECURITY-QUICKREF.md` - Security verification
- `SEO_QUICK_GUIDE.md` - SEO verification
