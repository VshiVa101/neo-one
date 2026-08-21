'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { BrandedTitle } from '@/components/BrandedTitle'
import { MockArtwork, getCardStyle } from './deckCardStyle'
import { useInputMode } from '@/contexts/InputModeContext'

interface DeckCardProps {
  artwork: MockArtwork
  index: number
  activeIndex: number
  total: number
  isActive: boolean
  onActivate: (index: number) => void
  onExpand: (artwork: MockArtwork) => void
  isDeckHovered: boolean
  isIntroDone: boolean
}

export const DeckCard = ({
  artwork,
  index,
  activeIndex,
  total,
  isActive,
  onActivate,
  onExpand,
  isDeckHovered,
  isIntroDone,
}: DeckCardProps) => {
  const style = getCardStyle(index, activeIndex, total)
  const { isTouchMode } = useInputMode()

  // Calculate physical offset from active card
  let offset = (index - activeIndex) % total
  if (offset < 0) offset += total
  if (offset > Math.floor(total / 2)) offset -= total
  const absOffset = Math.abs(offset)

  // Initial and intro-based animation targets
  const targetY = isIntroDone ? style.y : '0%'
  const targetScale = isIntroDone ? style.scale : (absOffset === 0 ? 1 : 0.9)
  const targetOpacity = isIntroDone ? style.opacity : (absOffset === 0 ? 1 : 0)
  const targetBrightness = isIntroDone ? style.brightness : 1

  // Dynamic box shadow with a subtle elegant pink flash pulse when sliding out
  const targetBoxShadow = (isIntroDone && absOffset !== 0)
    ? [
        '0px 15px 30px rgba(0,0,0,0.8)',
        '0px 0px 25px rgba(244,83,144,0.75)',
        '0px 15px 30px rgba(0,0,0,0.8)'
      ]
    : '0px 15px 30px rgba(0,0,0,0.8)'

  return (
    <motion.div
      key={artwork.id}
      initial={{ opacity: 0, scale: 0.8, borderColor: '#1A1A1A', boxShadow: '0px 15px 30px rgba(0,0,0,0.8)' }}
      animate={{
        y: targetY,
        scale: targetScale,
        zIndex: style.zIndex,
        opacity: targetOpacity,
        filter: `brightness(${targetBrightness})`,
        borderColor: isDeckHovered ? (
          absOffset === 0 ? '#809829' : // Acid Green
          absOffset === 1 ? '#F45390' : // Pink Flash Brand
          absOffset === 2 ? '#B33D6B' : // Darker Pink
          absOffset === 3 ? '#732042' : // Even Darker Pink
          '#471126'                     // Rest of the cards behind
        ) : '#1A1A1A',
        boxShadow: targetBoxShadow,
      }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      whileTap={{ scale: 0.95 }}
      className="absolute w-full h-full border-2 overflow-hidden bg-[#111] pointer-events-auto cursor-pointer"
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
        unoptimized
      />

      {isActive && (
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="font-neo text-white text-sm uppercase"><BrandedTitle text={artwork.title} /></p>
        </div>
      )}
    </motion.div>
  )
}
