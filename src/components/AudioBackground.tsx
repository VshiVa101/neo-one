'use client'

import React from 'react'
import Image from 'next/image'
import { useAudio } from '@/contexts/AudioContext'

const VOLUME_ICON_URL = 'https://res.cloudinary.com/dhk3bdk5q/image/upload/v1778683869/ui/volume-icon.webp'

export const AudioBackground = () => {
  const { isMuted, isPlaying, toggleMute } = useAudio()

  if (!isPlaying) return null

  return (
    <button
      onClick={toggleMute}
      className="fixed top-3 right-3 z-[9999] w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-150 select-none border-0 cursor-pointer p-0"
      aria-label={isMuted ? 'Attiva audio' : 'Disattiva audio'}
      title={isMuted ? 'Attiva audio' : 'Disattiva audio'}
    >
      <Image
        src={VOLUME_ICON_URL}
        alt=""
        width={20}
        height={20}
        className={`transition-opacity duration-150 ${isMuted ? 'opacity-30' : 'opacity-90'}`}
        unoptimized
      />
    </button>
  )
}
