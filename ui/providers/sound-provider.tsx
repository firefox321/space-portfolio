"use client";

import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

type SoundContextValue = {
  muted: boolean;
  toggleMuted: () => void;
  playClick: () => void;
  playHover: () => void;
  ready: boolean;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const ambienceRef = useRef<Howl | null>(null);
  const clickRef = useRef<Howl | null>(null);
  const hoverRef = useRef<Howl | null>(null);
  const hasGestureRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onFirstInteraction = () => {
      if (hasGestureRef.current) return;
      hasGestureRef.current = true;

      ambienceRef.current = new Howl({
        src: ["/audio/ambience.mp3"],
        loop: true,
        volume: 0.5
      });

      clickRef.current = new Howl({
        src: ["/audio/click.mp3"],
        volume: 0.35
      });

      hoverRef.current = new Howl({
        src: ["/audio/hover.mp3"],
        volume: 0.2
      });

      setReady(true);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };

    window.addEventListener("pointerdown", onFirstInteraction, { once: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      ambienceRef.current?.unload();
      clickRef.current?.unload();
      hoverRef.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (!ready || !ambienceRef.current) return;
    if (muted) {
      ambienceRef.current.fade(0.3, 0, 200);
      setTimeout(() => ambienceRef.current?.pause(), 220);
    } else {
      if (!ambienceRef.current.playing()) {
        ambienceRef.current.volume(0);
        ambienceRef.current.play();
      }
      ambienceRef.current.fade(0, 0.3, 260);
    }
  }, [muted, ready]);

  const toggleMuted = () => {
    setMuted((m) => !m);
    if (clickRef.current && !muted) {
      clickRef.current.play();
    }
  };

  const playClick = () => {
    if (!muted && clickRef.current) {
      clickRef.current.play();
    }
  };

  const playHover = () => {
    if (!muted && hoverRef.current) {
      hoverRef.current.play();
    }
  };

  return (
    <SoundContext.Provider value={{ muted, toggleMuted, playClick, playHover, ready }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return ctx;
}

