'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { BrandedTitle } from '@/components/BrandedTitle'
import { useNavigationHistory } from '@/hooks/useNavigationHistory'
import { useAudio } from '@/contexts/AudioContext'
import { startCrtNoise, stopCrtNoise, isCrtNoisePlaying } from '@/utilities/crtNoiseManager'
import { CrumpledPaperPanel } from '@/components/artwork/CrumpledPaperPanel'
import { VinylCoverPanel } from '@/components/artwork/VinylCoverPanel'
import { useInputMode } from '@/contexts/InputModeContext'

// NOTE: rumoreSession state is now managed via useRef inside the component
// to avoid cross-instance contamination in concurrent rendering.

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
  clusterId?: string | null
  clusterSlug?: string | null
  deckIndex?: number | null
  audioSnippetUrl?: string | null
  fullAudioUrl?: string | null
  prevImage?: string | null
  nextImage?: string | null
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
  clusterId,
  clusterSlug,
  deckIndex,
  audioSnippetUrl,
  fullAudioUrl,
  prevImage,
  nextImage,
}: ArtworkDetailClientProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { goBackToGallery } = useNavigationHistory()
  const { addToCart, count, setIsCartOpen } = useCart()
  const { fadeOutAndPause, restartFromStart } = useAudio()
  const { isTouchMode } = useInputMode()

  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const scale = useMotionValue(1)

  const [cartHovered, setCartHovered] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [infoHovered, setInfoHovered] = useState(false)
  const [purchaseHovered, setPurchaseHovered] = useState(false)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false)
  const [isVinylPopped, setIsVinylPopped] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1200)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const previewAudioRef = React.useRef<HTMLAudioElement | null>(null)
  const [euroRotation, setEuroRotation] = useState(0)
  const [showEuroIconInRumore, setShowEuroIconInRumore] = useState(true)
  const ballIndexes = React.useMemo(() => {
    let hash = 0
    for (let i = 0; i < nid.length; i++) {
      hash = nid.charCodeAt(i) + ((hash << 5) - hash)
    }
    const left = Math.abs(hash % 3) + 1
    const right = Math.abs((hash + 1) % 3) + 1
    return { left, right }
  }, [nid])

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
    // Only act on single-finger taps (not pinch end)
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

  const isRumoreCluster = clusterSlug?.toLowerCase() === 'rumore'
  const isFotoOrMerce = clusterSlug?.toLowerCase() === 'foto' || clusterSlug?.toLowerCase() === 'merce' || clusterSlug?.toLowerCase() === 'cose'
  const rumoreSessionActiveRef = useRef(false)
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleAudioPreview = async () => {
    if (!audioSnippetUrl) return

    // Toggle play/pause if the same preview is already loaded
    if (previewAudioRef.current) {
      if (previewAudioRef.current.paused) {
        await previewAudioRef.current.play().then(
          () => setIsPreviewPlaying(true),
          () => setIsPreviewPlaying(false),
        )
      } else {
        previewAudioRef.current.pause()
        setIsPreviewPlaying(false)
      }
      return
    }

    const audio = new Audio(audioSnippetUrl)
    audio.preload = 'auto'
    audio.volume = 0.8
    audio.onended = () => setIsPreviewPlaying(false)
    previewAudioRef.current = audio
    await audio.play().then(
      () => setIsPreviewPlaying(true),
      () => setIsPreviewPlaying(false),
    )
  }

  const handlePurchase = () => {
    addToCart({ nid, title, image })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const isAvailable = availability === 'comprabile'

  // Utility per costruire URL con parametri di navigazione (per tornare alla gallery corretta)
  const getNavUrl = (targetNid: string) => {
    const urlCluster = searchParams.get('cluster')
    const urlDeck = searchParams.get('deck')
    const finalClusterId = urlCluster || clusterId
    const finalDeckIndex = urlDeck !== null && urlDeck !== undefined
      ? urlDeck
      : deckIndex?.toString()

    const params = new URLSearchParams()
    if (finalClusterId) params.set('cluster', finalClusterId)
    if (finalDeckIndex !== null && finalDeckIndex !== undefined) params.set('deck', finalDeckIndex)
    const qs = params.toString()
    return `/artwork/${encodeURIComponent(targetNid)}${qs ? '?' + qs : ''}`
  }

  const handleExitToGallery = () => {
    const urlCluster = searchParams.get('cluster')
    const urlDeck = searchParams.get('deck')
    const finalClusterId = urlCluster || clusterId
    const finalDeckIndex = urlDeck !== null && urlDeck !== undefined
      ? parseInt(urlDeck, 10)
      : deckIndex

    if (finalClusterId && finalDeckIndex !== null && finalDeckIndex !== undefined) {
      router.push(`/home?cluster=${finalClusterId}&deck=${finalDeckIndex}`)
    } else {
      goBackToGallery('/home')
    }
  }

  // Wheel handler per Zoom In/Out
  const handleWheel = (e: React.WheelEvent) => {
    if (isZoomOpen) {
      const currentScale = scale.get()
      const delta = e.deltaY * -0.005
      scale.set(Math.min(Math.max(1, currentScale + delta), 5)) // clamp tra 1x e 5x
    }
  }

  // Prevenire scroll del body quando zoom è attivo
  React.useEffect(() => {
    if (isZoomOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      scale.set(1) // Reset zoom on close
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isZoomOpen])

  useEffect(() => {
    if (!isRumoreCluster) return

    rumoreSessionActiveRef.current = true
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
      restartTimeoutRef.current = null
    }

    if (!isCrtNoisePlaying()) {
      startCrtNoise()
    }
    fadeOutAndPause()

    return () => {
      rumoreSessionActiveRef.current = false
      restartTimeoutRef.current = setTimeout(() => {
        if (!rumoreSessionActiveRef.current) {
          stopCrtNoise()
          restartFromStart()
        }
        restartTimeoutRef.current = null
      }, 400)
    }
  }, [isRumoreCluster, clusterSlug, fadeOutAndPause, restartFromStart])

  // Gestione tasto ESC fisico
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomOpen) {
          setIsZoomOpen(false)
        } else {
          handleExitToGallery()
        }
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isZoomOpen, goBackToGallery, clusterId, deckIndex])

  React.useEffect(() => {
    // Stop and reset preview audio whenever the artwork changes (nid) or on unmount
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause()
        previewAudioRef.current = null
      }
      setIsPreviewPlaying(false)
    }
  }, [nid])

  useEffect(() => {
    const interval = setInterval(() => {
      setEuroRotation((prev) => prev + 360)
      setShowEuroIconInRumore((prev) => !prev)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
            onTouchStart={handleZoomTouchStart}
            onTouchMove={handleZoomTouchMove}
            onTouchEnd={(e) => {
              handleZoomTouchEnd()
              handleDoubleTap(e)
            }}
          >
            <motion.img
              src={image}
              alt={`Zoom Opera ${nid}`}
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

      <div className="flex flex-col w-full h-full max-w-[100vw] lg:max-w-[95vw] mx-auto justify-center items-center pb-2 relative z-20 px-2 lg:px-0">
        
        {/* Header Titolo Artwork */}
        <div className="mb-2 sm:mb-4 lg:mb-6 w-full text-center shrink-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-neo tracking-widest leading-none text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <BrandedTitle text={title} />
          </h1>
        </div>

        {/* ── MIDDLE ROW (Le 3 colonne su Desktop, Solo Centro su Mobile) ── */}
        <div className="flex flex-row items-stretch justify-center w-full h-[55vh] md:h-[60vh] lg:h-[72vh] gap-[2vw]">
          {/* 1. LEFT PANEL / COLUMN (Previews on lg, narrow navigation column when smaller) */}
          <div className={`relative flex items-center justify-center rounded-lg transition-all duration-300 ${
            isTouchMode ? 'w-[20px] sm:w-[36px] md:w-[60px] lg:flex-1' : 'w-[22vw] lg:flex-1'
          } lg:bg-black ${isRumoreCluster ? 'overflow-visible z-50' : 'overflow-hidden'} cursor-pointer opacity-70 hover:opacity-100`}>
            {/* Desktop View (Visible on lg and larger) */}
            <div className={`${isFotoOrMerce ? 'hidden' : 'hidden lg:block'} absolute inset-0 w-full h-full`}>
              {isRumoreCluster ? (
                <VinylCoverPanel
                  artworkImage={prevImage ?? null}
                  alt="Opera Precedente"
                  side="left"
                  onClick={prevNid ? () => router.push(getNavUrl(prevNid)) : undefined}
                  clusterSlug={clusterSlug}
                />
              ) : (
                <CrumpledPaperPanel
                  artworkImage={prevImage ?? null}
                  alt="Opera Precedente"
                  side="left"
                  onClick={prevNid ? () => router.push(getNavUrl(prevNid)) : undefined}
                  clusterSlug={clusterSlug}
                  ballIndex={ballIndexes.left}
                />
              )}
            </div>

            {/* Mobile/Tablet View (Visible on screens smaller than lg) */}
            <div 
              className={`${isFotoOrMerce ? 'block absolute' : 'lg:hidden absolute'} inset-0 w-full h-full rounded-lg overflow-hidden border bg-neutral-950/80 transition-colors ${
                isRumoreCluster ? 'border-[#A2D729]/30' : 'border-[#FF5696]/30'
              }`}
              onClick={prevNid ? () => router.push(getNavUrl(prevNid)) : undefined}
            >
              {prevImage ? (
                <Image
                  src={prevImage}
                  alt="Precedente"
                  fill
                  className="object-cover opacity-70 brightness-95 transition-all duration-300 active:scale-110 active:opacity-90"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-black/40 flex items-center justify-center opacity-30" />
              )}
            </div>
          </div>

          {/* 2. CENTER ARTWORK */}
          <div className={`relative flex-1 lg:flex-[2] mx-1 sm:mx-2 lg:mx-0 bg-black rounded-lg p-2 lg:p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5 group perspective-[1000px] ${isRumoreCluster ? 'z-[60]' : 'z-10'}`}>

            <motion.div
              className="w-full h-full relative"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front: Image */}
              <motion.div
                className={`absolute inset-0 flex items-center justify-center backface-hidden touch-pan-y ${
                  isTouchMode && isRumoreCluster ? 'cursor-pointer' : 'cursor-zoom-in'
                }`}
                style={{ backfaceVisibility: 'hidden' }}
                onClick={() => {
                  // Su mobile nel cluster RUMORE: tap fa uscire/rientrare il vinile visivamente
                  if (isTouchMode && isRumoreCluster) {
                    setIsVinylPopped(prev => !prev)
                  } else {
                    setIsZoomOpen(true)
                  }
                }}
                onPanEnd={(e: any, info: any) => {
                  if (Math.abs(info.offset.x) > 40 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
                    if (info.offset.x > 0 && prevNid) {
                      router.push(getNavUrl(prevNid))
                    } else if (info.offset.x < 0 && nextNid) {
                      router.push(getNavUrl(nextNid))
                    }
                  }
                }}
              >
                {/* ── WRAPPER QUADRATO PERFETTO ── */}
                {/* Garantisce che cover e vinile emergente abbiano le stesse proporzioni senza deformarsi (no ovali). Rimosso h-full! */}
                <div 
                  className="relative m-auto flex items-center justify-center aspect-square"
                  style={{ width: '100%', maxWidth: 'min(100%, 65vh)', maxHeight: '100%' }}
                >
                  
                  {/* ── VINILE EMERGENTE (solo mobile + RUMORE) ── */}
                  {/* z-0 lo mette dietro la cover */}
                  {isTouchMode && isRumoreCluster && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#0a0a0a] border-[4px] border-[#1a1a1a] flex items-center justify-center overflow-hidden shadow-2xl pointer-events-none z-0"
                      initial={false}
                      animate={{
                        y: isVinylPopped && !isPreviewPlaying ? '-55%' : '0%',
                        rotate: isVinylPopped && !isPreviewPlaying ? -180 : 0,
                        scale: isVinylPopped && !isPreviewPlaying ? 0.95 : 0.85,
                        opacity: isPreviewPlaying ? 0 : 1
                      }}
                      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                    >
                      {/* Label centrale */}
                      <div className="relative w-[45%] h-[45%] rounded-full overflow-hidden border-2 border-white/10">
                        <Image src={image} alt="vinyl label" fill className="object-cover" unoptimized />
                      </div>
                      {/* Buco centrale */}
                      <div className="absolute w-4 h-4 bg-black rounded-full border border-white/10 z-10 shadow-inner" />
                      {/* Riflessi */}
                      <div className="absolute inset-0 rounded-full z-0 pointer-events-none" style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.08) 15%, transparent 30%, transparent 50%, rgba(255,255,255,0.08) 65%, transparent 80%)' }} />
                      {/* Scanalature */}
                      <div className="absolute inset-0 rounded-full border border-white/5 m-[10%]" />
                      <div className="absolute inset-0 rounded-full border border-white/5 m-[20%]" />
                      <div className="absolute inset-0 rounded-full border border-white/5 m-[30%]" />
                    </motion.div>
                  )}

                  {/* ── COVER e PLAYBACK VINYL (z-10 per coprire il vinile a riposo) ── */}
                  <motion.div
                    className={`relative flex items-center justify-center overflow-hidden transition-colors duration-1000 z-10 ${
                      isPreviewPlaying && isRumoreCluster ? 'bg-[#0a0a0a]' : 'bg-transparent'
                    }`}
                    initial={false}
                    animate={{
                      width: isPreviewPlaying && isRumoreCluster ? 'min(45vh, 65vw)' : '100%',
                      height: isPreviewPlaying && isRumoreCluster ? 'min(45vh, 65vw)' : '100%',
                      borderRadius: isPreviewPlaying && isRumoreCluster ? '50%' : '0%',
                      rotate: isPreviewPlaying && isRumoreCluster ? 360 : 0,
                      borderWidth: isPreviewPlaying && isRumoreCluster ? '4px' : '0px',
                      borderColor: '#1a1a1a',
                      scale: isVinylPopped && !isPreviewPlaying ? 1.04 : 1 // Effetto profondità on pop
                    }}
                    transition={{
                      width: { duration: 0.8, ease: 'easeInOut' },
                      height: { duration: 0.8, ease: 'easeInOut' },
                      borderRadius: { duration: 0.8, ease: 'easeInOut' },
                      borderWidth: { duration: 0.8, ease: 'easeInOut' },
                      scale: { type: 'spring', stiffness: 100, damping: 20 },
                      rotate: isPreviewPlaying && isRumoreCluster 
                        ? { duration: 4, repeat: Infinity, ease: 'linear', delay: 0.8 } 
                        : { duration: 0.8, ease: 'easeOut' }
                    }}
                  >

                  <Image
                    src={image}
                    alt={`Opera ${nid}`}
                    fill
                    className={`drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-700 ${
                      isPreviewPlaying && isRumoreCluster ? 'scale-[0.45] rounded-full border-2 border-white/10 object-cover' : 'lg:group-hover:scale-[1.02] object-contain'
                    }`}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  {/* Vinyl center hole */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPreviewPlaying && isRumoreCluster ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: isPreviewPlaying && isRumoreCluster ? 0.8 : 0 }}
                    className="absolute w-4 h-4 md:w-6 md:h-6 bg-black rounded-full border border-white/10 z-10 shadow-inner" 
                  />
                  {/* Vinyl reflections */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPreviewPlaying && isRumoreCluster ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: isPreviewPlaying && isRumoreCluster ? 0.8 : 0 }}
                    className="absolute inset-0 rounded-full z-0 pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.08) 15%, transparent 30%, transparent 50%, rgba(255,255,255,0.08) 65%, transparent 80%)'
                    }}
                  />
                  {/* Scanalature (grooves) */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPreviewPlaying && isRumoreCluster ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: isPreviewPlaying && isRumoreCluster ? 0.8 : 0 }}
                    className="absolute inset-0 rounded-full border border-white/5 m-[10%] pointer-events-none" 
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPreviewPlaying && isRumoreCluster ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: isPreviewPlaying && isRumoreCluster ? 0.8 : 0 }}
                    className="absolute inset-0 rounded-full border border-white/5 m-[20%] pointer-events-none" 
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPreviewPlaying && isRumoreCluster ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: isPreviewPlaying && isRumoreCluster ? 0.8 : 0 }}
                    className="absolute inset-0 rounded-full border border-white/5 m-[30%] pointer-events-none" 
                  />
                </motion.div>
                </div>

                {/* Braccio Meccanico Giradischi — Visible su mobile e desktop */}
                <AnimatePresence>
                  {isRumoreCluster && (
                    <motion.div
                      className="absolute top-[5%] right-[2%] sm:right-[12%] lg:right-[15%] z-20 pointer-events-none origin-[24px_24px] lg:origin-[32px_32px]"
                      initial={{ opacity: 0, rotate: -30 }}
                      animate={{ 
                        opacity: 1, 
                        rotate: isPreviewPlaying ? (windowWidth >= 1024 ? -5 : 5) : -25 
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        opacity: { duration: 0.5 },
                        rotate: { type: 'spring', stiffness: 60, damping: 15, delay: isPreviewPlaying ? 0.8 : 0 }
                      }}
                    >
                      {/* Base / Perno */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAudioPreview();
                        }}
                        className="absolute top-0 left-0 w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] lg:w-[64px] lg:h-[64px] bg-gradient-to-br from-[#888] via-[#333] to-[#111] rounded-full border-4 border-[#222] shadow-[0_15px_25px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.3)] flex items-center justify-center z-20 pointer-events-auto cursor-pointer transition-transform hover:scale-110 active:scale-95"
                      >
                        {/* Perno centrale */}
                        <div className="w-[12px] h-[12px] sm:w-[16px] sm:h-[16px] lg:w-[24px] lg:h-[24px] bg-gradient-to-t from-black via-[#333] to-[#777] rounded-full border-[2px] border-[#111] shadow-inner pointer-events-none" />
                        {/* Riflesso circolare */}
                        <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none" />
                      </div>
                      
                      {/* Asta principale (Rod) */}
                      <div className="absolute top-[17px] left-[20px] sm:top-[21px] sm:left-[24px] lg:top-[29px] lg:left-[32px] w-[120px] sm:w-[160px] md:w-[200px] lg:w-[35vh] h-[5px] sm:h-[6px] lg:h-[8px] bg-gradient-to-b from-[#e0e0e0] via-[#888] to-[#333] origin-left rounded-r-full shadow-[0_10px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.8)]" style={{ transform: 'rotate(110deg)' }}>
                         {/* Cavo visibile che esce dal rod */}
                         <div className="absolute left-[10px] top-[-2px] w-[60%] h-[1px] bg-red-900/40 blur-[0.5px]" />

                         {/* Contrappeso (dietro il perno) */}
                         <div className="absolute left-[-30px] sm:left-[-40px] lg:left-[-55px] top-1/2 -translate-y-1/2 w-[25px] sm:w-[35px] lg:w-[50px] h-[16px] sm:h-[20px] lg:h-[28px] bg-gradient-to-r from-[#111] via-[#555] to-[#111] rounded-l-md border-y border-l border-[#666] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] flex items-center">
                           <div className="w-[4px] h-full bg-[#111] mx-1" />
                           <div className="w-[4px] h-full bg-[#111] mx-1" />
                         </div>
                         
                         {/* Testina / Headshell */}
                         <div className="absolute right-[-15px] top-1/2 -translate-y-1/2 w-[30px] sm:w-[35px] lg:w-[50px] h-[16px] sm:h-[18px] lg:h-[26px] bg-gradient-to-b from-[#444] via-[#222] to-[#111] rounded-sm transform rotate-[-25deg] border-t border-[#777] border-b-2 border-r border-[#111] shadow-2xl flex items-center justify-end pr-1.5 gap-1">
                           {/* Dettaglio hardware testina (viti) */}
                           <div className="absolute left-2 top-1 w-1.5 h-1.5 bg-zinc-400 rounded-full shadow-inner" />
                           <div className="absolute left-2 bottom-1 w-1.5 h-1.5 bg-zinc-400 rounded-full shadow-inner" />

                           {/* LED testina */}
                           <div 
                             className={`w-[4px] h-[10px] rounded-sm transition-all duration-300 ${
                               isPreviewPlaying 
                                 ? 'bg-[#A2D729] shadow-[0_0_12px_3px_rgba(162,215,41,0.9)]' 
                                 : 'bg-[#FF5696] shadow-[0_0_6px_1px_rgba(255,86,150,0.6)]'
                             }`} 
                           />
                           {/* Puntina (Stylus) che tocca il disco */}
                           <div className="absolute bottom-[-6px] left-[12px] w-[2px] h-[8px] bg-gradient-to-b from-[#ccc] to-[#fff] shadow-[0_5px_5px_rgba(0,0,0,1)] origin-top rotate-12" />
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Back: Text Data */}
              <div
                className="absolute inset-0 bg-[#111] rounded-lg border border-white/10 overflow-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="w-full h-full overflow-y-auto info-scrollbar py-6 px-4 md:py-8 md:px-8 text-center flex flex-col items-center justify-start min-h-full">
                  <div className="my-auto flex flex-col items-center w-full">
                    <h2 className="font-neo text-white text-3xl lg:text-5xl tracking-[0.2em] mb-4 uppercase branded-title">
                      <BrandedTitle text="Dettagli" />
                    </h2>
                    <p className="font-neo text-white text-xl lg:text-2xl tracking-widest uppercase mb-2 break-words max-w-full">
                      {title}
                    </p>
                    <p className="font-neo text-white text-base lg:text-xl tracking-widest uppercase mb-1 break-words max-w-full">
                      {method} / {support}
                    </p>
                    <p className="font-neo text-white/50 text-sm lg:text-lg tracking-widest uppercase mb-6 break-words max-w-full">
                      {dimensions} — {year}
                    </p>

                    <h2 className="font-neo text-white text-2xl lg:text-4xl tracking-[0.2em] mb-2 uppercase branded-title">
                      <BrandedTitle text="Disponibilità" />
                    </h2>
                    <p className="font-neo text-white text-base lg:text-xl tracking-widest uppercase mb-1 break-words max-w-full">
                      {isAvailable ? 'acquistabile' : 'archivio'}
                    </p>
                    <p className="font-neo text-white/50 text-sm lg:text-lg tracking-widest uppercase break-words max-w-full">
                      {priceInfo}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 3. RIGHT PANEL / COLUMN (Previews on lg, narrow navigation column when smaller) */}
          <div className={`relative flex items-center justify-center rounded-lg transition-all duration-300 ${
            isTouchMode ? 'w-[20px] sm:w-[36px] md:w-[60px] lg:flex-1' : 'w-[22vw] lg:flex-1'
          } lg:bg-black ${isRumoreCluster ? 'overflow-visible z-50' : 'overflow-hidden'} cursor-pointer opacity-70 hover:opacity-100`}>
            {/* Desktop View (Visible on lg and larger) */}
            <div className={`${isFotoOrMerce ? 'hidden' : 'hidden lg:block'} absolute inset-0 w-full h-full`}>
              {isRumoreCluster ? (
                <VinylCoverPanel
                  artworkImage={nextImage ?? null}
                  alt="Opera Successiva"
                  side="right"
                  onClick={nextNid ? () => router.push(getNavUrl(nextNid)) : undefined}
                  clusterSlug={clusterSlug}
                />
              ) : (
                <CrumpledPaperPanel
                  artworkImage={nextImage ?? null}
                  alt="Opera Successiva"
                  side="right"
                  onClick={nextNid ? () => router.push(getNavUrl(nextNid)) : undefined}
                  clusterSlug={clusterSlug}
                  ballIndex={ballIndexes.right}
                />
              )}
            </div>

            {/* Mobile/Tablet View (Visible on screens smaller than lg) */}
            <div 
              className={`${isFotoOrMerce ? 'block absolute' : 'lg:hidden absolute'} inset-0 w-full h-full rounded-lg overflow-hidden border bg-neutral-950/80 transition-colors ${
                isRumoreCluster ? 'border-[#A2D729]/30' : 'border-[#FF5696]/30'
              }`}
              onClick={nextNid ? () => router.push(getNavUrl(nextNid)) : undefined}
            >
              {nextImage ? (
                <Image
                  src={nextImage}
                  alt="Successiva"
                  fill
                  className="object-cover opacity-70 brightness-95 transition-all duration-300 active:scale-110 active:opacity-90"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-black/40 flex items-center justify-center opacity-30" />
              )}
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR STRUTTURALE (SOLO BOTTONI, Responsive) ── */}
        <div className="w-full lg:w-[90vw] mt-2 lg:mt-6 pb-4 lg:pb-0 z-30 flex flex-row items-center justify-center">
          <div className="w-full flex flex-row items-center justify-evenly px-2 lg:px-0 gap-3 lg:gap-6">
            {/* Tasto Back - Esc */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90, backgroundColor: '#FF5696' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleExitToGallery}
              className="neo-interface-btn w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 bg-[#E295A4] rounded-full flex items-center justify-center outline-none z-20 transition-colors duration-300"
              title="Torna alla Gallery"
            >
              <Image
                src="/images/ui/esccc.webp"
                alt="ESC"
                width={36}
                height={36}
                className="w-[55%] h-[55%] object-contain opacity-80"
                style={{ transform: 'scale(1.5)' }}
                unoptimized
              />
            </motion.button>

            {/* Info Flip Button */}
            {!isRumoreCluster && (
              <motion.button
                className="neo-interface-btn w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 bg-[#E295A4] rounded-full flex items-center justify-center focus:outline-none transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(!isFlipped)
                }}
                onMouseEnter={isTouchMode ? undefined : () => setInfoHovered(true)}
                onMouseLeave={isTouchMode ? undefined : () => setInfoHovered(false)}
                style={{ backgroundColor: (!isTouchMode && infoHovered) ? '#FF5696' : '#E295A4' }}
                whileHover={isTouchMode ? {} : { scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Dettagli Opera"
              >
                <Image
                  src={!isTouchMode && infoHovered ? '/images/ui/inforverde.webp' : '/images/ui/inforosa.webp'}
                  alt="Info"
                  width={46}
                  height={46}
                  className="w-[66%] h-[66%] object-contain drop-shadow-[0_0_10px_rgba(0,0,0,1)]"
                  style={{ transform: 'scale(1.5)' }}
                  unoptimized
                />
              </motion.button>
            )}

            {isRumoreCluster && audioSnippetUrl && (
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#A2D729' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setHasPlayedOnce(true)
                  handleAudioPreview()
                }}
                className="neo-interface-btn relative w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 rounded-full flex outline-none justify-center items-center cursor-pointer"
                style={{ backgroundColor: isPreviewPlaying ? '#A2D729' : '#E295A4' }}
                animate={!hasPlayedOnce && !isPreviewPlaying ? {
                  boxShadow: [
                    '0 0 0px 0px rgba(128,152,41,0)',
                    '0 0 24px 8px rgba(128,152,41,0.85)',
                    '0 0 0px 0px rgba(128,152,41,0)',
                  ]
                } : { boxShadow: '0 0 0px 0px rgba(128,152,41,0)' }}
                transition={!hasPlayedOnce && !isPreviewPlaying ? {
                  boxShadow: { duration: 1, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }
                } : {}}
                title="Prova Audio"
              >
                <Image
                  src="/images/ui/volume.webp"
                  alt="Volume"
                  width={44}
                  height={44}
                  className="w-[62%] h-[62%] object-contain"
                  style={{ transform: 'scale(1.5)' }}
                  unoptimized
                />
              </motion.button>
            )}

            {/* Pulsante PRE-ORDER LOGO / LINK (Alternate in Rumore) */}
            <motion.button
              onClick={isRumoreCluster ? () => {
                if (fullAudioUrl) window.open(fullAudioUrl, '_blank', 'noopener,noreferrer')
              } : handlePurchase}
              onMouseEnter={isTouchMode ? undefined : () => setPurchaseHovered(true)}
              onMouseLeave={isTouchMode ? undefined : () => setPurchaseHovered(false)}
              animate={{
                scale: (!isRumoreCluster && addedToCart) ? [1, 1.2, 1] : (!isTouchMode && purchaseHovered) ? 1.1 : [1, 1.06, 1],
                boxShadow: (!isRumoreCluster && addedToCart)
                  ? '0 0 30px rgba(162, 215, 41, 0.8)'
                  : (!isTouchMode && purchaseHovered)
                    ? '0 0 25px rgba(255, 86, 150, 0.6)'
                    : ['0 0 8px rgba(255, 86, 150, 0.2)', '0 0 18px rgba(255, 86, 150, 0.5)', '0 0 8px rgba(255, 86, 150, 0.2)'],
              }}
              transition={{
                scale: (!isRumoreCluster && addedToCart) ? { duration: 0.4 } : (!isTouchMode && purchaseHovered) ? { duration: 0.2 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                boxShadow: (!isRumoreCluster && addedToCart) ? { duration: 0.4 } : (!isTouchMode && purchaseHovered) ? { duration: 0.2 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileTap={{ scale: 0.9 }}
              className="neo-interface-btn relative w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 bg-[#E295A4] rounded-full flex outline-none justify-center items-center cursor-pointer transition-colors duration-300"
              style={{ backgroundColor: (!isRumoreCluster && addedToCart) ? '#A2D729' : (!isTouchMode && purchaseHovered) ? (isRumoreCluster && !showEuroIconInRumore ? '#A2D729' : '#FF5696') : '#E295A4' }}
              title={isRumoreCluster ? "Link Audio Completo" : "Acquista"}
            >
              <motion.div
                animate={{ rotate: euroRotation }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Image
                  src={isRumoreCluster && !showEuroIconInRumore ? ((!isTouchMode && purchaseHovered) ? '/images/ui/condividiverde.webp' : '/images/ui/condivcidi.webp') : "/images/ui/euros.webp"}
                  alt={isRumoreCluster && !showEuroIconInRumore ? "Link" : "Acquista"}
                  width={isRumoreCluster && !showEuroIconInRumore ? 44 : 50}
                  height={isRumoreCluster && !showEuroIconInRumore ? 44 : 50}
                  className={isRumoreCluster && !showEuroIconInRumore ? "w-[62%] h-[62%] object-contain" : "w-[72%] h-[72%] object-contain"}
                  style={{ transform: 'scale(1.5)' }}
                  unoptimized
                />
              </motion.div>
            </motion.button>

            {/* Carrello */}
            <motion.button
              onMouseEnter={isTouchMode ? undefined : () => setCartHovered(true)}
              onMouseLeave={isTouchMode ? undefined : () => setCartHovered(false)}
              whileHover={isTouchMode ? {} : { scale: 1.1, backgroundColor: '#FF5696' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="neo-interface-btn relative w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 bg-[#E295A4] rounded-full flex items-center justify-center outline-none transition-colors duration-300"
              style={{ backgroundColor: (!isTouchMode && cartHovered) ? '#FF5696' : '#E295A4' }}
            >
              <motion.div
                animate={{ rotate: count * 360 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Image
                  src={
                    (!isTouchMode && cartHovered)
                      ? '/images/drops/carrellorosa_optimized.webp'
                      : count > 0
                        ? '/images/ui/carrelloverde.webp'
                        : '/images/ui/carrello.webp'
                  }
                  alt="Carrello"
                  width={44}
                  height={44}
                  className="w-[62%] h-[62%] object-contain relative z-10"
                  style={{ transform: 'scale(1.5)' }}
                  unoptimized
                />
              </motion.div>
              {/* Contatore ESTERNO */}
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-[22px] h-[22px] lg:w-[24px] lg:h-[24px] flex items-center justify-center bg-[#A2D729] rounded-full font-neo text-[10px] lg:text-sm text-black font-bold border lg:border-2 border-black z-20 shadow-[0_0_5px_rgba(162,215,41,0.8)]">
                  {count}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </>
  )
}
