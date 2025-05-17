import type { TechStackItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TechChipProps {
  tech: TechStackItem;
}

export function TechChip({ tech }: TechChipProps) {
  const IconComponent = tech.icon;
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground hover:border-primary transition-colors",
        tech.color ? tech.color.replace('text-', 'hover:border-') : 'hover:border-primary'
      )}
      title={tech.name}
    >
      {IconComponent && (
        <IconComponent className={cn("h-3.5 w-3.5", tech.color ? tech.color : 'text-muted-foreground')} />
      )}
      <span className={cn(tech.color ? tech.color : "text-muted-foreground")}>{tech.name}</span>
    </div>
  );
}
