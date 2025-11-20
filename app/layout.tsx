// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enfutech Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside
            style={{
              width: '260px',
              background: '#111827',
              color: 'white',
              padding: '1.5rem',
            }}
          >
            <div style={{ marginBottom: '2rem', fontWeight: 'bold' }}>
              Enfutech
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="/" style={{ color: '#e5e7eb', textDecoration: 'none' }}>Dashboard</a>
              {/* más links... */}
            </nav>
          </aside>

          {/* Contenido principal */}
          <div style={{ flex: 1, background: '#f3f4f6' }}>
            {/* Topbar */}
            <header
              style={{
                height: '64px',
                background: 'white',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.5rem',
              }}
            >
              <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>Dashboard</h2>
              <div>Perfil</div>
            </header>

            <main style={{ padding: '1.5rem' }}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
