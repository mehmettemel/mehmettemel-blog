'use client'

import { Container } from '../../components/Container'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { LinksList } from '../../components/kesifler/LinksList'
import { QuotesList } from '../../components/kesifler/QuotesList'
import { usefulLinks, inspirationalQuotes } from '../../data/kesifler'

export default function Kesifler() {
  return (
    <Container>
      <div className="mx-auto max-w-7xl py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1.5">
            Keşifler
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            İnternette bulduğum değerli kaynaklar ve topladığım notlar.
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="links" className="w-full">
          <TabsList className="w-full grid grid-cols-2 sm:w-auto sm:inline-flex mb-3">
            <TabsTrigger value="links" className="text-xs py-1.5">
              📚 Linkler
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs py-1.5">
              💭 Notlar
            </TabsTrigger>
          </TabsList>

          {/* Faydalı Linkler Tab */}
          <TabsContent value="links" className="mt-0">
            <LinksList links={usefulLinks} />
          </TabsContent>

          {/* Notlar ve Alıntılar Tab */}
          <TabsContent value="notes" className="mt-0">
            <QuotesList quotes={inspirationalQuotes} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
