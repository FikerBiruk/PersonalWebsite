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
import { FontLoader, TextGeometry, MeshSurfaceSampler } from 'three-stdlib'

const FONT_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json'

function ParticleName() {
  const scroll = useScroll()
  const pointsRef = useRef<THREE.Points>(null!)
  const font = useLoader(FontLoader, FONT_URL)

  const count = 30000
  const words = ["FIKER", "BIRUK", "RANDOM", "TESTING", "OTHER"]

  const data = useMemo(() => {
    // 1. Initial random cloud (Nebula)
    const initial = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      initial[i * 3] = (Math.random() - 0.5) * 60
      initial[i * 3 + 1] = (Math.random() - 0.5) * 60
      initial[i * 3 + 2] = (Math.random() - 0.5) * 60
    }

    // 2. Generate targets for all words
    const targets = words.map((word) => {
      const textGeo = new TextGeometry(word, {
        font: font,
        size: word.length > 7 ? 2 : 2.5,
        height: 0.8,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
      })
      textGeo.center()
      const tempMesh = new THREE.Mesh(textGeo)
      const sampler = new MeshSurfaceSampler(tempMesh).build()
      const targetArr = new Float32Array(count * 3)
      const tempPos = new THREE.Vector3()

      for (let i = 0; i < count; i++) {
        sampler.sample(tempPos)
        targetArr[i * 3] = tempPos.x
        targetArr[i * 3 + 1] = tempPos.y
        targetArr[i * 3 + 2] = tempPos.z + (Math.random() - 0.5) * 0.4
      }
      return targetArr
    })

    // 3. Final explosion (Sphere)
    const explode = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const dist = 60 + Math.random() * 30
      explode[i * 3] = dist * Math.sin(phi) * Math.cos(theta)
      explode[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta)
      explode[i * 3 + 2] = dist * Math.cos(phi)
    }

    return { initial, targets, explode }
  }, [font])

  useFrame((state) => {
    if (!pointsRef.current) return

    const offset = scroll.offset
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    // Timeline mapping for 6 pages (0 to 1)
    // 0.0 - 0.1: Nebula
    // 0.1 - 0.25: FIKER
    // 0.25 - 0.45: BIRUK
    // 0.45 - 0.65: RANDOM
    // 0.65 - 0.85: TESTING
    // 0.85 - 0.95: OTHER
    // 0.95 - 1.0: EXPLODE

    const segments = [0.1, 0.25, 0.45, 0.65, 0.85, 0.95, 1.0]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      let tx, ty, tz

      if (offset < segments[0]) {
        // Nebula
        tx = data.initial[i3]
        ty = data.initial[i3+1]
        tz = data.initial[i3+2]
      } else if (offset < segments[5]) {
        // Find which word we are in
        let wordIdx = 0
        for(let j = 0; j < 5; j++) {
           if (offset < segments[j+1]) {
             wordIdx = j
             break
           }
        }

        const start = segments[wordIdx]
        const end = segments[wordIdx+1]
        const mid = (start + end) / 2

        // If we are in the first half of the segment, morph from previous
        // If in second half, hold
        if (offset < mid) {
          const t = (offset - start) / (mid - start)
          const prevTarget = wordIdx === 0 ? data.initial : data.targets[wordIdx - 1]
          tx = THREE.MathUtils.lerp(prevTarget[i3], data.targets[wordIdx][i3], t)
          ty = THREE.MathUtils.lerp(prevTarget[i3+1], data.targets[wordIdx][i3+1], t)
          tz = THREE.MathUtils.lerp(prevTarget[i3+2], data.targets[wordIdx][i3+2], t)
        } else {
          tx = data.targets[wordIdx][i3]
          ty = data.targets[wordIdx][i3+1]
          tz = data.targets[wordIdx][i3+2]
        }
      } else {
        // Explosion
        const t = (offset - segments[5]) / (1.0 - segments[5])
        tx = THREE.MathUtils.lerp(data.targets[4][i3], data.explode[i3], t)
        ty = THREE.MathUtils.lerp(data.targets[4][i3+1], data.explode[i3+1], t)
        tz = THREE.MathUtils.lerp(data.targets[4][i3+2], data.explode[i3+2], t)
      }

      // Physics interpolation
      const smooth = offset > 0.95 ? 0.05 : 0.12
      positions[i3] += (tx - positions[i3]) * smooth
      positions[i3+1] += (ty - positions[i3+1]) * smooth
      positions[i3+2] += (tz - positions[i3+2]) * smooth
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Dynamic camera and light behavior
    state.camera.position.z = THREE.MathUtils.lerp(18, 12, offset)
    if (offset > 0.9) {
        state.camera.position.z = 12 + (offset - 0.9) * 40 // Pull back fast
    }

    // Subtle rotation
    pointsRef.current.rotation.y = offset * Math.PI * 0.5
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={data.initial.slice()}
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
        depthWrite={false}
      />
    </points>
  )
}

function SceneContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 18]} />
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#60a5fa" />
      <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Suspense fallback={null}>
        <ParticleName />
      </Suspense>

      <Scroll html>
        <div className="w-screen pointer-events-none text-white font-sans uppercase tracking-[0.5em] text-[10px]">
          <section className="h-screen flex items-center justify-center">
            <h2 className="opacity-20">Initialize System</h2>
          </section>
          <section className="h-screen flex items-end justify-center pb-24">
            <h2 className="opacity-40">Identity Formation</h2>
          </section>
          <section className="h-screen flex items-center justify-center">
            <h2 className="opacity-40">Data Processing</h2>
          </section>
          <section className="h-screen flex items-center justify-center">
            <h2 className="opacity-40">Kinetic Evolution</h2>
          </section>
          <section className="h-screen flex items-center justify-center">
            <h2 className="opacity-40">Refining Logic</h2>
          </section>
          <section className="h-screen flex items-center justify-center">
            <h2 className="opacity-80 text-blue-500">Entropy Reach</h2>
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
        <ScrollControls pages={6} damping={0.25}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
