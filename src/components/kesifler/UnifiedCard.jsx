'use client'

import { useState } from 'react'
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
 * Unified Card Component for Links, Quotes, Videos, and Books
 * - Consistent design across kesifler section
 * - CSS transitions (no framer-motion flickering)
 * - Smooth hover interactions
 * - Optional modal for videos and books
 * - Tooltip for quotes
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
  enableModal = false, // Only true for videos and books
  index = 0,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Check if it's a note (no title = quote/video/book)
  const isNote = !title && description

  const handleClick = () => {
    if (isNote && enableModal) {
      setIsModalOpen(true)
    }
  }

  const cardClasses =
    'group relative flex flex-col rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:border-primary/40 hover:bg-secondary/20 hover:shadow-md animate-[fade-in-up_0.3s_ease-out_forwards]'

  const CardContent = (
    <>
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
          <h3 className="line-clamp-3 text-sm leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>
        ) : isNote ? (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <blockquote className="line-clamp-3 text-xs leading-snug whitespace-pre-line text-foreground">
                  {description}
                </blockquote>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-h-96 max-w-md overflow-auto"
              >
                <p className="text-xs leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <blockquote className="line-clamp-3 text-xs leading-snug whitespace-pre-line text-foreground">
            {description}
          </blockquote>
        )}
      </div>

      {/* Info Icon for Author/Source (for quotes without links) */}
      {!isExternal && (author || source) && (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <div className="absolute top-2 right-2 cursor-help text-muted-foreground/40 transition-colors hover:text-muted-foreground">
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
        <div className="mt-2 border-t border-border/50 pt-2">
          <p className="truncate text-[10px] text-muted-foreground">{author}</p>
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
    </>
  )

  return (
    <>
      {isExternal ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClasses}
        >
          {CardContent}
        </a>
      ) : (
        <div
          className={cardClasses}
          onClick={handleClick}
          style={{ cursor: isNote && enableModal ? 'pointer' : 'default' }}
        >
          {CardContent}
        </div>
      )}

      {/* Modal for videos and books (only when enableModal is true) */}
      {isNote && enableModal && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Not</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <blockquote className="text-sm leading-relaxed whitespace-pre-line text-foreground">
                {description}
              </blockquote>
              {(author || source) && (
                <div className="mt-6 border-t border-border pt-4">
                  {author && (
                    <p className="mb-1 text-xs text-muted-foreground">
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
