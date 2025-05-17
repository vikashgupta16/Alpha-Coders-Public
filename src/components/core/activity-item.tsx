
import { cn } from '@/lib/utils';
import { GitCommit, GitPullRequest, AlertCircle, UserCheck, GitFork, Rocket, Star } from 'lucide-react'; // Added GitFork, Rocket, Star
import Link from 'next/link';

interface ActivityItemProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  timestamp?: string;
  link?: string;
  user?: string;
  type?: 'commit' | 'pr' | 'issue' | 'contribution' | 'fork' | 'repo_create' | 'star' | 'other'; // Added new types
}

const typeIcons: Record<string, LucideIcon> = {
  commit: GitCommit,
  pr: GitPullRequest,
  issue: AlertCircle,
  contribution: UserCheck,
  fork: GitFork,
  repo_create: Rocket, // Using Rocket for repo creation
  star: Star,
  other: UserCheck, // Default for other types
};

export function ActivityItem({ icon, title, description, timestamp, link, user, type }: ActivityItemProps) {
  const IconToRender = type ? typeIcons[type] || UserCheck : icon || UserCheck;
  
  const itemContent = (
    <>
      <IconToRender className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
      <div className="flex-grow">
        <p className="text-sm font-medium text-foreground truncate" title={title}>
          {user && <span className="font-semibold text-accent">{user} </span>}
          {title}
        </p>
        {description && <p className="text-xs text-muted-foreground truncate" title={description}>{description}</p>}
      </div>
      {timestamp && <time className="text-xs text-muted-foreground ml-auto flex-shrink-0 whitespace-nowrap">{new Date(timestamp).toLocaleTimeString()} - {new Date(timestamp).toLocaleDateString()}</time>}
    </>
  );

  return (
    <div className="flex items-center p-3 bg-card/50 hover:bg-card rounded-lg transition-colors border border-transparent hover:border-primary/30">
      {link && link !== '#' ? (
        <Link href={link} target="_blank" rel="noopener noreferrer" className="flex items-center w-full overflow-hidden">
          {itemContent}
        </Link>
      ) : (
         <div className="flex items-center w-full overflow-hidden">
            {itemContent}
         </div>
      )}
    </div>
  );
}

