"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function RevealOnScroll({ children, className, delay = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            timeoutRef.current = setTimeout(() => setRevealed(true), delay);
            break;
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "reveal transition-all duration-700 ease-out",
        revealed && "revealed",
        className
      )}
    >
      {children}
    </div>
  );
}
