'use client'

import { useMemo } from 'react'
import { CacheItem } from './CacheItem'

/**
 * CacheList Component
 * Displays cache items grouped by status (pending/completed)
 */
export function CacheList({ items = [] }) {
  // Group items by completion status
  const { pending, completed } = useMemo(() => {
    const pending = items.filter((item) => !item.is_completed)
    const completed = items.filter((item) => item.is_completed)
    return { pending, completed }
  }, [items])

  const likedCount = useMemo(() => {
    return items.filter((item) => item.is_liked).length
  }, [items])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">
          Henüz hiçbir item eklenmemiş.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Telegram bot ile item ekleyebilirsiniz.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
          Toplam: {items.length}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
          Bekliyor: {pending.length}
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-foreground">
          Tamamlandı: {completed.length}
        </span>
        {likedCount > 0 && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-red-600 dark:bg-red-950 dark:text-red-400">
            ❤️ Beğenilen: {likedCount}
          </span>
        )}
      </div>

      {/* Pending Items */}
      {pending.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Bekleyenler ({pending.length})
          </h3>
          <div className="space-y-2">
            {pending.map((item) => (
              <CacheItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Completed Items */}
      {completed.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Tamamlananlar ({completed.length})
          </h3>
          <div className="space-y-2">
            {completed.map((item) => (
              <CacheItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
