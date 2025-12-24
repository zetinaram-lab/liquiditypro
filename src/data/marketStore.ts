// ============================================
// Market Data Store - Simulated Data Generation
// ============================================

import type {
  CandleData,
  OrderBlock,
  NewsItem,
  RSIData,
  BullBearData,
  CorrelationData,
  EconomicEvent,
  Timeframe,
} from '@/types/trading';

// Timeframe intervals in milliseconds
export const TIMEFRAME_INTERVALS: Record<Timeframe, number> = {
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  '1D': 24 * 60 * 60 * 1000,
};

// Generate realistic gold price candle data around $2,650
export const generateCandleData = (
  count: number = 100,
  timeframe: Timeframe = '15m'
): CandleData[] => {
  const candles: CandleData[] = [];
  let basePrice = 2645;
  const now = Date.now();
  const interval = TIMEFRAME_INTERVALS[timeframe];

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
export const generateOrderBlocks = (
  candles: CandleData[],
  timeframe: Timeframe = '15m'
): OrderBlock[] => {
  const blocks: OrderBlock[] = [];

  for (let i = 5; i < candles.length - 5; i++) {
    const candle = candles[i];
    const nextCandles = candles.slice(i + 1, i + 4);

    // Bullish OB: Last bearish candle before a breakout
    if (
      candle.close < candle.open &&
      nextCandles.every((c) => c.close > candle.high) &&
      Math.random() > 0.7
    ) {
      blocks.push({
        id: `ob-bull-${i}`,
        type: 'bullish',
        priceHigh: candle.high,
        priceLow: candle.low,
        startTime: candle.time,
        endTime: candles[Math.min(i + 10, candles.length - 1)].time,
        strength: 60 + Math.random() * 40,
        timeframe,
      });
    }

    // Bearish OB: Last bullish candle before a drop
    if (
      candle.close > candle.open &&
      nextCandles.every((c) => c.close < candle.low) &&
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
        timeframe,
      });
    }
  }

  return blocks.slice(-6); // Keep last 6 order blocks
};

