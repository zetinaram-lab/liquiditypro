// ============================================
// Internationalization - English & Spanish
// ============================================

import type { Translations, Language } from '@/types/trading';

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      spread: 'Spread',
      dayHigh: 'Day High',
      dayLow: 'Day Low',
      live: 'LIVE',
      goldSpot: 'Gold Spot',
    },
    chart: {
      smartMoneyConcepts: 'Smart Money Concepts',
      demandZone: 'Demand Zone',
      supplyZone: 'Supply Zone',
    },
    orderBlocks: {
      title: 'Active Order Blocks',
      zones: 'zones',
      demandZones: 'Demand Zones',
      supplyZones: 'Supply Zones',
      noActiveZones: 'No active zones',
      fromPrice: 'from price',
      bullishOB: 'Bullish OB',
      bearishOB: 'Bearish OB',
    },
    marketPulse: {
      title: 'Market Pulse',
      all: 'All',
      news: 'News',
      technical: 'Technical',
      obHits: 'OB Hits',
      items: 'items',
      autoRefreshing: 'Auto-refreshing',
      translateToSpanish: 'ES',
      translateToEnglish: 'EN',
      impact: 'impact',
    },
    correlation: {
      title: 'Market Correlations',
      inverse: 'Inverse',
      positive: 'Positive',
    },
    economicCalendar: {
      title: 'Economic Calendar',
      highImpact: 'High Impact',
      upcoming: 'Upcoming',
      previous: 'Previous',
      forecast: 'Forecast',
      nextEvent: 'Next Event',
    },
    riskCalculator: {
      title: 'Position Sizer',
      accountBalance: 'Account Balance ($)',
      riskPercent: 'Risk (%)',
      stopLossPips: 'Stop Loss (pips)',
      calculate: 'Calculate',
      result: 'Result',
      lotSize: 'Lot Size',
      riskAmount: 'Risk Amount',
      pipValue: 'Pip Value',
      positionSizer: 'Position Sizer',
    },
    common: {
      loading: 'Loading market data...',
      error: 'Error loading data',
      close: 'Close',
    },
  },
  es: {
    header: {
      spread: 'Spread',
      dayHigh: 'Máximo',
      dayLow: 'Mínimo',
      live: 'EN VIVO',
      goldSpot: 'Oro Spot',
    },
    chart: {
      smartMoneyConcepts: 'Conceptos de Dinero Inteligente',
      demandZone: 'Zona de Demanda',
      supplyZone: 'Zona de Oferta',
    },
    orderBlocks: {
      title: 'Bloques de Órdenes Activos',
      zones: 'zonas',
      demandZones: 'Zonas de Demanda',
      supplyZones: 'Zonas de Oferta',
      noActiveZones: 'Sin zonas activas',
      fromPrice: 'del precio',
      bullishOB: 'OB Alcista',
      bearishOB: 'OB Bajista',
    },
    marketPulse: {
      title: 'Pulso del Mercado',
      all: 'Todo',
      news: 'Noticias',
      technical: 'Técnico',
      obHits: 'OB Hits',
      items: 'elementos',
      autoRefreshing: 'Actualización auto.',
      translateToSpanish: 'ES',
      translateToEnglish: 'EN',
      impact: 'impacto',
    },
    correlation: {
      title: 'Correlaciones de Mercado',
      inverse: 'Inversa',
      positive: 'Positiva',
    },
    economicCalendar: {
      title: 'Calendario Económico',
      highImpact: 'Alto Impacto',
      upcoming: 'Próximo',
      previous: 'Anterior',
      forecast: 'Pronóstico',
      nextEvent: 'Próximo Evento',
    },
    riskCalculator: {
      title: 'Calculadora de Posición',
      accountBalance: 'Balance de Cuenta ($)',
      riskPercent: 'Riesgo (%)',
      stopLossPips: 'Stop Loss (pips)',
      calculate: 'Calcular',
      result: 'Resultado',
      lotSize: 'Tamaño de Lote',
      riskAmount: 'Monto en Riesgo',
      pipValue: 'Valor del Pip',
      positionSizer: 'Calculadora de Posición',
    },
    common: {
      loading: 'Cargando datos del mercado...',
      error: 'Error al cargar datos',
      close: 'Cerrar',
    },
  },
};

export const getTranslation = (lang: Language): Translations => {
  return translations[lang];
};
