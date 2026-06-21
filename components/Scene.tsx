'use client'

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  useScroll,
  PerspectiveCamera,
  Stars,
  Text3D
} from '@react-three/drei'
import * as THREE from 'three'

const FONT_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json'

function ParticleName() {
  const scroll = useScroll()
  const pointsRef = useRef<THREE.Points>(null!)

  // The state that holds the "target" coordinates for each particle to form the name
  const [targetPositions, setTargetPositions] = useState<Float32Array | null>(null)

  const count = 10000 // High particle count for a thick "3D" look

  // 1. Initial random cloud positions
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return pos
  }, [])

  // 2. Final "explosion" positions
  const explodePositions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const dist = 30 + Math.random() * 20
      pos[i * 3] = dist * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = dist * Math.cos(phi)
    }
    return pos
  }, [])

  // Component to extract vertices from the Text3D mesh
  const TextGeometrySampler = () => {
    const meshRef = useRef<THREE.Mesh>(null!)

    useEffect(() => {
      if (meshRef.current && meshRef.current.geometry) {
        const geo = meshRef.current.geometry
        geo.center()
        const posAttr = geo.getAttribute('position')
        const samples = new Float32Array(count * 3)

        // Sample random points from the text's surface to fill it out
        for (let i = 0; i < count; i++) {
          const index = Math.floor(Math.random() * posAttr.count)
          // Add some jitter/noise so it looks like a 3D volume, not just flat vertices
          samples[i * 3] = posAttr.getX(index) + (Math.random() - 0.5) * 0.1
          samples[i * 3 + 1] = posAttr.getY(index) + (Math.random() - 0.5) * 0.1
          samples[i * 3 + 2] = posAttr.getZ(index) + (Math.random() - 0.5) * 0.5
        }
        setTargetPositions(samples)
      }
    }, [])

    return (
      <mesh ref={meshRef} visible={false}>
        <Text3D font={FONT_URL} size={2.5} height={0.8} curveSegments={12}>
          FIKER
        </Text3D>
      </mesh>
    )
  }

  useFrame((state) => {
    if (!targetPositions || !pointsRef.current) return

    const offset = scroll.offset // 0 to 1
    const posAttr = pointsRef.current.geometry.attributes.position
    const positions = posAttr.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      let tx, ty, tz

      // Phase 1: 0 to 0.5 -> Random Cloud to Name
      if (offset < 0.5) {
        const t = offset / 0.5
        tx = THREE.MathUtils.lerp(initialPositions[i3], targetPositions[i3], t)
        ty = THREE.MathUtils.lerp(initialPositions[i3+1], targetPositions[i3+1], t)
        tz = THREE.MathUtils.lerp(initialPositions[i3+2], targetPositions[i3+2], t)
      }
      // Phase 2: 0.5 to 1.0 -> Name to Explosion
      else {
        const t = (offset - 0.5) / 0.5
        tx = THREE.MathUtils.lerp(targetPositions[i3], explodePositions[i3], t)
        ty = THREE.MathUtils.lerp(targetPositions[i3+1], explodePositions[i3+1], t)
        tz = THREE.MathUtils.lerp(targetPositions[i3+2], explodePositions[i3+2], t)
      }

      // Apply with smoothing to prevent jitter
      positions[i3] += (tx - positions[i3]) * 0.1
      positions[i3+1] += (ty - positions[i3+1]) * 0.1
      positions[i3+2] += (tz - positions[i3+2]) * 0.1
    }

    posAttr.needsUpdate = true

    // Slow rotation to give depth
    pointsRef.current.rotation.y = offset * Math.PI * 0.5
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  return (
    <>
      <Suspense fallback={null}>
        <TextGeometrySampler />
      </Suspense>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={initialPositions.slice()}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#3b82f6"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

function SceneContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <ParticleName />

      <Scroll html>
        <div className="w-screen pointer-events-none">
          {/* Section 1: Empty to show particles assembling */}
          <section className="h-screen flex items-center justify-center">
            <h2 className="text-white/20 text-sm font-mono animate-pulse uppercase tracking-[0.5em]">Scroll to Begin</h2>
          </section>

          {/* Section 2: The Name Is Assembled Here */}
          <section className="h-screen flex items-center justify-center">
            <div className="text-center">
               {/* Minimalist text so it doesn't cover the particle name */}
               <p className="text-blue-500 font-mono tracking-widest uppercase">Robotics & Vision</p>
            </div>
          </section>

          {/* Section 3: Dissolving */}
          <section className="h-screen flex flex-col justify-center items-center">
             <h2 className="text-white text-5xl font-bold tracking-tighter">Beyond the Code</h2>
          </section>
        </div>
      </Scroll>
    </>
  )
}

export default function Scene() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas>
        <ScrollControls pages={3} damping={0.2}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
