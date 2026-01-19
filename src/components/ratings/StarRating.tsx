'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function StarRating({ value, onChange, label = 'Overall Rating' }: StarRatingProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayValue = hoveredIndex !== null ? hoveredIndex : value;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm text-muted-foreground">
          {displayValue > 0 ? `${displayValue} / 5` : 'No rating'}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = index <= displayValue;

          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => onChange(index === value ? 0 : index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                'p-1 rounded-md transition-colors',
                'hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Star
                className={cn(
                  'h-7 w-7 transition-colors duration-200',
                  isFilled ? 'text-primary fill-primary' : 'text-muted'
                )}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
