"use client";
import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Cover = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      setRect(containerRef.current.getBoundingClientRect());
    }
  }, []);

  return (
    <div
      onMouseEnter={() => { setHovered(true); }}
      onMouseLeave={() => { setHovered(false); }}
      ref={containerRef}
      className={cn(
        "relative inline-block px-2 py-0.5 transition duration-200 group/cover text-white",
        className
      )}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.2 },
            }}
            className="h-full w-full absolute inset-0 bg-neutral-900 group-hover/cover:bg-neutral-800 transition duration-200"
          >
            <Sparkles />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="relative z-10">{children}</span>
    </div>
  );
};

const Sparkles = () => {
  const id = useId();
  const sparkles = [
    { left: "10%", top: "10%", duration: 2 },
    { left: "20%", top: "40%", duration: 3 },
    { left: "40%", top: "20%", duration: 2.5 },
    { left: "70%", top: "60%", duration: 4 },
    { left: "80%", top: "30%", duration: 2 },
    { left: "30%", top: "80%", duration: 3.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {sparkles.map((sparkle, i) => (
        <motion.span
          key={`sparkle-${id}-${i}`}
          animate={{
            top: ["10%", "90%", "10%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: sparkle.left,
            top: sparkle.top,
          }}
          className="absolute w-1 h-1 bg-white rounded-full z-0"
        />
      ))}
    </div>
  );
};
