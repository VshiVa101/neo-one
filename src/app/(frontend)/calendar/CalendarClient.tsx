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
import { CalendarSidePanel } from '@/components/calendar/CalendarSidePanel'
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
      <h3 className="font-neo text-white text-base md:text-lg tracking-widest ml-8 uppercase">
        <BrandedTitle text={month} />
      </h3>
      <motion.div
        ref={containerRef}
        className="p-5 md:p-8 shadow-lg overflow-hidden relative"
        style={{ 
          backgroundImage: `url(/images/textures/row-${(monthIndex % 3) + 1}.webp)`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 + monthIndex * 0.15 }}
      >
        <motion.div 
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.1}
          className="flex gap-3 pt-4 -mt-4 pb-2 w-max cursor-grab active:cursor-grabbing pl-12 md:pl-20 pr-8"
        >
          {events.map((event, eventIndex) => (
            <EventItem
              key={event.id}
              event={event}
              index={eventIndex}
              onTap={() => setActiveEvent(event)}
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
  const [animatingNext, setAnimatingNext] = useState(false)
  const [animatingPrev, setAnimatingPrev] = useState(false)
  
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

  const handleNextClick = async () => {
    if (!canGoNext || animatingNext) return
    setAnimatingNext(true)
    await new Promise(r => setTimeout(r, 300))
    changeYear('next')
    setAnimatingNext(false)
  }

  const handlePrevClick = async () => {
    if (!canGoPrev || animatingPrev) return
    setAnimatingPrev(true)
    await new Promise(r => setTimeout(r, 300))
    changeYear('prev')
    setAnimatingPrev(false)
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
      <div 
        className="fixed z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/images/bg/bg-scroll.gif')",
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          width: '100vh',
          height: '100vw',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(90deg)',
        }}
      />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(57,255,20,0.03),transparent_70%)] z-[1]" />

      {/* EyeScene is now rendered inside CalendarSidePanel */}

      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col md:grid md:grid-cols-4">
        {/* Left 3 Columns: Calendar */}
        <div className="w-full md:col-span-3 flex flex-col justify-start">
          <div className="w-full max-w-3xl mx-auto md:mx-0 md:ml-auto md:mr-12 lg:mr-24 pl-4 pr-24 md:px-4 pt-[18vh] md:pt-[28vh] pb-32 flex flex-col items-center">
        
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
              <div className="text-center mb-4 pt-8 md:pt-14">
                <motion.div
                  className="max-w-xs md:max-w-md mx-auto mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <p 
                    className="font-neo text-white text-base md:text-xl tracking-widest uppercase opacity-95 leading-relaxed"
                    style={{
                      textShadow: '1px 1px 0px #000, -1px 1px 0px #000, 1px -1px 0px #000, -1px -1px 0px #000, 0px 1px 0px #000, 0px -1px 0px #000, 1px 0px 0px #000, -1px 0px 0px #000'
                    }}
                  >
                    <BrandedTitle text={quote || "vieni a molestarmi dal vivo"} />
                  </p>
                </motion.div>

                <div className="flex flex-col items-center justify-center mb-8 mt-4">
                  {/* Top Arrow Wrapper */}
                  <div className="w-full flex justify-center items-end overflow-hidden h-[70px] relative z-0 -mb-[2px]">
                    <motion.button
                      initial="idle"
                      animate={animatingNext ? "click" : (canGoNext ? "idle" : "hidden")}
                      whileHover={canGoNext && !animatingNext ? "hover" : undefined}
                      variants={{
                        hidden: { opacity: 0, y: 70 },
                        idle: { opacity: 1, y: 50 }, // Tip visible
                        hover: { opacity: 1, y: 20 }, // Partially extracted
                        click: { opacity: 1, y: 0 } // Fully extracted
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={handleNextClick}
                      className="flex items-center justify-center focus:outline-none disabled:cursor-default"
                      disabled={!canGoNext || animatingNext}
                    >
                      <Image 
                        src="/images/ui/web_1.webp" 
                        alt="Prossimo Anno" 
                        width={85} 
                        height={50} 
                        className="rotate-90 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                        unoptimized
                      />
                    </motion.button>
                  </div>
                  
                  {/* Container for Year (Tighter) */}
                  <div className="relative z-10 bg-[#0a0a0a] shadow-[0_-15px_20px_-5px_rgba(57,255,20,0.5),0_15px_20px_-5px_rgba(57,255,20,0.5)] border-y border-[#39FF14]/30">
                    <h2 className="font-neo text-white text-3xl md:text-5xl tracking-[0.3em] leading-none flex items-center justify-center -mr-[0.3em]">
                      <BrandedTitle text={currentYear.toString()} />
                    </h2>
                  </div>

                  {/* Bottom Arrow Wrapper */}
                  <div className="w-full flex justify-center items-start overflow-hidden h-[70px] relative z-0 -mt-[2px]">
                    <motion.button
                      initial="idle"
                      animate={animatingPrev ? "click" : (canGoPrev ? "idle" : "hidden")}
                      whileHover={canGoPrev && !animatingPrev ? "hover" : undefined}
                      variants={{
                        hidden: { opacity: 0, y: -70 },
                        idle: { opacity: 1, y: -50 },
                        hover: { opacity: 1, y: -20 },
                        click: { opacity: 1, y: 0 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={handlePrevClick}
                      className="flex items-center justify-center focus:outline-none disabled:cursor-default"
                      disabled={!canGoPrev || animatingPrev}
                    >
                      <Image 
                        src="/images/ui/web.webp" 
                        alt="Anno Precedente" 
                        width={85} 
                        height={50} 
                        className="rotate-90 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                        unoptimized
                      />
                    </motion.button>
                  </div>
                </div>
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
                    <p className="font-neo text-white/30 text-sm tracking-widest uppercase">
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
        </div>

        {/* Right Column: Spacing placeholder to prevent calendar from overlapping sidebar */}
        <div className="hidden md:block w-full md:col-span-1 pointer-events-none" />
      </div>

      {/* Side Panel (Fixed position, works on both mobile and desktop) */}
      <CalendarSidePanel 
        socialLinks={socialLinks} 
        eyeComponent={
          <div className="relative w-[130px] h-[130px] md:w-[160px] md:h-[160px] flex-shrink-0">
            <EyeScene
              targetRoute="/home"
              showCircularText={false}
              globalTracking={true}
              scaleMultiplier={1.1}
            />
          </div>
        }
      />

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
    </main>
  )
}
