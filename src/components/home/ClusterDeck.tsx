'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { DeckHeader } from './DeckHeader'
import { DeckCard } from './DeckCard'
import { MockArtwork } from './deckCardStyle'
import { useInputMode } from '@/contexts/InputModeContext'

interface ClusterDeckProps {
  subclusterTitle: string
  artworks: MockArtwork[]
  onExpand?: (artwork: MockArtwork) => void
  isDeckActive?: boolean
}

export const ClusterDeck = ({
  subclusterTitle,
  artworks,
  onExpand,
  isDeckActive,
}: ClusterDeckProps) => {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isIntroDone, setIsIntroDone] = useState(false)
  const { isTouchMode } = useInputMode()
  const scrollTimeout = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroDone(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollTimeout.current) return
    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null
    }, 400)

    if (e.deltaY > 0) {
      setActiveIndex((prev) => (prev + 1) % artworks.length)
    } else if (e.deltaY < 0) {
      setActiveIndex((prev) => (prev - 1 + artworks.length) % artworks.length)
    }
  }

  const handleExpand = (artwork: MockArtwork) => {
    if (onExpand) {
      onExpand(artwork)
    } else {
      router.push(`/artwork/${encodeURIComponent(artwork.id)}`)
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-[80vw] lg:w-[25vw] xl:w-[20vw] h-full relative cursor-ns-resize touch-pan-x select-none"
      role="group"
      aria-roledescription="carousel"
      aria-label={`Mazzo: ${subclusterTitle}`}
      onWheel={handleWheel}
      onPanEnd={(e, info) => {
        if (Math.abs(info.offset.y) > 30 && Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
          if (info.offset.y < 0) {
            // Swipe up (drag finger up) -> scroll forward
            setActiveIndex((prev) => (prev + 1) % artworks.length)
          } else {
            // Swipe down (drag finger down) -> scroll backward
            setActiveIndex((prev) => (prev - 1 + artworks.length) % artworks.length)
          }
        }
      }}
    >
      <DeckHeader title={subclusterTitle} isActive={!!isDeckActive} />

      <div 
        className="relative w-[55vw] h-[70vw] md:w-[40vw] md:h-[50vw] lg:w-[20vw] lg:h-[25vw] flex items-center justify-center pointer-events-auto"
        onMouseEnter={() => {
          if (!isTouchMode) setIsHovered(true)
        }}
        onMouseLeave={() => {
          setIsHovered(false)
        }}
      >
        <AnimatePresence>
          {artworks.map((artwork, i) => (
            <DeckCard
              key={artwork.id}
              artwork={artwork}
              index={i}
              activeIndex={activeIndex}
              total={artworks.length}
              isActive={i === activeIndex}
              onActivate={setActiveIndex}
              onExpand={handleExpand}
              isDeckHovered={isHovered}
              isIntroDone={isIntroDone}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
