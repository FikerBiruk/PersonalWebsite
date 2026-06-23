'use client'

import React, { useRef, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Float,
  MeshDistortMaterial,
  Environment,
  ContactShadows
} from '@react-three/drei'

function ElegantBlob() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Slow rotation
    meshRef.current.rotation.x = t * 0.1
    meshRef.current.rotation.y = t * 0.15

    // Slight movement
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.2
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#3b82f6"
          speed={2}
          distort={0.4}
          radius={1}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
    </Float>
  )
}

export default function Scene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={1} />

        <Suspense fallback={null}>
          <ElegantBlob />
          <Environment preset="city" />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
        </Suspense>
      </Canvas>
    </div>
  )
}
