import { Container } from '@/components/Container'
import { getTravelHierarchy, getTravelStats } from '@/lib/db'
import { TravelAccordion } from '@/components/travel/TravelAccordion'
import { getListCategory } from '@/data/list'

export const revalidate = 60

export const metadata = {
  title: 'Seyahat - Listeler | Mehmet Temel',
  description:
    'Gezmek istediğim ve gezdiğim yerler. Kişisel seyahat listem ve deneyimlerim.',
  alternates: {
    canonical: 'https://mehmettemel.com/listeler/seyahat',
  },
  openGraph: {
    title: 'Seyahat - Listeler | Mehmet Temel',
    description: 'Gezmek istediğim ve gezdiğim yerler.',
    url: 'https://mehmettemel.com/listeler/seyahat',
    type: 'website',
  },
}

export default async function SeyahatListePage() {
  const category = getListCategory('seyahat')

  // Fetch travel hierarchy
  let hierarchyData = []
  let stats = { total: 0, completed: 0, liked: 0 }

  try {
    hierarchyData = await getTravelHierarchy()
    stats = await getTravelStats()
  } catch (error) {
    console.error('Failed to fetch travel data:', error)
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
              {category?.name || 'Seyahat'}
            </h1>
          </div>
          <p className="text-base text-muted-foreground">
            {category?.description}
          </p>

          {/* Stats */}
          {stats.total > 0 && (
            <div className="mt-4 flex flex-wrap gap-3 sm:gap-4">
              <div className="rounded-lg bg-muted/50 px-3 py-2 dark:bg-muted/30 sm:px-4">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Toplam
                </p>
                <p className="text-lg font-semibold text-foreground sm:text-xl">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 px-3 py-2 dark:bg-muted/30 sm:px-4">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Ziyaret Edildi
                </p>
                <p className="text-lg font-semibold text-foreground sm:text-xl">
                  {stats.completed}
                </p>
              </div>
              {stats.liked > 0 && (
                <div className="rounded-lg bg-muted/50 px-3 py-2 dark:bg-muted/30 sm:px-4">
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Beğenilen
                  </p>
                  <p className="text-lg font-semibold text-red-500 dark:text-red-400 sm:text-xl">
                    {stats.liked}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Travel Accordion */}
        <TravelAccordion data={hierarchyData} />

        {/* Help Text */}
        <div className="mt-8 rounded-lg border border-dashed border-border/60 bg-muted/20 p-4 dark:border-border/40 dark:bg-muted/10 sm:p-5">
          <p className="text-xs text-muted-foreground sm:text-sm">
            💡 <strong>Telegram&apos;dan yer ekle:</strong> <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/t Paris</code> veya <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/t Eiffel Tower</code> yazarak yeni yerler ekleyebilirsiniz.
          </p>
        </div>
      </div>
    </Container>
  )
}
