// ============================================
// Updated Price Header with Language & Tools
// ============================================

import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { RiskCalculator } from '@/components/RiskCalculator';
import { CorrelationBar } from '@/components/CorrelationBar';
import type { CorrelationData } from '@/types/trading';

interface PriceHeaderProps {
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
  correlations: CorrelationData[];
}

export const PriceHeader = ({
  currentPrice,
  priceChange,
  priceChangePercent,
  spread,
  dayHigh,
  dayLow,
  correlations,
}: PriceHeaderProps) => {
  const { t } = useLanguage();
  const isPositive = priceChange >= 0;

  return (
    <header className="trading-card border-b border-border px-6 py-4">
      {/* Demo Data Disclaimer */}
      <div className="mb-3 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-xs text-amber-200">
          <strong className="font-semibold">Demo Mode:</strong> Simulated data for demonstration purposes. Not real market prices. For real trading, use certified platforms.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        {/* Main Price Display */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-xl font-bold text-background">Au</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">XAU/USD</h1>
                <span className="text-xs text-muted-foreground">{t.header.goldSpot}</span>
              </div>
            </div>
          </div>

          {/* Current Price */}
          <div className="flex items-baseline gap-3">
            <span className="price-display text-3xl text-foreground">
              ${currentPrice.toFixed(2)}
            </span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-bullish' : 'text-bearish'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-mono text-sm font-medium">
                {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Correlation Bar */}
          <div className="hidden xl:block">
            <CorrelationBar correlations={correlations} />
          </div>
        </div>

        {/* Market Stats & Tools */}
        <div className="flex items-center gap-6">
          {/* Market Stats */}
          <div className="flex items-center gap-6">
            {/* Spread */}
            <div className="text-center">
              <span className="indicator-label block">{t.header.spread}</span>
              <span className="font-mono text-sm text-foreground">{spread.toFixed(2)}</span>
            </div>

            {/* Day High */}
            <div className="text-center">
              <span className="indicator-label block">{t.header.dayHigh}</span>
              <span className="font-mono text-sm text-bullish">${dayHigh.toFixed(2)}</span>
            </div>

            {/* Day Low */}
            <div className="text-center">
              <span className="indicator-label block">{t.header.dayLow}</span>
              <span className="font-mono text-sm text-bearish">${dayLow.toFixed(2)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-border" />

          {/* Tools */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <RiskCalculator />
            <LanguageToggle />
          </div>

          {/* Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bullish/10 border border-bullish/30 flex-shrink-0">
            <Activity className="w-3.5 h-3.5 text-bullish pulse-live" />
            <span className="text-xs font-medium text-bullish whitespace-nowrap">{t.header.live}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
