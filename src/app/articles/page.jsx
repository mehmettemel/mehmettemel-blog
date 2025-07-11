import { Card } from '../../components/Card'
import { SimpleLayout } from '../../components/SimpleLayout'
import { getAllArticles } from '../../lib/articles'
import { formatDate } from '../../lib/formatDate'

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 max-md:hidden"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

export const metadata = {
  title: 'Travel & Food Articles - Restaurant Reviews & Travel Guides',
  description:
    'Discover authentic travel experiences and food adventures from around the world. Read detailed restaurant reviews, local cuisine guides, travel tips, and hidden gems from a passionate food blogger and traveler.',
  keywords: [
    'travel blog',
    'food blog',
    'restaurant reviews',
    'travel articles',
    'food articles',
    'local cuisine',
    'authentic food',
    'travel tips',
    'travel guides',
    'city guides',
    'food culture',
    'street food',
    'hidden gems',
    'culinary travel',
    'food photography',
    'travel photography',
    'Turkish cuisine',
    'Mediterranean food',
    'Adana food',
    'Turkey travel',
    'solo travel',
    'budget travel',
    'backpacking',
    'digital nomad',
    'travel experiences',
    'food experiences',
    'local food spots',
    'best restaurants',
    'food recommendations',
    'travel recommendations',
  ],
  openGraph: {
    title: 'Travel & Food Articles - Restaurant Reviews & Travel Guides',
    description:
      'Discover authentic travel experiences and food adventures from around the world. Restaurant reviews, local cuisine guides, and travel tips.',
    type: 'website',
    url: 'https://mehmettemel.com/articles',
  },
  twitter: {
    title: 'Travel & Food Articles - Restaurant Reviews & Travel Guides',
    description:
      'Discover authentic travel experiences and food adventures from around the world. Restaurant reviews and travel tips.',
  },
  alternates: {
    canonical: 'https://mehmettemel.com/articles',
  },
}

export default async function ArticlesIndex() {
  let articles = await getAllArticles()

  return (
    <SimpleLayout
      title="Travel Stories & Food Adventures"
      intro="Authentic travel experiences, honest restaurant reviews, and hidden food gems from my adventures around the world. From street food stalls to fine dining, from budget backpacking to luxury travel - discover the world through food and culture."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {articles.map((article) => (
            <Article key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
