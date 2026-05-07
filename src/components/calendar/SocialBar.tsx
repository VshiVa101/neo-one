'use client'

import { motion } from 'framer-motion'
import { Instagram, Music, Youtube, Twitter } from 'lucide-react'
import type { SocialLink } from '@/data/calendar-mock'
import { mockSocialLinks } from '@/data/calendar-mock'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Instagram,
  Music,
  Youtube,
  Twitter,
}

export function SocialBar() {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[400] bg-black/90 backdrop-blur-md border-t border-[#222]"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-8 md:gap-12">
        {mockSocialLinks.map((link: SocialLink, i: number) => {
          const Icon = iconMap[link.icon] || Instagram
          return (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <Icon
                size={20}
                className="text-[#a0a0a0] group-hover:text-[#39ff14] transition-colors duration-300"
              />
              <span className="font-mono text-[10px] text-[#555] group-hover:text-[#39ff14] transition-colors duration-300 tracking-wider uppercase hidden md:block">
                {link.name}
              </span>
            </motion.a>
          )
        })}
      </div>
    </motion.div>
  )
}
