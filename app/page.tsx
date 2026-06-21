import dynamic from 'next/dynamic'
import { Navbar } from "@/components/navbar";

// Use dynamic import for the 3D scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <div className="text-white text-xl animate-pulse font-mono tracking-widest">
        LOADING EXPERIENCE...
      </div>
    </div>
  )
})

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-black overflow-hidden">
      {/* Absolute Navbar to sit on top of the Canvas */}
      <div className="absolute top-0 left-0 w-full z-50 pointer-events-auto">
        <Navbar />
      </div>

      {/* The 3D Scroll Experience */}
      <Scene />
    </main>
  );
}
