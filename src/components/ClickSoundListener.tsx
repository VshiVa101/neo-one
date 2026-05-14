'use client'

import { useEffect } from 'react'
import { tryPlayRandomClickSound } from '@/utilities/randomClickSounds'

export function ClickSoundListener() {
  useEffect(() => {
    const handler = (e: MouseEvent) => tryPlayRandomClickSound(e)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return null
}
