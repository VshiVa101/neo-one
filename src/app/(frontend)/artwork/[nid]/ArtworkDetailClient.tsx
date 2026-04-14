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

  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)

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

  // Wheel handler per Zoom In/Out
  const handleWheel = (e: React.WheelEvent) => {
    if (isZoomOpen) {
      const delta = e.deltaY * -0.005
      setZoomScale((prev) => Math.min(Math.max(1, prev + delta), 5)) // clamp tra 1x e 5x
    }
  }

  // Prevenire scroll del body quando zoom è attivo
  React.useEffect(() => {
    if (isZoomOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setZoomScale(1) // Reset zoom on close
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isZoomOpen])

  return (
    <>
      {/* ── MODALE OVERLAY ZOOM A SCHERMO INTERO ── */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden touch-none"
            onClick={() => setIsZoomOpen(false)}
            onWheel={handleWheel}
          >
             <motion.img 
                src={image} 
                alt={`Zoom Opera ${nid}`} 
                drag
                dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
                dragElastic={0.1}
                dragMomentum={false}
                style={{ scale: zoomScale }}
                className="max-w-[95vw] max-h-[95vh] object-contain transition-transform duration-75 ease-linear pointer-events-auto"
                onClick={(e) => e.stopPropagation()} 
             />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col w-full h-full max-w-[100vw] lg:max-w-[95vw] mx-auto justify-center items-center pb-2 relative z-20 px-2 lg:px-0">
        
        {/* ── MIDDLE ROW (Le 3 colonne su Desktop, Solo Centro su Mobile) ── */}
        <div className="flex flex-row items-stretch justify-center w-full h-[55vh] md:h-[60vh] lg:h-[65vh] gap-[2vw]">
          
          {/* 1. LEFT PANEL (Nascosta su Mobile) */}
          <div className="relative hidden lg:flex w-[22vw] bg-black rounded-lg overflow-hidden flex-col items-center justify-center pointer-events-none">
            {/* Zebra BG */}
            <div className="absolute inset-0">
               <img src="/images/ui/pink-zebra-bg.webp" alt="bg" className="w-[120%] h-full object-cover -translate-x-[10%]" />
            </div>
            {/* Logo Neo-One */}
            <div className="relative z-10 w-[90%] aspect-[3/1] mb-12 flex items-center justify-center">
              <div 
                className="w-full h-full bg-[#768b1a] drop-shadow-[0_0_20px_rgba(118,139,26,0.8)]" 
                style={{ WebkitMaskImage: 'url(/images/ui/logo-neo-bianco.webp)', WebkitMaskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} 
              />
            </div>
            {/* Btn Prev */}
            <div className="relative z-10 w-full flex justify-center mt-8">
              {prevNid ? (
                <motion.button
                  className="pointer-events-auto cursor-pointer focus:outline-none w-[7vw] h-[7vw] min-w-[70px] min-h-[70px] bg-[#d99f9f] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors"
                  onClick={() => router.replace(`/artwork/${prevNid}`)}
                  onMouseEnter={() => setPrevHovered(true)}
                  onMouseLeave={() => setPrevHovered(false)}
                  whileHover={{ scale: 1.15, backgroundColor: '#768b1a' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img src={prevHovered ? '/images/ui/direction-arrow-green.webp' : '/images/ui/direction-arrow-pink.webp'} className="w-[50%] object-contain rotate-180" draggable={false} />
                </motion.button>
              ) : (
                 <div className="w-[7vw] h-[7vw] min-w-[70px] min-h-[70px] opacity-0" />
              )}
            </div>
          </div>

          {/* 2. CENTER ARTWORK (A tutto schermo senza crop) */}
          <div 
            className="relative flex-1 bg-black rounded-lg p-1 lg:p-3 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden group cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          >
            <img 
               src={image} 
               alt={`Opera ${nid}`} 
               className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform duration-700 lg:group-hover:scale-[1.02]" 
            />
          </div>

          {/* 3. RIGHT PANEL (Nascosta su Mobile) */}
          <div className="relative hidden lg:flex w-[22vw] bg-black rounded-lg overflow-hidden flex-col items-center justify-center pointer-events-none">
            {/* Zebra BG */}
            <div className="absolute inset-0">
               <img src="/images/ui/pink-zebra-bg.webp" alt="bg" className="w-[120%] h-full object-cover translate-x-[10%]" />
               <div className="absolute inset-0 bg-black/10" />
            </div>
            {/* Logo Neo-One */}
            <div className="relative z-10 w-[90%] aspect-[3/1] mb-12 flex items-center justify-center">
              <div 
                className="w-full h-full bg-[#768b1a] drop-shadow-[0_0_20px_rgba(118,139,26,0.8)]" 
                style={{ WebkitMaskImage: 'url(/images/ui/logo-neo-bianco-2.webp)', WebkitMaskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} 
              />
            </div>
            {/* Btn Next */}
            <div className="relative z-10 w-full flex justify-center mt-8">
              {nextNid ? (
                <motion.button
                  className="pointer-events-auto cursor-pointer focus:outline-none w-[7vw] h-[7vw] min-w-[70px] min-h-[70px] bg-[#d99f9f] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors"
                  onClick={() => router.replace(`/artwork/${nextNid}`)}
                  onMouseEnter={() => setNextHovered(true)}
                  onMouseLeave={() => setNextHovered(false)}
                  whileHover={{ scale: 1.15, backgroundColor: '#768b1a' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img src={nextHovered ? '/images/ui/direction-arrow-green.webp' : '/images/ui/direction-arrow-pink.webp'} className="w-[50%] object-contain" draggable={false} />
                </motion.button>
              ) : (
                 <div className="w-[7vw] h-[7vw] min-w-[70px] min-h-[70px] opacity-0" />
              )}
            </div>
          </div>
        </div>
        {/* ── BOTTOM BAR STRUTTURALE (Responsive) ── */}
        <div className="w-full lg:w-[90vw] mt-2 lg:mt-6 pb-4 lg:pb-0 z-30 bg-transparent lg:bg-black/80 rounded-lg lg:border border-transparent lg:border-white/5 lg:py-3 lg:px-6 flex flex-col lg:flex-row items-center justify-between lg:shadow-[0_0_20px_rgba(0,0,0,0.8)] gap-2 lg:gap-0">
          
          {/* Riga Testuale Mobile (Nascosta in Desktop) */}
          <div className="w-full flex lg:hidden justify-between px-2">
            <div className="flex flex-col text-left">
              <h2 className="font-neo text-[#F45390] text-xl tracking-[0.2em] mb-1">art details</h2>
              <p className="font-neo text-white text-[9px] tracking-widest uppercase truncate max-w-[45vw]">{method} / {support}</p>
              <p className="font-neo text-white/50 text-[8px] tracking-widest uppercase truncate max-w-[45vw]">{dimensions} — {year}</p>
            </div>
            <div className="flex flex-col text-right">
              <h2 className="font-neo text-[#F45390] text-xl tracking-[0.2em] mb-1">status</h2>
              <p className="font-neo text-white text-[9px] tracking-widest uppercase">{isAvailable ? 'ACQUISTABILE' : 'ARCHIVIO'}</p>
              <p className="font-neo text-white/50 text-[8px] tracking-widest uppercase">{priceInfo}</p>
            </div>
          </div>

          {/* Colonna Sinistra / Metadati (Solo Desktop) */}
          <div className="hidden lg:flex flex-col flex-1 pl-4">
            <h2 className="font-neo text-[#F45390] text-3xl lg:text-4xl tracking-[0.2em] mb-2 uppercase">art details</h2>
            <p className="font-neo text-white text-base tracking-widest uppercase">{method} / {support}</p>
            <p className="font-neo text-white/50 text-sm tracking-widest uppercase">{dimensions} — {year}</p>
          </div>

          {/* ── SEZIONE TASTI CENTRALE / MOBILE-ROW ── */}
          <div className="w-full lg:w-auto flex flex-row items-center justify-between lg:justify-center px-4 lg:px-0 gap-6">
            {/* Tasto Back - Esc */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#F45390' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              className="w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] flex-shrink-0 bg-[#d99f9f] rounded-full flex items-center justify-center outline-none border border-[#d99f9f] shadow-[0_0_10px_rgba(0,0,0,1)] z-20"
              title="Torna alla Gallery"
            >
               <img src="/images/ui/esccc.webp" className="w-[55%] h-[55%] object-contain opacity-80" />
            </motion.button>

            {/* Pulsante PRE-ORDER LOGO */}
            <motion.button
              onClick={handlePurchase}
              onMouseEnter={() => setPurchaseHovered(true)}
              onMouseLeave={() => setPurchaseHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative outline-none flex justify-center py-1 lg:py-2 flex-[0_0_40%] lg:flex-[0_0_30vw]"
            >
               <img 
                 src={purchaseHovered || addedToCart ? '/images/ui/pre-orderverde.webp' : '/images/ui/pre-orderrosa.webp'}
                 alt="Purchase"
                 className="h-[45px] lg:h-[120px] w-auto max-w-full object-contain drop-shadow-[0_0_15px_rgba(244,83,144,0.4)] transition-all duration-300" 
               />
            </motion.button>

            {/* Carrello */}
            <motion.button
              onMouseEnter={() => setCartHovered(true)}
              onMouseLeave={() => setCartHovered(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePurchase} 
              className="relative w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] flex-shrink-0 bg-[#d99f9f] rounded-full flex outline-none border border-[#d99f9f] hover:border-[#768b1a] justify-center items-center cursor-pointer shadow-[0_0_10px_rgba(0,0,0,1)]"
            >
              <img src="/images/ui/carrello.webp" className="w-[50%] h-[50%] object-contain relative z-10" />
              {/* Contatore ESTERNO */}
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-[22px] h-[22px] lg:w-[24px] lg:h-[24px] flex items-center justify-center bg-[#768b1a] rounded-full font-neo text-[10px] lg:text-sm text-black font-bold border lg:border-2 border-black z-20 shadow-[0_0_5px_rgba(118,139,26,0.8)]">
                  {count}
                </span>
              )}
            </motion.button>
          </div>

          {/* Colonna Destra / Actions (Solo Desktop) */}
          <div className="hidden lg:flex flex-col flex-1 text-right pr-4">
             <h2 className="font-neo text-[#F45390] text-3xl lg:text-4xl tracking-[0.2em] mb-2 uppercase">status</h2>
             <p className="font-neo text-white text-base tracking-widest uppercase">{isAvailable ? 'ACQUISTABILE' : 'ARCHIVIO'}</p>
             <p className="font-neo text-white/50 text-sm tracking-widest uppercase">{priceInfo}</p>
          </div>
        </div>
      </div>
    </>
  )
}
