"use client";

import { Sparkles, Brain, Cpu, Globe } from "lucide-react";
import { ScrambleText } from "@/components/ScrambleText";
import { MagneticButton } from "@/components/MagneticButton";

export function SubstrateSection() {
  return (
    <section className="relative bg-black border-b border-white/5 overflow-hidden py-32">
      {/* Background Ambient Glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row min-h-[800px]">
        {/* Left Content */}
        <div className="w-full md:w-[45%] px-6 flex flex-col justify-center relative z-20 bg-gradient-to-r from-black via-black to-transparent">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/10 rounded-full bg-white/5 self-start">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest">
              Neural Infrastructure
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 leading-[0.9]">
            The AI
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-white/40">
              <ScrambleText text="Substrate." speed={50} />
            </span>
          </h2>

          <div className="space-y-8 max-w-md">
            <p className="text-neutral-400 text-lg font-light leading-relaxed">
              We've engineered a high-velocity ecosystem that transforms raw data into viral content.
              Our stack combines best-in-class neural networks for elite scalability.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all duration-500">
                  <Brain className="w-5 h-5 text-neutral-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Cognitive Engine</div>
                  <div className="text-[10px] text-neutral-500 font-mono uppercase">GPT-4o / Claude 3.5</div>
                </div>
              </div>
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all duration-500">
                  <Cpu className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Visual Synthesis</div>
                  <div className="text-[10px] text-neutral-500 font-mono uppercase">Runway GEN-3 / Sora</div>
                </div>
              </div>
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-500">
                  <Globe className="w-5 h-5 text-neutral-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Global Distribution</div>
                  <div className="text-[10px] text-neutral-500 font-mono uppercase">Edge API / Webhooks</div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <MagneticButton>
                <button 
                  className="shiny-cta" 
                  style={{ "--gradient-shine": "#8b5cf6" } as unknown}
                  suppressHydrationWarning
                >
                  <span>Explore Architecture</span>
                </button>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Right: The Infinite 3D Wall */}
        <div className="absolute right-[-10%] md:right-[-5%] top-[-10%] bottom-[-10%] w-[120%] md:w-[65%] wall-container overflow-hidden pointer-events-none md:pointer-events-auto">
          <div className="wall-grid h-full w-full flex gap-6 px-10">
            {/* Column 1 (Scroll Up) */}
            <div className="wall-column wall-column-up flex flex-col gap-6 w-full mt-20">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="contents">
                  <WallCard icon="simple-icons:openai" title="OpenAI" subtitle="GPT-4o / Sora" color="#ffffff" />
                  <WallCard icon="simple-icons:nextdotjs" title="Next.js" subtitle="App Router" color="#ffffff" />
                  <WallCard icon="simple-icons:stripe" title="Stripe" subtitle="Payments" color="#635BFF" />
                  <WallCard icon="simple-icons:supabase" title="Supabase" subtitle="Database" color="#3ECF8E" />
                </div>
              ))}
            </div>

            {/* Column 2 (Scroll Down) */}
            <div className="wall-column wall-column-down flex flex-col gap-6 w-full">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="contents">
                  <WallCard icon="simple-icons:runway" title="Runway" subtitle="Video Gen" color="#ffffff" />
                  <WallCard icon="simple-icons:anthropic" title="Claude" subtitle="Artifacts" color="#ffffff" />
                  <WallCard icon="simple-icons:vercel" title="Vercel" subtitle="Edge Runtime" color="#ffffff" />
                  <WallCard icon="simple-icons:linear" title="Linear" subtitle="Planning" color="#5E6AD2" />
                </div>
              ))}
            </div>

            {/* Column 3 (Scroll Up) - Only visible on desktop */}
            <div className="wall-column wall-column-up hidden lg:flex flex-col gap-6 w-full mt-40">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="contents">
                  <WallCard icon="simple-icons:github" title="GitHub" subtitle="VCS Protocol" color="#ffffff" />
                  <WallCard icon="simple-icons:figma" title="Figma" subtitle="UI/UX Lab" color="#F24E1E" />
                  <WallCard icon="simple-icons:tailwindcss" title="Tailwind" subtitle="Architecture" color="#06B6D4" />
                  <WallCard icon="simple-icons:react" title="React" subtitle="Neural UI" color="#61DAFB" />
                </div>
              ))}
            </div>
          </div>

          {/* Masking the Wall */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10 pointer-events-none opacity-60"></div>
        </div>
      </div>
    </section>
  );
}

function WallCard({
  icon,
  title,
  subtitle,
  color = "#ffffff"
}: {
  icon: string;
  title: string;
  subtitle: string;
  color?: string;
}) {
  return (
    <div className="wall-card rounded-2xl p-6 aspect-[4/3] flex flex-col justify-between group cursor-default">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-500">
          <iconify-icon
            icon={icon}
            width="20"
            style={{ color }}
            className="opacity-40 group-hover:opacity-100 transition-opacity"
          ></iconify-icon>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_10px_#10b981]"></div>
      </div>
      <div>
        <div className="text-sm font-medium text-white/90">{title}</div>
        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

