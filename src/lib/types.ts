
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
}

export interface TeamMemberConfig {
  id: string;
  githubUsername: string;
  role: string;
  avatarAiHint?: string;
  contributions: string[];
  projectsInvolved: string[];
  bio?: string;
}

export interface TeamMember {
  id: string;
  githubUsername: string;
  role: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  githubProfileUrl?: string;
  contributions: string[];
  projectsInvolved: string[];
  avatarAiHint?: string;
  publicRepoCount?: number;
}

export interface TechStackItem {
  name: string;
  icon?: LucideIcon | React.ElementType;
  color?: string;
}

export interface Project {
  id: string | number;
  name: string;
  tagline?: string;
  description: string | null;
  techStack: TechStackItem[];
  githubRepoUrl: string;
  liveDemoUrl?: string | null;
  imageUrl: string;
  imageAiHint?: string;
  stars?: number;
  forks?: number;
  owner?: string;
  pushedAt?: string;
}

// Configuration for projects to be showcased, fetched from specific GitHub repos
export interface ShowcaseProjectConfig {
  owner: string;
  repoName: string;
  manualName?: string; // Optional: Override the name fetched from GitHub
  manualTagline?: string; // Optional: Override tagline/description
  manualDescription?: string; // Optional: Override description
  manualImageUrl?: string; // Optional: Provide a specific image URL
  manualImageAiHint?: string; // Optional: Hint for AI if manual image is used
  manualLiveDemoUrl?: string; // Optional: If live demo URL is different from repo.homepage
  manualTechStack?: TechStackItem[]; // Optional: Manually define tech stack
}


export interface GitHubActivity {
  id: string;
  type: 'commit' | 'pr' | 'issue' | 'fork' | 'repo_create' | 'star' | 'other';
  description: string;
  user: string;
  timestamp: string;
  link?: string;
  repoName?: string;
}

export interface Feedback {
  id: string;
  projectId: string;
  author: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  homepage: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  pushed_at: string;
  topics: string[];
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    display_login?: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    action?: string;
    pusher_type?: string;
    push_id?: number;
    size?: number;
    distinct_size?: number;
    ref?: string;
    head?: string;
    before?: string;
    commits?: Array<{
      sha: string;
      author: { name: string; email: string };
      message: string;
      distinct: boolean;
      url: string;
    }>;
    pull_request?: {
      html_url: string;
      title: string;
      number: number;
      user: { login: string };
    };
    issue?: {
      html_url: string;
      title: string;
      number: number;
      user: { login: string };
    };
    forkee?: GitHubRepo;
    ref_type?: "repository" | "branch" | "tag";
  };
  public: boolean;
  created_at: string;
}
