'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export function Layout({ children }) {
  const pathname = usePathname()

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-auto">
        <div key={pathname} className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
