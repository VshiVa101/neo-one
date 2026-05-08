'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { BrandedTitle } from '@/components/BrandedTitle'
import { MockArtwork, getCardStyle } from './deckCardStyle'

interface DeckCardProps {
  artwork: MockArtwork
  index: number
  activeIndex: number
  total: number
  isActive: boolean
  onActivate: (index: number) => void
  onExpand: (artwork: MockArtwork) => void
}

export const DeckCard = ({
  artwork,
  index,
  activeIndex,
  total,
  isActive,
  onActivate,
  onExpand,
}: DeckCardProps) => {
  const style = getCardStyle(index, activeIndex, total)

  return (
    <motion.div
      key={artwork.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        y: style.y,
        scale: style.scale,
        zIndex: style.zIndex,
        opacity: style.opacity,
        filter: `brightness(${style.brightness})`,
      }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className={`absolute w-full h-full border-2 border-[#1A1A1A] shadow-[0_15px_30px_rgba(0,0,0,0.8)] overflow-hidden bg-[#111] pointer-events-auto ${isActive ? 'cursor-pointer hover:border-[#F45390]' : 'cursor-pointer'}`}
      onClick={() => {
        if (isActive) {
          onExpand(artwork)
        } else {
          onActivate(index)
        }
      }}
    >
      <Image
        src={artwork.image}
        alt={artwork.title}
        fill
        className="object-cover"
        style={{ opacity: isActive ? 1 : 0.8 }}
        sizes="(max-width: 768px) 55vw, (max-width: 1024px) 40vw, 20vw"
      />

      {isActive && (
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="font-neo text-white text-sm uppercase"><BrandedTitle text={artwork.title} /></p>
        </div>
      )}
    </motion.div>
  )
}
