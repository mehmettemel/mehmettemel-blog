import { Container } from '@/components/Container'
import { getListItems } from '@/lib/db'
import { CacheList } from '@/components/cache/CacheList'
import { getListCategory } from '@/data/list'

export const revalidate = 60

export const metadata = {
  title: 'Ürünler - Listeler',
  description: 'Almak istediğim ve aldığım ürünler',
}

export default async function UrunListePage() {
  const category = getListCategory('urun')

  // Fetch list items
  let items = []
  try {
    items = await getListItems('urun')
  } catch (error) {
    console.error('Failed to fetch list items:', error)
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
              {category?.name || 'Ürünler'}
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
