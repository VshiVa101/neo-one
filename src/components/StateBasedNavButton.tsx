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
      animate={{ scale: state === 'hovered' || state === 'pressed' ? 1.5 : 1 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      className="neo-interface-btn w-12 h-12 md:w-16 md:h-16 cursor-pointer rounded-full flex items-center justify-center focus:outline-none p-2"
      style={{
        backgroundColor: state === 'hovered' || state === 'pressed' ? '#F45390' : '#B3828B',
        boxShadow:
          state === 'hovered' || state === 'pressed'
            ? '0 0 30px rgba(244, 83, 144, 0.8), 0 0 60px rgba(244, 83, 144, 0.3)'
            : '0 0 10px rgba(0,0,0,0.3)',
        zIndex: state === 'hovered' || state === 'pressed' ? 401 : undefined,
      }}
      title={title}
    >
      <Image
        src={iconSrc[state]}
        alt={alt}
        width={64}
        height={64}
        className="w-full h-full object-contain"
        style={{ transform: 'scale(1.5)' }}
        unoptimized
      />
    </motion.button>
  )
}
