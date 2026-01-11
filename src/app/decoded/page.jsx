import { Container } from '../../components/Container'
import { RabbitHoleCard } from '../../components/RabbitHoleCard'
import { getAllPosts } from '../../lib/blog'

export const metadata = {
  title: 'Decoded - Gıda ve Beslenme Araştırmaları | Mehmet Temel',
  description:
    'Yediğimiz şeylerin vücutta gerçekte ne yaptığını çözüyorum. Gıda, besinler ve vücut mekanizmaları hakkında derin dalış yazıları.',
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <Container>
      <div className="mx-auto max-w-[620px] pt-12 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
            Decoded
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Yediğimiz şeylerin vücutta gerçekte ne yaptığını çözüyorum.
            Tek bir gıda, besin veya mekanizma hakkında derin araştırmalar
            ve kişisel yorumlar.
          </p>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-base text-muted-foreground">
              Henüz yazı yok. Yakında ilk araştırmalar yayınlanacak!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, index) => (
              <RabbitHoleCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