// Generate RSI data
export const generateRSIData = (candles: CandleData[]): RSIData[] => {
  return candles.map((candle) => {
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

// Generate Bulls vs Bears Power data using EMA13
export const generateBullBearData = (candles: CandleData[]): BullBearData[] => {
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

// Generate correlation data for DXY and US10Y
export const generateCorrelationData = (): CorrelationData[] => {
  const generateSparkline = (base: number, volatility: number, length: number = 20): number[] => {
    const data: number[] = [];
    let value = base;
    for (let i = 0; i < length; i++) {
      value += (Math.random() - 0.5) * volatility;
      data.push(parseFloat(value.toFixed(3)));
    }
    return data;
  };

  return [
    {
      symbol: 'DXY',
      name: 'Dollar Index',
      value: 104.35 + (Math.random() - 0.5) * 0.5,
      change: -0.23 + (Math.random() - 0.5) * 0.3,
      changePercent: -0.22 + (Math.random() - 0.5) * 0.2,
      sparklineData: generateSparkline(104.35, 0.15),
      correlation: 'negative', // Gold typically inversely correlated with DXY
    },
    {
      symbol: 'US10Y',
      name: '10-Year Yield',
      value: 4.42 + (Math.random() - 0.5) * 0.1,
      change: 0.03 + (Math.random() - 0.5) * 0.05,
      changePercent: 0.68 + (Math.random() - 0.5) * 0.3,
      sparklineData: generateSparkline(4.42, 0.03),
      correlation: 'negative', // Gold typically inversely correlated with yields
    },
  ];
};

// Generate economic calendar events
export const generateEconomicEvents = (): EconomicEvent[] => {
  const now = new Date();
  
  return [
    {
      id: 'fomc-1',
      name: 'FOMC Rate Decision',
      currency: 'USD',
      impact: 'high',
      date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 2 days from now
      previous: '5.25%',
      forecast: '5.25%',
    },
    {
      id: 'nfp-1',
      name: 'Non-Farm Payrolls',
      currency: 'USD',
      impact: 'high',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 13.5 * 60 * 60 * 1000), // 5 days from now
      previous: '227K',
      forecast: '180K',
    },
    {
      id: 'cpi-1',
      name: 'CPI (YoY)',
      currency: 'USD',
      impact: 'high',
      date: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000 + 13.5 * 60 * 60 * 1000), // 8 days from now
      previous: '2.7%',
      forecast: '2.6%',
    },
  ];
};

// News templates with Spanish translations
const newsTemplates: Omit<NewsItem, 'id' | 'source' | 'timestamp'>[] = [
  {
    title: 'Fed Officials Signal Rate Path Uncertainty',
    summary: 'Federal Reserve governors express mixed views on timing of potential rate adjustments, citing persistent inflation concerns.',
    summaryEs: 'Los gobernadores de la Reserva Federal expresan opiniones mixtas sobre el momento de posibles ajustes de tasas, citando preocupaciones persistentes de inflación.',
    impact: 'high',
    type: 'news',
  },
  {
    title: 'Gold Demand Surges in Asian Markets',
    summary: 'Central banks in China and India continue aggressive gold purchasing amid geopolitical tensions.',
    summaryEs: 'Los bancos centrales de China e India continúan comprando oro de manera agresiva en medio de tensiones geopolíticas.',
    impact: 'medium',
    type: 'news',
  },
  {
    title: 'US Treasury Yields Edge Higher',
    summary: '10-year yields climb to 4.45% as markets digest stronger-than-expected jobs data.',
    summaryEs: 'Los rendimientos a 10 años suben a 4.45% mientras los mercados digieren datos de empleo más fuertes de lo esperado.',
    impact: 'high',
    type: 'news',
  },
  {
    title: 'Technical: RSI Approaching Overbought',
    summary: 'XAU/USD RSI(14) at 68.5, nearing overbought territory. Watch for potential pullback.',
    summaryEs: 'El RSI(14) de XAU/USD en 68.5, acercándose a territorio de sobrecompra. Observe posible retroceso.',
    impact: 'medium',
    type: 'technical',
  },
  {
    title: 'Bullish OB Tested at $2,642',
    summary: 'Price action respecting demand zone. Look for continuation if 4H close holds above.',
    summaryEs: 'La acción del precio respeta la zona de demanda. Busque continuación si el cierre de 4H se mantiene arriba.',
    impact: 'low',
    type: 'orderblock',
  },
  {
    title: 'Dollar Index Weakens Post-NFP',
    summary: 'DXY down 0.3% as markets reassess Fed trajectory. Gold benefits from dollar weakness.',
    summaryEs: 'DXY baja 0.3% mientras los mercados reevalúan la trayectoria de la Fed. El oro se beneficia de la debilidad del dólar.',
    impact: 'medium',
    type: 'news',
  },
  {
    title: 'Bearish Supply Zone at $2,668',
    summary: 'Strong resistance cluster identified. Multiple timeframe confluence suggests sell interest.',
    summaryEs: 'Clúster de resistencia fuerte identificado. Confluencia de múltiples marcos temporales sugiere interés de venta.',
    impact: 'medium',
    type: 'orderblock',
  },
  {
    title: 'Technical: EMA Cross Bullish Signal',
    summary: 'EMA 21 crossed above EMA 50 on H4 timeframe. Momentum shifting to buyers.',
    summaryEs: 'EMA 21 cruzó por encima de EMA 50 en marco temporal H4. El impulso cambia a compradores.',
    impact: 'low',
    type: 'technical',
  },
  {
    title: 'Geopolitical Risk Premium Rising',
    summary: 'Middle East tensions drive safe-haven flows. Gold premiums at 3-month highs.',
    summaryEs: 'Las tensiones en Medio Oriente impulsan flujos hacia activos refugio. Las primas del oro en máximos de 3 meses.',
    impact: 'high',
    type: 'news',
  },
  {
    title: 'COMEX Gold Futures Volume Spike',
    summary: 'Unusual options activity detected at $2,700 strike for December expiry.',
    summaryEs: 'Actividad inusual de opciones detectada en strike de $2,700 para vencimiento de diciembre.',
    impact: 'low',
    type: 'technical',
  },
];

const sources = ['Bloomberg', 'Reuters', 'WSJ', 'CNBC', 'FX Empire', 'Kitco'];

// Generate news items
export const generateNews = (): NewsItem[] => {
  const now = new Date();

  return newsTemplates.map((template, i) => ({
    id: `news-${i}`,
    source: sources[Math.floor(Math.random() * sources.length)],
    timestamp: new Date(now.getTime() - i * 15 * 60 * 1000 - Math.random() * 30 * 60 * 1000),
    ...template,
  }));
};

// Calculate position size for XAU/USD
export const calculatePositionSize = (
  accountBalance: number,
  riskPercent: number,
  stopLossPips: number
): { lotSize: number; riskAmount: number; pipValue: number } => {
  // XAU/USD pip value: 1 pip = $0.01 per 0.01 lot
  // Standard lot = 100 oz, Mini = 10 oz, Micro = 1 oz
  const riskAmount = (accountBalance * riskPercent) / 100;
  
  // For XAU/USD: pip value ≈ $1 per standard lot (100 oz)
  const pipValuePerLot = 1; // $1 per pip per standard lot
  const lotSize = riskAmount / (stopLossPips * pipValuePerLot);
  
  return {
    lotSize: parseFloat(lotSize.toFixed(2)),
    riskAmount: parseFloat(riskAmount.toFixed(2)),
    pipValue: parseFloat((lotSize * pipValuePerLot).toFixed(2)),
  };
};
