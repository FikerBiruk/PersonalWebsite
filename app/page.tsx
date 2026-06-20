import { Navbar } from "@/components/navbar";
import { Button } from "@/components/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-32 pb-24">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Left Side: Hero Text */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1]">
              Building robots, tools, and ideas that move.
            </h1>
            <p className="text-xl md:text-2xl text-muted max-w-2xl leading-relaxed">
              I’m Fiker — a student engineer working on robotics, computer vision, and modern web tools.
            </p>
            <div className="flex flex-wrap items-center gap-8 mt-4">
              <Button>View Projects</Button>
              <Button variant="secondary">Learn more &rarr;</Button>
            </div>
          </div>

          {/* Right Side: Current Focus Card */}
          <div className="lg:col-span-5 w-full">
            <div className="border border-neutral-800 bg-[#0c0c0c] p-8 rounded-xl shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted mb-6">
                Current Focus
              </h2>
              <ul className="flex flex-col gap-6">
                <li className="flex flex-col gap-1">
                  <span className="font-bold text-lg">Autonomous blimp navigation</span>
                  <span className="text-muted text-sm leading-relaxed">Exploring low-power altitude control and visual odometry.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-bold text-lg">AprilTag pose estimation pipeline</span>
                  <span className="text-muted text-sm leading-relaxed">Optimizing C++ implementations for real-time edge processing.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-bold text-lg">Cable-driven tentacle robot</span>
                  <span className="text-muted text-sm leading-relaxed">Designing biomimetic structures for soft robotics research.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-bold text-lg">Personal website + UI system</span>
                  <span className="text-muted text-sm leading-relaxed">Crafting a minimal, high-performance digital presence.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-800 mt-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-muted text-sm">
          <p>&copy; {new Date().getFullYear()} Fiker. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
