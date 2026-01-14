'use client'

import * as React from 'react'
import { Check } from 'lucide-react'

/**
 * Checkbox Component
 * Simple, accessible checkbox with Tailwind styling
 */
export const Checkbox = React.forwardRef(
  ({ className = '', checked = false, disabled = false, onCheckedChange, ...props }, ref) => {
    const handleChange = (e) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked)
      }
    }

    return (
      <div className="relative inline-flex">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <div
          className={`
            h-5 w-5 rounded border-2 transition-all duration-200
            flex items-center justify-center cursor-pointer
            ${
              checked
                ? 'bg-primary border-primary'
                : 'bg-background border-muted-foreground/30'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/60'}
            peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2
            ${className}
          `}
        >
          {checked && (
            <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
