'use client'

import { cn } from '../../lib/utils'

export function CategorySidebar({
  categories,
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <div className="mb-4">
      {/* Horizontal Category Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-foreground hover:bg-secondary/80',
              )}
            >
              <span className="text-sm">{category.icon}</span>
              <span>{category.name}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs',
                  isActive ? 'bg-primary-foreground/20' : 'bg-muted/50',
                )}
              >
                {category.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
