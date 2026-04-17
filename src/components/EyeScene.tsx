'use client'

import React, { useRef, useState, useEffect, Suspense, useLayoutEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useTexture, Decal, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useTransition } from '@/context/TransitionContext'
import { useRouter } from 'next/navigation'

interface EyeModelProps {
    targetRoute?: string
    showCircularText?: boolean
    globalTracking?: boolean
    externalMouse?: React.RefObject<{ x: number, y: number }>
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
    isUnlocked = false
    , scaleMultiplier = 1
}: EyeModelProps) => {
    const eyeRef = useRef<THREE.Group>(null)
    const [hovered, setHovered] = useState(false)
    const { triggerTransition } = useTransition()
    const router = useRouter()

    const { scene } = useGLTF(GLB_URL, DRACO_URL)
    const { viewport } = useThree()

    // Audio Refs per la gestione dei suoni
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

    // Calcoliamo una scala base basata sull'area minima visibile (vmin)
    // Usiamo 0.10 come base e un moltiplicatore opzionale per mobile/hero.
    const baseScale = Math.min(viewport.width, viewport.height) * 0.10 * (scaleMultiplier || 1)
    const currentTarget = hovered ? baseScale * 3.8 : baseScale


    // Segnaliamo che l'occhio è pronto appena il componente viene montato con la scena
    useEffect(() => {
        if (scene && onReady) {
            // Piccolo timeout per assicurarci che il renderer abbia allocato il contesto
            const timer = setTimeout(onReady, 100)
            return () => clearTimeout(timer)
        }
    }, [scene, onReady])

    useFrame((state) => {
        if (!eyeRef.current) return

        const time = state.clock.getElapsedTime()

        // --- 1. DEFINIZIONE TIMING ---
        const flipInterval = 13
        const flipDuration = 1.2
        const flipTime = time % flipInterval
        const isFlipping = flipTime < flipDuration

        const jumpInterval = 4
        const jumpDuration = 0.15
        const isVibrating = !isFlipping && (time % jumpInterval) < jumpDuration

        // --- 2. GESTIONE LOOK-AT (MOUSE) ---
        const pointerX = (globalTracking && externalMouse?.current) ? externalMouse.current.x : state.pointer.x
        const pointerY = (globalTracking && externalMouse?.current) ? externalMouse.current.y : state.pointer.y

        // LOGICA ORIGINALE DI PUNTAMENTO (PI/4 e lerp 0.1)
        const rotationOffset = -Math.PI / 2

        // Se non abbiamo un puntatore (es. su mobile/touch) usiamo movimenti autonomi (idle)
        const pointerMagnitude = Math.hypot(pointerX, pointerY)
        const usingPointer = pointerMagnitude > 0.001

        const idleX = Math.sin(time * 0.35) * 0.6
        const idleY = Math.sin(time * 0.45) * 0.25

        const targetX = usingPointer ? (pointerX * Math.PI) / 4 + rotationOffset : rotationOffset + idleX
        const targetY = usingPointer ? (pointerY * Math.PI) / 4 : idleY

        // --- 3. CALCOLO MOVIMENTI SPECIALI ---
        let flipX = 0
        if (isFlipping) {
            const progress = flipTime / flipDuration
            const smoothProgress = (1 - Math.cos(progress * Math.PI)) / 2
            flipX = smoothProgress * Math.PI * 2
        } else {
            // FIX DEFINITIVO: Resettiamo la rotazione interna di Three.js
            // per evitare che il lerp cerchi di "tornare indietro" da 360 gradi a 0.
            // Lo facciamo solo nel primo frame dopo la fine del flipping.
            if (eyeRef.current.rotation.x < -Math.PI) {
                 eyeRef.current.rotation.x += Math.PI * 2
            }
        }

        let vibrationX = 0
        let vibrationY = 0
        if (isVibrating) {
            const frequency = 100
            const amplitude = 0.15
            vibrationX = Math.sin(time * frequency) * amplitude
            vibrationY = Math.cos(time * frequency) * amplitude
        }

        // --- 4. APPLICAZIONE ROTAZIONE UNIFICATA ---
        eyeRef.current.rotation.y = THREE.MathUtils.lerp(eyeRef.current.rotation.y, targetX + vibrationX, 0.1)
        eyeRef.current.rotation.x = THREE.MathUtils.lerp(eyeRef.current.rotation.x, -targetY + vibrationY - flipX, 0.1)

        const currentTargetLocal = hovered ? baseScale * 4.2 : baseScale
        eyeRef.current.scale.setScalar(THREE.MathUtils.lerp(eyeRef.current.scale.x, currentTargetLocal, 0.15))
    })

    const handleClick = () => {
        if (!isUnlocked) return // Impedisce l'attivazione se il lock è attivo
        if (hovered) setHovered(false)
        triggerTransition()
        // Ritardiamo la navigazione reale per permettere la transizione fluida di 1.5s
        setTimeout(() => {
            router.push(targetRoute)
        }, 1500)
    }

    return (
        <group>
            <primitive
                object={scene}
                ref={eyeRef}
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
                scale={baseScale}
                position={[0, 0, 0]}
            />

            {/* Testo circolare SOLO nella Hero Section */}
            {showCircularText && (
                <Html center zIndexRange={[10, 0]} className="pointer-events-none neo-skip-branding" data-neo-skip="true">
                    <div className="w-[90vmin] h-[90vmin] md:w-[80vmin] md:h-[80vmin] max-w-[550px] max-h-[550px] animate-[spin_20s_linear_infinite] flex items-center justify-center neo-skip-branding" data-neo-skip="true">

                        <CircularText isMobile={false} />
                        <CircularText isMobile={true} />

                    </div>
                </Html>
            )}
        </group>
    )
}

