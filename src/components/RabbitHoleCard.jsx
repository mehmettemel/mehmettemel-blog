'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Youtube, FileText } from 'lucide-react'

export function RabbitHoleCard({ post, index }) {
  const getTypeConfig = (type) => {
    switch (type) {
      case 'book':
        return {
          icon: BookOpen,
          gradient: 'from-blue-500/10 to-purple-500/10',
          borderColor: 'border-blue-500/20 hover:border-blue-500/40',
          iconColor: 'text-blue-500',
          bgPattern: 'bg-blue-500/5',
          label: 'Book Notes'
        }
      case 'video':
        return {
          icon: Youtube,
          gradient: 'from-red-500/10 to-pink-500/10',
          borderColor: 'border-red-500/20 hover:border-red-500/40',
          iconColor: 'text-red-500',
          bgPattern: 'bg-red-500/5',
          label: 'Video Notes'
        }
      case 'article':
        return {
          icon: FileText,
          gradient: 'from-green-500/10 to-emerald-500/10',
          borderColor: 'border-green-500/20 hover:border-green-500/40',
          iconColor: 'text-green-500',
          bgPattern: 'bg-green-500/5',
          label: 'Article Notes'
        }
      default:
        return {
          icon: FileText,
          gradient: 'from-foreground/5 to-foreground/10',
          borderColor: 'border-border hover:border-primary/40',
          iconColor: 'text-foreground',
          bgPattern: 'bg-secondary/50',
          label: 'Notes'
        }
    }
  }

  const config = getTypeConfig(post.type)
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/decoded/${post.slug}`}
        className={`group flex items-center justify-between relative overflow-hidden rounded-lg border ${config.borderColor} bg-gradient-to-r ${config.gradient} p-4 transition-all duration-300 hover:shadow-md`}
      >
        {/* Background pattern */}
        <div className={`absolute inset-0 ${config.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity`} />

        {/* Content */}
        <div className="relative flex items-center gap-4 flex-1 min-w-0">
          {/* Icon */}
          <div className={`flex-shrink-0 p-2 rounded-lg bg-background/80 backdrop-blur-sm ${config.iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>

          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {post.title}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-muted">
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-background/60 text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className={`flex-shrink-0 ml-3 ${config.iconColor} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  )
}
