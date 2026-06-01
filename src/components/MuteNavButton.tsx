'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useAudio } from '@/contexts/AudioContext'

export function MuteNavButton() {
  const { isMuted, isPlaying, toggleMute } = useAudio()

  if (!isPlaying) return null

  return (
    <motion.button
      whileHover="hover"
      initial="idle"
      animate="idle"
      variants={{
        idle: { scale: 1, y: 0 },
        hover: { scale: 1.2, y: -3 }
      }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleMute}
      className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] lg:w-[46px] lg:h-[46px] relative cursor-pointer focus:outline-none"
      title={isMuted ? 'Attiva audio' : 'Disattiva audio'}
    >
      <motion.div
        variants={{
          idle: { scale: 1, filter: 'brightness(1) drop-shadow(0 0 8px rgba(0,0,0,0.5))' },
          hover: { scale: 1.15, filter: 'brightness(1.3) drop-shadow(0 0 10px rgba(255,255,255,0.95))' }
        }}
        className="w-full h-full relative"
      >
        <motion.div
          animate={isMuted ? "muted" : "unmuted"}
          variants={{
            unmuted: { 
              rotate: 0, 
              y: 0,
              x: 0,
              transition: { duration: 0.3, ease: "easeOut" }
            },
            muted: { 
              rotate: 90, 
              y: [0, -4, 0, 3, 0], 
              x: [0, 1.5, 0, -1.5, 0],
              transition: {
                rotate: { duration: 0.5, type: "spring", bounce: 0.4 },
                y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }
            }
          }}
          className="w-full h-full relative"
        >
          <Image
            src="/images/ui/volume.webp"
            alt="Volume"
            fill
            className="object-contain opacity-95 drop-shadow-md"
            unoptimized
          />
        </motion.div>
      </motion.div>
    </motion.button>
  )
}
