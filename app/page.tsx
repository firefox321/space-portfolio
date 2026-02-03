import { Hero } from "@/ui/sections/hero";
import { AboutSection } from "@/ui/sections/about";
import { SkillsSection } from "@/ui/sections/skills";
import { ProjectsSection } from "@/ui/sections/projects";
import { ContactSection } from "@/ui/sections/contact";

export default function HomePage() {
  return (
    <main className="page">
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}

