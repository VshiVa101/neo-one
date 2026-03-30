'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface EyeGlobeProps {
  onClick?: () => void
  isHovered?: boolean
  mousePosition: { x: number; y: number }
}

function EyeGlobe({ onClick, isHovered, mousePosition }: EyeGlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const texture = useTexture('/neo-assets/hero/eye-3d/neo-eye-texture.png')

  // Make texture repeat properly and look good
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.colorSpace = THREE.SRGBColorSpace

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.3,
      metalness: 0.1,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    })
  }, [texture])

  // Smooth eye tracking
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const targetX = mousePosition.x * 0.3
    const targetY = -mousePosition.y * 0.3

    // Smooth interpolation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetX,
      delta * 3,
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetY,
      delta * 3,
    )

    // Hover effect - subtle pulse
    if (isHovered && meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02
      meshRef.current.scale.setScalar(scale)
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 5)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main eye sphere */}
      <mesh ref={meshRef} material={material} onClick={onClick} onPointerDown={onClick}>
        <sphereGeometry args={[1.5, 64, 64]} />
      </mesh>

      {/* Inner glow */}
      <mesh scale={[1.52, 1.52, 1.52]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#A3FF12" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

function Scene({ onClick, isHovered, mousePosition }: EyeGlobeProps) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.z = 5
  }, [camera])

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.8} />

      {/* Main light from top-left (simulating the highlight on the eye) */}
      <directionalLight position={[-3, 3, 4]} intensity={1.5} color="#ffffff" />

      {/* Rim light for depth */}
      <pointLight position={[3, -2, 2]} intensity={0.5} color="#A3FF12" />

      {/* Eye globe */}
      <EyeGlobe onClick={onClick} isHovered={isHovered} mousePosition={mousePosition} />
    </>
  )
}

interface ThreeEyeProps {
  onClick?: () => void
  className?: string
}

export const ThreeEye: React.FC<ThreeEyeProps> = ({ onClick, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Normalize -1 to 1
      const x = (e.clientX - centerX) / (rect.width / 2)
      const y = (e.clientY - centerY) / (rect.height / 2)

      setMousePosition({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Scene onClick={onClick} isHovered={isHovered} mousePosition={mousePosition} />
      </Canvas>
    </div>
  )
}

export default ThreeEye
