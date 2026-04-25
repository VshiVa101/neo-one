'use client'

import React, { useRef, useState, useEffect, Suspense } from 'react'
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
    const [isIgnoringPointer, setIsIgnoringPointer] = useState(false)

    // Touch logic state per MOBILE
    const longPressActive = useRef(false)
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const activeTouchPoint = useRef<{x: number, y: number} | null>(null)
    const lastTouchClickTime = useRef<number>(-999)

    const { scene } = useGLTF(GLB_URL, DRACO_URL)
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

    // Event listener globale per intercettare i tap ovunque sullo schermo in modalità MOBILE
    useEffect(() => {
        if (globalTracking) return
        const handleTouch = (e: TouchEvent) => {
            const touch = e.touches[0]
            if (touch) {
                const nx = (touch.clientX / window.innerWidth) * 2 - 1
                const ny = -(touch.clientY / window.innerHeight) * 2 + 1
                activeTouchPoint.current = { x: nx, y: ny }
                // Registra il tocco solo se non stiamo già facendo un long-press fisso sull'occhio
                if (!longPressActive.current) {
                    lastTouchClickTime.current = performance.now() / 1000
                }
            }
        }
        window.addEventListener('touchstart', handleTouch)
        window.addEventListener('touchmove', handleTouch)
        return () => {
            window.removeEventListener('touchstart', handleTouch)
            window.removeEventListener('touchmove', handleTouch)
        }
    }, [globalTracking])

    const baseScale = Math.min(viewport.width, viewport.height) * 0.10 * (scaleMultiplier || 1)

    useEffect(() => {
        if (scene && onReady) {
            const timer = setTimeout(onReady, 100)
            return () => clearTimeout(timer)
        }
    }, [scene, onReady])

    useFrame((state) => {
        if (!eyeRef.current) return

        const time = state.clock.getElapsedTime()
        const isDesktop = globalTracking

        // --- 1. TIMING E ANIMAZIONI PERIODICHE (SIA MOBILE CHE DESKTOP) ---
        // Twitch orizzontale ogni 5 secondi
        const jumpInterval = 5
        const jumpDuration = 0.15
        const isVibrating = (time % jumpInterval) < jumpDuration
        let vibrationX = 0
        if (isVibrating) {
            const frequency = 100
            const amplitude = 0.15
            vibrationX = Math.sin(time * frequency) * amplitude
        }

        // Rivoluzione completa (ribaltamento asse verticale/X) ogni 9 secondi
        const flipInterval = 9
        const flipDuration = 1.2
        const flipTime = time % flipInterval
        const isFlipping = flipTime < flipDuration
        let flipX = 0
        if (isFlipping) {
            const progress = flipTime / flipDuration
            const smoothProgress = (1 - Math.cos(progress * Math.PI)) / 2
            flipX = smoothProgress * Math.PI * 2
        }

        // Vortice (roll/rotazione su asse Z pupilla) ogni 13 secondi
        const vortexInterval = 13
        const vortexDuration = 1.5
        const vortexTime = time % vortexInterval
        const isVortexing = vortexTime < vortexDuration
        let vortexZ = 0
        if (isVortexing) {
            const progress = vortexTime / vortexDuration
            const smoothProgress = (1 - Math.cos(progress * Math.PI)) / 2
            vortexZ = smoothProgress * Math.PI * 2
        }

        // --- 2. GESTIONE LOOK-AT ---
        const rotationOffset = -Math.PI / 2
        let targetX = rotationOffset
        let targetY = 0

        if (isDesktop) {
            // DESKTOP: Puntatore sempre preciso, zero float
            const pointerX = externalMouse?.current ? externalMouse.current.x : state.pointer.x
            const pointerY = externalMouse?.current ? externalMouse.current.y : state.pointer.y
            targetX = (pointerX * Math.PI / 4) + rotationOffset
            targetY = (pointerY * Math.PI / 4)
        } else {
            // MOBILE: Float di base, punta al touch immediatamente per 1.5s o se tenuto premuto
            const idleX = Math.sin(time * 0.35 * 2) * 1.2
            const idleY = Math.sin(time * 0.45 * 2) * 0.5
            
            const currPerfTime = performance.now() / 1000
            const timeSinceTouch = currPerfTime - lastTouchClickTime.current

            if (longPressActive.current && activeTouchPoint.current) {
                // Fissa il punto finchè premuto
                targetX = (activeTouchPoint.current.x * Math.PI / 2) + rotationOffset
                targetY = (activeTouchPoint.current.y * Math.PI / 2)
            } else if (timeSinceTouch < 1.5 && activeTouchPoint.current) {
                // Punta immediatamente il tocco per 1.5s
                targetX = (activeTouchPoint.current.x * Math.PI / 2) + rotationOffset
                targetY = (activeTouchPoint.current.y * Math.PI / 2)
            } else {
                // Float leggero e casuale
                targetX = rotationOffset + idleX
                targetY = idleY
            }
        }

        if (isIgnoringPointer) {
            targetX = rotationOffset
            targetY = 0
        }

        // --- 3. APPLICAZIONE ROTAZIONE UNIFICATA ---
        // Usiamo YXZ per permettere il corretto roll (Vortex) sull'asse della pupilla
        eyeRef.current.rotation.order = 'YXZ'

        // Calcoliamo la rotazione base (look-at + vibration) mantenendola fluida con il lerp
        if (eyeRef.current.userData.baseRotY === undefined) eyeRef.current.userData.baseRotY = eyeRef.current.rotation.y
        if (eyeRef.current.userData.baseRotX === undefined) eyeRef.current.userData.baseRotX = eyeRef.current.rotation.x

        eyeRef.current.userData.baseRotY = THREE.MathUtils.lerp(eyeRef.current.userData.baseRotY, targetX + vibrationX, 0.1)
        eyeRef.current.userData.baseRotX = THREE.MathUtils.lerp(eyeRef.current.userData.baseRotX, -targetY, 0.1)

        // Applichiamo le rotazioni animative (flipX e vortexZ) DIRETTAMENTE alla rotazione base
        // Non usiamo il lerp per queste perché smoothProgress è già un'animazione fluida 0 -> 2PI.
        eyeRef.current.rotation.y = eyeRef.current.userData.baseRotY
        eyeRef.current.rotation.x = eyeRef.current.userData.baseRotX - flipX
        eyeRef.current.rotation.z = vortexZ

        const isComingForward = hovered || longPressActive.current
        const currentTargetLocal = isComingForward ? baseScale * 4.2 : baseScale
        eyeRef.current.scale.setScalar(THREE.MathUtils.lerp(eyeRef.current.scale.x, currentTargetLocal, 0.15))
    })

    const handleClick = () => {
        if (!isUnlocked) return
        if (hovered) setHovered(false)
        setIsIgnoringPointer(true)
        triggerTransition()
        setTimeout(() => {
            router.push(targetRoute)
        }, 1500)
    }

    const handlePointerDown = (e: any) => {
        if (globalTracking) return // Su desktop usa l'hover normale
        try { e?.stopPropagation?.() } catch {}
        try { e?.target?.setPointerCapture?.(e.pointerId) } catch {}
        
        if (longPressTimer.current) clearTimeout(longPressTimer.current)
        longPressTimer.current = setTimeout(() => {
            longPressActive.current = true
            if (dashAudio.current) {
                dashAudio.current.currentTime = 0
                dashAudio.current.play().catch(() => {})
            }
        }, 300) // Dopo 300ms considera long-press
    }

    const handlePointerUp = (e: any) => {
        if (globalTracking) return
        try { e?.target?.releasePointerCapture?.(e.pointerId) } catch {}
        if (longPressTimer.current) clearTimeout(longPressTimer.current)
        
        if (longPressActive.current) {
            longPressActive.current = false
            if (returnAudio.current) {
                returnAudio.current.currentTime = 0
                returnAudio.current.play().catch(() => {})
            }
        }
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
                        dashAudio.current.play().catch(() => { })
                    }
                }}
                onPointerOut={() => {
                    setHovered(false)
                    document.body.style.cursor = 'auto'
                    if (returnAudio.current) {
                        dashAudio.current?.pause()
                        returnAudio.current.currentTime = 0
                        returnAudio.current.play().catch(() => { })
                    }
                }}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
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

