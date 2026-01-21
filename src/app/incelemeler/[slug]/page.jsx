import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Container } from '../../../components/Container'
import { getPostBySlug, getAllPostSlugs } from '../../../lib/blog'

export async function generateStaticParams() {
  const posts = getAllPostSlugs()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {}
  }

  return {
    title: `${post.title} | Mehmet Temel`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

function ArrowLeftIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Mini TOC Component
function TableOfContents({ headings }) {
  if (!headings || headings.length === 0) return null

  return (
    <nav className="sticky top-24 hidden w-40 shrink-0 self-start lg:block">
      <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        İçindekiler
      </p>
      <ul className="space-y-1.5 text-xs">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="block leading-tight text-muted transition-colors hover:text-foreground"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <Container>
      <div className="py-8 sm:py-12">
        <Link
          href="/incelemeler"
          aria-label="Go back to incelemeler"
          className="group mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-all hover:gap-2 hover:text-foreground"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5 stroke-current transition-transform group-hover:-translate-x-0.5" />
          <span>Geri Dön</span>
        </Link>

        <div className="mx-auto flex max-w-4xl items-start gap-10 lg:gap-14">
          {/* Main Content */}
          <article className="max-w-2xl min-w-0 flex-1">
            <header className="mb-8">
              <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted">
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'd MMMM yyyy', { locale: tr })}
                </time>
                {post.readingTime && (
                  <>
                    <span className="text-muted-foreground/40">•</span>
                    <span>{post.readingTime}</span>
                  </>
                )}
              </div>
            </header>

            <div
              className="prose prose-sm max-w-none sm:prose-base prose-headings:scroll-mt-20"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* TOC Sidebar */}
          <TableOfContents headings={post.headings} />
        </div>
      </div>
    </Container>
  )
}
