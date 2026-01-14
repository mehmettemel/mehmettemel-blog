import { Container } from '@/components/Container'
import { getCacheItems } from '@/lib/db'
import { CacheList } from '@/components/cache/CacheList'
import { getCacheCategory } from '@/data/cache'

export const revalidate = 60

export const metadata = {
  title: 'Film & Dizi - Cache',
  description: 'İzlemek istediğim ve izlediğim filmler ve diziler',
}

export default async function FilmCachePage() {
  const category = getCacheCategory('film')

  // Fetch cache items
  let items = []
  try {
    items = await getCacheItems('film')
  } catch (error) {
    console.error('Failed to fetch cache items:', error)
  }

  return (
    <Container>
      <div className="mx-auto max-w-4xl py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label={category?.name}>
              {category?.emoji}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {category?.name || 'Film & Dizi'}
            </h1>
          </div>
          <p className="text-base text-muted-foreground">
            {category?.description}
          </p>
        </div>

        {/* List */}
        <CacheList items={items} />
      </div>
    </Container>
  )
}
