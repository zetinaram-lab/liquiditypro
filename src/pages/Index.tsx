// ============================================
// Main Trading Dashboard - Index Page
// v1.3.0 - With REAL market data from Finnhub API
// ============================================

import { memo, useMemo } from 'react';
import { useMarketDataWithRealPrice } from '@/hooks/useRealMarketData';
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PriceHeader } from '@/components/PriceHeader';
import { CandlestickChart } from '@/components/CandlestickChart';
import { RSIIndicator } from '@/components/RSIIndicator';
import { BullsBearsPower } from '@/components/BullsBearsPower';
import { MarketPulse } from '@/components/MarketPulse';
import { OrderBlockPanel } from '@/components/OrderBlockPanel';
import { EconomicCalendar } from '@/components/EconomicCalendar';
import { TimeframeSelector } from '@/components/TimeframeSelector';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { MobileDashboard } from '@/components/MobileDashboard';
import { Footer } from '@/components/Footer';
import {
  ChartSkeleton,
  IndicatorSkeleton,
  OrderBlockSkeleton,
  NewsFeedSkeleton,
  CalendarSkeleton,
} from '@/components/SkeletonLoaders';

// Memoized chart header
const ChartHeader = memo(({ 
  timeframe, 
  onTimeframeChange,
  isChanging
}: { 
  timeframe: string; 
  onTimeframeChange: (tf: any) => void;
  isChanging: boolean;
}) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <h2 className="text-sm font-semibold text-foreground">XAU/USD • {timeframe}</h2>
      {isChanging && (
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      )}
    </div>
    <div className="flex items-center gap-4">
      <TimeframeSelector 
        selected={timeframe as any} 
        onChange={onTimeframeChange}
        disabled={isChanging}
      />
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Smart Money Concepts</span>
        <span className="w-2 h-2 rounded-full bg-primary pulse-live" />
      </div>
    </div>
  </div>
));
ChartHeader.displayName = 'ChartHeader';

// Loading skeleton
const LoadingSkeleton = ({ isMobile }: { isMobile: boolean }) => (
  <div className="min-h-screen bg-background grid-pattern">
    <div className="trading-card border-b border-border px-6 py-4">
      <div className="h-14 animate-pulse bg-secondary rounded" />
    </div>
    {isMobile ? (
      <div className="p-4 space-y-4">
        <ChartSkeleton />
        <IndicatorSkeleton />
      </div>
    ) : (
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
    )}
  </div>
);

const Dashboard = () => {
  const isMobile = useIsMobile();
  
  // Use real market data from Finnhub API
  const data = useMarketDataWithRealPrice();
  
  const isLoading = false;
  const isChangingTimeframe = false;
  const selectedTimeframe = data.selectedTimeframe;
  const isConnected = true;
  const error = null;
  
  // Dummy functions for compatibility
  const changeTimeframe = () => {};
  const reconnect = () => {};

  // Memoize stable references
  const chartData = useMemo(() => ({
    candles: data?.candles || [],
    orderBlocks: data?.orderBlocks || [],
  }), [data?.candles, data?.orderBlocks]);

  if (isLoading || !data) {
    return <LoadingSkeleton isMobile={isMobile} />;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <MobileDashboard
        data={data}
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={changeTimeframe}
        isConnected={isConnected}
        error={error}
        onReconnect={reconnect}
        isChangingTimeframe={isChangingTimeframe}
      />
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background grid-pattern flex flex-col">
      {/* Connection Status */}
      <ConnectionStatus 
        isConnected={isConnected} 
        error={error} 
        onReconnect={reconnect} 
      />

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
      <div className="flex flex-1 h-[calc(100vh-200px)]">
        {/* Left Section - Charts */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {/* Main Chart */}
          <div className="trading-card flex-1 min-h-0 p-4 relative">
            <ChartHeader 
              timeframe={selectedTimeframe} 
              onTimeframeChange={changeTimeframe}
              isChanging={isChangingTimeframe}
            />
            <div className={`transition-opacity duration-200 ${isChangingTimeframe ? 'opacity-50' : 'opacity-100'}`}>
              <CandlestickChart 
                candles={chartData.candles} 
                orderBlocks={chartData.orderBlocks} 
              />
            </div>
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

      {/* Footer */}
      <Footer />
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
