'use client'

import React, { createContext, useContext, useRef, useState, useCallback } from 'react'

const BG_MUSIC_URL = 'https://res.cloudinary.com/dhk3bdk5q/video/upload/v1778683868/audio/background-music.mp3'

interface AudioContextType {
  isMuted: boolean
  isPlaying: boolean
  toggleMute: () => void
  startBackgroundMusic: () => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) throw new Error('useAudio must be used within an AudioProvider')
  return context
}

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startBackgroundMusic = useCallback(() => {
    if (audioRef.current) return

    const audio = new Audio(BG_MUSIC_URL)
    audio.loop = true
    audio.volume = 0.5

    audio.play().then(() => {
      setIsPlaying(true)
    }).catch(() => {})

    audioRef.current = audio
  }, [])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return

    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    audioRef.current.muted = nextMuted
  }, [isMuted])

  return (
    <AudioContext.Provider value={{ isMuted, isPlaying, toggleMute, startBackgroundMusic }}>
      {children}
    </AudioContext.Provider>
  )
}
