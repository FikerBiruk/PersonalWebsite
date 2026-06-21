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

// Use a local font path or a more reliable CDN if possible.
// For now, keeping the CDN but wrapping in Suspense to prevent crashes.
const FONT_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json'

function ParticleName() {
  const scroll = useScroll()
  const pointsRef = useRef<THREE.Points>(null!)
  const [textPositions, setTextPositions] = useState<Float32Array | null>(null)

  const count = 4000 // Total number of particles

  // 1. Generate Random Initial Positions
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  // 2. Generate Scattered Final Positions
  const finalPositions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return pos
  }, [])

  // This helper component extracts geometry data from Text3D
  const GeometryExtractor = () => {
    const meshRef = useRef<THREE.Mesh>(null!)

    useEffect(() => {
      if (meshRef.current && meshRef.current.geometry) {
        const geometry = meshRef.current.geometry
        geometry.center()

        const posAttr = geometry.getAttribute('position')
        const samples = new Float32Array(count * 3)

        if (posAttr) {
          for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * posAttr.count)
            samples[i * 3] = posAttr.getX(index)
            samples[i * 3 + 1] = posAttr.getY(index)
            samples[i * 3 + 2] = posAttr.getZ(index)
          }
          setTextPositions(samples)
        }
      }
    }, [])

    return (
      <mesh ref={meshRef} visible={false}>
        <Text3D font={FONT_URL} size={2} height={0.5}>
          FIKER
        </Text3D>
      </mesh>
    )
  }

  useFrame((state) => {
    if (!textPositions || !pointsRef.current) return

    const offset = scroll.offset
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      let targetX, targetY, targetZ

      if (offset < 0.4) {
        const t = offset / 0.4
        targetX = THREE.MathUtils.lerp(initialPositions[i3], textPositions[i3], t)
        targetY = THREE.MathUtils.lerp(initialPositions[i3 + 1], textPositions[i3 + 1], t)
        targetZ = THREE.MathUtils.lerp(initialPositions[i3 + 2], textPositions[i3 + 2], t)
      } else if (offset < 0.6) {
        targetX = textPositions[i3]
        targetY = textPositions[i3 + 1]
        targetZ = textPositions[i3 + 2]
      } else {
        const t = (offset - 0.6) / 0.4
        targetX = THREE.MathUtils.lerp(textPositions[i3], finalPositions[i3], t)
        targetY = THREE.MathUtils.lerp(textPositions[i3 + 1], finalPositions[i3 + 1], t)
        targetZ = THREE.MathUtils.lerp(textPositions[i3 + 2], finalPositions[i3 + 2], t)
      }

      positions[i3] = THREE.MathUtils.lerp(positions[i3], targetX, 0.1)
      positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetY, 0.1)
      positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], targetZ, 0.1)
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1 + offset * Math.PI
  })

  return (
    <>
      <Suspense fallback={null}>
        <GeometryExtractor />
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
  const scroll = useScroll()
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)

  useFrame(() => {
    const offset = scroll.offset
    if (cameraRef.current) {
      cameraRef.current.position.z = 8 + Math.sin(offset * Math.PI) * 2
      cameraRef.current.lookAt(0, 0, 0)
    }
  })

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 8]} />
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <ParticleName />

      <Scroll html>
        <div className="w-screen text-white font-sans pointer-events-none">
          <section className="h-screen flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto pointer-events-auto">
            <div className="max-w-3xl">
              <h2 className="text-blue-500 font-mono tracking-widest mb-4 uppercase text-sm">Scroll to assemble</h2>
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none mb-8">
                I AM <br /> FIKER.
              </h1>
              <p className="text-xl md:text-2xl text-neutral-400 max-w-xl leading-relaxed">
                A student engineer building the future of robotics and computer vision.
              </p>
            </div>
          </section>

          <section className="h-screen flex items-center justify-center px-6 pointer-events-auto">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Molding Data</h2>
              <p className="text-neutral-400 text-lg md:text-xl">Transforming raw particles into meaningful structures.</p>
            </div>
          </section>

          <section className="h-screen flex flex-col justify-center items-center px-6 text-center pointer-events-auto">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">Let's work together.</h2>
            <div className="flex gap-8 text-neutral-400 text-lg">
              <a href="https://github.com/FikerBiruk" className="hover:text-blue-500 transition-colors">GitHub</a>
              <a href="#" className="hover:text-blue-500 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a>
            </div>
          </section>
        </div>
      </Scroll>
    </>
  )
}

export default function Scene() {
  return (
    <div className="h-screen w-full bg-[#050505]">
      <Canvas shadows>
        <ScrollControls pages={3} damping={0.1}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
