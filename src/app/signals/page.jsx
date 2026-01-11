import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Container } from '../../components/Container'

export const metadata = {
  title: 'Signals - Bu Haftanın Keşifleri | Mehmet Temel',
  description:
    'Her hafta internetten bulduğum beslenme ve insan biyolojisi hakkında ilginç kaynaklar ve bilgiler.',
}

async function getSignalsContent() {
  const signalsPath = path.join(process.cwd(), 'content/signals/current.md')

  if (!fs.existsSync(signalsPath)) {
    return null
  }

  const fileContents = fs.readFileSync(signalsPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .use(remarkGfm)
    .process(content)

  const contentHtml = processedContent.toString()

  return {
    content: contentHtml,
    lastUpdated: data.lastUpdated || new Date().toISOString(),
    ...data,
  }
}

export default async function SignalsPage() {
  const signals = await getSignalsContent()

  if (!signals) {
    return (
      <Container>
        <div className="max-w-[620px] mx-auto pt-12 pb-16">
          <div className="mb-12">
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
              Signals
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Her hafta dikkatimi çeken kaynaklar ve bilgiler.
            </p>
          </div>
          <div className="py-12 text-center">
            <p className="text-base text-muted-foreground">
              Bu hafta henüz signal yok. Pazartesi günü yeni içerik yayınlanacak!
            </p>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="max-w-[620px] mx-auto pt-12 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
            Signals
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground mb-4">
            Bu hafta dikkatimi çeken kaynaklar ve bilgiler.
          </p>
          <div className="text-sm text-muted">
            Son güncelleme:{' '}
            <time dateTime={signals.lastUpdated}>
              {format(new Date(signals.lastUpdated), "d MMMM yyyy, EEEE", { locale: tr })}
            </time>
          </div>
        </div>

        {/* Content */}
        <article
          className="prose prose-lg max-w-none dark:prose-invert
            prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: signals.content }}
        />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Her Pazartesi güncellenir.{' '}
            <a
              href="https://twitter.com/mehmettemel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Kaçırmamak için Twitter'dan takip et
            </a>
            .
          </p>
        </div>
      </div>
    </Container>
  )
}
