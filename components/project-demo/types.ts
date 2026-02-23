export type ProjectId =
  | 'krishi-setu'
  | 'ipo-insights'
  | 'assistive-navigation'
  | 'distraction-monitoring'
  | 'llm-aws-deployment'

export type DemoType = 'code' | 'interactive' | 'visual'

export interface ProjectDemoProps {
  projectId: ProjectId
  demoType?: DemoType
  title?: string
  height?: string
  showControls?: boolean
  autoPlay?: boolean
  theme?: {
    primary?: string
    secondary?: string
    accent?: string
  }
}

export interface CodeSnippet {
  language: string
  code: string
  title?: string
}

export interface TranscriptionResult {
  text: string
  timestamp: number
  confidence: number
}

export interface DemoContent {
  title: string
  icon: React.ComponentType<{ className?: string }>
  codeSnippets: CodeSnippet[]
  description: string
}
