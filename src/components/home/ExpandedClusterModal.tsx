'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ClusterDeck } from '@/components/home/ClusterDeck'
import { MiniMatrixLoader } from '@/components/MiniMatrixLoader'
import { SubclusterData } from './ClusterLayout'

interface ExpandedClusterModalProps {
  isOpen: boolean
  onClose: () => void
  subclusters: SubclusterData[]
  isLoading: boolean
  activeDeckIndex: number
  onActiveDeckChange: (index: number) => void
  onDeckExpand: (index: number) => void
  touchStartX: React.MutableRefObject<number | null>
}

export const ExpandedClusterModal = ({
  isOpen,
  onClose,
  subclusters,
  isLoading,
  activeDeckIndex,
  onActiveDeckChange,
  onDeckExpand,
  touchStartX,
}: ExpandedClusterModalProps) => {
  const validSubclusters = subclusters.filter(
    (sub) => sub.artworks && sub.artworks.length > 0,
  )

  // Map filtered index to original subclusters index for onDeckExpand
  const originalIndexMap = subclusters
    .map((sub, i) => (sub.artworks && sub.artworks.length > 0 ? i : -1))
    .filter((i) => i !== -1)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="expanded-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[150] bg-black/80 flex flex-col justify-center overflow-hidden"
          onClick={onClose}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return
            const touchEndX = e.changedTouches[0].clientX
            const deltaX = touchStartX.current - touchEndX
            if (Math.abs(deltaX) > 50) {
              if (deltaX > 0)
                onActiveDeckChange(Math.min(validSubclusters.length - 1, activeDeckIndex + 1))
              else onActiveDeckChange(Math.max(0, activeDeckIndex - 1))
            }
            touchStartX.current = null
          }}
        >
          <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[300] pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#F45390' }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#B3828B] rounded-full cursor-pointer transition-colors duration-300"
            >
              <Image
                src="/images/ui/esccc.webp"
                alt="ESC"
                width={64}
                height={64}
                className="w-[62%] h-[62%] object-contain"
                style={{ transform: 'scale(1.5)' }}
                unoptimized
              />
            </motion.button>
          </div>

          {isLoading ? (
            <MiniMatrixLoader />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {validSubclusters.length === 0 ? (
                <div className="text-white font-neo tracking-widest opacity-50 uppercase">
                  Nessuna Opera Trovata
                </div>
              ) : (
                validSubclusters.map((sub, idx) => {
                  const originalIdx = originalIndexMap[idx]
                  const offset = idx - activeDeckIndex
                  const absOffset = Math.abs(offset)
                  const isActive = offset === 0
                  const xTranslation = offset * 20
                  const scale = isActive ? 1 : Math.max(0.7, 1 - absOffset * 0.15)
                  const opacity = isActive ? 1 : Math.max(0, 1 - absOffset * 0.4)
                  const rotateY = offset > 0 ? -15 : offset < 0 ? 15 : 0
                  const zIndex = 60 - absOffset * 10

                  return (
                    <motion.div
                      key={'deck-wrapper-' + idx}
                      animate={{
                        x: `${xTranslation}vw`,
                        scale,
                        opacity,
                        rotateY,
                        zIndex,
                      }}
                      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                      style={{ perspective: 1000 }}
                      className="absolute pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={() => onActiveDeckChange(idx)}
                    >
                      <ClusterDeck
                        subclusterTitle={sub.title}
                        artworks={sub.artworks}
                        onExpand={() => onDeckExpand(originalIdx)}
                        isDeckActive={isActive}
                      />
                    </motion.div>
                  )
                })
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
