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
    <div className="flex flex-col w-full h-full max-w-[90vw] mx-auto justify-center items-center pb-2">
      
      {/* ── MIDDLE ROW (Le 3 colonne) ── */}
      <div className="flex flex-row items-stretch justify-center w-full h-[65vh] gap-[2vw]">
        
        {/* 1. LEFT PANEL */}
        <div className="relative w-[22vw] bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center pointer-events-none">
          {/* Zebra BG */}
          <div className="absolute inset-0">
             <img src="/images/ui/pink-zebra-bg.webp" alt="bg" className="w-[120%] h-full object-cover -translate-x-[10%]" />
          </div>
          {/* Logo Neo-One */}
          <div className="relative z-10 w-[14vw] h-[5vw] mb-8">
            <div 
              className="w-full h-full bg-[#768b1a]" 
              style={{ WebkitMaskImage: 'url(/images/ui/logo-neo-bianco.webp)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} 
            />
          </div>
          {/* Btn Prev */}
          <div className="relative z-10">
            {prevNid ? (
              <motion.button
                className="pointer-events-auto cursor-pointer focus:outline-none w-[5vw] h-[5vw] min-w-[50px] min-h-[50px] bg-[#d99f9f] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors"
                onClick={() => router.replace(`/artwork/${prevNid}`)}
                onMouseEnter={() => setPrevHovered(true)}
                onMouseLeave={() => setPrevHovered(false)}
                whileHover={{ scale: 1.15, backgroundColor: '#768b1a' }}
                whileTap={{ scale: 0.9 }}
              >
                <img src={prevHovered ? '/images/ui/direction-arrow-green.webp' : '/images/ui/direction-arrow-pink.webp'} className="w-[50%] object-contain rotate-180" draggable={false} />
              </motion.button>
            ) : (
               <div className="w-[5vw] h-[5vw] min-w-[50px] min-h-[50px] opacity-0" />
            )}
          </div>
        </div>

        {/* 2. CENTER ARTWORK */}
        <div className="relative flex-[0_0_46vw] bg-black rounded-lg p-2 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5">
          <img src={image} alt={`Opera ${nid}`} className="max-w-full max-h-full object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
        </div>

        {/* 3. RIGHT PANEL */}
        <div className="relative w-[22vw] bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center pointer-events-none">
          {/* Zebra BG */}
          <div className="absolute inset-0">
             <img src="/images/ui/pink-zebra-bg.webp" alt="bg" className="w-[120%] h-full object-cover translate-x-[10%]" />
             <div className="absolute inset-0 bg-black/10" />
          </div>
          {/* Logo Neo-One */}
          <div className="relative z-10 w-[14vw] h-[5vw] mb-8">
            <div 
              className="w-full h-full bg-[#768b1a]" 
              style={{ WebkitMaskImage: 'url(/images/ui/logo-neo-bianco-2.webp)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} 
            />
          </div>
          {/* Btn Next */}
          <div className="relative z-10">
            {nextNid ? (
              <motion.button
                className="pointer-events-auto cursor-pointer focus:outline-none w-[5vw] h-[5vw] min-w-[50px] min-h-[50px] bg-[#d99f9f] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors"
                onClick={() => router.replace(`/artwork/${nextNid}`)}
                onMouseEnter={() => setNextHovered(true)}
                onMouseLeave={() => setNextHovered(false)}
                whileHover={{ scale: 1.15, backgroundColor: '#768b1a' }}
                whileTap={{ scale: 0.9 }}
              >
                <img src={nextHovered ? '/images/ui/direction-arrow-green.webp' : '/images/ui/direction-arrow-pink.webp'} className="w-[50%] object-contain" draggable={false} />
              </motion.button>
            ) : (
               <div className="w-[5vw] h-[5vw] min-w-[50px] min-h-[50px] opacity-0" />
            )}
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR (Sotto la card e allineata) ── */}
      <div className="w-[90vw] mt-4 z-30 bg-black/80 rounded-lg border border-white/5 py-4 px-8 flex flex-row items-center justify-between shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        
        {/* Metadati */}
        <div className="flex flex-col flex-1 pl-4">
          <span className="font-neo text-[#F45390] text-[11px] lg:text-sm tracking-[0.2em] mb-1">art details</span>
          <p className="font-neo text-white text-[10px] lg:text-xs tracking-widest uppercase truncate max-w-full">
            {method} / {support}
          </p>
          <p className="font-neo text-white/50 text-[9px] lg:text-[10px] tracking-widest uppercase">
            {dimensions} — {year}
          </p>
        </div>

        {/* Pulsante PRE-ORDER centrale */}
        <div className="flex-[0_0_20vw] flex flex-col items-center justify-center">
             <motion.button
              onClick={handlePurchase}
              onMouseEnter={() => setPurchaseHovered(true)}
              onMouseLeave={() => setPurchaseHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative outline-none flex justify-center"
            >
               <img 
                 src={purchaseHovered || addedToCart ? '/images/ui/pre-orderverde.webp' : '/images/ui/pre-orderrosa.webp'}
                 alt="Purchase"
                 className="h-[45px] lg:h-[55px] object-contain drop-shadow-[0_0_15px_rgba(244,83,144,0.3)] transition-all duration-300" 
               />
            </motion.button>
        </div>

        {/* Status & Controlli */}
        <div className="flex flex-1 flex-row items-center justify-end gap-6 pr-4">
           <div className="flex flex-col text-right">
              <span className="font-neo text-[#F45390] text-[11px] lg:text-sm tracking-[0.2em] mb-1">status</span>
              <p className="font-neo text-white text-[10px] lg:text-xs tracking-widest uppercase">
                {isAvailable ? 'ACQUISTABILE' : 'ARCHIVIO PRIVATO'}
              </p>
              <p className="font-neo text-white/50 text-[9px] lg:text-[10px] tracking-widest uppercase">
                {priceInfo}
              </p>
           </div>
           
           {/* Carrello */}
           <motion.button
              onMouseEnter={() => setCartHovered(true)}
              onMouseLeave={() => setCartHovered(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-[45px] h-[45px] lg:w-[50px] lg:h-[50px] flex-shrink-0 bg-[#d99f9f] rounded-full flex outline-none border border-[#d99f9f] hover:border-[#768b1a] overflow-hidden justify-center items-center cursor-pointer shadow-[0_0_10px_rgba(0,0,0,1)]"
            >
              <img src="/images/ui/carrello.webp" className="w-[60%] h-[60%] object-contain" />
              {count > 0 && (
                <span className="absolute inset-0 bg-transparent flex items-center justify-center font-neo text-xl text-[#768b1a] font-bold drop-shadow-[0_0_5px_black] group-hover:text-black z-20">
                  {count}
                </span>
              )}
           </motion.button>
           
           {/* Esc - Chiudi Detail, torna al Subcluster */}
           <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#F45390' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              className="w-[45px] h-[45px] lg:w-[50px] lg:h-[50px] flex-shrink-0 bg-[#d99f9f] rounded-full flex items-center justify-center outline-none border border-[#d99f9f] shadow-[0_0_10px_rgba(0,0,0,1)] z-20"
              title="Torna alla Gallery"
            >
               <img src="/images/ui/esccc.webp" className="w-[60%] h-[60%] object-contain opacity-80" />
           </motion.button>
        </div>
      </div>
    </div>
  )
}
