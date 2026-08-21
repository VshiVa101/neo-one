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

// NOTE: rumoreSession state is managed via module-level variables
// to allow cross-instance continuity during artwork navigation.
let globalRumoreSessionActive = false;
let globalRestartTimeout: ReturnType<typeof setTimeout> | null = null;

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

  const isRumoreCluster = clusterSlug?.toLowerCase() === 'rumore'
  const isFotoOrMerce = clusterSlug?.toLowerCase() === 'foto' || clusterSlug?.toLowerCase() === 'merce' || clusterSlug?.toLowerCase() === 'cose'

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
  
  // -- Arm ResizeObserver Logic --
  const vinylRef = useRef<HTMLDivElement>(null)
  const armBaseRef = useRef<HTMLDivElement>(null)
  const [armMetrics, setArmMetrics] = useState({ length: 150, angle: 135 })
  
  useEffect(() => {
    if (!isRumoreCluster) return;
    const updateMetrics = () => {
      if (!vinylRef.current || !armBaseRef.current) return;
      const vinylRect = vinylRef.current.getBoundingClientRect();
      const baseRect = armBaseRef.current.getBoundingClientRect();
      // Target is the right-most point of the vinyl
      const targetX = vinylRect.left + vinylRect.width;
      const targetY = vinylRect.top + vinylRect.height / 2;
      const baseX = baseRect.left + baseRect.width / 2;
      const baseY = baseRect.top + baseRect.height / 2;
      const dx = targetX - baseX;
      const dy = targetY - baseY;
      const dist = Math.hypot(dx, dy);
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      setArmMetrics({ length: dist / 2, angle });
    };
    const observer = new ResizeObserver(updateMetrics);
    if (vinylRef.current) observer.observe(vinylRef.current);
    if (armBaseRef.current) observer.observe(armBaseRef.current);
    window.addEventListener('resize', updateMetrics);
    setTimeout(updateMetrics, 50);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateMetrics);
    };
  }, [isRumoreCluster]);

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

    globalRumoreSessionActive = true
    if (globalRestartTimeout) {
      clearTimeout(globalRestartTimeout)
      globalRestartTimeout = null
    }

    if (!isCrtNoisePlaying()) {
      startCrtNoise()
    }
    fadeOutAndPause()

    return () => {
      globalRumoreSessionActive = false
      globalRestartTimeout = setTimeout(() => {
        if (!globalRumoreSessionActive) {
          stopCrtNoise()
          restartFromStart()
        }
        globalRestartTimeout = null
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
          } lg:bg-black ${isRumoreCluster ? 'overflow-visible z-50' : 'overflow-hidden'} cursor-pointer brightness-[0.7] hover:brightness-100`}>
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
          <div className={`relative flex-1 lg:flex-[2] mx-1 sm:mx-2 lg:mx-0 bg-black rounded-lg p-1 md:p-2 shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-[#111] group perspective-[1000px] ${isRumoreCluster ? 'z-[60]' : 'z-10'}`}>

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
                {/* ── WRAPPER ── */}
                {/* Garantisce proporzioni corrette (quadrato per Rumore, massimo spazio per gli altri) */}
                <div 
                  className={`relative m-auto flex items-center justify-center ${isRumoreCluster ? 'aspect-square' : 'w-full h-full'}`}
                  style={isRumoreCluster ? { width: '100%', maxWidth: 'min(100%, 65vh)', maxHeight: '100%' } : { width: '100%', height: '100%' }}
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
                    ref={vinylRef}
                    className={`relative flex items-center justify-center overflow-hidden transition-colors duration-1000 z-10 shrink-0 ${
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
                    unoptimized
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

                {/* Braccio Meccanico Giradischi — Mathematical responsive overlay (Sibling to Wrapper) */}
                <AnimatePresence>
                  {isRumoreCluster && (
                    <motion.div
                      ref={armBaseRef}
                      className="absolute top-[2%] right-[5%] sm:top-[5%] sm:right-[8%] lg:top-[5%] lg:right-[10%] xl:right-[15%] z-20 pointer-events-none flex items-center justify-center"
                      style={{ width: '64px', height: '64px' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="absolute inset-0 origin-center"
                        initial={{ rotate: armMetrics.angle + 45 }}
                        animate={{ rotate: isPreviewPlaying ? armMetrics.angle : armMetrics.angle + 45 }}
                        transition={{ rotate: { type: 'spring', stiffness: 60, damping: 15, delay: isPreviewPlaying ? 0.8 : 0 } }}
                      >
                        {/* Base / Perno */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-[#888] via-[#333] to-[#111] rounded-full border-[2px] md:border-[4px] border-[#222] shadow-[0_10px_20px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.3)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); handleAudioPreview(); }}
                        >
                          <div className="w-[30%] h-[30%] bg-gradient-to-t from-black via-[#333] to-[#777] rounded-full border border-[#111] shadow-inner pointer-events-none" />
                        </div>

                        {/* Primo Segmento dell'Asta (Upper Rod) */}
                        <div 
                          className="absolute top-1/2 left-1/2 -translate-y-1/2 bg-gradient-to-b from-[#e0e0e0] via-[#888] to-[#333] origin-left rounded-r-full shadow-[0_10px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.8)] pointer-events-none"
                          style={{ width: `${armMetrics.length}px`, height: '12px' }}
                        >
                           {/* Contrappeso (dietro il perno principale) */}
                           <div className="absolute left-[-50%] top-1/2 -translate-y-1/2 w-[50%] h-[250%] bg-gradient-to-r from-[#111] via-[#555] to-[#111] rounded-l-[4px] border-y border-l border-[#666] flex items-center shadow-lg">
                             <div className="w-[10%] h-full bg-[#111] mx-[5%]" />
                             <div className="w-[10%] h-full bg-[#111] mx-[5%]" />
                           </div>

                           {/* Perno del Gomito */}
                           <div className="absolute right-[0%] top-1/2 -translate-y-1/2 h-[150%] aspect-square bg-gradient-to-br from-[#555] to-[#111] rounded-full border border-[#222] shadow-inner translate-x-1/2 z-10 flex items-center justify-center">
                              <div className="w-[40%] h-[40%] bg-zinc-400 rounded-full shadow-inner" />
                           </div>

                           {/* Secondo Segmento dell'Asta (Forearm) con animazione */}
                           <motion.div 
                             className="absolute left-[100%] top-0 w-[100%] h-[100%] bg-gradient-to-b from-[#e0e0e0] via-[#888] to-[#333] origin-left rounded-r-full shadow-[0_10px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.8)]"
                             initial={{ rotate: -175 }}
                             animate={{ rotate: isPreviewPlaying ? 0 : -175 }}
                             transition={{ rotate: { type: 'spring', stiffness: 60, damping: 15, delay: isPreviewPlaying ? 0.8 : 0 } }}
                           >
                             {/* Cavo visibile sul secondo segmento */}
                             <div className="absolute left-[5%] top-0 w-[80%] h-[10%] bg-red-900/40 blur-[0.5px]" />
                             
                             {/* Testina / Headshell */}
                             <div className="absolute right-[-4%] top-1/2 -translate-y-1/2 w-[24%] h-[300%] bg-gradient-to-b from-[#444] via-[#222] to-[#111] rounded-[2px] transform rotate-[-25deg] border-t border-[#777] border-b-[2px] border-r border-[#111] shadow-2xl flex items-center justify-end pr-[5%] gap-[5%]">
                               {/* LED testina */}
                               <div 
                                 className={`w-[15%] h-[60%] rounded-sm transition-all duration-300 ${
                                   isPreviewPlaying 
                                     ? 'bg-[#A2D729] shadow-[0_0_8px_2px_rgba(162,215,41,0.9)]' 
                                     : 'bg-[#FF5696] shadow-[0_0_4px_1px_rgba(255,86,150,0.6)]'
                                 }`} 
                               />
                               {/* Puntina (Stylus) che tocca il disco */}
                               <div className="absolute bottom-[-20%] left-[40%] w-[5%] h-[40%] bg-gradient-to-b from-[#ccc] to-[#fff] shadow-lg origin-top rotate-12" />
                             </div>
                           </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Back: Text Data */}
              <div
                className="absolute inset-0 bg-[#111] rounded-lg border border-white/10 overflow-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', containerType: 'size' }}
              >
                <div className="w-full h-full overflow-y-auto info-scrollbar p-2 md:p-4 text-center flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center justify-center w-full max-h-full">
                    <h2 className="font-neo text-white text-[clamp(1.2rem,8cqmin,3rem)] tracking-[0.2em] mb-[clamp(0.5rem,2cqmin,1rem)] uppercase branded-title leading-none">
                      <BrandedTitle text="Dettagli" />
                    </h2>
                    <p className="font-neo text-white text-[clamp(0.9rem,5cqmin,1.5rem)] tracking-widest uppercase mb-[clamp(0.25rem,1.5cqmin,0.5rem)] break-words max-w-full leading-tight">
                      {title}
                    </p>
                    <p className="font-neo text-white text-[clamp(0.8rem,4cqmin,1.25rem)] tracking-widest uppercase mb-[clamp(0.25rem,1cqmin,0.5rem)] break-words max-w-full leading-tight">
                      {method} / {support}
                    </p>
                    <p className="font-neo text-white/50 text-[clamp(0.7rem,3.5cqmin,1.125rem)] tracking-widest uppercase mb-[clamp(1rem,4cqmin,2rem)] break-words max-w-full leading-tight">
                      {dimensions} — {year}
                    </p>

                    <h2 className="font-neo text-white text-[clamp(1.1rem,6cqmin,2.25rem)] tracking-[0.2em] mb-[clamp(0.5rem,2cqmin,1rem)] uppercase branded-title leading-none">
                      <BrandedTitle text="Disponibilità" />
                    </h2>
                    <p className="font-neo text-white text-[clamp(0.8rem,4cqmin,1.25rem)] tracking-widest uppercase mb-[clamp(0.25rem,1cqmin,0.5rem)] break-words max-w-full leading-tight">
                      {isAvailable ? 'acquistabile' : 'archivio'}
                    </p>
                    <p className="font-neo text-white/50 text-[clamp(0.7rem,3.5cqmin,1.125rem)] tracking-widest uppercase break-words max-w-full leading-tight">
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
          } lg:bg-black ${isRumoreCluster ? 'overflow-visible z-50' : 'overflow-hidden'} cursor-pointer brightness-[0.7] hover:brightness-100`}>
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
