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
      {/* Real Data Indicator - Updated for v1.3.0 */}
      <div className="mb-3 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-green-100">
          <strong className="font-semibold">Live Market Data:</strong> Real-time gold prices from Finnhub API (XAU/USD). Updates every 5 seconds. Free tier: 60 req/min.
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
