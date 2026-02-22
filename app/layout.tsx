import type { Metadata } from 'next'
import { JetBrains_Mono, Inter, Source_Serif_4 } from 'next/font/google'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import './globals.css'
import { AudioWelcome } from '@/components/AudioWelcome'
import { ScrollProgress, ScrollToTop } from '@/components/ScrollProgress'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import { SwipeNavigationWrapper } from '@/components/SwipeNavigationWrapper'

// Dynamic imports for heavy components - lazy loaded to reduce initial bundle size
const CanvasParticles = dynamic(() => import('@/components/CanvasParticles').then(m => ({ default: m.CanvasParticles })), {
  ssr: false,
  loading: () => null
})

const IrisAssistant = dynamic(() => import('@/components/IrisAssistant').then(m => ({ default: m.default })), {
  ssr: false,
  loading: () => null
})

const CommandPalette = dynamic(() => import('@/components/CommandPalette').then(m => ({ default: m.CommandPalette })), {
  ssr: false,
  loading: () => null
})

const SmartSearch = dynamic(() => import('@/components/SmartSearch').then(m => ({ default: m.SmartSearch })), {
  ssr: false
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pranavamara.me'),
  title: 'Amara Pranav | AI and Data Science Engineer',
  description: "B.Tech student in AI and Data Science at Amrita Vishwa Vidyapeetham. Specializing in machine learning, deep learning, computer vision, and building automation-driven systems.",
  keywords: [
    'Amara Pranav', 'portfolio', 'AI engineer', 'Data Science', 'Machine Learning',
    'Deep Learning', 'Computer Vision', 'NLP', 'LLMs', 'IoT', 'Raspberry Pi', 'Arduino',
    'AI and Data Science', 'Amrita University', 'automation', 'robotics'
  ],
  authors: [{ name: 'Amara Pranav' }],
  creator: 'Amara Pranav',
  publisher: 'Amara Pranav',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BVP Portfolio',
  },
  icons: {
    icon: '/icon-192.svg',
    apple: '/apple-touch-icon.svg',
  },
  openGraph: {
    title: 'Amara Pranav | AI and Data Science Engineer',
    description: 'B.Tech student in AI and Data Science at Amrita Vishwa Vidyapeetham. Specializing in machine learning, deep learning, computer vision, and building automation-driven systems.',
    type: 'website',
    url: 'https://pranavamara.me',
    siteName: 'Amara Pranav Portfolio',
    locale: 'en_US',
    images: [
      {
        url: '/pranav_amara.jpg',
        width: 1200,
        height: 630,
        alt: 'Amara Pranav - AI and Data Science Engineer',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '',
    creator: '',
    title: 'Amara Pranav | AI and Data Science Engineer',
    description: 'B.Tech student in AI and Data Science at Amrita Vishwa Vidyapeetham. Specializing in machine learning, deep learning, computer vision, and building automation-driven systems.',
    images: ['/pranav_amara.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5a623' },
    { media: '(prefers-color-scheme: dark)', color: '#f5a623' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Person Schema
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Amara Pranav',
    jobTitle: 'AI and Data Science Engineer',
    url: 'https://pranavamara.me',
    email: 'pranavamara@example.com',
    image: 'https://pranavamara.me/pranav_amara.jpg',
    sameAs: [
      'https://github.com/pranavamara',
      'https://www.linkedin.com/in/pranavamara'
    ],
    knowsAbout: [
      'Machine Learning',
      'Deep Learning',
      'Computer Vision',
      'NLP',
      'LLMs',
      'IoT',
      'Robotics',
      'AI and Data Science',
      'Data Science',
      'Automation',
      'Raspberry Pi',
      'Arduino'
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Amrita Vishwa Vidyapeetham',
      url: 'https://amrita.edu'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'India',
      addressCountry: 'IN'
    }
  }

  // WebSite Schema
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Amara Pranav Portfolio',
    url: 'https://pranavamara.me',
    description: 'Portfolio showcasing AI and Data Science projects by Amara Pranav',
    author: {
      '@type': 'Person',
      name: 'Amara Pranav'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Amara Pranav',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pranavamara.me/icon-192.svg'
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pranavamara.me/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en',
    isAccessibleForFree: true,
    isFamilyFriendly: true
  }

  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable} ${sourceSerif.variable}`}>
      <head>
        <link rel="icon" href="/icon-192.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#f5a623" />
          <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          id="service-worker-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'all'
                  }).then((registration) => {
                    console.log('SW registered:', registration)
                  }).catch((error) => {
                    console.error('SW registration failed:', error)
                  })
                })
              }
            `
          }}
        />
      </head>
      <body className="font-sans">
        <CanvasParticles />
        <ScrollProgress />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent-primary focus:text-bg-primary focus:rounded focus:font-mono focus:text-sm focus:pointer-events-auto"
        >
          Skip to main content
        </a>
        <SwipeNavigationWrapper>
          <div id="main-content">
            {children}
          </div>
        </SwipeNavigationWrapper>
        <ScrollToTop />
        <IrisAssistant />
        <CommandPalette />
        <SmartSearch />
        <AudioWelcome />
        <PWAInstallPrompt />
        <OfflineIndicator />
      </body>
    </html>
  )
}
