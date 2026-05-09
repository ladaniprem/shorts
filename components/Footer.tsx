"use client";

import Link from "next/link";
import { useState } from "react";
import { TextHoverEffect } from "@/components/hover-text-effect";
import { ContactModal } from "@/components/ContactModal";

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer className="relative bg-black pt-32 pb-12 border-t border-white/10 overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 h-[20vw] md:h-[15vw]">
          <div className="w-full h-full -ml-8">
            <TextHoverEffect text="AI SHORTS" />
          </div>
          <div className="flex flex-col gap-4 text-right mb-12 md:mb-4 mt-8 md:mt-0 whitespace-nowrap">

            <Link
              href="/new"
              className="text-lg text-neutral-400 hover:text-white transition-colors"
            >
              Create a Short →
            </Link>
            <div className="text-sm text-neutral-600">
              Powered by AI • Built for Creators
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10">
          <div>
            <h4 className="text-[10px] font-mono uppercase text-neutral-500 mb-4">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#tech" className="hover:text-white transition-colors">
                  Tech Stack
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-mono uppercase text-neutral-500 mb-4">
              Platforms
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  YouTube Shorts
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  TikTok
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Instagram Reels
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-mono uppercase text-neutral-500 mb-4">
              Connect
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link
                  href="https://x.com/"
                  className="hover:text-white transition-colors"
                >
                  Twitter / X
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setContactOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                  suppressHydrationWarning
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          <div className="md:text-right">
            <p className="text-[10px] font-mono uppercase text-neutral-600">
              System Status:{" "}
              <span className="text-purple-400">Operational</span>
            </p>
            <p className="text-[10px] font-mono uppercase text-neutral-600 mt-1">
              © 2026 AI Shorts. All rights reserved.
            </p>
            <p className="text-[10px] font-mono uppercase text-neutral-600 mt-1">
              Built with ❤️ using Next.js & AI
            </p>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        defaultSubject="General inquiry"
      />
    </footer>
  );
}
