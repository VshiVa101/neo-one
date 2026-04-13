'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'

interface ArtworkDetailClientProps {
  nid: string
  title: string
  image: string
  method: string
  support: string
  dimensions: string
  year: string
  availability: string | null
  priceInfo: string
  prevNid: string | null
  nextNid: string | null
}

export const ArtworkDetailClient = ({
  nid,
  title,
  image,
  method,
  support,
  dimensions,
  year,
  availability,
  priceInfo,
  prevNid,
  nextNid,
}: ArtworkDetailClientProps) => {
  const router = useRouter()
  const { addToCart, count } = useCart()

  const [prevHovered, setPrevHovered] = useState(false)
  const [nextHovered, setNextHovered] = useState(false)
  const [purchaseHovered, setPurchaseHovered] = useState(false)
  const [cartHovered, setCartHovered] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handlePurchase = () => {
    addToCart({ nid, title, image })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const isAvailable = availability === 'comprabile'

  return (
    <div className="flex flex-col w-full h-full max-w-[95vw] mx-auto justify-center items-center pb-2 relative z-20">
      
      {/* ── MIDDLE ROW (Le 3 colonne) ── */}
      <div className="flex flex-row items-stretch justify-center w-full h-[65vh] gap-[2vw]">
        
        {/* 1. LEFT PANEL */}
        <div className="relative w-[18vw] lg:w-[22vw] bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center pointer-events-none">
          {/* Zebra BG */}
          <div className="absolute inset-0">
             <img src="/images/ui/pink-zebra-bg.webp" alt="bg" className="w-[120%] h-full object-cover -translate-x-[10%]" />
          </div>
          {/* Logo Neo-One (Ingrandito massicciamente) */}
          <div className="relative z-10 w-[95%] h-[40%] mb-12 flex items-center justify-center">
            <div 
              className="w-full h-full bg-[#768b1a] drop-shadow-[0_0_15px_rgba(118,139,26,0.6)]" 
              style={{ WebkitMaskImage: 'url(/images/ui/logo-neo-bianco.webp)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} 
            />
          </div>
          {/* Btn Prev */}
          <div className="relative z-10">
            {prevNid ? (
              <motion.button
                className="pointer-events-auto cursor-pointer focus:outline-none w-[6vw] h-[6vw] min-w-[60px] min-h-[60px] max-w-[90px] max-h-[90px] bg-[#d99f9f] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors"
                onClick={() => router.replace(`/artwork/${prevNid}`)}
                onMouseEnter={() => setPrevHovered(true)}
                onMouseLeave={() => setPrevHovered(false)}
                whileHover={{ scale: 1.15, backgroundColor: '#768b1a' }}
                whileTap={{ scale: 0.9 }}
              >
                <img src={prevHovered ? '/images/ui/direction-arrow-green.webp' : '/images/ui/direction-arrow-pink.webp'} className="w-[50%] object-contain rotate-180" draggable={false} />
              </motion.button>
            ) : (
               <div className="w-[6vw] h-[6vw] min-w-[60px] min-h-[60px] opacity-0" />
            )}
          </div>
        </div>

        {/* 2. CENTER ARTWORK (Flex-1 per prendere tutto lo schermo intero possibile senza crop) */}
        <div className="relative flex-1 bg-black rounded-lg p-3 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden group">
          <img 
             src={image} 
             alt={`Opera ${nid}`} 
             className="absolute inset-0 w-full h-full object-contain p-2 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-[1.02]" 
          />
        </div>

        {/* 3. RIGHT PANEL */}
        <div className="relative w-[18vw] lg:w-[22vw] bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center pointer-events-none">
          {/* Zebra BG */}
          <div className="absolute inset-0">
             <img src="/images/ui/pink-zebra-bg.webp" alt="bg" className="w-[120%] h-full object-cover translate-x-[10%]" />
             <div className="absolute inset-0 bg-black/10" />
          </div>
          {/* Logo Neo-One (Ingrandito) */}
          <div className="relative z-10 w-[95%] h-[40%] mb-12 flex items-center justify-center">
            <div 
              className="w-full h-full bg-[#768b1a] drop-shadow-[0_0_15px_rgba(118,139,26,0.6)]" 
              style={{ WebkitMaskImage: 'url(/images/ui/logo-neo-bianco-2.webp)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} 
            />
          </div>
          {/* Btn Next */}
          <div className="relative z-10">
            {nextNid ? (
              <motion.button
                className="pointer-events-auto cursor-pointer focus:outline-none w-[6vw] h-[6vw] min-w-[60px] min-h-[60px] max-w-[90px] max-h-[90px] bg-[#d99f9f] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors"
                onClick={() => router.replace(`/artwork/${nextNid}`)}
                onMouseEnter={() => setNextHovered(true)}
                onMouseLeave={() => setNextHovered(false)}
                whileHover={{ scale: 1.15, backgroundColor: '#768b1a' }}
                whileTap={{ scale: 0.9 }}
              >
                <img src={nextHovered ? '/images/ui/direction-arrow-green.webp' : '/images/ui/direction-arrow-pink.webp'} className="w-[50%] object-contain" draggable={false} />
              </motion.button>
            ) : (
               <div className="w-[6vw] h-[6vw] min-w-[60px] min-h-[60px] opacity-0" />
            )}
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR (Sotto la card e allineata) ── */}
      <div className="w-[95vw] lg:w-[90vw] mt-4 z-30 bg-black/80 rounded-lg border border-white/5 py-3 px-6 flex flex-row items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        
        {/* Metadati */}
        <div className="flex flex-col flex-1 pl-4">
          <span className="font-neo text-[#F45390] text-sm lg:text-base tracking-[0.2em] mb-1">art details</span>
          <p className="font-neo text-white text-xs lg:text-sm tracking-widest uppercase truncate max-w-full">
            {method} / {support}
          </p>
          <p className="font-neo text-white/50 text-[10px] lg:text-xs tracking-widest uppercase">
            {dimensions} — {year}
          </p>
        </div>

        {/* Pulsante PRE-ORDER centrale (MOLTO PIU' GRANDE) */}
        <div className="flex-[0_0_30vw] flex flex-col items-center justify-center">
             <motion.button
              onClick={handlePurchase}
              onMouseEnter={() => setPurchaseHovered(true)}
              onMouseLeave={() => setPurchaseHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative outline-none flex justify-center py-2"
            >
               <img 
                 src={purchaseHovered || addedToCart ? '/images/ui/pre-orderverde.webp' : '/images/ui/pre-orderrosa.webp'}
                 alt="Purchase"
                 className="h-[80px] lg:h-[120px] w-auto max-w-full object-contain drop-shadow-[0_0_25px_rgba(244,83,144,0.4)] transition-all duration-300" 
               />
            </motion.button>
        </div>

        {/* Status & Controlli */}
        <div className="flex flex-1 flex-row items-center justify-end gap-6 pr-4">
           <div className="flex flex-col text-right">
              <span className="font-neo text-[#F45390] text-sm lg:text-base tracking-[0.2em] mb-1">status</span>
              <p className="font-neo text-white text-xs lg:text-sm tracking-widest uppercase">
                {isAvailable ? 'ACQUISTABILE' : 'ARCHIVIO PRIVATO'}
              </p>
              <p className="font-neo text-white/50 text-[10px] lg:text-xs tracking-widest uppercase">
                {priceInfo}
              </p>
           </div>
           
           {/* Carrello */}
           <motion.button
              onMouseEnter={() => setCartHovered(true)}
              onMouseLeave={() => setCartHovered(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] flex-shrink-0 bg-[#d99f9f] rounded-full flex outline-none border border-[#d99f9f] hover:border-[#768b1a] justify-center items-center cursor-pointer shadow-[0_0_10px_rgba(0,0,0,1)]"
            >
              <img src="/images/ui/carrello.webp" className="w-[50%] h-[50%] object-contain relative z-10" />
              {/* Contatore Spostato ESTERNAMENTE */}
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-[24px] h-[24px] flex items-center justify-center bg-[#768b1a] rounded-full font-neo text-sm text-black font-bold border-2 border-black z-20 shadow-[0_0_5px_rgba(118,139,26,0.8)]">
                  {count}
                </span>
              )}
           </motion.button>
           
           {/* Esc - Chiudi Detail, torna al Subcluster */}
           <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#F45390' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              className="w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] flex-shrink-0 bg-[#d99f9f] rounded-full flex items-center justify-center outline-none border border-[#d99f9f] shadow-[0_0_10px_rgba(0,0,0,1)] z-20"
              title="Torna alla Gallery"
            >
               <img src="/images/ui/esccc.webp" className="w-[55%] h-[55%] object-contain opacity-80" />
           </motion.button>
        </div>
      </div>
    </div>
  )
}
