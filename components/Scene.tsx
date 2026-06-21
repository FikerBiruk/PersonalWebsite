'use client'

import React, { useRef, useMemo, Suspense } from 'react'
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
  const font = useLoader(FontLoader, FONT_URL)

  const count = 15000 // Higher count for better definition

  const positions = useMemo(() => {
    // 1. Initial random cloud
    const initial = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      initial[i * 3] = (Math.random() - 0.5) * 60
      initial[i * 3 + 1] = (Math.random() - 0.5) * 60
      initial[i * 3 + 2] = (Math.random() - 0.5) * 60
    }

    // 2. Target Name "FIKER" with uniform distribution
    const textGeo = new TextGeometry('FIKER', {
      font: font,
      size: 3,
      height: 0.8,
      curveSegments: 12,
      bevelEnabled: false
    })
    textGeo.center()

    const posAttr = textGeo.getAttribute('position')
    const target = new Float32Array(count * 3)

    // To ensure even distribution across all letters,
    // we cycle through all available vertices in the geometry
    for (let i = 0; i < count; i++) {
      const vertexIndex = i % posAttr.count

      // Base position from geometry
      const x = posAttr.getX(vertexIndex)
      const y = posAttr.getY(vertexIndex)
      const z = posAttr.getZ(vertexIndex)

      // Add "volume" by jittering slightly within the letter space
      target[i * 3] = x + (Math.random() - 0.5) * 0.2
      target[i * 3 + 1] = y + (Math.random() - 0.5) * 0.2
      target[i * 3 + 2] = z + (Math.random() - 0.5) * 0.6
    }

    // 3. Final explosion
    const explode = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const dist = 50 + Math.random() * 20
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

    // Define 3 phases: Assemble (0-0.4), Hold (0.4-0.7), Dissolve (0.7-1.0)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      let tx, ty, tz

      if (offset < 0.4) {
        // Phase 1: Assemble
        const t = offset / 0.4
        tx = THREE.MathUtils.lerp(positions.initial[i3], positions.target[i3], t)
        ty = THREE.MathUtils.lerp(positions.initial[i3+1], positions.target[i3+1], t)
        tz = THREE.MathUtils.lerp(positions.initial[i3+2], positions.target[i3+2], t)
      } else if (offset < 0.7) {
        // Phase 2: Hold clearly
        tx = positions.target[i3]
        ty = positions.target[i3+1]
        tz = positions.target[i3+2]
      } else {
        // Phase 3: Dissolve
        const t = (offset - 0.7) / 0.3
        tx = THREE.MathUtils.lerp(positions.target[i3], positions.explode[i3], t)
        ty = THREE.MathUtils.lerp(positions.target[i3+1], positions.explode[i3+1], t)
        tz = THREE.MathUtils.lerp(positions.target[i3+2], positions.explode[i3+2], t)
      }

      // Smooth interpolation for the particles
      currentPositions[i3] += (tx - currentPositions[i3]) * 0.1
      currentPositions[i3+1] += (ty - currentPositions[i3+1]) * 0.1
      currentPositions[i3+2] += (tz - currentPositions[i3+2]) * 0.1
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Slow down rotation during the "Hold" phase to make it readable
    const rotationSpeed = offset > 0.4 && offset < 0.7 ? 0.1 : 0.4
    pointsRef.current.rotation.y = offset * Math.PI * rotationSpeed
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
        size={0.06}
        color="#60a5fa"
        transparent
        opacity={0.9}
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
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <ambientLight intensity={2} />
      <Stars radius={150} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />

      <Suspense fallback={null}>
        <ParticleName />
      </Suspense>

      <Scroll html>
        <div className="w-screen pointer-events-none text-white font-sans">
          <section className="h-screen flex items-center justify-center">
            <h2 className="text-white/40 text-xs font-mono tracking-[1em] uppercase">Scroll to form</h2>
          </section>

          {/* This section aligns with the "Hold" phase (0.4 - 0.7) */}
          <section className="h-[150vh] flex items-center justify-center">
            <div className="text-center p-8">
               <h3 className="text-blue-400 font-mono tracking-widest uppercase text-sm mb-4">Engineering Reality</h3>
               <p className="max-w-md mx-auto text-neutral-400 text-lg">I build autonomous systems that bridge the gap between digital data and physical motion.</p>
            </div>
          </section>

          <section className="h-screen flex flex-col justify-center items-center">
             <h2 className="text-white text-5xl font-bold tracking-tighter italic">Dissolving complexity.</h2>
          </section>
        </div>
      </Scroll>
    </>
  )
}

export default function Scene() {
  return (
    <div className="h-screen w-full bg-[#020202]">
      <Canvas>
        <ScrollControls pages={4} damping={0.3}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
