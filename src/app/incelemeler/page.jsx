import { Container } from '../../components/Container'
import { ResearchesList } from '../../components/ResearchesList'
import { getAllPosts } from '../../lib/blog'

export const metadata = {
  title: 'Araştırmalar | Mehmet Temel',
  description:
    'Beslenme, gıda ve insan biyolojisi üzerine derinlemesine araştırmalarım. Her konuda detaylı analiz ve kişisel yorumlar.',
}

export default function ResearchesIndex() {
  const posts = getAllPosts()

  return (
    <Container>
      <div className="mx-auto max-w-7xl py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Araştırmalar
          </h1>
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            ilgimi çeken konular hakkında yaptığım araştırmalar
          </p>
        </div>

        {/* Client Component for Filtering */}
        <ResearchesList posts={posts} />
      </div>
    </Container>
  )
}
