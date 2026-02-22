export type ProjectId =
  | 'whisper-stt'
  | 'cli-tour'
  | 'gpt-oss-vision'
  | 'multimodal-adapter'
  | 'pro-code'
  | 'auto-git-publisher'
  | 'parshu-stt'
  | 'raspberry-pi-vision'
  | 'ai-robotic-arm'
  | 'spinlaunch-prototype'

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
