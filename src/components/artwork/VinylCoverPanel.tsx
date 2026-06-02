'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface VinylCoverPanelProps {
  artworkImage: string | null
  alt: string
  onClick?: () => void
  side: 'left' | 'right'
  clusterSlug?: string | null
}

export function VinylCoverPanel({ artworkImage, alt, onClick, side, clusterSlug }: VinylCoverPanelProps) {
  const [isHovered, setIsHovered] = useState(false)

  const isNeon = clusterSlug?.toLowerCase() === 'neon'
  const bgImage = isNeon ? '/images/ui/web_2_color_banner.webp' : '/images/ui/artwork-scene-bg.jpeg'

  if (!artworkImage) {
    return (
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          transform: side === 'left' ? 'scaleX(-1)' : 'none',
          filter: 'brightness(1.5)'
        }}
      />
    )
  }

  // Animation variants
  const discVariants = {
    idle: { 
      y: 0,
      x: 0,
      rotate: 0,
      scale: 0.85
    },
    hovered: { 
      y: '-75%',
      x: 0,
      rotate: side === 'left' ? 180 : -180,
      scale: 0.95
    }
  }

  return (
    <div
      className="absolute inset-0 overflow-visible cursor-pointer flex items-center justify-center z-50"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* SFONDO DEL BANNER (SPECCHIATO SE A SINISTRA) */}
      <div className="absolute inset-0 bg-black/15 rounded-lg overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
          style={{ 
            backgroundImage: `url(${bgImage})`,
            transform: side === 'left' ? 'scaleX(-1)' : 'none',
            filter: 'brightness(1.5)'
          }}
        />
      </div>

      <div className="relative w-[70%] aspect-square flex items-center justify-center perspective-[1000px]">
        
        {/* VINYL DISC (Dietro) */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#0a0a0a] border-[4px] border-[#1a1a1a] flex items-center justify-center overflow-hidden shadow-2xl z-0"
          variants={discVariants}
          initial="idle"
          animate={isHovered ? "hovered" : "idle"}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          {/* Immagine al centro del disco */}
          <div className="relative w-[45%] h-[45%] rounded-full overflow-hidden border-2 border-white/10">
            <Image
              src={artworkImage}
              alt={`${alt} vinyl`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          
          {/* Buco centrale del vinile */}
          <div className="absolute w-4 h-4 bg-black rounded-full border border-white/10 z-10 shadow-inner" />
          
          {/* Riflessi del vinile */}
          <div 
            className="absolute inset-0 rounded-full z-0 pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.08) 15%, transparent 30%, transparent 50%, rgba(255,255,255,0.08) 65%, transparent 80%)'
            }}
          />
          {/* Scanalature (grooves) */}
          <div className="absolute inset-0 rounded-full border border-white/5 m-[10%]" />
          <div className="absolute inset-0 rounded-full border border-white/5 m-[20%]" />
          <div className="absolute inset-0 rounded-full border border-white/5 m-[30%]" />
        </motion.div>

        {/* COPERTINA (Davanti) */}
        <motion.div
          className="absolute inset-0 z-10 bg-black shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden border border-white/10"
          initial={false}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ transformOrigin: side === 'left' ? 'left center' : 'right center' }}
        >
          <Image
            src={artworkImage}
            alt={`${alt} cover`}
            fill
            className="object-cover opacity-90 brightness-90 saturate-[0.8]"
            unoptimized
          />
          {/* Effetto texture sulla copertina (opzionale, per dargli un look di cartone) */}
          <div 
            className="absolute inset-0 mix-blend-multiply opacity-30 pointer-events-none"
            style={{ backgroundImage: 'url(/images/ui/crumpled_paper_texture.png)', backgroundSize: 'cover' }}
          />
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none" />
        </motion.div>
      </div>

      {/* ── FRECCIA HINT ── */}
      <motion.div
        className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none z-20"
        initial={false}
        animate={{ opacity: isHovered ? 0 : 0.6 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/images/ui/direction-arrow-pink.webp"
            alt={side === 'left' ? 'Precedente' : 'Successiva'}
            width={32}
            height={32}
            className={`object-contain drop-shadow-[0_0_14px_rgba(0,0,0,1)] ${side === 'left' ? 'rotate-180' : ''}`}
            unoptimized
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
