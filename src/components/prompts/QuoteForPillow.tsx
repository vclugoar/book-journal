'use client';

import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface QuoteForPillowProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

export function QuoteForPillow({
  value,
  onChange,
  label = 'Pick a quote to embroider on a pillow'
}: QuoteForPillowProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <motion.div
        initial={false}
        animate={{
          scale: value ? 1 : 0.98,
        }}
        className="relative"
      >
        {/* Pillow-like border */}
        <div
          className={cn(
            'p-4 rounded-2xl border-4 border-dashed transition-colors',
            value ? 'border-rose/40 bg-rose/5' : 'border-border bg-muted/30'
          )}
        >
          {/* Decorative corners */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-rose/30 rounded-tl" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-rose/30 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-rose/30 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-rose/30 rounded-br" />

          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder='"It is only with the heart that one can see rightly..."'
            className={cn(
              'min-h-[100px] resize-none text-center',
              'bg-transparent border-none',
              'font-serif text-lg',
              'focus:ring-0 focus:border-none',
              'placeholder:text-muted-foreground/50'
            )}
            maxLength={200}
          />
        </div>

        <div className="flex justify-center mt-2">
          <span className="text-xs text-muted-foreground">
            {value?.length || 0}/200 characters
          </span>
        </div>
      </motion.div>

      <p className="text-xs text-muted-foreground text-center italic">
        What line from this book would you want to see every day?
      </p>
    </div>
  );
}
