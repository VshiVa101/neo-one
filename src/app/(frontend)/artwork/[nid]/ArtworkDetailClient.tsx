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
    <>
      {/* ── LEFT PANEL: Zebra + Logo + Prev ── */}
      <div className="absolute left-0 top-0 w-[30vw] h-[100vh] z-20 flex flex-col items-center justify-center gap-12 pointer-events-none">
        
        {/* Zebra Background Strip */}
        <div className="absolute inset-0 pointer-events-none -translate-x-[20%]">
           <img src="/images/ui/pink-zebra-bg.webp" alt="bg" className="w-[120%] h-full object-cover" />
        </div>

        {/* Logo Neo-One (Masked Green) */}
        <div className="relative z-10 w-[18vw] h-[6vw]">
          <div 
            className="w-full h-full bg-[#768b1a]" 
            style={{ 
              WebkitMaskImage: 'url(/images/ui/logo-neo-bianco.webp)', 
              WebkitMaskSize: 'contain', 
              WebkitMaskRepeat: 'no-repeat', 
              WebkitMaskPosition: 'center' 
            }} 
          />
        </div>

        {/* Freccia PREV in cerchio rosa */}
        {prevNid && (
          <motion.button
            className="relative z-10 pointer-events-auto cursor-pointer focus:outline-none w-[6vw] h-[6vw] min-w-[60px] min-h-[60px] max-w-[80px] max-h-[80px] bg-[#d99f9f] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            onClick={() => router.push(`/artwork/${prevNid}`)}
            onMouseEnter={() => setPrevHovered(true)}
            onMouseLeave={() => setPrevHovered(false)}
            whileHover={{ scale: 1.15, backgroundColor: '#768b1a' }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src={prevHovered ? '/images/ui/direction-arrow-green.webp' : '/images/ui/direction-arrow-pink.webp'}
              alt="Opera precedente"
              className="w-[50%] object-contain rotate-180"
              draggable={false}
            />
          </motion.button>
        )}
      </div>

      {/* ── RIGHT PANEL: Zebra + Logo + Next ── */}
      <div className="absolute right-0 top-0 w-[30vw] h-[100vh] z-20 flex flex-col items-center justify-center gap-12 pointer-events-none">
        
        <div className="absolute inset-0 pointer-events-none translate-x-[20%]">
           <img src="/images/ui/pink-zebra-bg.webp" alt="bg" className="w-[120%] h-full object-cover" />
           <div className="absolute inset-0 bg-black/20" /> {/* Slight dark layer per profondità */}
        </div>

        {/* Logo Neo-One (Masked Green offset) */}
        <div className="relative z-10 w-[18vw] h-[6vw]">
          <div 
            className="w-full h-full bg-[#768b1a]" 
            style={{ 
              WebkitMaskImage: 'url(/images/ui/logo-neo-bianco-2.webp)', 
              WebkitMaskSize: 'contain', 
              WebkitMaskRepeat: 'no-repeat', 
              WebkitMaskPosition: 'center' 
            }} 
          />
        </div>

        {/* Freccia NEXT */}
        {nextNid && (
          <motion.button
            className="relative z-10 pointer-events-auto cursor-pointer focus:outline-none w-[6vw] h-[6vw] min-w-[60px] min-h-[60px] max-w-[80px] max-h-[80px] bg-[#d99f9f] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            onClick={() => router.push(`/artwork/${nextNid}`)}
            onMouseEnter={() => setNextHovered(true)}
            onMouseLeave={() => setNextHovered(false)}
            whileHover={{ scale: 1.15, backgroundColor: '#768b1a' }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src={nextHovered ? '/images/ui/direction-arrow-green.webp' : '/images/ui/direction-arrow-pink.webp'}
              alt="Opera successiva"
              className="w-[50%] object-contain"
              draggable={false}
            />
          </motion.button>
        )}
      </div>

      {/* ── BOTTOM BAR (Sopra zebre) ── */}
      <div className="fixed bottom-0 left-0 w-full z-[100] bg-black/90 pointer-events-auto border-t border-white/5 py-4 px-12 flex flex-row items-center justify-between">
        
        {/* SINISTRA: Metadati */}
        <div className="flex flex-col flex-1">
          <span className="font-neo text-[#F45390] text-sm tracking-[0.2em] mb-1">art details</span>
          <p className="font-neo text-white text-xs tracking-widest uppercase">
            {method} / {support}
          </p>
          <p className="font-neo text-white/50 text-[10px] tracking-widest uppercase">
            {dimensions} — {year}
          </p>
        </div>

        {/* CENTRO: PRE-ORDER BUTTON (Forma ellittica con icona) */}
        <div className="flex-1 flex flex-col items-center justify-center">
             <motion.button
              onClick={handlePurchase}
              onMouseEnter={() => setPurchaseHovered(true)}
              onMouseLeave={() => setPurchaseHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative outline-none"
            >
               <img 
                 src={purchaseHovered || addedToCart ? '/images/ui/pre-orderverde.webp' : '/images/ui/pre-orderrosa.webp'}
                 alt="Purchase"
                 className="h-[60px] object-contain drop-shadow-[0_0_15px_rgba(244,83,144,0.3)] transition-all duration-300" 
               />
            </motion.button>
        </div>

        {/* DESTRA: Status & Controls */}
        <div className="flex flex-1 flex-row items-center justify-end gap-8">
           <div className="flex flex-col text-right">
              <span className="font-neo text-[#F45390] text-sm tracking-[0.2em] mb-1">status</span>
              <p className="font-neo text-white text-xs tracking-widest uppercase">
                {isAvailable ? 'ACQUISTABILE' : 'ARCHIVIO PRIVATO'}
              </p>
              <p className="font-neo text-white/50 text-[10px] tracking-widest uppercase">
                {priceInfo}
              </p>
           </div>
           
           {/* Carrello */}
           <motion.button
              onMouseEnter={() => setCartHovered(true)}
              onMouseLeave={() => setCartHovered(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-[50px] h-[50px] bg-[#d99f9f] rounded-full flex outline-none border border-[#d99f9f] hover:border-[#768b1a] overflow-hidden justify-center items-center cursor-pointer shadow-[0_0_10px_rgba(0,0,0,1)]"
            >
              <img src="/images/ui/carrello.webp" className="w-[60%] h-[60%] object-contain" />
              {count > 0 && (
                <span className="absolute inset-0 bg-transparent flex items-center justify-center font-neo text-xl text-[#768b1a] font-bold drop-shadow-[0_0_5px_black] group-hover:text-black z-20">
                  {count}
                </span>
              )}
           </motion.button>
           
           {/* Esc - Go Back (Ora dentro cerchio e rimosso hover verde se non supportato) */}
           <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#F45390' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              className="w-[50px] h-[50px] bg-[#d99f9f] rounded-full flex items-center justify-center outline-none border border-[#d99f9f] shadow-[0_0_10px_rgba(0,0,0,1)] z-20"
            >
               <img src="/images/ui/esccc.webp" className="w-[60%] h-[60%] object-contain opacity-80" />
           </motion.button>
        </div>
      </div>
    </>
  )
}
