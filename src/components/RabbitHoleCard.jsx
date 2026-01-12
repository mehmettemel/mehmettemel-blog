'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
const getCategoryName = (category) => {
  const names = {
    gidalar: 'Gidalar',
    besinler: 'Besinler',
    mekanizmalar: 'Mekanizmalar',
  }
  return names[category] || category
}
export function RabbitHoleCard({ post, index }) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={'/incelemeler/' + post.slug}
        className={
          'group relative flex items-center justify-between overflow-hidden rounded-lg border ' +
          config.borderColor +
          ' bg-gradient-to-r ' +
          config.gradient +
          ' p-4 transition-all duration-300 hover:shadow-md'
        }
      >
        <div
          className={
            'absolute inset-0 ' +
            config.bgPattern +
            ' opacity-0 transition-opacity group-hover:opacity-100'
          }
        />
        <div className="relative flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/50 text-sm font-semibold">
            {post.category.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h2>
            <div className="mt-1 flex items-center gap-3">
              <span
                className={
                  'rounded-full px-2 py-0.5 text-xs ' +
                  config.badgeBg +
                  ' ' +
                  config.badgeText +
                  ' font-medium'
                }
              >
                {categoryName}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {post.readingTime && (
                <span className="text-xs text-muted-foreground">
                  {post.readingTime}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="ml-3 flex-shrink-0 text-muted-foreground opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100">
          <svg
            className="h-5 w-5"
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
