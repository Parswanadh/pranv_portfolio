'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

export function MultimodalDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const analyze = () => {
    setIsAnalyzing(true)
    setResults([])

    setTimeout(() => {
      setResults([
        'Detected: Golden Retriever dog',
        'Confidence: 96.2%',
        'Scene: Outdoor park setting',
        'Additional: Tennis ball in frame'
      ])
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video rounded-lg border-2 border-dashed border-border-default flex items-center justify-center bg-bg-secondary relative overflow-hidden group">
        <ImageIcon className="w-16 h-16 text-text-tertiary" />
        <div className="absolute inset-0 bg-accent-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <button
        onClick={analyze}
        disabled={isAnalyzing}
        className="min-h-[44px] w-full py-3 bg-bg-elevated hover:bg-bg-tertiary border border-border-default rounded transition-colors disabled:opacity-50 active:scale-95 touch-manipulation"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {results.length > 0 && (
        <div className="space-y-2 p-4 bg-bg-secondary rounded border border-border-default">
          <div className="text-xs text-text-tertiary uppercase tracking-wider mb-3">Analysis Results</div>
          {results.map((result, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-primary mt-1.5" />
              <p className="text-sm text-text-primary">{result}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
