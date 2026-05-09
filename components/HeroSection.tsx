"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { ScrambleText } from "@/components/ScrambleText";
import { MagneticButton } from "@/components/MagneticButton";

export function HeroSection() {
  const { isSignedIn } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-40 pt-32 border-b border-border">
      <div className="max-w-5xl">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-3 px-3 py-1.5 mb-10 border border-border rounded-full bg-accent/5 backdrop-blur-sm animate-in-view">
          <div className="flex items-center gap-2 px-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-[10px] font-mono text-purple-500 uppercase tracking-widest">
              <ScrambleText text="AI-Powered" speed={50} />
            </span>
          </div>
          <div className="h-3 w-px bg-border"></div>
          <span className="text-[10px] text-muted-foreground font-mono">v1.0.0</span>
        </div>

        {/* Main Heading */}
        <h1 className="animate-in-view animate-delay-100 text-6xl md:text-8xl lg:text-[7rem] font-medium tracking-tighter text-foreground leading-[0.9] mb-12">
          Create Viral
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground via-purple-500 to-purple-800">
            <ScrambleText text="Shorts, with AI." speed={60} revealSpeed={0.1} />
          </span>
        </h1>

        {/* Subtitle and CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 animate-in-view animate-delay-200">
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed font-light">
            The ultimate AI-powered short video generator. Transform long-form
            content or a simple prompt into high-engagement shorts for YouTube,
            TikTok, and Instagram — in seconds.
          </p>

          <div className="flex items-center gap-6">
            {!isMounted ? (
              <MagneticButton>
                <button className="px-8 py-4 bg-foreground text-background text-xs font-bold tracking-widest uppercase opacity-50 cursor-not-allowed">
                  Loading...
                </button>
              </MagneticButton>
            ) : !isSignedIn ? (
              <SignInButton forceRedirectUrl="/new">
                <MagneticButton>
                  <button 
                    className="group relative px-8 py-4 bg-foreground text-background text-xs font-bold tracking-widest uppercase overflow-hidden hover:opacity-90 transition-all duration-300 cursor-pointer flex items-center gap-2"
                    suppressHydrationWarning
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Start Creating
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </MagneticButton>
              </SignInButton>
            ) : (
              <Link href="/new" suppressHydrationWarning>
                <MagneticButton>
                  <div
                    className="group relative px-8 py-4 bg-foreground text-background text-xs font-bold tracking-widest uppercase overflow-hidden hover:opacity-90 transition-all duration-300 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Create a Short
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </MagneticButton>
              </Link>
            )}
            <div className="h-px w-12 bg-border"></div>
            <span className="text-[10px] font-mono text-muted-foreground" suppressHydrationWarning>SCROLL TO EXPLORE</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 flex flex-wrap gap-8 animate-in-view animate-delay-300">
          {[
            { label: "Shorts Generated", value: "10,000+" },
            { label: "Avg. Generation Time", value: "< 60s" },
            { label: "Supported Platforms", value: "3+" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-2xl font-medium text-foreground tracking-tight">{stat.value}</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
