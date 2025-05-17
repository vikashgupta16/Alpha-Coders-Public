
import Image from 'next/image';
import { ActivityItem } from '@/components/core/activity-item';
import { SectionTitle } from '@/components/core/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Github, BarChart3, Users } from 'lucide-react';
import { teamMembers as staticTeamMembersConfig } from '@/lib/placeholder-data';
import { getGithubUser, getGithubUserEvents } from '@/services/githubService';
import type { GitHubActivity, GitHubEvent } from '@/lib/types';

function mapGitHubEventToActivityItem(event: GitHubEvent): GitHubActivity | null {
  const common = {
    id: event.id,
    user: event.actor.login,
    timestamp: event.created_at,
    repoName: event.repo.name,
  };

  switch (event.type) {
    case 'PushEvent':
      const commit = event.payload.commits?.[0];
      if (!commit) return null;
      return {
        ...common,
        type: 'commit',
        description: commit.message.split('\n')[0], // First line of commit message
        link: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
      };
    case 'PullRequestEvent':
      if (!event.payload.pull_request || !event.payload.action) return null;
      return {
        ...common,
        type: 'pr',
        description: `${event.payload.action} PR: ${event.payload.pull_request.title} (#${event.payload.pull_request.number})`,
        link: event.payload.pull_request.html_url,
      };
    case 'IssuesEvent':
      if (!event.payload.issue || !event.payload.action) return null;
      return {
        ...common,
        type: 'issue',
        description: `${event.payload.action} issue: ${event.payload.issue.title} (#${event.payload.issue.number})`,
        link: event.payload.issue.html_url,
      };
    case 'ForkEvent':
       if (!event.payload.forkee) return null;
      return {
        ...common,
        type: 'fork',
        description: `forked ${event.repo.name} to ${event.payload.forkee.full_name}`,
        link: event.payload.forkee.html_url,
      };
    case 'CreateEvent':
      if (event.payload.ref_type === 'repository') {
        return {
          ...common,
          type: 'repo_create',
          description: `created repository ${event.repo.name}`,
          link: `https://github.com/${event.repo.name}`,
        };
      }
      return null; // Or handle other CreateEvent types like branch/tag
    default:
      return null;
  }
}


export async function GitHubIntegrationSection() {
  const memberDetails = await Promise.all(
    staticTeamMembersConfig.map(memberConfig => getGithubUser(memberConfig.githubUsername))
  );

  let allEvents: GitHubActivity[] = [];
  for (const memberConfig of staticTeamMembersConfig) {
    const events = await getGithubUserEvents(memberConfig.githubUsername, 5); // Fetch 5 recent events per user
    const mappedEvents = events.map(mapGitHubEventToActivityItem).filter(Boolean) as GitHubActivity[];
    allEvents.push(...mappedEvents);
  }

  // Sort all events by timestamp descending and take the most recent 10
  allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const recentActivities = allEvents.slice(0, 10);

  return (
    <section id="github" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle icon={Github} title="GitHub Pulse" subtitle="Track our team's latest contributions and development activities." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-primary/30 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-primary">
                <Users className="mr-2 h-6 w-6" />
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground mb-4">
                A snapshot of our team members' public GitHub presence.
              </CardDescription>
              <ul className="space-y-3">
                {memberDetails.filter(Boolean).map(member => (
                  member && (
                    <li key={member.id} className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-border/50">
                      <div className="flex items-center">
                        <Image src={member.avatar_url} alt={member.login} width={40} height={40} className="rounded-full mr-3" />
                        <div>
                          <a href={member.html_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-primary">{member.name || member.login}</a>
                          <p className="text-xs text-muted-foreground">{member.public_repos} public repositories</p>
                        </div>
                      </div>
                       <a href={`${member.html_url}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        View Repos
                      </a>
                    </li>
                  )
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/30 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-accent">
                <BarChart3 className="mr-2 h-6 w-6" />
                Live Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground mb-4">
                Recent public activities from our team members.
              </CardDescription>
              {recentActivities.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {recentActivities.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      type={activity.type}
                      title={activity.description}
                      description={activity.repoName ? `in ${activity.repoName}` : undefined}
                      user={activity.user}
                      timestamp={activity.timestamp}
                      link={activity.link}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No recent public activity found or could not load activities.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

