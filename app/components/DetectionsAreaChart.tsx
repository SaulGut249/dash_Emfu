// app/components/DetectionsAreaChart.tsx (puedes crear carpeta components)
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
    <div
    style={{
        background: 'white',
        borderRadius: '0.75rem',
        padding: '1rem',
        boxShadow: '0 10px 25px rgba(15,23,42,0.07)',
        height: 320,
    }}
    >
    <h3 style={{ marginBottom: '0.5rem' }}>Detecciones por tiempo</h3>
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
        <XAxis dataKey="ts" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="nDet" fill="#6366f1" stroke="#4f46e5" />
        </AreaChart>
    </ResponsiveContainer>
    </div>
)
}
