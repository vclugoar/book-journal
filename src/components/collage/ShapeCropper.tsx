'use client';

import { motion } from 'framer-motion';
import { Circle, Square, Heart, Star, Flower2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClipShapeId } from '@/lib/fabric/clipShapes';

interface ShapeCropperProps {
  hasImageSelected: boolean;
  currentShape: ClipShapeId | null;
  onApplyShape: (shapeId: ClipShapeId) => void;
  onRemoveShape: () => void;
}

const shapeButtons: { id: ClipShapeId; icon: typeof Circle; label: string }[] = [
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'square', icon: Square, label: 'Square' },
  { id: 'heart', icon: Heart, label: 'Heart' },
  { id: 'star', icon: Star, label: 'Star' },
  { id: 'flower', icon: Flower2, label: 'Flower' },
];

export function ShapeCropper({
  hasImageSelected,
  currentShape,
  onApplyShape,
  onRemoveShape,
}: ShapeCropperProps) {
  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Image Shape</span>

      <div
        className={cn(
          'grid grid-cols-3 gap-2',
          !hasImageSelected && 'opacity-50 pointer-events-none'
        )}
      >
        {shapeButtons.map((btn) => (
          <motion.button
            key={btn.id}
            onClick={() => onApplyShape(btn.id)}
            disabled={!hasImageSelected}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg',
              'bg-card border border-border',
              'hover:bg-muted transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              currentShape === btn.id && 'ring-2 ring-primary border-primary bg-primary/5'
            )}
            whileHover={hasImageSelected ? { scale: 1.02 } : undefined}
            whileTap={hasImageSelected ? { scale: 0.98 } : undefined}
            title={btn.label}
          >
            <btn.icon
              className={cn(
                'h-4 w-4',
                currentShape === btn.id ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-[10px]',
                currentShape === btn.id ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {btn.label}
            </span>
          </motion.button>
        ))}

        {/* Remove Shape Button */}
        <motion.button
          onClick={onRemoveShape}
          disabled={!hasImageSelected || !currentShape}
          className={cn(
            'flex flex-col items-center gap-1 p-2 rounded-lg',
            'bg-card border border-border',
            'hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          whileHover={hasImageSelected && currentShape ? { scale: 1.02 } : undefined}
          whileTap={hasImageSelected && currentShape ? { scale: 0.98 } : undefined}
          title="Remove shape"
        >
          <X className="h-4 w-4 text-red-500" />
          <span className="text-[10px] text-red-500">Remove</span>
        </motion.button>
      </div>

      {!hasImageSelected && (
        <p className="text-xs text-muted-foreground text-center">
          Select an image to apply a shape
        </p>
      )}
    </div>
  );
}
