'use client'

import { Container } from '../Container'
import { LinksList } from './LinksList'
import { QuotesList } from './QuotesList'
import { VideoNotesList } from './VideoNotesList'
import { BookNotesList } from './BookNotesList'

const tabConfig = {
  links: {
    label: 'Linkler',
    emoji: '📚',
    desc: 'İnternette bulduğum faydalı kaynaklar.',
  },
  quotes: {
    label: 'Alıntılar',
    emoji: '💭',
    desc: 'İlham veren alıntılar ve notlar.',
  },
  video: {
    label: 'Video',
    emoji: '🎬',
    desc: 'Video notları ve öğrendiklerim.',
  },
  books: { label: 'Kitap', emoji: '📖', desc: 'Kitaplardan aldığım notlar.' },
}

export function KesiflerClient({
  links,
  quotes,
  videos,
  books,
  initialTab = 'links',
}) {
  const currentTab = tabConfig[initialTab] ? initialTab : 'links'
  const config = tabConfig[currentTab]

  return (
    <Container>
      <div className="mx-auto max-w-7xl py-8 sm:py-12">
        {/* Header - Shows current section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Keşifler: {config.label}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {config.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Content - Based on current tab */}
        {currentTab === 'links' && <LinksList links={links} />}
        {currentTab === 'quotes' && <QuotesList quotes={quotes} />}
        {currentTab === 'video' && <VideoNotesList notes={videos} />}
        {currentTab === 'books' && <BookNotesList notes={books} />}
      </div>
    </Container>
  )
}
