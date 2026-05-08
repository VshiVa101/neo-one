'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MockArtwork } from './deckCardStyle'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BrandedTitle } from '@/components/BrandedTitle'

interface ExpandedGalleryOverlayProps {
  isOpen: boolean
  onClose: () => void
  artworks: MockArtwork[]
  clusterId?: string | number | null
  deckIndex?: number | null
}

export const ExpandedGalleryOverlay = ({
  isOpen,
  onClose,
  artworks,
  clusterId,
  deckIndex,
}: ExpandedGalleryOverlayProps) => {
  const router = useRouter()

  React.useEffect(() => {
    // La logica pushState è stata rimossa per evitare conflitti con il router di Next.js
  }, [isOpen, onClose])

  return (    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-[200] bg-black/90 overflow-hidden"
        >
          {/* LAYER DI SCROLL: Contiene la griglia e l'ombra sticky */}
          <div className="absolute inset-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {/* HEADER SPACER (per lasciare spazio all'occhio e al titolo fixed) */}
            <div className="w-full h-[24vh] md:h-[45vh] pointer-events-none" />

            {/* Griglia Opere */}
            <div className="relative z-[200] max-w-7xl mx-auto px-4 md:px-8 pb-12 -mt-[15vh] md:-mt-[30vh]">
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
                    className="group relative aspect-square sm:aspect-auto h-auto sm:h-[450px] border border-white/10 overflow-hidden cursor-pointer bg-black"
                    onClick={() => {
                      const params = new URLSearchParams()
                      if (clusterId) params.set('cluster', String(clusterId))
                      if (deckIndex !== null && deckIndex !== undefined) params.set('deck', String(deckIndex))
                      const queryString = params.toString()
                      router.push(`/artwork/${encodeURIComponent(artwork.id)}${queryString ? '?' + queryString : ''}`)
                    }}
                  >
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover grayscale brightness-110 contrast-125 sm:grayscale sm:brightness-110 sm:contrast-125 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 transition-all duration-700 max-sm:grayscale-0 max-sm:brightness-100 max-sm:contrast-100"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />

                    {/* Overlay Testo Sempre Visibile In Basso */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-4 lg:p-6 transition-all duration-300">
                      <p className="font-neo text-white text-base lg:text-lg tracking-widest mb-1 drop-shadow-md">
                        <BrandedTitle text={artwork.title} />
                      </p>
                      <div className="h-0.5 w-8 lg:w-12 bg-[#809829] shadow-[0_0_10px_#809829] group-hover:w-full transition-all duration-500" />
                    </div>

                    {/* Numero opera */}
                    <div className="absolute top-4 right-4 font-neo text-[#809829] text-xs italic drop-shadow-[0_0_5px_rgba(128,152,41,0.5)]">
                      [{String(i + 1).padStart(3, '0')}]
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* LAYER UI FISSO: Sfumatura dal basso e Tasto ESC (Non scorrono mai) */}
          <div className="absolute inset-0 pointer-events-none z-[300]">
            {/* Sfumatura Verde Acido dal Basso - ancorata al viewport */}
            <div className="absolute bottom-0 w-full h-[18vh] bg-gradient-to-t from-[#809829]/40 via-[#809829]/15 to-transparent" />

            {/* Tasto ESC Bottom-Left */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#F45390' }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#B3828B] rounded-full cursor-pointer transition-colors duration-300"
              >
                <Image src="/images/ui/esccc.webp" alt="ESC" width={64} height={64} className="w-[62%] h-[62%] object-contain" style={{ transform: 'scale(1.5)' }} unoptimized />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

  )
}
