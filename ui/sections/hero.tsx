 "use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSound } from "../providers/sound-provider";

gsap.registerPlugin(ScrollTrigger);

function HeroCopy() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
      });

      tl.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        filter: "blur(6px)"
      })
        .from(
          subtitleRef.current,
          {
            y: 28,
            opacity: 0,
            duration: 0.8
          },
          "-=0.5"
        )
        .from(
          metaRef.current?.children || [],
          {
            y: 18,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6
          },
          "-=0.5"
        );

      ScrollTrigger.create({
        trigger: "#about",
        start: "top 80%",
        animation: gsap.from("#about", {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out"
        }),
        once: true
      });
    });

    return () => ctx.revert();
  }, []);

  const { playClick } = useSound();

  return (
    <div className="hero-copy">
      <div className="hero-avatar">
        <img
          src="/photo.png"
          alt="Portrait of Bharat Gupta"
          className="hero-avatar-img"
        />
      </div>
      <div className="tag">
        <span className="tag-dot" />
        <span>Full‑stack engineer & creative builder</span>
      </div>
      <h1 ref={titleRef} className="hero-title">
        Hi, I&apos;m <span>Bharat&nbsp;Gupta</span>. I design and build cinematic,
        performant web experiences.
      </h1>
      <p ref={subtitleRef} className="hero-subtitle">
        A BCA graduate who loves turning ideas into clean, functional digital products.
        I care about performance, detail and experiences that feel{" "}
        <strong>smooth, minimal and intentional</strong>.
      </p>
      <div ref={metaRef} className="hero-meta">
        <span>
          <strong>Stack:</strong> TypeScript, React, Next.js, Node, SQL /{" "}
          NoSQL
        </span>
        <span>
          <strong>Focus:</strong> Frontend craft, APIs, clean architecture
        </span>
      </div>
      <div className="hero-actions">
        <button
          type="button"
          className="btn"
          onClick={() => {
            playClick();
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          View selected work
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            playClick();
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Contact me
        </button>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" aria-label="Home" className="section">
      <div className="hero-grid">
        <HeroCopy />
        <div className="hero-photo-shell glass-panel">
          <div className="hero-photo-inner">
            <img
              src="/photo.png"
              alt="Portrait of Bharat Gupta"
              className="hero-photo-img"
            />
            <div className="hero-photo-overlay" />
            <div className="hero-stats">
              <div>
                <div className="hero-stat-label">Role</div>
                <div className="hero-stat-value">Full‑stack / Frontend‑leaning</div>
              </div>
              <div>
                <div className="hero-stat-label">Focus</div>
                <div className="hero-stat-value">Web apps · Interfaces · APIs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

