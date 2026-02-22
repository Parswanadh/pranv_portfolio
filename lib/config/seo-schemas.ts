/**
 * SEO Schema Configuration
 *
 * Centralized JSON-LD schemas for search engine optimization.
 * Extracted from layout.tsx for better organization.
 */

export const PERSON_SCHEMA = {
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

export const WEBSITE_SCHEMA = {
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

export const AGGREGATE_RATING_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  ratingValue: '4.8',
  reviewCount: '25',
  bestRating: '5',
  worstRating: '1'
}

export const ALL_SCHEMAS = [PERSON_SCHEMA, WEBSITE_SCHEMA, AGGREGATE_RATING_SCHEMA]
