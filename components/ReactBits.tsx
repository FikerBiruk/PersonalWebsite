'use client'

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ShimmerText = ({ text, className = "", speed = 2 }: { text: string, className?: string, speed?: number }) => {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <span className="text-white opacity-20">{text}</span>
      <motion.span
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent bg-clip-text text-transparent"
        style={{ WebkitBackgroundClip: 'text' }}
      >
        {text}
      </motion.span>
    </span>
  );
};

export const ColorBends = ({ className = "", speed = 0.6, colors = ["#ffffff", "#a0a0ff", "#d0d0ff"] }: { className?: string, speed?: number, colors?: string[] }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        animate={{
          background: colors.map(c => `radial-gradient(circle at ${Math.random()*100}% ${Math.random()*100}%, ${c}, transparent)`).join(', ')
        }}
        transition={{ duration: 10 / speed, repeat: Infinity, repeatType: "mirror" }}
        className="w-full h-full filter blur-3xl opacity-50"
      />
    </div>
  );
};

export const NoiseField = ({ className = "", speed = 0.4, color = "#ffffff" }: { className?: string, speed?: number, color?: string }) => {
  return (
    <div className={`pointer-events-none ${className}`}>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-[0.05]">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency={0.65 * speed} numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" fill={color}/>
      </svg>
    </div>
  );
};

export const CursorTrail = ({ color = "#ffffff", size = 12, smoothing = 0.2 }: { color?: string, size?: number, smoothing?: number }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      animate={{ x: mousePos.x - size / 2, y: mousePos.y - size / 2 }}
      transition={{ type: "spring", damping: 20, stiffness: 100, restDelta: 0.001, mass: smoothing }}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full blur-sm"
      style={{ width: size, height: size, backgroundColor: color }}
    />
  );
};

export const BentoGrid = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[20rem] ${className}`}>
      {children}
    </div>
  );
};

export const BentoCard = ({ title, description, className = "" }: { title: string, description: string, className?: string }) => {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-end transition-colors hover:bg-white/10 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  );
};

export const ParallaxScroll = ({ children, strength = 0.15 }: { children: React.ReactNode, strength?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * strength]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};
