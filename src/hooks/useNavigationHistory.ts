'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useCallback } from 'react'

interface NavigationHistory {
  stack: string[]
  canGoBack: boolean
}

export const useNavigationHistory = () => {
  const router = useRouter()
  const pathname = usePathname()
  const historyRef = useRef<NavigationHistory>({ stack: [], canGoBack: false })

  // Initialize history from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('neo-nav-history')
      if (stored) {
        historyRef.current = JSON.parse(stored)
      }
    } catch {
      // Silent fail for SSR or private mode
    }
  }, [])

  // Track path changes
  useEffect(() => {
    if (!pathname) return

    const currentStack = historyRef.current.stack
    const lastPath = currentStack[currentStack.length - 1]

    // Don't add duplicate consecutive entries
    if (lastPath !== pathname) {
      currentStack.push(pathname)
      // Keep only last 20 entries to avoid memory issues
      if (currentStack.length > 20) {
        currentStack.shift()
      }
      historyRef.current.canGoBack = currentStack.length > 1

      try {
        sessionStorage.setItem('neo-nav-history', JSON.stringify(historyRef.current))
      } catch {
        // Silent fail
      }
    }
  }, [pathname])

  // Navigate back function
  const goBack = useCallback((fallbackPath: string = '/home') => {
    const currentStack = historyRef.current.stack

    // Remove current path
    currentStack.pop()

    const previousPath = currentStack[currentStack.length - 1]

    if (previousPath && previousPath !== pathname) {
      // Try router.back() first
      try {
        router.back()
      } catch {
        // If back fails, push to previous
        router.push(previousPath)
      }
    } else {
      // No history, go to fallback
      router.push(fallbackPath)
    }

    // Update state
    historyRef.current.canGoBack = currentStack.length > 1

    try {
      sessionStorage.setItem('neo-nav-history', JSON.stringify(historyRef.current))
    } catch {
      // Silent fail
    }
  }, [router, pathname])

  // Check if we can go back
  const canGoBack = historyRef.current.canGoBack

  return {
    goBack,
    canGoBack,
    history: historyRef.current.stack
  }
}
