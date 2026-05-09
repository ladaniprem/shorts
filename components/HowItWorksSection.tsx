"use client";

const steps = [
  {
    num: "01",
    title: "Enter a Prompt",
    description:
      "Describe your idea or paste a long-form video URL. Our AI understands context, tone, and audience.",
  },
  {
    num: "02",
    title: "AI Generates Script",
    description:
      "The AI crafts a high-retention script with optimized hooks, story structure, and a compelling CTA.",
  },
  {
    num: "03",
    title: "Video Assembly",
    description:
      "We auto-select B-roll, add captions, sync an AI voiceover, and apply cinematic transitions.",
  },
  {
    num: "04",
    title: "Publish & Go Viral",
    description:
      "Export in 4K or publish directly to YouTube Shorts, TikTok, and Instagram Reels in one click.",
    active: true,
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-b border-white/5 bg-black py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-[10px] font-mono text-neutral-500 uppercase mb-12">
          02 — Pipeline
        </div>

        {/* Visual Pipeline */}
        <div className="relative mt-20">
          {/* Connection Line */}
          <div className="absolute top-[27px] left-0 w-full h-px bg-white/10 z-0"></div>
          <div className="absolute top-[27px] left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent z-0 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step) => (
              <div
                key={step.num}
                className="group hover:-translate-y-2 transition-transform duration-300 cursor-default"
              >
                <div className="w-14 h-14 bg-black border border-white/20 rounded-full flex items-center justify-center mb-8 group-hover:border-purple-500/50 transition-colors relative">
                  <span className="text-sm font-mono text-white">
                    {step.num}
                  </span>
                  <div className="absolute inset-0 rounded-full border border-purple-500/30 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500"></div>
                  {step.active && (
                    <div className="absolute w-2 h-2 bg-purple-500 rounded-full top-0 right-0 animate-pulse"></div>
                  )}
                </div>
                <h4 className="text-lg text-white font-medium mb-3">
                  {step.title}
                </h4>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
