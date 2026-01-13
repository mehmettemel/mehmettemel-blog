'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'

/**
 * Unified Card Component for both Links and Quotes
 * - Consistent design across kesifler section
 * - Smooth framer-motion animations without flickering
 * - Smooth hover interactions
 * - Modal for long quotes
 */
export function UnifiedCard({
  title,
  description,
  icon,
  badge,
  author,
  source,
  url,
  isExternal = false,
  index = 0,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Check if quote is long (more than ~100 characters or has multiple lines)
  const isLongQuote = !title && description && (description.length > 100 || description.split('\n').length > 2)

  const CardWrapper = isExternal ? motion.a : motion.div
  const cardProps = isExternal
    ? {
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : isLongQuote
    ? {
        onClick: () => setIsModalOpen(true),
        style: { cursor: 'pointer' }
      }
    : {}

  return (
    <>
      <CardWrapper
        {...cardProps}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.25,
          delay: index * 0.02,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="group relative flex flex-col rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:border-primary/40 hover:bg-secondary/20 hover:shadow-md hover:scale-105"
      >
      {/* Icon Badge - More compact */}
      {icon && badge && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-base" role="img" aria-label={badge.label}>
            {icon}
          </span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>
      )}

      {/* Title/Text - No description */}
      <div className="flex-1">
        {title ? (
          <h3 className="text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-3">
            {title}
          </h3>
        ) : isLongQuote ? (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <blockquote className="text-xs leading-snug whitespace-pre-line text-foreground line-clamp-3">
                  {description}
                </blockquote>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-md max-h-96 overflow-auto">
                <p className="text-xs leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <blockquote className="text-xs leading-snug whitespace-pre-line text-foreground line-clamp-3">
            {description}
          </blockquote>
        )}
      </div>

      {/* Info Icon for Author/Source (for quotes without links) */}
      {!isExternal && (author || source) && (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <div className="absolute top-2 right-2 text-muted-foreground/40 cursor-help transition-colors hover:text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <div className="space-y-1">
                {author && (
                  <p className="text-xs">
                    <span className="font-semibold">Kimden:</span> {author}
                  </p>
                )}
                {source && (
                  <p className="text-xs">
                    <span className="font-semibold">Nereden:</span> {source}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* External Link Icon */}
      {isExternal && (
        <div className="absolute top-2 right-2 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary">
          <ExternalLink className="h-3.5 w-3.5" />
        </div>
      )}

      {/* Author badge at bottom for links */}
      {isExternal && author && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground truncate">
            {author}
          </p>
        </div>
      )}

      {/* URL Link (for quotes with sources) */}
      {url && !isExternal && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Kaynak
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      )}
      </CardWrapper>

      {/* Modal for long quotes */}
      {isLongQuote && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Not</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <blockquote className="text-sm leading-relaxed whitespace-pre-line text-foreground">
                {description}
              </blockquote>
              {(author || source) && (
                <div className="mt-6 pt-4 border-t border-border">
                  {author && (
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-semibold">Kimden:</span> {author}
                    </p>
                  )}
                  {source && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Nereden:</span> {source}
                    </p>
                  )}
                </div>
              )}
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Kaynağa Git
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
