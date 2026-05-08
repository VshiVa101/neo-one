'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeScene } from '@/components/EyeScene'
import { TornPaper } from '@/components/calendar/TornPaper'
import { EventItem } from '@/components/calendar/EventItem'
import { EventDetail } from '@/components/calendar/EventDetail'
import { ContactForm } from '@/components/calendar/ContactForm'
import { SocialBar } from '@/components/calendar/SocialBar'
import type { NeoEvent } from '@/data/calendar-mock'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart, Home } from 'lucide-react'

interface CalendarClientProps {
  initialEvents: NeoEvent[]
  quote?: string
}

export default function CalendarClient({ initialEvents, quote }: CalendarClientProps) {
  const [activeEvent, setActiveEvent] = useState<NeoEvent | null>(null)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [cartHovered, setCartHovered] = useState(false)
  const [homeHovered, setHomeHovered] = useState(false)
  const { isCartOpen, setIsCartOpen, count } = useCart()
  const router = useRouter()

  const eventsByMonth = useMemo(() => {
    const grouped: Record<string, NeoEvent[]> = {}
    
    // Sort events by date
    const sorted = [...initialEvents].sort((a, b) => {
      const dateA = new Date(`${a.month} ${a.date}, ${a.year}`).getTime()
      const dateB = new Date(`${b.month} ${b.date}, ${b.year}`).getTime()
      return dateA - dateB
    })

    for (const event of sorted) {
      if (!grouped[event.month]) {
        grouped[event.month] = []
      }
      grouped[event.month].push(event)
    }
    return grouped
  }, [initialEvents])

  return (
    <main className="w-full min-h-screen relative bg-black overflow-hidden">
      {/* Absolute Backgrounds */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/images/bg/bg-scroll.gif')",
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
          width: '300%',
          height: '300%',
          left: '-100%',
          top: '-100%',
          rotate: 90,
        }}
        animate={{ backgroundPosition: ['0px 0px', '0px 1000px'] }}
        transition={{ 
          duration: 60, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(57,255,20,0.03),transparent_70%)] z-[1]" />

      {/* EyeScene Anchor */}
      <div className="fixed top-[2vh] md:top-[4vh] left-1/2 -translate-x-1/2 w-[12vh] h-[12vh] md:w-[20vh] md:h-[20vh] z-[500]">
        <EyeScene
          targetRoute="/home"
          showCircularText={false}
          globalTracking={true}
          scaleMultiplier={1.1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-[18vh] md:pt-[28vh] pb-32">
        {/* Dynamic Quote */}
        <motion.p
          className="text-center font-neo text-[#39ff14] text-sm md:text-base tracking-widest uppercase mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {quote || "Vieni a molestarmi dal vivo"}
        </motion.p>

        {/* Torn Paper Calendar */}
        <TornPaper className="px-4 py-8 md:px-8 md:py-12">
          {/* Calendar Header */}
          <div className="text-center mb-10">
            <h2 className="font-neo text-black text-2xl md:text-4xl tracking-widest uppercase">
              CALENDARIO
            </h2>
            <div className="mt-2 w-16 h-[2px] bg-black/30 mx-auto" />
          </div>

          {/* Months */}
          <div className="flex flex-col gap-4">
            {Object.entries(eventsByMonth).map(([month, events], monthIndex) => (
              <div key={month} className="space-y-2">
                <h3 className="font-neo text-[#39ff14] text-base md:text-lg tracking-widest uppercase ml-2">
                  {month}
                </h3>
                <motion.div
                  className="p-3 md:p-5 shadow-lg"
                  style={{ 
                    backgroundImage: `url(/images/textures/row-${(monthIndex % 3) + 1}.webp)`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + monthIndex * 0.15 }}
                >
                  <div className="flex gap-3 overflow-x-auto pt-4 -mt-4 pb-2 custom-scrollbar">
                    {events.map((event, eventIndex) => (
                      <EventItem
                        key={event.id}
                        event={event}
                        index={eventIndex}
                        onClick={() => setActiveEvent(event)}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </TornPaper>

        {/* Bottom Spacer */}
        <div className="h-16" />
      </div>

      {/* Floating Actions: Home + Cart (matching Home style) */}
      <div className="fixed bottom-[80px] right-6 md:bottom-[100px] md:right-10 z-[400] flex flex-col items-center gap-3">
        {/* Home Button */}
        <motion.button
          animate={{
            scale: homeHovered ? 1.5 : 1,
            backgroundColor: homeHovered ? '#F45390' : '#B3828B',
          }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHomeHovered(true)}
          onMouseLeave={() => setHomeHovered(false)}
          onClick={() => router.push('/home')}
          className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 cursor-pointer rounded-full flex items-center justify-center focus:outline-none p-2 transition-colors duration-300"
          style={{
            boxShadow: homeHovered
              ? '0 0 30px rgba(244, 83, 144, 0.8), 0 0 60px rgba(244, 83, 144, 0.3)'
              : '0 0 10px rgba(0,0,0,0.3)',
            zIndex: homeHovered ? 401 : undefined,
          }}
          title="Home"
        >
          <Home 
            size={24} 
            className={homeHovered ? 'text-black' : 'text-[#F45390]'} 
            strokeWidth={2.5}
            style={{ transform: 'scale(1.2)' }}
          />
        </motion.button>

        {/* Cart Button */}
        <motion.button
          animate={{
            scale: cartHovered ? 1.5 : 1,
          }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setCartHovered(true)}
          onMouseLeave={() => setCartHovered(false)}
          onClick={() => setIsCartOpen(true)}
          className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 cursor-pointer rounded-full flex items-center justify-center focus:outline-none p-2 transition-colors duration-300 relative"
          style={{
            backgroundColor: cartHovered ? '#F45390' : '#B3828B',
            boxShadow: cartHovered
              ? '0 0 30px rgba(244, 83, 144, 0.8), 0 0 60px rgba(244, 83, 144, 0.3)'
              : '0 0 10px rgba(0,0,0,0.3)',
            zIndex: cartHovered ? 401 : undefined,
          }}
          title="Vai alla Cassa"
        >
          <img
            src={
              cartHovered
                ? '/images/drops/carrellorosa_optimized.webp'
                : count > 0
                  ? '/images/drops/carrelloverde_optimized.webp'
                  : '/images/drops/carrello_optimized.webp'
            }
            alt="Carrello"
            className="w-full h-full object-contain"
            style={{ transform: 'scale(1.5)' }}
          />
          <span className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-[#809829] rounded-full font-neo text-[8px] md:text-[10px] text-black font-bold border border-black shadow-[0_0_5px_rgba(128,152,41,0.8)]">
            {count}
          </span>
        </motion.button>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {activeEvent && (
          <EventDetail
            event={activeEvent}
            onClose={() => setActiveEvent(null)}
          />
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Social Linktree Bar */}
      <SocialBar />
    </main>
  )
}
