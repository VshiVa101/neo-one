'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BrandedTitle } from '@/components/BrandedTitle'
import SpaceInvadersGame, { LocalScrambleChar, COOMING_SOON_CONFIG, playSynthSound } from '@/components/game/SpaceInvadersGame'

export default function MatrixBioComingSoonPage() {
  const router = useRouter()
  const [stage, setStage] = useState<'initial' | 'slow' | 'fast' | 'resolving' | 'final'>('initial')
  const [scramblingIndices, setScramblingIndices] = useState(new Set<number>())
  const [scrambleInterval, setScrambleInterval] = useState(600)
  
  // Matrix transition active state
  const [matrixMode, setMatrixMode] = useState(false)
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
          setScramblingIndices(new Set())
          return
        }

        const indexToLock = allIndices[currentLockIndex]
        setScramblingIndices((prev) => {
          const next = new Set(prev)
          next.delete(indexToLock)
          return next
        })
        currentLockIndex++
      }, 180)
    }, 3800)

    return () => {
      clearTimeout(slowTimer)
      clearTimeout(mediumTimer)
      clearTimeout(fastTimer)
      clearTimeout(resolveTimer)
    }
  }, [])

  // Functional go back event transition
  const handleBackClick = () => {
    setIsFading(true)
    setTimeout(() => {
      router.back()
    }, 1000)
  }

  // Triggered when Alien Eye touches the ground inside canvas
  const handleTransitionTriggered = () => {
    setMatrixMode(true)
    playSynthSound('matrix')

    // Scramble / hacker redirect fade to black after matrix rain sequence
    setTimeout(() => {
      setIsFading(true)
      setTimeout(() => {
        router.push('/calendar')
      }, 1000)
    }, 2500)
  }

  return (
    <div
      className={`fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-start p-2 sm:p-6 overflow-x-hidden overflow-y-auto pointer-events-auto transition-opacity duration-1000 w-screen max-w-[100vw] box-border ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background scrolling space animation gif */}
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
          opacity: 0.08,
        }}
      />

      <div className="flex flex-col items-center gap-3 sm:gap-6 relative z-10 w-full max-w-[800px] flex-1 min-h-0 min-w-0 overflow-hidden mt-2 sm:mt-4 mb-2 sm:mb-4">
        
        {/* Scramble Header Configured for COOMING-SOON */}
        <div className="flex gap-[0.05em] sm:scale-100 md:scale-110 shrink-0 w-full max-w-full justify-center overflow-hidden flex-wrap px-2">
          {COOMING_SOON_CONFIG.map((char) => {
            return (
              <div
                key={char.id}
                className="text-[6.5vw] sm:text-[5vw] font-bold leading-none select-none font-neo"
              >
                <LocalScrambleChar
                  target={char.target}
                  canScramble={char.canScramble}
                  isScrambling={scramblingIndices.has(char.id)}
                  scrambleInterval={scrambleInterval}
                  matrixMode={matrixMode}
                />
              </div>
            )
          })}
        </div>

        {/* CLICKABLE BACK BUTTON/SUBTITLE (FULLY FUNCTIONAL!) */}
        <div 
          onClick={handleBackClick}
          className="h-10 flex items-center justify-center cursor-pointer pointer-events-auto border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/50 hover:border-white/20 px-6 py-2 rounded-full transition-all duration-300 select-none shadow-sm shrink-0 max-w-full overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 1.2 }}
            className="text-[8px] sm:text-[11px] tracking-[0.5em] sm:tracking-[1em] ml-[0.5em] sm:ml-[1em] text-white/50 group-hover:text-white transition-colors duration-300 font-neo uppercase text-center truncate"
          >
            <BrandedTitle text="toccami per tornare indietro" />
          </motion.div>
        </div>

        {/* Dynamic description marquee subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 1.3 }}
          className="text-[9px] sm:text-[11px] text-zinc-400 font-mono tracking-wide text-center mt-1 px-2 sm:px-4 uppercase max-w-[650px] w-full leading-relaxed select-none shrink-0 break-words whitespace-normal"
        >
          <span className="text-[#FF82B2] font-semibold">un nuovo</span> - pazzesco cabinato è in arrivo ! mentre aspetti... prova a fare un po di <span className="text-[#809829] font-semibold">strage</span>
        </motion.div>

        {/* Pixel Space Invaders Video Game Scripted Below */}
        <div className="w-full flex-1 min-h-0 min-w-0 mt-2 flex flex-col">
          <SpaceInvadersGame 
            onTransitionTriggered={handleTransitionTriggered}
          />
        </div>

      </div>

      {/* Retro overlays style injection */}
      <style jsx global>{`
        .bg-scanlines {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.25) 50%
          ), 
          linear-gradient(
            90deg, 
            rgba(255, 0, 0, 0.06), 
            rgba(0, 255, 0, 0.02), 
            rgba(0, 0, 255, 0.06)
          );
          background-size: 100% 4px, 3px 100%;
        }

        .bg-crt-glare {
          background: radial-gradient(
            circle at 50% 15%, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0) 70%
          );
        }
      `}</style>
    </div>
  )
}
