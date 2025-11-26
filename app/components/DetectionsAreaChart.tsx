// app/components/DetectionsAreaChart.tsx
'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Props = {
  data: { ts: string; nDet: number }[]
}

export function DetectionsAreaChart({ data }: Props) {
  const chartData = data.map((f) => ({
    ts: new Date(f.ts).toLocaleTimeString(),
    nDet: f.nDet,
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm h-80">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Detecciones por tiempo</h3>
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
              tickFormatter={(value) => `${value}`} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="nDet" 
              fill="#6366f1" 
              stroke="#4f46e5" 
              fillOpacity={0.2} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
