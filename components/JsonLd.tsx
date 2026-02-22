'use client'

import Script from 'next/script'
import { projects } from '@/lib/data/projects'

interface JsonLdProps {
  type?: 'project' | 'contact' | 'resume'
  data?: any
}

export default function JsonLd({ type = 'project', data }: JsonLdProps) {
  const baseUrl = 'https://yourdomain.com'

  const generateProjectJsonLd = (project: any) => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: `${baseUrl}/projects/${project.slug}`,
    applicationCategory: project.category,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    author: {
      '@type': 'Person',
      name: 'Amara Pranav'
    },
    datePublished: project.period,
    image: `${baseUrl}/og-image.jpg`,
    keywords: project.techStack.join(', '),
    inLanguage: 'en'
  })

  const generateContactJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact - Amara Pranav',
    description: 'Get in touch with Amara Pranav, AI and Data Science Engineer',
    url: `${baseUrl}/contact`,
    mainEntity: {
      '@type': 'Person',
      name: 'Amara Pranav',
      email: 'pranavamara@example.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'India',
        addressCountry: 'IN'
      },
      sameAs: [
        'https://github.com/pranavamara',
        'https://www.linkedin.com/in/pranavamara'
      ]
    }
  })

  const generateResumeJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Amara Pranav',
    jobTitle: 'AI and Data Science Engineer',
    url: baseUrl,
    image: `${baseUrl}/pranav_amara.jpg`,
    description: 'B.Tech student in AI and Data Science at Amrita Vishwa Vidyapeetham. Specializing in machine learning, deep learning, computer vision, and building automation-driven systems.',
    email: 'pranavamara@example.com',
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
      'Automation'
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Amrita Vishwa Vidyapeetham',
      url: 'https://amrita.edu'
    },
    sameAs: [
      'https://github.com/pranavamara',
      'https://www.linkedin.com/in/pranavamara'
    ]
  })

  let jsonLd
  switch (type) {
    case 'project':
      jsonLd = generateProjectJsonLd(data)
      break
    case 'contact':
      jsonLd = generateContactJsonLd()
      break
    case 'resume':
      jsonLd = generateResumeJsonLd()
      break
    default:
      jsonLd = null
  }

  if (!jsonLd) return null

  return (
    <Script
      id={`json-ld-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}