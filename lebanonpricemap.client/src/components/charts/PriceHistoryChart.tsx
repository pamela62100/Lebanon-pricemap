import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface PriceHistoryChartProps {
  data: { date: string; price: number }[];
  className?: string;
}

export function PriceHistoryChart({ data, className }: PriceHistoryChartProps) {
  return (
    <div className={cn("bg-bg-surface border border-border-soft rounded-xl p-6", className)}>
      <h3 className="text-lg font-bold text-text-main mb-1">Price History</h3>
      <p className="text-sm text-text-muted mb-6">Last 30 days</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
          <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
            formatter={(value: any) => [`${value?.toLocaleString()} LBP`, 'Price']}
          />
          <Line type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
