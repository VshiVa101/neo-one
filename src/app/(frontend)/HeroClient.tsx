'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MatrixGateway } from '@/components/MatrixGateway'
import { EyeScene } from '@/components/EyeScene'
import { useTransition } from '@/context/TransitionContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeroClient() {
  const router = useRouter()
  const pathname = usePathname()
  const { isTransitioning } = useTransition()
  const [shouldRender, setShouldRender] = useState(false)
  const [isEyeReady, setIsEyeReady] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const handleUnlock = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    // Sblocco audio totalmente silenzioso (buffer vuoto base64)
    // Questo attiva il contesto audio del browser senza emettere alcun suono udibile.
    const silentAudio = new Audio(
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
    )
    silentAudio
      .play()
      .then(() => silentAudio.pause())
      .catch(() => {})

    setIsFading(true)
    setTimeout(() => {
      setIsUnlocked(true)
    }, 1000)
  }

  useEffect(() => {
    setShouldRender(true)
  }, [])

  useEffect(() => {
    try {
      const touch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer:coarse)').matches)
      setIsTouchDevice(Boolean(touch))
    } catch (e) {
      setIsTouchDevice(false)
    }
  }, [])

  // Se siamo già in /home o altre rotte, non renderizzare l'overlay Hero
  // Se però stiamo transizionando, rimaniamo montati per completare il fade-out
  if (!shouldRender || (pathname !== '/' && !isTransitioning)) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {!isUnlocked && (
          <MatrixGateway onClick={handleUnlock} isFading={isFading} />
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 1 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="fixed inset-0 w-full h-screen relative bg-black overflow-hidden flex flex-col items-center justify-center m-0 p-0 text-white z-50 transition-opacity"
      >
      {/* Background GIF - Appare solo quando l'occhio è pronto */}
      <AnimatePresence>
        {isEyeReady && (
          <motion.img
            key="hero-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1 }}
            src="/images/drops/bg-herosection.gif"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* The 3D Scene - con interattività abilitata e segnalazione Ready */}
      <div className={`fixed inset-0 z-10 w-full h-screen pointer-events-auto transition-opacity duration-1000 ${isEyeReady ? 'opacity-100' : 'opacity-0'}`}>
        <EyeScene
          targetRoute="/home"
          showCircularText={isEyeReady}
          onReady={() => setIsEyeReady(true)}
          isUnlocked={isUnlocked}
          globalTracking={true}
          scaleMultiplier={isTouchDevice ? 1.6 : 1}
        />
      </div>

      {/* Loading micro-state se l'occhio ci mette troppo */}
      {!isEyeReady && (
        <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
            <p className="font-neo text-gray-800 text-[10px] tracking-[1em] uppercase animate-pulse">Inizializzazione Sguardo...</p>
        </div>
      )}
    </motion.main>
    </>
  )
}
