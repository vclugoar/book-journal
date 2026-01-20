'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReadingLocationProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

export function ReadingLocation({
  value,
  onChange,
  label = 'Where did you read this book?'
}: ReadingLocationProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">📍</span>
        <label className="text-sm font-medium text-foreground">{label}</label>
      </div>

      <div className="relative">
        <motion.div
          initial={false}
          animate={{
            boxShadow: value
              ? '0 4px 12px rgba(143, 171, 145, 0.3)'
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
          className="relative rounded-lg overflow-hidden"
        >
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="Curled up on the couch, at the beach..."
            maxLength={100}
            className={cn(
              'w-full px-4 py-3 rounded-lg',
              'bg-sage/10 dark:bg-sage/5',
              'border border-sage/30 focus:border-sage',
              'focus:outline-none focus:ring-2 focus:ring-sage/30',
              'placeholder:text-muted-foreground',
              'text-sm'
            )}
          />
        </motion.div>

        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            Your cozy reading spot
          </span>
          <span className="text-xs text-muted-foreground">
            {value?.length || 0}/100
          </span>
        </div>
      </div>
    </div>
  );
}
