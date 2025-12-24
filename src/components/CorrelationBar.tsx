// ============================================
// Correlation Bar - DXY & US10Y with Sparklines
// ============================================

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { CorrelationData } from '@/types/trading';
import { useLanguage } from '@/contexts/LanguageContext';

interface CorrelationBarProps {
  correlations: CorrelationData[];
}

export const CorrelationBar = ({ correlations }: CorrelationBarProps) => {
  const { t } = useLanguage();

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-bullish" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-bearish" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const getCorrelationColor = (correlation: CorrelationData['correlation']) => {
    switch (correlation) {
      case 'negative':
        return 'text-bearish';
      case 'positive':
        return 'text-bullish';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex items-center gap-6">
      {correlations.map((item) => (
        <div
          key={item.symbol}
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50"
        >
          {/* Symbol & Name */}
          <div className="min-w-[70px]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground">{item.symbol}</span>
              <span
                className={`text-[9px] uppercase font-medium px-1 py-0.5 rounded ${
                  item.correlation === 'negative'
                    ? 'bg-bearish/10 text-bearish'
                    : 'bg-bullish/10 text-bullish'
                }`}
              >
                {item.correlation === 'negative' ? t.correlation.inverse : t.correlation.positive}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">{item.name}</span>
          </div>

          {/* Sparkline */}
          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={item.sparklineData.map((value, i) => ({ value, index: i }))}
                margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
              >
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={item.change >= 0 ? 'hsl(160 84% 39%)' : 'hsl(350 89% 60%)'}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Value & Change */}
          <div className="text-right">
            <div className="font-mono text-sm text-foreground">
              {item.symbol === 'US10Y' ? `${item.value.toFixed(2)}%` : item.value.toFixed(2)}
            </div>
            <div
              className={`flex items-center justify-end gap-0.5 ${
                item.change >= 0 ? 'text-bullish' : 'text-bearish'
              }`}
            >
              {getChangeIcon(item.change)}
              <span className="font-mono text-[10px]">
                {item.change >= 0 ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
