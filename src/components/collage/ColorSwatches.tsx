'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorSwatchesProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onUpdatePalette?: (colors: string[]) => void;
  onApplyToSelection?: (color: string) => void;
  onSetBackground?: (color: string) => void;
  hasSelection?: boolean;
}

const defaultPalettes = [
  ['#FDF6E3', '#D4A5A5', '#9CAF88', '#E6C068', '#8B7355'],
  ['#1A1A2E', '#16213E', '#0F3460', '#E8DFD0', '#E6C068'],
  ['#F8E1E1', '#D4A5A5', '#B88888', '#8B5A5A', '#5C3D3D'],
  ['#E8F5E9', '#A5D6A7', '#66BB6A', '#43A047', '#2E7D32'],
  ['#FFF8E1', '#FFE082', '#FFB74D', '#FF9800', '#E65100'],
  ['#E3F2FD', '#90CAF9', '#42A5F5', '#1976D2', '#0D47A1'],
];

export function ColorSwatches({
  colors,
  selectedColor,
  onSelectColor,
  onUpdatePalette,
  onApplyToSelection,
  onSetBackground,
  hasSelection,
}: ColorSwatchesProps) {
  const [showPalettes, setShowPalettes] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Color Palette</span>
        {onUpdatePalette && (
          <button
            onClick={() => setShowPalettes(!showPalettes)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Palette className="h-3 w-3" />
            Change palette
          </button>
        )}
      </div>

      {/* Current palette */}
      <div className="flex gap-2">
        {colors.map((color, index) => (
          <motion.button
            key={index}
            onClick={() => onSelectColor(color)}
            className={cn(
              'w-8 h-8 rounded-full border-2 transition-all',
              selectedColor === color
                ? 'border-foreground scale-110'
                : 'border-transparent hover:scale-105'
            )}
            style={{ backgroundColor: color }}
            whileTap={{ scale: 0.9 }}
          >
            {selectedColor === color && (
              <Check
                className={cn(
                  'h-4 w-4 mx-auto',
                  isLightColor(color) ? 'text-gray-800' : 'text-white'
                )}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {onApplyToSelection && (
          <button
            onClick={() => onApplyToSelection(selectedColor)}
            disabled={!hasSelection}
            className={cn(
              'flex-1 text-xs py-1.5 px-2 rounded-md transition-colors',
              hasSelection
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            Apply to Selection
          </button>
        )}
        {onSetBackground && (
          <button
            onClick={() => onSetBackground(selectedColor)}
            className="flex-1 text-xs py-1.5 px-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
          >
            Set Background
          </button>
        )}
      </div>

      {/* Palette selector */}
      {showPalettes && onUpdatePalette && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 p-3 bg-muted rounded-lg"
        >
          <span className="text-xs text-muted-foreground">Choose a palette:</span>
          <div className="space-y-2">
            {defaultPalettes.map((palette, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onUpdatePalette(palette);
                  setShowPalettes(false);
                }}
                className={cn(
                  'flex gap-1 p-1 rounded-lg w-full',
                  'hover:bg-card transition-colors',
                  JSON.stringify(colors) === JSON.stringify(palette) && 'ring-2 ring-primary'
                )}
              >
                {palette.map((color, colorIdx) => (
                  <div
                    key={colorIdx}
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}
