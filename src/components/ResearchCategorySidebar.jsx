'use client'

import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

// Animation variants for horizontal category chips
const chipVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.02,
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
}

export function ResearchCategorySidebar({
  categories,
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <div className="mb-4">
      {/* Horizontal Category Chips - Always visible at top */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => {
          const isActive = selectedCategory === category.id
          return (
            <motion.button
              key={category.id}
              custom={index}
              variants={chipVariants}
              initial="hidden"
              animate="visible"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                  : 'bg-secondary text-foreground hover:bg-secondary/80 hover:scale-105',
              )}
            >
              <span className="text-sm">{category.icon}</span>
              <span>{category.name}</span>
              <span className={cn(
                "text-xs rounded-full px-1.5 py-0.5",
                isActive
                  ? "bg-primary-foreground/20"
                  : "bg-muted/50"
              )}>
                {category.count}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
