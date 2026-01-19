'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverallMagicProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function OverallMagic({ value, onChange, label = 'Overall Magic' }: OverallMagicProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const descriptions = [
    'No rating yet',
    'A spark',
    'Glimmers',
    'Enchanting',
    'Spellbinding',
    'Pure Magic',
  ];

  const colors = [
    'text-muted-foreground',
    'text-golden/60',
    'text-golden/80',
    'text-golden',
    'text-golden',
    'text-golden',
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
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = index <= displayValue;
          const isActive = index <= value;

          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => onChange(index === value ? 0 : index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                'relative p-2 rounded-lg transition-colors',
                'hover:bg-golden/10 focus:outline-none focus:ring-2 focus:ring-golden/50'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{
                  scale: isFilled ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles
                  className={cn(
                    'h-8 w-8 transition-colors duration-200',
                    isFilled ? colors[index] : 'text-muted'
                  )}
                  fill={isFilled ? 'currentColor' : 'none'}
                />
              </motion.div>

              {/* Sparkle particles */}
              <AnimatePresence>
                {isFilled && isActive && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-golden rounded-full"
                        initial={{
                          opacity: 0,
                          x: 16,
                          y: 16,
                          scale: 0,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          x: 16 + Math.random() * 20 - 10,
                          y: Math.random() * 10,
                          scale: [0, 1, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 1.5,
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
