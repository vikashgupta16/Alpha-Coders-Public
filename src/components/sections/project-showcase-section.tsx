

import { ProjectCard } from '@/components/core/project-card';
import { SectionTitle } from '@/components/core/section-title';
import { Briefcase } from 'lucide-react';
import type { Project } from '@/lib/types';

interface ProjectShowcaseSectionProps {
  projects: Project[];
}

export function ProjectShowcaseSection({ projects }: ProjectShowcaseSectionProps) {
  return (
    <section id="projects" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle icon={Briefcase} title="Project Showcase" subtitle="Our team's latest and most impactful public repositories." />
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No public projects found or could not load projects from GitHub.</p>
        )}
      </div>
    </section>
  );
}
