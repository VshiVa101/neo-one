'use client'

import React, { useEffect, useRef, useState, Suspense, lazy } from 'react'
import type { Page } from '@/payload-types'

// Lazy load ThreeEye to avoid SSR issues
const ThreeEye = lazy(() => import('@/components/ThreeEye'))

type HeroProps = Page['hero']

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const onChange = () => setReduced(Boolean(mq.matches))
    onChange()
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  return reduced
}

const PixelExplosionLayer: React.FC<{
  trigger: number
  origin: { x: number; y: number }
  active: boolean
  durationMs?: number
  palette?: string[]
  count?: number
  step?: number
}> = ({
  trigger,
  origin,
  active,
  durationMs = 900,
  palette = [
    '#00E5FF',
    '#FF2D55',
    '#FFD400',
    '#7CFF00',
    '#A855F7',
    '#FF7A18',
    '#A3FF12',
    '#FFFFFF',
  ],
  count = 140,
  step = 3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!active || trigger <= 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const start = performance.now()

    const randInt = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1))

    const particles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = randInt(180, 420)
      return {
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: randInt(3, 8),
        color: palette[randInt(0, palette.length - 1)],
        rotation: Math.random() * 360,
      }
    })

    const frame = () => {
      const now = performance.now()
      const t = (now - start) / durationMs

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (const p of particles) {
        p.x += p.vx * (1 / 60)
        p.y += p.vy * (1 / 60)
        p.vx *= 0.92
        p.vy *= 0.92

        const alpha = Math.max(0, 1 - t)
        if (alpha <= 0) continue

        const qx = Math.round(p.x / step) * step
        const qy = Math.round(p.y / step) * step

        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.fillRect(qx - p.size / 2, qy - p.size / 2, p.size, p.size)
      }

      ctx.globalAlpha = 1

      if (t < 1) raf = window.requestAnimationFrame(frame)
    }

    raf = window.requestAnimationFrame(frame)
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active, durationMs, origin.x, origin.y, trigger, count, step, palette])

  return (
    <canvas
      ref={canvasRef}
      className="neo-pixel-explosion"
      style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}
    />
  )
}

