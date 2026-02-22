'use client'

import { Send } from 'lucide-react'

interface IrisInputProps {
  input: string
  setInput: (input: string) => void
  onSend: () => void
  isLoading: boolean
}

export function IrisInput({ input, setInput, onSend, isLoading }: IrisInputProps) {
  return (
    <div className="p-4 border-t border-border-default">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
          placeholder="Ask Iris anything..."
          className="flex-1 px-4 py-2 bg-bg-tertiary border border-border-default rounded-lg focus:outline-none focus:border-accent-primary text-sm text-primary placeholder:text-secondary"
          disabled={isLoading}
        />
        <button
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-accent-primary text-bg-primary rounded-lg hover:opacity-90 disabled:opacity-50 focus:ring-2 focus:ring-accent-primary focus:outline-none transition-opacity"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
