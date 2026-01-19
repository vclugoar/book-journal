'use client';

import { motion } from 'framer-motion';
import { Flower2, Sun, Leaf, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookPrompts } from '@/types';

interface SeasonPickerProps {
  value: BookPrompts['season'];
  onChange: (value: BookPrompts['season']) => void;
  label?: string;
}

const seasons = [
  {
    value: 'spring' as const,
    icon: Flower2,
    label: 'Spring',
    description: 'New beginnings, fresh starts',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  {
    value: 'summer' as const,
    icon: Sun,
    label: 'Summer',
    description: 'Warm, bright, adventurous',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  {
    value: 'autumn' as const,
    icon: Leaf,
    label: 'Autumn',
    description: 'Cozy, reflective, changing',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    value: 'winter' as const,
    icon: Snowflake,
    label: 'Winter',
    description: 'Quiet, introspective, magical',
    color: 'text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
];

export function SeasonPicker({ value, onChange, label = 'What season does this book feel like?' }: SeasonPickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {seasons.map((season) => {
          const isSelected = value === season.value;
          const Icon = season.icon;

          return (
            <motion.button
              key={season.value}
              type="button"
              onClick={() => onChange(isSelected ? null : season.value)}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all',
                isSelected
                  ? `${season.bgColor} border-current ${season.color}`
                  : 'bg-card border-border hover:border-muted-foreground/50',
                'focus:outline-none focus:ring-2 focus:ring-ring'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <motion.div
                  animate={{
                    rotate: isSelected && season.value === 'autumn' ? [0, 10, -10, 0] : 0,
                    y: isSelected ? [0, -2, 0] : 0,
                  }}
                  transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0, repeatDelay: 2 }}
                >
                  <Icon
                    className={cn(
                      'h-8 w-8 transition-colors',
                      isSelected ? season.color : 'text-muted-foreground'
                    )}
                  />
                </motion.div>
                <span className={cn(
                  'font-medium text-sm',
                  isSelected ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {season.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {value && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground italic text-center"
        >
          {seasons.find(s => s.value === value)?.description}
        </motion.p>
      )}
    </div>
  );
}
