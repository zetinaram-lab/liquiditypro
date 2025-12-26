# LiquidityPro - Advanced Trading Terminal

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)

Una plataforma profesional de análisis técnico y trading con indicadores avanzados, conceptos Smart Money, y análisis en tiempo real.

## 🚀 Características Principales

### 📊 Análisis Técnico Avanzado
- **Indicadores Técnicos**: RSI, MACD, Bulls vs Bears Power
- **Smart Money Concepts**: Order Blocks, Zonas de Demanda/Oferta
- **Gráficos Interactivos**: Velas japonesas con múltiples timeframes
- **Correlaciones de Mercado**: DXY, US10Y y otros instrumentos

### 🎯 Sistema de Señales de Trading
- Señales automáticas basadas en múltiples indicadores
- Cálculo de fuerza y confianza de señales
- Alertas personalizables

### 🌐 Internacionalización
- Soporte completo para Inglés y Español
- Detección automática del idioma del navegador
- Persistencia de preferencias en localStorage

### 📱 Diseño Responsivo
- Optimizado para desktop, tablet y móvil
- Tema oscuro profesional
- UI moderna con Tailwind CSS y shadcn/ui

## 🛠️ Stack Tecnológico

- **Frontend**: React 18.3 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Build Tool**: Vite
- **Package Manager**: Bun
- **State Management**: React Context API + Custom Hooks

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ o Bun
- npm, yarn, pnpm o bun

### Instalación con Bun (Recomendado)

```bash
# Clonar el repositorio
git clone <YOUR_GIT_URL>
cd liquiditypro-main

# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev
```

### Instalación con npm

```bash
npm install
npm run dev
```

## 🏗️ Estructura del Proyecto

```
liquiditypro-main/
├── src/
│   ├── components/          # Componentes React
│   │   ├── BullsBearsPower.tsx
│   │   ├── CandlestickChart.tsx
│   │   ├── TradingSignals.tsx
│   │   ├── ConnectionStatus.tsx
│   │   └── ui/             # Componentes UI (shadcn)
│   ├── hooks/              # Custom Hooks
│   │   ├── useMarketData.ts
│   │   ├── useTradingSignals.ts
│   │   └── useNotifications.ts
│   ├── contexts/           # React Contexts
│   │   └── LanguageContext.tsx
│   ├── i18n/               # Internacionalización
│   │   └── translations.ts
│   ├── lib/                # Utilidades
│   │   ├── utils.ts
│   │   └── validators.ts
│   ├── types/              # TypeScript Types
│   │   └── trading.ts
│   └── pages/              # Páginas
│       └── Index.tsx
├── public/                 # Archivos estáticos
└── package.json
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
bun run dev          # Inicia servidor de desarrollo

# Build
bun run build        # Crea build de producción
bun run preview      # Preview del build de producción

# Linting
bun run lint         # Ejecuta ESLint
```

## 🌟 Mejoras Implementadas

### 1. **LanguageContext Mejorado**
- ✅ Persistencia en localStorage
- ✅ Detección automática del idioma del navegador
- ✅ Prevención de FOUC (Flash of Unstyled Content)
- ✅ Manejo de errores robusto

### 2. **useMarketData Hook**
- ✅ Manejo de conexiones con reconexión automática
- ✅ Estados de error y loading
- ✅ Limpieza de recursos (cleanup)
- ✅ Validación de datos
- ✅ Protección contra memory leaks

### 3. **BullsBearsPower Component**
- ✅ Validación de datos vacíos
- ✅ Protección contra división por cero
- ✅ Tooltip personalizado informativo
- ✅ Accesibilidad (ARIA labels)
- ✅ Cálculo correcto del poder neto

### 4. **Sistema de Validación**
- ✅ Utilidades para validar datos de mercado
- ✅ Sanitización de números
- ✅ Formateo seguro de valores

### 5. **Sistema de Notificaciones**
- ✅ Notificaciones en navegador
- ✅ Toast notifications
- ✅ Gestión de prioridades
- ✅ Persistencia de notificaciones

### 6. **Trading Signals**
- ✅ Análisis automático de múltiples indicadores
- ✅ Cálculo de confianza y fuerza
- ✅ Componente visual de señales
- ✅ Descripción detallada de análisis

## 📚 Uso de Componentes

### Trading Signals Component

```tsx
import { TradingSignals } from '@/components/TradingSignals';

function Dashboard() {
  const { data } = useMarketData();
  
  return (
    <TradingSignals
      rsiData={data.rsiData}
      bullBearData={data.bullBearData}
      candles={data.candles}
    />
  );
}
```

### Connection Status

```tsx
import { ConnectionStatus } from '@/components/ConnectionStatus';

function Header() {
  const { isConnected, error, reconnect } = useMarketData();
  
  return (
    <ConnectionStatus
      isConnected={isConnected}
      error={error}
      onReconnect={reconnect}
    />
  );
}
```

### Notifications Hook

```tsx
import { useNotifications } from '@/hooks/useNotifications';

function App() {
  const { addNotification, notifications, unreadCount } = useNotifications();
  
  // Agregar notificación
  addNotification({
    type: 'signal',
    title: 'Nueva Señal',
    message: 'Señal de compra detectada',
    priority: 'high',
  });
  
  return <div>Notificaciones: {unreadCount}</div>;
}
```

## 🐛 Bugs Corregidos

1. ✅ **BullsBearsPower**: Cálculo incorrecto del poder neto
2. ✅ **useMarketData**: Memory leak en WebSocket
3. ✅ **LanguageContext**: Pérdida de preferencias al recargar
4. ✅ **Validación**: División por cero en varios componentes
5. ✅ **Tipos**: Falta de tipos en varios callbacks

## 🎯 Roadmap

- [ ] Tests unitarios con Vitest
- [ ] Tests E2E con Playwright
- [ ] Documentación con Storybook
- [ ] CI/CD con GitHub Actions
- [ ] WebSocket real con Binance
- [ ] Autenticación de usuarios
- [ ] Guardado de configuraciones personalizadas
- [ ] Más indicadores técnicos (Fibonacci, Ichimoku, etc.)
- [ ] Backtesting de estrategias
- [ ] Alertas por email/SMS

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## � Deployment

### Vercel (Recomendado)
```bash
npm run build
# Luego sube la carpeta dist/ a Vercel
```

### Netlify
```bash
npm run build
# Build command: npm run build
# Publish directory: dist
```

### GitHub Pages
```bash
npm run build
# Deploy la carpeta dist/
```

## 📧 Contacto

**Autor**: Huguette Mont  
**GitHub**: [@zetinaram-lab](https://github.com/zetinaram-lab)  
**Repositorio**: [liquiditypro](https://github.com/zetinaram-lab/liquiditypro)

---

⭐ Si este proyecto te ayudó, considera darle una estrella en GitHub!
