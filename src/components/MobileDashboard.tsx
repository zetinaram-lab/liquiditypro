// ============================================
// Mobile Dashboard - Optimized for smartphones
// ============================================

import { memo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PriceHeader } from '@/components/PriceHeader';
import { CandlestickChart } from '@/components/CandlestickChart';
import { RSIIndicator } from '@/components/RSIIndicator';
import { BullsBearsPower } from '@/components/BullsBearsPower';
import { MarketPulse } from '@/components/MarketPulse';
import { OrderBlockPanel } from '@/components/OrderBlockPanel';
import { EconomicCalendar } from '@/components/EconomicCalendar';
import { TimeframeSelector } from '@/components/TimeframeSelector';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { RiskCalculator } from '@/components/RiskCalculator';
import { LanguageToggle } from '@/components/LanguageToggle';
import type { MarketData, Timeframe } from '@/types/trading';
import { TrendingUp, Calendar, Newspaper, BarChart3, Calculator, ChevronDown } from 'lucide-react';

interface MobileDashboardProps {
  data: MarketData;
  selectedTimeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  isConnected: boolean;
  error: string | null;
  onReconnect: () => void;
  isChangingTimeframe: boolean;
}

type MobileTab = 'chart' | 'indicators' | 'calendar' | 'news';

const TabButton = memo(({ 
  active, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: any; 
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all ${
      active 
        ? 'bg-primary/20 text-primary' 
        : 'text-muted-foreground hover:bg-secondary/50'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
));
TabButton.displayName = 'TabButton';

const MobilePriceHeader = memo(({ 
  currentPrice, 
  priceChange, 
  priceChangePercent 
}: { 
  currentPrice: number; 
  priceChange: number; 
  priceChangePercent: number;
}) => {
  const isPositive = priceChange >= 0;
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">Au</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">XAU/USD</h1>
          <p className="text-[10px] text-muted-foreground">Gold Spot</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-mono font-bold text-foreground">${currentPrice.toFixed(2)}</p>
        <p className={`text-xs font-medium ${isPositive ? 'text-bullish' : 'text-bearish'}`}>
          {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
        </p>
      </div>
    </div>
  );
});
MobilePriceHeader.displayName = 'MobilePriceHeader';

export const MobileDashboard = memo(({
  data,
  selectedTimeframe,
  onTimeframeChange,
  isConnected,
  error,
  onReconnect,
  isChangingTimeframe
}: MobileDashboardProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<MobileTab>('chart');
  const [showOrderBlocks, setShowOrderBlocks] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Connection Status */}
      <ConnectionStatus 
        isConnected={isConnected} 
        error={error} 
        onReconnect={onReconnect} 
      />

      {/* Compact Price Header */}
      <MobilePriceHeader 
        currentPrice={data.currentPrice}
        priceChange={data.priceChange}
        priceChangePercent={data.priceChangePercent}
      />

      {/* Tab Navigation */}
      <div className="flex gap-1 p-2 bg-card/50 border-b border-border">
        <TabButton 
          active={activeTab === 'chart'} 
          onClick={() => setActiveTab('chart')} 
          icon={TrendingUp}
          label="Chart"
        />
        <TabButton 
          active={activeTab === 'indicators'} 
          onClick={() => setActiveTab('indicators')} 
          icon={BarChart3}
          label="Indicators"
        />
        <TabButton 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')} 
          icon={Calendar}
          label={t.economicCalendar.title.split(' ')[0]}
        />
        <TabButton 
          active={activeTab === 'news'} 
          onClick={() => setActiveTab('news')} 
          icon={Newspaper}
          label={t.marketPulse.news}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'chart' && (
          <div className="p-3 space-y-3">
            {/* Timeframe Selector */}
            <div className="flex items-center justify-between">
              <TimeframeSelector 
                selected={selectedTimeframe} 
                onChange={onTimeframeChange}
                disabled={isChangingTimeframe}
              />
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <RiskCalculator />
              </div>
            </div>

            {/* Chart */}
            <div className="trading-card p-3 relative">
              {isChangingTimeframe && (
                <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <CandlestickChart 
                candles={data.candles} 
                orderBlocks={data.orderBlocks} 
              />
            </div>

            {/* Order Blocks Collapsible */}
            <button
              onClick={() => setShowOrderBlocks(!showOrderBlocks)}
              className="w-full flex items-center justify-between p-3 trading-card"
            >
              <span className="text-sm font-medium text-foreground">{t.orderBlocks.title}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showOrderBlocks ? 'rotate-180' : ''}`} />
            </button>
            
            {showOrderBlocks && (
              <OrderBlockPanel
                orderBlocks={data.orderBlocks}
                currentPrice={data.currentPrice}
                timeframe={selectedTimeframe}
              />
            )}
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="p-3 space-y-3">
            <RSIIndicator data={data.rsiData} />
            <BullsBearsPower data={data.bullBearData} />
            
            {/* Correlations */}
            <div className="trading-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t.correlation.title}</h3>
              <div className="space-y-3">
                {data.correlations.map((corr) => (
                  <div key={corr.symbol} className="flex items-center justify-between p-2 rounded bg-secondary/30">
                    <span className="text-xs font-medium text-foreground">{corr.symbol}</span>
                    <div className="text-right">
                      <p className="text-sm font-mono text-foreground">{corr.value.toFixed(2)}</p>
                      <p className={`text-xs ${corr.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                        {corr.change >= 0 ? '+' : ''}{corr.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="p-3">
            <EconomicCalendar events={data.economicEvents} />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="p-3">
            <MarketPulse news={data.news} />
          </div>
        )}
      </div>
    </div>
  );
});

MobileDashboard.displayName = 'MobileDashboard';