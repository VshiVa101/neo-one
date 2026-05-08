'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandedTitle } from '@/components/BrandedTitle'

interface DeckHeaderProps {
  title: string
  isActive: boolean
}

export const DeckHeader = ({ title, isActive }: DeckHeaderProps) => {
  return (
    <div className="text-center z-50 mb-[12vh] lg:mb-[10vh] h-[2rem] flex items-center justify-center shrink-0 pointer-events-none">
      <AnimatePresence>
        {isActive && (
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-neo text-white text-[6vw] lg:text-[1.8vw] xl:text-[1.5vw] tracking-widest drop-shadow-md leading-none"
          >
            <BrandedTitle text={title} />
          </motion.h3>
        )}
      </AnimatePresence>
    </div>
  )
}
