"use client";

import {
  Wand2,
  Subtitles,
  Film,
  TrendingUp,
  Mic,
  Share2,
} from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "AI Script Generation",
    color: "purple",
    items: [
      { name: "Prompt → Full Script", num: "01" },
      { name: "Tone & Style Control", num: "02" },
      { name: "Hook Optimization", num: "03" },
    ],
  },
  {
    icon: Subtitles,
    title: "Auto Subtitles",
    color: "blue",
    items: [
      { name: "Word-Level Accuracy", num: "04" },
      { name: "Animated Captions", num: "05" },
      { name: "Multi-language Support", num: "06" },
    ],
  },
  {
    icon: Film,
    title: "Dynamic B-Roll",
    color: "emerald",
    items: [
      { name: "AI Scene Matching", num: "07" },
      { name: "Stock Library Access", num: "08" },
      { name: "Smart Transitions", num: "09" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Viral Trend Analysis",
    color: "orange",
    items: [
      { name: "Real-time Trend Data", num: "10" },
      { name: "Platform-specific Tips", num: "11" },
      { name: "Hashtag Generator", num: "12" },
    ],
  },
  {
    icon: Mic,
    title: "AI Voiceover",
    color: "pink",
    items: [
      { name: "20+ Voice Styles", num: "13" },
      { name: "Emotion & Pacing", num: "14" },
      { name: "Custom Voice Clone", num: "15" },
    ],
  },
  {
    icon: Share2,
    title: "One-click Publish",
    color: "cyan",
    items: [
      { name: "YouTube Shorts", num: "16" },
      { name: "TikTok & Instagram", num: "17" },
      { name: "4K HD Export", num: "18" },
    ],
  },
];

const colorMap: Record<string, string> = {
  purple: "via-purple-500/50",
  blue: "via-blue-500/50",
  emerald: "via-emerald-500/50",
  orange: "via-orange-500/50",
  pink: "via-pink-500/50",
  cyan: "via-cyan-500/50",
};

const colorHoverMap: Record<string, string> = {
  purple: "group-hover:text-purple-400",
  blue: "group-hover:text-blue-400",
  emerald: "group-hover:text-emerald-400",
  orange: "group-hover:text-orange-400",
  pink: "group-hover:text-pink-400",
  cyan: "group-hover:text-cyan-400",
};

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-b border-white/5 bg-black py-32 relative"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-24">
          <div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase mb-4">
              01 — Capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white max-w-2xl leading-[1.05]">
              Everything you need to create
              <br />
              <span className="text-neutral-600">viral content</span>{" "}
              at scale.
            </h2>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-[10px] font-mono text-neutral-500 uppercase mb-1">
              Engine
            </div>
            <div className="text-white font-mono text-sm">AI Shorts v1.0</div>
          </div>
        </div>

        {/* Features Grid - "Clear Border" Aesthetic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/15 border border-white/20 overflow-hidden spotlight-grid rounded-none shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-black p-10 hover:bg-neutral-900/40 transition-all duration-500 relative spotlight-card backdrop-blur-md"
              >
                <div
                  className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${
                    colorMap[feature.color]
                  } to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
                ></div>
                {/* Glowing border effect */}
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-all duration-500" />
                
                <div
                  className={`mb-8 text-neutral-700 ${
                    colorHoverMap[feature.color]
                  } transition-colors`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-white mb-6">
                  {feature.title}
                </h3>
                <ul className="space-y-4">
                  {feature.items.map((item) => (
                    <li
                      key={item.num}
                      className="flex justify-between text-sm text-neutral-500 group-hover:text-white transition-colors border-b border-white/5 pb-2"
                    >
                      <span>{item.name}</span>
                      <span className="font-mono text-[10px]">{item.num}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
