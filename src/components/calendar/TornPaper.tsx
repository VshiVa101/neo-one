'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface TornPaperProps {
  children: ReactNode
  className?: string
}

const tornClipPath = `polygon(
  0% 2%, 2% 0%, 5% 1.5%, 8% 0%, 12% 2%, 15% 0.5%, 18% 1%, 22% 0%, 25% 2.5%,
  28% 1%, 32% 0%, 35% 2%, 38% 0.5%, 42% 1%, 46% 0%, 50% 2%, 54% 0.5%,
  58% 1%, 62% 0%, 65% 2%, 68% 1.5%, 72% 0%, 76% 2%, 80% 0.5%, 84% 1%,
  88% 0%, 92% 2%, 95% 1%, 98% 0%, 100% 2%,
  100% 98%, 98% 100%, 95% 98.5%, 92% 100%, 88% 98%, 84% 99.5%, 80% 100%,
  76% 98%, 72% 99%, 68% 100%, 65% 98.5%, 62% 100%, 58% 99%, 54% 100%,
  50% 98%, 46% 99.5%, 42% 100%, 38% 98%, 35% 99%, 32% 100%, 28% 98.5%,
  25% 100%, 22% 99%, 18% 100%, 15% 98%, 12% 99.5%, 8% 100%, 5% 98%,
  2% 100%, 0% 98%
)`

export function TornPaper({ children, className = '' }: TornPaperProps) {
  return (
    <motion.div
      className={`relative text-black ${className}`}
      style={{ 
        clipPath: tornClipPath,
        backgroundImage: "url('/images/textures/paper-texture-v3.webp')",
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat'
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
