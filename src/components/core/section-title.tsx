import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ icon: Icon, title, subtitle, className }: SectionTitleProps) {
  return (
    <div className={cn("mb-8 md:mb-12 text-center", className)}>
      <div className="flex items-center justify-center mb-2">
        {Icon && <Icon className="w-10 h-10 mr-3 text-primary" />}
        <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
