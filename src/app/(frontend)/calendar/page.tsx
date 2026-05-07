'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeScene } from '@/components/EyeScene'
import { TornPaper } from '@/components/calendar/TornPaper'
import { EventItem } from '@/components/calendar/EventItem'
import { EventDetail } from '@/components/calendar/EventDetail'
import { ContactForm } from '@/components/calendar/ContactForm'
import { SocialBar } from '@/components/calendar/SocialBar'
import { mockEvents, calendarMonths } from '@/data/calendar-mock'
import type { NeoEvent } from '@/data/calendar-mock'
import { Share2, ShoppingCart, Mail } from 'lucide-react'

export default function CalendarPage() {
  const [activeEvent, setActiveEvent] = useState<NeoEvent | null>(null)
  const [isContactOpen, setIsContactOpen] = useState(false)

  const eventsByMonth = useMemo(() => {
    const grouped: Record<string, NeoEvent[]> = {}
    for (const month of calendarMonths) {
      const events = mockEvents.filter((e) => e.month === month)
      if (events.length > 0) {
        grouped[month] = events
      }
    }
    return grouped
  }, [])

  return (
    <main className="w-full min-h-screen relative bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(57,255,20,0.03),transparent_70%)]" />

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
          Vieni a molestarmi dal vivo
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
          <div className="space-y-10">
            {Object.entries(eventsByMonth).map(([month, events], monthIndex) => (
              <motion.div
                key={month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + monthIndex * 0.15 }}
              >
                <h3 className="font-neo text-black/80 text-lg md:text-xl tracking-widest uppercase mb-4 border-b border-black/20 pb-2">
                  {month}
                </h3>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
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
            ))}
          </div>
        </TornPaper>

        {/* Bottom Spacer */}
        <div className="h-16" />
      </div>

      {/* Floating Actions */}
      <motion.div
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[400] flex flex-col gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <motion.button
          className="w-12 h-12 flex items-center justify-center border border-[#39ff14]/30 bg-black/80 text-[#a0a0a0] hover:text-[#39ff14] hover:border-[#39ff14] transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsContactOpen(true)}
          title="Contact"
        >
          <Mail size={18} />
        </motion.button>

        <motion.button
          className="w-12 h-12 flex items-center justify-center border border-[#39ff14]/30 bg-black/80 text-[#a0a0a0] hover:text-[#39ff14] hover:border-[#39ff14] transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
          }}
          title="Share"
        >
          <Share2 size={18} />
        </motion.button>

        <motion.button
          className="w-12 h-12 flex items-center justify-center border border-[#39ff14]/30 bg-black/80 text-[#a0a0a0] hover:text-[#39ff14] hover:border-[#39ff14] transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Cart"
        >
          <ShoppingCart size={18} />
        </motion.button>
      </motion.div>

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
