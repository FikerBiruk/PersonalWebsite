'use client'

import React from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import { CursorTrail } from '@/components/ReactBits';
import { Hero, About, Projects, Skills, Contact } from '@/components/Sections';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden selection:bg-white selection:text-black">
      {/* Background Layer */}
      <ParticleBackground />
      <CursorTrail color="#ffffff" size={12} smoothing={0.2} />

      {/* Content Layers */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </div>

      <footer className="py-12 text-center text-[10px] text-neutral-600 tracking-[0.3em] font-mono uppercase">
        All systems operational // [INSERT NAME]
      </footer>
    </main>
  );
}
