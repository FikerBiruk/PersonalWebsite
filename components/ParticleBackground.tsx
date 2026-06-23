'use client'

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function ParticleBackground() {
  return (
    <Canvas
      className="fixed inset-0 -z-50"
      camera={{ position: [0, 0, 8], fov: 60 }}
    >
      <Particles />
    </Canvas>
  );
}

function Particles() {
  const count = 4000;
  const mesh = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();

    // Scroll-reactive swirl
    const scrollY = typeof window !== 'undefined' ? window.scrollY * 0.0005 : 0;

    camera.position.z = 8 + scrollY * 4;

    if (mesh.current) {
      mesh.current.rotation.x = t * 0.02 + scrollY * 0.5;
      mesh.current.rotation.y = t * 0.03 + scrollY * 0.5;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
}
