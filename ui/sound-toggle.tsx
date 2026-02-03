"use client";

import { useSound } from "./providers/sound-provider";

export function SoundToggle() {
  const { muted, toggleMuted, ready } = useSound();

  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={toggleMuted}
      disabled={!ready}
      aria-pressed={!muted}
      aria-label={muted ? "Enable ambient sound" : "Mute ambient sound"}
    >
      <span
        className={
          "sound-indicator " + (muted ? "sound-indicator-muted" : "")
        }
      />
      <span>{ready ? (muted ? "Sound off" : "Sound on") : "Tap to enable audio"}</span>
    </button>
  );
}

