"use client";

import { useSound } from "../providers/sound-provider";

const PROJECTS = [
  {
    title: "Cinematic Portfolio",
    role: "Full‑stack",
    description:
      "A dark, motion‑driven personal site with 3D hero, smooth scroll and ambient sound design.",
    stack: ["Next.js", "React", "Three.js", "GSAP"],
    year: "2026"
  }
  ,
  {
    title: "Login-Signup",
    role: "Backend",
    description:
      "A Simple Login Signup application for seamless experience and backend learning .",
    stack: ["Spring Boot", "MySQL", "Redis"],
    year: "2025"
  },
  {
    title: "PDF-Converter",
    role: "Frontend‑leaning",
    description:
      "A Web application for conversion of PDF to docs Files  or Vice-versa .",
    stack: ["React", "JavaScript", "Postman"],
    year: "2024"
  }
];

export function ProjectsSection() {
  const { playHover, playClick } = useSound();

  return (
    <section id="projects" className="section">
      <div className="section-heading">
        <span className="section-kicker">Selected work</span>
        <h2 className="section-title">Projects</h2>
      </div>
      <p className="section-body">
        A small selection of personal work and experiments that reflect how I think about
        architecture, user experience and implementation details across the stack.
      </p>
      <div className="projects-grid">
        {PROJECTS.map((project) => (
          <article
            key={project.title}
            className="project-card"
            onMouseEnter={playHover}
            onClick={playClick}
          >
            <div className="project-label">{project.role}</div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            <div className="project-meta">
              <div className="project-tags">
                {project.stack.map((tag) => (
                  <span key={tag} className="project-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
              <span>{project.year}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

