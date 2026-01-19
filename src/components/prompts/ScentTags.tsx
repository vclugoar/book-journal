'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScentTagsProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
}

const suggestedScents = [
  'Old books', 'Fresh rain', 'Coffee', 'Pine trees', 'Ocean breeze',
  'Lavender', 'Cinnamon', 'Woodsmoke', 'Fresh bread', 'Citrus',
  'Rose', 'Vanilla', 'Cedar', 'Jasmine', 'Petrichor',
];

export function ScentTags({ value, onChange, label = 'What scents remind you of this book?' }: ScentTagsProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addScent = (scent: string) => {
    const trimmed = scent.trim();
    if (trimmed && !value.includes(trimmed) && value.length < 5) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const removeScent = (scent: string) => {
    onChange(value.filter((s) => s !== scent));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addScent(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeScent(value[value.length - 1]);
    }
  };

  const filteredSuggestions = suggestedScents.filter(
    (scent) =>
      !value.includes(scent) &&
      scent.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <div className="space-y-2">
        {/* Selected scents */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {value.map((scent) => (
              <motion.span
                key={scent}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose/20 text-rose-dark text-sm"
              >
                {scent}
                <button
                  type="button"
                  onClick={() => removeScent(scent)}
                  className="hover:text-rose transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>

          {/* Input */}
          {value.length < 5 && (
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={value.length === 0 ? 'Add a scent...' : 'Add more...'}
                className={cn(
                  'px-3 py-1 rounded-full border border-border bg-input text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  'placeholder:text-muted-foreground',
                  'w-32'
                )}
              />

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-1 left-0 w-48 bg-card border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto"
                  >
                    {filteredSuggestions.slice(0, 6).map((scent) => (
                      <button
                        key={scent}
                        type="button"
                        onClick={() => addScent(scent)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Plus className="h-3 w-3" />
                        {scent}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Quick add suggestions */}
        {value.length < 5 && (
          <div className="flex flex-wrap gap-1">
            {suggestedScents
              .filter((s) => !value.includes(s))
              .slice(0, 5)
              .map((scent) => (
                <button
                  key={scent}
                  type="button"
                  onClick={() => addScent(scent)}
                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  + {scent}
                </button>
              ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {value.length}/5 scents selected
        </p>
      </div>
    </div>
  );
}
