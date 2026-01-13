'use client'

import { useState } from 'react'
import { ExternalLink, Play, BookOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'

/**
 * SourceCard Component - Groups notes by source (video/book)
 * - Shows source name as title
 * - Shows author/speaker as subtitle
 * - Shows note count badge
 * - Opens modal with all notes from that source
 */
export function SourceCard({
  source,
  author,
  notes = [],
  url,
  type = 'video', // 'video' or 'book'
  index = 0,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const icon =
    type === 'video' ? (
      <Play className="h-4 w-4" />
    ) : (
      <BookOpen className="h-4 w-4" />
    )
  const emoji = type === 'video' ? '🎬' : '📖'
  const noteLabel = type === 'video' ? 'video notu' : 'kitap notu'

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative flex animate-[fade-in-up_0.3s_ease-out_forwards] cursor-pointer flex-col rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:bg-secondary/20 hover:shadow-lg"
      >
        {/* Title - Source name */}
        <div className="mb-2 flex items-start gap-2">
          <span className="mt-0.5 flex-shrink-0 text-primary/70">{icon}</span>
          <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
            {source || 'Bilinmeyen Kaynak'}
          </h3>
        </div>

        {/* Author */}
        {author && (
          <p className="mb-3 line-clamp-1 text-xs text-muted-foreground">
            {type === 'video' ? '👤' : '✍️'} {author}
          </p>
        )}

        {/* Note count badge */}
        <div className="mt-auto flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {notes.length} {noteLabel}
          </span>
          {url && (
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50" />
          )}
        </div>
      </div>

      {/* Modal with all notes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
          <DialogHeader className="border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{emoji}</span>
              <div>
                <DialogTitle className="text-base font-semibold">
                  {source || 'Bilinmeyen Kaynak'}
                </DialogTitle>
                {author && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {author}
                  </p>
                )}
              </div>
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {notes.length} not
              </span>
            </div>
          </DialogHeader>

          {/* Notes list - compact grid */}
          <div className="max-h-[70vh] overflow-auto py-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {notes.map((note, idx) => (
                <div
                  key={note.id || idx}
                  className="rounded-md border border-border/40 bg-secondary/10 p-3"
                >
                  <blockquote className="text-xs leading-relaxed whitespace-pre-line text-foreground">
                    {note.text}
                  </blockquote>
                  {note.tags && note.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {note.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* External link */}
          {url && (
            <div className="border-t border-border pt-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                {type === 'video' ? 'Videoyu İzle' : 'Kitaba Git'}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
