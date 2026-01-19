'use client';

import { motion } from 'framer-motion';
import { Check, Paintbrush } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackgroundColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const backgroundColors = [
  // Light backgrounds
  '#FDF6E3', // Warm cream (default)
  '#FFFFFF', // White
  '#F5F5F5', // Light gray
  '#FFF8E7', // Soft yellow
  '#F0FFF4', // Mint
  '#FFF5F5', // Blush
  // Medium tones
  '#E8DFD0', // Tan
  '#D4A5A5', // Dusty rose
  '#9CAF88', // Sage
  '#A5D6E8', // Sky blue
  '#E6C068', // Gold
  '#C9B8E8', // Lavender
  // Dark backgrounds
  '#2D2D2D', // Charcoal
  '#1A1A2E', // Deep navy
  '#2D3436', // Dark slate
  '#4A3728', // Dark brown
];

export function BackgroundColorPicker({
  currentColor,
  onColorChange,
}: BackgroundColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Paintbrush className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Background Color</span>
      </div>

      <div className="grid grid-cols-8 gap-1.5">
        {backgroundColors.map((color) => (
          <motion.button
            key={color}
            onClick={() => onColorChange(color)}
            className={cn(
              'w-7 h-7 rounded-md border transition-all',
              currentColor === color
                ? 'ring-2 ring-primary ring-offset-1 scale-110'
                : 'hover:scale-105',
              isLightColor(color) ? 'border-gray-300' : 'border-transparent'
            )}
            style={{ backgroundColor: color }}
            whileTap={{ scale: 0.9 }}
            title={color}
          >
            {currentColor === color && (
              <Check
                className={cn(
                  'h-3.5 w-3.5 mx-auto',
                  isLightColor(color) ? 'text-gray-700' : 'text-white'
                )}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Custom color picker */}
      <div className="flex items-center gap-2 pt-1">
        <label className="text-xs text-muted-foreground">Custom:</label>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-6 rounded cursor-pointer border border-border"
        />
        <span className="text-xs text-muted-foreground font-mono">{currentColor}</span>
      </div>
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
