'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { NeoEvent } from '@/data/calendar-mock'
import { EyeScene } from '@/components/EyeScene'

interface EventDetailProps {
  event: NeoEvent
  onClose: () => void
}

// Jagged "burst" clip path for the pink bubble
const burstClipPath = `polygon(
  0% 15%, 12% 2%, 25% 18%, 38% 0%, 50% 20%, 62% 0%, 75% 18%, 88% 2%, 100% 15%,
  92% 35%, 100% 50%, 92% 65%, 100% 85%, 85% 100%, 70% 90%, 50% 100%, 30% 90%, 15% 100%, 0% 85%,
  8% 65%, 0% 50%, 8% 35%
)`

// Taped/torn effect for the black banner
const tornBannerClipPath = `polygon(
  1% 5%, 99% 0%, 98% 95%, 2% 100%
)`

export function EventDetail({ event, onClose }: EventDetailProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-5xl aspect-video md:aspect-[16/10] bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col"
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
            <p className="text-white font-neo text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-center leading-relaxed">
              supp<span className="neo-O text-[#fc5896]">O</span>rta l'art<span className="neo-E text-[#FF82B2]">E</span> u<span className="neo-N text-[#809829]">N</span>d<span className="neo-E text-[#FF82B2]">E</span>rgr<span className="neo-O text-[#fc5896]">O</span>u<br/>
              <span className="neo-N text-[#809829]">N</span>d. <span className="neo-O text-[#fc5896]">O</span> aim<span className="neo-E text-[#FF82B2]">E</span><span className="neo-N text-[#809829]">N</span><span className="neo-O text-[#fc5896]">O</span> il mi<span className="neo-O text-[#fc5896]">O</span> affitt<span className="neo-O text-[#fc5896]">O</span>.
            </p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="relative flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 pt-40 md:pt-48 overflow-y-auto scrollbar-hide">
          
          {/* Left Side: Product/Main Image */}
          <motion.div 
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative w-full aspect-square max-w-[400px] group">
               {/* Decorative jagged frame back */}
               <div className="absolute inset-0 bg-[#fc5896] rotate-3 scale-105 opacity-20 blur-sm group-hover:rotate-6 transition-transform duration-500" />
               
               <Image
                 src={event.thumbnail}
                 alt={event.details.headline}
                 fill
                 className="object-cover z-10 border-4 border-black/50"
                 sizes="(max-width: 768px) 100vw, 50vw"
               />
               
               {/* Label Overlay */}
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white text-black px-4 py-1 font-neo text-xs tracking-tighter uppercase whitespace-nowrap rotate-[-2deg] shadow-lg">
                  STAMPA A MA<span className="text-[#fc5896]">NO</span> !
               </div>
            </div>
          </motion.div>

          {/* Right Side: Collage elements */}
          <div className="relative flex flex-col items-center justify-center gap-12">
            
            {/* Secondary Image or Detail */}
            {event.details.images[1] && (
               <motion.div 
                 className="relative w-48 h-48 md:w-64 md:h-64 rotate-6 shadow-2xl z-10"
                 initial={{ opacity: 0, rotate: 0 }}
                 animate={{ opacity: 1, rotate: 6 }}
                 transition={{ delay: 0.5 }}
               >
                 <Image
                   src={event.details.images[1]}
                   alt="detail"
                   fill
                   className="object-cover border-8 border-white"
                 />
               </motion.div>
            )}

            {/* Pink Jagged Bubble */}
            <motion.div
              className="relative bg-[#fc5896] p-8 md:p-12 flex items-center justify-center text-center shadow-xl z-20"
              style={{ clipPath: burstClipPath }}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: -2 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <p className="text-black font-neo text-sm md:text-lg leading-tight uppercase tracking-tighter">
                 e ricamata c<span className="text-white">o</span>i <br/>
                 piedi da u<span className="text-[#39ff14]">n</span>a <br/>
                 su<span className="text-white">o</span>ra !
              </p>
            </motion.div>

            {/* Black Taped Sticker */}
            <motion.div
              className="absolute -right-4 top-1/4 md:top-1/3 bg-black text-white px-8 py-3 z-30 shadow-2xl rotate-[-25deg]"
              style={{ clipPath: tornBannerClipPath }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
               <p className="font-neo text-xs md:text-sm tracking-widest whitespace-nowrap uppercase">
                  Stupidi gadgEt iN <span className="text-[#fc5896]">O</span>maggio!
               </p>
            </motion.div>

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
                   PRE-ORDER PURCHASE
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
