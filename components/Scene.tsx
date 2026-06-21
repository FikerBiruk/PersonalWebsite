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

  const count = 20000 // Increased count for higher resolution

  const positions = useMemo(() => {
    // 1. Initial random cloud
    const initial = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      initial[i * 3] = (Math.random() - 0.5) * 60
      initial[i * 3 + 1] = (Math.random() - 0.5) * 60
      initial[i * 3 + 2] = (Math.random() - 0.5) * 60
    }

    // 2. Target Name "FIKER" using Surface Sampling
    const textGeo = new TextGeometry('FIKER', {
      font: font,
      size: 3,
      height: 0.2, // Thinner height for sharper letters
      curveSegments: 12,
      bevelEnabled: false
    })
    textGeo.center()

    // Create a temporary mesh to sample from the surface (the faces)
    const tempMesh = new THREE.Mesh(textGeo)
    const sampler = new MeshSurfaceSampler(tempMesh).build()
    const target = new Float32Array(count * 3)
    const tempPosition = new THREE.Vector3()

    for (let i = 0; i < count; i++) {
      sampler.sample(tempPosition)
      target[i * 3] = tempPosition.x
      target[i * 3 + 1] = tempPosition.y
      target[i * 3 + 2] = tempPosition.z + (Math.random() - 0.5) * 0.1 // Tiny bit of depth
    }

    // 3. Final explosion
    const explode = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const dist = 40 + Math.random() * 20
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

      // Phase 1: Assemble (0 to 0.4)
      if (offset < 0.4) {
        const t = offset / 0.4
        tx = THREE.MathUtils.lerp(positions.initial[i3], positions.target[i3], t)
        ty = THREE.MathUtils.lerp(positions.initial[i3+1], positions.target[i3+1], t)
        tz = THREE.MathUtils.lerp(positions.initial[i3+2], positions.target[i3+2], t)
      }
      // Phase 2: Hold (0.4 to 0.7)
      else if (offset < 0.7) {
        tx = positions.target[i3]
        ty = positions.target[i3+1]
        tz = positions.target[i3+2]
      }
      // Phase 3: Dissolve (0.7 to 1.0)
      else {
        const t = (offset - 0.7) / 0.3
        tx = THREE.MathUtils.lerp(positions.target[i3], positions.explode[i3], t)
        ty = THREE.MathUtils.lerp(positions.target[i3+1], positions.explode[i3+1], t)
        tz = THREE.MathUtils.lerp(positions.target[i3+2], positions.explode[i3+2], t)
      }

      // Smooth step
      currentPositions[i3] += (tx - currentPositions[i3]) * 0.15
      currentPositions[i3+1] += (ty - currentPositions[i3+1]) * 0.15
      currentPositions[i3+2] += (tz - currentPositions[i3+2]) * 0.15
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Minimal rotation during hold for maximum legibility
    const rotAmount = offset > 0.4 && offset < 0.7 ? 0.05 : 0.3
    pointsRef.current.rotation.y = offset * Math.PI * rotAmount
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
        size={0.035} // Smaller particles for better detail
        color="#60a5fa"
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
      <ambientLight intensity={1} />
      <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Suspense fallback={null}>
        <ParticleName />
      </Suspense>

      <Scroll html>
        <div className="w-screen pointer-events-none text-white font-sans">
          <section className="h-screen flex items-center justify-center">
            <h2 className="text-white/20 text-[10px] font-mono tracking-[1.5em] uppercase">Initialize</h2>
          </section>

          <section className="h-[200vh] flex items-center justify-center">
            <div className="text-center">
               <p className="text-blue-500 font-mono tracking-widest uppercase text-xs">Fiker Biruk</p>
               <h1 className="text-white text-lg font-light tracking-tighter opacity-50 mt-2">Robotics & Vision</h1>
            </div>
          </section>

          <section className="h-screen flex flex-col justify-center items-center">
             <h2 className="text-white/40 text-xs font-mono uppercase tracking-widest italic">Dissolve to Stars</h2>
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
        <ScrollControls pages={4} damping={0.2}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
