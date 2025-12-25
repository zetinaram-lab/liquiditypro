// ============================================
// Candlestick Chart - Optimized & Bug-Fixed
// v1.1.0 - Fixed re-rendering loops and stability
// ============================================

import { useEffect, useRef, useCallback, memo } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, IPriceLine } from 'lightweight-charts';
import type { CandleData, OrderBlock } from '@/types/trading';
import { useLanguage } from '@/contexts/LanguageContext';

interface CandlestickChartProps {
  candles: CandleData[];
  orderBlocks: OrderBlock[];
}

export const CandlestickChart = memo(({ candles, orderBlocks }: CandlestickChartProps) => {
  const { t } = useLanguage();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);
  const isInitializedRef = useRef(false);

  // Initialize chart only once
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current || isInitializedRef.current) return;
    
    isInitializedRef.current = true;

    try {
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

      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: 'hsl(160 84% 39%)',
        downColor: 'hsl(350 89% 60%)',
        borderUpColor: 'hsl(160 84% 45%)',
        borderDownColor: 'hsl(350 89% 65%)',
        wickUpColor: 'hsl(160 84% 39%)',
        wickDownColor: 'hsl(350 89% 60%)',
      });

      candleSeriesRef.current = candleSeries;
    } catch (err) {
      console.error('Error initializing chart:', err);
      isInitializedRef.current = false;
    }
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize chart on mount
  useEffect(() => {
    initializeChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
        priceLinesRef.current = [];
        isInitializedRef.current = false;
      }
    };
  }, [initializeChart]);

  // Update candle data
  useEffect(() => {
    if (!candleSeriesRef.current || !candles?.length) return;

    try {
      const formattedCandles = candles.map((c) => ({
        time: Math.floor(c.time / 1000) as any,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));

      candleSeriesRef.current.setData(formattedCandles);

      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    } catch (err) {
      console.error('Error updating chart data:', err);
    }
  }, [candles]);

  // Update order blocks
  useEffect(() => {
    if (!candleSeriesRef.current || !orderBlocks) return;

    try {
      // Remove old price lines
      priceLinesRef.current.forEach((line) => {
        try {
          candleSeriesRef.current?.removePriceLine(line);
        } catch {
          // Line might already be removed
        }
      });
      priceLinesRef.current = [];

      // Add new price lines for order blocks
      orderBlocks.slice(-5).forEach((ob) => {
        if (candleSeriesRef.current) {
          const color = ob.type === 'bullish' 
            ? 'hsl(160 84% 39% / 0.6)' 
            : 'hsl(350 89% 60% / 0.6)';

          const highLine = candleSeriesRef.current.createPriceLine({
            price: ob.priceHigh,
            color,
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
          });

          const lowLine = candleSeriesRef.current.createPriceLine({
            price: ob.priceLow,
            color,
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
          });

          priceLinesRef.current.push(highLine, lowLine);
        }
      });
    } catch (err) {
      console.error('Error updating order blocks:', err);
    }
  }, [orderBlocks]);

  // Show loading if no candles
  if (!candles?.length) {
    return (
      <div className="chart-container relative flex items-center justify-center h-[380px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

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
      <div ref={chartContainerRef} className="w-full h-[380px]" />

      {/* Order Block Overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {orderBlocks.slice(-2).map((ob, i) => (
          <div
            key={ob.id}
            className={`absolute left-0 right-20 transition-opacity duration-500 ${
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
}, (prevProps, nextProps) => {
  // Custom comparison for better memo performance
  const candlesEqual = prevProps.candles.length === nextProps.candles.length &&
    prevProps.candles[prevProps.candles.length - 1]?.close === 
    nextProps.candles[nextProps.candles.length - 1]?.close;
  
  const blocksEqual = prevProps.orderBlocks.length === nextProps.orderBlocks.length;
  
  return candlesEqual && blocksEqual;
});

CandlestickChart.displayName = 'CandlestickChart';
