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
    onReady
}: EyeModelProps) => {
    const eyeRef = useRef<THREE.Group>(null)
    const [hovered, setHovered] = useState(false)
    const { triggerTransition } = useTransition()
    const router = useRouter()

    const { scene } = useGLTF(GLB_URL, DRACO_URL)

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
        const targetX = (pointerX * Math.PI) / 4 + rotationOffset
        const targetY = (pointerY * Math.PI) / 4

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
        
        const targetScale = hovered ? 0.80 : 0.65
        eyeRef.current.scale.setScalar(THREE.MathUtils.lerp(eyeRef.current.scale.x, targetScale, 0.1))
    })

    const handleClick = () => {
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
                onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
                onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
                onClick={handleClick}
                scale={0.65} 
                position={[0, 0, 0]}
            />
            
            {/* Testo circolare SOLO nella Hero Section */}
            {showCircularText && (
                <Html center zIndexRange={[10, 0]} className="pointer-events-none">
                    <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] animate-[spin_15s_linear_infinite] flex items-center justify-center">
                        
                        {/* Testo Desktop */}
                        <svg viewBox="0 0 200 200" className="w-full h-full hidden md:block">
                            <path id="desktopCurve" d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" fill="transparent" />
                            <text className="font-neo text-[#768b1a] fill-current uppercase tracking-wider" style={{ fontSize: '11px', letterSpacing: '2px' }}>
                                <textPath href="#desktopCurve" startOffset="0" textLength="500">
                                    QUI dio non vede e tua madre NON c&apos;è     entra ma sono cazzi tuoi    
                                </textPath>
                            </text>
                        </svg>

                        {/* Testo Mobile */}
                        <svg viewBox="0 0 200 200" className="w-full h-full block md:hidden">
                            <path id="mobileCurve" d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" fill="transparent" />
                            <text className="font-neo text-[#768b1a] fill-current uppercase tracking-widest text-center" style={{ fontSize: '16px' }}>
                                <textPath href="#mobileCurve" startOffset="50%" textAnchor="middle">
                                    Tua mamma non vuole OCCHIO!
                                </textPath>
                            </text>
                        </svg>

                    </div>
                </Html>
            )}
        </group>
    )
}

interface EyeSceneProps {
    targetRoute?: string
    showCircularText?: boolean
    globalTracking?: boolean
    className?: string
    onReady?: () => void
}

export const EyeScene = ({ 
    targetRoute = '/home', 
    showCircularText = false, 
    globalTracking = false, 
    className = "",
    onReady 
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
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}
