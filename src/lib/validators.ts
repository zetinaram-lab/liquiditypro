// ============================================
// Data Validation Utilities
// ============================================

import type { CandleData, OrderBlock, BullBearData, RSIData } from '@/types/trading';

/**
 * Valida que un array de datos de velas no esté vacío y contenga datos válidos
 */
export function validateCandleData(data: CandleData[]): boolean {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  return data.every(
    (candle) =>
      typeof candle.open === 'number' &&
      typeof candle.high === 'number' &&
      typeof candle.low === 'number' &&
      typeof candle.close === 'number' &&
      typeof candle.volume === 'number' &&
      !isNaN(candle.open) &&
      !isNaN(candle.high) &&
      !isNaN(candle.low) &&
      !isNaN(candle.close) &&
      !isNaN(candle.volume) &&
      candle.high >= candle.low &&
      candle.high >= candle.open &&
      candle.high >= candle.close &&
      candle.low <= candle.open &&
      candle.low <= candle.close
  );
}

/**
 * Valida datos de Bulls vs Bears
 */
export function validateBullBearData(data: BullBearData[]): boolean {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  return data.every(
    (item) =>
      typeof item.bullPower === 'number' &&
      typeof item.bearPower === 'number' &&
      !isNaN(item.bullPower) &&
      !isNaN(item.bearPower)
  );
}

/**
 * Valida datos de RSI
 */
export function validateRSIData(data: RSIData[]): boolean {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  return data.every(
    (item) =>
      typeof item.value === 'number' &&
      !isNaN(item.value) &&
      item.value >= 0 &&
      item.value <= 100
  );
}

/**
 * Valida bloques de órdenes
 */
export function validateOrderBlocks(blocks: OrderBlock[]): boolean {
  if (!Array.isArray(blocks)) {
    return false;
  }

  return blocks.every(
    (block) =>
      typeof block.priceHigh === 'number' &&
      typeof block.priceLow === 'number' &&
      !isNaN(block.priceHigh) &&
      !isNaN(block.priceLow) &&
      block.priceHigh >= block.priceLow &&
      (block.type === 'bullish' || block.type === 'bearish') &&
      typeof block.strength === 'number' &&
      block.strength >= 0 &&
      block.strength <= 100
  );
}

/**
 * Sanitiza un número para prevenir valores inválidos
 */
export function sanitizeNumber(value: number, fallback: number = 0): number {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return fallback;
  }
  return value;
}

/**
 * Calcula de forma segura un porcentaje
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0 || isNaN(total) || isNaN(value)) {
    return 0;
  }
  return (value / total) * 100;
}

/**
 * Formatea un número con decimales de forma segura
 */
export function formatNumber(value: number, decimals: number = 2): string {
  const sanitized = sanitizeNumber(value, 0);
  return sanitized.toFixed(decimals);
}

/**
 * Valida y normaliza un precio
 */
export function normalizePrice(price: number, minPrice: number = 0): number {
  const sanitized = sanitizeNumber(price, minPrice);
  return Math.max(sanitized, minPrice);
}
