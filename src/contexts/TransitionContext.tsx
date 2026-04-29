'use client'

import React, { createContext, useContext, useState, useRef } from 'react'

interface TransitionContextType {
  isTransitioning: boolean
  triggerTransition: () => void
  onTransitionComplete: () => void
}

const TransitionContext = createContext<TransitionContextType | null>(null)

export const useTransition = () => {
    const context = useContext(TransitionContext)
    if (!context) throw new Error('useTransition must be used within a TransitionProvider')
    return context
}

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
    const [isTransitioning, setIsTransitioning] = useState(false)

    const triggerTransition = () => {
        setIsTransitioning(true)
    }

    const onTransitionComplete = () => {
        setIsTransitioning(false)
    }

    return (
        <TransitionContext.Provider value={{ isTransitioning, triggerTransition, onTransitionComplete }}>
            {children}
        </TransitionContext.Provider>
    )
}
