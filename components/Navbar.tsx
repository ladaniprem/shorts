"use client";

import Link from "next/link";
import NextImage from "next/image";
import { SignInButton, useAuth } from "@clerk/nextjs";
import UserDropdown from "./UserProfileButton";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <>
      <div className="fixed z-50 flex w-full top-6 px-6 justify-center">
        <nav className="flex w-full max-w-[1400px] mx-auto items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* AI Shorts Premium Logo */}
            <div className="relative w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
               <NextImage 
                src="/ai-shorts-logo.png" 
                alt="AI Shorts Logo" 
                width={44} 
                height={44} 
                className="object-contain"
              />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-foreground uppercase">
              AI Shorts
            </span>
          </Link>

          {/* Desktop Menu - "Clear Border" Aesthetic */}
          <div className="hidden md:flex items-center gap-1 backdrop-blur-2xl bg-background/40 border border-border rounded-full p-1.5 pr-2 shadow-sm">
            <Link href="#features" className="px-5 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 text-[11px] font-medium transition-all tracking-wide">
              Features
            </Link>
            <Link href="#how-it-works" className="px-5 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 text-[11px] font-medium transition-all tracking-wide">
              How it Works
            </Link>
            <Link href="#tech" className="px-5 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 text-[11px] font-medium transition-all tracking-wide">
              Tech Stack
            </Link>
            <Link href="#pricing" className="px-5 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 text-[11px] font-medium transition-all tracking-wide">
              Pricing
            </Link>

            <div className="mx-2">
              <ModeToggle />
            </div>

            {!isSignedIn ? (
              <SignInButton mode="redirect" forceRedirectUrl="/new">
                <button className="px-5 py-2 rounded-full bg-white text-black text-[11px] font-semibold tracking-wide hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all cursor-pointer">
                  Get Started
                </button>
              </SignInButton>
            ) : (
              <>
                <Link href="/new" className="px-5 py-2 rounded-full bg-white text-black text-[11px] font-semibold tracking-wide hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all">
                  Create Short
                </Link>
                <div className="ml-2">
                  <UserDropdown />
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center gap-2 text-[11px] font-medium text-white uppercase tracking-wider hover:opacity-70 transition-opacity z-50 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
            <span className="text-neutral-500">{isMobileMenuOpen ? "×" : "+"}</span>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-neutral-300 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-neutral-300 hover:text-white transition-colors">How it Works</Link>
            <Link href="#tech" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-neutral-300 hover:text-white transition-colors">Tech Stack</Link>
            <Link href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-neutral-300 hover:text-white transition-colors">Pricing</Link>
            <div className="w-full h-px bg-white/10 my-2" />
            {!isSignedIn ? (
              <SignInButton mode="redirect" forceRedirectUrl="/new">
                <button className="w-full py-3 rounded-full bg-white text-black font-semibold tracking-wide hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all">
                  Get Started Free
                </button>
              </SignInButton>
            ) : (
              <>
                <Link href="/new" className="w-full py-3 rounded-full bg-white text-black font-semibold text-center tracking-wide hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all">
                  Create Short
                </Link>
                <div className="mt-4"><UserDropdown /></div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
