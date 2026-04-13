'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export interface MockArtwork {
  id: string
  title: string
  image: string
}

interface ClusterDeckProps {
  subclusterTitle: string
  artworks: MockArtwork[]
  onExpand?: (artwork: MockArtwork) => void
}

export const ClusterDeck = ({ subclusterTitle, artworks, onExpand }: ClusterDeckProps) => {
  const router = useRouter()
  // Indice della carta correntemente selezionata (Main Card)
  const [activeIndex, setActiveIndex] = useState(0)

  // Ritardo sfoglio debounce
  const scrollTimeout = React.useRef<NodeJS.Timeout | null>(null)
  
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollTimeout.current) return
    
    // Settiamo un mini-blocco per evitare scorrimenti doppi
    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null
    }, 400) // 400ms è la sensibilità dello sfoglio (aggiustabile)

    if (e.deltaY > 0) {
      setActiveIndex((prev) => (prev + 1) % artworks.length)
    } else if (e.deltaY < 0) {
      setActiveIndex((prev) => (prev - 1 + artworks.length) % artworks.length)
    }
  }

  // Calcola gli stili base a seconda della distanza dall'active index, ORA CIRCOLARE
  const getCardStyle = (index: number) => {
    let offset = (index - activeIndex) % artworks.length
    if (offset < 0) offset += artworks.length;

    if (offset > Math.floor(artworks.length / 2)) {
       offset -= artworks.length;
    }

    if (offset === 0) {
      // Main Card In Primo Piano
      return {
        y: '0%',
        scale: 1,
        zIndex: 50,
        opacity: 1,
        brightness: 1,
      }
    } else if (offset === -1) {
      // Prima carta che sporge SOPRA
      return {
        y: '-10%',
        scale: 0.97,
        zIndex: 40,
        opacity: 1,
        brightness: 0.7,
      }
    } else if (offset === -2) {
      // Seconda carta che sporge SOPRA
      return {
        y: '-18%',
        scale: 0.94,
        zIndex: 30,
        opacity: 1,
        brightness: 0.5,
      }
    } else if (offset === 1) {
      // Prima carta che sporge SOTTO
      return {
        y: '10%',
        scale: 0.97,
        zIndex: 40,
        opacity: 1,
        brightness: 0.7,
      }
    } else if (offset === 2) {
      // Seconda carta che sporge SOTTO
      return {
        y: '18%',
        scale: 0.94,
        zIndex: 30,
        opacity: 1,
        brightness: 0.5,
      }
    } else {
      // Altre carte -> Nascoste
      return {
        y: offset < 0 ? '-30%' : '30%',
        scale: 0.8,
        zIndex: 10,
        opacity: 0,
        brightness: 0,
      }
    }
  }

  return (
    <div 
      className="flex flex-col items-center justify-start w-[25vw] h-full pt-[5vh] relative cursor-ns-resize"
      onWheel={handleWheel}
    >
      {/* Intestazione del Subcluster / Deck */}
      <div className="text-center z-50 mb-[10vh] shrink-0 pointer-events-none">
        <h3 className="font-neo text-white text-[1.8vw] tracking-widest uppercase drop-shadow-md leading-none">
          {subclusterTitle}
        </h3>
      </div>

      {/* Area del Mazzo */}
      <div className="relative w-[20vw] h-[25vw] flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {artworks.map((artwork, i) => {
            const style = getCardStyle(i)
            const isActive = i === activeIndex

            return (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  y: style.y,
                  scale: style.scale,
                  zIndex: style.zIndex,
                  opacity: style.opacity,
                  filter: `brightness(${style.brightness})`
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.32, 0.72, 0, 1] // Curva aggressiva che si assesta morbida
                }}
                className={`absolute w-full h-full border-2 border-[#1A1A1A] shadow-[0_15px_30px_rgba(0,0,0,0.8)] overflow-hidden bg-[#111] pointer-events-auto ${isActive ? 'cursor-pointer hover:border-[#F45390]' : ''}`}
                onClick={() => {
                  if (isActive) {
                    if (onExpand) {
                      onExpand(artwork)
                    } else {
                      router.push(`/artwork/${artwork.id}`)
                    }
                  } else {
                    // Cliccando una carta visibile non principale, si potrebbe scorrere fino ad essa
                    // (Ma disabilitato per focus al finto scorrimento scroll wheel)
                    setActiveIndex(i)
                  }
                }}
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                  style={{ opacity: isActive ? 1 : 0.8 }}
                />

                {/* Piccolo overlay interno solo sulla carta attiva */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="font-neo text-white text-sm uppercase">{artwork.title}</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
