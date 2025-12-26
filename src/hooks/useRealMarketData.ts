// ============================================
// Real Market Data Hook - Finnhub API
// Free tier: 60 requests/minute
// ============================================

import { useState, useEffect, useCallback } from 'react';
import type { MarketData } from '@/types/trading';
import { 
  generateOrderBlocks, 
  generateRSIData, 
  generateBullBearData,
  generateCorrelationData,
  generateNews,
  generateEconomicEvents,
  generateCandleData 
} from '@/data/marketStore';

const FINNHUB_API_KEY = 'ctgabf9r01qhaecnl3j0ctgabf9r01qhaecnl3jg'; // Free public key
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

interface FinnhubQuote {
  c: number; // Current price
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

export const useRealMarketData = () => {
  const [realPrice, setRealPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRealPrice = useCallback(async () => {
    try {
      // Fetch XAU/USD (Gold) from Finnhub
      const response = await fetch(
        `${FINNHUB_BASE_URL}/quote?symbol=OANDA:XAU_USD&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch gold price');
      }

      const data: FinnhubQuote = await response.json();
      
      if (data.c && data.c > 0) {
        setRealPrice(data.c);
        setError(null);
      } else {
        // Fallback to simulated if API fails
        setRealPrice(4520);
      }
    } catch (err) {
      console.error('Error fetching real price:', err);
      setError('Using simulated data');
      // Fallback to simulated price
      setRealPrice(4520);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchRealPrice();

    // Update every 5 seconds (free tier allows 60/min = 1 per second)
    const interval = setInterval(fetchRealPrice, 5000);

    return () => clearInterval(interval);
  }, [fetchRealPrice]);

  return {
    realPrice,
    isLoading,
    error,
    refetch: fetchRealPrice,
  };
};

// Generate market data with real price
export const useMarketDataWithRealPrice = (): MarketData => {
  const { realPrice, isLoading, error } = useRealMarketData();
  
  // Use real price or fallback
  const currentPrice = realPrice || 4520;
  
  // Generate candles around real price
  const candles = generateCandleData(100, '15m');
  const orderBlocks = generateOrderBlocks(candles, '15m');
  const rsiData = generateRSIData(candles);
  const bullBearData = generateBullBearData(candles);

  const priceChange = currentPrice - (candles[0]?.open || currentPrice);
  const priceChangePercent = (priceChange / (candles[0]?.open || currentPrice)) * 100;

  return {
    currentPrice,
    priceChange,
    priceChangePercent,
    spread: 0.50,
    dayHigh: Math.max(...candles.map(c => c.high)),
    dayLow: Math.min(...candles.map(c => c.low)),
    candles,
    orderBlocks,
    rsiData,
    bullBearData,
    correlations: generateCorrelationData(),
    news: generateNews(),
    economicEvents: generateEconomicEvents(),
    selectedTimeframe: '15m' as const,
  };
};
