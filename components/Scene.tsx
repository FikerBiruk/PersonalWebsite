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
    // 1. Initial nebula cloud
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
        height: 1.0,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.15,
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
        targetArr[i * 3 + 2] = tempPos.z + (Math.random() - 0.5) * 0.5
      }
      return targetArr
    })

    // 3. Final explosion
    const explode = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const dist = 80 + Math.random() * 40
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

    // Divide the scroll into 7 segments (Nebula -> 5 Words -> Explode)
    const segments = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1.0]

    let currentRotation = 0

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      let tx, ty, tz

      if (offset < segments[0]) {
        // --- PHASE 0: Nebula ---
        tx = data.initial[i3]
        ty = data.initial[i3+1]
        tz = data.initial[i3+2]
        if (i === 0) currentRotation = offset * Math.PI * 0.5
      } else if (offset < segments[5]) {
        // --- PHASE 1-5: Spin-Morph between words ---
        let wordIdx = 0
        for(let j = 0; j < 5; j++) {
           if (offset < segments[j+1]) {
             wordIdx = j
             break
           }
        }

        const start = segments[wordIdx]
        const end = segments[wordIdx+1]
        const localProgress = (offset - start) / (end - start)

        // Morph logic: wordIdx 0 morphs from initial, others morph from prev word
        const prevTarget = wordIdx === 0 ? data.initial : data.targets[wordIdx - 1]
        const currentTarget = data.targets[wordIdx]

        // Linear morph during the spin
        tx = THREE.MathUtils.lerp(prevTarget[i3], currentTarget[i3], localProgress)
        ty = THREE.MathUtils.lerp(prevTarget[i3+1], currentTarget[i3+1], localProgress)
        tz = THREE.MathUtils.lerp(prevTarget[i3+2], currentTarget[i3+2], localProgress)

        // Rotation logic: Every page is exactly one full 360 spin (2PI)
        if (i === 0) {
           const rotationBase = wordIdx * Math.PI * 2
           currentRotation = rotationBase + (localProgress * Math.PI * 2)
        }
      } else {
        // --- PHASE 6: Explosion ---
        const t = (offset - segments[5]) / (1.0 - segments[5])
        tx = THREE.MathUtils.lerp(data.targets[4][i3], data.explode[i3], t)
        ty = THREE.MathUtils.lerp(data.targets[4][i3+1], data.explode[i3+1], t)
        tz = THREE.MathUtils.lerp(data.targets[4][i3+2], data.explode[i3+2], t)

        if (i === 0) currentRotation = (5 * Math.PI * 2) + (t * 15)
      }

      // Physics smoothing (snappy for words, loose for explode)
      const smooth = offset > 0.85 ? 0.05 : 0.15
      positions[i3] += (tx - positions[i3]) * smooth
      positions[i3+1] += (ty - positions[i3+1]) * smooth
      positions[i3+2] += (tz - positions[i3+2]) * smooth
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y = currentRotation
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05

    // Camera choreography
    state.camera.position.z = THREE.MathUtils.lerp(20, 14, offset)
    if (offset > 0.9) state.camera.position.z = 14 + (offset - 0.9) * 60
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
        size={0.045}
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
      <PerspectiveCamera makeDefault position={[0, 0, 20]} />
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={3} color="#60a5fa" />
      <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Suspense fallback={null}>
        <ParticleName />
      </Suspense>

      <Scroll html>
        <div className="w-screen pointer-events-none text-white font-sans uppercase tracking-[0.5em] text-[10px]">
          <section className="h-screen flex items-center justify-center">
            <h2 className="opacity-20">Initialize</h2>
          </section>
          {["FIKER", "BIRUK", "RANDOM", "TESTING", "OTHER"].map((label, i) => (
            <section key={i} className="h-screen flex items-end justify-center pb-24">
              <h2 className="opacity-40">{label}</h2>
            </section>
          ))}
          <section className="h-screen flex items-center justify-center">
            <h2 className="opacity-80 text-blue-500">Explosion</h2>
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
        <ScrollControls pages={8} damping={0.3}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
