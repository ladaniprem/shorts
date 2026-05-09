"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { AuraBackground } from "@/components/AuraBackground";
import { ScrambleText } from "@/components/ScrambleText";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden relative selection:bg-purple-500 selection:text-white">
      {/* Background */}
      <AuraBackground />
      <div className="fixed inset-0 pointer-events-none z-0 technical-grid opacity-30"></div>

      {/* Subtle background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="mb-8 p-8 bg-purple-900/10 rounded-3xl ring-1 ring-purple-500/20 shadow-2xl backdrop-blur-xl group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
            <FileQuestion className="w-16 h-16 text-purple-400 relative z-10" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl sm:text-[10rem] font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 mb-4 leading-none"
        >
          <ScrambleText text="404" speed={50} revealSpeed={0.1} />
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-medium tracking-tight mb-6 text-neutral-300"
        >
          System Error: Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-neutral-500 text-lg mb-12 max-w-md font-light leading-relaxed"
        >
          The coordinate you requested does not exist in our neural network. 
          It may have been purged or relocated.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all gap-2"
          >
            <Home className="w-4 h-4" />
            Restore Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-white/10 bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all gap-2 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" />
            Previous Node
          </button>
        </motion.div>
      </div>

      {/* Decorative lines (Grid influence) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]">
        <div className="absolute left-[10%] top-0 w-px h-full bg-white/10"></div>
        <div className="absolute left-[30%] top-0 w-px h-full bg-white/10"></div>
        <div className="absolute left-[70%] top-0 w-px h-full bg-white/10"></div>
        <div className="absolute left-[90%] top-0 w-px h-full bg-white/10"></div>
      </div>
    </div>
  );
}
