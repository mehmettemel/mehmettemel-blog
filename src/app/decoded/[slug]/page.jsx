import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
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

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <Container>
      <div className="max-w-[620px] mx-auto pt-12 pb-16">
          <Link
            href="/decoded"
            aria-label="Go back to decoded"
            className="group mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition"
          >
            <ArrowLeftIcon className="h-4 w-4 stroke-current" />
            <span>Geri Dön</span>
          </Link>
          <article>
            <header className="flex flex-col mb-8">
              <h1 className="text-[32px] leading-[1.2] font-bold tracking-tight text-foreground">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center gap-3 text-sm text-muted">
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'MMM d, yyyy')}
                </time>
                {post.readingTime && (
                  <>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </>
                )}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs rounded-md bg-secondary text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
      </div>
    </Container>
  )
}
