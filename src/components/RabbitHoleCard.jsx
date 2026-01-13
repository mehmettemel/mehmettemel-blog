'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const getCategoryName = (category) => {
  const names = {
    gidalar: 'Gıdalar',
    besinler: 'Besinler',
    mekanizmalar: 'Mekanizmalar',
  }
  return names[category] || category
}

export function RabbitHoleCard({ post, index = 0 }) {
  const getCategoryConfig = (category) => {
    switch (category) {
      case 'gidalar':
        return {
          gradient: 'from-primary/5 to-primary/10',
          borderColor: 'border-primary/20 hover:border-primary/40',
          bgPattern: 'bg-primary/5',
          badgeBg: 'bg-primary/10',
          badgeText: 'text-primary',
        }
      case 'besinler':
        return {
          gradient: 'from-secondary/5 to-secondary/10',
          borderColor: 'border-secondary/20 hover:border-secondary/40',
          bgPattern: 'bg-secondary/5',
          badgeBg: 'bg-secondary/10',
          badgeText: 'text-secondary-foreground',
        }
      case 'mekanizmalar':
        return {
          gradient: 'from-accent/5 to-accent/10',
          borderColor: 'border-accent/20 hover:border-accent/40',
          bgPattern: 'bg-accent/5',
          badgeBg: 'bg-accent/10',
          badgeText: 'text-accent-foreground',
        }
      default:
        return {
          gradient: 'from-foreground/5 to-foreground/10',
          borderColor: 'border-border hover:border-primary/40',
          bgPattern: 'bg-secondary/50',
          badgeBg: 'bg-secondary',
          badgeText: 'text-secondary-foreground',
        }
    }
  }

  const config = getCategoryConfig(post.category)
  const categoryName = getCategoryName(post.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link
        href={'/incelemeler/' + post.slug}
        className={`group relative flex items-center justify-between overflow-hidden rounded-lg border ${config.borderColor} bg-gradient-to-r ${config.gradient} p-3 transition-all duration-200 hover:shadow-md active:scale-[0.99] sm:p-3.5`}
      >
        <div
          className={`absolute inset-0 ${config.bgPattern} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        />
        <div className="relative flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <div className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/50 text-xs font-semibold sm:flex">
            {post.category.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-xs font-semibold text-foreground transition-colors group-hover:text-primary sm:line-clamp-1 sm:text-sm">
              {post.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] sm:px-2 ${config.badgeBg} ${config.badgeText} font-medium`}
              >
                {categoryName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {new Date(post.date).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              {post.readingTime && (
                <span className="hidden text-[10px] text-muted-foreground sm:inline">
                  {post.readingTime}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="ml-2 flex-shrink-0 text-muted-foreground opacity-50 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </motion.div>
  )
}
