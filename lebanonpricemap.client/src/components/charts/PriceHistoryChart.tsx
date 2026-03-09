import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';

interface PriceHistoryChartProps {
  data: { date: string; price: number }[];
  className?: string;
}

export function PriceHistoryChart({ data, className }: PriceHistoryChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} opacity={0.5} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} 
          />
          <Tooltip
            cursor={{ stroke: 'var(--border-soft)', strokeWidth: 1 }}
            contentStyle={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-soft)', 
              borderRadius: '1rem', 
              fontSize: '11px',
              fontWeight: 700,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}
            itemStyle={{ color: 'var(--text-main)' }}
            labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
            formatter={(value: any) => [`${value?.toLocaleString()} LBP`, 'VALUE']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="var(--primary)" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            activeDot={{ r: 6, fill: 'var(--text-main)', stroke: 'var(--primary)', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
