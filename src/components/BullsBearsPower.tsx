import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell, Tooltip } from 'recharts';
import { BullBearData } from '@/hooks/useMarketData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BullsBearsPowerProps {
  data: BullBearData[];
}

export const BullsBearsPower = ({ data }: BullsBearsPowerProps) => {
  const chartData = useMemo(() => 
    data.slice(-30).map((d, i) => ({
      index: i,
      power: d.bullPower + d.bearPower,
      bullPower: d.bullPower,
      bearPower: d.bearPower,
    }))
  , [data]);

  const currentPower = chartData[chartData.length - 1];
  const netPower = currentPower?.power || 0;
  const bullishDominance = netPower > 0;

  // Calculate power percentage for the gauge
  const maxPower = Math.max(...chartData.map(d => Math.abs(d.power)), 1);
  const powerPercent = Math.min(Math.abs(netPower) / maxPower * 100, 100);

  return (
    <div className="trading-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="indicator-label">Bulls vs Bears Power</span>
        <div className={`flex items-center gap-1.5 ${bullishDominance ? 'text-bullish' : 'text-bearish'}`}>
          {bullishDominance ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-xs font-medium">
            {bullishDominance ? 'Bulls' : 'Bears'} in Control
          </span>
        </div>
      </div>

      {/* Power Gauge */}
      <div className="mb-4">
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
              width: `${powerPercent / 2}%`,
              boxShadow: bullishDominance 
                ? '0 0 10px hsl(160 84% 39% / 0.5)' 
                : '0 0 10px hsl(350 89% 60% / 0.5)'
            }}
          />
        </div>
        
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-bearish font-mono">BEARS</span>
          <span className="text-xs text-muted-foreground font-mono">
            {netPower > 0 ? '+' : ''}{netPower.toFixed(2)}
          </span>
          <span className="text-xs text-bullish font-mono">BULLS</span>
        </div>
      </div>

      {/* Histogram */}
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="index" hide />
            <YAxis 
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine y={0} stroke="hsl(217 33% 18%)" />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222 47% 8%)',
                border: '1px solid hsl(217 33% 18%)',
                borderRadius: '6px',
                fontSize: '12px',
              }}
              labelStyle={{ display: 'none' }}
              formatter={(value: number) => [
                `Power: ${value > 0 ? '+' : ''}${value.toFixed(2)}`,
                ''
              ]}
            />
            
            <Bar dataKey="power" radius={[2, 2, 0, 0]}>
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
};
