'use client';

import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookPrompts } from '@/types';

interface WeatherPickerProps {
  value: BookPrompts['weather'];
  onChange: (value: BookPrompts['weather']) => void;
  label?: string;
}

const weatherOptions = [
  { value: 'sunny' as const, icon: Sun, label: 'Sunny', emoji: '☀️' },
  { value: 'cloudy' as const, icon: Cloud, label: 'Cloudy', emoji: '☁️' },
  { value: 'rainy' as const, icon: CloudRain, label: 'Rainy', emoji: '🌧️' },
  { value: 'stormy' as const, icon: CloudLightning, label: 'Stormy', emoji: '⛈️' },
  { value: 'snowy' as const, icon: CloudSnow, label: 'Snowy', emoji: '❄️' },
  { value: 'foggy' as const, icon: CloudFog, label: 'Foggy', emoji: '🌫️' },
];

export function WeatherPicker({ value, onChange, label = 'What weather matches this book?' }: WeatherPickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <div className="flex flex-wrap gap-2">
        {weatherOptions.map((weather) => {
          const isSelected = value === weather.value;
          const Icon = weather.icon;

          return (
            <motion.button
              key={weather.value}
              type="button"
              onClick={() => onChange(isSelected ? null : weather.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all',
                isSelected
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-card border-border hover:border-muted-foreground/50 text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  y: isSelected && weather.value === 'rainy' ? [0, 2, 0] : 0,
                  rotate: isSelected && weather.value === 'stormy' ? [0, 5, -5, 0] : 0,
                }}
                transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0, repeatDelay: 0.5 }}
              >
                <Icon className="h-4 w-4" />
              </motion.div>
              <span className="text-sm font-medium">{weather.label}</span>
              <span>{weather.emoji}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
