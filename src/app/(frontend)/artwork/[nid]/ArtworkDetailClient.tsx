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
      {/* ── LEFT PANEL: Logo + Freccia Prev ── */}
      <div className="fixed left-0 top-0 w-[22vw] h-full flex flex-col items-center justify-center gap-8 z-20 pointer-events-none">
        {/* Logo Neo-One (ripetuto verticalmente per riempire) */}
        <div className="flex flex-col items-center gap-6 opacity-60 select-none">
          <img src="/images/ui/logo-neo-bianco.webp" alt="Neo-One" className="w-[14vw] object-contain" draggable={false} />
          <img src="/images/ui/logo-neo-bianco-2.webp" alt="Neo-One" className="w-[14vw] object-contain" draggable={false} />
          <img src="/images/ui/logo-neo-bianco.webp" alt="Neo-One" className="w-[14vw] object-contain opacity-40" draggable={false} />
        </div>

        {/* Freccia PREV */}
        {prevNid && (
          <motion.button
            className="pointer-events-auto cursor-pointer focus:outline-none"
            style={{ transform: 'rotate(180deg)' }}
            onClick={() => router.push(`/artwork/${prevNid}`)}
            onMouseEnter={() => setPrevHovered(true)}
            onMouseLeave={() => setPrevHovered(false)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src={prevHovered ? '/images/ui/direction-arrow-green.webp' : '/images/ui/direction-arrow-pink.webp'}
              alt="Opera precedente"
              className="w-[5vw] object-contain transition-all duration-200"
              draggable={false}
            />
          </motion.button>
        )}
      </div>

      {/* ── RIGHT PANEL: Logo + Freccia Next ── */}
      <div className="fixed right-0 top-0 w-[22vw] h-full flex flex-col items-center justify-center gap-8 z-20 pointer-events-none">
        <div className="flex flex-col items-center gap-6 opacity-60 select-none">
          <img src="/images/ui/logo-neo-bianco-2.webp" alt="Neo-One" className="w-[14vw] object-contain" draggable={false} />
          <img src="/images/ui/logo-neo-bianco.webp" alt="Neo-One" className="w-[14vw] object-contain" draggable={false} />
          <img src="/images/ui/logo-neo-bianco-2.webp" alt="Neo-One" className="w-[14vw] object-contain opacity-40" draggable={false} />
        </div>

        {/* Freccia NEXT */}
        {nextNid && (
          <motion.button
            className="pointer-events-auto cursor-pointer focus:outline-none"
            onClick={() => router.push(`/artwork/${nextNid}`)}
            onMouseEnter={() => setNextHovered(true)}
            onMouseLeave={() => setNextHovered(false)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src={nextHovered ? '/images/ui/direction-arrow-green.webp' : '/images/ui/direction-arrow-pink.webp'}
              alt="Opera successiva"
              className="w-[5vw] object-contain transition-all duration-200"
              draggable={false}
            />
          </motion.button>
        )}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="fixed bottom-0 left-0 w-full z-30 bg-black/70 backdrop-blur-lg border-t border-white/10 px-[4vw] py-4 flex items-center justify-between gap-4">

        {/* SINISTRA: Art Details */}
        <div className="w-[30%] flex flex-col gap-1">
          <span className="font-neo text-[#F45390] text-[10px] tracking-[0.4em] uppercase mb-1">art details</span>
          <p className="font-neo text-white/80 text-[11px] tracking-widest uppercase leading-relaxed">
            {method} / {support}
          </p>
          <p className="font-neo text-white/50 text-[10px] tracking-widest uppercase">
            {dimensions} — {year}
          </p>
        </div>

        {/* CENTRO: Bottone PRE-ORDER */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            onClick={handlePurchase}
            onMouseEnter={() => setPurchaseHovered(true)}
            onMouseLeave={() => setPurchaseHovered(false)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className="focus:outline-none cursor-pointer"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={addedToCart ? 'verde' : (purchaseHovered ? 'verde-hover' : 'rosa')}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                src={purchaseHovered || addedToCart ? '/images/ui/pre-orderverde.webp' : '/images/ui/pre-orderrosa.webp'}
                alt="Pre-Order / Purchase"
                className="h-[60px] object-contain"
                draggable={false}
              />
            </AnimatePresence>
          </motion.button>
          {addedToCart && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-neo text-[#768b1a] text-[9px] tracking-widest uppercase"
            >
              Aggiunto al carrello
            </motion.p>
          )}
        </div>

        {/* DESTRA: Status + Price + Icone */}
        <div className="w-[30%] flex items-center justify-end gap-6">
          <div className="flex flex-col gap-1 text-right">
            <span className="font-neo text-[#768b1a] text-[10px] tracking-[0.3em] uppercase">status</span>
            <p className="font-neo text-white text-[11px] tracking-widest uppercase">
              {isAvailable ? 'ACQUISTABILE' : 'ARCHIVIO PRIVATO'}
            </p>
            <p className="font-neo text-white/60 text-[10px] tracking-widest uppercase">{priceInfo}</p>
          </div>

          {/* Icona Discard */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer focus:outline-none"
            title="Non disponibile"
          >
            <img src="/images/ui/esccc.webp" alt="Non disponibile" className="h-[48px] object-contain" draggable={false} />
          </motion.button>

          {/* Icona Carrello con Contatore */}
          <motion.button
            onMouseEnter={() => setCartHovered(true)}
            onMouseLeave={() => setCartHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer focus:outline-none relative"
            title="Carrello"
          >
            <img
              src={cartHovered ? '/images/ui/carrelloverde.webp' : '/images/ui/carrello.webp'}
              alt="Carrello"
              className="h-[48px] object-contain transition-all duration-200"
              draggable={false}
            />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#768b1a] text-black font-bold text-[10px] flex items-center justify-center shadow-[0_0_8px_#768b1a]"
              >
                {count}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </>
  )
}
