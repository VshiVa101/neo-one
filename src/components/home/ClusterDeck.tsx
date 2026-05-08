'use client'

import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { DeckHeader } from './DeckHeader'
import { DeckCard } from './DeckCard'
import { MockArtwork } from './deckCardStyle'

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
  const scrollTimeout = React.useRef<NodeJS.Timeout | null>(null)
  const touchStartY = React.useRef<number | null>(null)

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
    <div
      className="flex flex-col items-center justify-center w-[80vw] lg:w-[25vw] xl:w-[20vw] h-full relative cursor-ns-resize"
      role="group"
      aria-roledescription="carousel"
      aria-label={`Mazzo: ${subclusterTitle}`}
      onWheel={handleWheel}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY
      }}
      onTouchEnd={(e) => {
        if (touchStartY.current === null) return
        const touchEndY = e.changedTouches[0].clientY
        const deltaY = touchStartY.current - touchEndY
        if (Math.abs(deltaY) > 30) {
          if (deltaY > 0) setActiveIndex((prev) => (prev + 1) % artworks.length)
          else setActiveIndex((prev) => (prev - 1 + artworks.length) % artworks.length)
        }
        touchStartY.current = null
      }}
    >
      <DeckHeader title={subclusterTitle} isActive={!!isDeckActive} />

      <div className="relative w-[55vw] h-[70vw] md:w-[40vw] md:h-[50vw] lg:w-[20vw] lg:h-[25vw] flex items-center justify-center pointer-events-none">
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
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
