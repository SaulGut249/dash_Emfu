// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enfutech Dashboard',
}

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
      <body className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex w-64 flex-col bg-gray-900 text-white p-6">
            <div className="mb-8 font-bold text-xl">
              Enfutech
            </div>
            <nav className="flex flex-col gap-3">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Dashboard</a>
              {/* más links... */}
            </nav>
          </aside>

          {/* Mobile Header / Sidebar Toggle could go here */}

          {/* Contenido principal */}
          <div className="flex-1 flex flex-col">
            {/* Topbar */}
            <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
              <h2 className="text-lg font-medium">Dashboard</h2>
              <div>Perfil</div>
            </header>

            <main className="p-6 flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
