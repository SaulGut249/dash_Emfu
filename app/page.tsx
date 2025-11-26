// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DetectionsAreaChart } from './components/DetectionsAreaChart'
import { DetectionViewer } from './components/DetectionViewer'

type Detection = {
  id: string
  frame_id: string
  cls_id: number
  cls_name: string
  conf: number
  x1: number
  y1: number
  x2: number
  y2: number
}

type Frame = {
  id: string
  ts: string
  width: number
  height: number
  nDet: number | null
  latencies: Record<string, number> | null
  detections: Detection[]
}

export default function Home() {
  const [frames, setFrames] = useState<Frame[]>([])
  const [totalDet, setTotalDet] = useState(0)

  useEffect(() => {
    const load = async () => {
      // Fetch frames and their detections
      const { data, error } = await supabase
        .from('frames')
        .select('*, detections(*)')
        .order('ts', { ascending: false })
        .limit(100)

      if (!error && data) {
        // Sort by time ascending for the chart
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
      .channel('realtime-root')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'frames' },
        async (payload) => {
          const newFrame = payload.new as Frame
          // Initialize detections array for the new frame
          newFrame.detections = []
          
          setFrames((prev) => {
            const newFrames = [...prev, newFrame]
            if (newFrames.length > 100) {
              return newFrames.slice(newFrames.length - 100)
            }
            return newFrames
          })
          setTotalDet((prev) => prev + (newFrame.nDet ?? 0))
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'detections' },
        (payload) => {
          const newDet = payload.new as Detection
          setFrames((prev) => {
            // Find the frame this detection belongs to
            return prev.map(f => {
              if (f.id === newDet.frame_id) {
                // Avoid duplicates if any
                if (f.detections.some(d => d.id === newDet.id)) return f;
                // Increment nDet and add detection
                return { 
                  ...f, 
                  nDet: (f.nDet ?? 0) + 1,
                  detections: [...f.detections, newDet] 
                }
              }
              return f
            })
          })
          setTotalDet((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const latestFrame = frames.length > 0 ? frames[frames.length - 1] : null
  
  // Calculate average latency from the last few frames
  const avgLatency = frames.length > 0 
    ? frames.slice(-10).reduce((acc, f) => {
        const l = f.latencies ? Object.values(f.latencies).reduce((a, b) => a + b, 0) : 0
        return acc + l
      }, 0) / Math.min(frames.length, 10)
    : 0

  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard de Detección</h1>
        <p className="text-gray-500 dark:text-gray-400">Monitoreo en tiempo real</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Detecciones */}
        <DetectionsAreaChart data={frames.map(f => ({ ts: f.ts, nDet: f.nDet ?? 0 }))} />
        
        {/* Visualizador de Detecciones (Frame) */}
        {latestFrame ? (
          <DetectionViewer 
            width={latestFrame.width} 
            height={latestFrame.height} 
            detections={latestFrame.detections || []} 
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm h-80 flex items-center justify-center text-gray-500">
            Esperando datos...
          </div>
        )}
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Frames procesados" value={frames.length} />
        <MetricCard title="Detecciones totales" value={totalDet} />
        <MetricCard title="Promedio det./frame" value={frames.length ? (totalDet / frames.length).toFixed(2) : 0} />
        <MetricCard title="Latencia Promedio (ms)" value={avgLatency.toFixed(1)} />
      </section>
      
      {/* Debug view for latencies if needed */}
      {latestFrame?.latencies && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
           <h4 className="text-sm font-medium text-gray-500 mb-2">Latencias del último frame</h4>
           <div className="flex gap-4">
             {Object.entries(latestFrame.latencies).map(([key, val]) => (
               <div key={key} className="flex flex-col">
                 <span className="text-xs text-gray-400 uppercase">{key}</span>
                 <span className="font-mono text-sm dark:text-white">{val} ms</span>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex flex-col gap-1 border border-gray-100 dark:border-gray-700">
      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
      <span className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  )
}
