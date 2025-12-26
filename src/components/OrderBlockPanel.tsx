// ============================================
// Updated Order Block Panel with i18n
// ============================================

import type { OrderBlock, Timeframe } from '@/types/trading';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderBlockPanelProps {
  orderBlocks: OrderBlock[];
  currentPrice: number;
  timeframe: Timeframe;
}

// Map timeframe to display label
const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  '1m': '1M',
  '5m': '5M',
  '15m': '15M',
  '1h': '1H',
  '4h': '4H',
  '1D': '1D',
};

export const OrderBlockPanel = ({ orderBlocks, currentPrice, timeframe }: OrderBlockPanelProps) => {
  const { t } = useLanguage();
  const bullishBlocks = orderBlocks.filter((ob) => ob.type === 'bullish');
  const bearishBlocks = orderBlocks.filter((ob) => ob.type === 'bearish');

  const getDistanceFromPrice = (block: OrderBlock) => {
    const midPrice = (block.priceHigh + block.priceLow) / 2;
    return ((currentPrice - midPrice) / midPrice) * 100;
  };

  return (
    <div className="trading-card p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="indicator-label">{t.orderBlocks.title}</span>
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-muted-foreground">
            {orderBlocks.length} {t.orderBlocks.zones}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Demand Zones */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-bullish" />
            <span className="text-xs font-medium text-bullish">{t.orderBlocks.demandZones}</span>
          </div>
          <div className="space-y-1.5">
            {bullishBlocks.length > 0 ? (
              bullishBlocks.map((block) => {
                const distance = getDistanceFromPrice(block);
                return (
                  <div key={block.id} className="order-block-bullish p-1.5 rounded-r">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs text-bullish">
                        ${block.priceLow.toFixed(2)} - ${block.priceHigh.toFixed(2)}
                      </span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-bullish/20 text-bullish font-medium">
                        {TIMEFRAME_LABELS[timeframe]} {t.orderBlocks.bullishOB}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground">
                        {distance > 0 ? '+' : ''}
                        {distance.toFixed(2)}% {t.orderBlocks.fromPrice}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="h-1 w-12 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-bullish rounded-full"
                            style={{ width: `${block.strength}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-bullish">{block.strength.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-muted-foreground italic">{t.orderBlocks.noActiveZones}</p>
            )}
          </div>
        </div>

        {/* Supply Zones */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-bearish" />
            <span className="text-xs font-medium text-bearish">{t.orderBlocks.supplyZones}</span>
          </div>
          <div className="space-y-1.5">
            {bearishBlocks.length > 0 ? (
              bearishBlocks.map((block) => {
                const distance = getDistanceFromPrice(block);
                return (
                  <div key={block.id} className="order-block-bearish p-1.5 rounded-r">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs text-bearish">
                        ${block.priceLow.toFixed(2)} - ${block.priceHigh.toFixed(2)}
                      </span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-bearish/20 text-bearish font-medium">
                        {TIMEFRAME_LABELS[timeframe]} {t.orderBlocks.bearishOB}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground">
                        {distance > 0 ? '+' : ''}
                        {distance.toFixed(2)}% {t.orderBlocks.fromPrice}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="h-1 w-12 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-bearish rounded-full"
                            style={{ width: `${block.strength}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-bearish">{block.strength.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-muted-foreground italic">{t.orderBlocks.noActiveZones}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
