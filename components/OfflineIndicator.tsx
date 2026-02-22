'use client'

import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-20 left-4 z-[9999] flex items-center gap-2 px-3 py-2 bg-bg-secondary/90 backdrop-blur-sm border border-red-500 rounded-lg text-xs font-mono">
      <WifiOff className="w-3 h-3 text-red-400" />
      <span className="text-red-400">Offline</span>
    </div>
  )
}
