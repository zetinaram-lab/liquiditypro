import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries } from 'lightweight-charts';
import { CandleData, OrderBlock } from '@/hooks/useMarketData';

interface CandlestickChartProps {
  candles: CandleData[];
  orderBlocks: OrderBlock[];
}

export const CandlestickChart = ({ candles, orderBlocks }: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

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
      height: 400,
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

    // Format candle data for lightweight-charts
    const formattedCandles = candles.map(c => ({
      time: Math.floor(c.time / 1000) as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    candleSeries.setData(formattedCandles);

    // Add Order Block markers as price lines
    orderBlocks.forEach(ob => {
      // Create price lines for order block boundaries
      candleSeries.createPriceLine({
        price: ob.priceHigh,
        color: ob.type === 'bullish' ? 'hsl(160 84% 39% / 0.6)' : 'hsl(350 89% 60% / 0.6)',
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: false,
      });

      candleSeries.createPriceLine({
        price: ob.priceLow,
        color: ob.type === 'bullish' ? 'hsl(160 84% 39% / 0.6)' : 'hsl(350 89% 60% / 0.6)',
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: false,
      });
    });

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update candles on data change
  useEffect(() => {
    if (candleSeriesRef.current && candles.length > 0) {
      const lastCandle = candles[candles.length - 1];
      candleSeriesRef.current.update({
        time: Math.floor(lastCandle.time / 1000) as any,
        open: lastCandle.open,
        high: lastCandle.high,
        low: lastCandle.low,
        close: lastCandle.close,
      });
    }
  }, [candles]);

  return (
    <div className="chart-container relative">
      {/* Order Block Legend */}
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-background/80 backdrop-blur-sm border border-bullish/30">
          <div className="w-3 h-3 rounded-sm bg-bullish/40 border border-bullish" />
          <span className="text-xs font-medium text-bullish">Demand Zone</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-background/80 backdrop-blur-sm border border-bearish/30">
          <div className="w-3 h-3 rounded-sm bg-bearish/40 border border-bearish" />
          <span className="text-xs font-medium text-bearish">Supply Zone</span>
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
};
