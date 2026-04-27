'use client'

import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useTransition } from '@/context/TransitionContext'
import { useRouter } from 'next/navigation'

type EyePointerState = {
  x: number
  y: number
  inputType: 'mouse' | 'touch' | null
  lastTouchAt: number
  isTouchActive: boolean
}

interface EyeModelProps {
  targetRoute?: string
  showCircularText?: boolean
  globalTracking?: boolean
  externalMouse?: React.RefObject<EyePointerState>
  onReady?: () => void
  isUnlocked?: boolean
  scaleMultiplier?: number
}

// Carichiamo la versione ottimizzata con supporto Draco
const DRACO_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'
const GLB_URL = `/occhione-opt.glb`

// PRELOAD AGGRESSIVO
useGLTF.preload(GLB_URL, DRACO_URL)

const EyeModel = ({
  targetRoute = '/home',
  showCircularText = false,
  globalTracking = false,
  externalMouse,
  onReady,
  isUnlocked = true,
  scaleMultiplier = 1,
}: EyeModelProps) => {
  const eyeRef = useRef<THREE.Group>(null)
  const animationRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const { triggerTransition } = useTransition()
  const router = useRouter()
  const [isIgnoringPointer, setIsIgnoringPointer] = useState(false)

  const { scene: gltfScene } = useGLTF(GLB_URL, DRACO_URL)
  const scene = useMemo(() => gltfScene.clone(true), [gltfScene])
  const { viewport } = useThree()

  // Audio Refs
  const dashAudio = useRef<HTMLAudioElement | null>(null)
  const returnAudio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const loadAudio = (path: string, volume: number) => {
      const audio = new Audio(path)
      audio.volume = volume
      audio.preload = 'auto'
      audio.load()
      return audio
    }
    dashAudio.current = loadAudio('/media/return.mp3', 0.8)
    returnAudio.current = loadAudio('/media/return.mp3', 0.5)
  }, [])

  const baseScale = Math.min(viewport.width, viewport.height) * 0.1 * (scaleMultiplier || 1)

  useEffect(() => {
    if (scene && onReady) {
      const timer = setTimeout(onReady, 100)
      return () => clearTimeout(timer)
    }
  }, [scene, onReady])

  useFrame((state) => {
    if (!eyeRef.current || !animationRef.current) return

    const time = state.clock.getElapsedTime()
    const pointer = globalTracking ? externalMouse?.current : null
    const now = performance.now() / 1000

    // --- 1. TRACKING: lo sguardo segue mouse/touch sul gruppo esterno ---
    const rotationOffset = -Math.PI / 2
    const idleX = Math.sin(time * 0.7) * 0.6
    const idleY = Math.sin(time * 0.9) * 0.25

    const hasMousePointer = pointer?.inputType === 'mouse'
    const hasFreshTouchPointer =
      pointer?.inputType === 'touch' && (pointer.isTouchActive || now - pointer.lastTouchAt <= 1)
    const usePointer =
      !isIgnoringPointer && (!globalTracking || hasMousePointer || hasFreshTouchPointer)

    const pointerX = pointer ? pointer.x : state.pointer.x
    const pointerY = pointer ? pointer.y : state.pointer.y

    const targetX = usePointer ? (pointerX * Math.PI) / 4 + rotationOffset : rotationOffset + idleX
    const targetY = usePointer ? (pointerY * Math.PI) / 4 : idleY

    eyeRef.current.rotation.y = THREE.MathUtils.lerp(eyeRef.current.rotation.y, targetX, 0.14)
    eyeRef.current.rotation.x = THREE.MathUtils.lerp(eyeRef.current.rotation.x, -targetY, 0.14)
    eyeRef.current.rotation.z = THREE.MathUtils.lerp(eyeRef.current.rotation.z, 0, 0.16)

    // --- 2. ANIMAZIONI VIVE: separate dal tracking sul gruppo interno ---
    // Capovolgimento lento periodico.
    const flipInterval = 9
    const flipDuration = 1.2
    const flipTime = time % flipInterval
    const flipX =
      flipTime < flipDuration
        ? ((1 - Math.cos((flipTime / flipDuration) * Math.PI)) / 2) * Math.PI * 2
        : 0

    // Rotazione veloce sull'asse della pupilla.
    const rollInterval = 13
    const rollDuration = 1.5
    const rollTime = time % rollInterval
    const rollZ =
      rollTime < rollDuration
        ? ((1 - Math.cos((rollTime / rollDuration) * Math.PI)) / 2) * Math.PI * 2
        : 0

    // Vibrazione periodica breve.
    const vibrationInterval = 5
    const vibrationDuration = 0.15
    const isVibrating = time % vibrationInterval < vibrationDuration
    const vibrationFrequency = 100
    const vibrationAmplitude = 0.15
    const vibrationX = isVibrating ? Math.sin(time * vibrationFrequency) * vibrationAmplitude : 0
    const vibrationY = isVibrating ? Math.cos(time * vibrationFrequency) * vibrationAmplitude : 0

    animationRef.current.rotation.x = -flipX + vibrationY
    animationRef.current.rotation.y = vibrationX
    animationRef.current.rotation.z = rollZ

    const currentTargetLocal = hovered ? baseScale * 4.2 : baseScale
    eyeRef.current.scale.setScalar(
      THREE.MathUtils.lerp(eyeRef.current.scale.x, currentTargetLocal, 0.15),
    )
  })

  const handleClick = () => {
    if (!isUnlocked) return
    if (hovered) setHovered(false)
    setIsIgnoringPointer(true)
    triggerTransition()
    setTimeout(() => {
      if (targetRoute === '/home') {
        router.replace(targetRoute)
      } else {
        router.push(targetRoute)
      }
    }, 1500)
  }

  return (
    <>
      <group ref={eyeRef} scale={baseScale}>
        <group ref={animationRef}>
          <primitive
            object={scene}
            onPointerOver={() => {
              setHovered(true)
              document.body.style.cursor = 'pointer'
              if (dashAudio.current) {
                returnAudio.current?.pause()
                dashAudio.current.currentTime = 0
                dashAudio.current.play().catch(() => {})
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
              if (returnAudio.current) {
                dashAudio.current?.pause()
                returnAudio.current.currentTime = 0
                returnAudio.current.play().catch(() => {})
              }
            }}
            onClick={handleClick}
            scale={1}
            position={[0, 0, 0]}
          />
        </group>
      </group>

      {/* Testo circolare SOLO nella Hero Section */}
      {showCircularText && (
        <Html
          center
          zIndexRange={[10, 0]}
          className="pointer-events-none neo-skip-branding"
          data-neo-skip="true"
        >
          <div
            className="w-[90vmin] h-[90vmin] md:w-[80vmin] md:h-[80vmin] max-w-[550px] max-h-[550px] animate-[spin_20s_linear_infinite] flex items-center justify-center neo-skip-branding"
            data-neo-skip="true"
          >
            <CircularText isMobile={false} />
            <CircularText isMobile={true} />
          </div>
        </Html>
      )}
    </>
  )
}

