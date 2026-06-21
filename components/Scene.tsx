'use client'

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  useScroll,
  PerspectiveCamera,
  Stars,
} from '@react-three/drei'
import { FontLoader, TextGeometry } from 'three-stdlib'

const FONT_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json'

function ParticleName() {
  const scroll = useScroll()
  const pointsRef = useRef<THREE.Points>(null!)

  // 1. Load the font using R3F's useLoader (handles Suspense automatically)
  const font = useLoader(FontLoader, FONT_URL)

  const count = 8000 // Balanced for performance and density

  // 2. Generate all the different position sets
  const positions = useMemo(() => {
    // A. Initial random cloud
    const initial = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      initial[i * 3] = (Math.random() - 0.5) * 50
      initial[i * 3 + 1] = (Math.random() - 0.5) * 50
      initial[i * 3 + 2] = (Math.random() - 0.5) * 50
    }

    // B. Target Name "FIKER"
    const textGeo = new TextGeometry('FIKER', {
      font: font,
      size: 2.5,
      height: 0.6,
      curveSegments: 8,
      bevelEnabled: false
    })
    textGeo.center()
    const posAttr = textGeo.getAttribute('position')
    const target = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * posAttr.count)
      // We sample points from the text geometry and add a bit of volume
      target[i * 3] = posAttr.getX(index) + (Math.random() - 0.5) * 0.15
      target[i * 3 + 1] = posAttr.getY(index) + (Math.random() - 0.5) * 0.15
      target[i * 3 + 2] = posAttr.getZ(index) + (Math.random() - 0.5) * 0.4
    }

    // C. Final explosion (Sphere)
    const explode = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const dist = 40 + Math.random() * 10
      explode[i * 3] = dist * Math.sin(phi) * Math.cos(theta)
      explode[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta)
      explode[i * 3 + 2] = dist * Math.cos(phi)
    }

    return { initial, target, explode }
  }, [font])

  useFrame((state) => {
    if (!pointsRef.current) return

    const offset = scroll.offset
    const currentPositions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      let tx, ty, tz

      // Phase 1: 0 to 0.5 -> Assemble
      if (offset < 0.5) {
        const t = offset / 0.5
        tx = THREE.MathUtils.lerp(positions.initial[i3], positions.target[i3], t)
        ty = THREE.MathUtils.lerp(positions.initial[i3+1], positions.target[i3+1], t)
        tz = THREE.MathUtils.lerp(positions.initial[i3+2], positions.target[i3+2], t)
      }
      // Phase 2: 0.5 to 1.0 -> Dissolve
      else {
        const t = (offset - 0.5) / 0.5
        tx = THREE.MathUtils.lerp(positions.target[i3], positions.explode[i3], t)
        ty = THREE.MathUtils.lerp(positions.target[i3+1], positions.explode[i3+1], t)
        tz = THREE.MathUtils.lerp(positions.target[i3+2], positions.explode[i3+2], t)
      }

      // Physics-like smoothing
      currentPositions[i3] += (tx - currentPositions[i3]) * 0.12
      currentPositions[i3+1] += (ty - currentPositions[i3+1]) * 0.12
      currentPositions[i3+2] += (tz - currentPositions[i3+2]) * 0.12
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Rotate the whole name based on scroll
    pointsRef.current.rotation.y = offset * Math.PI * 0.4
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.initial.slice()}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#3b82f6"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function SceneContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} />
      <ambientLight intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Suspense fallback={null}>
        <ParticleName />
      </Suspense>

      <Scroll html>
        <div className="w-screen pointer-events-none text-white font-sans">
          <section className="h-screen flex items-center justify-center">
            <h2 className="text-white/30 text-xs font-mono tracking-[0.8em] uppercase animate-pulse">
              Scroll to Assemble
            </h2>
          </section>

          <section className="h-screen flex items-center justify-center">
            <div className="text-center bg-black/40 backdrop-blur-sm p-4 rounded-lg">
               <p className="text-blue-500 font-mono tracking-widest uppercase text-sm">Robotics & Vision Engineer</p>
            </div>
          </section>

          <section className="h-screen flex flex-col justify-center items-center">
             <h2 className="text-white text-4xl font-bold tracking-tighter opacity-80">Beyond the Code</h2>
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
