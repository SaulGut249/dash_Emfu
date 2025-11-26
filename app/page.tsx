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
        // Reverse to show oldest to newest in chart if needed, 
        // but typically charts expect time sorted. 
        // Let's keep it sorted by time ascending for the chart.
        const sortedData = (data as Frame[]).sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
        setFrames(sortedData)
        setTotalDet(
          data.reduce((acc, f) => acc + (f.nDet ?? 0), 0)
        )
      }
    }

    load()

    // Real-time subscription
    const channel = supabase
      .channel('realtime-frames')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'frames' },
        (payload) => {
          const newFrame = payload.new as Frame
          setFrames((prev) => {
            const newFrames = [...prev, newFrame]
            // Keep only last 100 frames to avoid memory issues
            if (newFrames.length > 100) {
              return newFrames.slice(newFrames.length - 100)
            }
            return newFrames
          })
          setTotalDet((prev) => prev + (newFrame.nDet ?? 0))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <DetectionsAreaChart data={frames.map(f => ({ ts: f.ts, nDet: f.nDet ?? 0 }))} />
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex flex-col gap-1">
      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
      <span className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  )
}
