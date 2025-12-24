import { useState, useEffect, useMemo } from 'react';

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBlock {
  id: string;
  type: 'bullish' | 'bearish';
  priceHigh: number;
  priceLow: number;
  startTime: number;
  endTime: number;
  strength: number; // 0-100
}

export interface NewsItem {
  id: string;
  source: string;
  timestamp: Date;
  impact: 'low' | 'medium' | 'high';
  title: string;
  summary: string;
  type: 'news' | 'technical' | 'orderblock';
}

export interface RSIData {
  time: number;
  value: number;
}

export interface BullBearData {
  time: number;
  bullPower: number;
  bearPower: number;
}

export interface MarketData {
  candles: CandleData[];
  orderBlocks: OrderBlock[];
  news: NewsItem[];
  rsiData: RSIData[];
  bullBearData: BullBearData[];
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
}

// Generate realistic gold price data around $2,650
const generateCandleData = (count: number = 100): CandleData[] => {
  const candles: CandleData[] = [];
  let basePrice = 2645;
  const now = Date.now();
  const interval = 15 * 60 * 1000; // 15 min candles

  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * interval;
    const volatility = 3 + Math.random() * 5;
    const trend = Math.sin(i / 15) * 2;
    
    const open = basePrice + (Math.random() - 0.5) * volatility;
    const close = open + (Math.random() - 0.5) * volatility + trend * 0.3;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    candles.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(1000 + Math.random() * 5000),
    });
    
    basePrice = close;
  }

  return candles;
};

// Generate Order Blocks based on candle patterns
const generateOrderBlocks = (candles: CandleData[]): OrderBlock[] => {
  const blocks: OrderBlock[] = [];
  
  for (let i = 5; i < candles.length - 5; i++) {
    const candle = candles[i];
    const prevCandles = candles.slice(i - 3, i);
    const nextCandles = candles.slice(i + 1, i + 4);
    
    // Bullish OB: Last bearish candle before a breakout
    if (
      candle.close < candle.open && // Bearish candle
      nextCandles.every(c => c.close > candle.high) && // Breakout above
      Math.random() > 0.7 // Add some randomness
    ) {
      blocks.push({
        id: `ob-bull-${i}`,
        type: 'bullish',
        priceHigh: candle.high,
        priceLow: candle.low,
        startTime: candle.time,
        endTime: candles[Math.min(i + 10, candles.length - 1)].time,
        strength: 60 + Math.random() * 40,
      });
    }
    
    // Bearish OB: Last bullish candle before a drop
    if (
      candle.close > candle.open && // Bullish candle
      nextCandles.every(c => c.close < candle.low) && // Breakdown below
      Math.random() > 0.7
    ) {
      blocks.push({
        id: `ob-bear-${i}`,
        type: 'bearish',
        priceHigh: candle.high,
        priceLow: candle.low,
        startTime: candle.time,
        endTime: candles[Math.min(i + 10, candles.length - 1)].time,
        strength: 60 + Math.random() * 40,
      });
    }
  }

  return blocks.slice(-6); // Keep last 6 order blocks
};

// Generate RSI data
const generateRSIData = (candles: CandleData[]): RSIData[] => {
  return candles.map((candle, i) => {
    // Simplified RSI simulation
    const baseRSI = 50;
    const trend = candle.close > candle.open ? 10 : -10;
    const noise = (Math.random() - 0.5) * 20;
    const rsi = Math.max(10, Math.min(90, baseRSI + trend + noise));
    
    return {
      time: candle.time,
      value: parseFloat(rsi.toFixed(2)),
    };
  });
};

// Generate Bulls vs Bears Power data
const generateBullBearData = (candles: CandleData[]): BullBearData[] => {
  // Calculate simple EMA13
  const ema13: number[] = [];
  const multiplier = 2 / (13 + 1);
  
  candles.forEach((candle, i) => {
    if (i === 0) {
      ema13.push(candle.close);
    } else {
      ema13.push((candle.close - ema13[i - 1]) * multiplier + ema13[i - 1]);
    }
  });

  return candles.map((candle, i) => ({
    time: candle.time,
    bullPower: parseFloat((candle.high - ema13[i]).toFixed(2)),
    bearPower: parseFloat((candle.low - ema13[i]).toFixed(2)),
  }));
};

