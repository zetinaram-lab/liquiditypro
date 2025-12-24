import { OrderBlock } from '@/hooks/useMarketData';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface OrderBlockPanelProps {
  orderBlocks: OrderBlock[];
  currentPrice: number;
}

export const OrderBlockPanel = ({ orderBlocks, currentPrice }: OrderBlockPanelProps) => {
  const bullishBlocks = orderBlocks.filter(ob => ob.type === 'bullish');
  const bearishBlocks = orderBlocks.filter(ob => ob.type === 'bearish');

  const getDistanceFromPrice = (block: OrderBlock) => {
    const midPrice = (block.priceHigh + block.priceLow) / 2;
    return ((currentPrice - midPrice) / midPrice * 100);
  };

  return (
    <div className="trading-card p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="indicator-label">Active Order Blocks</span>
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-muted-foreground">{orderBlocks.length} zones</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Demand Zones */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-bullish" />
            <span className="text-xs font-medium text-bullish">Demand Zones</span>
          </div>
          <div className="space-y-2">
            {bullishBlocks.length > 0 ? (
              bullishBlocks.map(block => {
                const distance = getDistanceFromPrice(block);
                return (
                  <div
                    key={block.id}
                    className="order-block-bullish p-2 rounded-r"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs text-bullish">
                        ${block.priceLow.toFixed(2)} - ${block.priceHigh.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground">
                        {distance > 0 ? '+' : ''}{distance.toFixed(2)}% from price
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
              <p className="text-xs text-muted-foreground italic">No active demand zones</p>
            )}
          </div>
        </div>

        {/* Supply Zones */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-bearish" />
            <span className="text-xs font-medium text-bearish">Supply Zones</span>
          </div>
          <div className="space-y-2">
            {bearishBlocks.length > 0 ? (
              bearishBlocks.map(block => {
                const distance = getDistanceFromPrice(block);
                return (
                  <div
                    key={block.id}
                    className="order-block-bearish p-2 rounded-r"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs text-bearish">
                        ${block.priceLow.toFixed(2)} - ${block.priceHigh.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground">
                        {distance > 0 ? '+' : ''}{distance.toFixed(2)}% from price
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
              <p className="text-xs text-muted-foreground italic">No active supply zones</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
