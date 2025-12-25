// ============================================
// Timeframe Selector Component - IMPROVED v2
// ============================================

import { useState, useCallback, useRef } from 'react';
import type { Timeframe } from '@/types/trading';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onChange: (timeframe: Timeframe) => void;
  disabled?: boolean;
}

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D'];

export const TimeframeSelector = ({ selected, onChange, disabled = false }: TimeframeSelectorProps) => {
  const [isChanging, setIsChanging] = useState(false);
  const lastChangeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleChange = useCallback(async (tf: Timeframe) => {
    // Prevenir clics múltiples y mismo timeframe
    if (isChanging || tf === selected || disabled) {
      return;
    }
    
    // Throttling agresivo: mínimo 500ms entre cambios
    const now = Date.now();
    const timeSinceLastChange = now - lastChangeRef.current;
    if (timeSinceLastChange < 500) {
      console.log('Cambio de timeframe bloqueado: demasiado rápido');
      return;
    }
    
    setIsChanging(true);
    lastChangeRef.current = now;
    
    try {
      // Llamar onChange inmediatamente
      onChange(tf);
      
      // Esperar antes de permitir otro cambio
      timeoutRef.current = setTimeout(() => {
        setIsChanging(false);
      }, 600);
      
    } catch (err) {
      console.error('Error changing timeframe:', err);
      setIsChanging(false);
    }
  }, [isChanging, selected, disabled, onChange]);

  // Cleanup
  useCallback(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-border/50">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          onClick={() => handleChange(tf)}
          disabled={isChanging || disabled}
          className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
            selected === tf
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          } ${
            isChanging || disabled
              ? 'opacity-50 cursor-not-allowed pointer-events-none' 
              : 'cursor-pointer'
          }`}
          aria-label={`Cambiar a timeframe ${tf}`}
          aria-pressed={selected === tf}
          aria-disabled={isChanging || disabled}
        >
          {tf}
        </button>
      ))}
      {isChanging && (
        <div className="ml-2 flex items-center gap-1">
          <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