// Component per il testo circolare dinamico: mantiene le singole chunk e ripete la coppia
function CircularText({ isMobile }: { isMobile: boolean }) {
    const outerRef = useRef<HTMLDivElement | null>(null)
    const [content, setContent] = useState('')
    const [startOffsetPx, setStartOffsetPx] = useState<number>(0)
    const chunks = ['nessuna paura...', 'nessuna censura...']

    useLayoutEffect(() => {
        const el = outerRef.current
        if (!el) return

        const svgWidth = el.clientWidth || el.getBoundingClientRect().width || 200
        const radius = 94
        const circumference = 2 * Math.PI * radius
        const pathLengthPx = circumference * (svgWidth / 200)
        const fontSize = isMobile ? 10 : 9

        // Misuriamo approssimativamente la larghezza del chunk usando canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const computedFont = getComputedStyle(document.documentElement).getPropertyValue('--font-neo') || 'sans-serif'
        if (ctx) ctx.font = `${fontSize}px ${computedFont}`
        const chunkText = `${chunks[0]} ${chunks[1]}`
        const chunkWidth = Math.max(1, ctx ? ctx.measureText(chunkText).width : chunkText.length * fontSize * 0.5)

        const repeats = Math.max(2, Math.ceil(pathLengthPx / chunkWidth) + 1)
        const repeated = new Array(repeats).fill(chunkText + '\u00A0\u00A0').join(' ')
        setContent(repeated)

        const totalTextWidth = chunkWidth * repeats
        const leftover = Math.max(0, totalTextWidth - pathLengthPx)
        const offsetPx = Math.round(leftover / 2)
        setStartOffsetPx(offsetPx)
    }, [isMobile])

    return (
        <div ref={outerRef} className={`w-full h-full ${isMobile ? 'block md:hidden' : 'hidden md:block'}`}>
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <path id={isMobile ? 'mobileCurve' : 'desktopCurve'} d="M 100, 100 m -94, 0 a 94,94 0 1,1 188,0 a 94,94 0 1,1 -188,0" fill="transparent" />
                <text className="font-neo text-[#809829] fill-current uppercase" style={{ fontSize: isMobile ? '10px' : '9px' }}>
                    <textPath href={`#${isMobile ? 'mobileCurve' : 'desktopCurve'}`} startOffset={`${startOffsetPx}px`}>
                        {content || `${chunks[0]} ${chunks[1]} ${chunks[0]}`}
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
    className = "",
    onReady,
    isUnlocked = false
    , scaleMultiplier = 1
}: EyeSceneProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const globalMouse = useRef({ x: 0, y: 0 })

    // Tracking globale del mouse calcolato rispetto al centro di QUESTO contenitore
    useEffect(() => {
        if (!globalTracking) return
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            // Normalizza la distanza del cursore dal centro dell'occhio
            globalMouse.current.x = (e.clientX - centerX) / (window.innerWidth / 2)
            globalMouse.current.y = -(e.clientY - centerY) / (window.innerHeight / 2)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [globalTracking])

    return (
        <div ref={containerRef} className={`w-full h-full absolute inset-0 z-10 ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 4.6], fov: 45 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: false
                }}
            >
                <ambientLight intensity={0.1} />
                <directionalLight position={[5, 10, 5]} intensity={0.1} />

                {/* Luce Verde Acida da Sud - Potenziata */}
                <pointLight position={[0, -5, 2]} intensity={120} color="#768b1a" distance={20} decay={2} />

                <Suspense fallback={
                    <Html center>
                        <div className="w-4 h-4 rounded-full bg-[#768b1a] blur-md animate-pulse" />
                    </Html>
                }>
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
