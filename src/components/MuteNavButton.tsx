'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useAudio } from '@/contexts/AudioContext'

export function MuteNavButton() {
  const { isMuted, isPlaying, toggleMute } = useAudio()
  const [isHovered, setIsHovered] = useState(false)

  if (!isPlaying) return null

  return (
    <motion.button
      animate={{ scale: isHovered ? 1.5 : 1 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggleMute}
      className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 cursor-pointer rounded-full flex items-center justify-center focus:outline-none overflow-hidden relative"
      style={{
        backgroundColor: isHovered ? '#F45390' : '#B3828B',
        boxShadow: isHovered
          ? '0 0 30px rgba(244, 83, 144, 0.8), 0 0 60px rgba(244, 83, 144, 0.3)'
          : '0 0 10px rgba(0,0,0,0.3)',
        zIndex: isHovered ? 401 : undefined,
      }}
      title={isMuted ? 'Attiva audio' : 'Disattiva audio'}
    >
      <Image
        src="/images/ui/volume.webp"
        alt="Mute"
        fill
        className={`object-contain p-[0.3rem] md:p-2 transition-all duration-300 ${
          isMuted ? 'opacity-60 scale-90' : 'opacity-100 scale-100'
        }`}
        unoptimized
      />
    </motion.button>
  )
}
