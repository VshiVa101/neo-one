'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, Music } from 'lucide-react'

interface AcidAudioPlayerProps {
  url: string
  title?: string
}

export const AcidAudioPlayer = ({ url, title = 'SONIC DROP' }: AcidAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(p)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setProgress(0)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-[500px]"
    >
      <div className="relative group bg-black/40 backdrop-blur-xl border border-[#F45390]/30 p-4 rounded-full flex items-center gap-4 shadow-[0_0_30px_rgba(244,83,144,0.2)] overflow-hidden">
        
        {/* Progress Bar Background */}
        <div className="absolute inset-0 z-0 opacity-10">
            <div 
              className="h-full bg-[#F45390] transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
        </div>

        {/* Play Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="relative z-10 w-12 h-12 rounded-full bg-[#F45390] flex items-center justify-center text-black shadow-[0_0_15px_#F45390]"
        >
          {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} className="ml-1" fill="black" />}
        </motion.button>

        {/* Info */}
        <div className="flex-1 flex flex-col z-10">
          <span className="font-neo text-[10px] tracking-[0.3em] text-[#F45390] uppercase leading-none mb-1">
            Now Pulsing
          </span>
          <h3 className="font-neo text-white text-sm tracking-widest uppercase truncate">
            {title}
          </h3>
        </div>

        {/* Visualizer Mock */}
        <div className="flex items-end gap-1 h-8 px-4 z-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: isPlaying ? [8, 24, 12, 28, 10][i] : 4 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.5 + i * 0.1, 
                ease: "easeInOut" 
              }}
              className="w-1 bg-[#768b1a] rounded-t-full shadow-[0_0_5px_#768b1a]"
            />
          ))}
        </div>

        <audio 
          ref={audioRef}
          src={url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </div>
      
      {/* Glitch sub-text */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 left-0 w-full text-center"
          >
            <p className="font-neo text-[8px] text-[#768b1a] tracking-[0.5em] uppercase">
              Frequency Stabilized // Neo-One Protocol
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
