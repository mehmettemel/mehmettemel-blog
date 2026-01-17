'use client'

import { useState } from 'react'
import { Heart, Info } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/**
 * CacheItem Component
 * Individual cache item row with completed and liked checkboxes
 */
export function CacheItem({ item, onUpdate }) {
  const [isCompleted, setIsCompleted] = useState(item.is_completed)
  const [isLiked, setIsLiked] = useState(item.is_liked)
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleCheckbox = async (field, currentValue) => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/listeler/${item.id}/toggle`, {
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

      // Notify parent of the update for dynamic stats
      if (onUpdate) {
        onUpdate(data.item)
      }
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
      className={`group relative flex items-center gap-2 rounded-lg border bg-card p-3 text-card-foreground transition-all duration-200 sm:gap-3 sm:p-4 ${
        isCompleted
          ? 'border-border/40 bg-muted/30 dark:bg-muted/20'
          : 'border-border/60 hover:border-border hover:shadow-sm dark:border-border/40 dark:hover:border-border/60'
      } ${isUpdating ? 'pointer-events-none opacity-50' : ''} `}
    >
      {/* Completed Checkbox - Fixed width container */}
      <div
        onClick={() => !isUpdating && handleCompletedChange(!isCompleted)}
        className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center"
      >
        <Checkbox
          checked={isCompleted}
          disabled={isUpdating}
          className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
        />
      </div>

      {/* Item Name and Author - Flexible width */}
      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start gap-1.5">
          <p
            className={`flex-1 text-sm font-medium break-words transition-all duration-200 sm:text-base ${
              isCompleted
                ? 'text-muted-foreground line-through dark:text-muted-foreground/80'
                : 'text-foreground dark:text-foreground'
            } `}
          >
            {item.name}
          </p>
          {/* Info icon with description tooltip */}
          {item.description && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="mt-0.5 shrink-0 text-muted-foreground/60 transition-colors hover:text-muted-foreground dark:text-muted-foreground/40 dark:hover:text-muted-foreground/80">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="max-w-xs sm:max-w-sm"
                >
                  <p className="text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
                    {item.description}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {item.author && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="mt-1 cursor-help text-xs break-words text-muted-foreground sm:text-sm dark:text-muted-foreground/70">
                  {item.author}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <p className="font-medium">
                  {item.list_type === 'kitap' && 'Yazar: '}
                  {item.list_type === 'film' && 'Yönetmen: '}
                  {item.list_type === 'urun' && 'Marka: '}
                  {item.author}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Liked Button - Fixed width container */}
      <button
        onClick={() =>
          !isUpdating && isCompleted && handleLikedChange(!isLiked)
        }
        disabled={!isCompleted || isUpdating}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 sm:h-10 sm:w-10 ${
          isCompleted
            ? 'cursor-pointer hover:bg-accent/50 dark:hover:bg-accent/30'
            : 'cursor-not-allowed opacity-30'
        } ${
          isLiked
            ? 'text-red-500 dark:text-red-400'
            : 'text-muted-foreground/60 dark:text-muted-foreground/40'
        } `}
        aria-label={isLiked ? 'Remove from liked' : 'Add to liked'}
      >
        <Heart
          className={`h-5 w-5 transition-all duration-200 sm:h-5 sm:w-5 ${isLiked ? 'scale-110 fill-current' : 'scale-100'} `}
          strokeWidth={2}
        />
      </button>
    </div>
  )
}
