'use client'

import { Cpu } from 'lucide-react'
import { MagneticWrapper } from '@/components/MagneticWrapper'

export function IrisCtaButton() {
  const handleOpenIris = () => {
    window.dispatchEvent(new CustomEvent('open-iris'))
  }

  return (
    <div className="h-full w-full">
      <MagneticWrapper strength={0.06} className="h-full w-full block">
        <button
          onClick={handleOpenIris}
          className="h-full w-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-2 border-accent-primary/30 hover:border-accent-primary rounded-xl p-5 transition-all duration-300 flex flex-col justify-center items-center text-center group active:scale-[0.98]"
          aria-label="Chat with Iris AI Assistant"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-accent-primary/20 flex items-center justify-center group-hover:bg-accent-primary/30 transition-colors">
              <Cpu className="w-6 h-6 text-accent-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors font-mono">
              Chat with Iris
            </h3>
            <p className="text-xs text-text-secondary">AI Assistant</p>
          </div>
        </button>
      </MagneticWrapper>
    </div>
  )
}
