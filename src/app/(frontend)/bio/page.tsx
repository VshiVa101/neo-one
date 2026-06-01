'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BrandedTitle } from '@/components/BrandedTitle'

interface CharConfig {
  id: number
  target: string
  initialColor: string
  canScramble: boolean
}

// Regole del Brand Neo-ONE: SOLAMENTE le lettere O, N, E sono brandizzate e colorate.
// C, M, I, G, -, S rimangono rigorosamente bianche (#FFFFFF) senza stili custom.
const COOMING_SOON_CONFIG: CharConfig[] = [
  { id: 0, target: 'C', initialColor: '#FFFFFF', canScramble: true },
  { id: 1, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 2, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 3, target: 'M', initialColor: '#FFFFFF', canScramble: true },
  { id: 4, target: 'I', initialColor: '#FFFFFF', canScramble: true },
  { id: 5, target: 'N', initialColor: '#809829', canScramble: true },
  { id: 6, target: 'G', initialColor: '#FFFFFF', canScramble: true },
  { id: 7, target: '-', initialColor: '#FFFFFF', canScramble: false },
  { id: 8, target: 'S', initialColor: '#FFFFFF', canScramble: true },
  { id: 9, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 10, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 11, target: 'N', initialColor: '#809829', canScramble: true },
]

const SCRAMBLE_ALPHABET = 'COOMINGSOONONE'

// Specifica dei colori e classi del brand Neo-ONE:
const CHAR_COLORS: Record<string, string> = {
  O: '#F45390', // neo-O rosa vibrante
  N: '#809829', // neo-N verde acido
  E: '#FF82B2', // neo-E rosa soft
}

let globalAudioCtx: AudioContext | null = null

function LocalScrambleChar({
  target,
  isScrambling,
  canScramble,
  scrambleInterval = 100,
}: {
  target: string
  isScrambling: boolean
  canScramble: boolean
  scrambleInterval?: number
}) {
  const [display, setDisplay] = useState(target)

  const playTick = () => {
    try {
      if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = globalAudioCtx
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(120, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.04)

      gainNode.gain.setValueAtTime(0.015, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.04)
    } catch (e) {
      // Ignora errori di audio policy del browser
    }
  }

  useEffect(() => {
    if (!canScramble || !isScrambling) {
      if (display !== target) {
        setDisplay(target)
        playTick()
      }
      return
    }

    const interval = setInterval(() => {
      setDisplay(SCRAMBLE_ALPHABET[Math.floor(Math.random() * SCRAMBLE_ALPHABET.length)])
      playTick()
    }, scrambleInterval)

    return () => clearInterval(interval)
  }, [isScrambling, canScramble, target, scrambleInterval])

  const currentCharColor = CHAR_COLORS[display] || '#FFFFFF'
  
  // Applica le regole del Brand Neo-ONE: solo O, N, E ricevono le rispettive classi di stile ed effetto
  const isBrandChar = display === 'O' || display === 'N' || display === 'E'
  const brandClass = isBrandChar ? `neo-${display}` : ''

  return (
    <motion.span
      animate={{
        textShadow: isScrambling && canScramble
          ? `0 0 15px ${currentCharColor}88`
          : `0 0 25px ${currentCharColor}44`,
      }}
      transition={{ 
        textShadow: { duration: 0.2 }
      }}
      className={`font-neo font-bold uppercase select-none ${brandClass}`}
      style={{ color: currentCharColor }}
    >
      {display}
    </motion.span>
  )
}

export default function MatrixBioComingSoonPage() {
  const router = useRouter()
  const [stage, setStage] = useState<'initial' | 'slow' | 'fast' | 'resolving' | 'final'>('initial')
  const [scramblingIndices, setScramblingIndices] = useState(new Set<number>())
  const [scrambleInterval, setScrambleInterval] = useState(600)
  const [showTouch, setShowTouch] = useState(false)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // Stage 1: Inizio lento scramble lettere esterne
    const slowTimer = setTimeout(() => {
      setStage('slow')
      setScramblingIndices(new Set([0, 1, 10, 11])) 
    }, 400)

    // Stage 2: Velocizza ed estende lo scramble ad altre lettere
    const mediumTimer = setTimeout(() => {
      setScrambleInterval(250)
      setScramblingIndices(new Set([0, 1, 2, 3, 8, 9, 10, 11]))
    }, 1200)

    // Stage 3: Scramble veloce su tutte le lettere abilitate
    const fastTimer = setTimeout(() => {
      setStage('fast')
      setScrambleInterval(80)
      setScramblingIndices(new Set([0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11]))
    }, 2200)

    // Stage 4: Locking sequenziale e risoluzione della parola
    const resolveTimer = setTimeout(() => {
      setStage('resolving')
      const allIndices = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11]
      let currentLockIndex = 0

      const lockInterval = setInterval(() => {
        if (currentLockIndex >= allIndices.length) {
          clearInterval(lockInterval)
          setStage('final')
          setScramblingIndices(new Set()) // Ferma tutto lo scramble
          setTimeout(() => setShowTouch(true), 500)
          return
        }

        const indexToLock = allIndices[currentLockIndex]
        setScramblingIndices((prev) => {
          const next = new Set(prev)
          next.delete(indexToLock)
          return next
        })
        currentLockIndex++
      }, 200)
    }, 4000)

    return () => {
      clearTimeout(slowTimer)
      clearTimeout(mediumTimer)
      clearTimeout(fastTimer)
      clearTimeout(resolveTimer)
    }
  }, [])

  const handleBackClick = () => {
    setIsFading(true)
    setTimeout(() => {
      router.back()
    }, 1000)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleBackClick()
      }}
      className={`fixed inset-0 z-[1000] bg-black flex items-center justify-center cursor-pointer pointer-events-auto transition-opacity duration-1000 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackClick}
    >
      {/* Background GIF a scorrimento in trasparenza */}
      <div 
        className="fixed z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/images/bg/bg-scroll.gif')",
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          width: '100vh',
          height: '100vw',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(90deg)',
          opacity: 0.1,
        }}
      />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Container Scramble Text con scala responsive */}
        <div className="flex gap-[0.05em] scale-90 sm:scale-100 md:scale-110">
          {COOMING_SOON_CONFIG.map((char) => {
            return (
              <div
                key={char.id}
                className="text-[12vw] sm:text-[10vw] font-bold leading-none select-none font-neo"
              >
                <LocalScrambleChar
                  target={char.target}
                  canScramble={char.canScramble}
                  isScrambling={scramblingIndices.has(char.id)}
                  scrambleInterval={scrambleInterval}
                />
              </div>
            )
          })}
        </div>

        {/* Messaggio di sblocco/ritorno */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence>
            {showTouch && (
              <motion.div
                key="tocami-indietro"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="text-[10px] sm:text-[12px] tracking-[1.5em] ml-[1.5em] text-white/50 font-neo pointer-events-none select-none uppercase text-center"
              >
                <BrandedTitle text="toccami per tornare indietro" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
