'use client'

import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

const TRAIL_COUNT = 6

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  
  // Posizioni per i diversi layer della scia
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Configurazione spring per fluidità e ritardo differenziato
  const springConfig = { damping: 20, stiffness: 250, restDelta: 0.001 }
  
  // Creiamo una serie di spring con delay diversi per l'effetto trial
  // In Framer Motion, creiamo spring che seguono i motion values
  const trails = Array.from({ length: TRAIL_COUNT }).map((_, i) => ({
    x: useSpring(mouseX, { ...springConfig, damping: 20 + i * 2 }),
    y: useSpring(mouseY, { ...springConfig, damping: 20 + i * 2 }),
  }))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible, mouseX, mouseY])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {trails.map((pos, i) => (
        <motion.div
          key={i}
          style={{
            x: pos.x,
            y: pos.y,
            translateX: '-15%', // Centra rispetto alla punta del dito (punta in alto a sinistra)
            translateY: '-5%',
            opacity: (TRAIL_COUNT - i) / TRAIL_COUNT * 0.5,
            scale: 1 - (i * 0.05),
            filter: `blur(${i * 1.5}px)`,
          }}
          className="absolute"
        >
          {/* SVG Dito Puntato Outline */}
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#809829" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M15 14v5a3 3 0 0 1-3 3 3 3 0 0 1-3-3V5a2 2 0 0 1 2-2 2 2 0 0 1 2 2v6" />
            <path d="M12 11h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2" />
            <path d="M12 8h5a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2" />
            <path d="M12 5h7a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
