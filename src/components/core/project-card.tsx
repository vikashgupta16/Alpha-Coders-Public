
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Users, Star, GitFork, CalendarDays } from 'lucide-react'; // Added Star, GitFork, CalendarDays
import { Badge } from '@/components/ui/badge';
import { TechChip } from './tech-chip';
import { formatDistanceToNow } from 'date-fns';


interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg border hover:border-accent/70 group">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={project.imageAiHint || "technology abstract"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
        </div>
        <div className="p-6 relative -mt-8">
            <CardTitle className="text-2xl text-accent group-hover:text-primary transition-colors">{project.name}</CardTitle>
            {project.tagline && <CardDescription className="text-muted-foreground group-hover:text-foreground transition-colors">{project.tagline}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
        
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <TechChip key={tech.name} tech={tech} />
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mt-3 mb-2">
          {project.stars !== undefined && (
            <div className="flex items-center" title="Stars">
              <Star className="w-3.5 h-3.5 mr-1 text-yellow-400" /> {project.stars}
            </div>
          )}
          {project.forks !== undefined && (
            <div className="flex items-center" title="Forks">
              <GitFork className="w-3.5 h-3.5 mr-1 text-primary" /> {project.forks}
            </div>
          )}
          {project.pushedAt && (
             <div className="flex items-center" title={`Last pushed: ${new Date(project.pushedAt).toLocaleDateString()}`}>
              <CalendarDays className="w-3.5 h-3.5 mr-1 text-accent" /> {formatDistanceToNow(new Date(project.pushedAt), { addSuffix: true })}
            </div>
          )}
        </div>


        {/* teamRoles are harder to derive dynamically, omitting for now
        {project.teamRoles && project.teamRoles.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Key Roles</h4>
            <div className="flex flex-wrap gap-1">
              {project.teamRoles.map((role, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-secondary hover:bg-secondary/80">
                  <Users className="w-3 h-3 mr-1.5 text-primary" />
                  {role.role}
                </Badge>
              ))}
            </div>
          </div>
        )}
        */}
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2">
        {project.githubRepoUrl && (
          <Button variant="outline" size="sm" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
            <Link href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> Source
            </Link>
          </Button>
        )}
        {project.liveDemoUrl && project.liveDemoUrl !== '#' && (
          <Button variant="default" size="sm" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