// Component per il testo circolare dinamico.
// Strategia: budget fisso di caratteri + SVG textLength per adattamento perfetto.
// Zero misurazione canvas = zero bug di overflow su qualsiasi viewport.
function CircularText({ isMobile }: { isMobile: boolean }) {
  const [content, setContent] = useState('')

  const words = [
    'nessuna paura!...',
    'nessuna censura!...',
    'toccami!...',
    'no!...',
    'occhio!',
    'paura?...',
    'sicuro?...',
    'tua mamma non vuole!...',
  ]

  // Circonferenza SVG fissa: 2 * PI * 94 ≈ 590.6 unità SVG
  // Questa è una costante geometrica, indipendente dal viewport.
  const pathLength = 2 * Math.PI * 94

  useEffect(() => {
    // Budget di caratteri conservativo.
    // Il font uppercase Neo a 9px ha ~5.5-7 unità SVG per carattere.
    // Usando ~6.5 come media: 590/6.5 ≈ 90 chars.
    // textLength SVG compenserà qualsiasi micro-differenza regolando la spaziatura.
    const charBudget = isMobile ? 80 : 90

    let text = ''
    let lastWord = ''

    // Riempi con token casuali senza ripetizioni immediate
    while (true) {
      const availableWords = words.filter((w) => w !== lastWord)
      const candidate = availableWords[Math.floor(Math.random() * availableWords.length)]
      const spaced = candidate + ' '

      // Se il prossimo token supererebbe il budget, prova con uno più corto
      if (text.length + spaced.length > charBudget) {
        const sorted = [...availableWords].sort((a, b) => a.length - b.length)
        let fitted = false
        for (const word of sorted) {
          // +1 per lo spazio, deve restare entro il budget
          if (text.length + word.length + 1 <= charBudget) {
            text += word + ' '
            lastWord = word
            fitted = true
            break
          }
        }
        if (!fitted) break
      } else {
        text += spaced
        lastWord = candidate
      }
    }

    // Riempi il budget rimanente con singoli punti "."
    while (text.length < charBudget) {
      text += '.'
    }

    setContent(text)
  }, [isMobile])

  const curveId = isMobile ? 'mobileCurve' : 'desktopCurve'

  return (
    <div className={`w-full h-full ${isMobile ? 'block md:hidden' : 'hidden md:block'}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path
          id={curveId}
          d="M 100, 100 m -94, 0 a 94,94 0 1,1 188,0 a 94,94 0 1,1 -188,0"
          fill="transparent"
        />
        <text
          className="font-neo text-[#809829] fill-current uppercase"
          style={{ fontSize: isMobile ? '10px' : '9px' }}
        >
          <textPath href={`#${curveId}`} textLength={pathLength * 0.97} lengthAdjust="spacing">
            {content}
          </textPath>
        </text>
      </svg>
    </div>
  )
}

interface EyeSceneProps {
  targetRoute?: string
  showCircularText?: boolean
  globalTracking?: boolean
  className?: string
  onReady?: () => void
  isUnlocked?: boolean
  scaleMultiplier?: number
}

export const EyeScene = ({
  targetRoute = '/home',
  showCircularText = false,
  globalTracking = false,
  className = '',
  onReady,
  isUnlocked = true,
  scaleMultiplier = 1,
}: EyeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const globalMouse = useRef<EyePointerState>({
    x: 0,
    y: 0,
    inputType: null,
    lastTouchAt: -999,
    isTouchActive: false,
  })
  const ignoreSyntheticMouseUntil = useRef(0)

  // Tracking globale del puntatore (mouse + touch) rispetto al centro di QUESTO contenitore
  useEffect(() => {
    if (!globalTracking) return

    const updateFromPoint = (
      clientX: number,
      clientY: number,
      inputType: EyePointerState['inputType'],
    ) => {
      if (!containerRef.current || !inputType) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      globalMouse.current.x = THREE.MathUtils.clamp(
        (clientX - centerX) / (window.innerWidth / 2),
        -1.5,
        1.5,
      )
      globalMouse.current.y = THREE.MathUtils.clamp(
        -(clientY - centerY) / (window.innerHeight / 2),
        -1.5,
        1.5,
      )
      globalMouse.current.inputType = inputType
      if (inputType === 'touch') {
        globalMouse.current.lastTouchAt = performance.now() / 1000
        globalMouse.current.isTouchActive = true
        ignoreSyntheticMouseUntil.current = performance.now() + 1600
      } else {
        globalMouse.current.isTouchActive = false
      }
    }

    const handleMouseInput = (e: MouseEvent) => {
      if (performance.now() < ignoreSyntheticMouseUntil.current) return
      updateFromPoint(e.clientX, e.clientY, 'mouse')
    }

    // Su mobile il touch deve fissare il punto mentre il dito è giù + 1 secondo, poi torna all'idle.
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0] ?? e.changedTouches[0]
      if (touch) updateFromPoint(touch.clientX, touch.clientY, 'touch')
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      if (touch) updateFromPoint(touch.clientX, touch.clientY, 'touch')
      globalMouse.current.isTouchActive = false
      globalMouse.current.lastTouchAt = performance.now() / 1000
      ignoreSyntheticMouseUntil.current = performance.now() + 1600
    }

    window.addEventListener('mousemove', handleMouseInput)
    window.addEventListener('mousedown', handleMouseInput)
    window.addEventListener('touchstart', handleTouchMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseInput)
      window.removeEventListener('mousedown', handleMouseInput)
      window.removeEventListener('touchstart', handleTouchMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [globalTracking])

  return (
    <div ref={containerRef} className={`w-full h-full absolute inset-0 z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
      >
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 10, 5]} intensity={0.1} />

        {/* Luce Verde Acida da Sud - Potenziata */}
        <pointLight position={[0, -5, 2]} intensity={120} color="#768b1a" distance={20} decay={2} />

        <Suspense
          fallback={
            <Html center>
              <div className="w-4 h-4 rounded-full bg-[#768b1a] blur-md animate-pulse" />
            </Html>
          }
        >
          <EyeModel
            targetRoute={targetRoute}
            showCircularText={showCircularText}
            globalTracking={globalTracking}
            externalMouse={globalMouse}
            onReady={onReady}
            isUnlocked={isUnlocked}
            scaleMultiplier={scaleMultiplier}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
