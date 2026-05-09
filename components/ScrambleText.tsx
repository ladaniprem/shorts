"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  speed?: number;
  revealSpeed?: number;
  className?: string;
  animateOnMount?: boolean;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

export function ScrambleText({
  text,
  speed = 30,
  revealSpeed = 0.33,
  className = "",
  animateOnMount = true,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    let iteration = 0;
    
    if (animationRef.current) clearInterval(animationRef.current);

    animationRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (animationRef.current) clearInterval(animationRef.current);
        setIsAnimating(false);
      }

      iteration += revealSpeed;
    }, speed);
  }, [text, speed, revealSpeed, isAnimating]);

  useEffect(() => {
    if (animateOnMount) {
      scramble();
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  return (
    <span 
      className={className} 
      onMouseEnter={scramble}
      data-scramble="true"
    >
      {displayText}
    </span>
  );
}
