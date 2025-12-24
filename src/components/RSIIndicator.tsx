import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts';
import { RSIData } from '@/hooks/useMarketData';

interface RSIIndicatorProps {
  data: RSIData[];
}

export const RSIIndicator = ({ data }: RSIIndicatorProps) => {
  const currentRSI = data[data.length - 1]?.value || 50;
  
  const rsiStatus = useMemo(() => {
    if (currentRSI >= 70) return { label: 'Overbought', color: 'text-bearish' };
    if (currentRSI <= 30) return { label: 'Oversold', color: 'text-bullish' };
    return { label: 'Neutral', color: 'text-muted-foreground' };
  }, [currentRSI]);

  const chartData = useMemo(() => 
    data.slice(-50).map((d, i) => ({
      index: i,
      value: d.value,
    }))
  , [data]);

  const gradientColor = currentRSI >= 50 ? 'hsl(160, 84%, 39%)' : 'hsl(350, 89%, 60%)';

  return (
    <div className="trading-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="indicator-label">RSI (14)</span>
          <span className={`font-mono text-lg font-semibold ${rsiStatus.color}`}>
            {currentRSI.toFixed(1)}
          </span>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          rsiStatus.label === 'Overbought' 
            ? 'bg-bearish/10 text-bearish' 
            : rsiStatus.label === 'Oversold'
            ? 'bg-bullish/10 text-bullish'
            : 'bg-muted text-muted-foreground'
        }`}>
          {rsiStatus.label}
        </span>
      </div>

      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rsiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <XAxis dataKey="index" hide />
            <YAxis 
              domain={[0, 100]} 
              ticks={[30, 50, 70]} 
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            
            <ReferenceLine y={70} stroke="hsl(350, 89%, 60%)" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine y={30} stroke="hsl(160, 84%, 39%)" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine y={50} stroke="hsl(217 33% 18%)" strokeDasharray="3 3" />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222 47% 8%)',
                border: '1px solid hsl(217 33% 18%)',
                borderRadius: '6px',
                fontSize: '12px',
              }}
              labelStyle={{ display: 'none' }}
              formatter={(value: number) => [`RSI: ${value.toFixed(1)}`, '']}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke={gradientColor}
              strokeWidth={2}
              fill="url(#rsiGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
