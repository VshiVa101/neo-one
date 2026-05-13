'use client'

import { useEffect, useRef, useCallback } from 'react'

export function useCrtStaticNoise() {
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<{
    noise: AudioBufferSourceNode
    hum: OscillatorNode
    buzz: OscillatorNode
  } | null>(null)

  const start = useCallback(() => {
    if (ctxRef.current) return

    const ctx = new AudioContext()
    ctxRef.current = ctx

    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1200
    filter.Q.value = 0.8

    const gain = ctx.createGain()
    gain.gain.value = 0.035

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start()

    const hum = ctx.createOscillator()
    hum.type = 'sine'
    hum.frequency.value = 50
    const humGain = ctx.createGain()
    humGain.gain.value = 0.012
    hum.connect(humGain)
    humGain.connect(ctx.destination)
    hum.start()

    const buzz = ctx.createOscillator()
    buzz.type = 'sine'
    buzz.frequency.value = 100
    const buzzGain = ctx.createGain()
    buzzGain.gain.value = 0.006
    buzz.connect(buzzGain)
    buzzGain.connect(ctx.destination)
    buzz.start()

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    nodesRef.current = { noise, hum, buzz }
  }, [])

  const stop = useCallback(() => {
    if (nodesRef.current) {
      try { nodesRef.current.noise.stop() } catch {}
      try { nodesRef.current.hum.stop() } catch {}
      try { nodesRef.current.buzz.stop() } catch {}
      nodesRef.current = null
    }
    if (ctxRef.current && ctxRef.current.state !== 'closed') {
      ctxRef.current.close()
    }
    ctxRef.current = null
  }, [])

  useEffect(() => {
    return () => stop()
  }, [stop])

  return { start, stop }
}
