import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface PriceHeaderProps {
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
}

export const PriceHeader = ({
  currentPrice,
  priceChange,
  priceChangePercent,
  spread,
  dayHigh,
  dayLow,
}: PriceHeaderProps) => {
  const isPositive = priceChange >= 0;

  return (
    <header className="trading-card border-b border-border px-6 py-4">
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
                <span className="text-xs text-muted-foreground">Gold Spot</span>
              </div>
            </div>
          </div>

          {/* Current Price */}
          <div className="flex items-baseline gap-3">
            <span className="price-display text-3xl text-foreground">
              ${currentPrice.toFixed(2)}
            </span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-bullish' : 'text-bearish'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-mono text-sm font-medium">
                {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="flex items-center gap-8">
          {/* Spread */}
          <div className="text-center">
            <span className="indicator-label block">Spread</span>
            <span className="font-mono text-sm text-foreground">{spread.toFixed(2)}</span>
          </div>

          {/* Day High */}
          <div className="text-center">
            <span className="indicator-label block">Day High</span>
            <span className="font-mono text-sm text-bullish">${dayHigh.toFixed(2)}</span>
          </div>

          {/* Day Low */}
          <div className="text-center">
            <span className="indicator-label block">Day Low</span>
            <span className="font-mono text-sm text-bearish">${dayLow.toFixed(2)}</span>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bullish/10 border border-bullish/30">
            <Activity className="w-3.5 h-3.5 text-bullish pulse-live" />
            <span className="text-xs font-medium text-bullish">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
