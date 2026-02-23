import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProjectDemo, { type ProjectId } from '@/components/ProjectDemo'
import { ProjectContent } from '@/components/ProjectContent'
import { projects } from '@/lib/data/projects'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = (await params).slug
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    }
  }

  const projectKeywords = [
    project.title.toLowerCase(),
    project.category.toLowerCase(),
    ...project.techStack.map(tech => tech.toLowerCase()),
    'AI', 'machine learning', 'embedded systems', 'robotics'
  ].filter(Boolean)

  return {
    title: `${project.title} | Amara Pranav`,
    description: project.description,
    keywords: projectKeywords,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'website',
      url: `https://yourdomain.com/projects/${project.slug}`,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: ['/og-image.jpg'],
    },
    other: {
      'twitter:description': project.description,
    }
  }
}

export async function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }: PageProps) {
  const slug = (await params).slug
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    notFound()
  }

  // Validate that the project slug matches the expected ProjectId type
  const validProjectIds: ProjectId[] = [
    'krishi-setu',
    'ipo-insights',
    'assistive-navigation',
    'distraction-monitoring',
    'llm-aws-deployment'
  ]

  if (!validProjectIds.includes(project.slug as ProjectId)) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <ProjectDemo projectId={project.slug as ProjectId} />
        <ProjectContent
          title={project.title}
          longDescription={project.longDescription}
          howItWorks={project.howItWorks}
          keyFeatures={project.keyFeatures}
          techStack={project.techStack}
          status={project.status}
          category={project.category}
        />
      </main>
      <Footer />
    </>
  )
}
