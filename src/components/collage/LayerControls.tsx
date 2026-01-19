'use client';

import { motion } from 'framer-motion';
import { Trash2, Copy, ArrowUpToLine, ArrowDownToLine, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayerControlsProps {
  hasSelection: boolean;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onClearAll: () => void;
}

export function LayerControls({
  hasSelection,
  onBringToFront,
  onSendToBack,
  onDelete,
  onDuplicate,
  onClearAll,
}: LayerControlsProps) {
  const buttons = [
    { icon: ArrowUpToLine, label: 'Bring to front', shortLabel: 'To Front', onClick: onBringToFront },
    { icon: ArrowDownToLine, label: 'Send to back', shortLabel: 'To Back', onClick: onSendToBack },
    { icon: Copy, label: 'Duplicate', shortLabel: 'Duplicate', onClick: onDuplicate },
    { icon: Trash2, label: 'Delete', shortLabel: 'Delete', onClick: onDelete, danger: true },
  ];

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Layer Controls</span>

      <div className={cn(
        'grid grid-cols-2 gap-2',
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
              {btn.shortLabel}
            </span>
          </motion.button>
        ))}
      </div>

      {!hasSelection && (
        <p className="text-xs text-muted-foreground text-center">
          Select an object to use layer controls
        </p>
      )}

      {/* Clear All - always enabled */}
      <motion.button
        onClick={onClearAll}
        className={cn(
          'w-full flex items-center justify-center gap-2 p-2 rounded-lg',
          'bg-card border border-border',
          'hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 transition-colors'
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        title="Clear all objects from canvas"
      >
        <XCircle className="h-4 w-4 text-red-500" />
        <span className="text-xs text-red-500">Clear All</span>
      </motion.button>
    </div>
  );
}
