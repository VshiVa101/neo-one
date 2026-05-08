'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CHARS = 'ONE'

export interface CharConfig {
  id: number
  target: string
  initialColor: string
  canScramble: boolean
  finalColor?: string
}

export const MATRIX_GATEWAY_CONFIG: CharConfig[] = [
  { id: 0, target: 'N', initialColor: '#809829', canScramble: true },
  { id: 1, target: 'E', initialColor: '#B3828B', canScramble: true },
  { id: 2, target: 'O', initialColor: '#F45390', finalColor: '#F45390', canScramble: true },
  { id: 3, target: '-', initialColor: '#FFFFFF', canScramble: false },
  { id: 4, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 5, target: 'N', initialColor: '#809829', finalColor: '#809829', canScramble: true },
  { id: 6, target: 'E', initialColor: '#B3828B', canScramble: true },
]

export const MATRIX_LOADER_CONFIG: CharConfig[] = [
  { id: 0, target: 'N', initialColor: '#809829', canScramble: true },
  { id: 1, target: 'E', initialColor: '#B3828B', canScramble: true },
  { id: 2, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 3, target: '-', initialColor: '#FFFFFF', canScramble: false },
  { id: 4, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 5, target: 'N', initialColor: '#809829', canScramble: true },
  { id: 6, target: 'E', initialColor: '#B3828B', canScramble: true },
]

const CHAR_COLORS: Record<string, string> = {
  N: '#809829', // Acid Green
  E: '#FF82B2', // Pink
  O: '#F45390', // Vibrant Pink
  '-': '#FFFFFF', // White
}

interface ScrambleCharProps {
  target: string
  isScrambling: boolean
  canScramble: boolean
  color?: string // Ignored in favor of character-based coloring
  scrambleInterval?: number
}

export const ScrambleChar = ({
  target,
  isScrambling,
  canScramble,
  scrambleInterval = 100,
}: ScrambleCharProps) => {
  const [display, setDisplay] = useState(target)
  const audioContextRef = useRef<AudioContext | null>(null)

  const playTick = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') ctx.resume()

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(150, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05)

      gainNode.gain.setValueAtTime(0.02, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.05)
    } catch (e) {
      // Silence audio errors (e.g. browser policy)
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
      setDisplay(CHARS[Math.floor(Math.random() * CHARS.length)])
      playTick()
    }, scrambleInterval)

    return () => clearInterval(interval)
  }, [isScrambling, canScramble, target, scrambleInterval])

  const currentCharColor = CHAR_COLORS[display] || '#FFFFFF'

  return (
    <motion.span
      animate={{
        color: currentCharColor,
        textShadow: isScrambling && canScramble
          ? `0 0 15px ${currentCharColor}66`
          : `0 0 25px ${currentCharColor}33`,
      }}
      transition={{ 
        color: { duration: 0 }, // Instant color change
        textShadow: { duration: 0.2 }
      }}
      className="font-sans"
    >
      {display}
    </motion.span>
  )
}
