'use client';

import { motion } from 'framer-motion';
import { TrainFront, AlertTriangle, HelpCircle } from 'lucide-react';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils';

interface MissedMyStopRiskProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function MissedMyStopRisk({ value, onChange, label = 'Missed My Stop Risk' }: MissedMyStopRiskProps) {
  const getDescription = (val: number) => {
    if (val < 20) return 'Easy to put down';
    if (val < 40) return 'Aware of surroundings';
    if (val < 60) return 'Might look up occasionally';
    if (val < 80) return 'What stop?';
    return 'Called in sick to finish';
  };

  const getRiskLevel = (val: number) => {
    if (val < 20) return 'Low';
    if (val < 40) return 'Mild';
    if (val < 60) return 'Moderate';
    if (val < 80) return 'High';
    return 'Extreme';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-1">
          {label}
          <span title="How absorbing was it? Would you miss your train stop?">
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
          </span>
        </label>
        <span className="text-sm text-muted-foreground italic">{getDescription(value)}</span>
      </div>

      <div className="relative">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: value < 30 ? 1 : 0.9, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TrainFront className="h-5 w-5 text-sage" />
          </motion.div>

          <div className="flex-1 relative">
            <Slider
              value={[value]}
              onValueChange={([val]) => onChange(val)}
              min={0}
              max={100}
              step={1}
              className="relative z-10"
            />

            {/* Risk meter background */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
              <div className="h-2 w-full rounded-full overflow-hidden bg-muted">
                <motion.div
                  className={cn(
                    'h-full transition-colors duration-300',
                    value < 40 ? 'bg-sage' : value < 70 ? 'bg-golden' : 'bg-rose'
                  )}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          </div>

          <motion.div
            animate={{
              scale: value > 70 ? [1, 1.2, 1] : 1,
              rotate: value > 80 ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              repeat: value > 70 ? Infinity : 0,
              repeatDelay: 1,
            }}
          >
            <AlertTriangle
              className={cn(
                'h-5 w-5 transition-colors duration-300',
                value > 70 ? 'text-rose' : 'text-muted-foreground'
              )}
            />
          </motion.div>
        </div>

        {/* Risk level badge */}
        <motion.div
          className={cn(
            'mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium',
            value < 40 ? 'bg-sage/20 text-sage-dark' :
            value < 70 ? 'bg-golden/20 text-golden-dark' :
            'bg-rose/20 text-rose-dark'
          )}
          layout
        >
          {getRiskLevel(value)} Risk
        </motion.div>
      </div>
    </div>
  );
}
