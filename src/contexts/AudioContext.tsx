'use client'

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

const BG_MUSIC_URL = 'https://res.cloudinary.com/dhk3bdk5q/video/upload/v1778683868/audio/background-music.mp3'
const DEFAULT_VOLUME = 0.5
const LS_ACTIVATED = 'neo-audio-activated'
const LS_MUTED = 'neo-audio-muted'

interface AudioContextType {
  isMuted: boolean
  isPlaying: boolean
  toggleMute: () => void
  primeBackgroundMusic: () => void
  unmuteMusic: () => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) throw new Error('useAudio must be used within an AudioProvider')
  return context
}

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const primedRef = useRef(false)

  // Restore persisted state on mount
  // Replica il flusso primeBackgroundMusic + unmuteMusic per far ripartire
  // l'audio dopo un refresh, con fallback al primo gesto utente se autoplay è bloccato.
  useEffect(() => {
    try {
      const activated = localStorage.getItem(LS_ACTIVATED)
      if (activated !== 'true') return

      const muted = localStorage.getItem(LS_MUTED) !== 'false'
      setIsMuted(muted)
      setIsPlaying(true)

      const audio = new Audio(BG_MUSIC_URL)
      audio.loop = true
      audio.volume = 0
      audioRef.current = audio
      primedRef.current = true

      const startPlayback = () => {
        if (!muted) {
          audio.volume = DEFAULT_VOLUME
          audio.currentTime = 0
          audio.play().catch(() => {})
        }
      }

      // Prime: play silenzioso per caricare il buffer, poi riproduci se non muto
      audio.play().then(() => {
        audio.pause()
        audio.currentTime = 0
        startPlayback()
      }).catch(() => {
        // Prime bloccato (autoplay policy) — riprova al primo gesto utente
        const onInteraction = () => {
          audio.play().then(() => {
            audio.pause()
            audio.currentTime = 0
            startPlayback()
          }).catch(() => {})
          document.removeEventListener('click', onInteraction)
          document.removeEventListener('touchstart', onInteraction)
        }
        document.addEventListener('click', onInteraction)
        document.addEventListener('touchstart', onInteraction)
      })
    } catch {}
  }, [])

  const primeBackgroundMusic = useCallback(() => {
    if (primedRef.current) return

    const audio = new Audio(BG_MUSIC_URL)
    audio.loop = true
    audio.volume = 0

    audio.play().then(() => {
      audio.pause()
      audio.currentTime = 0
    }).catch(() => {})

    audioRef.current = audio
    primedRef.current = true
  }, [])

  const unmuteMusic = useCallback(() => {
    if (!audioRef.current) return

    audioRef.current.currentTime = 0
    audioRef.current.volume = DEFAULT_VOLUME
    audioRef.current.play().catch(() => {})
    setIsMuted(false)
    setIsPlaying(true)
    try {
      localStorage.setItem(LS_ACTIVATED, 'true')
      localStorage.setItem(LS_MUTED, 'false')
    } catch {}
  }, [])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return

    const nextMuted = !isMuted
    audioRef.current.volume = nextMuted ? 0 : DEFAULT_VOLUME
    setIsMuted(nextMuted)
    try {
      localStorage.setItem(LS_MUTED, String(nextMuted))
    } catch {}
  }, [isMuted])

  return (
    <AudioContext.Provider value={{ isMuted, isPlaying, toggleMute, primeBackgroundMusic, unmuteMusic }}>
      {children}
    </AudioContext.Provider>
  )
}
