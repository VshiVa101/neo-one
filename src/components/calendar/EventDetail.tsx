'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { NeoEvent } from '@/data/calendar-mock'
import { EyeScene } from '@/components/EyeScene'
import { BrandedTitle } from '@/components/BrandedTitle'
import { useCart } from '@/contexts/CartContext'

interface EventDetailProps {
  event: NeoEvent
  quote?: string
  onClose: () => void
}

export function EventDetail({ event, quote, onClose }: EventDetailProps) {
  const { addToCart, count, setIsCartOpen } = useCart()
  const [purchaseHovered, setPurchaseHovered] = useState(false)
  const [cartHovered, setCartHovered] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handlePurchase = () => {
    addToCart({
      nid: event.id,
      title: event.details.headline,
      image: event.thumbnail,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/calendar?event=${event.id}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 1500)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full h-full bg-[#1a1a1a] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.1, opacity: 0, y: -50 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: "url('/images/textures/detail-bg.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Top Eye — natural size, overlapping card edge */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-[700] pointer-events-none">
          <div className="w-[15vh] h-[15vh] md:w-[22vh] md:h-[22vh]">
             <EyeScene 
                targetRoute="#" 
                showCircularText={false} 
                globalTracking={true} 
                scaleMultiplier={1.4}
             />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative flex-1 flex flex-col overflow-y-auto scrollbar-hide p-8 md:p-12 pt-28 md:pt-36">
          
          {/* CTA — top-aligned centered on card */}
          <motion.div 
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="text-white font-neo text-2xl md:text-4xl tracking-widest lowercase text-center leading-relaxed">
              <BrandedTitle text={event.details.comicBubble || quote || ''} />
            </div>
          </motion.div>
          
          {/* Image Row: Primary always visible, Secondary to the right on desktop */}
          <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-10 mb-8 md:mb-12">
            
            {/* Primary Image */}
            <motion.div 
              className="relative flex-1 min-w-0 md:basis-7/12 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative w-full aspect-square max-w-[500px] group">
                <div className="absolute inset-0 bg-[#fc5896] rotate-3 scale-105 opacity-20 blur-sm group-hover:rotate-6 transition-transform duration-500" />
                <Image
                  src={event.thumbnail}
                  alt={event.details.headline}
                  fill
                  className="object-cover z-10 border-4 border-black/50"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
              </div>
            </motion.div>

            {/* Secondary Image (right on desktop, below on mobile) */}
            {event.details.images[1] && (
              <motion.div 
                className="relative flex-1 min-w-0 md:basis-5/12 flex items-center justify-center"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="relative w-full aspect-square max-w-[400px] rotate-6 shadow-2xl">
                  <Image
                    src={event.details.images[1]}
                    alt="detail"
                    fill
                    className="object-cover border-8 border-white"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Headline */}
          <motion.h3
            className="font-neo text-white text-[9px] md:text-[10px] tracking-[0.3em] lowercase mb-8 md:mb-12 text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <BrandedTitle text={event.details.headline} />
          </motion.h3>

          {/* Event Description */}
          <motion.div 
            className="relative z-10 self-center px-12 py-10 md:px-28 md:py-14 max-w-4xl w-full text-center mb-20 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              backgroundImage: "url('/images/ui/bbjdhsgfshdjyg.png')",
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="font-neo text-black text-sm md:text-base leading-relaxed lowercase">
              <BrandedTitle text={event.details.description} disableColor={true} />
            </div>
          </motion.div>

        </div>

        {/* Bottom Buttons — ESC + Purchase centered at bottom of card */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
          {/* ESC Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#F45390' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#B3828B] rounded-full cursor-pointer transition-colors duration-300"
          >
            <Image src="/images/ui/esccc.webp" alt="ESC" width={64} height={64} className="w-[62%] h-[62%] object-contain" style={{ transform: 'scale(1.5)' }} unoptimized />
          </motion.button>

          {/* Copy Link Button */}
          <motion.button
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopyLink}
            className="neo-interface-btn relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#B3828B] rounded-full cursor-pointer transition-colors duration-300"
            style={{ backgroundColor: linkCopied ? '#809829' : linkHovered ? '#F45390' : '#B3828B' }}
          >
            <Image
              src={linkHovered || linkCopied ? '/images/ui/condividiverde.webp' : '/images/ui/condivcidi.webp'}
              alt="Copia link"
              width={64}
              height={64}
              className="w-[62%] h-[62%] object-contain"
              style={{ transform: 'scale(1.5)' }}
              unoptimized
            />
            {linkCopied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-neo text-[8px] md:text-[10px] text-[#809829] tracking-widest lowercase">
                link copiato
              </span>
            )}
          </motion.button>

          {/* Purchase / Pre-Order Button */}
          <motion.button
            onClick={handlePurchase}
            onMouseEnter={() => setPurchaseHovered(true)}
            onMouseLeave={() => setPurchaseHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#B3828B] rounded-full cursor-pointer transition-colors duration-300"
            style={{ backgroundColor: addedToCart ? '#809829' : purchaseHovered ? '#F45390' : '#B3828B' }}
          >
            <Image src="/images/ui/euros.webp" alt="Acquista" width={64} height={64} className="w-[72%] h-[72%] object-contain transition-all duration-300" style={{ transform: 'scale(1.5)' }} unoptimized />
          </motion.button>

          {/* Cart Button */}
          <motion.button
            onMouseEnter={() => setCartHovered(true)}
            onMouseLeave={() => setCartHovered(false)}
            whileHover={{ scale: 1.1, backgroundColor: '#F45390' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCartOpen(true)}
            className="neo-interface-btn relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#B3828B] rounded-full cursor-pointer transition-colors duration-300"
          >
            <Image
              src={
                cartHovered
                  ? '/images/drops/carrellorosa_optimized.webp'
                  : count > 0
                    ? '/images/ui/carrelloverde.webp'
                    : '/images/ui/carrello.webp'
              }
              alt="Carrello"
              width={64}
              height={64}
              className="w-[62%] h-[62%] object-contain relative z-10"
              style={{ transform: 'scale(1.5)' }}
              unoptimized
            />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-[#809829] rounded-full font-neo text-[8px] md:text-[10px] text-black font-bold border border-black shadow-[0_0_5px_rgba(128,152,41,0.8)]">
                {count}
              </span>
            )}
          </motion.button>
        </div>
        
        {/* Overlay subtle grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('/images/textures/grain.png')]" />
      </motion.div>
    </motion.div>
  )
}
