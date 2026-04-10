'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useTexture, Decal } from '@react-three/drei'
import * as THREE from 'three'
import { useTransition } from '@/context/TransitionContext'
import { useRouter } from 'next/navigation'

interface EyeModelProps {
    targetRoute?: string
    showCircularText?: boolean
    globalTracking?: boolean
    externalMouse?: React.RefObject<{ x: number, y: number }>
}

const EyeModel = ({ 
    targetRoute = '/home', 
    showCircularText = false, 
    globalTracking = false,
    externalMouse 
}: EyeModelProps) => {
    const eyeRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)
    const { triggerTransition } = useTransition()
    const router = useRouter()

    const [pupilTexture, scleraTexture] = useTexture([
        '/occhio/pupa_pupilla.webp',
        '/occhio/nervo_nervoso.webp'
    ])
    pupilTexture.colorSpace = THREE.SRGBColorSpace
    scleraTexture.colorSpace = THREE.SRGBColorSpace



    useFrame((state) => {
        if (!eyeRef.current) return

        // Usa le coordinate esterne (gestite dal padre) se globalTracking è attivo
        const pointerX = (globalTracking && externalMouse?.current) ? externalMouse.current.x : state.pointer.x
        const pointerY = (globalTracking && externalMouse?.current) ? externalMouse.current.y : state.pointer.y

        const targetX = (pointerX * Math.PI) / 4
        const targetY = (pointerY * Math.PI) / 4

        eyeRef.current.rotation.y = THREE.MathUtils.lerp(eyeRef.current.rotation.y, targetX, 0.1)
        eyeRef.current.rotation.x = THREE.MathUtils.lerp(eyeRef.current.rotation.x, -targetY, 0.1)
        
        // Effetto "viene avanti" al hover
        const targetScale = hovered ? 1.15 : 1.0
        eyeRef.current.scale.setScalar(THREE.MathUtils.lerp(eyeRef.current.scale.x, targetScale, 0.1))
    })

    const handleClick = () => {
        if (hovered) setHovered(false)
        triggerTransition()
        router.push(targetRoute)
    }

    return (
        <group>
            <mesh
                ref={eyeRef}
                onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
                onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
                onClick={handleClick}
            >
                <sphereGeometry args={[0.75, 64, 64]} />
                <meshStandardMaterial color="#e8e0d8" roughness={0.15} metalness={0.05} />
                {/* Layer 1: Retina / Sclera — large Decal projection (no sphere UV stretching) */}
                <Decal
                    position={[0, 0, 0.75]}
                    rotation={[0, 0, 0]}
                    scale={1.7}
                >
                    <meshStandardMaterial
                        map={scleraTexture}
                        transparent={false}
                        blending={THREE.MultiplyBlending}
                        depthTest={true}
                        depthWrite={false}
                        polygonOffset={true}
                        polygonOffsetFactor={-0.5}
                        toneMapped={false}
                    />
                </Decal>
                {/* Layer 2: Pupilla — sits on top, inside the retina hole */}
                <Decal 
                    position={[0, 0, 0.75]} 
                    rotation={[0, 0, 0]} 
                    scale={1.5}
                >
                    <meshStandardMaterial
                        map={pupilTexture}
                        transparent={true}
                        depthTest={true}
                        depthWrite={false}
                        polygonOffset={true}
                        polygonOffsetFactor={-1}
                    />
                </Decal>
            </mesh>
            
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
}

export const EyeScene = ({ targetRoute = '/home', showCircularText = false, globalTracking = false, className = "" }: EyeSceneProps) => {
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
            <Canvas camera={{ position: [0, 0, 4.6], fov: 45 }}>
                <ambientLight intensity={1} />
                <directionalLight position={[5, 10, 5]} intensity={2.5} />
                
                <EyeModel 
                    targetRoute={targetRoute} 
                    showCircularText={showCircularText} 
                    globalTracking={globalTracking} 
                    externalMouse={globalMouse} 
                />
            </Canvas>
        </div>
    )
}
