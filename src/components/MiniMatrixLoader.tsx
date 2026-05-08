'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrambleChar, MATRIX_LOADER_CONFIG } from './home/ScrambleChar'

export function MiniMatrixLoader() {
  const [isScrambling, setIsScrambling] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScrambling(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black pointer-events-none z-[120] pb-[10vh]">
      <div className="flex gap-[0.05em] scale-[0.3] md:scale-[0.5]">
        <AnimatePresence>
          {MATRIX_LOADER_CONFIG.map((char) => (
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
                scrambleInterval={60}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="w-[20vw] max-w-[200px] h-[1px] mt-4 bg-gradient-to-r from-transparent via-[#768b1a] to-transparent animate-pulse opacity-50" />
    </div>
  )
}
