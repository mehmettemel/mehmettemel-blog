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
 * - Shows source name as title (full text, no ellipsis)
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
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const icon =
    type === 'video' ? (
      <Play className="h-5 w-5" />
    ) : (
      <BookOpen className="h-5 w-5" />
    )
  const emoji = type === 'video' ? '🎬' : '📖'
  const noteLabel = type === 'video' ? 'video notu' : 'kitap notu'

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group flex animate-[fade-in-up_0.3s_ease-out_forwards] cursor-pointer flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:bg-secondary/20 hover:shadow-lg"
      >
        {/* Title - Source name (full text) */}
        <div className="mb-3 flex items-start gap-3">
          <span className="mt-0.5 flex-shrink-0 text-primary/70">{icon}</span>
          <h3 className="text-base leading-snug font-semibold text-foreground transition-colors group-hover:text-primary">
            {source || 'Bilinmeyen Kaynak'}
          </h3>
        </div>

        {/* Author */}
        {author && (
          <p className="mb-4 text-sm text-muted-foreground">
            {type === 'video' ? '👤' : '✍️'} {author}
          </p>
        )}

        {/* Note count badge */}
        <div className="mt-auto flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {notes.length} {noteLabel}
          </span>
          {url && <ExternalLink className="h-4 w-4 text-muted-foreground/50" />}
        </div>
      </div>

      {/* Modal with all notes - Responsive */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="flex h-[85vh] w-[95vw] max-w-4xl flex-col overflow-hidden sm:h-auto sm:max-h-[85vh] sm:w-full">
          <DialogHeader className="flex-shrink-0 border-b border-border pb-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-2xl">{emoji}</span>
              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold sm:text-xl">
                  {source || 'Bilinmeyen Kaynak'}
                </DialogTitle>
                {author && (
                  <p className="mt-1 text-sm text-muted-foreground">{author}</p>
                )}
              </div>
              <span className="self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:self-center">
                {notes.length} not
              </span>
            </div>
          </DialogHeader>

          {/* Notes list - Responsive grid */}
          <div className="flex-1 overflow-auto py-4 pb-8">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {notes.map((note, idx) => (
                <div
                  key={note.id || idx}
                  className="rounded-lg border border-border/40 bg-secondary/10 p-4"
                >
                  <blockquote className="text-sm leading-relaxed whitespace-pre-line text-foreground">
                    {note.text}
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          {/* External link */}
          {url && (
            <div className="border-t border-border pt-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {type === 'video' ? 'Videoyu İzle' : 'Kitaba Git'}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
