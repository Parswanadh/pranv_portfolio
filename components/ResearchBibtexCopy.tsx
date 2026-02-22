'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ResearchBibtexCopyProps {
  bibtex: string
}

export default function ResearchBibtexCopy({ bibtex }: ResearchBibtexCopyProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyBib = () => {
    navigator.clipboard.writeText(bibtex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopyBib}
      className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
