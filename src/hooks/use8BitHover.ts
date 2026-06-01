'use client'

import { useRef, useCallback, useEffect } from 'react'
import { useAudio } from '@/contexts/AudioContext'

let sharedAudioCtx: AudioContext | null = null

export type HoverNoteType = 'D#6' | 'E6' | 'A6'

export function use8BitHover() {
  const { isMuted } = useAudio()
  
  const isPlayingRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  const droneOscRef = useRef<OscillatorNode | null>(null)
  const arpOscRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const initAudio = () => {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume()
    }
    return sharedAudioCtx
  }

  const startHoverSound = useCallback((noteType: HoverNoteType = 'D#6') => {
    if (isMuted) return
    const ctx = initAudio()
    
    if (isPlayingRef.current) return
    isPlayingRef.current = true
    
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.05 // Keep it low, 8-bit can be piercing
    masterGain.connect(ctx.destination)
    gainNodeRef.current = masterGain

    // Base D#6 Major (Tonic)
    let droneFreq = 155.56 // D#3
    let notes = [1244.51, 1567.98, 1864.66, 2489.02, 1864.66, 1567.98] 
    
    if (noteType === 'E6') {
      // E6 Minor (Minor second)
      droneFreq = 164.81 // E3
      notes = [1318.51, 1567.98, 1975.53, 2637.02, 1975.53, 1567.98] 
    } else if (noteType === 'A6') {
      // A6 Diminished 7 (Diminished fifth)
      droneFreq = 220.00 // A3
      notes = [1760.00, 2093.00, 2489.02, 2960.00, 2489.02, 2093.00] 
    }

    const droneOsc = ctx.createOscillator()
    droneOsc.type = 'sawtooth'
    droneOsc.frequency.value = droneFreq
    
    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.8
    droneOsc.connect(droneGain)
    droneGain.connect(masterGain)
    droneOsc.start()
    droneOscRef.current = droneOsc

    const arpOsc = ctx.createOscillator()
    arpOsc.type = 'square'
    
    const arpGain = ctx.createGain()
    arpGain.gain.value = 0.4
    arpOsc.connect(arpGain)
    arpGain.connect(masterGain)
    arpOsc.start()
    arpOscRef.current = arpOsc

    let step = 0
    const speedMs = 70 // Speed of the arpeggio
    
    // Set initial note
    arpOsc.frequency.setValueAtTime(notes[0], ctx.currentTime)

    intervalRef.current = setInterval(() => {
      if (!isPlayingRef.current) return
      
      const freq = notes[step % notes.length]
      arpOsc.frequency.setValueAtTime(freq, ctx.currentTime)
      
      // Pulse drone
      droneGain.gain.setValueAtTime(step % 2 === 0 ? 0.9 : 0.4, ctx.currentTime)
      
      step++
    }, speedMs)

  }, [isMuted])

  const stopHoverSound = useCallback(() => {
    if (!isPlayingRef.current) return
    isPlayingRef.current = false

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (gainNodeRef.current && sharedAudioCtx) {
      const gain = gainNodeRef.current.gain
      const ctx = sharedAudioCtx
      gain.setValueAtTime(gain.value, ctx.currentTime)
      gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      
      const dOsc = droneOscRef.current
      const aOsc = arpOscRef.current
      const gNode = gainNodeRef.current

      setTimeout(() => {
        try {
          if (dOsc) { dOsc.stop(); dOsc.disconnect(); }
          if (aOsc) { aOsc.stop(); aOsc.disconnect(); }
          if (gNode) { gNode.disconnect(); }
        } catch(e) {}
      }, 150)
      
      droneOscRef.current = null
      arpOscRef.current = null
      gainNodeRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopHoverSound()
    }
  }, [stopHoverSound])

  return { startHoverSound, stopHoverSound }
}
