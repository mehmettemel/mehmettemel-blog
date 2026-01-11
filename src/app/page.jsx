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
    description: 'Beslenme ve insan biyolojisi hakkında değerli kaynakları küratörlük yapıyorum.',
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
      <div className="max-w-[620px] mx-auto pt-12 pb-16">
        {/* Hero Section */}
        <h1 className="text-[32px] leading-[1.2] font-bold tracking-tight text-foreground mb-2">
          Hi, I'm Mehmet Temel
        </h1>

        <p className="text-[20px] font-semibold text-foreground/90 mb-4">
          Food Engineer × Frontend Developer
        </p>

        <p className="text-base text-muted-foreground leading-relaxed max-w-[580px] mb-6">
          İnternetin derinliklerinden beslenme ve insan biyolojisi hakkında
          az bilinen değerli kaynakları çıkarıyor, anlaşılır hale getiriyorum.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="https://x.com/temelbusiness"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter'da Takip Et
          </Link>
          <Link
            href="/signals"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 8.5a5 5 0 0 1 7 7M5.5 5.5a9 9 0 0 1 13 13" />
            </svg>
            Signals'a Abone Ol
          </Link>
        </div>

        {/* Decoded Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold text-foreground">Son Decoded Yazıları</h2>
            <Link
              href="/decoded"
              className="text-sm text-muted hover:text-primary transition inline-flex items-center gap-1"
            >
              Tümünü Gör
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="space-y-0">
              {recentPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/decoded/${post.slug}`}
                  className="flex items-center justify-between py-3 group border-b border-border last:border-b-0 hover:bg-secondary/20 -mx-3 px-3 transition"
                >
                  <span className="text-[15px] text-foreground group-hover:text-primary transition flex-1 pr-4">
                    {post.title}
                  </span>
                  <span className="text-[13px] text-muted whitespace-nowrap">
                    {format(new Date(post.date), 'MMM d, yyyy')}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Henüz yazı yok. Yakında ilk araştırmalar yayınlanacak!
            </p>
          )}
        </section>
      </div>
    </Container>
  )
}
