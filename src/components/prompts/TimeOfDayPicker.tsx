'use client';

import { motion } from 'framer-motion';
import { Sunrise, Sun, Sunset, Moon, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookPrompts } from '@/types';

interface TimeOfDayPickerProps {
  value: BookPrompts['timeOfDay'];
  onChange: (value: BookPrompts['timeOfDay']) => void;
  label?: string;
}

const timeOptions = [
  { value: 'dawn' as const, icon: Sunrise, label: 'Dawn', color: 'from-orange-200 to-pink-300' },
  { value: 'morning' as const, icon: Sun, label: 'Morning', color: 'from-yellow-200 to-orange-200' },
  { value: 'afternoon' as const, icon: Sun, label: 'Afternoon', color: 'from-blue-200 to-yellow-200' },
  { value: 'evening' as const, icon: Sunset, label: 'Evening', color: 'from-purple-300 to-orange-300' },
  { value: 'night' as const, icon: Moon, label: 'Night', color: 'from-indigo-400 to-purple-500' },
  { value: 'midnight' as const, icon: Star, label: 'Midnight', color: 'from-slate-700 to-indigo-900' },
];

export function TimeOfDayPicker({ value, onChange, label = 'What time of day does this book feel like?' }: TimeOfDayPickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {timeOptions.map((time) => {
          const isSelected = value === time.value;
          const Icon = time.icon;

          return (
            <motion.button
              key={time.value}
              type="button"
              onClick={() => onChange(isSelected ? null : time.value)}
              className={cn(
                'relative p-3 rounded-lg border-2 transition-all overflow-hidden',
                isSelected
                  ? 'border-primary'
                  : 'border-border hover:border-muted-foreground/50',
                'focus:outline-none focus:ring-2 focus:ring-ring'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Gradient background */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-b transition-opacity',
                  time.color,
                  isSelected ? 'opacity-30' : 'opacity-10'
                )}
              />

              <div className="relative flex flex-col items-center gap-1">
                <Icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span className={cn(
                  'text-xs font-medium',
                  isSelected ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {time.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