export const NeoUncensoredHero: React.FC<HeroProps> = () => {
  const reducedMotion = usePrefersReducedMotion()

  const EXPLOSION_MS = 980

  const [introVisible, setIntroVisible] = useState(true)
  const [closing, setClosing] = useState(false)
  const [showHome, setShowHome] = useState(false)

  const [explosionEyeTrigger, setExplosionEyeTrigger] = useState(0)
  const [explosionBorderTrigger, setExplosionBorderTrigger] = useState(0)
  const [explosionOrigin, setExplosionOrigin] = useState({ x: 0, y: 0 })
  const [explosionActive, setExplosionActive] = useState(false)
  const eyeContainerRef = useRef<HTMLDivElement>(null)
  
  // Audio per la reazione a catena
  const triggerChainExplosion = () => {
    const playSound = (volume: number) => {
      const audio = new Audio('/media/explosion-arcade.mp3')
      audio.volume = volume
      audio.play().catch(() => {})
    }

    // Sequenza di esplosioni "sulle esplosioni"
    playSound(0.8)
    setTimeout(() => playSound(0.6), 150)
    setTimeout(() => playSound(0.4), 320)
  }

  const handleEyeClick = () => {
    if (!introVisible || closing) return

    const rect = eyeContainerRef.current?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight * 0.42
    setExplosionOrigin({ x, y })
    setExplosionActive(true)
    setExplosionEyeTrigger((t) => t + 1)
    setExplosionBorderTrigger((t) => t + 1)
    setClosing(true)
    triggerChainExplosion()

    // Trigger explosion GIFs
    window.setTimeout(() => {
      setExplosionActive(false)
    }, 800)

    // Transition to home
    window.setTimeout(() => {
      setIntroVisible(false)
      setClosing(false)
      setShowHome(true)
    }, EXPLOSION_MS)
  }

  const ringText = "qui dio non c'è , tua madre non vuole e tuo padre è gia dentro"

  return (
    <>
      <section
        className="neo-uncensored-hero"
        style={{
          position: 'relative',
          minHeight: '100vh',
          maxHeight: introVisible ? '100vh' : '0px',
          opacity: introVisible ? 1 : 0,
          transition: 'max-height 900ms ease, opacity 600ms ease',
          overflow: 'visible',
        }}
        aria-label="Landing senza censure"
      >
        <style jsx global>{`
          @font-face {
            font-family: 'MergedFontNEO';
            src: url('/neo-assets/hero/fonts/MergedFontNEO.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
          }

          .neo-uncensored-hero {
            color: white;
          }

          .neo-bg {
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background-size: cover;
            background-position: center;
            opacity: 0;
            transition: opacity 150ms ease;
          }

          .neo-bg--hero {
            background-image: url('/neo-assets/hero/backgrounds/bg-herosection.gif');
            opacity: 1;
          }

          .neo-bg--home {
            background-image: url('/neo-assets/hero/backgrounds/bg-home.gif');
          }

          .neo-hero-center {
            height: 100vh;
            min-height: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
          }

          .neo-ring-wrap {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 520px;
            height: 520px;
            z-index: 1;
            pointer-events: none;
            animation: neoRingSpin 24s linear infinite;
            filter: drop-shadow(0 0 16px rgba(163, 255, 18, 0.1));
          }

          @keyframes neoRingSpin {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }

          .neo-globe-container {
            position: relative;
            z-index: 2;
            width: 300px;
            height: 300px;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }

          @media (prefers-reduced-motion: reduce) {
            .neo-ring-wrap {
              animation: none;
            }
          }

          .neo-explosions {
            position: fixed;
            inset: 0;
            z-index: 60;
            pointer-events: none;
          }

          .neo-explosion {
            position: absolute;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            pointer-events: none;
            user-select: none;
          }

          .neo-explosion--eye {
            width: 260px;
            height: 260px;
            object-fit: cover;
            filter: drop-shadow(0 0 18px rgba(0, 229, 255, 0.15));
          }

          .neo-explosion--border {
            width: 520px;
            height: 520px;
            object-fit: cover;
            mix-blend-mode: screen;
            filter: drop-shadow(0 0 22px rgba(163, 255, 18, 0.12));
          }

          .neo-home-section {
            min-height: 100vh;
            position: relative;
            z-index: 10;
            opacity: 0;
            transform: translateY(20px);
            transition:
              opacity 800ms ease,
              transform 800ms ease;
          }

          .neo-home-section--visible {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>

        {/* Pixel explosion canvas */}
        <PixelExplosionLayer
          trigger={explosionEyeTrigger}
          origin={explosionOrigin}
          active={explosionActive}
        />

        {/* Background transitions */}
        <div
          className="neo-bg neo-bg--hero"
          style={{
            opacity: introVisible && !closing ? 1 : 0,
          }}
          aria-hidden
        />
        <div
          className="neo-bg neo-bg--home"
          style={{
            opacity: closing || !introVisible ? 1 : 0,
          }}
          aria-hidden
        />

        {/* Explosion GIFs */}
        {closing && introVisible && (
          <div className="neo-explosions" aria-hidden>
            <img
              key={explosionEyeTrigger}
              className="neo-explosion neo-explosion--eye"
              src="/neo-assets/hero/explosions/eye-explosion.gif"
              alt=""
              draggable={false}
              style={{ left: explosionOrigin.x, top: explosionOrigin.y }}
            />
            <img
              key={explosionBorderTrigger}
              className="neo-explosion neo-explosion--border"
              src="/neo-assets/hero/explosions/border-flames.gif"
              alt=""
              draggable={false}
              style={{ left: explosionOrigin.x, top: explosionOrigin.y }}
            />
          </div>
        )}

        <div className="neo-hero-center">
          {/* Rotating text ring */}
          <div className="neo-ring-wrap" aria-hidden>
            <svg viewBox="0 0 400 400" width={520} height={520}>
              <defs>
                <path
                  id="neo-ring-path"
                  d="M 200,200 m -185,0 a 185,185 0 1,1 370,0 a 185,185 0 1,1 -370,0"
                />
              </defs>
              <text
                fill="#A3FF12"
                fontFamily="MergedFontNEO, sans-serif"
                fontSize="22"
                letterSpacing="2"
              >
                <textPath href="#neo-ring-path" startOffset="50%" textAnchor="middle">
                  {ringText}
                </textPath>
              </text>
            </svg>
          </div>

          {/* 3D Eye Globe */}
          <div
            ref={eyeContainerRef}
            className="neo-globe-container"
            onClick={handleEyeClick}
            aria-label="Entra nel sito"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleEyeClick()}
          >
            <Suspense
              fallback={
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle at 30% 25%, #ffffff, #d9d9d9 48%, #9e9e9e 85%)',
                  }}
                />
              }
            >
              <ThreeEye onClick={handleEyeClick} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Home section - appears after explosion */}
      <section
        className={`neo-home-section ${showHome ? 'neo-home-section--visible' : ''}`}
        aria-label="Galleria Neo One"
      >
        <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'MergedFontNEO, sans-serif',
              fontSize: '3rem',
              marginBottom: '20px',
            }}
          >
            NEO ONE
          </h1>
          <p style={{ opacity: 0.7 }}>Galleria cluster in arrivo...</p>
        </div>
      </section>
    </>
  )
}

export default NeoUncensoredHero
