import Link from 'next/link'
import { format } from 'date-fns'
import { Container } from '../../components/Container'
import { getAllPosts } from '../../lib/blog'

export const metadata = {
  title: 'Blog - Travel & Food Stories | Mehmet Temel',
  description:
    'Read authentic travel stories, food guides, restaurant reviews, and travel tips from around the world. Discover hidden gems and local experiences.',
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <Container>
      <div className="max-w-[620px] mx-auto pt-12 pb-16">
        <h1 className="text-[22px] font-bold text-foreground mb-6">Blog</h1>

        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No blog posts yet. Check back soon!
          </p>
        ) : (
          <div className="space-y-0">
            {posts.map((post) => (
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
        )}
      </div>
    </Container>
  )
}
