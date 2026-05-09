import { SignUp } from "@clerk/nextjs";
import NextImage from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* Left Side: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 border-right border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <NextImage src="/ai-shorts-logo.png" alt="Logo" width={48} height={48} />
          <span className="text-xl font-bold tracking-[0.3em] text-white uppercase">AI Shorts</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Content Empire</span> Today
          </h1>
          <p className="text-neutral-400 text-lg">
            Unlock the power of automated short-form video. One account, infinite reach across all platforms.
          </p>
        </div>

        <div className="relative z-10 flex gap-8 text-neutral-500 text-sm">
          <span>© 2026 AI Shorts</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-emerald-900/10 via-black to-blue-900/10" />
        
        <div className="w-full max-w-md relative z-10">
          {/* Centered Logo for Mobile/Small Screens */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <NextImage src="/ai-shorts-logo.png" alt="Logo" width={64} height={64} />
            <h2 className="text-2xl font-bold text-white mt-4 tracking-widest uppercase">AI Shorts</h2>
          </div>

          <div className="rounded-[32px] border border-white/15 bg-white/[0.02] backdrop-blur-3xl shadow-2xl overflow-hidden p-1">
            <SignUp 
              routing="path" 
              path="/sign-up" 
              signInUrl="/sign-in"
              forceRedirectUrl="/new"
            />
          </div>
        </div>
      </div>
    </div>
  );
}