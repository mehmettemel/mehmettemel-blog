import Link from 'next/link'
import { Container } from '../components/Container'
import { getAllPosts } from '../lib/blog'
import { format } from 'date-fns'

// SEO metadata for the home page
export const metadata = {
  title: 'Mehmet Temel - Food Decoded | Gıda Mühendisi × Frontend Developer',
  description:
    'İnternetin derinliklerinden beslenme ve insan biyolojisi hakkında az bilinen değerli kaynakları çıkarıyor, anlaşılır hale getiriyorum.',
  openGraph: {
    title: 'Mehmet Temel - Food Decoded',
    description:
      'İnternetin derinliklerinden beslenme ve insan biyolojisi hakkında az bilinen değerli kaynakları çıkarıyor, anlaşılır hale getiriyorum.',
    url: 'https://mehmettemel.com',
    siteName: 'Mehmet Temel',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mehmet Temel - Food Decoded',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@temelbusiness',
    creator: '@temelbusiness',
    title: 'Mehmet Temel - Food Decoded',
    description:
      'Beslenme ve insan biyolojisi hakkında değerli kaynakları küratörlük yapıyorum.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://mehmettemel.com',
  },
}

export default function Home() {
  const allPosts = getAllPosts()
  const recentPosts = allPosts.slice(0, 12)

  return (
    <Container>
      <div className="mx-auto max-w-7xl py-4 sm:py-6">
        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Mehmet Temel
          </h1>

          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            dijital koleksiyon
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mb-8 flex flex-wrap gap-2.5">
          <Link
            href="https://x.com/temelbusiness"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md active:scale-95 sm:text-base"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter'da Takip Et
          </Link>
          <Link
            href="/bu-hafta"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary/80 hover:shadow-md active:scale-95 sm:text-base"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.5 8.5a5 5 0 0 1 7 7M5.5 5.5a9 9 0 0 1 13 13"
              />
            </svg>
            Bu Hafta'ya Abone Ol
          </Link>
        </div>

        {/* Researches Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              Son Araştırmalar
            </h2>
            <Link
              href="/incelemeler"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted transition-all hover:gap-3 hover:text-primary sm:text-sm"
            >
              Tümünü Gör
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="space-y-0 overflow-hidden rounded-xl border border-border bg-card">
              {recentPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/incelemeler/${post.slug}`}
                  className="group flex items-center justify-between border-b border-border px-3 py-3 transition-all last:border-b-0 hover:bg-secondary/30 active:bg-secondary/40 sm:px-4 sm:py-4"
                >
                  <span className="line-clamp-2 flex-1 pr-3 text-sm font-medium text-foreground transition-colors group-hover:text-primary sm:text-base">
                    {post.title}
                  </span>
                  <span className="flex-shrink-0 text-xs whitespace-nowrap text-muted">
                    {format(new Date(post.date), 'MMM d, yyyy')}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-6 text-center">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Henüz yazı yok. Yakında ilk araştırmalar yayınlanacak!
              </p>
            </div>
          )}
        </section>
      </div>
    </Container>
  )
}
