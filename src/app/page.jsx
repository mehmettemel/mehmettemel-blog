import Link from 'next/link'
import { Container } from '../components/Container'
import { getAllPosts } from '../lib/blog'
import { format } from 'date-fns'

// SEO metadata for the home page
export const metadata = {
  title: 'Mehmet Temel - Frontend Developer & Food Engineer',
  description:
    'Mehmet Temel - Frontend developer bridging technology and food engineering.',
  openGraph: {
    title: 'Mehmet Temel - Frontend Developer & Food Engineer',
    description:
      'Mehmet Temel - Frontend developer bridging technology and food engineering.',
    url: 'https://mehmettemel.com',
    siteName: 'Mehmet Temel',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mehmet Temel',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@temelbusiness',
    creator: '@temelbusiness',
    title: 'Mehmet Temel',
    description: 'Frontend developer bridging technology and food engineering.',
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
        <h1 className="text-[32px] leading-[1.2] font-bold tracking-tight text-foreground">
          Hi 👋, I'm Mehmet Temel!
        </h1>

        {/* Info Badges */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-secondary text-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Senior Frontend Developer
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-secondary text-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            From Turkey, based in Adana
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-secondary text-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Food Engineering & Software
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-secondary text-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Building user-friendly interfaces
          </span>
        </div>

        {/* Social Links */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="https://x.com/temelbusiness"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-secondary text-foreground hover:bg-primary/10 transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Thoughts on Twitter
          </Link>
          <Link
            href="https://www.instagram.com/mehmettemelim"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-secondary text-foreground hover:bg-primary/10 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Adventures on Instagram
          </Link>
        </div>

        {/* Blog Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold text-foreground">Blog</h2>
            <Link
              href="/blog"
              className="text-sm text-muted hover:text-primary transition inline-flex items-center gap-1"
            >
              View all blog posts
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="space-y-0">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
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
              No blog posts yet. Check back soon!
            </p>
          )}
        </section>
      </div>
    </Container>
  )
}
