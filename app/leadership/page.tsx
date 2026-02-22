import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Building, Users, Award, GraduationCap, Rocket, Code, Trophy } from 'lucide-react'

const education = [
  {
    degree: 'B.Tech in Electronics and Computer Engineering',
    institution: 'Amrita Vishwa Vidyapeetham, Bangalore',
    period: '2022 — Present',
    location: 'Bangalore, India',
    type: 'Undergraduate',
    highlights: [
      'Strong foundation in electronics, computer engineering, and AI/ML systems',
      'Coursework in machine learning, embedded systems, and computer vision',
      'Active member of VYOM Space-Tech Club with hands-on project experience',
    ],
  },
]

const leadership = [
  {
    role: 'Office Bearer & Core Team Member',
    organization: 'VYOM Space-Tech Club',
    period: '2022 — Present',
    location: 'Amrita Vishwa Vidyapeetham, Bangalore',
    type: 'Student Leadership',
    highlights: [
      'Led technical initiatives as core office bearer of the space-tech club',
      'SpinLaunch prototype team member - contributed to developing suborbital launch vehicle prototype',
      'Organized workshops and hackathons to promote space technology awareness',
      'Mentored junior students in aerospace engineering projects and technical skills',
    ],
  },
]

const projects = [
  {
    role: 'Lead Developer & Architect',
    name: 'WhisperSTT - Speech Recognition System',
    period: '2024',
    tech: ['Python', 'PyTorch', 'Transformer Models', 'FastAPI'],
    highlights: [
      'Built end-to-end speech-to-text system using OpenAI Whisper architecture',
      'Implemented custom model fine-tuning for domain-specific accuracy improvements',
      'Deployed real-time transcription API with low-latency processing',
      'Achieved competitive word error rates on benchmark datasets',
    ],
  },
  {
    role: 'Creator & Developer',
    name: 'CLI-Tour - Terminal-based Guide',
    period: '2024',
    tech: ['Python', 'CLI', 'Documentation Systems'],
    highlights: [
      'Developed interactive command-line interface for technical documentation',
      'Created intuitive navigation system for complex project structures',
      'Open-source tool with community contributions',
      'Demonstrated expertise in developer experience and tooling',
    ],
  },
  {
    role: 'Research & Development Lead',
    name: 'Multimodal Adapter - AI Integration Framework',
    period: '2024',
    tech: ['PyTorch', 'Hugging Face', 'Computer Vision', 'NLP'],
    highlights: [
      'Developed adapter architecture for integrating multiple AI modalities',
      'Enabled seamless combination of vision and language models',
      'Published research findings on efficient model fine-tuning',
      'Applications in autonomous systems and intelligent assistants',
    ],
  },
  {
    role: 'Systems Engineer',
    name: 'Raspberry Pi Vision - Embedded AI',
    period: '2024',
    tech: ['Raspberry Pi', 'Python', 'OpenCV', 'Edge Computing'],
    highlights: [
      'Built computer vision system on edge computing platform',
      'Implemented real-time object detection and tracking',
      'Optimized models for resource-constrained environments',
      'Applications in robotics and surveillance systems',
    ],
  },
  {
    role: 'Project Lead',
    name: 'AI Robotic Arm - Automation Project',
    period: '2024',
    tech: ['Python', 'Arduino', 'Computer Vision', 'Motor Control'],
    highlights: [
      'Led development of AI-powered robotic arm for pick-and-place operations',
      'Implemented computer vision for object recognition and positioning',
      'Designed control algorithms for precise movement and gripping',
      'Showcased project at university technical exhibition',
    ],
  },
]

export default function LeadershipPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-mono text-4xl font-bold text-text-primary mb-4">
              /leadership
            </h1>
            <p className="font-serif text-lg text-text-secondary max-w-2xl">
              Technical leadership journey through academic excellence, student organization leadership,
              and innovative project development. Building AI/ML systems, mentoring peers,
              and contributing to open-source.
            </p>
          </div>

          {/* Education Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-6 h-6 text-accent-primary" />
              <h2 className="font-mono text-2xl font-bold text-text-primary">Education</h2>
            </div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-bg-secondary border border-border-default rounded-lg p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-mono text-xl font-bold text-text-primary mb-1">
                        {edu.degree}
                      </h3>
                      <p className="font-serif text-lg text-accent-primary mb-2">
                        {edu.institution}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 font-mono text-sm text-text-tertiary">
                        <span>{edu.period}</span>
                        <span>•</span>
                        <span>{edu.location}</span>
                        <span>•</span>
                        <span className="px-2 py-1 bg-bg-elevated rounded">{edu.type}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 mt-4">
                    {edu.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-3 text-text-secondary font-serif">
                        <span className="text-accent-primary mt-1">▹</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Leadership Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="w-6 h-6 text-accent-primary" />
              <h2 className="font-mono text-2xl font-bold text-text-primary">Leadership & Involvement</h2>
            </div>
            <div className="space-y-6">
              {leadership.map((lead, index) => (
                <div
                  key={index}
                  className="bg-bg-secondary border border-border-default rounded-lg p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-mono text-xl font-bold text-text-primary mb-1">
                        {lead.role}
                      </h3>
                      <p className="font-serif text-lg text-accent-primary mb-2">
                        {lead.organization}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 font-mono text-sm text-text-tertiary">
                        <span>{lead.period}</span>
                        <span>•</span>
                        <span>{lead.location}</span>
                        <span>•</span>
                        <span className="px-2 py-1 bg-bg-elevated rounded">{lead.type}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 mt-4">
                    {lead.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-3 text-text-secondary font-serif">
                        <span className="text-accent-primary mt-1">▹</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Projects Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-accent-primary" />
              <h2 className="font-mono text-2xl font-bold text-text-primary">Technical Leadership Projects</h2>
            </div>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-bg-secondary border border-border-default rounded-lg p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-mono text-xl font-bold text-text-primary mb-1">
                        {project.name}
                      </h3>
                      <p className="font-serif text-sm text-text-secondary mb-2">
                        {project.role}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 font-mono text-sm text-text-tertiary mb-3">
                        <span>{project.period}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-bg-elevated rounded text-xs font-mono text-accent-primary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 mt-4">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-3 text-text-secondary font-serif">
                        <span className="text-accent-primary mt-1">▹</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Leadership Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <GraduationCap className="w-6 h-6 text-accent-primary mx-auto mb-2" />
              <p className="font-mono text-3xl font-bold text-text-primary">1</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Degree</p>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <Code className="w-6 h-6 text-accent-primary mx-auto mb-2" />
              <p className="font-mono text-3xl font-bold text-text-primary">5</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Major Projects</p>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <Users className="w-6 h-6 text-accent-primary mx-auto mb-2" />
              <p className="font-mono text-3xl font-bold text-text-primary">20+</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Students Mentored</p>
            </div>
            <div className="bg-bg-secondary border border-border-default rounded-lg p-6 text-center">
              <Rocket className="w-6 h-6 text-accent-primary mx-auto mb-2" />
              <p className="font-mono text-3xl font-bold text-accent-primary">1</p>
              <p className="font-mono text-sm text-text-tertiary mt-1">Space-Tech Club</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
