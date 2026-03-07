import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CompetitorBarChartProps {
  data: { store: string; price: number; isYou?: boolean }[];
  productName: string;
}

export function CompetitorBarChart({ data, productName }: CompetitorBarChartProps) {
  return (
    <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
      <h3 className="text-lg font-bold text-text-main mb-1">Price Comparison</h3>
      <p className="text-sm text-text-muted mb-6">{productName} — nearby stores</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
          <XAxis dataKey="store" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
            formatter={(value: any) => [`${value?.toLocaleString()} LBP`, 'Price']}
          />
          <Bar dataKey="price" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry: any, index) => (
              <Cell key={index} fill={entry.isYou ? 'var(--primary)' : 'var(--bg-muted)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
