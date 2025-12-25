// ============================================
// Market Data Hook - Optimized & Bug-Fixed
// v1.1.0 - Fixed re-rendering loops and stability
// ============================================

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { usePageVisibility } from './usePageVisibility';
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

export type { CandleData, OrderBlock, NewsItem, RSIData, BullBearData };

interface UseMarketDataReturn {
  data: MarketData | null;
  isLoading: boolean;
  selectedTimeframe: Timeframe;
  changeTimeframe: (timeframe: Timeframe) => void;
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

const UPDATE_INTERVAL = 2000; // 2 seconds for thermal efficiency

export const useMarketData = (): UseMarketDataReturn => {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('15m');
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isPageVisible = usePageVisibility();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dataRef = useRef<MarketData | null>(null);

  // Generate data for a specific timeframe - memoized
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

  // Update price tick - optimized to only update necessary fields
  const updatePriceTick = useCallback(() => {
    if (!dataRef.current) return;
    
    const prev = dataRef.current;
    const lastCandle = prev.candles[prev.candles.length - 1];
    if (!lastCandle) return;

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
      value: parseFloat((c.value + (Math.random() - 0.5) * 0.05).toFixed(4)),
      change: parseFloat((c.change + (Math.random() - 0.5) * 0.02).toFixed(2)),
      changePercent: parseFloat((c.changePercent + (Math.random() - 0.5) * 0.05).toFixed(2)),
    }));

    const openPrice = prev.candles[0]?.open || lastCandle.open;

    const newData: MarketData = {
      ...prev,
      candles: updatedCandles,
      correlations: updatedCorrelations,
      currentPrice: newPrice,
      priceChange: parseFloat((newPrice - openPrice).toFixed(2)),
      priceChangePercent: parseFloat(
        (((newPrice - openPrice) / openPrice) * 100).toFixed(2)
      ),
      spread: parseFloat((0.35 + Math.random() * 0.15).toFixed(2)),
      dayHigh: Math.max(prev.dayHigh, newPrice),
      dayLow: Math.min(prev.dayLow, newPrice),
    };

    dataRef.current = newData;
    setData(newData);
  }, []);

  // Handle timeframe change
  const changeTimeframe = useCallback((timeframe: Timeframe) => {
    setIsLoading(true);
    setSelectedTimeframe(timeframe);
    
    // Small delay for UX
    setTimeout(() => {
      const newData = generateDataForTimeframe(timeframe);
      dataRef.current = newData;
      setData(newData);
      setIsLoading(false);
    }, 300);
  }, [generateDataForTimeframe]);

  // Reconnect function
  const reconnect = useCallback(() => {
    setIsConnected(true);
    setError(null);
  }, []);

  // Initial data load
  useEffect(() => {
    const initialData = generateDataForTimeframe(selectedTimeframe);
    dataRef.current = initialData;
    setData(initialData);
    setIsLoading(false);
    setIsConnected(true);
  }, []); // Only run once on mount

  // Real-time updates interval
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Don't start interval if page not visible or disconnected
    if (!isPageVisible || !isConnected || isLoading) {
      return;
    }

    intervalRef.current = setInterval(() => {
      // Double check visibility
      if (document.hidden) return;
      updatePriceTick();
    }, UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPageVisible, isConnected, isLoading, updatePriceTick]);

  return useMemo(() => ({
    data,
    isLoading,
    selectedTimeframe,
    changeTimeframe,
    isConnected,
    error,
    reconnect,
  }), [data, isLoading, selectedTimeframe, changeTimeframe, isConnected, error, reconnect]);
};
