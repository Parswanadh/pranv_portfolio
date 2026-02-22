'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA installed')
        }
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
      })
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  if (!showInstallPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-24 right-6 z-[9998] max-w-sm">
      <div className="bg-bg-secondary border border-accent-primary rounded-lg shadow-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-mono text-sm font-bold text-text-primary">Install App</h3>
            <p className="text-xs text-text-tertiary mt-1">
              Install this portfolio as an app for offline access
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-text-tertiary hover:text-text-primary"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent-primary text-bg-primary font-mono text-sm rounded hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 bg-bg-tertiary text-text-primary font-mono text-sm rounded hover:bg-bg-elevated transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
