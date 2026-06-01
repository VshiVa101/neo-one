'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAudio } from '@/contexts/AudioContext'

interface CalendarSidePanelProps {
  socialLinks?: Array<{
    id: string
    icon: string
    url: string
    label: string
  }>
  eyeComponent?: React.ReactNode
}

export function CalendarSidePanel({ socialLinks, eyeComponent }: CalendarSidePanelProps) {
  const router = useRouter()
  const { setIsCartOpen, count } = useCart()
  const { isMuted, isPlaying, toggleMute } = useAudio()
  const [isLinksOpen, setIsLinksOpen] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  // Replica esatta del pattern MonthRow: ref sul wrapper overflow-hidden
  const linksContainerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const y = useMotionValue(0)

  // Aggiungiamo il supporto nativo alla rotella del mouse (con passive: false per bloccare lo scroll pagina)
  useEffect(() => {
    const container = linksContainerRef.current
    if (!container) return

    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault() // Blocca lo scroll dell'intera pagina

      if (!innerRef.current) return
      const containerHeight = container.clientHeight
      const contentHeight = innerRef.current.clientHeight
      
      // Se non c'è overflow, non scrollare
      if (contentHeight <= containerHeight) return

      const minY = containerHeight - contentHeight
      const maxY = 0

      // Fattore di smorzamento (0.8) per un feeling naturale
      let newY = y.get() - e.deltaY * 0.8

      // Clamp rigido ai bordi
      if (newY > maxY) newY = maxY
      if (newY < minY) newY = minY

      y.set(newY)
    }

    container.addEventListener('wheel', onNativeWheel, { passive: false })
    return () => container.removeEventListener('wheel', onNativeWheel)
  }, [y])

  const handleTreeClick = () => {
    if (isSwapping) return
    setIsSwapping(true)
    setTimeout(() => {
      setIsLinksOpen(!isLinksOpen)
      setIsSwapping(false)
    }, 250)
  }

  return (
    <motion.div
      className="fixed right-6 sm:right-8 md:right-[max(1rem,calc(12.5vw-60px))] lg:right-[max(1.5rem,calc(12.5vw-70px))] top-1/2 -translate-y-1/2 z-[400] flex flex-col items-center justify-center"
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: isSwapping ? 200 : 0, opacity: isSwapping ? 0 : 1 }}
      transition={{
        type: 'spring',
        stiffness: isSwapping ? 400 : 50,
        damping: isSwapping ? 30 : 14,
        delay: isSwapping ? 0 : 0.15,
      }}
    >
      <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 md:gap-4 lg:gap-6">
        {/* Eye Component */}
        {eyeComponent && (
          <div className="flex justify-center items-center overflow-visible shrink-0 mb-[140px] sm:mb-0">
            {eyeComponent}
          </div>
        )}

        {/* UI Bar */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Aged paper container background — rotated 90° to act as vertical strip */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[440px] h-[80px]
            md:w-[520px] md:h-[100px]
            lg:w-[640px] lg:h-[120px]
            rotate-90 pointer-events-none select-none opacity-90 z-0">
            <Image
              src="/images/ui/aged-paper-container.webp"
              alt=""
              fill
              className="object-fill"
              unoptimized
              draggable={false}
            />
          </div>

          {/* Icons column — width matches the paper strip width when rotated */}
          <div className="relative w-[72px] md:w-[88px] lg:w-[110px]">

            {/* ── UNIFIED BAR ── */}
            <div className="relative z-10 flex flex-col items-center w-full pt-5 pb-6 md:pt-6 md:pb-8 lg:pt-8 lg:pb-10">

              {/* ALBERO / FRECCIA (Sempre visibile, fissa in cima) */}
              <motion.button
                onClick={handleTreeClick}
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] lg:w-[72px] lg:h-[72px] relative cursor-pointer focus:outline-none shrink-0"
                title={isLinksOpen ? "Torna indietro" : "Links"}
              >
                <Image
                  src="/images/ui/linkthree.webp"
                  alt="Links"
                  fill
                  className={`object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${isLinksOpen ? 'opacity-0' : 'opacity-100'}`}
                  unoptimized
                  draggable={false}
                />
                <Image
                  src="/images/ui/direction-arrow-green.webp"
                  alt="Indietro"
                  fill
                  className={`object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${isLinksOpen ? 'opacity-100' : 'opacity-0'}`}
                  unoptimized
                  draggable={false}
                />
              </motion.button>

              {/* CONTENITORE INFERIORE (Icone Principali o Link Social) */}
              <div className="relative w-full mt-2 md:mt-3 lg:mt-4 flex flex-col items-center flex-1">
                
                {/* ── MAIN BAR ICONS ── */}
                <div className={`flex flex-col items-center gap-5 md:gap-6 lg:gap-8 w-full transition-opacity duration-300 ${isLinksOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  
                  {/* Bio */}
                  <motion.button
                    onClick={() => router.push('/bio')}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] lg:w-[72px] lg:h-[72px] relative cursor-pointer focus:outline-none"
                    title="Bio"
                  >
                    <Image
                      src="/images/ui/bio.webp"
                      alt="Bio"
                      fill
                      className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                      unoptimized
                      draggable={false}
                    />
                  </motion.button>

                  {/* Mute Toggle */}
                  {isPlaying && (
                    <motion.button
                      whileHover="hover"
                      initial="idle"
                      animate="idle"
                      variants={{
                        idle: { scale: 1, y: 0 },
                        hover: { scale: 1.2, y: -3 }
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMute}
                      className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] lg:w-[72px] lg:h-[72px] relative cursor-pointer focus:outline-none"
                      title={isMuted ? 'Attiva audio' : 'Disattiva audio'}
                    >
                      <motion.div
                        variants={{
                          idle: { scale: 1, filter: 'brightness(1) drop-shadow(0 0 8px rgba(0,0,0,0.5))' },
                          hover: { scale: 1.15, filter: 'brightness(1.3) drop-shadow(0 0 10px rgba(255,255,255,0.95))' }
                        }}
                        className="w-full h-full relative"
                      >
                        <Image
                          src="/images/ui/volume.webp"
                          alt="Volume"
                          fill
                          className={`object-contain transition-opacity duration-300 ${isMuted ? 'opacity-30' : 'opacity-95'}`}
                          unoptimized
                          draggable={false}
                        />
                      </motion.div>
                    </motion.button>
                  )}

                  {/* Cart / Contact */}
                  <motion.button
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCartOpen(true)}
                    className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] lg:w-[72px] lg:h-[72px] relative cursor-pointer focus:outline-none group"
                    title={count > 0 ? 'Carrello' : 'Contatta Neo'}
                  >
                    <Image
                      src={count > 0 ? '/images/ui/carrelloverde.webp' : '/images/ui/invia-mail-vuoto(3).webp'}
                      alt={count > 0 ? 'Carrello' : 'Contatta'}
                      fill
                      className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] group-hover:opacity-0 transition-opacity duration-200"
                      unoptimized
                      draggable={false}
                    />
                    <Image
                      src={count > 0 ? '/images/ui/carrelloverde.webp' : '/images/ui/invia-mail-verde(2).webp'}
                      alt={count > 0 ? 'Carrello' : 'Contatta'}
                      fill
                      className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      unoptimized
                      draggable={false}
                    />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[20px] md:h-[20px] lg:w-[24px] lg:h-[24px] flex items-center justify-center bg-[#809829] rounded-full font-neo text-[6px] sm:text-[7px] md:text-[9px] lg:text-[11px] text-black font-bold border border-black shadow-[0_0_5px_rgba(128,152,41,0.8)]">
                        {count}
                      </span>
                    )}
                  </motion.button>

                  {/* Home */}
                  <motion.button
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.push('/home')}
                    className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] lg:w-[72px] lg:h-[72px] relative cursor-pointer focus:outline-none"
                    title="Home"
                  >
                    <Image
                      src="/images/ui/web_5.webp"
                      alt="Home"
                      fill
                      className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                      unoptimized
                      draggable={false}
                    />
                  </motion.button>

                </div>

                {/* ── LINK BAR ICONS (Scroll Area) ── */}
                <div className={`absolute top-0 left-0 w-full h-full flex flex-col items-center transition-opacity duration-300 ${isLinksOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <motion.div
                    ref={linksContainerRef}
                    className="relative overflow-hidden w-full h-full"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
                      maskImage: 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
                    }}
                  >
                    <motion.div
                      ref={innerRef}
                      style={{ y }}
                      drag="y"
                      dragConstraints={linksContainerRef}
                      dragElastic={0.1}
                      className="flex flex-col items-center gap-10 md:gap-10 lg:gap-12 py-2 cursor-grab active:cursor-grabbing h-max w-full"
                    >
                      {socialLinks && socialLinks.length > 0 && socialLinks.map((link) => (
                        <motion.div
                          key={link.id}
                          animate={isLinksOpen ? { y: [0, -70, 0] } : { y: 0 }}
                          transition={
                            isLinksOpen
                              ? {
                                  duration: 1.5,
                                  ease: 'easeInOut',
                                  repeat: Infinity,
                                  repeatDelay: 5.5,
                                  delay: 0.5,
                                }
                              : {
                                  duration: 0.2,
                                }
                          }
                        >
                          <motion.div
                            onTap={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                            whileHover={{ scale: 1.15, y: -3 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-[52px] h-[52px] md:w-[62px] md:h-[62px] lg:w-[72px] lg:h-[72px] relative shrink-0 cursor-pointer"
                            title={link.label}
                            draggable={false}
                            onDragStart={(e: any) => e.preventDefault()}
                          >
                            <Image
                              src={link.icon}
                              alt={link.label}
                              fill
                              className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                              unoptimized
                              draggable={false}
                            />
                          </motion.div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
}
