
import type { TeamMemberConfig, NavItem, Project, ShowcaseProjectConfig } from '@/lib/types';
import { Users, Briefcase, MessageSquare, Github } from 'lucide-react';

export const teamMembers: TeamMemberConfig[] = [
  {
    id: 'member-vikash',
    githubUsername: 'vikashgupta16',
    role: 'Team Lead / Lead Architect',
    avatarAiHint: 'professional portrait tech leadership',
    contributions: ['Core system design', 'Project leadership', 'AI strategy'],
    projectsInvolved: ['PragatiPath', 'AlphaCoders', 'CodeBattle-Arena'], 
    bio: 'Leading Alpha Coders to innovate and deliver cutting-edge solutions. Expert in scalable architectures and AI integration.'
  },
  {
    id: 'member-dealer',
    githubUsername: 'Dealer-09',
    role: 'Lead Developer',
    avatarAiHint: 'professional portrait software development',
    contributions: ['Full-stack development', 'API design', 'Technical mentorship'],
    projectsInvolved: ['AlphaCoders', 'CodeBattle-Arena'],
    bio: 'Passionate about building robust and efficient software. Key contributor to multiple core projects.'
  },
  {
    id: 'member-pixelpioneer',
    githubUsername: 'PixelPioneer404',
    role: 'Lead Developer',
    avatarAiHint: 'professional portrait creative technologist',
    contributions: ['Frontend architecture', 'UI/UX development', 'Performance optimization'],
    projectsInvolved: ['AlphaCoders', 'PragatiPath'],
    bio: 'Crafting intuitive and performant user experiences. Specializes in modern frontend technologies.'
  },
  {
    id: 'member-rouvik',
    githubUsername: 'Rouvik',
    role: 'Lead Developer',
    avatarAiHint: 'professional portrait backend systems',
    contributions: ['Backend systems development', 'Database management', 'Cloud infrastructure'],
    projectsInvolved: ['AlphaCoders', 'CodeBattle-Arena'],
    bio: 'Building scalable and reliable backend services. Expert in cloud technologies and data engineering.'
  },
  {
    id: 'member-zinweb',
    githubUsername: 'zin-web',
    role: 'Team Member',
    avatarAiHint: 'professional portrait web developer',
    contributions: ['Web development', 'Frontend contributions', 'Testing'],
    projectsInvolved: ['AlphaCoders'],
    bio: 'Enthusiastic developer contributing to Alpha Coders projects.'
  },
];


export const navItems: NavItem[] = [
  { label: 'Team', href: '#dashboard', icon: Users },
  { label: 'Projects', href: '#projects', icon: Briefcase },
  { label: 'GitHub', href: '#github', icon: Github },
  { label: 'Feedback', href: '#feedback', icon: MessageSquare },
];


// Configuration for the main showcase projects to be fetched from GitHub.
// You can override details fetched from GitHub by providing manual values here.
// Especially: manualImageUrl, manualTagline, manualDescription, manualLiveDemoUrl.
export const showcaseProjectConfigs: ShowcaseProjectConfig[] = [
  {
    owner: 'vikashgupta16',
    repoName: 'PragatiPath',
    // Example of manual overrides (uncomment and customize as needed):
    // manualName: 'Pragati Path - Education Reimagined',
    // manualTagline: 'AI-Powered Educational Platform for Modern Learning',
    // manualDescription: 'PragatiPath leverages AI to create personalized learning journeys, interactive content, and progress tracking for students of all levels.',
    // manualImageUrl: 'https://placehold.co/600x400.png?text=PragatiPath+Custom', // Replace with your actual image URL
    // manualImageAiHint: 'education platform',
    // manualLiveDemoUrl: 'https://pragtipath.example.com' // Replace with actual demo URL
  },
  {
    owner: 'vikashgupta16', // Or 'Alpha-Coders' if it's an organization
    repoName: 'Alpha-Coders', // Ensure this matches the actual repository name
    // manualName: 'Alpha Coders - Our Platform',
    // manualTagline: 'The Engineering Showcase Platform you are currently viewing.',
    // manualImageUrl: 'https://placehold.co/600x400.png?text=Alpha+Coders+Platform', // Replace
    // manualImageAiHint: 'developer team showcase',
  },
  {
    owner: 'vikashgupta16',
    repoName: 'CodeBattle-Arena',
    // manualTagline: 'Competitive Coding Challenge Platform',
    // manualImageUrl: 'https://placehold.co/600x400.png?text=CodeBattle+Arena', // Replace
    // manualImageAiHint: 'coding competition arena',
  },
];

// Fallback for dynamic sections if GitHub API fails or for other purposes
export const projects_static_fallback: Project[] = [];
export const githubActivities_static_fallback: any[] = [];
// Feedback is now handled by Firestore, so this static array is not the primary source
export const feedbacks_static_fallback: any[] = [];
    
