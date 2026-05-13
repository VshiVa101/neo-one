'use client'

import { motion } from 'framer-motion'
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
  return (
    <motion.div
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full h-full bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col"
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
        {/* Top Branding Layer - Small eye 'pinning' the modal */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-[700] pointer-events-none">
          <div className="w-12 h-12 md:w-16 md:h-16">
             <EyeScene 
                targetRoute="#" 
                showCircularText={false} 
                globalTracking={true} 
                scaleMultiplier={0.9}
             />
          </div>
          <motion.div 
            className="mt-2 flex flex-col items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="text-white font-neo text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-center leading-relaxed">
              <BrandedTitle text={event.details.comicBubble || quote || ''} />
            </div>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="relative flex-1 flex flex-col overflow-y-auto scrollbar-hide p-8 md:p-12 pt-40 md:pt-48">
          
          {/* Headline */}
          <motion.h2
            className="font-neo text-white text-2xl md:text-4xl tracking-widest lowercase mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <BrandedTitle text={event.details.headline} />
          </motion.h2>

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

          {/* Collage Elements */}
          <div className="relative flex flex-col items-center gap-8 md:gap-12 mt-auto pt-8">

            {/* Event Description */}
            <motion.div 
              className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-xl max-w-2xl w-full text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="font-neo text-white/70 text-sm md:text-base leading-relaxed lowercase">
                <BrandedTitle text={event.details.description} />
              </div>
            </motion.div>

            {/* Comic Bubble / Call to Action */}
            {event.details.comicBubble && (
              <motion.div
                className="relative bg-[#39ff14] text-black px-8 py-3 font-neo text-sm md:text-base tracking-widest lowercase shadow-[0_0_20px_rgba(57,255,20,0.4)] rotate-[3deg]"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
              >
                <BrandedTitle text={event.details.comicBubble} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex items-center justify-between z-50">
           {/* Share Button */}
           <button 
             className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#fc5896] flex items-center justify-center text-black hover:bg-white transition-colors duration-300 shadow-lg"
             title="Share"
           >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
           </button>

           {/* Purchase Tag */}
           <div className="flex flex-col items-center">
             <div className="bg-black border border-white/20 px-4 py-2 flex items-center gap-3 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-[#fc5896] animate-pulse" />
                <span className="text-white font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase">
                   <BrandedTitle text="pre-order purchase" />
                </span>
             </div>
           </div>

           {/* Close Button */}
           <button 
             onClick={onClose}
             className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black border-2 border-[#fc5896] flex items-center justify-center text-[#fc5896] hover:bg-[#fc5896] hover:text-black transition-all duration-300 shadow-lg group"
           >
              <div className="relative w-6 h-6 md:w-8 md:h-8">
                 {/* Visual X */}
                 <span className="absolute top-1/2 left-0 w-full h-0.5 bg-current rotate-45" />
                 <span className="absolute top-1/2 left-0 w-full h-0.5 bg-current -rotate-45" />
              </div>
           </button>
        </div>
        
        {/* Overlay subtle grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('/images/textures/grain.png')]" />
      </motion.div>
    </motion.div>
  )
}
