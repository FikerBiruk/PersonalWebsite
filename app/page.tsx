'use client'

import dynamic from 'next/dynamic'
import { ShimmerText, BentoGrid, BentoItem, NoiseBackground } from '@/components/ReactBits'
import { motion } from 'framer-motion'
import { Cpu, Eye, Code, Rocket, Mail, Github, Linkedin } from 'lucide-react'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-black" />
})

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <NoiseBackground />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <Scene />
        <div className="z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ShimmerText text="Fiker Biruk" className="text-6xl md:text-8xl font-black tracking-tighter" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-blue-400 font-mono tracking-[0.3em] uppercase text-sm md:text-base"
          >
            Robotics & Vision Engineer
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="pt-8"
          >
            <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105">
              Explore Projects
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight italic">
              Bridging the gap between <span className="text-blue-500">pixels</span> and <span className="text-blue-500">physical motion.</span>
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed max-w-xl">
              I specialize in creating autonomous systems that perceive and interact with reality. My work spans from high-speed computer vision pipelines to the mechanical design of soft-robotic structures.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-8 border border-white/10 rounded-3xl bg-white/5 space-y-2">
                <h4 className="text-3xl font-bold">12+</h4>
                <p className="text-xs text-neutral-500 uppercase tracking-widest">Active Projects</p>
             </div>
             <div className="p-8 border border-white/10 rounded-3xl bg-white/5 space-y-2">
                <h4 className="text-3xl font-bold">4</h4>
                <p className="text-xs text-neutral-500 uppercase tracking-widest">Years Engineering</p>
             </div>
          </div>
        </div>
      </section>

      {/* Projects Section (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <h2 className="text-xs font-mono text-blue-500 uppercase tracking-[0.5em] mb-12">Featured Systems</h2>
        <BentoGrid>
          <BentoItem
            title="Autonomous Blimp"
            description="Real-time altitude control and obstacle avoidance using low-power MCU."
            className="md:col-span-2"
            icon={<Rocket className="w-6 h-6 text-blue-500" />}
          />
          <BentoItem
            title="AprilTag Pose"
            description="Optimized C++ pipeline for 6D pose estimation at 60FPS."
            icon={<Eye className="w-6 h-6 text-purple-500" />}
          />
          <BentoItem
            title="Soft Robotics"
            description="Bio-inspired cable-driven actuators for delicate interaction."
            icon={<Cpu className="w-6 h-6 text-emerald-500" />}
          />
          <BentoItem
            title="Digital Twin"
            description="Web-based simulation environment for hardware verification."
            className="md:col-span-2"
            icon={<Code className="w-6 h-6 text-orange-500" />}
          />
        </BentoGrid>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 text-center">
        <h2 className="text-5xl md:text-7xl font-black mb-12 italic">Let's build.</h2>
        <div className="flex flex-wrap justify-center gap-12 text-sm font-bold uppercase tracking-widest">
           <a href="#" className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
             <Github className="w-4 h-4" />
             <span className="border-b border-white/20 group-hover:border-blue-500 transition-all">GitHub</span>
           </a>
           <a href="#" className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
             <Linkedin className="w-4 h-4" />
             <span className="border-b border-white/20 group-hover:border-blue-500 transition-all">LinkedIn</span>
           </a>
           <a href="#" className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
             <Mail className="w-4 h-4" />
             <span className="border-b border-white/20 group-hover:border-blue-500 transition-all">Email</span>
           </a>
        </div>
        <p className="mt-32 text-[10px] text-neutral-600 tracking-widest font-mono uppercase">
          &copy; {new Date().getFullYear()} // FIKER_BIRUK // ALL_SYSTEMS_OPERATIONAL
        </p>
      </section>
    </main>
  );
}
