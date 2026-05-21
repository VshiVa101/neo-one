'use client'

import { useEffect } from 'react'
import { tryPlayRandomClickSound } from '@/utilities/randomClickSounds'
import { useAudio } from '@/contexts/AudioContext'

export function ClickSoundListener() {
  const { isPlaying, isMuted } = useAudio()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isPlaying && !isMuted) {
        tryPlayRandomClickSound(e)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [isPlaying, isMuted])

  return null
}
