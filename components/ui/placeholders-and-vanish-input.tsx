"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  char: string;
  opacity: number;
  vx: number;
  vy: number;
};

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (placeholders.length <= 1 || value || animating) return;

    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [placeholders.length, value, animating]);

  const setupCanvas = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = inputRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  const drawText = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setupCanvas();

    const rect = inputRef.current.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!value || animating) return;

    const inputStyles = window.getComputedStyle(inputRef.current);
    const fontSize = inputStyles.fontSize || "16px";
    const fontFamily = inputStyles.fontFamily || "sans-serif";
    const paddingLeft = parseFloat(inputStyles.paddingLeft || "16") || 16;
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.fillStyle = inputStyles.color || "#000";
    ctx.textBaseline = "middle";
    ctx.fillText(value, paddingLeft, rect.height / 2);
  }, [animating, setupCanvas, value]);

  useEffect(() => {
    drawText();
  }, [drawText]);

  useEffect(() => {
    const handleResize = () => {
      drawText();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [drawText]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startVanishAnimation = useCallback(() => {
    if (!inputRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setupCanvas();

    const rect = inputRef.current.getBoundingClientRect();
    const inputStyles = window.getComputedStyle(inputRef.current);
    const fontSize = inputStyles.fontSize || "16px";
    const fontFamily = inputStyles.fontFamily || "sans-serif";
    const paddingLeft = parseFloat(inputStyles.paddingLeft || "16") || 16;
    const fontPx = parseFloat(fontSize) || 16;

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.textBaseline = "middle";

    let xCursor = paddingLeft;
    const { value } = inputRef.current;

    particlesRef.current = value.split("").map((char) => {
      const width = ctx.measureText(char).width;
      const particle: Particle = {
        x: xCursor,
        y: rect.height / 2,
        char,
        opacity: 1,
        vx: (Math.random() - 0.5) * 2,
        vy: -(0.4 + Math.random() * 1.4),
      };
      xCursor += width;
      return particle;
    });

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = `${fontSize} ${fontFamily}`;
      ctx.fillStyle = inputStyles.color || "#000";
      ctx.textBaseline = "middle";

      particlesRef.current = particlesRef.current
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          opacity: particle.opacity - 0.02,
        }))
        .filter((particle) => particle.opacity > 0);

      for (const particle of particlesRef.current) {
        ctx.globalAlpha = particle.opacity;
        ctx.fillText(particle.char, particle.x, particle.y);
      }
      ctx.globalAlpha = 1;

      if (particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setValue("");
        setAnimating(false);
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    if (fontPx > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [setupCanvas]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim() || animating) return;
    setAnimating(true);
    if (onSubmit) {
      onSubmit(e);
    }

    startVanishAnimation();
  };

  return (
    <form
      className={cn(
        "w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
        value && "bg-gray-50"
      )}
      onSubmit={handleSubmit}
    >
      <canvas
        className={cn(
          "absolute inset-0 z-50 pointer-events-none rounded-full transition-opacity duration-150",
          !animating ? "opacity-0" : "opacity-100"
        )}
        ref={canvasRef}
      />
      <input
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            if (onChange) {
              onChange(e);
            }
          }
        }}
        ref={inputRef}
        value={value}
        type="text"
        className={cn(
          "w-full relative text-sm sm:text-base z-30 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20",
          animating && "text-transparent dark:text-transparent caret-transparent"
        )}
      />

      <button
        disabled={!value.trim() || animating}
        type="submit"
        className="absolute right-2 top-1/2 z-[60] -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300 h-4 w-4"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            d="M5 12l14 0"
            initial={{
              strokeDasharray: "50%",
              strokeDashoffset: "50%",
            }}
            animate={{
              strokeDashoffset: value ? 0 : "50%",
            }}
            transition={{
              duration: 0.3,
              ease: "linear",
            }}
          />
          <path d="M13 18l6 -6" />
          <path d="M13 6l6 6" />
        </motion.svg>
      </button>

      <div className="absolute inset-0 z-20 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-10 text-left w-[calc(100%-2rem)] truncate"
            >
              {placeholders[currentPlaceholder] ?? "Type your prompt..."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
