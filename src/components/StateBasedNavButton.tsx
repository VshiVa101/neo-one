'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface StateBasedNavButtonProps {
  defaultIcon: string
  hoverIcon: string
  activeIcon: string
  onClick: () => void
  title: string
  alt?: string
}

type ButtonState = 'idle' | 'hovered' | 'pressed'

export function StateBasedNavButton({
  defaultIcon,
  hoverIcon,
  activeIcon,
  onClick,
  title,
  alt = '',
}: StateBasedNavButtonProps) {
  const [state, setState] = useState<ButtonState>('idle')

  const iconSrc: Record<ButtonState, string> = {
    idle: defaultIcon,
    hovered: hoverIcon,
    pressed: activeIcon,
  }

  const handleMouseEnter = useCallback(() => {
    setState((prev) => (prev === 'pressed' ? 'pressed' : 'hovered'))
  }, [])

  const handleMouseLeave = useCallback(() => {
    setState('idle')
  }, [])

  const handleMouseDown = useCallback(() => {
    setState('pressed')
  }, [])

  const handleMouseUp = useCallback(() => {
    setState('hovered')
  }, [])

  return (
    <motion.button
      whileHover="hover"
      initial="idle"
      animate="idle"
      variants={{
        idle: { scale: 1, y: 0 },
        hover: { scale: 1.2, y: -3 }
      }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] lg:w-[46px] lg:h-[46px] relative cursor-pointer focus:outline-none"
      title={title}
    >
      <motion.div
        variants={{
          idle: { scale: 1, filter: 'brightness(1) drop-shadow(0 0 8px rgba(0,0,0,0.5))' },
          hover: { scale: 1.15, filter: 'brightness(1.3) drop-shadow(0 0 10px rgba(255,255,255,0.95))' }
        }}
        className="w-full h-full relative"
      >
        <Image
          src={iconSrc[state]}
          alt={alt}
          fill
          className="object-contain transition-all duration-300"
          unoptimized
        />
      </motion.div>
    </motion.button>
  )
}
