"use client";

import { CheckCircle, Zap, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { AuraBackground } from "@/components/AuraBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { ScrambleText } from "@/components/ScrambleText";

function SuccessContent() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkoutId");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900/40 border border-white/10 backdrop-blur-2xl p-10 md:p-16 rounded-[40px] max-w-2xl w-full relative overflow-hidden group shadow-2xl"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>

      {/* Success Icon */}
      <div className="mb-10 flex justify-center">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center ring-1 ring-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <CheckCircle className="w-12 h-12 text-emerald-500 animate-[bounce_2s_infinite]" />
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-medium text-white mb-6 tracking-tight leading-none">
          <ScrambleText text="You're all set!" speed={40} revealSpeed={0.2} />
        </h1>

        <p className="text-neutral-400 text-lg mb-10 leading-relaxed font-light">
          Your <span className="text-white font-medium">Pro Subscription</span> is now active. 
          Unleash the full power of AI with unlimited 4K shorts, 
          premium voiceovers, and zero watermarks.
        </p>

        {checkoutId && (
          <div className="mb-10 p-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm group-hover:border-white/10 transition-colors">
            <p className="text-[10px] text-neutral-500 font-mono mb-2 uppercase tracking-widest flex items-center justify-center gap-2">
              <Zap className="w-3 h-3 text-emerald-400" />
              Transaction Coordinate
            </p>
            <p className="text-xs text-neutral-300 font-mono break-all">{checkoutId}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/new"
            className="flex-1 flex items-center justify-center py-5 bg-white text-black rounded-2xl font-bold tracking-widest text-xs uppercase hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1"
          >
            <Play className="w-4 h-4 mr-2 fill-black" />
            Start Creating
          </Link>
          <Link
            href="/settings"
            className="flex-1 flex items-center justify-center py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-bold tracking-widest text-xs uppercase hover:bg-white/10 transition-all gap-2"
          >
            Manage Billing
            <ArrowRight className="w-4 h-4 text-neutral-500" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <div className="relative min-h-screen dark bg-black noise-overlay font-sans text-neutral-200 overflow-x-hidden">
      {/* Background */}
      <AuraBackground />
      <div className="fixed inset-0 pointer-events-none z-0 technical-grid opacity-30"></div>

      <Navbar />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-32 overflow-hidden">
        {/* Subtle Side Glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <Suspense fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Validating Protocol...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
