'use client'

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

const BG_MUSIC_URL = '/media/banana.mp3'
const DEFAULT_VOLUME = 0.5
const LS_ACTIVATED = 'neo-audio-activated'
const LS_MUTED = 'neo-audio-muted'

interface AudioContextType {
  isMuted: boolean
  isPlaying: boolean
  toggleMute: () => void
  primeBackgroundMusic: () => void
  unmuteMusic: () => void
  fadeOutAndPause: () => void
  restartFromStart: () => void
  stopMusicImmediately: () => void
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
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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
        if (!muted && typeof window !== 'undefined' && window.location.pathname !== '/') {
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

  const fadeOutAndPause = useCallback(() => {
    if (!audioRef.current) return

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }

    const audio = audioRef.current
    const startVolume = audio.volume
    const steps = 30
    const duration = 1000
    const stepTime = duration / steps
    const volumeStep = startVolume / steps
    let currentStep = 0

    fadeIntervalRef.current = setInterval(() => {
      currentStep++
      const newVolume = Math.max(0, startVolume - volumeStep * currentStep)
      audio.volume = newVolume

      if (currentStep >= steps || newVolume <= 0) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current)
          fadeIntervalRef.current = null
        }
        audio.volume = 0
        audio.pause()
        setIsPlaying(false)
        setIsMuted(true)
        try {
          localStorage.setItem(LS_MUTED, 'true')
        } catch {}
      }
    }, stepTime)
  }, [])

  const restartFromStart = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }

    if (!audioRef.current) {
      const audio = new Audio(BG_MUSIC_URL)
      audio.loop = true
      audio.volume = 0
      audioRef.current = audio
      primedRef.current = true
    }

    const audio = audioRef.current!
    audio.currentTime = 0
    audio.volume = 0
    audio.play().catch(() => {})

    const steps = 30
    const duration = 1000
    const stepTime = duration / steps
    const volumeStep = DEFAULT_VOLUME / steps
    let currentStep = 0

    fadeIntervalRef.current = setInterval(() => {
      currentStep++
      const newVolume = Math.min(DEFAULT_VOLUME, volumeStep * currentStep)
      audio.volume = newVolume

      if (currentStep >= steps || newVolume >= DEFAULT_VOLUME) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current)
          fadeIntervalRef.current = null
        }
        audio.volume = DEFAULT_VOLUME
      }
    }, stepTime)

    setIsMuted(false)
    setIsPlaying(true)
    try {
      localStorage.setItem(LS_ACTIVATED, 'true')
      localStorage.setItem(LS_MUTED, 'false')
    } catch {}
  }, [])

  const stopMusicImmediately = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }

    if (!audioRef.current) return

    audioRef.current.volume = 0
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
    setIsMuted(true)
    try {
      localStorage.setItem(LS_MUTED, 'true')
    } catch {}
  }, [])

  return (
    <AudioContext.Provider value={{ isMuted, isPlaying, toggleMute, primeBackgroundMusic, unmuteMusic, fadeOutAndPause, restartFromStart, stopMusicImmediately }}>
      {children}
    </AudioContext.Provider>
  )
}
