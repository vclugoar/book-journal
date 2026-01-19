'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  variant?: 'default' | 'warmth' | 'magic';
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, label, showValue, valueFormatter, variant = 'default', value, ...props }, ref) => {
  const currentValue = value?.[0] ?? props.defaultValue?.[0] ?? 0;

  const trackVariants = {
    default: 'bg-muted',
    warmth: 'bg-gradient-to-r from-blue-200 via-orange-200 to-red-300',
    magic: 'bg-gradient-to-r from-sage via-golden to-rose',
  };

  const rangeVariants = {
    default: 'bg-primary',
    warmth: 'bg-gradient-to-r from-blue-400 via-orange-400 to-red-500',
    magic: 'bg-gradient-to-r from-sage-dark via-golden to-rose-dark',
  };

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-sm font-medium text-foreground">{label}</label>
          )}
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {valueFormatter ? valueFormatter(currentValue) : currentValue}
            </span>
          )}
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          className
        )}
        value={value}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            'relative h-2 w-full grow overflow-hidden rounded-full',
            trackVariants[variant]
          )}
        >
          <SliderPrimitive.Range
            className={cn(
              'absolute h-full',
              rangeVariants[variant]
            )}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            'block h-5 w-5 rounded-full border-2 border-primary bg-card shadow-md',
            'ring-offset-background transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            'hover:scale-110 active:scale-95 transition-transform'
          )}
        />
      </SliderPrimitive.Root>
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
