export function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="grid-2">
        <div>
          <div className="section-heading">
            <span className="section-kicker">About</span>
            <h2 className="section-title">Who I am</h2>
          </div>
          <p className="section-body">
            I&apos;m Bharat, a BCA graduate and full‑stack developer who enjoys building
            balanced experiences between frontend craft and backend reliability. I like
            clean architecture, type‑safe APIs, and interfaces that feel fast, minimal and
            expressive without getting noisy.
          </p>
        </div>
        <div className="section-body">
          <p>
            On the frontend I work with TypeScript, React and Next.js, focusing on
            animation, micro‑interactions and performance. On the backend I&apos;m
            comfortable with Node, Spring Boot, relational databases and RESTful APIs.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            I love learning new tools, collaborating with designers and engineers, and
            shipping things that feel thoughtful—whether it&apos;s a single interaction or
            an entire product.
          </p>
        </div>
      </div>
    </section>
  );
}

