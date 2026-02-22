import { useEffect, useRef } from 'react'

interface UseFocusTrapOptions {
  restoreFocus?: boolean
  escapeToClose?: () => void
}

export function useFocusTrap(
  isActive: boolean,
  containerRef: React.RefObject<HTMLElement>,
  options: UseFocusTrapOptions = {}
) {
  const { restoreFocus = true, escapeToClose } = options
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    previousActiveElement.current = document.activeElement as HTMLElement

    const container = containerRef.current
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    const focusableElements = container.querySelectorAll(focusableSelectors)
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus()
            e.preventDefault()
          }
        }
      } else if (e.key === 'Escape' && escapeToClose) {
        escapeToClose()
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      if (restoreFocus) {
        previousActiveElement.current?.focus()
      }
    }
  }, [isActive, containerRef, restoreFocus, escapeToClose])
}
