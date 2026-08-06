'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import Image from 'next/image'
import type { NeoEvent } from '@/data/calendar-mock'
import { EyeScene } from '@/components/EyeScene'
import { BrandedTitle } from '@/components/BrandedTitle'

interface EventDetailProps {
  event: NeoEvent
  quote?: string
  onClose: () => void
}

export function EventDetail({ event, quote, onClose }: EventDetailProps) {
  const [linkHovered, setLinkHovered] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string>('')
  const scale = useMotionValue(1)

  // ── Pinch-to-zoom refs ──
  const pinchStartDist = useRef<number | null>(null)
  const pinchStartScale = useRef<number>(1)

  // ── Double-tap detection ──
  const lastTapTime = useRef<number>(0)

  const getFingerDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleZoomTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      pinchStartDist.current = getFingerDistance(e.touches)
      pinchStartScale.current = scale.get()
    }
  }, [])

  const handleZoomTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current !== null) {
      e.preventDefault()
      const currentDist = getFingerDistance(e.touches)
      const ratio = currentDist / pinchStartDist.current
      scale.set(Math.min(Math.max(1, pinchStartScale.current * ratio), 5))
    }
  }, [])

  const handleZoomTouchEnd = useCallback(() => {
    pinchStartDist.current = null
  }, [])

  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) return
    const now = Date.now()
    const timeDelta = now - lastTapTime.current
    lastTapTime.current = now
    if (timeDelta < 300 && timeDelta > 0) {
      e.preventDefault()
      const currentScale = scale.get()
      animate(scale, currentScale > 1 ? 1 : 2.5, { duration: 0.3 })
    }
  }, [])

  const handleWheel = (e: React.WheelEvent) => {
    if (isZoomOpen) {
      const currentScale = scale.get()
      const delta = e.deltaY * -0.005
      scale.set(Math.min(Math.max(1, currentScale + delta), 5))
    }
  }

  // Blocca lo scroll del body per tutta la durata dell'EventDetail
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Quando lo zoom si chiude, resetta anche la scala
  useEffect(() => {
    if (!isZoomOpen) {
      scale.set(1)
    }
  }, [isZoomOpen, scale])

  // ESC Key listener
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomOpen) {
          e.stopPropagation()
          setIsZoomOpen(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isZoomOpen, onClose])



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
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full h-full bg-[#1a1a1a] flex flex-col md:grid md:grid-cols-7 overflow-hidden"
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

        {/* Column 1: Leftmost lateral column (ESC Button at bottom) */}
        <div className="absolute bottom-6 left-6 md:relative md:bottom-auto md:left-auto md:col-span-1 flex md:items-end justify-center pb-0 md:pb-12 z-50">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#FF5696' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#E295A4] rounded-full cursor-pointer transition-colors duration-300"
          >
            <Image src="/images/ui/esccc.webp" alt="ESC" width={64} height={64} className="w-[62%] h-[62%] object-contain" style={{ transform: 'scale(1.5)' }} unoptimized />
          </motion.button>
        </div>

        {/* Main Content Area (Columns 2-6) */}
        <div 
          className="relative w-full md:col-span-5 h-full flex flex-col overflow-y-auto scrollbar-hide p-6 md:p-12 pt-28 md:pt-36 bg-transparent"
        >
          
          {/* CTA — top-aligned centered on card */}
          <motion.div 
            className="flex flex-col items-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="text-white font-neo text-base md:text-[27px] tracking-wide uppercase text-center leading-relaxed px-4">
              <BrandedTitle text={event.details.comicBubble || quote || ''} />
            </div>
          </motion.div>
          
          {/* Image Row: Primary always visible, Secondary to the right on desktop */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-8 md:mb-12 items-center justify-center">
            
            {/* Primary Image */}
            <motion.div 
              className="relative w-full max-w-[360px] md:max-w-none md:flex-1 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div 
                className="relative w-full max-w-[500px] group flex justify-center items-center cursor-zoom-in"
                onClick={() => {
                  setZoomedImage(event.thumbnail)
                  setIsZoomOpen(true)
                }}
              >
                <div className="absolute inset-0 bg-[#A2D729] rotate-3 scale-105 opacity-20 blur-sm pointer-events-none" />
                <Image
                  src={event.thumbnail}
                  alt={event.details.headline}
                  width={500}
                  height={500}
                  unoptimized
                  className="w-full h-auto object-contain z-10 border-4 border-black/50 relative"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
              </div>
            </motion.div>

            {/* Secondary Image (right on desktop, below on mobile) */}
            {event.details.images[1] && (
              <motion.div 
                className="relative w-full max-w-[320px] md:max-w-none md:flex-1 flex items-center justify-center"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div 
                  className="relative w-full max-w-[400px] rotate-6 shadow-2xl flex justify-center items-center cursor-zoom-in"
                  onClick={() => {
                    setZoomedImage(event.details.images[1])
                    setIsZoomOpen(true)
                  }}
                >
                  <div className="absolute inset-0 bg-[#fc5896] rotate-3 scale-105 opacity-20 blur-sm pointer-events-none" />
                  <Image
                    src={event.details.images[1]}
                    alt="detail"
                    width={400}
                    height={400}
                    unoptimized
                    className="w-full h-auto object-contain border-8 border-white relative"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Headline */}
          <motion.h1
            className="font-neo text-white text-xl md:text-4xl lg:text-5xl tracking-[0.2em] md:tracking-[0.3em] uppercase mb-8 md:mb-12 text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <BrandedTitle text={event.details.headline} />
          </motion.h1>

          {/* Event Description */}
          <motion.div 
            className="relative z-10 self-center px-8 py-8 sm:px-16 sm:py-12 md:px-32 md:py-20 w-fit text-center mb-28 md:mb-24 mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              backgroundImage: "url('/images/ui/event-speech-bubble.png')",
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="font-neo text-black text-sm md:text-[19px] leading-relaxed uppercase text-center max-w-[72vw] sm:max-w-[60vw] md:max-w-[40vw] border-[0.5rem] md:border-[1rem] border-transparent">
              <BrandedTitle text={event.details.description} disableColor={true} />
            </div>
          </motion.div>

        </div>

        {/* Column 7: Rightmost lateral column (Copy Link Button at bottom) */}
        <div className="absolute bottom-6 right-6 md:relative md:bottom-auto md:left-auto md:col-span-1 flex md:items-end justify-center pb-0 md:pb-12 z-50">
          <motion.button
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopyLink}
            className="neo-interface-btn relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#E295A4] rounded-full cursor-pointer transition-colors duration-300"
            style={{ backgroundColor: linkCopied ? '#A2D729' : linkHovered ? '#FF5696' : '#E295A4' }}
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
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-neo text-[8px] md:text-[10px] text-[#A2D729] tracking-widest uppercase">
                link copiato
              </span>
            )}
          </motion.button>
        </div>

        {/* Overlay subtle grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('/images/textures/grain.png')]" />
      </motion.div>

      {/* ── MODALE OVERLAY ZOOM A SCHERMO INTERO ── */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden touch-none"
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomOpen(false)
            }}
            onWheel={handleWheel}
            onTouchStart={handleZoomTouchStart}
            onTouchMove={handleZoomTouchMove}
            onTouchEnd={(e) => {
              handleZoomTouchEnd()
              handleDoubleTap(e)
            }}
          >
            <motion.img
              src={zoomedImage}
              alt="Zoom Preview"
              drag
              dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
              dragElastic={0.1}
              dragMomentum={false}
              style={{ scale }}
              className="max-w-[95vw] max-h-[95vh] object-contain pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            />

            {/* ── ESC Button (Mobile & Desktop) ── */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#FF5696' }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                setIsZoomOpen(false)
              }}
              className="neo-interface-btn fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[2100] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#E295A4] rounded-full cursor-pointer transition-colors duration-300"
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
