'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const constraintsRef = useRef<HTMLDivElement>(null)

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
      className="fixed right-4 md:right-[calc(12.5vw-50px)] lg:right-[calc(12.5vw-60px)] top-1/2 -translate-y-1/2 z-[400] flex flex-col items-center justify-center"
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: isSwapping ? 200 : 0, opacity: isSwapping ? 0 : 1 }}
      transition={{
        type: 'spring',
        stiffness: isSwapping ? 400 : 50,
        damping: isSwapping ? 30 : 14,
        delay: isSwapping ? 0 : 0.15,
      }}
    >
      <div className="flex flex-col items-center justify-center gap-2 md:gap-4 lg:gap-6">
        {/* Eye Component */}
        {eyeComponent && (
          <div className="flex justify-center items-center overflow-visible">
            {eyeComponent}
          </div>
        )}

        {/* UI Bar */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Aged paper container background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] lg:w-[700px] h-[70px] md:h-[110px] lg:h-[130px] rotate-90 pointer-events-none select-none opacity-90 z-0">
            <Image
              src="/images/ui/aged-paper-container.webp"
              alt=""
              fill
              className="object-fill"
              unoptimized
              draggable={false}
            />
          </div>

          <div className="relative w-[60px] md:w-[100px] lg:w-[120px]">

        {/* Icons stack — positioned above the paper texture */}
        <div className="relative z-10 flex flex-col items-center gap-4 md:gap-7 lg:gap-8 py-6 md:py-10 lg:py-12">
          {/* Top Toggle Button (Linktree or Arrow) */}
          <motion.button
            onClick={handleTreeClick}
            whileHover={{ scale: 1.2, y: -3 }}
            whileTap={{ scale: 0.9 }}
            className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] lg:w-[76px] lg:h-[76px] relative cursor-pointer focus:outline-none"
            title={isLinksOpen ? "Torna indietro" : "Links"}
          >
            <Image
              src={isLinksOpen ? "/images/ui/direction-arrow-green.webp" : "/images/ui/linkthree.webp"}
              alt={isLinksOpen ? "Indietro" : "Links"}
              fill
              className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
              unoptimized
            />
          </motion.button>

          {/* Social Links Dropdown */}
          <AnimatePresence>
            {isLinksOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 400, y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                  maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                }}
                className="relative overflow-hidden w-full flex justify-center"
                ref={constraintsRef}
              >
                <motion.div
                  drag="y"
                  dragConstraints={constraintsRef}
                  className="flex flex-col items-center gap-4 md:gap-7 lg:gap-8 py-4 cursor-grab active:cursor-grabbing"
                >
                  {/* Bio */}
                  <motion.a
                  href="https://linktr.ee/neoone" 
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] lg:w-[76px] lg:h-[76px] relative cursor-pointer"
                  title="Bio"
                >
                  <Image
                    src="/images/ui/bio.webp"
                    alt="Bio"
                    fill
                    className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                    unoptimized
                  />
                </motion.a>

                {/* Social links from CMS */}
                {socialLinks && socialLinks.length > 0 && socialLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] lg:w-[76px] lg:h-[76px] relative cursor-pointer"
                    title={link.label}
                  >
                    <Image
                      src={link.icon}
                      alt={link.label}
                      fill
                      className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                      unoptimized
                    />
                  </motion.a>
                ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isLinksOpen && (
            <>
              {/* Divider */}
              <div className="w-6 md:w-10 lg:w-12 h-[1px] bg-black/20 my-0" />

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
              className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] lg:w-[76px] lg:h-[76px] relative cursor-pointer focus:outline-none"
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
                />
              </motion.div>
            </motion.button>
          )}

          {/* Cart */}
          <motion.button
            whileHover={{ scale: 1.2, y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCartOpen(true)}
            className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] lg:w-[76px] lg:h-[76px] relative cursor-pointer focus:outline-none"
            title="Carrello"
          >
            <Image
              src={count > 0 ? '/images/ui/carrelloverde.webp' : '/images/ui/carrello.webp'}
              alt="Carrello"
              fill
              className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
              unoptimized
            />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-[16px] h-[16px] md:w-[22px] md:h-[22px] lg:w-[26px] lg:h-[26px] flex items-center justify-center bg-[#809829] rounded-full font-neo text-[7px] md:text-[10px] lg:text-[12px] text-black font-bold border border-black shadow-[0_0_5px_rgba(128,152,41,0.8)]">
                {count}
              </span>
            )}
          </motion.button>

          {/* Home */}
          <motion.button
            whileHover={{ scale: 1.2, y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/home')}
            className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] lg:w-[76px] lg:h-[76px] relative cursor-pointer focus:outline-none"
            title="Home"
          >
            <Image
              src="/images/ui/web_5.webp"
              alt="Home"
              fill
              className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
              unoptimized
            />
          </motion.button>
            </>
          )}
        </div>
      </div>
      </div>
      </div>
    </motion.div>
  )
}

