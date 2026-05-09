"use client";

import { ScrambleText } from "@/components/ScrambleText";

// Column 1 items (scrolls up)
const techItemsColumn1 = [
  { name: "OpenAI GPT-4o", type: "Script AI", icon: "simple-icons:openai", color: "#ffffff" },
  { name: "ElevenLabs", type: "AI Voiceover", icon: "simple-icons:elevenlabs", color: "#8b5cf6" },
  { name: "Next.js", type: "Framework", icon: "simple-icons:nextdotjs", color: "#ffffff" },
  { name: "Prisma", type: "ORM", icon: "simple-icons:prisma", color: "#2D3748" },
];

// Column 2 items (scrolls down)
const techItemsColumn2 = [
  { name: "Runway ML", type: "Video AI", icon: "simple-icons:runway", color: "#ffffff" },
  { name: "Vercel", type: "Deployment", icon: "simple-icons:vercel", color: "#ffffff" },
  { name: "FFmpeg", type: "Processing", icon: "simple-icons:ffmpeg", color: "#0078D4" },
  { name: "Clerk", type: "Auth", icon: "simple-icons:clerk", color: "#6C47FF" },
];

// Column 3 items (scrolls up)
const techItemsColumn3 = [
  { name: "Pexels API", type: "Stock B-Roll", icon: "simple-icons:pexels", color: "#05A081" },
  { name: "Whisper", type: "Audio", icon: "simple-icons:openai", color: "#10b981" },
  { name: "Polar", type: "Payments", icon: "simple-icons:polar", color: "#A855F7" },
  { name: "Supabase", type: "Database", icon: "simple-icons:supabase", color: "#3ECF8E" },
  { name: "TypeScript", type: "Language", icon: "simple-icons:typescript", color: "#3178C6" },
];

export function TechStackSection() {
  return (
    <section
      id="tech"
      className="relative bg-black border-b border-white/5 overflow-hidden"
    >
      {/* CSS for wall animations */}
      <style jsx>{`
        .wall-container {
          perspective: 2000px;
          transform-style: preserve-3d;
        }
        .wall-grid {
          transform: rotateY(-18deg) rotateX(10deg) rotateZ(-2deg) scale(1.1);
          transform-style: preserve-3d;
        }
        .wall-column {
          will-change: transform;
        }
        .wall-column-up {
          animation: scrollUp 40s linear infinite;
        }
        .wall-column-down {
          animation: scrollDown 40s linear infinite;
        }
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .wall-card {
          background: rgba(23, 23, 23, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.02);
          transition: border-color 0.3s, background-color 0.3s, transform 0.3s;
        }
        .wall-card:hover {
          border-color: rgba(168, 85, 247, 0.4);
          background: rgba(30, 30, 30, 0.8);
          transform: translateZ(20px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(168,85,247,0.05);
        }
      `}</style>

      {/* Background Glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row min-h-[900px]">
        {/* Left Content */}
        <div className="w-full md:w-[40%] px-6 py-20 md:py-32 flex flex-col justify-center relative z-20 bg-gradient-to-r from-black via-black to-transparent">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/10 rounded-full bg-white/5 self-start">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest">
              Infrastructure
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 leading-[0.9]">
            The
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-white/40">
              <ScrambleText text="Stack." speed={50} />
            </span>
          </h2>

          <div className="space-y-8 max-w-sm">
            <p className="text-neutral-400 text-lg font-light leading-relaxed">
              We combine cutting-edge AI models with the fastest video
              processing pipeline to deliver your shorts in under 60 seconds.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500">
                  <iconify-icon icon="simple-icons:openai" width="22" className="text-neutral-400 group-hover:text-white transition-colors"></iconify-icon>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Script AI</div>
                  <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-0.5">OpenAI GPT-4o</div>
                </div>
              </div>

              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all duration-500">
                  <iconify-icon icon="simple-icons:elevenlabs" width="22" className="text-neutral-400 group-hover:text-purple-400 transition-colors"></iconify-icon>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">AI Voiceover</div>
                  <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-0.5">ElevenLabs TTS</div>
                </div>
              </div>

              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-500">
                  <iconify-icon icon="simple-icons:runway" width="22" className="text-neutral-400 group-hover:text-emerald-400 transition-colors"></iconify-icon>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Video AI Synthesis</div>
                  <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-0.5">Runway ML + FFmpeg</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The Infinite 3D Wall */}
        <div className="absolute right-[-10%] md:right-[-5%] top-[-10%] bottom-[-10%] w-[120%] md:w-[70%] wall-container overflow-hidden pointer-events-none md:pointer-events-auto">
          <div className="wall-grid h-full w-full flex gap-6 px-10">
            {/* Column 1 (Scroll Up) */}
            <div className="wall-column wall-column-up flex flex-col gap-6 w-full">
              {[...techItemsColumn1, ...techItemsColumn1].map((tech, i) => {
                return (
                  <div
                    key={`col1-${i}`}
                    className="wall-card rounded-xl p-6 aspect-4/3 flex flex-col justify-between group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 border border-white/5 bg-white/5 rounded-lg flex items-center justify-center">
                        <iconify-icon icon={tech.icon} width="22" style={{ color: tech.color }} className="opacity-40 group-hover:opacity-100 transition-opacity"></iconify-icon>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/90">
                        {tech.name}
                      </div>
                      <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                        {tech.type}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 2 (Scroll Down) */}
            <div className="wall-column wall-column-down flex flex-col gap-6 w-full pt-12">
              {[...techItemsColumn2, ...techItemsColumn2].map((tech, i) => {
                return (
                  <div
                    key={`col2-${i}`}
                    className="wall-card rounded-xl p-6 aspect-4/3 flex flex-col justify-between group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 border border-white/5 bg-white/5 rounded-lg flex items-center justify-center">
                        <iconify-icon icon={tech.icon} width="22" style={{ color: tech.color }} className="opacity-40 group-hover:opacity-100 transition-opacity"></iconify-icon>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/90">
                        {tech.name}
                      </div>
                      <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                        {tech.type}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 3 (Scroll Up) - Hidden on smaller screens */}
            <div className="wall-column wall-column-up flex flex-col gap-6 w-full pt-24 hidden lg:flex">
              {[...techItemsColumn3, ...techItemsColumn3].map((tech, i) => {
                return (
                  <div
                    key={`col3-${i}`}
                    className="wall-card rounded-xl p-6 aspect-4/3 flex flex-col justify-between group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 border border-white/5 bg-white/5 rounded-lg flex items-center justify-center">
                        <iconify-icon icon={tech.icon} width="22" style={{ color: tech.color }} className="opacity-40 group-hover:opacity-100 transition-opacity"></iconify-icon>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/90">
                        {tech.name}
                      </div>
                      <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                        {tech.type}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Heavy Masking on the Wall */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10 pointer-events-none opacity-50"></div>
        </div>
      </div>
    </section>
  );
}