// Component per il testo circolare dinamico.
// Strategia: budget fisso di caratteri + SVG textLength per adattamento perfetto.
// Zero misurazione canvas = zero bug di overflow su qualsiasi viewport.
function CircularText({ isMobile }: { isMobile: boolean }) {
    const [content, setContent] = useState('')

    const words = [
        "nessuna paura!...",
        "nessuna censura!...",
        "toccami!...",
        "no!...",
        "occhio?...",
        "paura?...",
        "sicuro?...",
        "tua mamma non vuole!..."
    ];

    // Circonferenza SVG fissa: 2 * PI * 94 ≈ 590.6 unità SVG
    // Questa è una costante geometrica, indipendente dal viewport.
    const pathLength = 2 * Math.PI * 94

    useEffect(() => {
        // Budget di caratteri conservativo.
        // Il font uppercase Neo a 9px ha ~5.5-7 unità SVG per carattere.
        // Usando ~6.5 come media: 590/6.5 ≈ 90 chars.
        // textLength SVG compenserà qualsiasi micro-differenza regolando la spaziatura.
        const charBudget = isMobile ? 80 : 90

        let text = ""
        let lastWord = ""

        // Riempi con token casuali senza ripetizioni immediate
        while (true) {
            const availableWords = words.filter(w => w !== lastWord)
            const candidate = availableWords[Math.floor(Math.random() * availableWords.length)]
            const spaced = candidate + " "

            // Se il prossimo token supererebbe il budget, prova con uno più corto
            if (text.length + spaced.length > charBudget) {
                const sorted = [...availableWords].sort((a, b) => a.length - b.length)
                let fitted = false
                for (const word of sorted) {
                    // +1 per lo spazio, deve restare entro il budget
                    if (text.length + word.length + 1 <= charBudget) {
                        text += word + " "
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
            text += "."
        }

        setContent(text)
    }, [isMobile])

    const curveId = isMobile ? 'mobileCurve' : 'desktopCurve'

    return (
        <div className={`w-full h-full ${isMobile ? 'block md:hidden' : 'hidden md:block'}`}>
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <path id={curveId} d="M 100, 100 m -94, 0 a 94,94 0 1,1 188,0 a 94,94 0 1,1 -188,0" fill="transparent" />
                <text className="font-neo text-[#809829] fill-current uppercase" style={{ fontSize: isMobile ? '10px' : '9px' }}>
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
