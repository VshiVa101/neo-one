'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { BrandedTitle } from '@/components/BrandedTitle'
import { useNavigationHistory } from '@/hooks/useNavigationHistory'

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
}: ArtworkDetailClientProps) => {
  const router = useRouter()
  const { goBackToGallery } = useNavigationHistory()
  const { addToCart, count, setIsCartOpen } = useCart()

  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)

  const [prevHovered, setPrevHovered] = useState(false)
  const [nextHovered, setNextHovered] = useState(false)
  const [purchaseHovered, setPurchaseHovered] = useState(false)
  const [cartHovered, setCartHovered] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [infoHovered, setInfoHovered] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const touchStartX = React.useRef<number | null>(null)
  const previewAudioRef = React.useRef<HTMLAudioElement | null>(null)

  const isRumoreCluster = clusterSlug?.toLowerCase() === 'rumore'

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
    const params = new URLSearchParams()
    if (clusterId) params.set('cluster', clusterId)
    if (deckIndex !== null && deckIndex !== undefined) params.set('deck', deckIndex.toString())
    const qs = params.toString()
    return `/artwork/${encodeURIComponent(targetNid)}${qs ? '?' + qs : ''}`
  }

  const handleExitToGallery = () => {
    if (clusterId && deckIndex !== null && deckIndex !== undefined) {
      router.push(`/home?cluster=${clusterId}&deck=${deckIndex}`)
    } else {
      goBackToGallery('/home')
    }
  }

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
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isZoomOpen])

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
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause()
        previewAudioRef.current = null
      }
    }
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
              <img
                src="/images/ui/pink-zebra-bg.webp"
                alt="bg"
                className="w-[120%] h-full object-cover -translate-x-[10%]"
              />
            </div>
            {/* Logo Neo-One */}
            <div className="relative z-10 w-[90%] aspect-[3/1] mb-12 flex items-center justify-center">
              <div
                className="w-full h-full bg-[#809829] drop-shadow-[0_0_20px_rgba(128,152,41,0.8)]"
                style={{
                  WebkitMaskImage: 'url(/images/ui/logo-neoone-blackmetal-bianco.png)',
                  WebkitMaskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              />
            </div>
            {/* Btn Prev */}
            <div className="relative z-10 w-full flex justify-center mt-8">
              {prevNid ? (
                <motion.button
                  className="neo-interface-btn pointer-events-auto cursor-pointer focus:outline-none w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] bg-[#B3828B] rounded-full flex items-center justify-center transition-colors"
                  onClick={() => router.push(getNavUrl(prevNid))}
                  onMouseEnter={() => setPrevHovered(true)}
                  onMouseLeave={() => setPrevHovered(false)}
                  whileHover={{ scale: 1.15, backgroundColor: '#809829' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img
                    src={
                      prevHovered
                        ? '/images/ui/direction-arrow-green.webp'
                        : '/images/ui/direction-arrow-pink.webp'
                    }
                    className="w-[62%] h-[62%] object-contain rotate-180"
                    draggable={false}
                  />
                </motion.button>
              ) : (
                <div className="w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] opacity-0" />
              )}
            </div>
          </div>

          {/* 2. CENTER ARTWORK (A tutto schermo senza crop) */}
          <div className="relative flex-1 bg-black rounded-lg p-1 lg:p-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden group perspective-[1000px]">
            <motion.div
              className="w-full h-full relative"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front: Image */}
              <div
                className="absolute inset-0 flex items-center justify-center cursor-zoom-in backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
                onClick={() => setIsZoomOpen(true)}
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX
                }}
                onTouchEnd={(e) => {
                  if (touchStartX.current === null) return
                  const touchEndX = e.changedTouches[0].clientX
                  const deltaX = touchEndX - touchStartX.current
                  if (deltaX > 50 && prevNid) {
                    router.push(getNavUrl(prevNid))
                  } else if (deltaX < -50 && nextNid) {
                    router.push(getNavUrl(nextNid))
                  }
                  touchStartX.current = null
                }}
              >
                <img
                  src={image}
                  alt={`Opera ${nid}`}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform duration-700 lg:group-hover:scale-[1.02]"
                  draggable={false}
                />
              </div>

              {/* Back: Text Data */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#111] rounded-lg border border-white/10"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <h2 className="font-neo text-[#F45390] text-3xl lg:text-5xl tracking-[0.2em] mb-4 uppercase branded-title">
                  <BrandedTitle text="Dettagli" />
                </h2>
                <p className="font-neo text-white text-xl lg:text-2xl tracking-widest lowercase mb-2 neo-skip-branding">
                  {title}
                </p>
                <p className="font-neo text-white text-base lg:text-xl tracking-widest lowercase mb-1 neo-skip-branding">
                  {method} / {support}
                </p>
                <p className="font-neo text-white/50 text-sm lg:text-lg tracking-widest lowercase mb-6 neo-skip-branding">
                  {dimensions} — {year}
                </p>

                <h2 className="font-neo text-[#F45390] text-2xl lg:text-4xl tracking-[0.2em] mb-2 uppercase branded-title">
                  <BrandedTitle text="Disponibilità" />
                </h2>
                <p className="font-neo text-white text-base lg:text-xl tracking-widest lowercase mb-1 neo-skip-branding">
                  {isAvailable ? 'ACQUISTABILE' : 'ARCHIVIO'}
                </p>
                <p className="font-neo text-white/50 text-sm lg:text-lg tracking-widest lowercase neo-skip-branding">
                  {priceInfo}
                </p>
              </div>
            </motion.div>
          </div>

          {/* 3. RIGHT PANEL (Nascosta su Mobile) */}
          <div className="relative hidden lg:flex w-[22vw] bg-black rounded-lg overflow-hidden flex-col items-center justify-center pointer-events-none">
            {/* Zebra BG */}
            <div className="absolute inset-0">
              <img
                src="/images/ui/pink-zebra-bg.webp"
                alt="bg"
                className="w-[120%] h-full object-cover translate-x-[10%]"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            {/* Logo Neo-One */}
            <div className="relative z-10 w-[90%] aspect-[3/1] mb-12 flex items-center justify-center">
              <div
                className="w-full h-full bg-[#809829] drop-shadow-[0_0_20px_rgba(128,152,41,0.8)]"
                style={{
                  WebkitMaskImage: 'url(/images/ui/logo-neoone-blackmetal-bianco.png)',
                  WebkitMaskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              />
            </div>
            {/* Btn Next */}
            <div className="relative z-10 w-full flex justify-center mt-8">
              {nextNid ? (
                <motion.button
                  className="neo-interface-btn pointer-events-auto cursor-pointer focus:outline-none w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] bg-[#B3828B] rounded-full flex items-center justify-center transition-colors"
                  onClick={() => router.push(getNavUrl(nextNid))}
                  onMouseEnter={() => setNextHovered(true)}
                  onMouseLeave={() => setNextHovered(false)}
                  whileHover={{ scale: 1.15, backgroundColor: '#809829' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img
                    src={
                      nextHovered
                        ? '/images/ui/direction-arrow-green.webp'
                        : '/images/ui/direction-arrow-pink.webp'
                    }
                    className="w-[62%] h-[62%] object-contain"
                    draggable={false}
                  />
                </motion.button>
              ) : (
                <div className="w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] opacity-0" />
              )}
            </div>
          </div>
        </div>
        {/* ── BOTTOM BAR STRUTTURALE (SOLO BOTTONI, Responsive) ── */}
        <div className="w-full lg:w-[90vw] mt-2 lg:mt-6 pb-4 lg:pb-0 z-30 flex flex-row items-center justify-center">
          <div className="w-full flex flex-row items-center justify-evenly px-2 lg:px-0 gap-3 lg:gap-6">
            {/* Tasto Back - Esc */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#F45390' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleExitToGallery}
              className="neo-interface-btn w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 bg-[#B3828B] rounded-full flex items-center justify-center outline-none z-20 transition-colors duration-300"
              title="Torna alla Gallery"
            >
              <img
                src="/images/ui/esccc.webp"
                className="w-[55%] h-[55%] object-contain opacity-80"
                style={{ transform: 'scale(1.5)' }}
              />
            </motion.button>

            {/* Info Flip Button */}
            <motion.button
              className="neo-interface-btn w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 bg-[#B3828B] rounded-full flex items-center justify-center focus:outline-none transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation()
                setIsFlipped(!isFlipped)
              }}
              onMouseEnter={() => setInfoHovered(true)}
              onMouseLeave={() => setInfoHovered(false)}
              style={{ backgroundColor: infoHovered ? '#F45390' : '#B3828B' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Dettagli Opera"
            >
              <img
                src={infoHovered ? '/images/ui/inforverde.webp' : '/images/ui/inforosa.webp'}
                alt="Info"
                className="w-[66%] h-[66%] object-contain drop-shadow-[0_0_10px_rgba(0,0,0,1)]"
                style={{ transform: 'scale(1.5)' }}
              />
            </motion.button>

            {isRumoreCluster && audioSnippetUrl && (
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#809829' }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAudioPreview}
                className="neo-interface-btn relative w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 bg-[#B3828B] rounded-full flex outline-none justify-center items-center cursor-pointer transition-colors duration-300"
                title="Prova Audio"
              >
                <img
                  src="/images/ui/volume.webp"
                  alt="Volume"
                  className="w-[62%] h-[62%] object-contain"
                  style={{ transform: 'scale(1.5)' }}
                />
              </motion.button>
            )}

            {isRumoreCluster && fullAudioUrl && (
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#809829' }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setLinkHovered(true)}
                onMouseLeave={() => setLinkHovered(false)}
                onClick={() => window.open(fullAudioUrl, '_blank', 'noopener,noreferrer')}
                className="neo-interface-btn relative w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 bg-[#B3828B] rounded-full flex outline-none justify-center items-center cursor-pointer transition-colors duration-300"
                title="Link Audio Completo"
              >
                <img
                  src={linkHovered ? '/images/ui/condividiverde.webp' : '/images/ui/condivcidi.webp'}
                  alt="Link"
                  className="w-[62%] h-[62%] object-contain"
                  style={{ transform: 'scale(1.5)' }}
                />
              </motion.button>
            )}

            {/* Pulsante PRE-ORDER LOGO */}
            <motion.button
              onClick={handlePurchase}
              onMouseEnter={() => setPurchaseHovered(true)}
              onMouseLeave={() => setPurchaseHovered(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="neo-interface-btn relative w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 bg-[#B3828B] rounded-full flex outline-none justify-center items-center cursor-pointer transition-colors duration-300"
              style={{ backgroundColor: addedToCart ? '#809829' : purchaseHovered ? '#F45390' : '#B3828B' }}
            >
              <img
                src="/images/ui/euros.webp"
                alt="Purchase"
                className="w-[72%] h-[72%] object-contain transition-all duration-300"
                style={{ transform: 'scale(1.5)' }}
              />
            </motion.button>

            {/* Carrello */}
            <motion.button
              onMouseEnter={() => setCartHovered(true)}
              onMouseLeave={() => setCartHovered(false)}
              whileHover={{ scale: 1.1, backgroundColor: '#F45390' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="neo-interface-btn relative w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] flex-shrink-0 bg-[#B3828B] rounded-full flex outline-none justify-center items-center cursor-pointer"
            >
              <img
                src={
                  cartHovered
                    ? '/images/drops/carrellorosa_optimized.webp'
                    : count > 0
                      ? '/images/ui/carrelloverde.webp'
                      : '/images/ui/carrello.webp'
                }
                alt="Carrello"
                className="w-[62%] h-[62%] object-contain relative z-10"
                style={{ transform: 'scale(1.5)' }}
              />
              {/* Contatore ESTERNO */}
              <span className="absolute -top-2 -right-2 w-[22px] h-[22px] lg:w-[24px] lg:h-[24px] flex items-center justify-center bg-[#809829] rounded-full font-neo text-[10px] lg:text-sm text-black font-bold border lg:border-2 border-black z-20 shadow-[0_0_5px_rgba(128,152,41,0.8)]">
                {count}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  )
}
