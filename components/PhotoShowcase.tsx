"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    title: "Cinematic City",
  },
  {
    url: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=2564&auto=format&fit=crop",
    title: "AI Future",
  },
  {
    url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop",
    title: "Abstract Flow",
  },
  {
    url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2670&auto=format&fit=crop",
    title: "Cyberpunk",
  },
  {
    url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2664&auto=format&fit=crop",
    title: "Digital Art",
  },
  {
    url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2574&auto=format&fit=crop",
    title: "Neon Pulse",
  },
  {
    url: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2664&auto=format&fit=crop",
    title: "Gradient Sky",
  },
  {
    url: "https://images.unsplash.com/photo-1642543492481-44e81e3f9a70?q=80&w=2670&auto=format&fit=crop",
    title: "AI Network",
  },
  {
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop",
    title: "Tech Core",
  },
  {
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2535&auto=format&fit=crop",
    title: "Vibrant Mesh",
  },
];

export function PhotoShowcase() {
  return (
    <section className="py-24 overflow-hidden bg-black">
      <div className="max-w-[1400px] mx-auto px-6 mb-12">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
          Generated with <span className="text-purple-500">Shorts AI</span>
        </h2>
        <p className="text-neutral-400 font-light max-w-lg">
          High-fidelity visuals generated in seconds. From prompts to viral-ready content.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <motion.div
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="flex gap-6 pr-6"
        >
          {[...images, ...images].map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-[300px] h-[450px] rounded-2xl overflow-hidden border border-white/10 group"
            >
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-mono text-xs uppercase tracking-widest">
                  {image.title}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
