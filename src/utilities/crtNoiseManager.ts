const FRUSCIO_URL = '/media/fruscio-satanico.mp3'
const FRUSCIO_VOLUME = 0.9

let ctx: AudioContext | null = null
let noiseNode: AudioBufferSourceNode | null = null
let humNode: OscillatorNode | null = null
let buzzNode: OscillatorNode | null = null
let fruscioAudio: HTMLAudioElement | null = null
let isPlaying = false

export function startCrtNoise(): void {
  if (isPlaying || ctx) return

  ctx = new AudioContext()

  const bufferSize = ctx.sampleRate * 4
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  noiseNode = ctx.createBufferSource()
  noiseNode.buffer = buffer
  noiseNode.loop = true

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1200
  filter.Q.value = 0.8

  const gain = ctx.createGain()
  gain.gain.value = 0.015

  noiseNode.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noiseNode.start()

  humNode = ctx.createOscillator()
  humNode.type = 'sine'
  humNode.frequency.value = 50
  const humGain = ctx.createGain()
  humGain.gain.value = 0.005
  humNode.connect(humGain)
  humGain.connect(ctx.destination)
  humNode.start()

  buzzNode = ctx.createOscillator()
  buzzNode.type = 'sine'
  buzzNode.frequency.value = 100
  const buzzGain = ctx.createGain()
  buzzGain.gain.value = 0.003
  buzzNode.connect(buzzGain)
  buzzGain.connect(ctx.destination)
  buzzNode.start()

  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  fruscioAudio = new Audio(FRUSCIO_URL)
  fruscioAudio.loop = true
  fruscioAudio.volume = FRUSCIO_VOLUME
  fruscioAudio.play().catch(() => {})

  isPlaying = true
}

export function stopCrtNoise(): void {
  try { noiseNode?.stop() } catch {}
  try { humNode?.stop() } catch {}
  try { buzzNode?.stop() } catch {}

  noiseNode = null
  humNode = null
  buzzNode = null

  if (fruscioAudio) {
    fruscioAudio.pause()
    fruscioAudio.currentTime = 0
    fruscioAudio = null
  }

  if (ctx && ctx.state !== 'closed') {
    ctx.close()
  }
  ctx = null
  isPlaying = false
}

export function isCrtNoisePlaying(): boolean {
  return isPlaying
}
