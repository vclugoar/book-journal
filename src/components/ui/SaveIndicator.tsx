'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Cloud } from 'lucide-react';
import { formatRelativeDate } from '@/lib/utils';

interface SaveIndicatorProps {
  isSaving: boolean;
  lastSaved: string | null;
}

export function SaveIndicator({ isSaving, lastSaved }: SaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-1.5"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </motion.div>
        ) : lastSaved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-1.5"
          >
            <Cloud className="h-4 w-4" />
            <span>Saved {formatRelativeDate(lastSaved)}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
