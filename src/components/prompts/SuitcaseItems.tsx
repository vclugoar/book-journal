'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuitcaseItemsProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
}

const suggestedItems = [
  'cozy sweater', 'journal', 'camera', 'flashlight', 'snacks',
  'map', 'compass', 'blanket', 'tea', 'book of poems',
  'walking shoes', 'umbrella', 'sketchbook', 'binoculars', 'lantern',
];

export function SuitcaseItems({ value, onChange, label = 'What would you pack if you lived in this book?' }: SuitcaseItemsProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addItem = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !value.includes(trimmed) && value.length < 5) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const removeItem = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeItem(value[value.length - 1]);
    }
  };

  const filteredSuggestions = suggestedItems.filter(
    (item) =>
      !value.includes(item) &&
      item.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">🧳</span>
        <label className="text-sm font-medium text-foreground">{label}</label>
      </div>

      <div className="space-y-2">
        {/* Selected items */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {value.map((item) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-golden/20 text-golden-dark dark:text-golden text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="hover:text-golden transition-colors"
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
                placeholder={value.length === 0 ? 'Pack an item...' : 'Add more...'}
                className={cn(
                  'px-3 py-1 rounded-full border border-border bg-input text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-golden/50',
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
                    {filteredSuggestions.slice(0, 6).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => addItem(item)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Plus className="h-3 w-3" />
                        {item}
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
            {suggestedItems
              .filter((s) => !value.includes(s))
              .slice(0, 5)
              .map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => addItem(item)}
                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  + {item}
                </button>
              ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {value.length}/5 items packed
        </p>
      </div>
    </div>
  );
}
