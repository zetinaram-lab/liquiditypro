import { useMarketData } from '@/hooks/useMarketData';
import { PriceHeader } from '@/components/PriceHeader';
import { CandlestickChart } from '@/components/CandlestickChart';
import { RSIIndicator } from '@/components/RSIIndicator';
import { BullsBearsPower } from '@/components/BullsBearsPower';
import { MarketPulse } from '@/components/MarketPulse';
import { OrderBlockPanel } from '@/components/OrderBlockPanel';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { data, isLoading } = useMarketData();

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background grid-pattern flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Price Header */}
      <PriceHeader
        currentPrice={data.currentPrice}
        priceChange={data.priceChange}
        priceChangePercent={data.priceChangePercent}
        spread={data.spread}
        dayHigh={data.dayHigh}
        dayLow={data.dayLow}
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Section - Charts */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {/* Main Chart */}
          <div className="trading-card flex-1 min-h-0 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">XAU/USD • 15m</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Smart Money Concepts</span>
                <span className="w-2 h-2 rounded-full bg-primary pulse-live" />
              </div>
            </div>
            <CandlestickChart 
              candles={data.candles} 
              orderBlocks={data.orderBlocks} 
            />
          </div>

          {/* Order Block Panel */}
          <OrderBlockPanel 
            orderBlocks={data.orderBlocks}
            currentPrice={data.currentPrice}
          />

          {/* Indicators Panel */}
          <div className="grid grid-cols-2 gap-4">
            <RSIIndicator data={data.rsiData} />
            <BullsBearsPower data={data.bullBearData} />
          </div>
        </div>

        {/* Right Section - Market Pulse */}
        <div className="w-96 border-l border-border p-4">
          <MarketPulse news={data.news} />
        </div>
      </div>
    </div>
  );
};

export default Index;
