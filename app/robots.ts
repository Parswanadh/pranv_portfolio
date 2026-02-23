import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://pranavamara.me'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/static/', '/temp/', '/*/copy', '/*/edit'],
      crawlDelay: 1,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
