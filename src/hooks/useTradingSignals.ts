// ============================================
// Trading Signals Hook
// ============================================

import { useMemo } from 'react';
import { RSIData, BullBearData, CandleData } from '@/types/trading';

export interface TradingSignal {
  type: 'buy' | 'sell' | 'neutral';
  strength: number; // 0-100
  confidence: number; // 0-100
  indicators: {
    rsi: {
      value: number;
      signal: 'oversold' | 'overbought' | 'neutral';
      weight: number;
    };
    bullBear: {
      value: number;
      signal: 'bullish' | 'bearish' | 'neutral';
      weight: number;
    };
    momentum: {
      value: number;
      signal: 'positive' | 'negative' | 'neutral';
      weight: number;
    };
  };
  timestamp: Date;
  description: string;
}

interface UseTradingSignalsProps {
  rsiData: RSIData[];
  bullBearData: BullBearData[];
  candles: CandleData[];
}

export const useTradingSignals = ({
  rsiData,
  bullBearData,
  candles,
}: UseTradingSignalsProps): TradingSignal => {
  const signal = useMemo((): TradingSignal => {
    // Validar datos
    if (!rsiData.length || !bullBearData.length || !candles.length) {
      return {
        type: 'neutral',
        strength: 50,
        confidence: 0,
        indicators: {
          rsi: { value: 50, signal: 'neutral', weight: 0 },
          bullBear: { value: 0, signal: 'neutral', weight: 0 },
          momentum: { value: 0, signal: 'neutral', weight: 0 },
        },
        timestamp: new Date(),
        description: 'Datos insuficientes para generar señal',
      };
    }

    // Obtener últimos valores
    const currentRSI = rsiData[rsiData.length - 1].value;
    const currentBullBear = bullBearData[bullBearData.length - 1];
    const recentCandles = candles.slice(-10);
    
    // Calcular momentum (precio actual vs promedio de últimas 10 velas)
    const avgPrice = recentCandles.reduce((sum, c) => sum + c.close, 0) / recentCandles.length;
    const currentPrice = candles[candles.length - 1].close;
    const momentumPercent = ((currentPrice - avgPrice) / avgPrice) * 100;

    // Analizar RSI
    let rsiSignal: 'oversold' | 'overbought' | 'neutral' = 'neutral';
    let rsiWeight = 0;
    
    if (currentRSI < 30) {
      rsiSignal = 'oversold';
      rsiWeight = 30; // Señal de compra
    } else if (currentRSI > 70) {
      rsiSignal = 'overbought';
      rsiWeight = -30; // Señal de venta
    } else if (currentRSI < 40) {
      rsiWeight = 15;
    } else if (currentRSI > 60) {
      rsiWeight = -15;
    }

    // Analizar Bulls vs Bears
    const bullBearPower = currentBullBear.bullPower - Math.abs(currentBullBear.bearPower);
    let bullBearSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let bullBearWeight = 0;

    if (bullBearPower > 2) {
      bullBearSignal = 'bullish';
      bullBearWeight = 25;
    } else if (bullBearPower < -2) {
      bullBearSignal = 'bearish';
      bullBearWeight = -25;
    } else if (bullBearPower > 0.5) {
      bullBearSignal = 'bullish';
      bullBearWeight = 10;
    } else if (bullBearPower < -0.5) {
      bullBearSignal = 'bearish';
      bullBearWeight = -10;
    }

    // Analizar Momentum
    let momentumSignal: 'positive' | 'negative' | 'neutral' = 'neutral';
    let momentumWeight = 0;

    if (momentumPercent > 1) {
      momentumSignal = 'positive';
      momentumWeight = 20;
    } else if (momentumPercent < -1) {
      momentumSignal = 'negative';
      momentumWeight = -20;
    } else if (momentumPercent > 0.3) {
      momentumSignal = 'positive';
      momentumWeight = 10;
    } else if (momentumPercent < -0.3) {
      momentumSignal = 'negative';
      momentumWeight = -10;
    }

    // Calcular señal total
    const totalWeight = rsiWeight + bullBearWeight + momentumWeight;
    const strength = Math.max(0, Math.min(100, 50 + totalWeight));
    
    // Determinar tipo de señal
    let type: 'buy' | 'sell' | 'neutral' = 'neutral';
    let description = '';

    if (strength >= 65) {
      type = 'buy';
      description = 'Señal de COMPRA fuerte. Múltiples indicadores alcistas alineados.';
    } else if (strength >= 55) {
      type = 'buy';
      description = 'Señal de compra moderada. Tendencia alcista.';
    } else if (strength <= 35) {
      type = 'sell';
      description = 'Señal de VENTA fuerte. Múltiples indicadores bajistas alineados.';
    } else if (strength <= 45) {
      type = 'sell';
      description = 'Señal de venta moderada. Tendencia bajista.';
    } else {
      description = 'Mercado neutral. Esperar confirmación.';
    }

    // Calcular confianza basada en alineación de indicadores
    const indicators = [
      rsiWeight > 0 ? 1 : rsiWeight < 0 ? -1 : 0,
      bullBearWeight > 0 ? 1 : bullBearWeight < 0 ? -1 : 0,
      momentumWeight > 0 ? 1 : momentumWeight < 0 ? -1 : 0,
    ];
    
    const aligned = indicators.filter((i) => i !== 0);
    const allSameDirection = aligned.length > 0 && aligned.every((i) => i === aligned[0]);
    
    let confidence = Math.abs(totalWeight) * 1.2;
    if (allSameDirection) {
      confidence = Math.min(100, confidence * 1.5); // Bonus por alineación
    }
    confidence = Math.max(0, Math.min(100, confidence));

    return {
      type,
      strength,
      confidence,
      indicators: {
        rsi: { value: currentRSI, signal: rsiSignal, weight: rsiWeight },
        bullBear: { value: bullBearPower, signal: bullBearSignal, weight: bullBearWeight },
        momentum: { value: momentumPercent, signal: momentumSignal, weight: momentumWeight },
      },
      timestamp: new Date(),
      description,
    };
  }, [rsiData, bullBearData, candles]);

  return signal;
};
