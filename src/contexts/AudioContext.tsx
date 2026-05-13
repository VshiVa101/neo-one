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
  const primedRef = useRef(false)

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
    if (!isPlaying) setIsPlaying(true)
  }, [isPlaying])

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
