'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HeartCrack, Gift, HandHeart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookRatings } from '@/types';

interface LendabilityProps {
  value: BookRatings['lendability'];
  onChange: (value: BookRatings['lendability']) => void;
  label?: string;
}

type LendabilityOption = BookRatings['lendability'];

interface Option {
  value: LendabilityOption;
  icon: typeof Heart;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

export function Lendability({ value, onChange, label = 'Would You Lend It?' }: LendabilityProps) {
  const options: Option[] = [
    {
      value: 'keep',
      icon: Heart,
      label: 'Keep Forever',
      description: 'This one stays with me',
      color: 'text-rose-dark',
      bgColor: 'bg-rose/20 border-rose/40',
    },
    {
      value: 'lend-reluctantly',
      icon: HeartCrack,
      label: 'Lend Reluctantly',
      description: "I'd miss it, but okay...",
      color: 'text-golden-dark',
      bgColor: 'bg-golden/20 border-golden/40',
    },
    {
      value: 'lend-freely',
      icon: HandHeart,
      label: 'Lend Freely',
      description: 'Happy to share!',
      color: 'text-sage-dark',
      bgColor: 'bg-sage/20 border-sage/40',
    },
    {
      value: 'gift',
      icon: Gift,
      label: 'Would Gift',
      description: "I'd buy another copy to give",
      color: 'text-primary',
      bgColor: 'bg-primary/20 border-primary/40',
    },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          const Icon = option.icon;

          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all text-left',
                isSelected ? option.bgColor : 'bg-card border-border hover:border-muted-foreground/30',
                'focus:outline-none focus:ring-2 focus:ring-ring'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSelected ? 'selected' : 'unselected'}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: isSelected ? [1, 1.2, 1] : 1,
                        rotate: isSelected && option.value === 'gift' ? [0, 10, -10, 0] : 0,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-colors',
                          isSelected ? option.color : 'text-muted-foreground'
                        )}
                        fill={isSelected && option.value === 'keep' ? 'currentColor' : 'none'}
                      />
                    </motion.div>
                    <span
                      className={cn(
                        'font-medium text-sm transition-colors',
                        isSelected ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {option.label}
                    </span>
                  </div>

                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </motion.div>
              </AnimatePresence>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current"
                  style={{ color: option.color.replace('text-', '') }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
