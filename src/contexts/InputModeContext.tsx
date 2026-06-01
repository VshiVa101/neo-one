'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface InputModeContextType {
  isTouchMode: boolean
}

const InputModeContext = createContext<InputModeContextType>({
  isTouchMode: false,
})

export function InputModeProvider({ children }: { children: ReactNode }) {
  const [isTouchMode, setIsTouchMode] = useState(false)

  useEffect(() => {
    // Controllo iniziale basato sulle capabilities del device
    const checkTouchCapabilities = () => {
      const isTouch = 
        typeof window !== 'undefined' &&
        ('ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia('(pointer: coarse)').matches)
      
      setIsTouchMode(Boolean(isTouch))
    }

    checkTouchCapabilities()

    // Listener attivi per l'uso effettivo
    const handleTouchStart = () => {
      setIsTouchMode(true)
    }

    const handleMouseMove = () => {
      // Se c'è un movimento del mouse vero e proprio, disabilita il touch mode
      // (ignora i finti mousemove generati dai touch events, che solitamente sono seguiti subito da click/touchstart)
      setIsTouchMode(false)
    }

    // Aggiungiamo i listener
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    // Opzionale: decommentare la linea sotto se si vuole che il sistema switchi a "mouse" al primo movimento del mouse.
    // Usiamo principalmente touchstart perché è il modo più affidabile per sapere se stanno usando il dito.
    // window.addEventListener('mousemove', handleMouseMove, { passive: true, once: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      // window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <InputModeContext.Provider value={{ isTouchMode }}>
      {children}
    </InputModeContext.Provider>
  )
}

export function useInputMode() {
  const context = useContext(InputModeContext)
  if (!context) {
    throw new Error('useInputMode must be used within an InputModeProvider')
  }
  return context
}
