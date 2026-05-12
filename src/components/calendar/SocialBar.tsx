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
  const hasDragged = useRef(false)
  
  if (!socialLinks || socialLinks.length === 0) return null

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[400] w-full max-w-[95vw] pointer-events-none overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.8 }}
    >
      <div 
        ref={containerRef}
        className="w-full flex justify-center pointer-events-auto"
      >
        <motion.div 
          drag="x"
          dragConstraints={containerRef}
          onDragStart={() => { hasDragged.current = true }}
          onDragEnd={() => {
            setTimeout(() => { hasDragged.current = false }, 0)
          }}
          className="flex items-center gap-6 md:gap-8 py-4 px-10 w-max cursor-grab active:cursor-grabbing select-none"
        >
          {socialLinks.map((link, i: number) => {
            return (
              <motion.div
                key={link.id}
                className="relative group flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  scale: { delay: 0.9 + i * 0.1 },
                  opacity: { delay: 0.9 + i * 0.1 },
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 10 
                }}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onClick={(e) => {
                    if (hasDragged.current) {
                      e.preventDefault()
                      e.stopPropagation()
                      hasDragged.current = false
                    }
                  }}
                  style={{ WebkitUserDrag: 'none' } as React.CSSProperties}
                  className="block w-[3rem] h-[3rem] md:w-[4rem] md:h-[4rem] relative
                    transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    group-hover:-translate-y-2 group-hover:scale-110 group-hover:brightness-125
                    drop-shadow-[0_0_15px_rgba(0,0,0,0.4)] select-none"
                >
                  <Image
                    src={link.icon}
                    alt={link.label}
                    fill
                    draggable={false}
                    className="object-contain"
                    unoptimized
                  />
                </a>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}
