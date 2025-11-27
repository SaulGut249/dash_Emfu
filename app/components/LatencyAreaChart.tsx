'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type Props = {
  data: { ts: string; [key: string]: string | number }[]
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F'];

export function LatencyAreaChart({ data }: Props) {
  // Extract all unique keys from data, excluding 'ts'
  const keys = Array.from(new Set(data.flatMap(d => Object.keys(d).filter(k => k !== 'ts'))));

  const chartData = data.map((f) => ({
    ...f,
    ts: new Date(f.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm h-80">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Latencia por componente (ms)</h3>
      <div className="w-full h-[calc(100%-2rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <XAxis 
              dataKey="ts" 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}ms`} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            {keys.map((key, index) => (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                stackId="1" 
                stroke={COLORS[index % COLORS.length]} 
                fill={COLORS[index % COLORS.length]} 
                fillOpacity={0.6} 
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
