'use client'

import { useState } from 'react'
import { Heart, Info, MapPin, Building2, Mountain } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/**
 * TravelPlaceItem Component
 * Individual travel place row with visited and liked checkboxes
 */
export function TravelPlaceItem({ place, onUpdate }) {
  const [isVisited, setIsVisited] = useState(place.is_visited)
  const [isLiked, setIsLiked] = useState(place.is_liked)
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleCheckbox = async (field, currentValue) => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/seyahat/places/${place.id}/toggle`, {
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
      setIsVisited(data.place.is_visited)
      setIsLiked(data.place.is_liked)

      // Notify parent of the update for dynamic stats
      if (onUpdate) {
        onUpdate(data.place)
      }
    } catch (error) {
      console.error('Toggle error:', error)
      // Rollback on error
      if (field === 'is_visited') {
        setIsVisited(currentValue)
      } else {
        setIsLiked(currentValue)
      }
      alert(error.message || 'Bir hata oluştu')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleVisitedChange = (checked) => {
    setIsVisited(checked)
    toggleCheckbox('is_visited', !checked)
  }

  const handleLikedChange = (checked) => {
    setIsLiked(checked)
    toggleCheckbox('is_liked', !checked)
  }

  // Get icon and label based on place type
  const getPlaceTypeIcon = () => {
    switch (place.place_type) {
      case 'city':
        return <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      case 'attraction':
        return <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      case 'region':
        return <Mountain className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      default:
        return <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
    }
  }

  const getPlaceTypeLabel = () => {
    switch (place.place_type) {
      case 'city':
        return 'Şehir'
      case 'attraction':
        return 'Turistik Yer'
      case 'region':
        return 'Bölge'
      default:
        return 'Yer'
    }
  }

  return (
    <div
      className={`group relative flex items-center gap-2 rounded-lg border bg-card p-3 text-card-foreground transition-all duration-200 sm:gap-3 sm:p-4 ${
        isVisited
          ? 'border-border/40 bg-muted/30 dark:bg-muted/20'
          : 'border-border/60 hover:border-border hover:shadow-sm dark:border-border/40 dark:hover:border-border/60'
      } ${isUpdating ? 'pointer-events-none opacity-50' : ''} `}
    >
      {/* Visited Checkbox - Fixed width container */}
      <div
        onClick={() => !isUpdating && handleVisitedChange(!isVisited)}
        className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center"
      >
        <Checkbox
          checked={isVisited}
          disabled={isUpdating}
          className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
        />
      </div>

      {/* Place Name and Type - Flexible width */}
      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start gap-1.5">
          <p
            className={`flex-1 text-sm font-medium break-words transition-all duration-200 sm:text-base ${
              isVisited
                ? 'text-muted-foreground line-through dark:text-muted-foreground/80'
                : 'text-foreground dark:text-foreground'
            } `}
          >
            {place.name}
          </p>
          {/* Info icon with description tooltip */}
          {place.description && (
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
                    {place.description}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {/* Place Type with icon */}
        <div className="mt-1 flex items-center gap-1.5">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help text-xs text-muted-foreground sm:text-sm dark:text-muted-foreground/70">
                  {getPlaceTypeIcon()}
                  <span>{getPlaceTypeLabel()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <p className="font-medium">{getPlaceTypeLabel()}: {place.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Liked Button - Fixed width container */}
      <button
        onClick={() =>
          !isUpdating && isVisited && handleLikedChange(!isLiked)
        }
        disabled={!isVisited || isUpdating}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 sm:h-10 sm:w-10 ${
          isVisited
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
