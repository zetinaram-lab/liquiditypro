// ============================================
// Main Trading Dashboard - Index Page
// ============================================

import { useMarketData } from '@/hooks/useMarketData';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PriceHeader } from '@/components/PriceHeader';
import { CandlestickChart } from '@/components/CandlestickChart';
import { RSIIndicator } from '@/components/RSIIndicator';
import { BullsBearsPower } from '@/components/BullsBearsPower';
import { MarketPulse } from '@/components/MarketPulse';
import { OrderBlockPanel } from '@/components/OrderBlockPanel';
import { EconomicCalendar } from '@/components/EconomicCalendar';
import { TimeframeSelector } from '@/components/TimeframeSelector';
import {
  ChartSkeleton,
  IndicatorSkeleton,
  OrderBlockSkeleton,
  NewsFeedSkeleton,
  CalendarSkeleton,
} from '@/components/SkeletonLoaders';

const Dashboard = () => {
  const { data, isLoading, selectedTimeframe, changeTimeframe } = useMarketData();

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background grid-pattern">
        <div className="trading-card border-b border-border px-6 py-4">
          <div className="h-14 animate-pulse bg-secondary rounded" />
        </div>
        <div className="flex h-[calc(100vh-80px)]">
          <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
            <ChartSkeleton />
            <OrderBlockSkeleton />
            <div className="grid grid-cols-2 gap-4">
              <IndicatorSkeleton />
              <IndicatorSkeleton />
            </div>
          </div>
          <div className="w-96 border-l border-border p-4 flex flex-col gap-4">
            <CalendarSkeleton />
            <NewsFeedSkeleton />
          </div>
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
        correlations={data.correlations}
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Section - Charts */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {/* Main Chart */}
          <div className="trading-card flex-1 min-h-0 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">XAU/USD • {selectedTimeframe}</h2>
              <div className="flex items-center gap-4">
                <TimeframeSelector selected={selectedTimeframe} onChange={changeTimeframe} />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Smart Money Concepts</span>
                  <span className="w-2 h-2 rounded-full bg-primary pulse-live" />
                </div>
              </div>
            </div>
            <CandlestickChart candles={data.candles} orderBlocks={data.orderBlocks} />
          </div>

          {/* Order Block Panel */}
          <OrderBlockPanel
            orderBlocks={data.orderBlocks}
            currentPrice={data.currentPrice}
            timeframe={selectedTimeframe}
          />

          {/* Indicators Panel */}
          <div className="grid grid-cols-2 gap-4">
            <RSIIndicator data={data.rsiData} />
            <BullsBearsPower data={data.bullBearData} />
          </div>
        </div>

        {/* Right Section - Calendar & Market Pulse */}
        <div className="w-96 border-l border-border p-4 flex flex-col gap-4 overflow-hidden">
          <EconomicCalendar events={data.economicEvents} />
          <div className="flex-1 min-h-0">
            <MarketPulse news={data.news} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <Dashboard />
    </LanguageProvider>
  );
};

export default Index;
