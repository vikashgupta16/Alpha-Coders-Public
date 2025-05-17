
import { teamMembers as staticTeamMembersConfig } from '@/lib/placeholder-data';
import { MemberCard } from '@/components/core/member-card';
import { SectionTitle } from '@/components/core/section-title';
import { Users } from 'lucide-react';
import { getGithubUser } from '@/services/githubService';
import type { TeamMember, TeamMemberConfig } from '@/lib/types';

export async function MemberDashboardSection() {
  const enrichedTeamMembers: TeamMember[] = await Promise.all(
    staticTeamMembersConfig.map(async (memberConfig: TeamMemberConfig): Promise<TeamMember> => {
      const githubUser = await getGithubUser(memberConfig.githubUsername);

      const name = githubUser?.name || githubUser?.login || memberConfig.githubUsername;
      const avatarUrl = githubUser?.avatar_url || `https://placehold.co/150x150.png?text=${name.substring(0,2).toUpperCase()}`;
      // Use provided bio, fallback to GitHub bio, then to a generic one
      const bio = memberConfig.bio || githubUser?.bio || `A passionate member of Alpha Coders. Check out their GitHub profile for more details.`;
      const githubProfileUrl = githubUser?.html_url;

      return {
        id: memberConfig.id,
        githubUsername: memberConfig.githubUsername,
        role: memberConfig.role,
        name,
        avatarUrl,
        bio,
        githubProfileUrl,
        contributions: memberConfig.contributions,
        projectsInvolved: memberConfig.projectsInvolved,
        avatarAiHint: memberConfig.avatarAiHint,
      };
    })
  );

  const mainTeamRolesKeywords = ['Lead', 'Architect']; 

  const mainTeamMembers = enrichedTeamMembers.filter(member =>
    mainTeamRolesKeywords.some(keyword => member.role.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  const otherTeamMembers = enrichedTeamMembers.filter(member =>
    !mainTeamRolesKeywords.some(keyword => member.role.toLowerCase().includes(keyword.toLowerCase()))
  );

  return (
    <section id="dashboard" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle icon={Users} title="Meet the Alpha Coders" subtitle="The brilliant minds behind our innovations and their contributions." />
        
        {mainTeamMembers.length > 0 && (
          <div className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-6 md:mb-8 text-center">
              Core Leadership
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {mainTeamMembers.map((member) => (
                <MemberCard key={member.id} member={member} isCoreMember={true} />
              ))}
            </div>
          </div>
        )}

        {otherTeamMembers.length > 0 && (
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold text-accent mb-6 md:mb-8 text-center">
              Valued Team Members
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
              {otherTeamMembers.map((member) => (
                <MemberCard key={member.id} member={member} /> 
              ))}
            </div>
          </div>
        )}

        {enrichedTeamMembers.length === 0 && (
          <p className="text-center text-muted-foreground">Team members could not be loaded. Please try again later.</p>
        )}
      </div>
    </section>
  );
}
