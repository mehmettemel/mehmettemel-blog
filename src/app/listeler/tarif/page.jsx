import { Container } from '@/components/Container'
import { getRecipes } from '@/lib/db'
import { RecipeList } from '@/components/recipes/RecipeList'
import { getListCategory } from '@/data/list'

export const revalidate = 60

export const metadata = {
  title: 'Tarifler - Listeler | Mehmet Temel',
  description:
    'Yemek tarifleri ve mutfak notları. Telegram botu ile eklenen ve AI tarafından düzenlenen tarifler.',
  alternates: {
    canonical: 'https://mehmettemel.com/listeler/tarif',
  },
  openGraph: {
    title: 'Tarifler - Listeler | Mehmet Temel',
    description: 'Yemek tarifleri ve mutfak notları',
    url: 'https://mehmettemel.com/listeler/tarif',
    type: 'website',
  },
}

export default async function TariflerPage() {
  const category = getListCategory('tarif')

  // Fetch recipes
  let recipes = []
  try {
    recipes = await getRecipes()
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
  }

  return (
    <Container>
      <div className="mx-auto max-w-7xl py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label={category?.name}>
              {category?.emoji}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {category?.name || 'Tarifler'}
            </h1>
          </div>
          <p className="text-base text-muted-foreground">
            {category?.description}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            💡 Telegram botundan <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/tarif</code> komutu ile yeni tarif ekleyebilirsiniz.
            Gemini AI malzemeleri ve yapılışı analiz edip düzenler.
          </p>
        </div>

        {/* Recipe List */}
        <RecipeList recipes={recipes} />
      </div>
    </Container>
  )
}
