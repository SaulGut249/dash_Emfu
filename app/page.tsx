'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

type Frame = {
  id: string
  ts: string
  width: number | null
  height: number | null
  nDet: number | null
}

export default function Home() {
  const [frames, setFrames] = useState<Frame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('frames')
        .select('*')
        .order('ts', { ascending: false })
        .limit(50)

      if (error) {
        setError(error.message)
      } else {
        setFrames(data as Frame[])
      }

      setLoading(false)
    }

    load()
  }, [])

  const chartData = frames
    .slice()
    .reverse()
    .map((f) => ({
      ts: new Date(f.ts).toLocaleTimeString(),
      nDet: f.nDet ?? 0,
    }))

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Dashboard de Detecciones</h1>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <section style={{ marginTop: '1.5rem' }}>
            <h2>Evolución de # detecciones</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ts" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="nDet"
                    stroke="#8884d8"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section style={{ marginTop: '2rem' }}>
            <h2>Últimos frames</h2>
            <table
              border={1}
              cellPadding={4}
              style={{ marginTop: '1rem', borderCollapse: 'collapse' }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Timestamp</th>
                  <th>Resolución</th>
                  <th># Detecciones</th>
                </tr>
              </thead>
              <tbody>
                {frames.map((f) => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{new Date(f.ts).toLocaleString()}</td>
                    <td>
                      {f.width} x {f.height}
                    </td>
                    <td>{f.nDet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </main>
  )
}
