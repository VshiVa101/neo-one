'use client'

import React, { createContext, useContext, useRef, useState, useCallback } from 'react'

const BG_MUSIC_URL = 'https://res.cloudinary.com/dhk3bdk5q/video/upload/v1778683868/audio/background-music.mp3'
const DEFAULT_VOLUME = 0.5

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

  const primeBackgroundMusic = useCallback(() => {
    if (audioRef.current) return

    const audio = new Audio(BG_MUSIC_URL)
    audio.loop = true
    audio.volume = 0

    audio.play().then(() => {
      setIsPlaying(true)
    }).catch(() => {})

    audioRef.current = audio
  }, [])

  const unmuteMusic = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.volume = DEFAULT_VOLUME
    setIsMuted(false)
  }, [])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = DEFAULT_VOLUME
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }, [isMuted])

  return (
    <AudioContext.Provider value={{ isMuted, isPlaying, toggleMute, primeBackgroundMusic, unmuteMusic }}>
      {children}
    </AudioContext.Provider>
  )
}
