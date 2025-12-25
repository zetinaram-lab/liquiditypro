// ============================================
// Updated Market Data Hook with Thermal Optimization
// v1.0.3 - Reduced update frequency to 1s + Tab visibility detection
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
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

// Re-export types for backward compatibility
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

export const useMarketData = (): UseMarketDataReturn => {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('15m');
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Thermal optimization: Page visibility detection
  const isPageVisible = usePageVisibility();
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Generate data for a specific timeframe
  const generateDataForTimeframe = useCallback((timeframe: Timeframe): MarketData => {
    try {
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
    } catch (err) {
      console.error('Error generating market data:', err);
      setError('Error al generar datos del mercado');
      throw err;
    }
  }, []);

  // Handle timeframe change
  const changeTimeframe = useCallback(
    (timeframe: Timeframe) => {
      try {
        setIsLoading(true);
        setSelectedTimeframe(timeframe);
        const newData = generateDataForTimeframe(timeframe);
        setData(newData);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        console.error('Error changing timeframe:', err);
        setError('Error al cambiar el timeframe');
        setIsLoading(false);
      }
    },
    [generateDataForTimeframe]
  );

  // Reconnect function
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setIsConnected(true);
    setError(null);
  }, []);

  // Simulate connection issues and recovery
  const simulateConnection = useCallback(() => {
    // Simulate random disconnections (5% chance every update)
    if (Math.random() < 0.05 && reconnectAttemptsRef.current < maxReconnectAttempts) {
      setIsConnected(false);
      setError('Conexión perdida. Reconectando...');
      
      reconnectAttemptsRef.current++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      }, delay);
    } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setError('No se pudo conectar. Por favor, recarga la página.');
    }
  }, []);

  useEffect(() => {
    // Initial data generation
    try {
      setData(generateDataForTimeframe(selectedTimeframe));
      setIsLoading(false);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setIsLoading(false);
      setError('Error al cargar datos iniciales');
      return; // Don't start interval if initial load fails
    }

    // THERMAL OPTIMIZATION: Only run interval if page is visible
    if (!isPageVisible) {
      console.log('⚡ Tab not visible - Skipping interval creation');
      return;
    }

    // Simulate real-time updates - REDUCED TO 1000ms (1 second) for thermal efficiency
    intervalRef.current = setInterval(() => {
      // Double-check visibility inside interval
      if (document.hidden) {
        return; // Skip this update if tab is hidden
      }

      simulateConnection();
      
      if (!isConnected) return;

      setData((prev) => {
        if (!prev || !prev.candles || prev.candles.length === 0) {
          console.warn('No previous data available for update');
          return prev;
        }

        try {
          const lastCandle = prev.candles[prev.candles.length - 1];
          if (!lastCandle) return prev;
          
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

          return {
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
        } catch (err) {
          console.error('Error updating market data:', err);
          return prev;
        }
      });
    }, 1000); // THERMAL OPTIMIZATION: Reduced from 2000ms to 1000ms

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [selectedTimeframe, generateDataForTimeframe, simulateConnection, isConnected, isPageVisible]); // Added isPageVisible dependency

  return { 
    data, 
    isLoading, 
    selectedTimeframe, 
    changeTimeframe,
    isConnected,
    error,
    reconnect
  };
};
