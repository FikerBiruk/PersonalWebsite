'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  useScroll,
  Float,
  MeshDistortMaterial,
  Icosahedron,
  PerspectiveCamera,
  Stars
} from '@react-three/drei'
import * as THREE from 'three'

function ParticleSphere() {
  const scroll = useScroll()
  const pointsRef = useRef<THREE.Points>(null!)

  // Create a distribution of points
  const count = 2000
  const [positions, stepArray] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const stepArray = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = 2
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      stepArray[i] = Math.random()
    }
    return [positions, stepArray]
  }, [])

  useFrame((state) => {
    const offset = scroll.offset

    // Rotate based on scroll
    pointsRef.current.rotation.y = offset * Math.PI * 2
    pointsRef.current.rotation.x = offset * 0.5

    // Pulse effect
    const time = state.clock.getElapsedTime()
    pointsRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.1 + offset * 0.5)

    // Move slightly based on mouse? No, let's stick to scroll for now
    pointsRef.current.position.y = -offset * 2
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#3b82f6"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const scroll = useScroll()

  useFrame((state) => {
    const offset = scroll.offset
    const time = state.clock.getElapsedTime()

    meshRef.current.rotation.x = time * 0.2 + offset * Math.PI
    meshRef.current.rotation.y = time * 0.3 + offset * Math.PI

    // Move across the screen based on scroll
    meshRef.current.position.x = Math.sin(offset * Math.PI) * 2
    meshRef.current.position.z = -2 + offset * 2
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Icosahedron ref={meshRef} args={[1, 15]} position={[2, 0, -2]}>
        <MeshDistortMaterial
          color="#1d4ed8"
          speed={2}
          distort={0.4}
          radius={1}
        />
      </Icosahedron>
    </Float>
  )
}

function SceneContent() {
  const scroll = useScroll()
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)

  useFrame(() => {
    const offset = scroll.offset
    // Smooth camera transition
    // At offset 0: x=0, y=0, z=5
    // At offset 1: x=2, y=-2, z=4
    if (cameraRef.current) {
      cameraRef.current.position.x = THREE.MathUtils.lerp(0, 3, offset)
      cameraRef.current.position.y = THREE.MathUtils.lerp(0, -2, offset)
      cameraRef.current.lookAt(0, -offset * 2, 0)
    }
  })

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={2} />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <ParticleSphere />
      <FloatingShape />

      <Scroll html>
        <div className="w-screen">
          {/* Section 1: Hero */}
          <section className="h-screen flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] text-white">
                Building robots, <br />
                <span className="text-blue-500">tools, and ideas</span> <br />
                that move.
              </h1>
              <p className="text-xl md:text-2xl text-neutral-400 mt-8 max-w-xl leading-relaxed">
                I’m Fiker — a student engineer working on robotics, computer vision, and modern web tools.
              </p>
              <div className="mt-12 flex gap-6">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
                  View Projects
                </button>
                <button className="px-8 py-4 border border-neutral-700 text-white rounded-full font-bold hover:bg-neutral-800 transition-colors">
                  Learn more
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Focus */}
          <section className="h-screen flex items-center justify-end px-6 md:px-12 max-w-7xl mx-auto">
            <div className="w-full lg:w-1/2 border border-neutral-800 bg-black/60 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-8">
                Current Focus
              </h2>
              <ul className="flex flex-col gap-8">
                {[
                  { title: "Autonomous blimp navigation", desc: "Exploring low-power altitude control and visual odometry." },
                  { title: "AprilTag pose estimation pipeline", desc: "Optimizing C++ implementations for real-time edge processing." },
                  { title: "Cable-driven tentacle robot", desc: "Designing biomimetic structures for soft robotics research." },
                  { title: "Personal website + UI system", desc: "Crafting a minimal, high-performance digital presence." }
                ].map((item, i) => (
                  <li key={i} className="flex flex-col gap-2">
                    <span className="font-bold text-xl text-white">{item.title}</span>
                    <span className="text-neutral-400 text-base leading-relaxed">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3: Call to action */}
          <section className="h-screen flex flex-col justify-center items-center px-6 text-center">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8">
              Let's build something <br /> extraordinary.
            </h2>
            <p className="text-xl text-neutral-400 max-w-xl mb-12">
              Currently seeking collaborations in robotics and computer vision.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">GitHub</a>
              <span className="text-neutral-700">/</span>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">LinkedIn</a>
              <span className="text-neutral-700">/</span>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Twitter</a>
            </div>

            <footer className="absolute bottom-12 text-neutral-600 text-sm">
              &copy; {new Date().getFullYear()} Fiker. All rights reserved.
            </footer>
          </section>
        </div>
      </Scroll>
    </>
  )
}

export default function Scene() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas shadows>
        <ScrollControls pages={3} damping={0.2}>
          <SceneContent />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
