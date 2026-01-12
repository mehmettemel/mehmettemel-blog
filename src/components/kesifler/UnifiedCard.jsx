'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/**
 * Unified Card Component for both Links and Quotes
 * - Consistent design across kesifler section
 * - Smooth framer-motion animations without flickering
 * - Smooth hover interactions
 */
export function UnifiedCard({
  title,
  description,
  icon,
  badge,
  author,
  source,
  tags = [],
  url,
  isExternal = false,
  index = 0,
}) {
  const CardWrapper = isExternal ? motion.a : motion.div
  const cardProps = isExternal
    ? {
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {}

  return (
    <CardWrapper
      {...cardProps}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group relative block rounded-xl border border-border bg-card p-6 transition-colors duration-200 hover:border-primary/40 hover:bg-secondary/20 hover:shadow-md sm:p-7"
    >
      {/* Icon Badge */}
      {icon && badge && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={badge.label}>
            {icon}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>
      )}

      {/* Title/Text */}
      <div className="mb-4">
        {title ? (
          <h3 className="text-lg leading-snug font-semibold text-foreground transition-colors group-hover:text-primary sm:text-xl">
            {title}
          </h3>
        ) : (
          <blockquote className="text-base leading-[1.7] whitespace-pre-line text-foreground sm:text-lg">
            {description}
          </blockquote>
        )}
      </div>

      {/* Description (for links) */}
      {title && description && (
        <p className="mb-4 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {/* Author & Source */}
      {(author || source) && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted">
          {author && (
            <span className="font-medium">
              {title ? `Yazar: ${author}` : `— ${author}`}
            </span>
          )}
          {source && (
            <>
              {author && <span className="text-muted-foreground/50">•</span>}
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1 italic cursor-help border-b border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors">
                      {source}
                      <Info className="h-3 w-3 opacity-50" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">Kaynak: {source}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-md bg-secondary/70 px-2.5 py-1 text-xs font-medium text-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* External Link Icon */}
      {isExternal && (
        <div className="absolute top-6 right-6 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary">
          <ExternalLink className="h-5 w-5" />
        </div>
      )}

      {/* URL Link (for quotes with sources) */}
      {url && !isExternal && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Kaynağa Git
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </CardWrapper>
  )
}
