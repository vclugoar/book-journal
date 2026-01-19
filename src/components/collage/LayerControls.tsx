'use client';

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Trash2, Copy, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayerControlsProps {
  hasSelection: boolean;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function LayerControls({
  hasSelection,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onDelete,
  onDuplicate,
}: LayerControlsProps) {
  const buttons = [
    { icon: ArrowUpToLine, label: 'Bring to front', onClick: onBringToFront },
    { icon: ArrowUp, label: 'Bring forward', onClick: onBringForward },
    { icon: ArrowDown, label: 'Send backward', onClick: onSendBackward },
    { icon: ArrowDownToLine, label: 'Send to back', onClick: onSendToBack },
    { icon: Copy, label: 'Duplicate', onClick: onDuplicate },
    { icon: Trash2, label: 'Delete', onClick: onDelete, danger: true },
  ];

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Layer Controls</span>

      <div className={cn(
        'grid grid-cols-3 gap-2',
        !hasSelection && 'opacity-50 pointer-events-none'
      )}>
        {buttons.map((btn) => (
          <motion.button
            key={btn.label}
            onClick={btn.onClick}
            disabled={!hasSelection}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg',
              'bg-card border border-border',
              'hover:bg-muted transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              btn.danger && 'hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20'
            )}
            whileHover={hasSelection ? { scale: 1.02 } : undefined}
            whileTap={hasSelection ? { scale: 0.98 } : undefined}
            title={btn.label}
          >
            <btn.icon className={cn(
              'h-4 w-4',
              btn.danger ? 'text-red-500' : 'text-muted-foreground'
            )} />
            <span className={cn(
              'text-[10px]',
              btn.danger ? 'text-red-500' : 'text-muted-foreground'
            )}>
              {btn.label.split(' ')[0]}
            </span>
          </motion.button>
        ))}
      </div>

      {!hasSelection && (
        <p className="text-xs text-muted-foreground text-center">
          Select an object to use layer controls
        </p>
      )}
    </div>
  );
}
