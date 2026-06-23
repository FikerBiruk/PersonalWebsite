'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei'

function Blob() {
  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={1}>
      <Sphere args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#3b82f6"
          speed={3}
          distort={0.3}
          radius={1}
        />
      </Sphere>
    </Float>
  )
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Blob />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
