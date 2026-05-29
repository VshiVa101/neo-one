'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * useModalHistory — Pushes a browser history entry when `isOpen` becomes true,
 * and calls `onClose` when the user presses the Back button (popstate).
 * 
 * This solves the mobile issue where pressing Back navigates away from the page
 * instead of closing the current modal/overlay.
 * 
 * Standard: matches the behavior of native mobile apps and Google Material Design
 * guidelines where overlays are dismissable via the system back gesture.
 */
export function useModalHistory(isOpen: boolean, onClose: () => void, key: string) {
  const hasPushed = useRef(false)

  const handlePopState = useCallback(
    (e: PopStateEvent) => {
      // Only react if this overlay's state was the one that was just popped
      if (hasPushed.current) {
        hasPushed.current = false
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen && !hasPushed.current) {
      // Push a history entry so "Back" closes this overlay instead of navigating
      window.history.pushState({ modal: key }, '')
      hasPushed.current = true
      window.addEventListener('popstate', handlePopState)
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
      // If the overlay is being closed programmatically (not via back button),
      // clean up the history entry we pushed
      if (hasPushed.current && !isOpen) {
        hasPushed.current = false
        // Go back to remove our pushed state, but only if we're still on it
        if (window.history.state?.modal === key) {
          window.history.back()
        }
      }
    }
  }, [isOpen, key, handlePopState])
}
