'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

interface SocialBarProps {
  socialLinks?: Array<{
    id: string
    icon: string
    url: string
    label: string
  }>
}

export function SocialBar({ socialLinks }: SocialBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  if (!socialLinks || socialLinks.length === 0) return null

  return (
    <motion.div
      className="fixed bottom-4 left-0 right-0 z-[400] flex justify-center pointer-events-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.8 }}
    >
      <div 
        ref={containerRef}
        className="w-full max-w-2xl px-12 overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing"
      >
        <motion.div 
          className="flex items-center justify-center gap-6 md:gap-8 py-2 w-max mx-auto"
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.2}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        >
          {socialLinks.map((link, i: number) => {
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group flex-shrink-0"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ y: -5, scale: 1.1 }}
                // Prevent drag from triggering click if moved significantly
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="w-[3.3rem] h-[3.3rem] md:w-[4.4rem] md:h-[4.4rem] relative">
                  <Image
                    src={link.icon}
                    alt={link.label}
                    fill
                    className="object-contain transition-all duration-300 drop-shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                    unoptimized
                  />
                </div>
              </motion.a>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}
