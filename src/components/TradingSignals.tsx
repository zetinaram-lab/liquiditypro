// ============================================
// Trading Signals Component
// ============================================

import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { useTradingSignals } from '@/hooks/useTradingSignals';
import { RSIData, BullBearData, CandleData } from '@/types/trading';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface TradingSignalsProps {
  rsiData: RSIData[];
  bullBearData: BullBearData[];
  candles: CandleData[];
}

export const TradingSignals = ({ rsiData, bullBearData, candles }: TradingSignalsProps) => {
  const signal = useTradingSignals({ rsiData, bullBearData, candles });

  const getSignalColor = () => {
    if (signal.type === 'buy') return 'text-bullish';
    if (signal.type === 'sell') return 'text-bearish';
    return 'text-muted-foreground';
  };

  const getSignalIcon = () => {
    if (signal.type === 'buy') return <TrendingUp className="w-5 h-5" />;
    if (signal.type === 'sell') return <TrendingDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  };

  const getConfidenceColor = () => {
    if (signal.confidence >= 70) return 'bg-bullish';
    if (signal.confidence >= 50) return 'bg-yellow-500';
    return 'bg-muted';
  };

  return (
    <Card className="trading-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="indicator-label">Señales de Trading</span>
        </div>
        <Badge
          variant={signal.type === 'buy' ? 'default' : signal.type === 'sell' ? 'destructive' : 'secondary'}
          className="uppercase"
        >
          {signal.type === 'buy' ? 'Compra' : signal.type === 'sell' ? 'Venta' : 'Neutral'}
        </Badge>
      </div>

      {/* Main Signal */}
      <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg bg-secondary/50 ${getSignalColor()}`}>
        {getSignalIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Fuerza de Señal</span>
            <span className="text-xs font-mono">{signal.strength.toFixed(0)}%</span>
          </div>
          <Progress value={signal.strength} className="h-2" />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3">{signal.description}</p>

      {/* Confidence */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Confianza</span>
          <span className="text-xs font-mono">{signal.confidence.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getConfidenceColor()}`}
            style={{ width: `${signal.confidence}%` }}
          />
        </div>
      </div>

      {/* Indicators Breakdown */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">Análisis de Indicadores</div>
        
        {/* RSI */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">RSI</span>
          <div className="flex items-center gap-2">
            <span className="font-mono">{signal.indicators.rsi.value.toFixed(1)}</span>
            <Badge
              variant="outline"
              className={`text-[10px] ${
                signal.indicators.rsi.signal === 'oversold'
                  ? 'border-bullish text-bullish'
                  : signal.indicators.rsi.signal === 'overbought'
                  ? 'border-bearish text-bearish'
                  : ''
              }`}
            >
              {signal.indicators.rsi.signal === 'oversold'
                ? 'Sobrevendido'
                : signal.indicators.rsi.signal === 'overbought'
                ? 'Sobrecomprado'
                : 'Neutral'}
            </Badge>
          </div>
        </div>

        {/* Bulls vs Bears */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Bulls/Bears</span>
          <div className="flex items-center gap-2">
            <span className="font-mono">{signal.indicators.bullBear.value.toFixed(2)}</span>
            <Badge
              variant="outline"
              className={`text-[10px] ${
                signal.indicators.bullBear.signal === 'bullish'
                  ? 'border-bullish text-bullish'
                  : signal.indicators.bullBear.signal === 'bearish'
                  ? 'border-bearish text-bearish'
                  : ''
              }`}
            >
              {signal.indicators.bullBear.signal === 'bullish'
                ? 'Alcista'
                : signal.indicators.bullBear.signal === 'bearish'
                ? 'Bajista'
                : 'Neutral'}
            </Badge>
          </div>
        </div>

        {/* Momentum */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Momentum</span>
          <div className="flex items-center gap-2">
            <span className="font-mono">{signal.indicators.momentum.value.toFixed(2)}%</span>
            <Badge
              variant="outline"
              className={`text-[10px] ${
                signal.indicators.momentum.signal === 'positive'
                  ? 'border-bullish text-bullish'
                  : signal.indicators.momentum.signal === 'negative'
                  ? 'border-bearish text-bearish'
                  : ''
              }`}
            >
              {signal.indicators.momentum.signal === 'positive'
                ? 'Positivo'
                : signal.indicators.momentum.signal === 'negative'
                ? 'Negativo'
                : 'Neutral'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          Última actualización: {signal.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </Card>
  );
};
