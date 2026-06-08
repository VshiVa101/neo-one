'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BrandedTitle } from '@/components/BrandedTitle'

interface CharConfig {
  id: number
  target: string
  initialColor: string
  canScramble: boolean
}

// Neo-ONE Brand Rules: Only O, N, and E letters are colored.
// Brand Colors:
// O: rosa vibrante #F45390
// N: verde acido #809829
// E: rosa soft #FF82B2
const CHAR_COLORS: Record<string, string> = {
  O: '#F45390',
  N: '#809829',
  E: '#FF82B2',
}

const SCRAMBLE_ALPHABET = 'COOMINGSOONONE'

export const COOMING_SOON_CONFIG: CharConfig[] = [
  { id: 0, target: 'C', initialColor: '#FFFFFF', canScramble: true },
  { id: 1, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 2, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 3, target: 'M', initialColor: '#FFFFFF', canScramble: true },
  { id: 4, target: 'I', initialColor: '#FFFFFF', canScramble: true },
  { id: 5, target: 'N', initialColor: '#809829', canScramble: true },
  { id: 6, target: 'G', initialColor: '#FFFFFF', canScramble: true },
  { id: 7, target: '-', initialColor: '#FFFFFF', canScramble: false },
  { id: 8, target: 'S', initialColor: '#FFFFFF', canScramble: true },
  { id: 9, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 10, target: 'O', initialColor: '#F45390', canScramble: true },
  { id: 11, target: 'N', initialColor: '#809829', canScramble: true },
]

let globalAudioCtx: AudioContext | null = null

