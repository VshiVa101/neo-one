'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CHARS = 'ABCDEFGHIKLMNOPQRSTUVWXYZ0123456789$#@%&*'

interface MatrixGatewayProps {
  onClick: (e: React.MouseEvent) => void
  isFading: boolean
}

// Configurazione dei caratteri per NEO-ONE
// Indici: 0:N, 1:E, 2:O, 3:-, 4:O, 5:N, 6:E
const MATRIX_TEXT = [
  { id: 0, target: 'N', initialColor: '#FF2D55', finalColor: '', type: 'exit' },
  { id: 1, target: 'E', initialColor: '#A3FF12', finalColor: '', type: 'exit' },
  { id: 2, target: 'O', initialColor: '#F45390', finalColor: '#FF2D55', type: 'remain' },
  { id: 3, target: '-', initialColor: '#FFFFFF', finalColor: '#FFFFFF', type: 'remain' },
  { id: 4, target: 'O', initialColor: '#F45390', finalColor: '', type: 'exit' },
  { id: 5, target: 'N', initialColor: '#FF2D55', finalColor: '#A3FF12', type: 'remain' },
  { id: 6, target: 'E', initialColor: '#A3FF12', finalColor: '', type: 'exit' },
]

const ScrambleChar = ({ 
  target, 
  duration = 1.0,
  color,
  onComplete 
}: { 
  target: string, 
  duration?: number,
  color: string,
  onComplete?: () => void 
}) => {
  const [display, setDisplay] = useState('')
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    let frame = 0
    const totalFrames = duration * 60
    
    // Iniziamo con un delay casuale per dare l'effetto pioggia/casuale
    const startDelay = Math.random() * 500
    
    const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          if (frame >= totalFrames) {
            setDisplay(target)
            setComplete(true)
            clearInterval(interval)
            onComplete?.()
            return
          }
    
          const progress = frame / totalFrames
          if (Math.random() > progress) {
            setDisplay(CHARS[Math.floor(Math.random() * CHARS.length)])
          } else {
            setDisplay(target)
          }
    
          frame++
        }, 1000 / 60)
        return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [target, duration, onComplete])

  return (
    <motion.span 
      animate={{ 
        color: color,
        textShadow: complete ? `0 0 15px ${color}88` : `0 0 5px ${color}44`
      }}
      className="transition-colors duration-500 font-sans"
    >
      {display || ' '}
    </motion.span>
  )
}

export function MatrixGateway({ onClick, isFading }: MatrixGatewayProps) {
  const [stage, setStage] = useState<'formulating' | 'shrinking'>('formulating')
  const [charsComplete, setCharsComplete] = useState(0)

  useEffect(() => {
    if (charsComplete === MATRIX_TEXT.length) {
      const timer = setTimeout(() => {
        setStage('shrinking')
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [charsComplete])

  const handleCharComplete = () => {
    setCharsComplete(prev => prev + 1)
  }

  return (
    <div 
      className={`fixed inset-0 z-[1000] bg-black flex items-center justify-center cursor-pointer pointer-events-auto transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      onClick={onClick}
    >
      <div className="flex gap-[0.05em] scale-100 md:scale-110">
        <AnimatePresence mode="popLayout">
          {MATRIX_TEXT.map((char) => {
            const isVisible = stage !== 'shrinking' || char.type === 'remain'
            
            if (!isVisible) return null

            return (
              <motion.div
                key={char.id}
                layoutId={`char-${char.id}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.5,
                  filter: 'blur(10px)',
                  transition: { duration: 0.4 }
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="text-[16vw] sm:text-[14vw] font-bold leading-none select-none"
              >
                <ScrambleChar 
                  target={char.target} 
                  color={stage === 'shrinking' && char.finalColor ? char.finalColor : char.initialColor}
                  onComplete={handleCharComplete}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {stage === 'shrinking' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-[25%] text-[8px] sm:text-[10px] tracking-[1.5em] text-white/40 uppercase font-sans pointer-events-none select-none"
        >
          TOUCH TO UNLOCK
        </motion.div>
      )}
    </div>
  )
}
