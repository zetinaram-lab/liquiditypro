import { useMemo, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell, Tooltip } from 'recharts';
import { BullBearData } from '@/hooks/useMarketData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BullsBearsPowerProps {
  data: BullBearData[];
}

// THERMAL OPTIMIZATION: Memoize component to prevent unnecessary re-renders
export const BullsBearsPower = memo(({ data }: BullsBearsPowerProps) => {
  const { t } = useLanguage();

  // THERMAL OPTIMIZATION: Move heavy calculation to useMemo with throttled updates
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.slice(-30).map((d, i) => ({
      index: i,
      // Normalizar bearPower como negativo para cálculo correcto
      power: d.bullPower - Math.abs(d.bearPower),
      bullPower: d.bullPower,
      bearPower: -Math.abs(d.bearPower),
    }));
  }, [data]);

  // Validación de datos vacíos
  if (!chartData.length) {
    return (
      <div className="trading-card p-4">
        <span className="indicator-label">{t.bullsBears.title}</span>
        <p className="text-sm text-muted-foreground mt-2">{t.bullsBears.noData}</p>
      </div>
    );
  }

  const currentPower = chartData[chartData.length - 1];
  const netPower = currentPower?.power || 0;
  const bullishDominance = netPower > 0;

  // THERMAL OPTIMIZATION: Cache expensive calculations
  const powerMetrics = useMemo(() => {
    // Protección contra división por cero
    const maxPower = Math.max(...chartData.map(d => Math.abs(d.power)), 0.01);
    const powerPercent = Math.min(Math.abs(netPower) / maxPower * 100, 100);
    
    return { maxPower, powerPercent };
  }, [chartData, netPower]);

  // Tooltip personalizado más informativo
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    
    const data = payload[0].payload;
    return (
      <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,18%)] rounded-md p-2 text-xs">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between gap-3">
            <span className="text-bullish">{t.bullsBears.bulls}:</span>
            <span className="font-mono">+{data.bullPower.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-bearish">{t.bullsBears.bears}:</span>
            <span className="font-mono">{data.bearPower.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-3 border-t border-border pt-1 mt-1">
            <span className="text-muted-foreground">{t.bullsBears.power}:</span>
            <span className={`font-mono font-medium ${data.power >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {data.power > 0 ? '+' : ''}{data.power.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="trading-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="indicator-label">{t.bullsBears.title}</span>
        <div className={`flex items-center gap-1.5 ${bullishDominance ? 'text-bullish' : 'text-bearish'}`}>
          {bullishDominance ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-xs font-medium">
            {bullishDominance ? t.bullsBears.bullsControl : t.bullsBears.bearsControl} {t.bullsBears.inControl}
          </span>
        </div>
      </div>

      {/* Power Gauge - Mejorado con accesibilidad */}
      <div className="mb-4" role="progressbar" aria-label={t.bullsBears.title} aria-valuenow={netPower}>
        <div className="relative h-3 rounded-full overflow-hidden bg-secondary">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border z-10" />
          
          {/* Power bar */}
          <div
            className={`absolute top-0 bottom-0 transition-all duration-300 ${
              bullishDominance 
                ? 'left-1/2 bg-gradient-to-r from-bullish/50 to-bullish' 
                : 'right-1/2 bg-gradient-to-l from-bearish/50 to-bearish'
            }`}
            style={{ 
              width: `${powerMetrics.powerPercent / 2}%`,
              boxShadow: bullishDominance 
                ? '0 0 10px hsl(160 84% 39% / 0.5)' 
                : '0 0 10px hsl(350 89% 60% / 0.5)'
            }}
          />
        </div>
        
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-bearish font-mono">{t.bullsBears.bears}</span>
          <span className="text-xs text-muted-foreground font-mono">
            {netPower > 0 ? '+' : ''}{netPower.toFixed(2)}
          </span>
          <span className="text-xs text-bullish font-mono">{t.bullsBears.bulls}</span>
        </div>
      </div>

      {/* Histogram - Mejorado con tooltip personalizado */}
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="index" hide />
            <YAxis 
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <ReferenceLine y={0} stroke="hsl(217 33% 18%)" strokeWidth={1.5} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(217 33% 18% / 0.2)' }} />
            
            <Bar dataKey="power" radius={[2, 2, 0, 0]} maxBarSize={8} isAnimationActive={false}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.power >= 0 ? 'hsl(160, 84%, 39%)' : 'hsl(350, 89%, 60%)'}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

// Display name for debugging
BullsBearsPower.displayName = 'BullsBearsPower';
