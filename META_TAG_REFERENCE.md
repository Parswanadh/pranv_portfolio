# Meta Tag Reference - Current State

This document shows the current meta tags on each page for quick reference.

## Root Layout (applies to all pages without page-specific metadata)

**File:** `D:\projects\portfolio\app\layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'Balcha Venkata Parswanadh | AI & Embedded Systems Engineer',
  description: 'B.Tech student in Electronics and Computer Engineering at Amrita Vishwa Vidyapeetham. Specializing in Generative AI, embedded systems, and hardware-software co-design.',
  keywords: ['portfolio', 'Generative AI', 'Embedded Systems', 'LLM', 'Computer Vision', 'IoT', 'Raspberry Pi', 'Arduino'],
  authors: [{ name: 'Balcha Venkata Parswanadh' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BVP Portfolio',
  },
  openGraph: {
    title: 'Balcha Venkata Parswanadh | AI & Embedded Systems Engineer',
    description: 'Building intelligent systems at the edge of innovation',
    type: 'website',
  },
}
```

## Pages Audit Summary

| Page | Has Metadata? | Title | Description | OG Title | OG Desc | OG Image |
|------|---------------|-------|-------------|----------|---------|----------|
| `/` | ❌ Uses root | Root title | Root desc | Root | Root | ❌ Missing |
| `/about` | ❌ Uses root | Root title | Root desc | Root | Root | ❌ Missing |
| `/projects` | ❌ Uses root | Root title | Root desc | Root | Root | ❌ Missing |
| `/contact` | ❌ Uses root | Root title | Root desc | Root | Root | ❌ Missing |
| `/agents` | ❌ Uses root | Root title | Root desc | Root | Root | ❌ Missing |
| `/projects/[slug]` | ✅ Dynamic | Dynamic | Dynamic | ❌ Missing | ❌ Missing | ❌ Missing |
| `/leadership` | ❌ Uses root | Root title | Root desc | Root | Root | ❌ Missing |
| `/research` | ❌ Uses root | Root title | Root desc | Root | Root | ❌ Missing |
| `/tools` | ❌ Uses root | Root title | Root desc | Root | Root | ❌ Missing |
| `/resume` | ❌ Uses root | Root title | Root desc | Root | Root | ❌ Missing |

## Project Pages

**File:** `D:\projects\portfolio\app\projects\[slug]\page.tsx`

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | Balcha Venkata Parswanadh`,
    description: project.description,
  }
}
```

## JSON-LD Structured Data

**File:** `D:\projects\portfolio\app\layout.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Balcha Venkata Parswanadh",
  "jobTitle": "AI & Embedded Systems Engineer",
  "url": "https://yourdomain.com",
  "email": "venkataparswanadh@gmail.com",
  "sameAs": [
    "https://github.com/Parswanadh",
    "https://www.linkedin.com/in/parswanadh-balcha"
  ],
  "knowsAbout": [
    "Generative AI",
    "Embedded Systems",
    "Computer Vision",
    "LLMs",
    "IoT",
    "Robotics"
  ],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Amrita Vishwa Vidyapeetham"
  }
}
```

## Sitemap

**File:** `D:\projects\portfolio\app\sitemap.ts`

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yourdomain.com'
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/agents`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/leadership`, lastModified: new Date() },
    { url: `${baseUrl}/research`, lastModified: new Date() },
    { url: `${baseUrl}/tools`, lastModified: new Date() },
    { url: `${baseUrl}/resume`, lastModified: new Date() },
  ]
}
```

## Robots.txt

**File:** `D:\projects\portfolio\app\robots.ts`

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow: '/' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

## Issues Summary

1. **All pages except project details** use the same root metadata
2. **No page-specific metadata** for main pages (about, projects, contact, etc.)
3. **Placeholder domain** `yourdomain.com` throughout
4. **No OG images** configured
5. **No canonical URLs** set
6. **Project detail pages** have custom title/description but no OG tags
7. **Sitemap missing** detail pages (individual projects, research, tools)
