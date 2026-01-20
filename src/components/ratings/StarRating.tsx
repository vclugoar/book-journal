'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function StarRating({ value, onChange, label = 'Overall Rating' }: StarRatingProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [justSelected, setJustSelected] = useState<number | null>(null);

  const displayValue = hoveredIndex !== null ? hoveredIndex : value;

  const descriptions = [
    '',
    'Not for me',
    'It was okay',
    'Enjoyed it',
    'Loved it',
    'Absolutely magical',
  ];

  const handleSelect = (index: number) => {
    const newValue = index === value ? 0 : index;
    onChange(newValue);
    if (newValue > 0) {
      setJustSelected(index);
      setTimeout(() => setJustSelected(null), 400);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <AnimatePresence mode="wait">
          <motion.span
            key={displayValue}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-sm text-muted-foreground italic"
          >
            {displayValue > 0 ? descriptions[displayValue] : 'No rating'}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = index <= displayValue;
          const isJustSelected = justSelected === index;

          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => handleSelect(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                'p-1 rounded-md transition-colors',
                'hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isJustSelected ? {
                scale: [1, 1.3, 1],
                rotate: [0, -10, 10, 0],
              } : {}}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                animate={isFilled && index <= value ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 0.2 }}
              >
                <Star
                  className={cn(
                    'h-7 w-7 transition-colors duration-200',
                    isFilled ? 'text-primary fill-primary' : 'text-muted'
                  )}
                />
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
