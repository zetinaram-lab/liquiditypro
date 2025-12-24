// ============================================
// Timeframe Selector Component
// ============================================

import type { Timeframe } from '@/types/trading';
import { useLanguage } from '@/contexts/LanguageContext';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D'];

export const TimeframeSelector = ({ selected, onChange }: TimeframeSelectorProps) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-border/50">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
            selected === tf
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          {tf}
        </button>
      ))}
    </div>
  );
};
