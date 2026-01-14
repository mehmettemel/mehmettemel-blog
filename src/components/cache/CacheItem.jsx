'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

/**
 * CacheItem Component
 * Individual cache item row with completed and liked checkboxes
 */
export function CacheItem({ item }) {
  const [isCompleted, setIsCompleted] = useState(item.is_completed)
  const [isLiked, setIsLiked] = useState(item.is_liked)
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleCheckbox = async (field, currentValue) => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/cache/${item.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update')
      }

      const data = await response.json()

      // Update state based on response
      setIsCompleted(data.item.is_completed)
      setIsLiked(data.item.is_liked)
    } catch (error) {
      console.error('Toggle error:', error)
      // Rollback on error
      if (field === 'is_completed') {
        setIsCompleted(currentValue)
      } else {
        setIsLiked(currentValue)
      }
      alert(error.message || 'Bir hata oluştu')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCompletedChange = (checked) => {
    setIsCompleted(checked)
    toggleCheckbox('is_completed', !checked)
  }

  const handleLikedChange = (checked) => {
    setIsLiked(checked)
    toggleCheckbox('is_liked', !checked)
  }

  return (
    <div
      className={`
        group flex items-center gap-3 rounded-lg border border-border/40 bg-background p-3
        transition-all duration-200 hover:bg-accent/20 hover:border-border
        ${isCompleted ? 'opacity-70' : ''}
        ${isUpdating ? 'pointer-events-none opacity-50' : ''}
      `}
    >
      {/* Completed Checkbox */}
      <div onClick={() => !isUpdating && handleCompletedChange(!isCompleted)}>
        <Checkbox
          checked={isCompleted}
          disabled={isUpdating}
        />
      </div>

      {/* Item Name */}
      <div className="flex-1 min-w-0">
        <p
          className={`
            text-sm font-medium transition-all
            ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}
          `}
        >
          {item.name}
        </p>
      </div>

      {/* Liked Button */}
      <button
        onClick={() => !isUpdating && isCompleted && handleLikedChange(!isLiked)}
        disabled={!isCompleted || isUpdating}
        className={`
          flex items-center justify-center w-8 h-8 rounded-full transition-all
          ${isCompleted ? 'cursor-pointer hover:bg-accent' : 'cursor-not-allowed opacity-30'}
          ${isLiked ? 'text-red-500' : 'text-muted-foreground'}
        `}
        aria-label={isLiked ? 'Remove from liked' : 'Add to liked'}
      >
        <Heart
          className={`h-5 w-5 transition-all ${isLiked ? 'fill-current' : ''}`}
          strokeWidth={2}
        />
      </button>
    </div>
  )
}
