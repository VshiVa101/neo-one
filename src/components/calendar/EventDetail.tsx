'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { NeoEvent } from '@/data/calendar-mock'

interface EventDetailProps {
  event: NeoEvent
  onClose: () => void
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-[#333]"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1, y: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 gap-1 p-1">
          {event.details.images.map((img, i) => (
            <div
              key={img}
              className={`relative aspect-square overflow-hidden ${
                i === 0 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover grayscale-[60%]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        <div className="px-6 py-6 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[#39ff14] text-sm tracking-widest uppercase">
                {event.month} {event.date}, {event.year}
              </p>
              <h2 className="font-neo text-white text-2xl md:text-4xl tracking-widest uppercase mt-1">
                {event.details.headline}
              </h2>
              {event.details.subheadline && (
                <p className="font-mono text-[#a0a0a0] text-sm mt-2 tracking-wide">
                  {event.details.subheadline}
                </p>
              )}
            </div>

            {event.isPreOrder && event.label && (
              <span className="flex-shrink-0 bg-[#39ff14] text-black font-mono text-xs px-3 py-1 tracking-wider uppercase">
                {event.label}
              </span>
            )}
          </div>

          <p className="font-mono text-[#a0a0a0] text-sm leading-relaxed mt-6 tracking-wide">
            {event.details.description}
          </p>

          {event.details.stickers.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {event.details.stickers.map((sticker) => (
                <Image
                  key={sticker}
                  src={sticker}
                  alt="sticker"
                  width={48}
                  height={48}
                  className="object-contain rotate-[-5deg]"
                />
              ))}
            </div>
          )}

          {event.details.comicBubble && (
            <div className="mt-6 bg-[#39ff14] text-black font-mono text-sm p-3 inline-block relative">
              {event.details.comicBubble}
              <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#39ff14]" />
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center bg-[#39ff14] text-black font-mono text-lg hover:bg-white transition-colors duration-200"
        >
          X
        </button>
      </motion.div>
    </motion.div>
  )
}
