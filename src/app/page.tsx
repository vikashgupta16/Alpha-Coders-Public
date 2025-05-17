
import { Header } from '@/components/sections/header';
import { HeroSection } from '@/components/sections/hero-section';
import { MemberDashboardSection } from '@/components/sections/member-dashboard-section';
import { ProjectShowcaseSection } from '@/components/sections/project-showcase-section';
import { GitHubIntegrationSection } from '@/components/sections/github-integration-section';
import { FeedbackSection } from '@/components/sections/feedback-section';
import { Footer } from '@/components/sections/footer';
import type { Project, TechStackItem, GitHubRepo, ShowcaseProjectConfig } from '@/lib/types';
import { teamMembers as staticTeamMembersConfig, showcaseProjectConfigs } from '@/lib/placeholder-data';
import { getGithubUserPublicRepos, getGithubRepo } from '@/services/githubService';
import { Palette, FileCode, Cpu, Database, Cloud, Framer, Wand2 } from 'lucide-react';

// Helper to map GitHub languages/topics to TechStackItem
const mapTechToItem = (techName: string): TechStackItem => {
  const lowerTechName = techName.toLowerCase();
  if (lowerTechName.includes('next')) return { name: techName, icon: Framer, color: 'text-primary' };
  if (lowerTechName.includes('typescript')) return { name: techName, icon: FileCode, color: 'text-blue-500' };
  if (lowerTechName.includes('tailwind')) return { name: techName, icon: Palette, color: 'text-sky-500' };
  if (lowerTechName.includes('node') || lowerTechName.includes('javascript')) return { name: techName, icon: Cpu, color: 'text-green-500' };
  if (lowerTechName.includes('python')) return { name: techName, icon: Cpu, color: 'text-yellow-600' };
  if (lowerTechName.includes('html')) return { name: 'HTML', icon: FileCode, color: 'text-orange-500'};
  if (lowerTechName.includes('css')) return { name: 'CSS', icon: Palette, color: 'text-blue-400'};
  if (lowerTechName.includes('firebase')) return { name: techName, icon: Database, color: 'text-yellow-500' };
  if (lowerTechName.includes('docker')) return { name: techName, icon: Cloud, color: 'text-blue-600' };
  if (lowerTechName.includes('genkit') || lowerTechName.includes('gemini') || lowerTechName.includes('ai')) return { name: techName, icon: Wand2, color: 'text-purple-500' };
  return { name: techName, icon: FileCode, color: 'text-muted-foreground' };
};

const transformRepoToProject = (repo: GitHubRepo, configOverride?: Partial<ShowcaseProjectConfig>): Project => {
  const techStack: TechStackItem[] = [];
  if (configOverride?.manualTechStack) {
    techStack.push(...configOverride.manualTechStack);
  } else {
    if (repo.language) {
      techStack.push(mapTechToItem(repo.language));
    }
    repo.topics?.slice(0, 3).forEach(topic => {
      if (!techStack.find(t => t.name.toLowerCase() === topic.toLowerCase())) {
        techStack.push(mapTechToItem(topic));
      }
    });
  }

  const displayName = configOverride?.manualName || repo.name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  let imageAiHint = configOverride?.manualImageAiHint || (repo.language ? repo.language.toLowerCase() : "code abstract");
  if (imageAiHint.split(" ").length > 2) {
    imageAiHint = imageAiHint.split(" ").slice(0, 2).join(" ");
  }
  
  const imageUrl = configOverride?.manualImageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(displayName.substring(0,15))}`;

  return {
    id: String(repo.id),
    name: displayName,
    description: configOverride?.manualDescription || repo.description || 'No description provided.',
    tagline: configOverride?.manualTagline || (repo.language ? `A ${repo.language} project.` : 'A cool project.'),
    techStack: techStack.slice(0, 4),
    githubRepoUrl: repo.html_url,
    liveDemoUrl: configOverride?.manualLiveDemoUrl !== undefined ? configOverride.manualLiveDemoUrl : repo.homepage,
    imageUrl: imageUrl,
    imageAiHint: imageAiHint,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    owner: repo.owner.login,
    pushedAt: repo.pushed_at,
  };
};


export default async function HomePage() {
  // Fetch specific projects for the showcase section based on showcaseProjectConfigs
  const projectsForShowcasePromises = showcaseProjectConfigs.map(async (config) => {
    const repo = await getGithubRepo(config.owner, config.repoName);
    if (repo) {
      // Pass the manual config overrides to transformRepoToProject
      return transformRepoToProject(repo, config);
    }
    console.warn(`Could not fetch showcase project: ${config.owner}/${config.repoName}`);
    return null;
  });
  const projectsForShowcase = (await Promise.all(projectsForShowcasePromises)).filter(Boolean) as Project[];

  // Fetch all unique projects from all team members for the feedback dropdown
  let allFetchedProjectsForFeedback: Project[] = [];
  const uniqueRepoIds = new Set<number | string>();

  for (const memberConfig of staticTeamMembersConfig) {
    const repos: GitHubRepo[] = await getGithubUserPublicRepos(memberConfig.githubUsername, 20); 
    for (const repo of repos) {
      if (!uniqueRepoIds.has(repo.id) && !repo.fork) {
        uniqueRepoIds.add(repo.id);
        // For feedback dropdown, we don't need specific overrides like in showcase
        allFetchedProjectsForFeedback.push(transformRepoToProject(repo));
      }
    }
  }
  
  // Sort all fetched projects by most recently pushed, then by stars (for feedback dropdown if needed, or other uses)
  allFetchedProjectsForFeedback.sort((a, b) => {
    if (a.pushedAt && b.pushedAt) {
      const dateComparison = new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
      if (dateComparison !== 0) return dateComparison;
    }
    return (b.stars || 0) - (a.stars || 0);
  });
  
  // Prepare a simplified list for the feedback dropdown, using all fetched projects
  const projectsForFeedbackDropdown = allFetchedProjectsForFeedback.map(p => ({ id: String(p.id), name: p.name }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <MemberDashboardSection />
        <ProjectShowcaseSection projects={projectsForShowcase} />
        <GitHubIntegrationSection />
        <FeedbackSection projects={projectsForFeedbackDropdown} />
      </main>
      <Footer />
    </div>
  );
}
