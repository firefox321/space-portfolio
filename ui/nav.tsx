"use client";

import { useCallback, useState } from "react";
import { useLenis } from "./providers/smooth-scroll-provider";
import { SoundToggle } from "./sound-toggle";
import { useSound } from "./providers/sound-provider";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" }
];

export function Nav() {
  const lenis = useLenis();
  const { playClick, playHover } = useSound();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const target = el.offsetTop - 70;
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
      setIsMobileMenuOpen(false);
    },
    [lenis]
  );

  const toggleMobileMenu = useCallback(() => {
    playClick();
    setIsMobileMenuOpen(prev => !prev);
  }, [playClick]);

  return (
    <div className="nav-shell" aria-label="Primary navigation">
      <div className="nav-inner">
        <div className="nav-logo" aria-label="Brand">
          <div className="nav-logo-mark" />
          <span>Bharat&nbsp;Gupta</span>
        </div>
        
        {/* Mobile Hamburger Menu */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`nav-links ${isMobileMenuOpen ? 'nav-links-open' : ''}`} aria-label="Section navigation">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              className="nav-link"
              type="button"
              onClick={() => {
                playClick();
                scrollTo(item.id);
              }}
              onMouseEnter={playHover}
            >
              {item.label}
            </button>
          ))}
        </nav>
        
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span className="nav-sound-toggle">
            <SoundToggle />
          </span>
        </div>
      </div>
    </div>
  );
}

