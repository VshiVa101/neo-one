'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MockArtwork } from './ClusterDeck'
import { useRouter } from 'next/navigation'

interface ExpandedGalleryOverlayProps {
  isOpen: boolean
  onClose: () => void
  subclusterTitle: string
  artworks: MockArtwork[]
}

export const ExpandedGalleryOverlay = ({ 
  isOpen, 
  onClose, 
  subclusterTitle, 
  artworks 
}: ExpandedGalleryOverlayProps) => {
  const router = useRouter()

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
          <div className="sticky top-0 left-0 w-full p-8 flex justify-between items-center z-[210] bg-gradient-to-b from-black via-black/80 to-transparent">
            <div className="flex flex-col">
              <h2 className="font-neo text-[#F45390] text-3xl tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(244,83,144,0.5)]">
                {subclusterTitle}
              </h2>
              <div className="h-0.5 w-24 bg-[#768b1a] mt-2 shadow-[0_0_10px_#768b1a]" />
            </div>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#F45390' }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-[60px] h-[60px] flex items-center justify-center bg-[#d99f9f] rounded-full hover:bg-opacity-80 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-[#d99f9f]"
            >
              <img src="/images/ui/esccc.webp" className="w-[60%] h-[60%] object-contain opacity-80" />
            </motion.button>
          </div>

          {/* Griglia Opere */}
          <div className="max-w-7xl mx-auto px-8 pb-24 mt-[25vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {artworks.map((artwork, i) => (
                <motion.div
                  key={artwork.id + '-expanded-' + i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: '0 0 30px rgba(118, 139, 26, 0.4)'
                  }}
                  className="group relative h-[400px] border border-white/10 overflow-hidden cursor-pointer bg-black"
                  onClick={() => router.push(`/artwork/${artwork.id}`)}
                >
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-full object-cover grayscale brightness-110 contrast-125 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 transition-all duration-700"
                  />
                  
                  {/* Overlay Testo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <p className="font-neo text-white text-lg tracking-widest uppercase mb-1 drop-shadow-md">
                      {artwork.title}
                    </p>
                    <div className="h-0.5 w-12 bg-[#768b1a] shadow-[0_0_10px_#768b1a]" />
                  </div>
                  
                  {/* Numero opera (stile Acid - Sempre Green Acid) */}
                  <div className="absolute top-4 right-4 font-neo text-[#768b1a] text-xs italic drop-shadow-[0_0_5px_rgba(118,139,26,0.5)]">
                    [{String(i+1).padStart(3, '0')}]
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Footer Gallery */}
          <div className="w-full py-12 flex flex-col items-center">
             <p className="font-neo text-gray-600 text-[10px] tracking-[0.5em] uppercase">Fine Sottocluster</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
