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
      className="fixed left-6 top-1/2 -translate-y-1/2 z-[400] flex flex-col pointer-events-none"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.8 }}
    >
      <div 
        ref={containerRef}
        className="flex flex-col items-center pointer-events-auto"
      >
        <motion.div 
          className="flex flex-col items-center gap-6 md:gap-7 py-4"
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
                transition={{ 
                  scale: { delay: 0.9 + i * 0.1 },
                  opacity: { delay: 0.9 + i * 0.1 }
                }}
                whileHover={{ 
                  x: 8, 
                  scale: 1.2,
                  filter: 'brightness(1.3)',
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 10 
                }}
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
