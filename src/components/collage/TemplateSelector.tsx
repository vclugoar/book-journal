'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { getTemplates, type TemplateId } from '@/lib/fabric/templates';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: TemplateId) => void;
  onClearTemplate: () => void;
  hasPlaceholders: boolean;
}

// Simple SVG icons for each template preview
const templateIcons: Record<TemplateId, React.ReactNode> = {
  'grid-2x2': (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <rect x="2" y="2" width="17" height="17" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="21" y="2" width="17" height="17" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="2" y="21" width="17" height="17" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="21" y="21" width="17" height="17" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
    </svg>
  ),
  'grid-3x3': (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={2 + col * 13}
            y={2 + row * 13}
            width="11"
            height="11"
            rx="1"
            className="fill-muted-foreground/30 stroke-muted-foreground"
            strokeWidth="1"
          />
        ))
      )}
    </svg>
  ),
  'hero-grid': (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <rect x="2" y="2" width="36" height="20" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="2" y="24" width="11" height="14" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="15" y="24" width="11" height="14" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="27" y="24" width="11" height="14" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
    </svg>
  ),
  'feature-left': (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <rect x="2" y="2" width="22" height="36" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="26" y="2" width="12" height="17" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="26" y="21" width="12" height="17" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
    </svg>
  ),
  centered: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <rect x="11" y="11" width="18" height="18" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="2" y="2" width="8" height="8" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="30" y="2" width="8" height="8" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="2" y="30" width="8" height="8" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="30" y="30" width="8" height="8" rx="1" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
    </svg>
  ),
  scattered: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <rect x="2" y="4" width="14" height="12" rx="1" transform="rotate(-8 9 10)" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="22" y="2" width="12" height="10" rx="1" transform="rotate(5 28 7)" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="10" y="14" width="16" height="14" rx="1" transform="rotate(3 18 21)" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="3" y="24" width="12" height="10" rx="1" transform="rotate(-5 9 29)" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
      <rect x="20" y="22" width="14" height="12" rx="1" transform="rotate(7 27 28)" className="fill-muted-foreground/30 stroke-muted-foreground" strokeWidth="1" />
    </svg>
  ),
};

export function TemplateSelector({
  onSelectTemplate,
  onClearTemplate,
  hasPlaceholders,
}: TemplateSelectorProps) {
  const templates = getTemplates();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          <span className="font-medium">Templates</span>
        </div>
        {hasPlaceholders && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearTemplate}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-2 rounded-lg',
              'bg-card border border-border',
              'hover:border-primary hover:bg-primary/5',
              'transition-colors'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={template.description}
          >
            <div className="w-10 h-10">{templateIcons[template.id]}</div>
            <span className="text-xs text-muted-foreground">{template.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
