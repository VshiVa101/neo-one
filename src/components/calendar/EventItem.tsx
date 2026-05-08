'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { NeoEvent } from '@/data/calendar-mock'

interface EventItemProps {
  event: NeoEvent
  onClick: () => void
  index: number
}

export function EventItem({ event, onClick, index }: EventItemProps) {
  return (
    <motion.button
      className="group relative flex-shrink-0 w-[54px] md:w-[75px] cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="mb-1 text-center">
        <span className="block font-neo text-[11px] md:text-sm text-[#39ff14] tracking-wide transition-colors duration-300">
          {event.date}
        </span>
      </div>

      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={event.thumbnail}
          alt={event.details.headline}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 54px, 75px"
        />
      </div>
    </motion.button>
  )
}
