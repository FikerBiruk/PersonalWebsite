'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const ShimmerText = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <h1 className={`relative inline-block overflow-hidden ${className}`}>
      <span className="text-white opacity-20">{text}</span>
      <motion.span
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent bg-clip-text text-transparent"
        style={{ WebkitBackgroundClip: 'text' }}
      >
        {text}
      </motion.span>
    </h1>
  )
}

export const BentoGrid = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[18rem] ${className}`}>
      {children}
    </div>
  )
}

export const BentoItem = ({
  title,
  description,
  className = "",
  icon
}: {
  title: string,
  description: string,
  className?: string,
  icon?: React.ReactNode
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 flex flex-col justify-end group transition-all hover:border-white/20 ${className}`}
    >
      <div className="absolute top-6 left-6 opacity-50 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export const NoiseBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>
    </div>
  )
}
