'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrambleChar, MATRIX_GATEWAY_CONFIG } from './home/ScrambleChar'
import { BrandedTitle } from '@/components/BrandedTitle'

interface MatrixGatewayProps {
  onClick: (e: React.MouseEvent) => void
  isFading: boolean
}

const FINAL_INDICES = [2, 3, 5] // O - N
const EXIT_SEQUENCE = [6, 0, 4, 1] // E, N, O, E

export function MatrixGateway({ onClick, isFading }: MatrixGatewayProps) {
  const [stage, setStage] = useState<'initial' | 'slow' | 'fast' | 'shrinking' | 'final'>('initial')
  const [visibleIndices, setVisibleIndices] = useState(new Set([0, 1, 2, 3, 4, 5, 6]))
  const [scramblingIndices, setScramblingIndices] = useState(new Set<number>())
  const [scrambleInterval, setScrambleInterval] = useState(600)
  const [showTouch, setShowTouch] = useState(false)
  const lettersRef = useRef<HTMLDivElement | null>(null)
  const exitIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    // Stage 1: Start slowly with just 2 random letters scrambling
    const slowTimer = setTimeout(() => {
      setStage('slow')
      setScramblingIndices(new Set([0, 5])) // Start with just Ns
    }, 400)

    // Stage 2: Add more letters and speed up
    const mediumTimer = setTimeout(() => {
      setScrambleInterval(300)
      setScramblingIndices(new Set([0, 1, 5, 6]))
    }, 1200)

    // Stage 3: Full speed all letters
    const fastTimer = setTimeout(() => {
      setStage('fast')
      setScrambleInterval(100)
      setScramblingIndices(new Set([0, 1, 2, 4, 5, 6]))
    }, 2200)

    // Stage 4: Shrink and disappear
    const shrinkTimer = setTimeout(() => {
      setStage('shrinking')
      let currentExitIndex = 0
      
      exitIntervalRef.current = setInterval(() => {
        if (currentExitIndex >= EXIT_SEQUENCE.length) {
          if (exitIntervalRef.current) clearInterval(exitIntervalRef.current)
          setStage('final')
          setScramblingIndices(new Set()) // Stop all scrambling
          setVisibleIndices(new Set(FINAL_INDICES)) // Force only O-N to be visible
          setScrambleInterval(100)
          setTimeout(() => setShowTouch(true), 600)
          return
        }

        setScrambleInterval((prev) => prev + 150)
        const indexToRemove = EXIT_SEQUENCE[currentExitIndex]
        setVisibleIndices((prev) => {
          const next = new Set(prev)
          next.delete(indexToRemove)
          return next
        })
        currentExitIndex++
      }, 600)
    }, 4500)

    return () => {
      clearTimeout(slowTimer)
      clearTimeout(mediumTimer)
      clearTimeout(fastTimer)
      clearTimeout(shrinkTimer)
      if (exitIntervalRef.current) clearInterval(exitIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    return () => setShowTouch(false)
  }, [])

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick(e as unknown as React.MouseEvent)
      }}
      className={`fixed inset-0 z-[1000] bg-black flex items-start justify-center pt-[10vh] cursor-pointer pointer-events-auto transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      onClick={onClick}
    >
      <div ref={lettersRef} className="flex flex-col items-center gap-2">
        <div className="flex gap-[0.05em] scale-100 md:scale-110">
          <AnimatePresence mode="popLayout">
            {MATRIX_GATEWAY_CONFIG.map((char) => {
              if (!visibleIndices.has(char.id)) return null

              return (
                <motion.div
                  key={char.id}
                  layoutId={`char-${char.id}`}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    y: char.id % 2 === 0 ? -30 : 30,
                    filter: 'blur(20px)',
                    transition: { duration: 0.4 },
                  }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="text-[16vw] sm:text-[14vw] font-bold leading-none select-none"
                >
                  <ScrambleChar
                    target={char.target}
                    canScramble={char.canScramble}
                    isScrambling={scramblingIndices.has(char.id)}
                    scrambleInterval={scrambleInterval}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showTouch && (
            <motion.div
              key="tocami"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="text-[10px] sm:text-[12px] tracking-[1.5em] ml-[1.5em] text-white/50 font-sans pointer-events-none select-none lowercase"
            >
              <BrandedTitle text="toccami" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
