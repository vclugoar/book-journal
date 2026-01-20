'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, ChevronDown, FileText, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ImportDropdownProps {
  onImportGoodreads: () => void;
  onRestoreBackup: () => void;
}

export function ImportDropdown({ onImportGoodreads, onRestoreBackup }: ImportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleImportGoodreads = () => {
    onImportGoodreads();
    setIsOpen(false);
  };

  const handleRestoreBackup = () => {
    onRestoreBackup();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        Import
        <ChevronDown className={cn('h-3 w-3 transition-transform', isOpen && 'rotate-180')} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'w-64 rounded-lg shadow-lg',
              'bg-card border border-border',
              'overflow-hidden'
            )}
          >
            <div className="p-1">
              <button
                onClick={handleImportGoodreads}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-md',
                  'text-left hover:bg-muted transition-colors'
                )}
              >
                <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm text-foreground">Import from Goodreads</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Upload a Goodreads CSV export
                  </div>
                </div>
              </button>
              <button
                onClick={handleRestoreBackup}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-md',
                  'text-left hover:bg-muted transition-colors'
                )}
              >
                <RotateCcw className="h-5 w-5 text-sage mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm text-foreground">Restore from Backup</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Import a Moodmark backup file
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
