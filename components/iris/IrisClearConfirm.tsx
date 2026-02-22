'use client'

interface IrisClearConfirmProps {
  isOpen: boolean
  onConfirm: () => void
  onNewSession: () => void
  onDismiss: () => void
}

export function IrisClearConfirm({ isOpen, onConfirm, onNewSession, onDismiss }: IrisClearConfirmProps) {
  if (!isOpen) return null

  return (
    <div className="px-4 py-3 bg-bg-tertiary border-b border-border-default">
      <p className="text-sm text-text-primary mb-3">
        Clear conversation and start fresh?
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onConfirm}
          className="px-3 py-1.5 bg-accent-primary text-bg-primary text-xs rounded hover:opacity-90 transition-opacity"
        >
          Clear conversation
        </button>
        <button
          onClick={onNewSession}
          className="px-3 py-1.5 bg-bg-elevated text-text-primary text-xs rounded hover:bg-bg-primary transition-colors border border-border-default"
        >
          Start new session
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-1.5 text-text-tertiary text-xs rounded hover:text-text-secondary transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
