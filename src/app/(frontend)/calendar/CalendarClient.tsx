'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeScene } from '@/components/EyeScene'
import { StateBasedNavButton } from '@/components/StateBasedNavButton'
import { BrandedTitle } from '@/components/BrandedTitle'
import { TornPaper } from '@/components/calendar/TornPaper'
import { EventItem } from '@/components/calendar/EventItem'
import { EventDetail } from '@/components/calendar/EventDetail'
import { ContactForm } from '@/components/calendar/ContactForm'
import { SocialBar } from '@/components/calendar/SocialBar'
import type { NeoEvent } from '@/data/calendar-mock'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart } from 'lucide-react'

interface CalendarClientProps {
  initialEvents: NeoEvent[]
  initialEventId?: string
  quote?: string
  socialLinks?: Array<{
    id: string
    icon: string
    url: string
    label: string
  }>
}

const MonthRow = ({ events, month, monthIndex, setActiveEvent }: { events: NeoEvent[], month: string, monthIndex: number, setActiveEvent: (e: NeoEvent) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  return (
    <div key={month} className="space-y-2">
      <h3 className="font-neo text-white text-base md:text-lg tracking-widest ml-8 lowercase">
        <BrandedTitle text={month} />
      </h3>
      <motion.div
        ref={containerRef}
        className="p-3 md:p-5 shadow-lg overflow-hidden relative"
        style={{ 
          backgroundImage: `url(/images/textures/row-${(monthIndex % 3) + 1}.webp)`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 + monthIndex * 0.15 }}
      >
        <motion.div 
          drag="x"
          dragConstraints={containerRef}
          className="flex gap-3 pt-4 -mt-4 pb-2 w-max cursor-grab active:cursor-grabbing px-4"
        >
          {events.map((event, eventIndex) => (
            <EventItem
              key={event.id}
              event={event}
              index={eventIndex}
              onClick={() => setActiveEvent(event)}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function CalendarClient({ initialEvents, initialEventId, quote, socialLinks }: CalendarClientProps) {
  const [activeEvent, setActiveEvent] = useState<NeoEvent | null>(null)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [cartHovered, setCartHovered] = useState(false)
  
  // Extract unique sorted years from events
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(initialEvents.map(e => parseInt(e.year))))
    return years.sort((a, b) => a - b)
  }, [initialEvents])

  // Default to current actual year if it exists in data, otherwise the most recent available
  const initialYear = useMemo(() => {
    const now = new Date().getFullYear()
    if (availableYears.includes(now)) return now
    return availableYears.length > 0 ? availableYears[availableYears.length - 1] : now
  }, [availableYears])

  const [currentYear, setCurrentYear] = useState(initialYear)
  const [direction, setDirection] = useState(0)
  
  const { isCartOpen, setIsCartOpen, count } = useCart()
  const router = useRouter()

  // Auto-open evento da initialEventId (passato dal server via ?event=)
  useEffect(() => {
    if (initialEventId) {
      const match = initialEvents.find(e => e.id === initialEventId)
      if (match) setActiveEvent(match)
    }
  }, [initialEventId, initialEvents])

  // Sincronizza l'URL quando l'evento si apre/chiude
  useEffect(() => {
    if (activeEvent) {
      router.replace(`/calendar?event=${activeEvent.id}`, { scroll: false })
    } else if (initialEventId) {
      router.replace('/calendar', { scroll: false })
    }
  }, [activeEvent])

  const eventsByMonth = useMemo(() => {
    const grouped: Record<string, NeoEvent[]> = {}
    const filtered = initialEvents.filter(e => parseInt(e.year) === currentYear)
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(`${a.month} ${a.date}, ${a.year}`).getTime()
      const dateB = new Date(`${b.month} ${b.date}, ${b.year}`).getTime()
      return dateB - dateA
    })
    for (const event of sorted) {
      if (!grouped[event.month]) grouped[event.month] = []
      grouped[event.month].push(event)
    }
    return grouped
  }, [initialEvents, currentYear])

  const changeYear = (move: 'next' | 'prev') => {
    const currentIndex = availableYears.indexOf(currentYear)
    let nextIndex = currentIndex
    
    if (move === 'next' && currentIndex < availableYears.length - 1) {
      nextIndex = currentIndex + 1
    } else if (move === 'prev' && currentIndex > 0) {
      nextIndex = currentIndex - 1
    }

    if (nextIndex !== currentIndex) {
      setDirection(move === 'next' ? 1 : -1)
      setCurrentYear(availableYears[nextIndex])
    }
  }

  const variants = {
    initial: (direction: number) => ({
      y: direction > 0 ? 1200 : -1200, // direction 1 (next) -> from bottom, direction 0/-1 -> from top
      opacity: 1,
      rotate: 0
    }),
    animate: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 15,
        damping: 12,
        delay: 0.1
      }
    },
    exit: (direction: number) => ({
      y: direction > 0 ? -1200 : 1200, // direction 1 (next) -> exits top
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 1.0
      }
    })
  }

  // Navigation Helpers
  const canGoNext = availableYears.indexOf(currentYear) < availableYears.length - 1
  const canGoPrev = availableYears.indexOf(currentYear) > 0

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
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 pt-[18vh] md:pt-[28vh] pb-32 min-h-screen flex flex-col items-center">
        
        {/* Navigation Wrapper for AnimatePresence */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentYear}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <TornPaper className="px-4 py-8 md:px-8 md:py-12">
              {/* Calendar Header */}
              <div className="text-center mb-10 pt-12 md:pt-20">
                <motion.p
                  className="font-neo text-white text-xs md:text-sm tracking-widest lowercase mb-4 opacity-70"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <BrandedTitle text={quote || "vieni a molestarmi dal vivo"} />
                </motion.p>

                <div className="flex flex-col items-center justify-center gap-0 mb-6">
                  {/* Top Arrow -> Next available year */}
                  <motion.button
                    whileHover={canGoNext ? { scale: 1.2, y: -5 } : {}}
                    whileTap={canGoNext ? { scale: 0.9 } : {}}
                    onClick={() => changeYear('next')}
                    className="flex items-center justify-center focus:outline-none disabled:opacity-0 disabled:cursor-default"
                    disabled={!canGoNext}
                    style={{ transition: 'opacity 0.3s' }}
                  >
                    <motion.div
                      whileHover={{ filter: 'drop-shadow(0 0 25px rgba(57,255,20,0.9))' }}
                      whileTap={{ filter: 'drop-shadow(0 0 15px rgba(57,255,20,0.7))' }}
                      style={{ filter: 'drop-shadow(0 0 10px rgba(57,255,20,0.5))' }}
                    >
                      <Image 
                        src="/images/ui/direction-arrow-green.webp" 
                        alt="Prossimo Anno" 
                        width={50} 
                        height={50} 
                        className="-rotate-90"
                        unoptimized
                      />
                    </motion.div>
                  </motion.button>
                  
                  <h2 className="font-neo text-white text-3xl md:text-5xl tracking-[0.3em] leading-none flex items-center justify-center pt-4 pb-1">
                    <BrandedTitle text={currentYear.toString()} />
                  </h2>

                  {/* Bottom Arrow -> Previous available year */}
                  <motion.button
                    whileHover={canGoPrev ? { scale: 1.2, y: 5 } : {}}
                    whileTap={canGoPrev ? { scale: 0.9 } : {}}
                    onClick={() => changeYear('prev')}
                    className="flex items-center justify-center focus:outline-none disabled:opacity-0 disabled:cursor-default"
                    disabled={!canGoPrev}
                    style={{ transition: 'opacity 0.3s' }}
                  >
                    <motion.div
                      whileHover={{ filter: 'drop-shadow(0 0 25px rgba(57,255,20,0.9))' }}
                      whileTap={{ filter: 'drop-shadow(0 0 15px rgba(57,255,20,0.7))' }}
                      style={{ filter: 'drop-shadow(0 0 10px rgba(57,255,20,0.5))' }}
                    >
                      <Image 
                        src="/images/ui/direction-arrow-green.webp" 
                        alt="Anno Precedente" 
                        width={50} 
                        height={50} 
                        className="rotate-90"
                        unoptimized
                      />
                    </motion.div>
                  </motion.button>
                </div>
                <div className="mt-2 w-16 h-[2px] bg-black/30 mx-auto" />
              </div>

              {/* Months */}
              <div className="flex flex-col gap-4">
                {Object.keys(eventsByMonth).length > 0 ? (
                  Object.entries(eventsByMonth).map(([month, events], monthIndex) => (
                    <MonthRow 
                      key={month}
                      month={month}
                      events={events}
                      monthIndex={monthIndex}
                      setActiveEvent={setActiveEvent}
                    />
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <p className="font-neo text-white/30 text-sm tracking-widest lowercase">
                      <BrandedTitle text="nessun evento programmato per quest'anno" />
                    </p>
                  </div>
                )}
              </div>
            </TornPaper>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Spacer */}
        <div className="h-16" />
      </div>

      {/* Floating Actions: Home + Cart (matching Home style) */}
      <div className="fixed bottom-[80px] right-6 md:bottom-[100px] md:right-10 z-[400] flex flex-col items-center gap-3">
        {/* Home Button */}
        <StateBasedNavButton
          defaultIcon="/images/ui/web_5.webp"
          hoverIcon="/images/ui/web_3.webp"
          activeIcon="/images/ui/web_4.webp"
          onClick={() => router.push('/home')}
          title="Home"
          alt="Torna alla home"
        />

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
          <Image
            src={
              cartHovered
                ? '/images/drops/carrellorosa_optimized.webp'
                : count > 0
                  ? '/images/drops/carrelloverde_optimized.webp'
                  : '/images/drops/carrello_optimized.webp'
            }
            alt="Carrello"
            width={64}
            height={64}
            className="w-full h-full object-contain"
            style={{ transform: 'scale(1.5)' }}
            unoptimized
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
            quote={quote}
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
      <SocialBar socialLinks={socialLinks} />
    </main>
  )
}
