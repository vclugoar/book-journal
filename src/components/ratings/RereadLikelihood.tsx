'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RereadLikelihoodProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function RereadLikelihood({ value, onChange, label = 'Reread Likelihood' }: RereadLikelihoodProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const descriptions = [
    'No rating yet',
    'Once was enough',
    'Maybe someday',
    'Likely revisit',
    'Will reread',
    'Eternal favorite',
  ];

  const displayValue = hoveredIndex !== null ? hoveredIndex : value;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm text-muted-foreground italic">
          {descriptions[displayValue]}
        </span>
      </div>

      <div className="flex items-end gap-1 h-16">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = index <= displayValue;
          const isActive = index <= value;
          const height = 20 + index * 8;

          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => onChange(index === value ? 0 : index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                'relative flex items-end justify-center rounded-t-sm transition-colors',
                'hover:bg-sage/10 focus:outline-none focus:ring-2 focus:ring-sage/50',
                'w-10'
              )}
              style={{ height: height }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${index}-${isFilled}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ originY: 1 }}
                  className={cn(
                    'w-8 rounded-t-sm flex items-center justify-center',
                    isFilled
                      ? isActive
                        ? 'bg-sage'
                        : 'bg-sage/60'
                      : 'bg-muted'
                  )}
                >
                  <motion.div
                    className="flex items-center justify-center h-full"
                    style={{ height: height - 4 }}
                  >
                    <BookOpen
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isFilled ? 'text-white' : 'text-muted-foreground'
                      )}
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Stack indicator */}
              {isActive && index === value && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-golden rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Visual book stack indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>📚</span>
        <span>
          {value === 0
            ? 'How likely are you to reread this?'
            : `${value} book${value > 1 ? 's' : ''} high on the reread stack`}
        </span>
      </div>
    </div>
  );
}
