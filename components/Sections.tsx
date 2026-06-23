'use client'

import React from 'react';
import { ShimmerText, ColorBends, BentoGrid, BentoCard, ParallaxScroll } from './ReactBits';

export const Hero = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <ColorBends className="absolute inset-0 -z-10 opacity-40" speed={0.6} colors={["#ffffff", "#a0a0ff", "#d0d0ff"]} />
      <div className="z-10 text-center space-y-4">
        <ShimmerText text="[INSERT TEXT HERE]" className="text-5xl md:text-7xl font-bold" speed={2} />
        <p className="text-xl text-neutral-400">[INSERT SUBTITLE PLACEHOLDER]</p>
        <button className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors">
          [INSERT CTA PLACEHOLDER]
        </button>
      </div>
    </section>
  );
};

export const About = () => {
  return (
    <section className="py-32 px-6 max-w-4xl mx-auto">
      <ParallaxScroll strength={0.15}>
        <div className="p-10 space-y-6">
          <h2 className="text-3xl font-bold text-white uppercase tracking-widest">About</h2>
          <p className="text-lg text-neutral-400 leading-relaxed">
            [INSERT ABOUT TEXT HERE]
          </p>
        </div>
      </ParallaxScroll>
    </section>
  );
};

export const Projects = () => {
  return (
    <section className="py-32 px-6 border-t border-white/5">
      <h2 className="text-xs font-mono text-white uppercase tracking-[0.5em] mb-12 text-center">Featured Projects</h2>
      <BentoGrid className="max-w-5xl mx-auto gap-4">
        <BentoCard title="[INSERT PROJECT TITLE]" description="[INSERT DESCRIPTION]" />
        <BentoCard title="[INSERT PROJECT TITLE]" description="[INSERT DESCRIPTION]" />
        <BentoCard title="[INSERT PROJECT TITLE]" description="[INSERT DESCRIPTION]" />
      </BentoGrid>
    </section>
  );
};

export const Skills = () => {
  return (
    <section className="py-32 px-6 max-w-5xl mx-auto border-t border-white/5">
      <h2 className="text-3xl font-bold text-white mb-12">Skills</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-4">
            <h3 className="font-bold text-neutral-400 text-sm uppercase tracking-widest">Category {i}</h3>
            <ul className="text-white space-y-2">
              <li>[INSERT SKILL LIST HERE]</li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export const Contact = () => {
  return (
    <section className="py-32 px-6 text-center border-t border-white/5">
      <h2 className="text-5xl font-bold text-white mb-12">Get in Touch</h2>
      <div className="flex justify-center gap-12 text-sm font-bold uppercase tracking-widest">
        <a href="#" className="hover:text-blue-400 transition-colors border-b border-white/20 pb-1">
          [INSERT CONTACT LINKS HERE]
        </a>
      </div>
    </section>
  );
};
