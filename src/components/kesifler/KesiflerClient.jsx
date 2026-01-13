'use client'

import { Container } from '../Container'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { LinksList } from './LinksList'
import { QuotesList } from './QuotesList'
import { VideoNotesList } from './VideoNotesList'
import { BookNotesList } from './BookNotesList'

export function KesiflerClient({ links, quotes, videos, books }) {
  return (
    <Container>
      <div className="mx-auto max-w-7xl py-8 sm:py-12">
        {/* Header - Centered */}
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Keşifler
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            İnternette bulduğum değerli kaynaklar ve topladığım notlar.
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="links" className="w-full">
          <div className="mb-6 flex justify-center">
            <TabsList className="inline-flex">
              <TabsTrigger
                value="links"
                className="px-3 py-2 text-xs sm:px-4 sm:text-sm"
              >
                📚 Linkler
              </TabsTrigger>
              <TabsTrigger
                value="quotes"
                className="px-3 py-2 text-xs sm:px-4 sm:text-sm"
              >
                💭 Alıntılar
              </TabsTrigger>
              <TabsTrigger
                value="video"
                className="px-3 py-2 text-xs sm:px-4 sm:text-sm"
              >
                🎬 Video
              </TabsTrigger>
              <TabsTrigger
                value="books"
                className="px-3 py-2 text-xs sm:px-4 sm:text-sm"
              >
                📖 Kitap
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Faydalı Linkler Tab */}
          <TabsContent value="links" className="mt-0">
            <LinksList links={links} />
          </TabsContent>

          {/* Alıntılar Tab */}
          <TabsContent value="quotes" className="mt-0">
            <QuotesList quotes={quotes} />
          </TabsContent>

          {/* Video Notları Tab */}
          <TabsContent value="video" className="mt-0">
            <VideoNotesList notes={videos} />
          </TabsContent>

          {/* Kitap Notları Tab */}
          <TabsContent value="books" className="mt-0">
            <BookNotesList notes={books} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
