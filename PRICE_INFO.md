# 📊 Información de Precios - XAU/USD

**Fecha**: 26 de diciembre de 2025  
**Versión**: v1.0.6  
**Status**: ⚠️ Datos Simulados

---

## ⚠️ IMPORTANTE: Esta App Usa Datos Simulados

**LiquidityPro actualmente NO usa datos reales de mercado.**  
Los precios, gráficos e indicadores son **generados aleatoriamente** para demostración.

### Por Qué

Esta es una **aplicación de demostración/portafolio** que muestra:
- ✅ Diseño profesional de trading terminal
- ✅ Implementación de Smart Money Concepts
- ✅ Visualización de Order Blocks
- ✅ Indicadores técnicos (RSI, Bulls/Bears)
- ✅ PWA y optimizaciones

**NO es una plataforma de trading real.**

---

## 💰 Precios Reales del Oro (XAU/USD)

### Diciembre 2025 (Aproximado)

| Par | Precio Real | Unidad |
|-----|------------|--------|
| **XAU/USD** | $2,600 - $2,660 | Por onza troy |
| **XAU/EUR** | €2,400 - €2,450 | Por onza troy |
| **Gold Gram** | $85 - $86 | Por gramo |

### ¿Por qué TradingView muestra $4,200?

Hay varias posibilidades:

#### 1. **Diferentes Pares de Trading**

```
XAU/USD = $2,630 (precio por onza en dólares) ✅ Lo que usamos
XAU/ARS = ~$4,200,000 (pesos argentinos) 💱
XAU/CLP = ~$2,500,000 (pesos chilenos) 💱
Gold CFD = Varía según broker 📈
Gold Futures = Diferentes contratos 📊
```

#### 2. **Diferentes Brokers**

Cada broker tiene spreads diferentes:

```
Broker A: $2,628.50 / $2,629.50 (spread de $1)
Broker B: $2,627.00 / $2,631.00 (spread de $4)
Broker C: $2,630.00 / $2,632.00 (spread de $2)
```

#### 3. **Futuros vs Spot**

```
Gold Spot (XAU/USD): $2,630
Gold Futures (GC): $2,635 (+$5 premium)
Mini Gold (MGC): $2,632
```

#### 4. **Gramos vs Onzas**

```
1 Onza Troy = 31.1035 gramos

XAU/USD: $2,630 por onza
XAU per gram: $84.55 por gramo
```

---

## 🔍 Cómo Verificar el Precio Real

### Fuentes Confiables:

1. **Kitco.com** - Estándar de la industria
   ```
   https://www.kitco.com/charts/livegold.html
   ```

2. **TradingView** - Múltiples fuentes
   ```
   https://www.tradingview.com/symbols/XAUUSD/
   ```

3. **Investing.com** - Datos en tiempo real
   ```
   https://www.investing.com/commodities/gold
   ```

4. **Bloomberg** - Datos profesionales
   ```
   https://www.bloomberg.com/quote/XAUUSD:CUR
   ```

5. **World Gold Council** - Oficial
   ```
   https://www.gold.org/goldhub/data/gold-prices
   ```

---

## 🔧 Para Implementar Datos Reales

### Opción 1: APIs Gratuitas (Limitadas)

#### Alpha Vantage (Gratis - 25 requests/día)
```typescript
const API_KEY = 'YOUR_KEY';
const url = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=XAU&to_symbol=USD&interval=5min&apikey=${API_KEY}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    // Procesar datos reales
  });
```

#### Finnhub (Gratis - 60 requests/minuto)
```typescript
const API_KEY = 'YOUR_KEY';
const url = `https://finnhub.io/api/v1/quote?symbol=OANDA:XAU_USD&token=${API_KEY}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const currentPrice = data.c; // Current price
  });
```

#### Polygon.io (Gratis - limitado)
```typescript
const API_KEY = 'YOUR_KEY';
const url = `https://api.polygon.io/v2/aggs/ticker/C:XAUUSD/prev?apiKey=${API_KEY}`;
```

### Opción 2: APIs Pagadas (Profesionales)

#### TradingView (Websocket)
```typescript
// Requiere cuenta TradingView Pro
const socket = new WebSocket('wss://data.tradingview.com/socket.io/websocket');
```

#### MetaTrader API
```typescript
// Requiere cuenta de broker MT4/MT5
const mt5 = require('mt5-connector');
```

#### Twelve Data ($0-$799/mes)
```typescript
const url = 'https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=5min';
```

### Opción 3: Scraping (No Recomendado)

```typescript
// Puede violar términos de servicio
// No recomendado para producción
```

---

## ⚙️ Actualizar a Datos Reales

Si quieres integrar datos reales:

### Paso 1: Elegir API

Recomendado para inicio: **Alpha Vantage** (gratis)

### Paso 2: Crear Hook

```typescript
// src/hooks/useRealMarketData.ts
import { useState, useEffect } from 'react';

export const useRealMarketData = () => {
  const [price, setPrice] = useState(0);
  
  useEffect(() => {
    const fetchPrice = async () => {
      const response = await fetch(
        'https://www.alphavantage.co/query?...'
      );
      const data = await response.json();
      setPrice(data.price);
    };
    
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Cada minuto
    
    return () => clearInterval(interval);
  }, []);
  
  return { price };
};
```

### Paso 3: Reemplazar Datos Simulados

```typescript
// En vez de:
const data = generateCandleData();

// Usar:
const { price, candles } = useRealMarketData();
```

---

## 📋 Disclaimer Recomendado

Agrega este aviso a tu app:

```tsx
<div className="disclaimer">
  ⚠️ <strong>Disclaimer:</strong> Este es un proyecto de demostración.
  Los datos mostrados son simulados y NO representan precios reales de mercado.
  No usar para decisiones de trading reales.
</div>
```

O en el footer:

```tsx
<footer>
  <p>
    LiquidityPro es una aplicación de demostración con datos simulados.
    Para trading real, consulte fuentes oficiales como TradingView,
    Bloomberg, o su broker registrado.
  </p>
</footer>
```

---

## 🎯 Resumen

| Aspecto | Estado Actual |
|---------|---------------|
| **Datos** | 🟡 Simulados |
| **Precio Base** | ~$2,630 (actualizado) |
| **Actualización** | Cada render (random) |
| **Precisión** | ❌ NO real |
| **Uso** | ✅ Demo/Portafolio |
| **Trading Real** | ❌ NO usar |

### Para Uso Real:
- [ ] Integrar API de datos real
- [ ] Agregar disclaimer legal
- [ ] Implementar WebSocket para tiempo real
- [ ] Registrar como plataforma de trading
- [ ] Cumplir regulaciones financieras
- [ ] Seguro y licencias

---

## 💡 Recomendación

**Para tu portafolio/demo:** ✅ Está perfecto así  
**Para trading real:** ❌ Necesitas:
1. API de datos reales
2. Licencias financieras
3. Compliance regulatorio
4. Infraestructura de seguridad
5. Capital y seguros

---

## 📞 Contacto

Si tienes preguntas sobre los precios o quieres implementar datos reales:

- **GitHub**: [@zetinaram-lab](https://github.com/zetinaram-lab)
- **Email**: [tu email]
- **Repositorio**: [liquiditypro](https://github.com/zetinaram-lab/liquiditypro)

---

**Nota Final**: Esta aplicación es para **demostración de habilidades técnicas**.  
No es una herramienta financiera regulada. Para trading real, usa plataformas certificadas.
