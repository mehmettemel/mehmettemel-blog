'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Switch } from './ui/switch'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 text-muted" />
        <Switch disabled />
        <Moon className="h-4 w-4 text-muted" />
      </div>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <div className="flex items-center gap-2">
      <Sun
        className={`h-4 w-4 transition-colors ${
          !isDark ? 'text-primary' : 'text-muted'
        }`}
      />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label="Toggle theme"
      />
      <Moon
        className={`h-4 w-4 transition-colors ${
          isDark ? 'text-primary' : 'text-muted'
        }`}
      />
    </div>
  )
}
