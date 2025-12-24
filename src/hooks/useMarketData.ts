// ============================================
// Updated Market Data Hook with Timeframes
// ============================================

import { useState, useEffect, useCallback } from 'react';
import type {
  CandleData,
  OrderBlock,
  NewsItem,
  RSIData,
  BullBearData,
  CorrelationData,
  EconomicEvent,
  MarketData,
  Timeframe,
} from '@/types/trading';
import {
  generateCandleData,
  generateOrderBlocks,
  generateRSIData,
  generateBullBearData,
  generateCorrelationData,
  generateEconomicEvents,
  generateNews,
} from '@/data/marketStore';

// Re-export types for backward compatibility
export type { CandleData, OrderBlock, NewsItem, RSIData, BullBearData };

export const useMarketData = () => {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('15m');

  // Generate data for a specific timeframe
  const generateDataForTimeframe = useCallback((timeframe: Timeframe): MarketData => {
    const candles = generateCandleData(100, timeframe);
    const currentPrice = candles[candles.length - 1].close;
    const openPrice = candles[0].open;
    const dayHigh = Math.max(...candles.slice(-16).map((c) => c.high));
    const dayLow = Math.min(...candles.slice(-16).map((c) => c.low));

    return {
      candles,
      orderBlocks: generateOrderBlocks(candles, timeframe),
      news: generateNews(),
      rsiData: generateRSIData(candles),
      bullBearData: generateBullBearData(candles),
      correlations: generateCorrelationData(),
      economicEvents: generateEconomicEvents(),
      currentPrice,
      priceChange: parseFloat((currentPrice - openPrice).toFixed(2)),
      priceChangePercent: parseFloat(
        (((currentPrice - openPrice) / openPrice) * 100).toFixed(2)
      ),
      spread: 0.35 + Math.random() * 0.15,
      dayHigh,
      dayLow,
      selectedTimeframe: timeframe,
    };
  }, []);

  // Handle timeframe change
  const changeTimeframe = useCallback(
    (timeframe: Timeframe) => {
      setSelectedTimeframe(timeframe);
      setData(generateDataForTimeframe(timeframe));
    },
    [generateDataForTimeframe]
  );

  useEffect(() => {
    // Initial data generation
    setData(generateDataForTimeframe(selectedTimeframe));
    setIsLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData((prev) => {
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

        // Update correlations slightly
        const updatedCorrelations = prev.correlations.map((c) => ({
          ...c,
          value: c.value + (Math.random() - 0.5) * 0.05,
          change: c.change + (Math.random() - 0.5) * 0.02,
          changePercent: c.changePercent + (Math.random() - 0.5) * 0.05,
        }));

        return {
          ...prev,
          candles: updatedCandles,
          correlations: updatedCorrelations,
          currentPrice: newPrice,
          priceChange: parseFloat((newPrice - prev.candles[0].open).toFixed(2)),
          priceChangePercent: parseFloat(
            (((newPrice - prev.candles[0].open) / prev.candles[0].open) * 100).toFixed(2)
          ),
          spread: 0.35 + Math.random() * 0.15,
          dayHigh: Math.max(prev.dayHigh, newPrice),
          dayLow: Math.min(prev.dayLow, newPrice),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedTimeframe, generateDataForTimeframe]);

  return { data, isLoading, selectedTimeframe, changeTimeframe };
};
