'use client'

import React, { useEffect, useState } from 'react'
import { useTransition } from '@/context/TransitionContext'
import Image from 'next/image'

export const TransitionOverlay = () => {
    const { isTransitioning, onTransitionComplete } = useTransition()
    const [isVisible, setIsVisible] = useState(false)
    const [renderGifs, setRenderGifs] = useState(false)

    useEffect(() => {
        if (isTransitioning) {
            // Avvio transizione
            setRenderGifs(true)
            setIsVisible(true)

            // Dopo 2 secondi (tempo dell'esplosione), dissolvi l'overlay
            const fadeTimer = setTimeout(() => {
                setIsVisible(false)
            }, 2000)

            // Dopo la dissolvenza (es. 1s), rimuovi le gif dal DOM e segnala completamento
            const endTimer = setTimeout(() => {
                setRenderGifs(false)
                onTransitionComplete()
            }, 3000)

            return () => {
                clearTimeout(fadeTimer)
                clearTimeout(endTimer)
            }
        }
    }, [isTransitioning, onTransitionComplete])

    if (!renderGifs) return null

    return (
        <div 
            className={`fixed inset-0 z-[100] pointer-events-none flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Sfondo extra scuro se vuoi nascondere lo stacco brutale, opzionale */}
            <div className="absolute inset-0 bg-black opacity-80" />

            {/* Explosion 1: Eyes al centro */}
            <div className="absolute inset-0 flex items-center justify-center z-10 w-full h-full">
                <img 
                    src="/images/drops/eye-explosion.gif" 
                    alt="Eye Explosion" 
                    className="w-[80vw] h-auto max-w-[800px] object-contain mix-blend-screen"
                />
            </div>

            {/* Explosion 2: Borders ai lati */}
            <div className="absolute inset-0 z-20 pointer-events-none w-full h-full">
                <img 
                    src="/images/drops/border-flames.gif" 
                    alt="Border Flames" 
                    className="w-full h-full object-cover mix-blend-screen opacity-90"
                />
            </div>
        </div>
    )
}
