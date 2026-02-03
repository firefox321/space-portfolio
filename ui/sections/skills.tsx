 "use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSound } from "../providers/sound-provider";

gsap.registerPlugin(ScrollTrigger);

const CORE_SKILLS = [
  { label: "TypeScript", level: "Strong", focus: "Typed frontend & APIs" },
  { label: "React / Next.js", level: "Strong", focus: "App router, SSR, SPA UX" },
  { label: "Node / Express", level: "Comfortable", focus: "REST, services, tooling" }
];

const UI_SKILLS = [
  { label: "Three.js", level: "Comfortable", focus: "Interactive 3D & WebGL" },
  { label: "GSAP / Framer Motion", level: "Comfortable", focus: "Motion & transitions" },
  { label: "CSS Architecture", level: "Strong", focus: "Layouts, themes, systems" }
];

const BACKEND_SKILLS = [
  { label: "Spring Boot", level: "Comfortable", focus: "APIs & services" },
  { label: "SQL / NoSQL", level: "Comfortable", focus: "Schema design & queries" },
  { label: "Auth & Security", level: "Growing", focus: "Sessions, JWT, hardening" }
];

type SkillCardProps = {
  title: string;
  items: { label: string; level: string; focus: string }[];
};

function SkillCard({ title, items }: SkillCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { playHover, playClick } = useSound();

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const handleMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = -((y / rect.height) - 0.5) * 10;
      const ry = ((x / rect.width) - 0.5) * 12;

      gsap.to(el, {
        rotationX: rx,
        rotationY: ry,
        transformPerspective: 900,
        transformOrigin: "center center",
        duration: 0.4,
        ease: "power3.out"
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        rotationX: 8,
        rotationY: -10,
        duration: 0.5,
        ease: "power3.out"
      });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("mouseenter", playHover);

    // initial subtle tilt
    gsap.set(el, { rotationX: 8, rotationY: -10, transformPerspective: 900 });

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("mouseenter", playHover);
    };
  }, []);

  return (
    <article className="skill-card">
      <div className="skill-card-inner" ref={cardRef}>
        <header className="skill-card-header">
          <h3 className="skill-card-title">{title}</h3>
        </header>
        <ul className="skill-list">
          {items.map((item) => (
            <li key={item.label} className="skill-list-item">
              <div className="skill-list-main">
                <span className="skill-chip">{item.label}</span>
                <span className="skill-level">{item.level}</span>
              </div>
              <p className="skill-focus">{item.focus}</p>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function SkillsSection() {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".skill-card-inner");
      if (!cards.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true
        }
      });

      tl.from(cards, {
        y: 40,
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.12,
        duration: 0.5,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="section" aria-label="Skills" ref={containerRef}>
      <div className="section-heading">
        <span className="section-kicker">Skills</span>
        <h2 className="section-title">Full‑stack toolkit</h2>
      </div>
      <p className="section-body">
        A mix of frontend craft, backend fundamentals and architectural thinking. These
        are the tools I reach for most when building reliable, cinematic web products.
      </p>
      <div className="skills-3d-grid">
        <SkillCard title="Frontend & Product" items={CORE_SKILLS} />
        <SkillCard title="Interaction & 3D" items={UI_SKILLS} />
        <SkillCard title="Backend & Systems" items={BACKEND_SKILLS} />
      </div>
    </section>
  );
}

