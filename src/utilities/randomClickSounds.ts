const SOUNDS = [
  '/media/click-sounds/37987__sapht__.wav',
  '/media/click-sounds/24220__milan__derukugiwautareru.wav',
  '/media/click-sounds/556651__neilyhype__sexy-female-moan-sound-effect-wet.mp3',
  '/media/click-sounds/547687__theplax__hysterical5.wav',
  '/media/click-sounds/535479__dpath__girl-sexy-moaning.mp3',
  '/media/click-sounds/222651__mariallinas__orgasm-scream.mp3',
  '/media/click-sounds/382992__julialn__scream_girl.mp3',
  '/media/click-sounds/381805__juliabosque__scream5_bosque_julia.mp3',
  '/media/click-sounds/40876__davy-bartoloni__gridobartoloni.wav',
  '/media/click-sounds/564079__ameafterdark__dom-orgasm-medium.wav',
  '/media/click-sounds/734421__magicalmysticva__cute-hentai-girl-voice-orgasm-sound-effect-magicalmysticva.wav',
  '/media/click-sounds/abisso.wav',
  '/media/click-sounds/buona visione.wav',
  '/media/click-sounds/cristo santon.wav',
  '/media/click-sounds/eccheccazzo.wav',
  '/media/click-sounds/ma minimo.wav',
  '/media/click-sounds/porca troia.wav',
]

const TRIGGER_OPTIONS = [12, 17, 14, 20]
let targetIndex = 0

let audioPool: HTMLAudioElement[] = []
let unplayedIndices: number[] = []
let lastPlayedIndex: number | null = null
let clickCount = 0

function getNextTarget(): number {
  const target = TRIGGER_OPTIONS[targetIndex]
  targetIndex = (targetIndex + 1) % TRIGGER_OPTIONS.length
  return target
}

let nextTarget = getNextTarget()

function getPool(): HTMLAudioElement[] {
  if (audioPool.length === 0) {
    audioPool = SOUNDS.map(url => {
      const a = new Audio(url)
      a.volume = 0.8
      return a
    })
  }
  return audioPool
}

export function tryPlayRandomClickSound(event: MouseEvent): void {
  const target = event.target as HTMLElement
  if (target.closest('[data-hero]')) return

  clickCount++
  if (clickCount < nextTarget) return

  // Reset count and pick new target
  clickCount = 0
  nextTarget = getNextTarget()

  const pool = getPool()

  if (unplayedIndices.length === 0) {
    let newIndices = Array.from({ length: pool.length }, (_, i) => i)
    // Shuffle
    for (let i = newIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newIndices[i], newIndices[j]] = [newIndices[j], newIndices[i]]
    }
    // Prevent immediate repetition of the very last played sound
    if (newIndices[newIndices.length - 1] === lastPlayedIndex && newIndices.length > 1) {
      // Swap the last element with the first element
      ;[newIndices[newIndices.length - 1], newIndices[0]] = [newIndices[0], newIndices[newIndices.length - 1]]
    }
    unplayedIndices = newIndices
  }

  const indexToPlay = unplayedIndices.pop()!
  lastPlayedIndex = indexToPlay

  const sound = pool[indexToPlay]
  sound.currentTime = 0
  sound.play().catch(() => {})
}
