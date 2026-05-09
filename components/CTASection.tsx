"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";

export function CTASection() {
  const { isSignedIn } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="py-32 bg-black border-b border-white/5 relative">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="relative z-10 w-full bg-black border border-white/10 rounded-3xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center group isolate">
          {/* Background Effects */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[80px] mix-blend-screen animate-pulse"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center p-8 md:p-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 border border-purple-500/20 rounded-full bg-purple-900/10 backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-[10px] font-mono text-purple-200 uppercase tracking-widest">Now in Beta</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 leading-[0.9]">
              Ready to go
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-500">
                viral?
              </span>
            </h2>

            <p className="text-neutral-400 text-lg font-light leading-relaxed max-w-lg mb-12">
              Join thousands of creators already generating viral shorts with AI.
              Your first 5 shorts are completely free — no credit card required.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {!isMounted ? (
                <button className="shiny-cta opacity-50 cursor-not-allowed" disabled>
                   <span>Loading...</span>
                </button>
              ) : !isSignedIn ? (
                <SignInButton forceRedirectUrl="/new">
                  <button className="shiny-cta cursor-pointer" suppressHydrationWarning>
                    <span>Start Creating Free</span>
                  </button>
                </SignInButton>
              ) : (
                <Link href="/new" className="shiny-cta" suppressHydrationWarning>
                  <span>Create a Short Now</span>
                </Link>
              )}

              <Link
                href="#features"
                className="group text-xs font-mono text-neutral-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
                suppressHydrationWarning
              >
                See all features
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
