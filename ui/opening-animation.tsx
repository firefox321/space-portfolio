"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";

gsap.registerPlugin();

export function OpeningAnimation({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    gsap.set(el, {
      opacity: 0,
      y: 24,
      scale: 0.98
    });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    tl.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.1,
      ease: "power3.out"
    });
  }, []);

  return (
    <div ref={wrapperRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
