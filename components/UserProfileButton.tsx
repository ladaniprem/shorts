"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function UserDropdown() {
  const { signOut, openUserProfile } = useClerk();
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isLoaded || !user) return null;

  return (
    <div ref={ref} className="relative">
      {/* Avatar trigger */}
      <button 
        onClick={() => setOpen(!open)}
        className="relative group transition-transform active:scale-95"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
        <NextImage
          src={user.imageUrl}
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full mt-1 border border-white/10 group-hover:border-white/20 transition-all relative z-10"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-[280px] rounded-[24px] bg-[#050505] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 z-[100] backdrop-blur-xl"
          >
            {/* User info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
               <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full blur-md" />
                <NextImage
                  src={user.imageUrl}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full border border-white/20 relative z-10"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-sm font-semibold truncate">
                  {user.fullName}
                </p>
                <p className="text-neutral-500 text-[11px] truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  openUserProfile();
                  setOpen(false);
                }}
                className="flex items-center gap-3 w-full p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">Account Settings</span>
              </button>

              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="flex items-center gap-3 w-full p-2.5 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-red-500/10 transition-all">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium">Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
