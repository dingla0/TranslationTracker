import { Suspense } from 'react'
import Dashboard from '@/components/dashboard/dashboard'
import Sidebar from '@/components/layout/sidebar'

export default function HomePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      </main>
    </div>
  )
}