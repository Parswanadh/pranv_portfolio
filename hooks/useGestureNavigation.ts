'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function useGestureNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  // Define all pages in navigation order
  const pages = [
    '/',
    '/projects',
    '/agents',
    '/about',
    '/contact',
    '/leadership',
    '/research',
    '/tools',
    '/resume'
  ]

  useEffect(() => {
    // Find current page index
    const currentIndex = pages.indexOf(pathname || '/')
    setCanGoBack(currentIndex > 0)
    setCanGoForward(currentIndex < pages.length - 1)
  }, [pathname])

  const goBack = () => {
    if (canGoBack) {
      const currentIndex = pages.indexOf(pathname || '/')
      if (currentIndex > 0) {
        router.push(pages[currentIndex - 1])
      }
    }
  }

  const goForward = () => {
    if (canGoForward) {
      const currentIndex = pages.indexOf(pathname || "/")
      if (currentIndex < pages.length - 1) {
        router.push(pages[currentIndex + 1])
      }
    }
  }

  return {
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    currentPage: pathname,
    pages
  }
}
