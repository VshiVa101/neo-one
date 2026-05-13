'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { useAudio } from '@/contexts/AudioContext'

const VOLUME_ICON_URL = 'https://res.cloudinary.com/dhk3bdk5q/image/upload/v1778683869/ui/volume-icon.webp'

export const AudioBackground = () => {
  const { isMuted, isPlaying, toggleMute } = useAudio()

  if (!isPlaying) return null

  return (
    <button
      onClick={toggleMute}
      className={[
        'fixed top-3 right-3 z-[9999]',
        'w-8 h-8',
        'flex items-center justify-center',
        'rounded-full',
        'bg-[#fc5896]/15 backdrop-blur-sm',
        'border-0 cursor-pointer p-0',
        'transition-all duration-300 ease-out',
        'hover:bg-[#fc5896]/25 hover:shadow-[0_0_10px_rgba(252,88,150,0.25)]',
        'active:scale-90',
        'select-none',
        'group',
      ].join(' ')}
      aria-label={isMuted ? 'Attiva audio' : 'Disattiva audio'}
      title={isMuted ? 'Attiva audio' : 'Disattiva audio'}
    >
      <Image
        src={VOLUME_ICON_URL}
        alt=""
        width={26}
        height={26}
        className={[
          'transition-all duration-300 ease-out',
          isMuted ? 'opacity-30 scale-90' : 'opacity-90 scale-100',
          'group-hover:scale-110',
        ].join(' ')}
        unoptimized
      />
    </button>
  )
}