// Synthesise retro arcade sound effects safely
export const playSynthSound = (type: 'laser' | 'zap' | 'hit' | 'explosion' | 'matrix') => {
  try {
    if (!globalAudioCtx) {
      globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    const ctx = globalAudioCtx
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    const now = ctx.currentTime

    if (type === 'laser') {
      // High-pitched pitch slide down for player laser (Eye zap)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.14)
      gainNode.gain.setValueAtTime(0.04, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
      osc.start(now)
      osc.stop(now + 0.14)
    } else if (type === 'zap') {
      // Gritty alien laser drop for humans
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(85, now + 0.2)
      gainNode.gain.setValueAtTime(0.03, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
      osc.start(now)
      osc.stop(now + 0.2)
    } else if (type === 'hit') {
      // High impact noise tick
      osc.type = 'square'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.setValueAtTime(50, now + 0.05)
      gainNode.gain.setValueAtTime(0.04, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      osc.start(now)
      osc.stop(now + 0.08)
    } else if (type === 'explosion') {
      // Deep low frequency debris rumble
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(120, now)
      osc.frequency.linearRampToValueAtTime(30, now + 0.4)
      gainNode.gain.setValueAtTime(0.09, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
      osc.start(now)
      osc.stop(now + 0.4)
    } else if (type === 'matrix') {
      // Space-glitch digital sweep
      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.linearRampToValueAtTime(1200, now + 0.6)
      osc.frequency.linearRampToValueAtTime(200, now + 1.6)
      
      const filter = ctx.createBiquadFilter()
      filter.type = 'peaking'
      filter.Q.setValueAtTime(15, now)
      filter.frequency.setValueAtTime(800, now)
      filter.frequency.exponentialRampToValueAtTime(2800, now + 1.6)
      
      osc.disconnect(gainNode)
      osc.connect(filter)
      filter.connect(gainNode)
      
      gainNode.gain.setValueAtTime(0.06, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.6)
      osc.start(now)
      osc.stop(now + 1.6)
    }
  } catch (e) {
    // Ignore block restrictions of audio policy
  }
}

export function LocalScrambleChar({
  target,
  isScrambling,
  canScramble,
  scrambleInterval = 100,
  matrixMode = false,
}: {
  target: string
  isScrambling: boolean
  canScramble: boolean
  scrambleInterval?: number
  matrixMode?: boolean
}) {
  const [display, setDisplay] = useState(target)

  const playTick = () => {
    try {
      if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = globalAudioCtx
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(120, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.04)

      gainNode.gain.setValueAtTime(0.012, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.04)
    } catch (e) {}
  }

  useEffect(() => {
    if (matrixMode) {
      const interval = setInterval(() => {
        const matrixChars = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789$#@%'
        setDisplay(matrixChars[Math.floor(Math.random() * matrixChars.length)])
      }, 50)
      return () => clearInterval(interval)
    }

    if (!canScramble || !isScrambling) {
      if (display !== target) {
        setDisplay(target)
        playTick()
      }
      return
    }

    const interval = setInterval(() => {
      setDisplay(SCRAMBLE_ALPHABET[Math.floor(Math.random() * SCRAMBLE_ALPHABET.length)])
      playTick()
    }, scrambleInterval)

    return () => clearInterval(interval)
  }, [isScrambling, canScramble, target, scrambleInterval, matrixMode])

  const currentCharColor = matrixMode ? '#00FF41' : (CHAR_COLORS[display] || '#FFFFFF')
  const isBrandChar = !matrixMode && (display === 'O' || display === 'N' || display === 'E')
  const brandClass = isBrandChar ? `neo-${display}` : ''

  return (
    <motion.span
      animate={{
        textShadow: matrixMode
          ? `0 0 15px #00FF41, 0 0 5px #FFFFFF`
          : isScrambling && canScramble
            ? `0 0 15px ${currentCharColor}88`
            : `0 0 25px ${currentCharColor}44`,
      }}
      transition={{ 
        textShadow: { duration: 0.2 }
      }}
      className={`font-neo font-bold uppercase select-none ${brandClass}`}
      style={{ color: currentCharColor }}
    >
      {display}
    </motion.span>
  )
}

// ----------------------------------------------------
// PIXEL SPRITE GRIDS & CONSTANTS
// ----------------------------------------------------

const EYE_SPRITE_F1 = [
  [0,0,0,0,1,1,1,1,1,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,0,0,0,0,0,1,1,1,0],
  [1,1,1,0,0,2,2,2,0,0,1,1,1],
  [1,1,0,0,2,3,3,3,2,0,0,1,1],
  [1,1,1,0,0,2,3,3,2,0,0,1,1],
  [0,1,1,1,0,0,2,2,0,0,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,0,1,0,1,0,1,0,1,0,1,0]
]

const EYE_SPRITE_F2 = [
  [0,0,0,0,1,1,1,1,1,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,0,0,0,0,0,1,1,1,0],
  [1,1,1,0,2,2,2,0,0,0,1,1,1],
  [1,1,0,2,3,3,3,2,0,0,0,1,1],
  [1,1,1,0,2,3,3,2,0,0,0,1,1],
  [0,1,1,1,0,2,2,0,0,0,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [1,0,1,0,1,0,1,0,1,0,1,0,1]
]

// 1. ROCKSTAR SINGER SPRITE (artisti con belle tette!)
const ARTISTA_SPRITE = [
  [0,0,1,1,1,0,0],
  [0,1,1,2,1,1,0], // wild rocker hair
  [0,0,1,1,1,0,0], // face
  [1,0,2,2,2,0,1], // shoulders
  [0,2,1,2,1,2,0], // prominent brand pink breasts (2) w/ white bra highlights (1)
  [0,0,2,2,2,0,0], // waist
  [0,2,2,0,2,2,0], // energetic split legs
  [2,2,0,0,0,2,2]
]

// 2. RIGID BUSINESSMAN SPRITE (editori con occhiali da sole e cravatta!)
const ADITORE_SPRITE = [
  [0,0,1,1,1,0,0],
  [0,3,3,2,3,3,0], // bald comb neat head wearing black sunglasses (3)
  [0,0,1,1,1,0,0], // face
  [0,1,4,1,4,1,0], // white shirt collar (1) w/ cravatta tie base (4)
  [0,2,2,4,2,2,0], // suit jacket body (2) w/ tie running down center (4)
  [1,2,2,4,2,2,1], // arms holding briefcase
  [0,2,2,0,2,2,0], // rigid pants (2)
  [0,2,2,0,2,2,0]
]

// 3. RETRO RAINING FROG SPRITE (pioggia di rane!)
const RANA_SPRITE = [
  [0,1,0,0,0,1,0], // frog bulging eyes (1)
  [1,1,1,1,1,1,1], // green face
  [1,3,1,1,1,3,1], // white pupils (3)
  [1,1,2,2,2,1,1], // red mouth (2)
  [0,1,1,1,1,1,0], // green body
  [1,0,1,1,1,0,1], // legs
  [1,1,0,0,0,1,1]
]

// 4. RETRO FEMALE FROG BOSS SPRITE (MAMMA RANA!)
const RANA_BOSS_SPRITE = [
  [0,0,1,0,0,0,0,0,1,0,0],
  [0,1,1,1,0,0,0,1,1,1,0],
  [1,1,3,1,1,0,1,1,3,1,1], // white pupils (3)
  [1,1,1,1,1,0,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,0],
  [0,1,5,1,1,1,1,1,5,1,0], // rosy cheeks (5)
  [0,1,1,2,2,2,2,2,1,1,0], // lipstick mouth (2)
  [0,0,1,2,2,2,2,2,1,0,0], 
  [0,0,1,1,1,1,1,1,1,0,0], // body
  [0,1,1,1,1,1,1,1,1,1,0],
  [1,1,0,1,1,1,1,1,0,1,1]  // legs
]

// LEVEL 2 SPRITES
// 5. MAMMINA PANCINA SPRITE
const MAMMINA_SPRITE = [
  [0,0,1,1,1,0,0],
  [0,1,1,1,1,1,0], // hair
  [0,0,2,2,2,0,0], // face
  [1,0,3,3,3,0,1], // shoulders
  [0,3,4,3,4,3,0], // big body/pregnant belly (4=pink)
  [0,0,3,3,3,0,0], // waist
  [0,2,2,0,2,2,0], // legs
  [2,2,0,0,0,2,2]
]

// 6. PRETE SPRITE
const PRETE_SPRITE = [
  [0,0,1,1,1,0,0],
  [0,2,2,2,2,2,0], // hair
  [0,0,2,2,2,0,0], // face
  [0,3,4,4,4,3,0], // black robe (3) with white collar (4)
  [0,3,3,3,3,3,0], // black robe
  [1,3,3,3,3,3,1], // arms
  [0,3,3,0,3,3,0], // black pants
  [0,3,3,0,3,3,0]
]

// 7. POPE BOSS SPRITE (MITRE ON)
const POPE_BOSS_SPRITE_1 = [
  [0,0,0,1,1,1,0,0,0],
  [0,0,1,1,5,1,1,0,0], // tall mitre (white with gold cross 5)
  [0,1,1,5,5,5,1,1,0],
  [0,1,1,1,5,1,1,1,0],
  [0,0,0,2,2,2,0,0,0], // face
  [0,0,3,3,3,3,3,0,0], // white robe
  [0,3,3,5,3,5,3,3,0], // white robe with gold details
  [3,3,3,3,3,3,3,3,3], // wide robe
  [3,3,3,3,3,3,3,3,3],
  [0,3,3,0,0,0,3,3,0], // feet area
  [0,3,3,0,0,0,3,3,0]
]

// 8. POPE BOSS SPRITE (AK47 OUT)
const POPE_BOSS_SPRITE_2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,2,2,2,0,0,0,0,0,0], // face (no hat)
  [0,0,3,3,3,3,3,0,0,0,0,0], // white robe
  [0,3,3,5,3,5,3,3,6,6,0,0], // robe + AK stock
  [3,3,3,3,3,3,3,6,6,6,6,6], // robe + AK body/barrel
  [3,3,3,3,3,3,3,0,6,0,0,0], // robe + AK magazine
  [3,3,3,3,3,3,3,3,3,0,0,0],
  [3,3,3,3,3,3,3,3,3,0,0,0],
  [0,3,3,0,0,0,3,3,0,0,0,0],
  [0,3,3,0,0,0,3,3,0,0,0,0]
]

// PROJECTILES
const BABY_SPRITE = [
  [0,2,2,0], // head
  [0,2,2,0],
  [3,4,4,3], // swaddled body (pink/blue)
  [0,4,4,0]
]

const CRUCIFIX_SPRITE = [
  [0,5,0],
  [5,5,5],
  [0,5,0],
  [0,5,0]
]

const AK47_BULLET_SPRITE = [
  [6,6,6]
]

const drawPixelSprite = (
  ctx: CanvasRenderingContext2D,
  sprite: number[][],
  x: number,
  y: number,
  pixelSize: number,
  palette: Record<number, string>
) => {
  for (let r = 0; r < sprite.length; r++) {
    for (let c = 0; c < sprite[r].length; c++) {
      const val = sprite[r][c]
      if (val !== 0 && palette[val]) {
        ctx.fillStyle = palette[val]
        ctx.fillRect(x + c * pixelSize, y + r * pixelSize, pixelSize, pixelSize)
      }
    }
  }
}

function PixelSpritePreview({ 
  sprite, 
  palette, 
  pixelSize = 2 
}: { 
  sprite: number[][], 
  palette: Record<number, string>, 
  pixelSize?: number 
}) {
  const rows = sprite.length
  const cols = sprite[0].length
  return (
    <div 
      className="grid" 
      style={{
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${pixelSize}px)`,
        gap: 0,
        width: `${cols * pixelSize}px`,
        height: `${rows * pixelSize}px`,
      }}
    >
      {sprite.flatMap((row, rIndex) =>
        row.map((val, cIndex) => {
          const color = val !== 0 ? palette[val] : 'transparent'
          return (
            <div 
              key={`${rIndex}-${cIndex}`} 
              style={{ backgroundColor: color }} 
            />
          )
        })
      )}
    </div>
  )
}

// ----------------------------------------------------
// CANVAS GAME ENGINE COMPONENT
// ----------------------------------------------------

interface GameProps {
  onTransitionTriggered: () => void
}

interface Mob {
  id: number
  type: 'artista' | 'aditore' | 'rana' | 'mammina' | 'prete' | 'pope'
  x: number
  y: number
  dx: number
  width: number
  height: number
  laserTimer: number
  alive: boolean
  color: string
  label: string
  
  // Custom behavior tracking
  pauseTimer: number
  isPaused: boolean
  bobOffset: number
}

interface LaserBullet {
  x: number
  y: number
  dx: number
  dy: number
  isEnemy: boolean
  color: string
  bulletType: 'wave' | 'block' | 'player' | 'baby' | 'crucifix' | 'ak47'
  waveBaseX: number
}

export default function SpaceInvadersGame({ onTransitionTriggered }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch capability initially
    const hasTouch = 
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      window.matchMedia('(pointer: coarse)').matches
      
    if (hasTouch) {
      setIsTouchDevice(true)
    }

    // Also listen to actual touchstart events for dynamic confirmation
    const handleTouchStart = () => {
      setIsTouchDevice(true)
      window.removeEventListener('touchstart', handleTouchStart)
    }
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  const stateRef = useRef({
    // Player - Giant Alien Eye (Acid Green with Purple Pupil!)
    eyeX: 374,
    eyeY: 60,
    eyeWidth: 13 * 4, // 52 virtual pixels
    eyeHeight: 9 * 4, // 36 virtual pixels
    eyeHealth: 35,
    maxEyeHealth: 35,
    eyeHitFlash: 0,
    eyeFrame: 0,
    eyeFrameTimer: 0,
    eyeLaserTimer: 0,

    // Dynamic Mob Spawner (Vibrant Pink & Soft Pink Mobs!)
    mobs: [] as Mob[],
    nextMobId: 1,
    spawnerTimer: 30,

    bullets: [] as LaserBullet[],
    particles: [] as Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      alpha: number
      life: number
      maxLife: number
      size: number
    }>,

    // Matrix streams lists
    matrixStreams: [] as Array<{ x: number; y: number; speed: number; chars: string[] }>,

    mouseX: 350, // default center position

    // Controls
    keys: {} as Record<string, boolean>,
    gameState: 'playing' as 'playing' | 'transition' | 'levelTransition' | 'done',
    frameCounter: 0,
    transitionTimer: 0,

    // Level progression
    currentLevel: 1,
    levelTransitionTimer: 0,
    levelMessage: '',

    triggeredTransitionCallback: false,

    // Nuclear explosion and screen shake states
    screenShake: 0,
    nuclearActive: false,
    nuclearX: 0,
    nuclearY: 0,
    nuclearRadius: 0,

    // Frog Rain and Continuous Laser States
    frogRainTimer: 600, // every 10 seconds
    continuousLaserTimer: 0, // duration in frames (8 seconds = 480 frames)
    bonusSpawnTimer: 1200, // every 20 seconds
    bonuses: [] as Array<{ x: number; y: number; width: number; height: number; dy: number; type: 'laser_powerup' }>,
    houseDestroyedTimer: 0, // left building spawner regeneration
    stageDestroyedTimer: 0, // right building spawner regeneration
    bossSpawned: false,
    boss: null as null | {
      bossType: 'rana' | 'pope'
      x: number
      y: number
      vx: number
      vy: number
      width: number
      height: number
      alive: boolean
      health: number
      maxHealth: number
      jumpCooldown: number
      isJumping: boolean
      hitFlash: number
      state?: number // For Pope: 0 = Mitre, 1 = AK47
      shootTimer?: number
    },
  })

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = true
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'a', 'd', 's', ' '].includes(e.key)) {
        e.preventDefault() // Stop scrolling
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Mouse & Touch controls for Eye tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const aspect = canvas.width / canvas.height
    let drawWidth = rect.width
    let drawHeight = drawWidth / aspect
    if (drawHeight > rect.height) {
      drawHeight = rect.height
      drawWidth = drawHeight * aspect
    }
    const drawX = rect.left + (rect.width - drawWidth) / 2
    const scaleX = canvas.width / drawWidth
    const x = (e.clientX - drawX) * scaleX
    stateRef.current.mouseX = x - stateRef.current.eyeWidth / 2
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || e.touches.length === 0) return
    const rect = canvas.getBoundingClientRect()
    const aspect = canvas.width / canvas.height
    let drawWidth = rect.width
    let drawHeight = drawWidth / aspect
    if (drawHeight > rect.height) {
      drawHeight = rect.height
      drawWidth = drawHeight * aspect
    }
    const drawX = rect.left + (rect.width - drawWidth) / 2
    const scaleX = canvas.width / drawWidth
    const x = (e.touches[0].clientX - drawX) * scaleX
    stateRef.current.mouseX = x - stateRef.current.eyeWidth / 2
  }

  const handleCanvasClick = () => {
    const state = stateRef.current
    // Shoot laser downwards on click
    if (state.gameState === 'playing' && state.eyeLaserTimer <= 0) {
      state.bullets.push({
        x: state.eyeX + state.eyeWidth / 2,
        y: state.eyeY + state.eyeHeight - 10,
        dx: 0,
        dy: 8.5,
        isEnemy: false, // player shoots down
        color: '#B026FF', // Purple/Violet laser
        bulletType: 'player',
        waveBaseX: 0
      })
      state.eyeLaserTimer = 14
      playSynthSound('laser')
    }
  }

  // Set game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set virtual resolution
    canvas.width = 800
    canvas.height = 600

    let animationId: number

    // Initialize Matrix Streams
    const state = stateRef.current
    const cols = Math.floor(canvas.width / 20)
    state.matrixStreams = Array.from({ length: cols }, (_, i) => ({
      x: i * 20,
      y: Math.random() * -600,
      speed: 3 + Math.random() * 4,
      chars: Array.from({ length: 15 }, () =>
        String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
      ),
    }))

    const gameLoop = () => {
      state.frameCounter++

      // CLEAR SCREEN
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)' // cool phosphor trails
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Screen shake offset
      let shakeX = 0
      let shakeY = 0
      if (state.screenShake > 0) {
        shakeX = (Math.random() - 0.5) * state.screenShake
        shakeY = (Math.random() - 0.5) * state.screenShake
        state.screenShake *= 0.93 // decay
        if (state.screenShake < 0.5) state.screenShake = 0
      }
      ctx.save()
      ctx.translate(shakeX, shakeY)

      // ==========================================
      // BACKGROUND DRAWINGS: HOUSE & CONCERT STAGE
      // ==========================================

      // Update spawner destruction timers
      if (state.houseDestroyedTimer > 0) state.houseDestroyedTimer--
      if (state.stageDestroyedTimer > 0) state.stageDestroyedTimer--

      // 1. LEFT HOUSE ("CASA EDITRICE" - Publishing house)
      const houseX = 15
      const houseY = 380
      const houseW = 120
      const houseH = 133
      const houseDestroyed = state.houseDestroyedTimer > 0
      
      // Building facade
      ctx.fillStyle = houseDestroyed ? 'rgba(20, 20, 22, 0.9)' : 'rgba(40, 40, 48, 0.65)'
      ctx.fillRect(houseX, houseY, houseW, houseH)
      ctx.strokeStyle = houseDestroyed ? 'rgba(60, 60, 60, 0.4)' : 'rgba(255, 130, 178, 0.25)' // Soft Pink border
      ctx.lineWidth = 2
      ctx.strokeRect(houseX, houseY, houseW, houseH)

      // Windows
      ctx.fillStyle = houseDestroyed ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.08)'
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          ctx.fillRect(houseX + 20 + c * 50, houseY + 25 + r * 30, 30, 20)
          ctx.strokeStyle = houseDestroyed ? 'rgba(40, 40, 40, 0.3)' : 'rgba(255, 130, 178, 0.15)'
          ctx.strokeRect(houseX + 20 + c * 50, houseY + 25 + r * 30, 30, 20)
        }
      }

      // Main Doorway
      ctx.fillStyle = '#111'
      ctx.fillRect(houseX + 45, houseY + houseH - 35, 30, 35)
      ctx.strokeStyle = houseDestroyed ? 'rgba(40, 40, 40, 0.3)' : 'rgba(255, 130, 178, 0.4)'
      ctx.strokeRect(houseX + 45, houseY + houseH - 35, 30, 35)

      // Marquee Sign "CASA EDITRICE"
      ctx.fillStyle = 'rgba(10, 10, 10, 0.9)'
      ctx.fillRect(houseX + 10, houseY - 20, houseW - 20, 16)
      ctx.strokeStyle = houseDestroyed ? '#333' : '#FF82B2' // Soft Pink glowing marquee
      ctx.strokeRect(houseX + 10, houseY - 20, houseW - 20, 16)
      
      if (!houseDestroyed) {
        ctx.shadowBlur = 6
        ctx.shadowColor = '#FF82B2'
        ctx.fillStyle = '#FF82B2'
        ctx.font = 'bold 8px monospace'
        ctx.textAlign = 'center'
        const houseLabel = state.currentLevel === 1 ? 'CASA EDITRICE' : 'CATTEDRALE'
        ctx.fillText(houseLabel, houseX + houseW / 2, houseY - 9)
        ctx.shadowBlur = 0 // reset
      } else {
        ctx.fillStyle = '#FF3366'
        ctx.font = 'bold 7px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(`SPENTO: ${Math.ceil(state.houseDestroyedTimer / 60)}S`, houseX + houseW / 2, houseY - 9)
        
        // Spawn rising smoke particles periodically
        if (state.frameCounter % 6 === 0) {
          state.particles.push({
            x: houseX + Math.random() * houseW,
            y: houseY + Math.random() * 40,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -1.2,
            color: 'rgba(90, 90, 90, 0.4)',
            alpha: 1,
            life: 40,
            maxLife: 40,
            size: 2 + Math.random() * 3,
          })
        }
      }

      // 2. RIGHT STAGE ("LIVE STAGE" - Stage with spotlights)
      const stageX = 665
      const stageY = 410
      const stageW = 120
      const stageH = 103
      const stageDestroyed = state.stageDestroyedTimer > 0
      
      // Stage platform structure
      ctx.fillStyle = stageDestroyed ? 'rgba(18, 14, 16, 0.9)' : 'rgba(50, 30, 40, 0.65)'
      ctx.fillRect(stageX, stageY, stageW, stageH)
      ctx.strokeStyle = stageDestroyed ? 'rgba(60, 60, 60, 0.4)' : 'rgba(244, 83, 144, 0.25)' // Vibrant Pink border
      ctx.strokeRect(stageX, stageY, stageW, stageH)

      // Speaker boxes
      ctx.fillStyle = 'rgba(15, 15, 15, 0.9)'
      ctx.fillRect(stageX + 5, stageY + stageH - 50, 20, 50)
      ctx.fillRect(stageX + stageW - 25, stageY + stageH - 50, 20, 50)
      
      // Speaker neon circles
      ctx.strokeStyle = stageDestroyed ? '#333' : '#F45390'
      ctx.strokeRect(stageX + 5, stageY + stageH - 50, 20, 50)
      ctx.strokeRect(stageX + stageW - 25, stageY + stageH - 50, 20, 50)
      
      if (!stageDestroyed) {
        ctx.beginPath()
        ctx.arc(stageX + 15, stageY + stageH - 38, 6, 0, Math.PI * 2)
        ctx.arc(stageX + 15, stageY + stageH - 14, 6, 0, Math.PI * 2)
        ctx.arc(stageX + stageW - 15, stageY + stageH - 38, 6, 0, Math.PI * 2)
        ctx.arc(stageX + stageW - 15, stageY + stageH - 14, 6, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Backstage platform door
      ctx.fillStyle = '#111'
      ctx.fillRect(stageX + 45, stageY + stageH - 45, 30, 45)
      ctx.strokeStyle = stageDestroyed ? 'rgba(40, 40, 40, 0.3)' : 'rgba(244, 83, 144, 0.4)'
      ctx.strokeRect(stageX + 45, stageY + stageH - 45, 30, 45)

      // Pulsing lights overhead beams (only if stage is active!)
      if (!stageDestroyed) {
        const lightPulse = Math.sin(state.frameCounter / 12) * 0.4 + 0.5
        ctx.fillStyle = `rgba(244, 83, 144, ${lightPulse * 0.15})`
        ctx.beginPath()
        ctx.moveTo(stageX + 30, stageY)
        ctx.lineTo(stageX - 40, stageY + stageH + 10)
        ctx.lineTo(stageX + 60, stageY + stageH + 10)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = `rgba(128, 152, 41, ${lightPulse * 0.15})`
        ctx.beginPath()
        ctx.moveTo(stageX + 90, stageY)
        ctx.lineTo(stageX + 60, stageY + stageH + 10)
        ctx.lineTo(stageX + 160, stageY + stageH + 10)
        ctx.closePath()
        ctx.fill()
      }

      // Live Stage billboard marquee
      ctx.fillStyle = 'rgba(10, 10, 10, 0.9)'
      ctx.fillRect(stageX + 10, stageY - 20, stageW - 20, 16)
      ctx.strokeStyle = stageDestroyed ? '#333' : '#F45390'
      ctx.strokeRect(stageX + 10, stageY - 20, stageW - 20, 16)
      
      if (!stageDestroyed) {
        ctx.shadowBlur = 6
        ctx.shadowColor = '#F45390'
        ctx.fillStyle = '#F45390'
        ctx.font = 'bold 9px monospace'
        ctx.textAlign = 'center'
        const stageLabel = state.currentLevel === 1 ? 'LIVE STAGE' : 'CIRCOLO CUCITO'
        ctx.fillText(stageLabel, stageX + stageW / 2, stageY - 9)
        ctx.shadowBlur = 0 // reset
      } else {
        ctx.fillStyle = '#FF3366'
        ctx.font = 'bold 7px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(`SPENTO: ${Math.ceil(state.stageDestroyedTimer / 60)}S`, stageX + stageW / 2, stageY - 9)
        
        // Spawn rising smoke particles
        if (state.frameCounter % 6 === 0) {
          state.particles.push({
            x: stageX + Math.random() * stageW,
            y: stageY + Math.random() * 40,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -1.2,
            color: 'rgba(90, 90, 90, 0.4)',
            alpha: 1,
            life: 40,
            maxLife: 40,
            size: 2 + Math.random() * 3,
          })
        }
      }


      // DRAW HORIZON GROUND LINE (above background buildings overlaps)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, 513)
      ctx.lineTo(canvas.width, 513)
      ctx.stroke()

      if (state.gameState === 'levelTransition') {
        // Draw the level transition message in the center
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        ctx.font = 'bold 24px font-neo, monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#FFFFFF'
        ctx.fillText(state.levelMessage, canvas.width / 2, canvas.height / 2)

        // Smoothly return eye to start position
        state.eyeY += (60 - state.eyeY) * 0.05
        state.eyeX += (canvas.width / 2 - state.eyeWidth / 2 - state.eyeX) * 0.05
        
        // Animate eye frame
        state.eyeFrameTimer++
        if (state.eyeFrameTimer >= 30) {
          state.eyeFrame = state.eyeFrame === 0 ? 1 : 0
          state.eyeFrameTimer = 0
        }

        // Draw Player Eye so it isn't invisible!
        const eyePalette: Record<number, string> = {
          1: state.eyeHitFlash > 0 ? '#FFFFFF' : '#809829',
          2: '#FFFFFF',
          3: '#B026FF',
        }
        const currentEyeSprite = state.eyeFrame === 0 ? EYE_SPRITE_F1 : EYE_SPRITE_F2
        drawPixelSprite(ctx, currentEyeSprite, state.eyeX, state.eyeY, 4, eyePalette)

        state.levelTransitionTimer--
        if (state.levelTransitionTimer <= 0) {
          state.gameState = 'playing'
          state.eyeY = 60 // Reset to top
          state.mobs = [] // Clear old mobs
          state.bullets = [] // Clear bullets
          state.bossSpawned = false
          if (state.boss) state.boss.alive = false
        }
      } else if (state.gameState === 'playing') {
        // ==========================================
        // 1. UPDATE PLAYER (ALIEN EYE)
        // ==========================================
        
        // Relentless constant slow descent (DISABLED QUICK DESCENT BOOST!)
        const descendSpeed = 0.12
        state.eyeY += descendSpeed
        
        // Steer horizontally with Keyboard A/D / Arrows
        if (state.keys['ArrowLeft'] || state.keys['a']) {
          state.eyeX -= 6
        }
        if (state.keys['ArrowRight'] || state.keys['d']) {
          state.eyeX += 6
        }

        // Steer horizontally with Mouse / Touch (interpolate smoothly)
        if (state.mouseX !== 350) {
          state.eyeX += (state.mouseX - state.eyeX) * 0.16
        }

        // Screen boundary locks
        if (state.eyeX < 20) state.eyeX = 20
        if (state.eyeX > canvas.width - state.eyeWidth - 20) {
          state.eyeX = canvas.width - state.eyeWidth - 20
        }
        state.eyeY = Math.max(30, state.eyeY) // prevent flying off screen top

        // Animate eye frame
        state.eyeFrameTimer++
        if (state.eyeFrameTimer >= 30) {
          state.eyeFrame = state.eyeFrame === 0 ? 1 : 0
          state.eyeFrameTimer = 0
        }

        // Countdown Hit Flash
        if (state.eyeHitFlash > 0) state.eyeHitFlash--

        // Firing Purple/Violet lasers downwards (Spacebar)
        state.eyeLaserTimer--
        if (state.keys[' '] && state.eyeLaserTimer <= 0) {
          state.bullets.push({
            x: state.eyeX + state.eyeWidth / 2,
            y: state.eyeY + state.eyeHeight - 10,
            dx: 0,
            dy: 9.5,
            isEnemy: false, // player laser
            color: '#B026FF', // Purple/Violet laser
            bulletType: 'player',
            waveBaseX: 0
          })
          state.eyeLaserTimer = 12
          playSynthSound('laser')
        }

        if (state.eyeY + state.eyeHeight >= 495) {
          state.screenShake = 38
          if (state.currentLevel < 2) {
            // Level transition
            state.gameState = 'levelTransition'
            state.levelTransitionTimer = 120 // 2 seconds
            state.currentLevel++
            state.levelMessage = `LEVEL ${state.currentLevel} - ` + (state.currentLevel === 2 ? 'MAMMINE E PRETI' : 'PREPARE FOR MORE')
            playSynthSound('explosion')
            
            // Spawn some particles, but not nuclear
            for (let i = 0; i < 40; i++) {
              const angle = Math.random() * Math.PI * 2
              const speed = 2 + Math.random() * 8
              state.particles.push({
                x: state.eyeX + state.eyeWidth / 2,
                y: state.eyeY + state.eyeHeight,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: '#FF82B2',
                alpha: 1,
                life: 30 + Math.random() * 20,
                maxLife: 60,
                size: 2 + Math.random() * 4,
              })
            }
          } else {
            // Final nuclear explosion (Level 10 complete)
            state.gameState = 'transition'
            state.nuclearActive = true
            state.nuclearX = state.eyeX + state.eyeWidth / 2
            state.nuclearY = state.eyeY + state.eyeHeight
            state.nuclearRadius = 0

            // Spawn massive green nuclear particles from touchdown point
          for (let i = 0; i < 160; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = 2 + Math.random() * 11
            state.particles.push({
              x: state.nuclearX,
              y: state.nuclearY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - (Math.random() * 2), // slight upward bias
              color: '#809829', // Acid Green brand color
              alpha: 1,
              life: 60 + Math.random() * 40,
              maxLife: 100,
              size: 3 + Math.random() * 5,
            })
          }

          // Trigger massive green shockwave horizontal particles
          for (let i = 0; i < 80; i++) {
            state.particles.push({
              x: state.nuclearX + (Math.random() - 0.5) * 40,
              y: state.nuclearY,
              vx: (Math.random() - 0.5) * 18,
              vy: (Math.random() - 0.5) * 3,
              color: '#00FF41',
              alpha: 1,
              life: 55 + Math.random() * 30,
              maxLife: 85,
              size: 4 + Math.random() * 4,
            })
          }

          // ALL ACTIVE MOBS SIMULTANEOUSLY EXPLODE IN PINK!
          state.mobs.forEach((mob) => {
            if (mob.alive) {
              mob.alive = false
              
              // Explode mob in its own pink brand color!
              for (let i = 0; i < 30; i++) {
                const angle = Math.random() * Math.PI * 2
                const speed = 1.5 + Math.random() * 6.5
                state.particles.push({
                  x: mob.x + mob.width / 2,
                  y: mob.y + mob.bobOffset + mob.height / 2,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  color: mob.color, // '#F45390' (Vibrant Pink) or '#FF82B2' (Soft Pink)
                  alpha: 1,
                  life: 45 + Math.random() * 35,
                  maxLife: 80,
                  size: 2.5 + Math.random() * 3.5,
                })
              }
            }
          })

          // Explode boss too if active
          if (state.boss && state.boss.alive) {
            state.boss.alive = false
            for (let i = 0; i < 60; i++) {
              const angle = Math.random() * Math.PI * 2
              const speed = 2 + Math.random() * 9
              state.particles.push({
                x: state.boss.x + state.boss.width / 2,
                y: state.boss.y + state.boss.height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: '#FF007F', // Lipstick pink
                alpha: 1,
                life: 50 + Math.random() * 30,
                maxLife: 80,
                size: 3 + Math.random() * 3,
              })
            }
          }

          // Clear bullets to focus on the spectacular visual explosions
          state.bullets = []

          // Play powerful synthesized explosion and matrix hacker sweeps
          // Play powerful synthesized explosion and matrix hacker sweeps
          playSynthSound('explosion')
          playSynthSound('matrix')
          }
        }

        // Draw Player Eye (Body Green, Pupil Purple)
        const eyePalette: Record<number, string> = {
          1: state.eyeHitFlash > 0 ? '#FFFFFF' : '#809829', // Acid Green Body (or hit flash white)
          2: '#FFFFFF', // Cornea White
          3: '#B026FF', // glowing Violet/Purple Pupil!
        }
        const currentEyeSprite = state.eyeFrame === 0 ? EYE_SPRITE_F1 : EYE_SPRITE_F2
        drawPixelSprite(ctx, currentEyeSprite, state.eyeX, state.eyeY, 4, eyePalette)

        // Draw Player Eye HUD (Integrity status bar)
        const barWidth = 260
        const barHeight = 8
        const barX = (canvas.width - barWidth) / 2
        const barY = 24
        
        ctx.fillStyle = '#111'
        ctx.fillRect(barX, barY, barWidth, barHeight)
        
        const healthPercent = Math.max(0, state.eyeHealth / state.maxEyeHealth)
        ctx.fillStyle = state.eyeHealth < 9 ? '#FF3E3E' : '#809829'
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.strokeRect(barX, barY, barWidth, barHeight)

        ctx.font = 'bold 10px font-neo, monospace'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#809829' // N
        ctx.fillText('N', (canvas.width / 2) - 8, barY - 6)
        ctx.fillStyle = '#FF82B2' // E
        ctx.fillText('E', canvas.width / 2, barY - 6)
        ctx.fillStyle = '#F45390' // O
        ctx.fillText('O', (canvas.width / 2) + 8, barY - 6)

        // Indicator arrow above player Eye
        ctx.fillStyle = '#809829'
        ctx.beginPath()
        ctx.moveTo(state.eyeX + state.eyeWidth / 2, state.eyeY - 6)
        ctx.lineTo(state.eyeX + state.eyeWidth / 2 - 4, state.eyeY - 11)
        ctx.lineTo(state.eyeX + state.eyeWidth / 2 + 4, state.eyeY - 11)
        ctx.fill()

        // ==========================================
        // 2. DYNAMIC SPAWNING & UPDATE ENEMY BOTS (WITH RUINED SPAWNER FALLBACK)
        // ==========================================
        // Calculate descent progress (0.0 at top, 1.0 at ground)
        // Eye starts at 60. Ground hit is when eyeY + eyeHeight (36) >= 495 (eyeY = 459).
        const descentProgress = Math.max(0, Math.min(1, (state.eyeY - 60) / (459 - 60)))
        const currentMaxMobs = Math.floor(2 + descentProgress * 22) // From 2 to 24 mobs

        state.spawnerTimer--
        if (state.spawnerTimer <= 0 && state.mobs.filter(m => m.alive).length < currentMaxMobs) {
          const houseActive = state.houseDestroyedTimer <= 0
          const stageActive = state.stageDestroyedTimer <= 0
          
          if (houseActive || stageActive) {
            let spawnFromRight = Math.random() > 0.5
            if (spawnFromRight && !stageActive) spawnFromRight = false
            if (!spawnFromRight && !houseActive) spawnFromRight = true
            
            if (spawnFromRight) {
              const type = state.currentLevel === 1 ? 'artista' : 'mammina'
              const color = state.currentLevel === 1 ? '#F45390' : '#FF82B2'
              const label = state.currentLevel === 1 ? 'artisti venduti' : 'mammine pancine'
              state.mobs.push({
                id: state.nextMobId++,
                type: type,
                x: stageX + 50,
                y: 483,
                dx: -(1.4 + Math.random() * 0.7),
                width: 7 * 3,
                height: 8 * 3,
                laserTimer: 30 + Math.random() * 40,
                alive: true,
                color: color,
                label: label,
                pauseTimer: 0,
                isPaused: false,
                bobOffset: 0
              })
            } else {
              const type = state.currentLevel === 1 ? 'aditore' : 'prete'
              const color = state.currentLevel === 1 ? '#FF82B2' : '#FFFFFF'
              const label = state.currentLevel === 1 ? 'aditori corrotti' : 'preti'
              state.mobs.push({
                id: state.nextMobId++,
                type: type,
                x: houseX + 50,
                y: 483,
                dx: (1.0 + Math.random() * 0.4),
                width: 7 * 3,
                height: 8 * 3,
                laserTimer: 130 + Math.random() * 70, // EDITORS SHOOT VERY SLOWLY, PRETI ALSO SLOW
                alive: true,
                color: color,
                label: label,
                pauseTimer: 80,
                isPaused: false,
                bobOffset: 0
              })
            }
          }
          // Scale spawner speed based on descent. Slow at top, very fast at bottom. Increased spawnrate by 50% (timer reduced by 33%).
          const baseTimer = 73 - (descentProgress * 53) // from 73 down to 20
          state.spawnerTimer = baseTimer + Math.random() * (baseTimer * 0.5) // reset timer
        }

        // --------------------------------------------------
        // UPDATE FROG RAIN EVENT (TRIGGERS EVERY 10 SECONDS!)
        // --------------------------------------------------
        state.frogRainTimer--
        if (state.frogRainTimer <= 0) {
          state.frogRainTimer = 600 // every 10 seconds
          
          // Spawn 8 frogs raining down from the top!
          for (let i = 0; i < 8; i++) {
            state.mobs.push({
              id: state.nextMobId++,
              type: 'rana',
              x: 50 + Math.random() * (canvas.width - 100),
              y: -30 - Math.random() * 120, // slightly staggered top position
              dx: (Math.random() - 0.5) * 1.6,
              width: 7 * 3,
              height: 7 * 3,
              laserTimer: 99999, // Frogs do not shoot lasers
              alive: true,
              color: '#809829', // Acid Green color
              label: 'rana cadente',
              pauseTimer: 0,
              isPaused: false,
              bobOffset: 0
            })
          }
          
          // Warning sound sweep!
          playSynthSound('matrix')
        }

        // --------------------------------------------------
        // UPDATE AND DRAW SKY BONUS DROPS (PILLS EVERY 20S)
        // --------------------------------------------------
        state.bonusSpawnTimer--
        if (state.bonusSpawnTimer <= 0) {
          state.bonusSpawnTimer = 1200 // every 20 seconds
          state.bonuses.push({
            x: 80 + Math.random() * (canvas.width - 160),
            y: -25,
            width: 25,
            height: 25,
            dy: 1.8,
            type: 'laser_powerup'
          })
        }

        state.bonuses = state.bonuses.filter((b) => {
          b.y += b.dy
          
          // Draw spinning and bouncing glowing pill bonus icon
          ctx.save()
          ctx.shadowBlur = 12
          ctx.shadowColor = '#FF82B2'
          
          const pulse = Math.sin(state.frameCounter / 6) * 3
          ctx.fillStyle = '#FF82B2' // brand soft pink shell
          ctx.fillRect(b.x, b.y + pulse, b.width, b.height)
          
          ctx.fillStyle = '#809829' // brand green core
          ctx.fillRect(b.x + 5, b.y + pulse + 5, b.width - 10, b.height - 10)
          
          ctx.fillStyle = '#FFFFFF'
          ctx.font = 'bold 8px font-neo, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('NEO', b.x + b.width / 2, b.y + pulse + b.height / 2 + 3)
          
          ctx.restore()
          
          // Collision check: player Eye eats the bonus star!
          if (
            b.x >= state.eyeX - b.width &&
            b.x <= state.eyeX + state.eyeWidth &&
            b.y >= state.eyeY - b.height &&
            b.y <= state.eyeY + state.eyeHeight
          ) {
            state.continuousLaserTimer = 480 // 8 seconds of continuous laser!
            playSynthSound('matrix')
            
            // Neon pink particle spray
            for (let i = 0; i < 25; i++) {
              state.particles.push({
                x: b.x + b.width / 2,
                y: b.y + b.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: '#FF82B2',
                alpha: 1,
                life: 30,
                maxLife: 30,
                size: 3,
              })
            }
            return false // remove
          }
          
          return b.y < 513
        })

        // --------------------------------------------------
        // UPDATE AND DRAW ACTIVE CONTINUOUS POWER LASER
        // --------------------------------------------------
        if (state.continuousLaserTimer > 0) {
          state.continuousLaserTimer--
          const laserX = state.eyeX + state.eyeWidth / 2
          
          ctx.save()
          ctx.shadowBlur = 24
          ctx.shadowColor = '#B026FF'
          
          // Outer thick beam
          ctx.strokeStyle = '#B026FF'
          ctx.lineWidth = 14 + Math.sin(state.frameCounter) * 3
          ctx.beginPath()
          ctx.moveTo(laserX, state.eyeY + state.eyeHeight)
          ctx.lineTo(laserX, 513)
          ctx.stroke()
          
          // Inner core beam
          ctx.strokeStyle = '#FFFFFF'
          ctx.lineWidth = 6 + Math.sin(state.frameCounter) * 1
          ctx.beginPath()
          ctx.moveTo(laserX, state.eyeY + state.eyeHeight)
          ctx.lineTo(laserX, 513)
          ctx.stroke()
          ctx.restore()
          
          // Continuous laser destroys Spawners!
          if (laserX >= 15 && laserX <= 135 && state.houseDestroyedTimer <= 0) {
            state.houseDestroyedTimer = 900 // 15 seconds!
            state.screenShake = 24
            state.continuousLaserTimer = 0 // IMMEDIATELY DEACTIVATE CONTINUOUS LASER POWER-UP!
            for (let i = 0; i < 40; i++) {
              state.particles.push({
                x: 75,
                y: 440,
                vx: (Math.random() - 0.5) * 10,
                vy: -Math.random() * 8,
                color: '#FF82B2',
                alpha: 1,
                life: 50 + Math.random() * 30,
                maxLife: 80,
                size: 3 + Math.random() * 4,
              })
            }
            playSynthSound('explosion')
          }
          
          if (laserX >= 665 && laserX <= 785 && state.stageDestroyedTimer <= 0) {
            state.stageDestroyedTimer = 900 // 15 seconds!
            state.screenShake = 24
            state.continuousLaserTimer = 0 // IMMEDIATELY DEACTIVATE CONTINUOUS LASER POWER-UP!
            for (let i = 0; i < 40; i++) {
              state.particles.push({
                x: 725,
                y: 450,
                vx: (Math.random() - 0.5) * 10,
                vy: -Math.random() * 8,
                color: '#F45390',
                alpha: 1,
                life: 50 + Math.random() * 30,
                maxLife: 80,
                size: 3 + Math.random() * 4,
              })
            }
            playSynthSound('explosion')
          }
          
          // Continuous laser destroys mobs/frogs!
          state.mobs.forEach((mob) => {
            if (
              mob.alive &&
              laserX >= mob.x &&
              laserX <= mob.x + mob.width &&
              mob.y + mob.bobOffset >= state.eyeY + state.eyeHeight &&
              mob.y + mob.bobOffset <= 513
            ) {
              mob.alive = false
              for (let i = 0; i < 15; i++) {
                state.particles.push({
                  x: mob.x + mob.width / 2,
                  y: mob.y + mob.bobOffset + mob.height / 2,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: mob.color,
                  alpha: 1,
                  life: 25 + Math.random() * 20,
                  maxLife: 45,
                  size: 2 + Math.random() * 2,
                })
              }
              playSynthSound('explosion')
            }
          })

          // Continuous laser damages boss!
          if (state.boss && state.boss.alive) {
            const boss = state.boss
            if (
              laserX >= boss.x &&
              laserX <= boss.x + boss.width &&
              boss.y >= state.eyeY + state.eyeHeight &&
              boss.y <= 513
            ) {
              boss.health -= 0.6 // continuous damage per frame
              boss.hitFlash = 3
              if (state.frameCounter % 6 === 0) {
                state.particles.push({
                  x: laserX,
                  y: boss.y + Math.random() * boss.height,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  color: '#FF007F', // Lipstick pink
                  alpha: 1,
                  life: 15,
                  maxLife: 15,
                  size: 2,
                })
              }
              if (boss.health <= 0) {
                boss.alive = false
                for (let i = 0; i < 50; i++) {
                  const angle = Math.random() * Math.PI * 2
                  const speed = 2 + Math.random() * 8
                  state.particles.push({
                    x: boss.x + boss.width / 2,
                    y: boss.y + boss.height / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: '#FF007F',
                    alpha: 1,
                    life: 40 + Math.random() * 30,
                    maxLife: 70,
                    size: 3 + Math.random() * 3,
                  })
                }
                playSynthSound('explosion')
              }
            }
          }
        }

        // Update each mob
        state.mobs = state.mobs.filter(mob => mob.alive)
        state.mobs.forEach((mob) => {
          
          // DIFFERENTIAL MOVEMENTS:
          if (mob.type === 'artista' || mob.type === 'mammina') {
            // Bobbing Bouncy Dance movement step
            mob.bobOffset = Math.abs(Math.sin((state.frameCounter + mob.id * 18) / 8)) * -16
            
            // Fast horizontal walk
            mob.x += mob.dx
          } else if (mob.type === 'aditore' || mob.type === 'prete') {
            // Rigid bureaucrat/priest movement with periodic pauses!
            mob.bobOffset = 0
            
            mob.pauseTimer--
            if (mob.pauseTimer <= 0) {
              mob.isPaused = !mob.isPaused
              mob.pauseTimer = mob.isPaused ? 35 : 85 // pause for 35 frames, walk for 85
            }
            
            if (!mob.isPaused) {
              mob.x += mob.dx
            }
          } else if (mob.type === 'rana') {
            // Frog rain movement: falls straight down!
            mob.y += 2.8 // rapid frog rain falling speed
            
            // Hopping side-to-side wavy path
            mob.x += Math.sin((state.frameCounter + mob.id * 12) / 6) * 1.5
            
            // If frog hits ground line, it splats and dies
            if (mob.y >= 505) {
              mob.alive = false
              for (let i = 0; i < 8; i++) {
                state.particles.push({
                  x: mob.x + mob.width / 2,
                  y: 513,
                  vx: (Math.random() - 0.5) * 4,
                  vy: -Math.random() * 3,
                  color: '#809829', // frog green
                  alpha: 1,
                  life: 15,
                  maxLife: 15,
                  size: 2,
                })
              }
            }
          }

          // Once inside the screen, bounce off margins (only normal walk mobs!)
          if (mob.type !== 'rana' && mob.x > 30 && mob.x < canvas.width - mob.width - 30) {
            if (mob.x <= 40 || mob.x >= canvas.width - mob.width - 40) {
              mob.dx = -mob.dx
            }
          }

          // Frog player contact collision check!
          if (
            mob.alive &&
            mob.type === 'rana' &&
            mob.x >= state.eyeX - mob.width &&
            mob.x <= state.eyeX + state.eyeWidth &&
            mob.y >= state.eyeY - mob.height &&
            mob.y <= state.eyeY + state.eyeHeight
          ) {
            mob.alive = false
            state.eyeHealth -= 4
            state.eyeHitFlash = 8
            for (let i = 0; i < 12; i++) {
              state.particles.push({
                x: mob.x + mob.width / 2,
                y: mob.y + mob.height / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#809829',
                alpha: 1,
                life: 20,
                maxLife: 20,
                size: 2,
              })
            }
            playSynthSound('hit')
            if (state.eyeHealth <= 0) {
              state.eyeHealth = state.maxEyeHealth
              state.eyeY = Math.max(60, state.eyeY - 80)
              playSynthSound('explosion')
            }
          }

          // Shoot lasers upwards (aiming with slight horizontal offset, only artists/auditors)
          if (mob.type !== 'rana') {
            mob.laserTimer--
            if (mob.laserTimer <= 0) {
              
              // DIFFERENTIAL PROJECTILE SHAPES:
              if (mob.type === 'artista') {
                // Sine wave notes upwards
                state.bullets.push({
                  x: mob.x + mob.width / 2,
                  y: mob.y + mob.bobOffset,
                  dx: 0,
                  dy: -6.5,
                  isEnemy: true,
                  color: mob.color,
                  bulletType: 'wave',
                  waveBaseX: mob.x + mob.width / 2
                })
                mob.laserTimer = 50 + Math.random() * 60
              } else if (mob.type === 'aditore') {
                // EDITORS: Slow, homing, block projectile
                state.bullets.push({
                  x: mob.x + mob.width / 2,
                  y: mob.y,
                  dx: 0,
                  dy: -3.2,
                  isEnemy: true,
                  color: mob.color,
                  bulletType: 'block',
                  waveBaseX: 0
                })
                mob.laserTimer = 140 + Math.random() * 90
              } else if (mob.type === 'mammina') {
                // MAMMINE: baby projectiles
                state.bullets.push({
                  x: mob.x + mob.width / 2,
                  y: mob.y + mob.bobOffset,
                  dx: (Math.random() - 0.5) * 3, // slightly arched
                  dy: -4.5,
                  isEnemy: true,
                  color: mob.color,
                  bulletType: 'baby',
                  waveBaseX: 0
                })
                mob.laserTimer = 70 + Math.random() * 60
              } else if (mob.type === 'prete') {
                // PRETI: crucifix projectiles
                state.bullets.push({
                  x: mob.x + mob.width / 2,
                  y: mob.y,
                  dx: 0,
                  dy: -5.0,
                  isEnemy: true,
                  color: '#FFFFFF',
                  bulletType: 'crucifix',
                  waveBaseX: 0
                })
                mob.laserTimer = 100 + Math.random() * 80
              }
              
              playSynthSound('zap')
            }
          }

          // Draw custom pixel sprite based on enemy type
          if (mob.type === 'artista') {
            const mobPalette: Record<number, string> = {
              1: '#FFFFFF', // bra highlight
              2: mob.color, // Vibrant Pink curves
            }
            drawPixelSprite(ctx, ARTISTA_SPRITE, mob.x, mob.y + mob.bobOffset, 3, mobPalette)
          } else if (mob.type === 'aditore') {
            const mobPalette: Record<number, string> = {
              1: '#FFFFFF', // shirt collar
              2: mob.color, // Soft Pink suit body
              3: '#000000', // Black sunglasses!
              4: '#FF3366', // Bright red cravatta tie!
            }
            drawPixelSprite(ctx, ADITORE_SPRITE, mob.x, mob.y + mob.bobOffset, 3, mobPalette)
          } else if (mob.type === 'rana') {
            const mobPalette: Record<number, string> = {
              1: '#809829', // frog acid green
              2: '#FF3366', // red mouth
              3: '#FFFFFF', // white corneal highlight
            }
            drawPixelSprite(ctx, RANA_SPRITE, mob.x, mob.y, 3, mobPalette)
          } else if (mob.type === 'mammina') {
            const mobPalette: Record<number, string> = {
              1: '#8A4A33', // brown hair
              2: '#FFCCB6', // skin tone
              3: '#F45390', // dress/body
              4: '#FF82B2', // belly highlight
            }
            drawPixelSprite(ctx, MAMMINA_SPRITE, mob.x, mob.y + mob.bobOffset, 3, mobPalette)
          } else if (mob.type === 'prete') {
            const mobPalette: Record<number, string> = {
              1: '#FFCCB6', // skin tone
              2: '#A0A0A0', // grey hair
              3: '#111111', // black robe
              4: '#FFFFFF', // white collar
            }
            drawPixelSprite(ctx, PRETE_SPRITE, mob.x, mob.y + mob.bobOffset, 3, mobPalette)
          }
        })

        // Spawn Boss (Female Frog or Pope)
        if (!state.bossSpawned && state.frameCounter > 30) {
          state.bossSpawned = true
          if (state.currentLevel === 1) {
            state.boss = {
              bossType: 'rana',
              x: 400 - 27.5, // middle of screen
              y: 513 - 55,    // on the ground
              vx: 0,
              vy: 0,
              width: 55,
              height: 55,
              alive: true,
              health: 45,
              maxHealth: 45,
              jumpCooldown: 60, // 1 second cooldown before first jump
              isJumping: false,
              hitFlash: 0
            }
          } else {
            state.boss = {
              bossType: 'pope',
              x: canvas.width / 2 - 27.5, // Spawn directly in the middle of the screen
              y: 513 - 66, // slightly taller
              vx: -2.0, // move left
              vy: 0,
              width: 55,
              height: 66,
              alive: true,
              health: 80,
              maxHealth: 80,
              jumpCooldown: 60, // 1 second before removing mitre (faster)
              isJumping: false,
              hitFlash: 0,
              state: 0,
              shootTimer: 0
            }
          }
          playSynthSound('matrix') // Play warn sound
        }

        // Update and draw Boss
        if (state.boss && state.boss.alive) {
          const boss = state.boss
          
          if (boss.hitFlash > 0) boss.hitFlash--
          
          // Physics
          if (boss.bossType === 'rana') {
            if (boss.isJumping) {
              boss.vy += 0.35 // Gravity
              boss.y += boss.vy
              boss.x += boss.vx
              
              // Screen boundaries bounce/lock
              if (boss.x < 10) {
                boss.x = 10
                boss.vx = -boss.vx * 0.5
              }
              if (boss.x > canvas.width - boss.width - 10) {
                boss.x = canvas.width - boss.width - 10
                boss.vx = -boss.vx * 0.5
              }
              
              // Land on ground
              const groundY = 513 - boss.height
              if (boss.y >= groundY) {
                boss.y = groundY
                boss.vy = 0
                boss.vx = 0
                boss.isJumping = false
                boss.jumpCooldown = 50 + Math.random() * 40 // wait before next jump
                
                // Land effects!
                state.screenShake = 22 // Shake screen!
                playSynthSound('hit')
                
                // Particle shockwave on landing
                for (let i = 0; i < 20; i++) {
                  state.particles.push({
                    x: boss.x + boss.width / 2 + (Math.random() - 0.5) * 40,
                    y: 513,
                    vx: (Math.random() - 0.5) * 8,
                    vy: -Math.random() * 3,
                    color: '#FF007F', // Lipstick pink particles
                    alpha: 1,
                    life: 20 + Math.random() * 20,
                    maxLife: 40,
                    size: 2.5 + Math.random() * 2
                  })
                }
              }
            } else {
              // On the ground, cooldown countdown
              if (boss.jumpCooldown > 0) {
                boss.jumpCooldown--
              } else {
                // Initiate jump towards Neo!
                boss.isJumping = true
                
                // Calculate direction to Neo
                const targetX = state.eyeX + state.eyeWidth / 2 - boss.width / 2
                const dx = targetX - boss.x
                
                boss.vy = -9.5 - Math.random() * 4 // Jump upwards
                
                // Horizontal speed based on distance
                const jumpDuration = 2 * (-boss.vy) / 0.35 // time to rise and fall
                boss.vx = dx / jumpDuration // move towards Neo
                // Clamp horizontal speed
                boss.vx = Math.max(-4.5, Math.min(4.5, boss.vx))
                
                playSynthSound('zap') // Jump sound
              }
            }
          } else if (boss.bossType === 'pope') {
            // Pope moves left and right on the ground
            boss.x += boss.vx
            if (boss.x < 20 || boss.x > canvas.width - boss.width - 20) {
              boss.vx *= -1
            }

            if (boss.state === 0) {
              // Mitre on, peaceful
              if (boss.jumpCooldown > 0) {
                boss.jumpCooldown--
              } else {
                boss.state = 1 // Remove mitre!
                boss.jumpCooldown = 150 + Math.random() * 90 // AK out for 2.5-4s
                boss.shootTimer = 0
              }
            } else if (boss.state === 1) {
              // AK47 out!
              if (boss.jumpCooldown > 0) {
                boss.jumpCooldown--
                
                // Shoot only if Neo is directly above (within ~100px horizontal radius)
                const neoCenterX = state.eyeX + state.eyeWidth / 2
                const bossCenterX = boss.x + boss.width / 2
                const isNeoAbove = Math.abs(neoCenterX - bossCenterX) < 100
                
                if (isNeoAbove) {
                  if (boss.shootTimer !== undefined) {
                    boss.shootTimer--
                    if (boss.shootTimer <= 0) {
                      // Fire rapid bullets
                      state.bullets.push({
                        x: boss.x + boss.width / 2 - 20, // offset left slightly
                        y: boss.y + 35, // gun level
                        dx: (Math.random() - 0.5) * 3, // slight spread
                        dy: -8, // shoot up towards neo
                        isEnemy: true,
                        color: '#FFD700', // gold bullets
                        bulletType: 'ak47',
                        waveBaseX: 0
                      })
                      boss.shootTimer = 6 // very rapid fire!
                      playSynthSound('hit')
                    }
                  }
                }
              } else {
                boss.state = 0 // Put mitre back on!
                boss.jumpCooldown = 90 + Math.random() * 60 // Rest for 1.5-2.5s
              }
            }
          }
          
          // Collision with Neo (player)
          if (
            boss.x >= state.eyeX - boss.width &&
            boss.x <= state.eyeX + state.eyeWidth &&
            boss.y >= state.eyeY - boss.height &&
            boss.y <= state.eyeY + state.eyeHeight
          ) {
            // ENORMOUS damage
            state.eyeHealth -= 15
            state.eyeHitFlash = 15
            state.screenShake = 18
            
            // Push player back
            state.eyeY = Math.max(60, state.eyeY - 40)
            
            // Huge particle spray
            for (let i = 0; i < 30; i++) {
              state.particles.push({
                x: state.eyeX + state.eyeWidth/2,
                y: state.eyeY + state.eyeHeight/2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: '#FF0000',
                alpha: 1,
                life: 30,
                maxLife: 30,
                size: 3
              })
            }
            playSynthSound('explosion')
            
            // Reset eye if dead
            if (state.eyeHealth <= 0) {
              state.eyeHealth = state.maxEyeHealth
              state.eyeY = Math.max(60, state.eyeY - 80)
            }
          }
          
          // Draw Boss Sprite
          if (boss.bossType === 'rana') {
            const bossPalette: Record<number, string> = {
              1: boss.hitFlash > 0 ? '#FFFFFF' : '#809829', // Acid green or hit flash white
              2: '#FF007F', // HOT PINK LIPSTICK
              3: '#FFFFFF', // White pupils
              5: '#FF82B2'  // Pink cheeks
            }
            drawPixelSprite(ctx, RANA_BOSS_SPRITE, boss.x, boss.y, 5, bossPalette)
          } else {
            const bossPalette: Record<number, string> = {
              1: boss.hitFlash > 0 ? '#FFFFFF' : '#FFD700', // Gold cross on mitre
              2: '#FFCCB6', // Skin
              3: boss.hitFlash > 0 ? '#FFFFFF' : '#F0F0F0', // White robe
              5: '#FFD700', // Gold trim
              6: '#444444'  // AK47 dark grey
            }
            const spriteToDraw = boss.state === 0 ? POPE_BOSS_SPRITE_1 : POPE_BOSS_SPRITE_2
            drawPixelSprite(ctx, spriteToDraw, boss.x, boss.y, 6, bossPalette)
          }
          
          // Draw Boss Health Bar above head
          const bhBarW = 50
          const bhBarH = 4
          const bhBarX = boss.x + (boss.width - bhBarW) / 2
          const bhBarY = boss.y - 10
          
          ctx.fillStyle = '#222'
          ctx.fillRect(bhBarX, bhBarY, bhBarW, bhBarH)
          
          const bossHealthPercent = Math.max(0, boss.health / boss.maxHealth)
          ctx.fillStyle = boss.bossType === 'rana' ? '#FF007F' : '#FFD700'
          ctx.fillRect(bhBarX, bhBarY, bhBarW * bossHealthPercent, bhBarH)
          ctx.strokeStyle = 'rgba(255,255,255,0.3)'
          ctx.strokeRect(bhBarX, bhBarY, bhBarW, bhBarH)
          
          // Boss label
          ctx.fillStyle = boss.bossType === 'rana' ? '#FF007F' : '#FFD700'
          ctx.font = '8px monospace'
          ctx.textAlign = 'center'
          const bossLabel = boss.bossType === 'rana' ? 'MAMMA RANA' : 'IL PAPA'
          ctx.fillText(bossLabel, boss.x + boss.width / 2, boss.y - 14)
        }

        // ==========================================
        // 3. UPDATE LASER BULLETS
        // ==========================================
        state.bullets = state.bullets.filter((b) => {
          
          // DIFFERENTIAL PATHS UPDATE:
          if (b.bulletType === 'wave') {
            b.y += b.dy
            // Beautiful horizontal wave snake pattern
            b.x = b.waveBaseX + Math.sin(b.y / 16) * 22
          } else if (b.bulletType === 'block') {
            // EDITORS TACTICAL HOMING AI:
            // Slow climb
            b.y += b.dy
            
            // Gently steer horizontal tracking towards players Eye
            const targetX = state.eyeX + state.eyeWidth / 2
            const diffX = targetX - b.x
            b.dx += Math.sign(diffX) * 0.05
            
            // Clamp horizontal steering speed for a smooth trajectory curve
            b.dx = Math.max(-1.4, Math.min(1.4, b.dx))
            b.x += b.dx
          } else {
            // Player purple beams
            b.y += b.dy
            b.x += b.dx
          }

          // Out of bounds cleanup
          if (b.y < -10 || b.y > canvas.height + 10 || b.x < 0 || b.x > canvas.width) {
            return false
          }

          // COLLISION: Player laser (Purple `#B026FF`) vs Mobs (Pink) / Boss
          if (!b.isEnemy) {
            // Boss collision check
            if (state.boss && state.boss.alive) {
              const boss = state.boss
              if (
                b.x >= boss.x &&
                b.x <= boss.x + boss.width &&
                b.y >= boss.y &&
                b.y <= boss.y + boss.height
              ) {
                boss.health -= 1.5 // Laser damage
                boss.hitFlash = 5
                
                // Exploding lipstick pink particles
                for (let i = 0; i < 6; i++) {
                  state.particles.push({
                    x: b.x,
                    y: b.y,
                    vx: (Math.random() - 0.5) * 5,
                    vy: -Math.random() * 4,
                    color: '#FF007F', // Lipstick color
                    alpha: 1,
                    life: 20,
                    maxLife: 20,
                    size: 2,
                  })
                }
                
                if (boss.health <= 0) {
                  boss.alive = false
                  // Massive explosion!
                  for (let i = 0; i < 50; i++) {
                    const angle = Math.random() * Math.PI * 2
                    const speed = 2 + Math.random() * 8
                    state.particles.push({
                      x: boss.x + boss.width / 2,
                      y: boss.y + boss.height / 2,
                      vx: Math.cos(angle) * speed,
                      vy: Math.sin(angle) * speed,
                      color: '#FF007F',
                      alpha: 1,
                      life: 40 + Math.random() * 30,
                      maxLife: 70,
                      size: 3 + Math.random() * 3,
                    })
                  }
                  playSynthSound('explosion')
                } else {
                  playSynthSound('hit')
                }
                
                return false // remove laser bullet
              }
            }

            for (let mob of state.mobs) {
              const mobYWithBob = mob.y + mob.bobOffset
              if (
                mob.alive &&
                b.x >= mob.x &&
                b.x <= mob.x + mob.width &&
                b.y >= mobYWithBob &&
                b.y <= mobYWithBob + mob.height
              ) {
                mob.alive = false
                
                // Exploding pixels in the matching mob color!
                for (let i = 0; i < 18; i++) {
                  state.particles.push({
                    x: b.x,
                    y: b.y,
                    vx: (Math.random() - 0.5) * 6,
                    vy: -Math.random() * 6,
                    color: mob.color,
                    alpha: 1,
                    life: 30 + Math.random() * 20,
                    maxLife: 50,
                    size: 2.5 + Math.random() * 2,
                  })
                }

                playSynthSound('explosion')
                return false // remove laser bullet
              }
            }
          } else {
            // COLLISION: Enemy laser (Pinks) vs Player Eye (Green/Purple)
            if (
              b.x >= state.eyeX &&
              b.x <= state.eyeX + state.eyeWidth &&
              b.y >= state.eyeY &&
              b.y <= state.eyeY + state.eyeHeight
            ) {
              
              // MASSIVE DAMAGE LOGIC FOR HOMING EDITOR PROJECTILE BLOCK!
              const dmg = b.bulletType === 'block' ? 10 : 1
              state.eyeHealth -= dmg
              
              // Set flashing frames
              state.eyeHitFlash = b.bulletType === 'block' ? 14 : 8

              // Particle impact spray in player violet color
              for (let i = 0; i < (b.bulletType === 'block' ? 24 : 12); i++) {
                state.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * (b.bulletType === 'block' ? 7 : 5),
                  vy: (Math.random() - 0.5) * (b.bulletType === 'block' ? 7 : 5),
                  color: '#B026FF', // purple player spray
                  alpha: 1,
                  life: 25,
                  maxLife: 25,
                  size: 2,
                })
              }
              playSynthSound('hit')

              // Safeguard logic: reset health, rumble screen, bounce slightly upwards
              if (state.eyeHealth <= 0) {
                state.eyeHealth = state.maxEyeHealth
                state.eyeY = Math.max(60, state.eyeY - 80) // bounce upwards
                
                // Large flash explosion
                for (let i = 0; i < 30; i++) {
                  state.particles.push({
                    x: state.eyeX + state.eyeWidth / 2 + (Math.random() - 0.5) * 60,
                    y: state.eyeY + (Math.random() - 0.5) * 30,
                    vx: (Math.random() - 0.5) * 7,
                    vy: (Math.random() - 0.5) * 7,
                    color: '#FF0000',
                    alpha: 1,
                    life: 40,
                    maxLife: 40,
                    size: 3,
                  })
                }
                playSynthSound('explosion')
              }

              return false
            }
          }

          // DIFFERENTIAL DRAWING DESIGNS:
          ctx.shadowBlur = 8
          ctx.shadowColor = b.color
          
          if (b.bulletType === 'wave') {
            // Draw a glowing musical eighth note!
            ctx.fillStyle = b.color
            
            ctx.beginPath()
            ctx.arc(b.x, b.y, 4, 0, Math.PI * 2) // note head
            ctx.fill()
            
            ctx.fillRect(b.x + 2, b.y - 6, 2, 6) // note stem
            ctx.fillRect(b.x + 2, b.y - 6, 4, 2) // note flag
          } else if (b.bulletType === 'block') {
            // Draw a rigid vertical glowing block with a bright white core!
            ctx.fillStyle = b.color
            ctx.fillRect(b.x - 4, b.y - 8, 8, 14)
            
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(b.x - 2, b.y - 6, 4, 10)
          } else if (b.bulletType === 'baby') {
            const babyPalette: Record<number, string> = {
              2: '#FFCCB6', // skin tone
              3: '#F45390', // pink blanket
              4: '#809829', // or green/blue blanket based on random later? Let's use pink and white
            }
            // For now, draw baby using the BABY_SPRITE
            drawPixelSprite(ctx, BABY_SPRITE, b.x - 6, b.y - 6, 3, babyPalette)
          } else if (b.bulletType === 'crucifix') {
            const crucifixPalette: Record<number, string> = {
              5: '#FFFFFF', // glowing white
            }
            drawPixelSprite(ctx, CRUCIFIX_SPRITE, b.x - 4, b.y - 6, 3, crucifixPalette)
          } else if (b.bulletType === 'ak47') {
            const akPalette: Record<number, string> = {
              6: '#FFD700', // glowing gold bullet
            }
            drawPixelSprite(ctx, AK47_BULLET_SPRITE, b.x - 2, b.y - 2, 2, akPalette)
          } else {
            // Player laser: thick straight purple bar
            ctx.fillStyle = b.color
            ctx.fillRect(b.x - 3, b.y, 6, 12)
          }
          
          ctx.shadowBlur = 0 // reset
          
          return true
        })
      }

      // ==========================================
      // 4. UPDATE & DRAW PARTICLES
      // ==========================================
      state.particles = state.particles.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life--
        p.alpha = p.life / p.maxLife

        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fillRect(p.x, p.y, p.size, p.size)
        ctx.globalAlpha = 1.0

        return p.life > 0
      })

      // ==========================================
      // 5. MATRIX CASCADE TRANSITION STATE
      // ==========================================
      if (state.gameState === 'transition') {
        state.transitionTimer++

        // Update and draw the green nuclear shockwave ring
        if (state.nuclearActive) {
          state.nuclearRadius += 10
          if (state.nuclearRadius > 900) {
            state.nuclearActive = false
          } else {
            // Draw nuclear shockwave
            ctx.shadowBlur = 20
            ctx.shadowColor = '#809829'
            ctx.strokeStyle = `rgba(128, 152, 41, ${1 - state.nuclearRadius / 900})`
            ctx.lineWidth = 18
            ctx.beginPath()
            ctx.arc(state.nuclearX, state.nuclearY, state.nuclearRadius, 0, Math.PI * 2)
            ctx.stroke()

            // Glowing inner circle
            ctx.fillStyle = `rgba(0, 255, 65, ${(1 - state.nuclearRadius / 900) * 0.25})`
            ctx.beginPath()
            ctx.arc(state.nuclearX, state.nuclearY, state.nuclearRadius * 0.75, 0, Math.PI * 2)
            ctx.fill()
            ctx.shadowBlur = 0
          }
        }

        // Only start rendering matrix digital rain and terminal override screen after the initial shockwave blast clears (e.g. 70 frames delay!)
        if (state.transitionTimer > 70) {
          // Callback to parent component for header scramble
          if (!state.triggeredTransitionCallback) {
            onTransitionTriggered()
            state.triggeredTransitionCallback = true
          }

          // Draw falling streams on canvas
          ctx.font = '15px monospace'
          ctx.textAlign = 'left'
          state.matrixStreams.forEach((stream) => {
            stream.y += stream.speed

            if (stream.y > canvas.height + 200) {
              stream.y = Math.random() * -300
            }

            stream.chars.forEach((char, index) => {
              const cy = stream.y - index * 18
              if (cy > 0 && cy < canvas.height) {
                const opacity = (stream.chars.length - index) / stream.chars.length
                ctx.fillStyle = index === 0 ? 'rgba(255, 255, 255, 0.95)' : `rgba(0, 255, 65, ${opacity * 0.9})`
                ctx.fillText(char, stream.x, cy)
              }
            })

            if (Math.random() < 0.05) {
              stream.chars[Math.floor(Math.random() * stream.chars.length)] = 
                String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
            }
          })

          // Overlay Terminal window box
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
          ctx.fillRect(50, 150, canvas.width - 100, 300)
          
          ctx.strokeStyle = '#00FF41'
          ctx.lineWidth = 1
          ctx.strokeRect(50, 150, canvas.width - 100, 300)

          // Typewriter glow text
          ctx.fillStyle = '#00FF41'
          ctx.font = '22px font-neo, monospace'
          ctx.textAlign = 'center'
          ctx.shadowBlur = 10
          ctx.shadowColor = '#00FF41'
          
          ctx.fillText(`[!] NEO-ONE SYSTEM INVASION COMPLETED`, canvas.width / 2, 200)
          
          ctx.font = '14px monospace'
          
          const lines = [
            `ALIEN EYE TOUCHDOWN ESTABLISHED...`,
            `CORRUPTING EARTH SECURE ROUTERS...`,
            `DECRYPTING EVENT PORTAL REGISTRY...`,
            `OPENING CALENDAR TELEPORT CHANNEL...`,
            `SYS OVERRIDE: REDIRECTING IN 3... 2... 1...`
          ]

          // Adjust typing speed offset because of the 70 frames delay
          const visibleLines = Math.floor((state.transitionTimer - 70) / 25)
          for (let i = 0; i < Math.min(lines.length, visibleLines); i++) {
            ctx.fillText(`> ${lines[i]}`, canvas.width / 2, 250 + i * 30)
          }

          ctx.shadowBlur = 0 // reset
        }
      }

      ctx.restore()

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [onTransitionTriggered])

  const debugSetLevel = (level: number) => {
    if (!stateRef.current) return
    const state = stateRef.current
    state.currentLevel = level
    state.mobs = []
    state.bullets = []
    state.boss = null
    state.bossSpawned = false
    state.gameState = 'playing'
    state.eyeY = 60
    state.frameCounter = 0 // Reset frame counter to trigger immediate boss spawn
  }

  return (
    <div 
      data-minigame="true"
      onClick={(e) => e.stopPropagation()}
      className="relative group w-full max-w-full h-full flex flex-col mx-auto select-none min-w-0"
    >
      {/* Decorative Arcade Monitor Bezels */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#F45390] via-[#809829] to-[#F45390] rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 pointer-events-none" />
      
      {/* Outer Cabinet Enclosure */}
      <div className="relative flex flex-col flex-1 min-h-0 min-w-0 rounded-lg overflow-hidden border border-white/10 bg-black p-1 shadow-2xl w-full max-w-full box-border">
        
        {/* Bestiary Status Bar */}
        <div className="flex flex-wrap justify-center sm:justify-around items-center gap-x-2 gap-y-1.5 px-2 py-2 bg-zinc-950/90 border-b border-white/5 text-[7px] sm:text-[9px] font-mono tracking-wider text-white/50 uppercase select-none w-full max-w-full min-w-0">
          {/* Aditore Corrotto Bestiary */}
          <div className="flex items-center gap-1.5">
            <PixelSpritePreview 
              sprite={ADITORE_SPRITE} 
              palette={{
                1: '#FFFFFF',
                2: '#FF82B2',
                3: '#000000',
                4: '#FF3366',
              }}
              pixelSize={1.5}
            />
            <span className="text-[#FF82B2] font-bold">EDITORE</span>
          </div>

          <div className="hidden sm:block text-white/20 select-none">|</div>

          {/* Artista Venduto Bestiary */}
          <div className="flex items-center gap-1.5">
            <PixelSpritePreview 
              sprite={ARTISTA_SPRITE} 
              palette={{
                1: '#FFFFFF',
                2: '#F45390',
              }}
              pixelSize={1.5}
            />
            <span className="text-[#F45390] font-bold">ARTISTA</span>
          </div>

          <div className="hidden sm:block text-white/20 select-none">|</div>

          {/* Frog Bestiary */}
          <div className="flex items-center gap-1.5">
            <PixelSpritePreview 
              sprite={RANA_SPRITE} 
              palette={{
                1: '#809829',
                2: '#FF3366',
                3: '#FFFFFF',
              }}
              pixelSize={1.5}
            />
            <span className="text-[#809829] font-bold">RANE</span>
          </div>
        </div>

        {/* Debug UI - Level Selector */}
        <div className="absolute top-12 right-4 flex flex-col gap-2 z-50 pointer-events-auto">
          <button 
            onClick={() => debugSetLevel(1)}
            className="px-3 py-1.5 bg-black/50 hover:bg-black/80 text-xs font-mono rounded text-[#F45390] backdrop-blur border border-[#F45390]/50 uppercase font-bold cursor-pointer"
          >
            LVL 1
          </button>
          <button 
            onClick={() => debugSetLevel(2)}
            className="px-3 py-1.5 bg-black/50 hover:bg-black/80 text-xs font-mono rounded text-[#809829] backdrop-blur border border-[#809829]/50 uppercase font-bold cursor-pointer"
          >
            LVL 2
          </button>
        </div>

        {/* The CRT Screen */}
        <div className="relative flex-1 min-h-0 min-w-0 w-full max-w-full bg-black cursor-crosshair overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full block z-10"
              style={{ objectFit: 'contain' }}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onClick={handleCanvasClick}
            />

            {/* Scanlines overlays */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-scanlines opacity-[0.08]" />
            <div className="absolute inset-0 z-20 pointer-events-none bg-crt-glare bg-cover opacity-[0.03]" />
          </div>
        </div>

        {/* Arcade Control Panel */}
        {isTouchDevice && (
          <div className="bg-zinc-950 border-t border-white/10 px-3 py-3 sm:px-6 sm:py-4 flex justify-between items-center select-none animate-fade-in shrink-0 w-full max-w-full min-w-0 box-border gap-2">
            {/* Left / Right Directional Buttons */}
            <div className="flex gap-2 sm:gap-4 shrink-0">
              {/* Left Button */}
              <button
                onMouseDown={() => { stateRef.current.keys['ArrowLeft'] = true }}
                onMouseUp={() => { stateRef.current.keys['ArrowLeft'] = false }}
                onMouseLeave={() => { stateRef.current.keys['ArrowLeft'] = false }}
                onTouchStart={(e) => { e.preventDefault(); stateRef.current.keys['ArrowLeft'] = true }}
                onTouchEnd={(e) => { e.preventDefault(); stateRef.current.keys['ArrowLeft'] = false }}
                className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-gradient-to-b from-[#FF82B2] to-[#F45390] border-2 border-[#FFB3D1] shadow-[0_4px_0_#A01548,inset_0_2px_4px_rgba(255,255,255,0.4)] active:scale-95 active:translate-y-1 active:shadow-[0_0px_0_#A01548,inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center text-white text-2xl font-bold transition-all outline-none"
              >
                ◀
              </button>
              
              {/* Right Button */}
              <button
                onMouseDown={() => { stateRef.current.keys['ArrowRight'] = true }}
                onMouseUp={() => { stateRef.current.keys['ArrowRight'] = false }}
                onMouseLeave={() => { stateRef.current.keys['ArrowRight'] = false }}
                onTouchStart={(e) => { e.preventDefault(); stateRef.current.keys['ArrowRight'] = true }}
                onTouchEnd={(e) => { e.preventDefault(); stateRef.current.keys['ArrowRight'] = false }}
                className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-gradient-to-b from-[#FF82B2] to-[#F45390] border-2 border-[#FFB3D1] shadow-[0_4px_0_#A01548,inset_0_2px_4px_rgba(255,255,255,0.4)] active:scale-95 active:translate-y-1 active:shadow-[0_0px_0_#A01548,inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center text-white text-2xl font-bold transition-all outline-none"
              >
                ▶
              </button>
            </div>

            {/* Joystick label/aesthetic center mark */}
            <div className="hidden sm:block text-[8px] font-mono text-white/30 tracking-widest uppercase truncate shrink">
              CONTROLLI CABINATO
            </div>

            {/* Fire Button (Right side!) */}
            <div className="shrink-0">
              <button
                onMouseDown={() => { stateRef.current.keys[' '] = true }}
                onMouseUp={() => { stateRef.current.keys[' '] = false }}
                onMouseLeave={() => { stateRef.current.keys[' '] = false }}
                onTouchStart={(e) => { e.preventDefault(); stateRef.current.keys[' '] = true }}
                onTouchEnd={(e) => { e.preventDefault(); stateRef.current.keys[' '] = false }}
                className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-gradient-to-b from-[#9CB042] to-[#809829] border-2 border-[#C5D965] shadow-[0_4px_0_#4A5A10,inset_0_2px_4px_rgba(255,255,255,0.5)] active:scale-95 active:translate-y-1 active:shadow-[0_0px_0_#4A5A10,inset_0_2px_4px_rgba(255,255,255,0.5)] flex flex-col items-center justify-center text-white text-xs font-neo font-bold tracking-wider transition-all outline-none"
              >
                <span className="text-xl sm:text-2xl leading-none">☄</span>
                <span className="text-[10px] sm:text-xs">SPARA</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ----------------------------------------------------
// MAIN BIO PAGE COMPONENT
// ----------------------------------------------------

