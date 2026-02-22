/**
 * ProjectDemo Usage Examples
 *
 * This file demonstrates various ways to use the ProjectDemo component
 * across your portfolio application.
 */

'use client'

import ProjectDemo, { ProjectId, DemoType } from './ProjectDemo'

/**
 * Example 1: Basic usage with all project demos
 */
export function AllProjectsShowcase() {
  const projects: ProjectId[] = [
    'whisper-stt',
    'cli-tour',
    'multimodal-adapter',
    'raspberry-pi-vision',
    'ai-robotic-arm',
    'spinlaunch-prototype'
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {projects.map(project => (
        <ProjectDemo
          key={project}
          projectId={project}
          demoType="interactive"
        />
      ))}
    </div>
  )
}

/**
 * Example 2: Code-focused demo for technical audience
 */
export function CodeFocusedDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProjectDemo
        projectId="whisper-stt"
        demoType="code"
        title="WhisperSTT Implementation"
        height="500px"
        showControls={true}
      />
    </div>
  )
}

/**
 * Example 3: Visual overview for landing page
 */
export function VisualOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      <ProjectDemo
        projectId="multimodal-adapter"
        demoType="visual"
        height="300px"
        showControls={false}
      />
      <ProjectDemo
        projectId="raspberry-pi-vision"
        demoType="visual"
        height="300px"
        showControls={false}
      />
    </div>
  )
}

/**
 * Example 4: Interactive project showcase with auto-play
 */
export function AutoPlayShowcase() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProjectDemo
        projectId="whisper-stt"
        demoType="interactive"
        autoPlay={true}
        title="Live Speech Recognition Demo"
        height="500px"
      />
    </div>
  )
}

/**
 * Example 5: Tabbed demo switcher
 */
export function TabbedDemoSwitcher() {
  const [activeTab, setActiveTab] = useState<DemoType>('interactive')
  const [activeProject, setActiveProject] = useState<ProjectId>('whisper-stt')

  const demoTypes: DemoType[] = ['interactive', 'code', 'visual']

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      {/* Project selector */}
      <div className="flex flex-wrap gap-2">
        {(['whisper-stt', 'cli-tour', 'multimodal-adapter', 'raspberry-pi-vision', 'ai-robotic-arm', 'spin-launch'] as ProjectId[]).map(project => (
          <button
            key={project}
            onClick={() => setActiveProject(project)}
            className={`px-4 py-2 rounded border transition-colors ${
              activeProject === project
                ? 'bg-accent-primary text-black border-accent-primary'
                : 'bg-background-elevated text-text-primary border-border-default hover:border-accent-primary'
            }`}
          >
            {project.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Demo type selector */}
      <div className="flex gap-2">
        {demoTypes.map(type => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 rounded border transition-colors capitalize ${
              activeTab === type
                ? 'bg-accent-primary text-black border-accent-primary'
                : 'bg-background-elevated text-text-primary border-border-default hover:border-accent-primary'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Active demo */}
      <ProjectDemo
        projectId={activeProject}
        demoType={activeTab}
        height="500px"
      />
    </div>
  )
}

/**
 * Example 6: Minimal demo for cards/sidebars
 */
export function MinimalDemo() {
  return (
    <div className="p-4">
      <ProjectDemo
        projectId="cli-tour"
        demoType="interactive"
        height="300px"
        showControls={false}
      />
    </div>
  )
}

/**
 * Example 7: Custom themed demo
 */
export function ThemedDemo() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProjectDemo
        projectId="ai-robotic-arm"
        demoType="interactive"
        title="Custom Themed Demo"
        height="450px"
        theme={{
          primary: '#10b981',
          secondary: '#059669',
          accent: '#34d399'
        }}
      />
    </div>
  )
}

/**
 * Example 8: Responsive demo grid
 */
export function ResponsiveDemoGrid() {
  const featuredProjects: ProjectId[] = [
    'whisper-stt',
    'cli-tour',
    'multimodal-adapter',
    'ai-robotic-arm'
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-text-primary mb-8">
        Featured Projects
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredProjects.map(project => (
          <ProjectDemo
            key={project}
            projectId={project}
            demoType="interactive"
            height="350px"
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Example 9: Project detail page integration
 */
export function ProjectDetailPage({ projectId }: { projectId: ProjectId }) {
  const [activeDemo, setActiveDemo] = useState<DemoType>('interactive')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Project header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          {projectId.replace('-', ' ').toUpperCase()}
        </h1>
        <p className="text-text-secondary">
          Interactive demonstration of project capabilities
        </p>
      </div>

      {/* Demo tabs */}
      <div className="flex gap-4 mb-6 border-b border-border-default">
        {(['interactive', 'code', 'visual'] as DemoType[]).map(type => (
          <button
            key={type}
            onClick={() => setActiveDemo(type)}
            className={`pb-3 px-2 transition-colors capitalize border-b-2 ${
              activeDemo === type
                ? 'border-accent-primary text-text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {type} Demo
          </button>
        ))}
      </div>

      {/* Demo display */}
      <ProjectDemo
        projectId={projectId}
        demoType={activeDemo}
        height="600px"
        showControls={true}
      />
    </div>
  )
}

/**
 * Example 10: Comparison view - show multiple demos side by side
 */
export function DemoComparison() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-text-primary mb-6">
        Compare Project Demos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Speech Recognition
          </h3>
          <ProjectDemo
            projectId="whisper-stt"
            demoType="interactive"
            height="400px"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Computer Vision
          </h3>
          <ProjectDemo
            projectId="raspberry-pi-vision"
            demoType="interactive"
            height="400px"
          />
        </div>
      </div>
    </div>
  )
}

// Required import for examples
import { useState } from 'react'

/**
 * USAGE INSTRUCTIONS:
 *
 * 1. Import the component:
 *    import ProjectDemo from '@/components/ProjectDemo'
 *
 * 2. Use it in your page:
 *    <ProjectDemo projectId="whisper-stt" demoType="interactive" />
 *
 * 3. Available projects:
 *    - 'whisper-stt': Audio transcription demo
 *    - 'cli-tour': Interactive terminal
 *    - 'multimodal': Image analysis
 *    - 'raspberry-pi-vision': Object detection
 *    - 'ai-robotic-arm': Classification display
 *    - 'spin-launch': Physics simulation
 *
 * 4. Demo types:
 *    - 'interactive': Full interactive demo
 *    - 'code': Code snippet display
 *    - 'visual': Visual overview
 *
 * 5. Props:
 *    - projectId: Required - Project identifier
 *    - demoType: Optional - 'interactive' | 'code' | 'visual' (default: 'interactive')
 *    - title: Optional - Custom title override
 *    - height: Optional - Height in CSS units (default: '400px')
 *    - showControls: Optional - Show control buttons (default: true)
 *    - autoPlay: Optional - Auto-start demo (default: false)
 *    - theme: Optional - Custom color theme
 */
