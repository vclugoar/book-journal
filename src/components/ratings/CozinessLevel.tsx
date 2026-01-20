'use client';

import { motion } from 'framer-motion';
import { Snowflake, Flame, HelpCircle } from 'lucide-react';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils';

interface CozinessLevelProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function CozinessLevel({ value, onChange, label = 'Coziness Level' }: CozinessLevelProps) {
  const getDescription = (val: number) => {
    if (val < 20) return 'Brisk and bracing';
    if (val < 40) return 'Cool and crisp';
    if (val < 60) return 'Pleasantly warm';
    if (val < 80) return 'Wrapped in a blanket';
    return 'Hot cocoa by the fire';
  };

  const getEmoji = (val: number) => {
    if (val < 20) return '🧊';
    if (val < 40) return '❄️';
    if (val < 60) return '☕';
    if (val < 80) return '🧣';
    return '🔥';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-1">
          {label}
          <span title="How warm and comforting did this book feel?">
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
          </span>
        </label>
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <span>{getEmoji(value)}</span>
          <span className="italic">{getDescription(value)}</span>
        </span>
      </div>

      <div className="relative">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: value < 30 ? 1.1 : 1, opacity: value < 50 ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          >
            <Snowflake className="h-5 w-5 text-blue-400" />
          </motion.div>

          <div className="flex-1 relative">
            <Slider
              value={[value]}
              onValueChange={([val]) => onChange(val)}
              min={0}
              max={100}
              step={1}
              variant="warmth"
            />

            {/* Warmth glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${value}% 50%, rgba(230, 192, 104, ${value / 200}) 0%, transparent 50%)`,
              }}
              animate={{ opacity: value > 50 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.div
            animate={{ scale: value > 70 ? 1.1 : 1, opacity: value > 50 ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          >
            <Flame className={cn('h-5 w-5', value > 80 ? 'text-orange-500' : 'text-orange-300')} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
