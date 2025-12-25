// ============================================
// Updated Candlestick Chart with i18n + Thermal Optimization
// v1.0.3 - Added React.memo and optimized re-renders
// ============================================

import { useEffect, useRef, useState, memo } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries } from 'lightweight-charts';
import type { CandleData, OrderBlock } from '@/types/trading';
import { useLanguage } from '@/contexts/LanguageContext';

interface CandlestickChartProps {
  candles: CandleData[];
  orderBlocks: OrderBlock[];
}

// THERMAL OPTIMIZATION: Memoize chart component - only re-render when candles/orderBlocks actually change
export const CandlestickChart = memo(({ candles, orderBlocks }: CandlestickChartProps) => {
  const { t } = useLanguage();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const initializingRef = useRef(false);

  // Validar datos antes de renderizar
  if (!candles || candles.length === 0) {
    return (
      <div className="chart-container relative flex items-center justify-center h-[380px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando datos del gráfico...</p>
        </div>
      </div>
    );
  }

  // THERMAL OPTIMIZATION: Initialize chart once (unchanged)
  useEffect(() => {
    if (!chartContainerRef.current || initializingRef.current || isInitialized) return;
    
    initializingRef.current = true;

    try {
      // Create chart
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: 'hsl(215 20% 55%)',
          fontFamily: "'JetBrains Mono', monospace",
        },
        grid: {
          vertLines: { color: 'hsl(217 33% 12%)' },
          horzLines: { color: 'hsl(217 33% 12%)' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 380,
        crosshair: {
          mode: 1,
          vertLine: {
            color: 'hsl(199 89% 48% / 0.5)',
            width: 1,
            style: 2,
            labelBackgroundColor: 'hsl(217 33% 15%)',
          },
          horzLine: {
            color: 'hsl(199 89% 48% / 0.5)',
            width: 1,
            style: 2,
            labelBackgroundColor: 'hsl(217 33% 15%)',
          },
        },
        rightPriceScale: {
          borderColor: 'hsl(217 33% 18%)',
          scaleMargins: { top: 0.1, bottom: 0.2 },
        },
        timeScale: {
          borderColor: 'hsl(217 33% 18%)',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      chartRef.current = chart;

      // Add candlestick series
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: 'hsl(160 84% 39%)',
        downColor: 'hsl(350 89% 60%)',
        borderUpColor: 'hsl(160 84% 45%)',
        borderDownColor: 'hsl(350 89% 65%)',
        wickUpColor: 'hsl(160 84% 39%)',
        wickDownColor: 'hsl(350 89% 60%)',
      });

      candleSeriesRef.current = candleSeries;
      setIsInitialized(true);

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
        candleSeriesRef.current = null;
        setIsInitialized(false);
        initializingRef.current = false;
      };
    } catch (err) {
      console.error('Error initializing chart:', err);
      initializingRef.current = false;
    }
  }, [isInitialized]);

  // Update chart data when candles change
  useEffect(() => {
    if (!candleSeriesRef.current || !isInitialized || !candles || candles.length === 0) {
      return;
    }

    try {
      // Format all candle data for lightweight-charts
      const formattedCandles = candles.map((c) => ({
        time: Math.floor(c.time / 1000) as any,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));

      // Set all data (mejor para cambios de timeframe)
      candleSeriesRef.current.setData(formattedCandles);

      // Fit content
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    } catch (err) {
      console.error('Error updating chart data:', err);
    }
  }, [candles, isInitialized]);

  // Update order blocks
  useEffect(() => {
    if (!candleSeriesRef.current || !isInitialized || !orderBlocks) {
      return;
    }

    try {
      // Add Order Block markers as price lines
      orderBlocks.slice(-5).forEach((ob) => {
        if (candleSeriesRef.current) {
          candleSeriesRef.current.createPriceLine({
            price: ob.priceHigh,
            color: ob.type === 'bullish' ? 'hsl(160 84% 39% / 0.6)' : 'hsl(350 89% 60% / 0.6)',
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
          });

          candleSeriesRef.current.createPriceLine({
            price: ob.priceLow,
            color: ob.type === 'bullish' ? 'hsl(160 84% 39% / 0.6)' : 'hsl(350 89% 60% / 0.6)',
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
          });
        }
      });
    } catch (err) {
      console.error('Error updating order blocks:', err);
    }
  }, [orderBlocks, isInitialized]);

  return (
    <div className="chart-container relative">
      {/* Order Block Legend */}
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-background/80 backdrop-blur-sm border border-bullish/30">
          <div className="w-3 h-3 rounded-sm bg-bullish/40 border border-bullish" />
          <span className="text-xs font-medium text-bullish">{t.chart.demandZone}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-background/80 backdrop-blur-sm border border-bearish/30">
          <div className="w-3 h-3 rounded-sm bg-bearish/40 border border-bearish" />
          <span className="text-xs font-medium text-bearish">{t.chart.supplyZone}</span>
        </div>
      </div>

      {/* Chart Container */}
      <div ref={chartContainerRef} className="w-full" />

      {/* Order Block Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {orderBlocks.slice(-2).map((ob, i) => (
          <div
            key={ob.id}
            className={`absolute left-0 right-20 ${
              ob.type === 'bullish' ? 'order-block-bullish' : 'order-block-bearish'
            }`}
            style={{
              top: `${30 + i * 15}%`,
              height: '40px',
              opacity: 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
});

// Display name for debugging
CandlestickChart.displayName = 'CandlestickChart';
