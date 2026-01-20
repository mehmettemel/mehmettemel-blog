'use client'

import { useState } from 'react'
import { Container } from '@/components/Container'
import RandomButton from '@/components/RandomButton'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function RastgelePage() {
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRandomNote = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/notes/random')

      if (!response.ok) {
        throw new Error('Not yüklenemedi')
      }

      const data = await response.json()
      setNote(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching random note:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryEmoji = (type) => {
    const emojis = {
      quote: '💭',
      video: '🎬',
      book: '📖',
    }
    return emojis[type] || '📝'
  }

  const getCategoryName = (type) => {
    const names = {
      quote: 'Alıntı',
      video: 'Video',
      book: 'Kitap',
    }
    return names[type] || 'Not'
  }

  const getTypeUrl = (type) => {
    const urls = {
      quote: '/kesifler/alintilar',
      video: '/kesifler/videolar',
      book: '/kesifler/kitaplar',
    }
    return urls[type] || '/kesifler'
  }

  return (
    <Container>
      <div className="mx-auto max-w-3xl py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="text-3xl">🎲</span>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Rastgele Keşif
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Alıntılar, videolar ve kitaplardan rastgele bir not keşfet
              </p>
            </div>
          </div>

          {/* Random Button */}
          <div className="flex flex-col items-center gap-3">
            <RandomButton
              onClick={fetchRandomNote}
              disabled={loading}
              text={loading ? '⏳' : '🎲'}
            />
            {!note && !error && (
              <p className="text-xs text-muted-foreground">
                Rastgele bir not görmek için butona tıkla
              </p>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">❌ {error}</p>
          </div>
        )}

        {/* Note Display */}
        {note && (
          <div className="animate-[fade-in-up_0.4s_ease-out_forwards]">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
              {/* Category Badge */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Link
                  href={getTypeUrl(note.note_type)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <span>{getCategoryEmoji(note.note_type)}</span>
                  {getCategoryName(note.note_type)}
                </Link>

                {note.category && (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {note.category}
                  </span>
                )}
              </div>

              {/* Title (for links) */}
              {note.title && (
                <h2 className="mb-3 text-xl font-bold text-foreground">
                  {note.title}
                </h2>
              )}

              {/* Main Text */}
              <blockquote className="mb-4 whitespace-pre-line text-base leading-relaxed text-foreground">
                {note.text}
              </blockquote>

              {/* Metadata */}
              {(note.author || note.source || note.url) && (
                <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                  {note.author && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Yazar:</span>
                      <span>{note.author}</span>
                    </div>
                  )}

                  {note.source && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Kaynak:</span>
                      <span>{note.source}</span>
                    </div>
                  )}

                  {note.url && (
                    <div className="flex items-center gap-2">
                      <a
                        href={note.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Kaynağa Git
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Date */}
              {note.created_at && (
                <div className="mt-4 text-xs text-muted-foreground/60">
                  {new Date(note.created_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              )}
            </div>

            {/* Try Again Button */}
            <div className="mt-6 text-center">
              <button
                onClick={fetchRandomNote}
                disabled={loading}
                className="rounded-lg bg-secondary px-6 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Yükleniyor...' : 'Başka Bir Tane 🎲'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}
