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
      className="group relative flex-shrink-0 w-[120px] md:w-[160px] cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={event.thumbnail}
          alt={event.details.headline}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          sizes="(max-width: 768px) 120px, 160px"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

        {event.isPreOrder && event.label && (
          <div className="absolute top-0 right-0 bg-[#39ff14] text-black font-mono text-[10px] md:text-xs px-2 py-0.5 tracking-wider uppercase">
            {event.label}
          </div>
        )}
      </div>

      <div className="mt-2 text-center">
        <span className="block font-neo text-2xl md:text-3xl text-[#f5f0e8] tracking-wide group-hover:text-[#39ff14] transition-colors duration-300">
          {event.date}
        </span>
      </div>
    </motion.button>
  )
}
