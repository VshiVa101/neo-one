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
]

const TRIGGER_CHANCE = 0.3

let audioPool: HTMLAudioElement[] = []

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

  if (Math.random() > TRIGGER_CHANCE) return

  const pool = getPool()
  const sound = pool[Math.floor(Math.random() * pool.length)]
  sound.currentTime = 0
  sound.play().catch(() => {})
}
