'use client'

import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-[#0a0a0a]" />
})

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Scene />

      {/* Main Text Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-white text-6xl md:text-8xl font-bold tracking-tighter">
          Fiker Biruk
        </h1>
        <p className="text-blue-500 font-mono tracking-widest uppercase mt-4 text-sm">
          Robotics & Vision Engineer
        </p>

        <div className="mt-10">
          <a
            href="mailto:contact@fiker.dev"
            className="px-8 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-all rounded-full text-sm font-medium"
          >
            Get in touch
          </a>
        </div>
      </div>

      {/* Simple Footer Links */}
      <div className="absolute bottom-10 flex gap-8 text-xs font-mono text-neutral-500">
        <a href="https://github.com/FikerBiruk" className="hover:text-white transition-colors">GITHUB</a>
        <a href="#" className="hover:text-white transition-colors">LINKEDIN</a>
      </div>
    </main>
  )
}
