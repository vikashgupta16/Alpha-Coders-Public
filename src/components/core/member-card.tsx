
'use client';

import Image from 'next/image';
import type { TeamMember } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MemberCardProps {
  member: TeamMember;
  isCoreMember?: boolean;
}

export function MemberCard({ member, isCoreMember = false }: MemberCardProps) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setIsExpanded(true); // Always expanded on desktop
    } else {
      setIsExpanded(false); // Collapsed by default on mobile
    }
  }, [isMobile]);

  const toggleExpand = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  // Content is shown if it's desktop, or if it's mobile AND expanded
  const shouldShowDetails = !isMobile || isExpanded;

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full",
        isCoreMember ? "border-2 border-primary/60 hover:border-primary shadow-primary/10" : "border hover:border-primary/70",
        isMobile && "cursor-pointer"
      )}
      onClick={isMobile ? toggleExpand : undefined} // Entire card is clickable on mobile
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-32 md:h-40"> {/* Desktop height slightly increased */}
          <Image
            src={member.avatarUrl}
            alt={member.name}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300"
            data-ai-hint={member.avatarAiHint || "professional portrait"}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
        </div>
         <div className={cn("p-4 pb-2 relative", isMobile ? "-mt-10" : "-mt-12 md:-mt-16")}> {/* Adjusted negative margin for mobile and desktop */}
          <div className={cn(
              "relative rounded-full overflow-hidden border-4 bg-card shadow-md mx-auto",
              isCoreMember ? "border-primary" : "border-secondary",
              isMobile ? "w-20 h-20 mb-1" : "w-24 h-24 mb-2" // Slightly larger avatar on desktop
            )}>
             <Image
                src={member.avatarUrl}
                alt={`${member.name} avatar`}
                layout="fill"
                objectFit="cover"
                data-ai-hint={member.avatarAiHint || "professional portrait"}
            />
          </div>
          <CardTitle className={cn(
            "text-center text-primary",
            isMobile ? "text-lg" : "text-xl" // Normal text size for desktop
          )}>{member.name}</CardTitle>
          <CardDescription className={cn(
            "text-center text-accent",
             isMobile ? "text-xs" : "text-sm" // Normal text size for desktop
          )}>{member.role}</CardDescription>
        </div>
      </CardHeader>

      {/* Details Section - Conditional based on shouldShowDetails */}
      <div 
        className={cn(
          "transition-all duration-500 ease-in-out overflow-hidden",
          // For mobile, use max-h for expansion. For desktop, it's always visible.
          isMobile ? (isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0") : "opacity-100 max-h-full" 
        )}
      >
        {/* This inner div is only hidden for mobile when not expanded */}
        <div className={cn(isMobile && !isExpanded && "hidden", "flex-grow flex flex-col")}>
          <CardContent className={cn("p-4 pt-2 flex-grow")}>
            {member.bio && <p className={cn("text-muted-foreground mb-3 text-center line-clamp-3", isMobile ? "text-xs" : "text-sm")}>{member.bio}</p>}
            
            <div className="mb-2">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Contributions</h4>
              <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                {member.contributions.slice(0, isMobile ? 2 : 3).map((contrib, index) => (
                  <Badge key={index} variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-secondary hover:bg-secondary/80">{contrib}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Projects</h4>
              <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                {member.projectsInvolved.slice(0, isMobile ? 2 : 3).map((project, index) => (
                  <Badge key={index} variant="outline" className="text-[10px] px-1.5 py-0.5 border-primary/50 text-primary/80 hover:bg-primary/10">{project.replace('project-','')}</Badge>
                ))}
              </div>
            </div>
          </CardContent>

          {(member.githubProfileUrl || member.githubUsername) && (
            <CardFooter className={cn("p-4 pt-0 mt-auto")}>
              <Button variant="outline" size="sm" className={cn("w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground h-8", isMobile ? "text-xs" : "text-sm")}>
                <Link href={member.githubProfileUrl || `https://github.com/${member.githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full">
                  <Github className="mr-1.5 h-3.5 w-3.5" /> GitHub
                </Link>
              </Button>
            </CardFooter>
          )}
        </div>
      </div>
      
      {/* "View More/Less" indicator for mobile, part of the clickable area */}
      {isMobile && (
        <div className="p-2 text-center text-xs text-primary flex items-center justify-center mt-auto border-t border-border/30">
          {isExpanded ? "View Less" : "View More"} 
          {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
        </div>
      )}
    </Card>
  );
}
