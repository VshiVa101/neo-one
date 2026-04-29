'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MockArtwork } from './ClusterDeck'
import { useRouter } from 'next/navigation'

import { EyeScene } from '@/components/EyeScene'

interface ExpandedGalleryOverlayProps {
  isOpen: boolean
  onClose: () => void
  subclusterTitle: string
  artworks: MockArtwork[]
  clusterId?: string | number | null
  deckIndex?: number | null
}

export const ExpandedGalleryOverlay = ({
  isOpen,
  onClose,
  subclusterTitle,
  artworks,
  clusterId,
  deckIndex,
}: ExpandedGalleryOverlayProps) => {
  const router = useRouter()

  React.useEffect(() => {
    // La logica pushState è stata rimossa per evitare conflitti con il router di Next.js
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-[200] bg-black/90 overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
          {/* Header Galleria */}
          <div className="sticky top-0 left-0 w-full p-8 flex flex-col items-start z-[210] pt-[4vh] md:pt-[6vh] bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none">
            {/* Header con titolo e X - Lasciamo lo spazio centrale per l'Occhio Globale che è z-500 */}
            <div className="flex flex-row items-start justify-between w-full pb-8 pointer-events-none">
              {/* Titolo */}
              <div className="flex flex-col pointer-events-auto">
                <h2 className="font-neo text-[#F45390] text-3xl md:text-5xl tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(244,83,144,0.5)]">
                  {subclusterTitle}
                </h2>
                <div className="h-0.5 w-24 md:w-48 bg-[#768b1a] mt-2 md:mt-4 shadow-[0_0_10px_#768b1a]" />
              </div>

              {/* Spacer centrale per l'Occhio Globale (z-500) */}
              <div className="flex-1" />

              {/* Close Button X - Posizione fissa per sicurezza click */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#F45390' }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-[#d99f9f] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] z-[250] pointer-events-auto cursor-pointer transition-colors duration-300"
              >
                <img src="/images/ui/esccc.webp" className="w-1/2 h-1/2 object-contain" />
              </motion.button>
            </div>
          </div>

          {/* Griglia Opere */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24 mt-[5vh] md:mt-[10vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {artworks.map((artwork, i) => (
                <motion.div
                  key={artwork.id + '-expanded-' + i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 0 30px rgba(118, 139, 26, 0.4)',
                  }}
                  className="group relative aspect-square sm:aspect-auto h-[450px] border border-white/10 overflow-hidden cursor-pointer bg-black"
                  onClick={() => {
                    const params = new URLSearchParams()
                    if (clusterId) params.set('cluster', String(clusterId))
                    if (deckIndex !== null && deckIndex !== undefined) params.set('deck', String(deckIndex))
                    const queryString = params.toString()
                    router.push(`/artwork/${encodeURIComponent(artwork.id)}${queryString ? '?' + queryString : ''}`)
                  }}
                >
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover grayscale brightness-110 contrast-125 sm:grayscale sm:brightness-110 sm:contrast-125 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 transition-all duration-700 max-sm:grayscale-0 max-sm:brightness-100 max-sm:contrast-100"
                  />

                  {/* Overlay Testo Sempre Visibile In Basso */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-4 lg:p-6 transition-all duration-300">
                    <p className="font-neo text-white text-base lg:text-lg tracking-widest uppercase mb-1 drop-shadow-md">
                      {artwork.title}
                    </p>
                    <div className="h-0.5 w-8 lg:w-12 bg-[#768b1a] shadow-[0_0_10px_#768b1a] group-hover:w-full transition-all duration-500" />
                  </div>

                  {/* Numero opera (stile Acid - Sempre Green Acid) */}
                  <div className="absolute top-4 right-4 font-neo text-[#768b1a] text-xs italic drop-shadow-[0_0_5px_rgba(118,139,26,0.5)]">
                    [{String(i + 1).padStart(3, '0')}]
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer Gallery */}
          <div className="w-full py-12 flex flex-col items-center">
            <p className="font-neo text-gray-600 text-[10px] tracking-[0.5em] uppercase">
              Fine Sottocluster
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
