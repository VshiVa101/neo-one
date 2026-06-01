'use client'

import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
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
import { useInputMode } from '@/contexts/InputModeContext'
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

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const CalendarYearCard = ({ 
  currentYear, 
  eventsByMonth, 
  quote, 
  setActiveEvent, 
  canGoNext, 
  canGoPrev, 
  animatingNext, 
  animatingPrev, 
  handleNextClick, 
  handlePrevClick, 
  nudgeActive 
}: any) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const topHoleRef = useRef<HTMLDivElement>(null)
  const bottomHoleRef = useRef<HTMLDivElement>(null)
  const [paperHoles, setPaperHoles] = useState<{ top: number, left: number, width: number, height: number }[]>([])

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current
    const topHole = topHoleRef.current
    const bottomHole = bottomHoleRef.current

    if (!container || !topHole || !bottomHole) return

    const measure = () => {
      const getRelativeOffset = (element: HTMLElement, targetParent: HTMLElement) => {
        let top = 0
        let left = 0
        let curr: HTMLElement | null = element
        let found = false
        while (curr) {
          if (curr === targetParent) {
            found = true
            break
          }
          top += curr.offsetTop
          left += curr.offsetLeft
          curr = curr.offsetParent as HTMLElement | null
        }
        if (!found) {
          const targetRect = targetParent.getBoundingClientRect()
          const elemRect = element.getBoundingClientRect()
          return {
            top: elemRect.top - targetRect.top,
            left: elemRect.left - targetRect.left
          }
        }
        return { top, left }
      }

      const topOffset = getRelativeOffset(topHole, container)
      const bottomOffset = getRelativeOffset(bottomHole, container)

      setPaperHoles([
        {
          top: topOffset.top,
          left: topOffset.left,
          width: topHole.offsetWidth,
          height: topHole.offsetHeight,
        },
        {
          top: bottomOffset.top,
          left: bottomOffset.left,
          width: bottomHole.offsetWidth,
          height: bottomHole.offsetHeight,
        }
      ])
    }

    measure()

    const observer = new ResizeObserver(() => measure())
    observer.observe(container)
    if (topHole.parentElement) {
      observer.observe(topHole.parentElement)
    }

    window.addEventListener('resize', measure)
    const t1 = setTimeout(measure, 100)
    const t2 = setTimeout(measure, 400)
    const t3 = setTimeout(measure, 1000)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [currentYear])

  return (
    <TornPaper holes={paperHoles} className="px-4 py-8 md:px-8 md:py-12">
      {/* Reference container for accurate hole measurement */}
      <div ref={containerRef} className="w-full h-full relative">
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

        <div className="flex flex-col items-center justify-center mt-12 mb-16 md:mt-16 md:mb-24 py-4 relative w-full gap-6">
          {/* Top Arrow Wrapper (Rectangular Hole) */}
          <div ref={topHoleRef} className="relative w-[200px] md:w-[280px] h-[8px] mx-auto">
            {/* The hole is now physically punched in the background using SVG masking! */}
            
            {/* Arrow container with inner shadow - overflow-visible to let arrow rest on paper */}
            <div className="absolute inset-0 overflow-visible flex justify-center items-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.95)] border border-[#111]/50 rounded-[2px] pointer-events-none">
              <div 
                className="pointer-events-auto flex justify-center items-center w-full h-full"
                style={{
                  clipPath: 'polygon(-1000% -10000%, 1000% -10000%, 1000% 100%, -1000% 100%)',
                  WebkitClipPath: 'polygon(-1000% -10000%, 1000% -10000%, 1000% 100%, -1000% 100%)',
                  overflow: 'visible'
                }}
              >
                <motion.button
                  initial="idle"
                  animate={animatingNext ? "click" : (canGoNext ? "idle" : "hidden")}
                  whileHover={canGoNext && !animatingNext ? "hover" : undefined}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    idle: { 
                      opacity: 1, 
                      y: nudgeActive ? [-6, -16, -2, -8, -6] : -6,
                      transition: nudgeActive ? {
                        duration: 1.0,
                        times: [0, 0.25, 0.5, 0.75, 1],
                        ease: "easeInOut"
                      } : undefined
                    }, // Shifts UP so tip rests on paper, base enters hole (with periodic elastic wiggle)
                    hover: { opacity: 1, y: -16 }, // Slides further UP on top of paper
                    click: { opacity: 1, y: -26 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={handleNextClick}
                  className="flex items-center justify-center focus:outline-none disabled:cursor-default"
                  disabled={!canGoNext || animatingNext}
                >
                  <Image 
                    src="/images/ui/web_1.webp" 
                    alt="Prossimo Anno" 
                    width={110} 
                    height={65} 
                    className="rotate-90 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                    unoptimized
                  />
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Container for Year */}
          <div className="relative py-0 w-full flex justify-center items-center">
            {/* Eraser text to punch hole in TornPaper */}
            <h2 
              className="font-neo text-4xl md:text-6xl tracking-[0.3em] leading-none flex items-center justify-center -mr-[0.3em] font-bold text-white m-0 p-0"
              style={{
                transform: 'translateZ(0)'
              }}
            >
              <BrandedTitle text={currentYear.toString()} />
            </h2>
            {/* Optional shadow overlay to maintain depth/legibility */}
            <h2 
              className="absolute font-neo text-4xl md:text-6xl tracking-[0.3em] leading-none flex items-center justify-center -mr-[0.3em] font-bold pointer-events-none text-white m-0 p-0"
              style={{
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'
              }}
              aria-hidden="true"
            >
              <BrandedTitle text={currentYear.toString()} />
            </h2>
          </div>

          {/* Bottom Arrow Wrapper (Rectangular Hole) */}
          <div ref={bottomHoleRef} className="relative w-[200px] md:w-[280px] h-[8px] mx-auto">
            {/* The hole is now physically punched in the background using SVG masking! */}
            
            <div className="absolute inset-0 overflow-visible flex justify-center items-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.95)] border border-[#111]/50 rounded-[2px] pointer-events-none">
              <div 
                className="pointer-events-auto flex justify-center items-center w-full h-full"
                style={{
                  clipPath: 'polygon(-1000% 0%, 1000% 0%, 1000% 10000%, -1000% 10000%)',
                  WebkitClipPath: 'polygon(-1000% 0%, 1000% 0%, 1000% 10000%, -1000% 10000%)',
                  overflow: 'visible'
                }}
              >
                <motion.button
                  initial="idle"
                  animate={animatingPrev ? "click" : (canGoPrev ? "idle" : "hidden")}
                  whileHover={canGoPrev && !animatingPrev ? "hover" : undefined}
                  variants={{
                    hidden: { opacity: 0, y: -30 },
                    idle: { 
                      opacity: 1, 
                      y: nudgeActive ? [6, 16, 2, 8, 6] : 6,
                      transition: nudgeActive ? {
                        duration: 1.0,
                        times: [0, 0.25, 0.5, 0.75, 1],
                        ease: "easeInOut"
                      } : undefined
                    }, // Shifts DOWN so base rests on paper, tip enters hole (with periodic elastic wiggle)
                    hover: { opacity: 1, y: 16 }, // Slides further DOWN on top of paper
                    click: { opacity: 1, y: 26 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={handlePrevClick}
                  className="flex items-center justify-center focus:outline-none disabled:cursor-default"
                  disabled={!canGoPrev || animatingPrev}
                >
                  <Image 
                    src="/images/ui/web.webp" 
                    alt="Anno Precedente" 
                    width={110} 
                    height={65} 
                    className="rotate-90 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                    unoptimized
                  />
                </motion.button>
              </div>
            </div>
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
              events={events as NeoEvent[]}
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
      </div>
    </TornPaper>
  )
}

export default function CalendarClient({ initialEvents, initialEventId, quote, socialLinks }: CalendarClientProps) {
  const { isTouchMode } = useInputMode()
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
  
  const [nudgeActive, setNudgeActive] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const interval = setInterval(() => {
      setNudgeActive(true)
      timeout = setTimeout(() => setNudgeActive(false), 1000)
    }, 4000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])
  
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
          <div className="w-full max-w-3xl mx-auto md:mx-0 md:ml-auto md:mr-12 lg:mr-24 pl-8 pr-24 md:pl-16 md:pr-4 lg:pl-24 lg:pr-8 pt-[18vh] md:pt-[28vh] pb-32 flex flex-col items-center">
        
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
            <CalendarYearCard 
              currentYear={currentYear}
              eventsByMonth={eventsByMonth}
              quote={quote}
              setActiveEvent={setActiveEvent}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
              animatingNext={animatingNext}
              animatingPrev={animatingPrev}
              handleNextClick={handleNextClick}
              handlePrevClick={handlePrevClick}
              nudgeActive={nudgeActive}
            />
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
          // Spacer that exactly matches the icon bar width/height to keep flex layout perfectly centered
          <div className="relative flex justify-center items-center w-[72px] h-[72px] md:w-[88px] md:h-[88px] lg:w-[110px] lg:h-[110px] flex-shrink-0 z-50">
            {/* Absolute container that holds the Canvas at a large physical resolution to prevent pixelation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] md:w-[180px] md:h-[180px]">
              <EyeScene
                targetRoute="/home"
                showCircularText={false}
                globalTracking={true}
                scaleMultiplier={isTouchMode ? 1.5 : 1.1}
              />
            </div>
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
