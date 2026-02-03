"use client";

import { useEffect, useState } from "react";

type Pos = { x: number; y: number };

export function CustomCursor() {
  const [pos, setPos] = useState<Pos>({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState<Pos>({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setPos({ x, y });
      setRingPos((prev) => ({
        x: prev.x + (x - prev.x) * 0.18,
        y: prev.y + (y - prev.y) * 0.18
      }));

      const target = e.target as HTMLElement | null;
      const interactive =
        target?.closest(
          "button, a, [role='button'], .project-card, .skill-card-inner, .sound-toggle"
        ) != null;
      setActive(interactive);
    };

    const down = () => setActive(true);
    const up = () => setActive(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <>
      <div
        className={`cursor-dot ${active ? "cursor-dot-active" : ""}`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
        }}
      />
      <div
        className={`cursor-ring ${active ? "cursor-ring-active" : ""}`}
        style={{
          transform: `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
        }}
      />
    </>
  );
}

