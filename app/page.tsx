// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DetectionsAreaChart } from './components/DetectionsAreaChart'

type Frame = {
  id: number
  ts: string
  nDet: number | null
}

export default function Home() {
  const [frames, setFrames] = useState<Frame[]>([])
  const [totalDet, setTotalDet] = useState(0)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('frames')
        .select('*')
        .order('ts', { ascending: false })
        .limit(100)

      if (!error && data) {
        setFrames(data as Frame[])
        setTotalDet(
          data.reduce((acc, f) => acc + (f.nDet ?? 0), 0)
        )
      }
    }

    load()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DetectionsAreaChart data={frames.map(f => ({ ts: f.ts, nDet: f.nDet ?? 0 }))} />
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <MetricCard title="Frames procesados" value={frames.length} />
        <MetricCard title="Detecciones totales" value={totalDet} />
        <MetricCard title="Promedio det./frame" value={frames.length ? (totalDet / frames.length).toFixed(2) : 0} />
      </section>

      {/* aquí luego irán los gráficos grandes, tablas, etc. */}
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        boxShadow: '0 10px 25px rgba(15,23,42,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}
    >
      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{title}</span>
      <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{value}</span>
    </div>
  )
}
