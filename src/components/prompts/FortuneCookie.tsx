'use client';

import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface FortuneCookieProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

export function FortuneCookie({
  value,
  onChange,
  label = 'If this book came with a fortune cookie, what would it say?'
}: FortuneCookieProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <div className="relative">
        {/* Fortune cookie decoration */}
        <div className="absolute -top-2 -left-2 text-3xl opacity-50">🥠</div>

        <motion.div
          initial={false}
          animate={{
            boxShadow: value
              ? '0 4px 12px rgba(230, 192, 104, 0.3)'
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
          className="relative rounded-lg overflow-hidden"
        >
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="The journey matters more than the destination..."
            className={cn(
              'min-h-[80px] resize-none',
              'bg-cream-100 dark:bg-night-light',
              'border-golden/30 focus:border-golden',
              'font-serif italic',
              'pl-8'
            )}
            maxLength={150}
          />
        </motion.div>

        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground italic">
            Write your fortune...
          </span>
          <span className="text-xs text-muted-foreground">
            {value?.length || 0}/150
          </span>
        </div>
      </div>
    </div>
  );
}
