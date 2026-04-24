'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CHARS = 'ONE'

// Indici: 0:N, 1:E, 2:O, 3:-, 4:O, 5:N, 6:E
const MATRIX_TEXT = [
  { id: 0, target: 'N', initialColor: '#809829', canScramble: true },
  { id: 1, target: 'E', initialColor: '#B3828B', canScramble: true },
  { id: 2, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 3, target: '-', initialColor: '#FFFFFF', canScramble: false },
  { id: 4, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 5, target: 'N', initialColor: '#809829', canScramble: true },
  { id: 6, target: 'E', initialColor: '#B3828B', canScramble: true },
]

const ScrambleChar = ({
  target,
  isScrambling,
  canScramble,
  color,
}: {
  target: string,
  isScrambling: boolean,
  canScramble: boolean,
  color: string,
}) => {
  const [display, setDisplay] = useState(target)

  useEffect(() => {
    if (!canScramble || !isScrambling) {
      setDisplay(target)
      return
    }

    // Molto rapida
    const interval = setInterval(() => {
      setDisplay(CHARS[Math.floor(Math.random() * CHARS.length)])
    }, 60)

    return () => clearInterval(interval)
  }, [isScrambling, canScramble, target])

  return (
    <motion.span
      animate={{
        color: color,
        textShadow: isScrambling && canScramble ? `0 0 10px ${color}88` : `0 0 15px ${color}44`
      }}
      className="font-sans"
    >
      {display}
    </motion.span>
  )
}

export function MiniMatrixLoader() {
  const [isScrambling, setIsScrambling] = useState(false)

  useEffect(() => {
    // Parte statica e dopo 0.3s inizia lo scramble
    const timer = setTimeout(() => {
      setIsScrambling(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-[120] pb-[10vh]">
        <div className="flex gap-[0.05em] scale-[0.3] md:scale-[0.5]">
          <AnimatePresence>
            {MATRIX_TEXT.map((char) => (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[16vw] sm:text-[14vw] font-bold leading-none select-none"
                >
                  <ScrambleChar
                    target={char.target}
                    canScramble={char.canScramble}
                    isScrambling={isScrambling}
                    color={char.initialColor}
                  />
                </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {/* Linea estetica sotto */}
        <div className="w-[20vw] max-w-[200px] h-[1px] mt-4 bg-gradient-to-r from-transparent via-[#768b1a] to-transparent animate-pulse opacity-50" />
    </div>
  )
}
