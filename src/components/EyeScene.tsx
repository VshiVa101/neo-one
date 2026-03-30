'use client'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, useTexture, Decal } from '@react-three/drei'
import * as THREE from 'three'
import { useTransition } from '@/context/TransitionContext'
import { useRouter } from 'next/navigation'

const EyeModel = () => {
    const eyeRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)
    const { triggerTransition } = useTransition()
    const router = useRouter()

    // Carichiamo la texture della pupilla
    const pupilTexture = useTexture('/images/drops/new-neo-eye.png')
    pupilTexture.colorSpace = THREE.SRGBColorSpace

    useFrame((state) => {
        if (!eyeRef.current) return

        // Calcola la rotazione target in base alla posizione del mouse:
        // Il cursore va da -1 a 1 su x e y
        const targetX = (state.pointer.x * Math.PI) / 4
        const targetY = (state.pointer.y * Math.PI) / 4

        // Lerp fluido verso la rotazione
        eyeRef.current.rotation.y = THREE.MathUtils.lerp(eyeRef.current.rotation.y, targetX, 0.1)
        eyeRef.current.rotation.x = THREE.MathUtils.lerp(eyeRef.current.rotation.x, -targetY, 0.1)
        
        // Applica un leggero respiro (scale) quando in hover
        const targetScale = hovered ? 1.1 : 1.0
        eyeRef.current.scale.setScalar(THREE.MathUtils.lerp(eyeRef.current.scale.x, targetScale, 0.1))
    })

    const handleClick = () => {
        // Disattiva interazioni multiple
        if (hovered) setHovered(false)
        
        // Avvia l'animazione di transizione
        triggerTransition()

        // Naviga subito verso la home: la transizione GSAP coprirà lo stacco visivo
        router.push('/home')
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
                <meshStandardMaterial color="white" roughness={0.1} metalness={0.1} />
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
            
            {/* Testo di avviso rotante in SVG per seguire il perimetro */}
            <Html center zIndexRange={[10, 0]} className="pointer-events-none">
                <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] animate-[spin_15s_linear_infinite] flex items-center justify-center">
                    
                    {/* Testo Desktop */}
                    <svg viewBox="0 0 200 200" className="w-full h-full hidden md:block">
                        <path id="desktopCurve" d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" fill="transparent" />
                        <text className="font-neo text-[#768b1a] fill-current uppercase tracking-wider" style={{ fontSize: '11px', letterSpacing: '2px' }}>
                            <textPath href="#desktopCurve" startOffset="0" textLength="500">
                                QUI dio non vede e tua madre NON c'è     entra ma sono cazzi tuoi    
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
        </group>
    )
}


export const EyeScene = () => {
    return (
        <div className="w-full h-screen fixed inset-0 z-10">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={1} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                
                <EyeModel />
            </Canvas>
        </div>
    )
}
