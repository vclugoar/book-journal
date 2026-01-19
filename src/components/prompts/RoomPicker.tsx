'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RoomPickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

const rooms = [
  { value: 'library', emoji: '📚', label: 'Library' },
  { value: 'bedroom', emoji: '🛏️', label: 'Bedroom' },
  { value: 'kitchen', emoji: '🍳', label: 'Kitchen' },
  { value: 'living-room', emoji: '🛋️', label: 'Living Room' },
  { value: 'garden', emoji: '🌻', label: 'Garden' },
  { value: 'attic', emoji: '🪟', label: 'Attic' },
  { value: 'basement', emoji: '🔦', label: 'Basement' },
  { value: 'sunroom', emoji: '☀️', label: 'Sunroom' },
];

export function RoomPicker({ value, onChange, label = 'If this book were a room in a house, which would it be?' }: RoomPickerProps) {
  const [customValue, setCustomValue] = useState('');
  const isCustom = value && !rooms.find((r) => r.value === value);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <div className="grid grid-cols-4 gap-2">
        {rooms.map((room) => {
          const isSelected = value === room.value;

          return (
            <motion.button
              key={room.value}
              type="button"
              onClick={() => onChange(isSelected ? null : room.value)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all',
                isSelected
                  ? 'bg-sage/20 border-sage text-sage-dark'
                  : 'bg-card border-border hover:border-muted-foreground/50 text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">{room.emoji}</span>
                <span className="text-xs font-medium">{room.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom room input */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Or describe your own:</span>
        <input
          type="text"
          value={isCustom ? value : customValue}
          onChange={(e) => {
            setCustomValue(e.target.value);
            if (e.target.value) {
              onChange(e.target.value);
            }
          }}
          placeholder="A secret reading nook..."
          className={cn(
            'flex-1 px-3 py-1.5 rounded-lg border border-border bg-input text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring',
            'placeholder:text-muted-foreground'
          )}
        />
      </div>

      <AnimatePresence>
        {value && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-muted-foreground italic"
          >
            This book lives in the {rooms.find((r) => r.value === value)?.label.toLowerCase() || value}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
