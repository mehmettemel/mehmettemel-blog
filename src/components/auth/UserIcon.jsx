'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginDialog } from './LoginDialog'
import { cn } from '@/lib/utils'

export function UserIcon({ className }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      setIsAuthenticated(data.authenticated)
    } catch (error) {
      console.error('Session check error:', error)
      setIsAuthenticated(false)
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
          className
        )}
        disabled
        aria-label="Admin"
      >
        <span className="opacity-0">Admin</span>
      </button>
    )
  }

  const handleClick = () => {
    if (isAuthenticated) {
      router.push('/admin')
    } else {
      setShowLogin(true)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          'inline-flex h-9 items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
          'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
          className
        )}
        aria-label={isAuthenticated ? 'Go to admin' : 'Login'}
      >
        Admin
      </button>
      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </>
  )
}
