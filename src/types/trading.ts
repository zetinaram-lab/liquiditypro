// ============================================
// Trading Terminal Type Definitions
// ============================================

// Timeframe options for charts
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D';

// Candlestick OHLC data
export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Smart Money Concept Order Blocks
export interface OrderBlock {
  id: string;
  type: 'bullish' | 'bearish';
  priceHigh: number;
  priceLow: number;
  startTime: number;
  endTime: number;
  strength: number; // 0-100
  timeframe: Timeframe;
}

// News/Alert item types
export type NewsItemType = 'news' | 'technical' | 'orderblock';
export type ImpactLevel = 'low' | 'medium' | 'high';

export interface NewsItem {
  id: string;
  source: string;
  timestamp: Date;
  impact: ImpactLevel;
  title: string;
  summary: string;
  summaryEs?: string; // Spanish translation
  type: NewsItemType;
}

// RSI indicator data point
export interface RSIData {
  time: number;
  value: number;
}

// Bulls vs Bears power data
export interface BullBearData {
  time: number;
  bullPower: number;
  bearPower: number;
}

// Correlation instrument data (DXY, US10Y)
export interface CorrelationData {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparklineData: number[];
  correlation: 'positive' | 'negative' | 'neutral';
}

// Economic calendar event
export interface EconomicEvent {
  id: string;
  name: string;
  currency: string;
  impact: ImpactLevel;
  date: Date;
  previous?: string;
  forecast?: string;
  actual?: string;
}

// Position sizing calculator
export interface PositionSizeInput {
  accountBalance: number;
  riskPercent: number;
  stopLossPips: number;
}

export interface PositionSizeResult {
  lotSize: number;
  riskAmount: number;
  pipValue: number;
}

// Complete market data state
export interface MarketData {
  candles: CandleData[];
  orderBlocks: OrderBlock[];
  news: NewsItem[];
  rsiData: RSIData[];
  bullBearData: BullBearData[];
  correlations: CorrelationData[];
  economicEvents: EconomicEvent[];
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
  selectedTimeframe: Timeframe;
}

// Filter types for news feed
export type NewsFilterType = 'all' | 'news' | 'technical' | 'orderblock';

// Supported languages
export type Language = 'en' | 'es';

// Translation keys interface
export interface Translations {
  // Header
  header: {
    spread: string;
    dayHigh: string;
    dayLow: string;
    live: string;
    goldSpot: string;
  };
  // Chart
  chart: {
    smartMoneyConcepts: string;
    demandZone: string;
    supplyZone: string;
  };
  // Order Blocks
  orderBlocks: {
    title: string;
    zones: string;
    demandZones: string;
    supplyZones: string;
    noActiveZones: string;
    fromPrice: string;
    bullishOB: string;
    bearishOB: string;
  };
  // Market Pulse
  marketPulse: {
    title: string;
    all: string;
    news: string;
    technical: string;
    obHits: string;
    items: string;
    autoRefreshing: string;
    translateToSpanish: string;
    translateToEnglish: string;
    impact: string;
  };
  // Correlation
  correlation: {
    title: string;
    inverse: string;
    positive: string;
  };
  // Bulls vs Bears
  bullsBears: {
    title: string;
    bulls: string;
    bears: string;
    bullsControl: string;
    bearsControl: string;
    inControl: string;
    power: string;
    noData: string;
  };
  // RSI Indicator
  rsi: {
    overbought: string;
    oversold: string;
    neutral: string;
  };
  // Economic Calendar
  economicCalendar: {
    title: string;
    highImpact: string;
    upcoming: string;
    previous: string;
    forecast: string;
    nextEvent: string;
  };
  // Risk Calculator
  riskCalculator: {
    title: string;
    accountBalance: string;
    riskPercent: string;
    stopLossPips: string;
    calculate: string;
    result: string;
    lotSize: string;
    riskAmount: string;
    pipValue: string;
    positionSizer: string;
  };
  // Connection Status
  connection: {
    disconnected: string;
    reconnect: string;
    connecting: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    close: string;
  };
}