// Generate news items
const generateNews = (): NewsItem[] => {
  const sources = ['Bloomberg', 'Reuters', 'WSJ', 'CNBC', 'FX Empire', 'Kitco'];
  const newsTemplates = [
    { title: 'Fed Officials Signal Rate Path Uncertainty', summary: 'Federal Reserve governors express mixed views on timing of potential rate adjustments, citing persistent inflation concerns.', impact: 'high' as const, type: 'news' as const },
    { title: 'Gold Demand Surges in Asian Markets', summary: 'Central banks in China and India continue aggressive gold purchasing amid geopolitical tensions.', impact: 'medium' as const, type: 'news' as const },
    { title: 'US Treasury Yields Edge Higher', summary: '10-year yields climb to 4.45% as markets digest stronger-than-expected jobs data.', impact: 'high' as const, type: 'news' as const },
    { title: 'Technical: RSI Approaching Overbought', summary: 'XAU/USD RSI(14) at 68.5, nearing overbought territory. Watch for potential pullback.', impact: 'medium' as const, type: 'technical' as const },
    { title: 'Bullish OB Tested at $2,642', summary: 'Price action respecting demand zone. Look for continuation if 4H close holds above.', impact: 'low' as const, type: 'orderblock' as const },
    { title: 'Dollar Index Weakens Post-NFP', summary: 'DXY down 0.3% as markets reassess Fed trajectory. Gold benefits from dollar weakness.', impact: 'medium' as const, type: 'news' as const },
    { title: 'Bearish Supply Zone at $2,668', summary: 'Strong resistance cluster identified. Multiple timeframe confluence suggests sell interest.', impact: 'medium' as const, type: 'orderblock' as const },
    { title: 'Technical: EMA Cross Bullish Signal', summary: 'EMA 21 crossed above EMA 50 on H4 timeframe. Momentum shifting to buyers.', impact: 'low' as const, type: 'technical' as const },
    { title: 'Geopolitical Risk Premium Rising', summary: 'Middle East tensions drive safe-haven flows. Gold premiums at 3-month highs.', impact: 'high' as const, type: 'news' as const },
    { title: 'COMEX Gold Futures Volume Spike', summary: 'Unusual options activity detected at $2,700 strike for December expiry.', impact: 'low' as const, type: 'technical' as const },
  ];

  const now = new Date();
  
  return newsTemplates.map((template, i) => ({
    id: `news-${i}`,
    source: sources[Math.floor(Math.random() * sources.length)],
    timestamp: new Date(now.getTime() - i * 15 * 60 * 1000 - Math.random() * 30 * 60 * 1000),
    ...template,
  }));
};

export const useMarketData = () => {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial data generation
    const candles = generateCandleData(100);
    const currentPrice = candles[candles.length - 1].close;
    const openPrice = candles[0].open;
    const dayHigh = Math.max(...candles.slice(-16).map(c => c.high)); // Last ~4 hours
    const dayLow = Math.min(...candles.slice(-16).map(c => c.low));

    setData({
      candles,
      orderBlocks: generateOrderBlocks(candles),
      news: generateNews(),
      rsiData: generateRSIData(candles),
      bullBearData: generateBullBearData(candles),
      currentPrice,
      priceChange: parseFloat((currentPrice - openPrice).toFixed(2)),
      priceChangePercent: parseFloat(((currentPrice - openPrice) / openPrice * 100).toFixed(2)),
      spread: 0.35 + Math.random() * 0.15,
      dayHigh,
      dayLow,
    });

    setIsLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prev => {
        if (!prev) return prev;
        
        const lastCandle = prev.candles[prev.candles.length - 1];
        const priceMove = (Math.random() - 0.5) * 1.5;
        const newPrice = parseFloat((lastCandle.close + priceMove).toFixed(2));
        
        // Update last candle
        const updatedCandles = [...prev.candles];
        updatedCandles[updatedCandles.length - 1] = {
          ...lastCandle,
          close: newPrice,
          high: Math.max(lastCandle.high, newPrice),
          low: Math.min(lastCandle.low, newPrice),
        };

        return {
          ...prev,
          candles: updatedCandles,
          currentPrice: newPrice,
          priceChange: parseFloat((newPrice - prev.candles[0].open).toFixed(2)),
          priceChangePercent: parseFloat(((newPrice - prev.candles[0].open) / prev.candles[0].open * 100).toFixed(2)),
          spread: 0.35 + Math.random() * 0.15,
          dayHigh: Math.max(prev.dayHigh, newPrice),
          dayLow: Math.min(prev.dayLow, newPrice),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { data, isLoading };
};
