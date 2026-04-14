'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NeoText } from '@/components/NeoText'

const CHARS = 'ONE'

interface MatrixGatewayProps {
  onClick: (e: React.MouseEvent) => void
  isFading: boolean
}

// Configurazione dei caratteri per NEO-ONE
// Indici: 0:N, 1:E, 2:O, 3:-, 4:O, 5:N, 6:E
const MATRIX_TEXT = [
  { id: 0, target: 'N', initialColor: '#F45390', finalColor: '', type: 'exit', canScramble: true },
  { id: 1, target: 'E', initialColor: '#809829', finalColor: '', type: 'exit', canScramble: true },
  { id: 2, target: 'O', initialColor: '#B3828B', finalColor: '#F45390', type: 'remain', canScramble: true },
  { id: 3, target: '-', initialColor: '#FFFFFF', finalColor: '#FFFFFF', type: 'remain', canScramble: false },
  { id: 4, target: 'O', initialColor: '#B3828B', finalColor: '', type: 'exit', canScramble: true },
  { id: 5, target: 'N', initialColor: '#F45390', finalColor: '#809829', type: 'remain', canScramble: true },
  { id: 6, target: 'E', initialColor: '#809829', finalColor: '', type: 'exit', canScramble: true },
]

// Ordine di sparizione sequenziale (una alla volta, alternata dai lati)
const EXIT_SEQUENCE = [6, 0, 4, 1]

const ScrambleChar = ({ 
  target, 
  isScrambling,
  canScramble,
  color,
  scrambleInterval,
}: { 
  target: string, 
  isScrambling: boolean,
  canScramble: boolean,
  color: string,
  scrambleInterval: number,
}) => {
  const [display, setDisplay] = useState(target)

  useEffect(() => {
    // Se il carattere non può randomizzare (trattino) o se non siamo in fase di scramble, mostra il target.
    if (!canScramble || !isScrambling) {
      setDisplay(target)
      return
    }

    const interval = setInterval(() => {
      setDisplay(CHARS[Math.floor(Math.random() * CHARS.length)])
    }, scrambleInterval)

    return () => clearInterval(interval)
  }, [isScrambling, canScramble, target, scrambleInterval])

  return (
    <motion.span 
      animate={{ 
        color: color,
        textShadow: isScrambling && canScramble ? `0 0 10px ${color}88` : `0 0 15px ${color}44`
      }}
      className="transition-colors duration-500 font-sans"
    >
      {display}
    </motion.span>
  )
}

export function MatrixGateway({ onClick, isFading }: MatrixGatewayProps) {
  const [stage, setStage] = useState<'initial' | 'scrambling' | 'shrinking' | 'final'>('initial')
  const [visibleIndices, setVisibleIndices] = useState(new Set([0, 1, 2, 3, 4, 5, 6]))
  const [scrambleInterval, setScrambleInterval] = useState(100)

  useEffect(() => {
    // 1. Inizio statico (neo-one)
    const startTimer = setTimeout(() => {
      setStage('scrambling')
    }, 1500)

    // 2. Dopo lo svarione, inizia a rimuovere caratteri e rallentare
    const shrinkTimer = setTimeout(() => {
      setStage('shrinking')
      
      let currentExitIndex = 0
      const exitInterval = setInterval(() => {
        if (currentExitIndex >= EXIT_SEQUENCE.length) {
          clearInterval(exitInterval)
          setStage('final') 
          setScrambleInterval(100) // Reset per sicurezza ma stage final lo blocca
          return
        }
        
        // Rallenta lo svarione man mano che spariscono le lettere
        setScrambleInterval(prev => prev + 100)

        const indexToRemove = EXIT_SEQUENCE[currentExitIndex]
        setVisibleIndices(prev => {
          const next = new Set(prev)
          next.delete(indexToRemove)
          return next
        })
        currentExitIndex++
      }, 600) // Ritardo tra le scomparse

      return () => clearInterval(exitInterval)
    }, 3500)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(shrinkTimer)
    }
  }, [])

  return (
    <div 
      className={`fixed inset-0 z-[1000] bg-black flex items-start justify-center pt-[20vh] cursor-pointer pointer-events-auto transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      onClick={onClick}
    >
      <div className="flex gap-[0.05em] scale-100 md:scale-110">
        <AnimatePresence mode="popLayout">
          {MATRIX_TEXT.map((char) => {
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
                  transition: { duration: 0.4 }
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="text-[16vw] sm:text-[14vw] font-bold leading-none select-none"
              >
                <ScrambleChar 
                  target={char.target} 
                  canScramble={char.canScramble}
                  isScrambling={stage === 'scrambling' || stage === 'shrinking'}
                  scrambleInterval={scrambleInterval}
                  color={(visibleIndices.size === 3) ? char.finalColor : char.initialColor}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {stage === 'final' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-[25%] text-[10px] sm:text-[12px] tracking-[1.5em] text-white/50 uppercase font-sans pointer-events-none select-none"
        >
          <NeoText>TOCCAMI</NeoText>
        </motion.div>
      )}
    </div>
  )
}
