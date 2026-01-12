import { Container } from '../../components/Container'
import { ResearchesList } from '../../components/ResearchesList'
import { getAllPosts } from '../../lib/blog'

export const metadata = {
  title: 'Arastirmalar | Mehmet Temel',
  description:
    'Beslenme, gida ve insan biyolojisi uzerine derinlemesine arastirmalarim. Her konuda detayli analiz ve kisisel yorumlar.',
}

export default function ResearchesIndex() {
  const posts = getAllPosts()

  return (
    <Container>
      <div className="max-w-[620px] mx-auto pt-12 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] leading-[1.2] font-bold tracking-tight text-foreground mb-3">
            Arastirmalar
          </h1>
          <p className="text-base text-muted-foreground">
            Beslenme, gida ve insan biyolojisi uzerine arastirmalarim. Her bir
            konuda derinlemesine analiz, bilimsel kaynaklar ve kisisel
            yorumlarimi bulabilirsiniz.
          </p>
        </div>

        {/* Client Component for Filtering */}
        <ResearchesList posts={posts} />
      </div>
    </Container>
  )
}
