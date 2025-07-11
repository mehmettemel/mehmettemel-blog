import { countries } from '../../../lib/countries'
import { getArticlesByCountryAndCity } from '../../../lib/getAllArticles'
import { Section } from '../../../components/Section'
import { Card } from '../../../components/Card'
import { SimpleLayout } from '../../../components/SimpleLayout'

export default async function CountryPage({ params }) {
  const { country } = params
  const countryData = countries.find((c) => c.slug === country)
  if (!countryData) return <div>Country not found</div>

  // Fetch articles for each city in this country
  const cityArticles = await Promise.all(
    countryData.cities.map(async (city) => {
      const articles = await getArticlesByCountryAndCity(country, city)
      return { city, articles }
    }),
  )

  // Filter out cities that have no articles
  const citiesWithArticles = cityArticles.filter(
    ({ articles }) => articles.length > 0,
  )

  return (
    <SimpleLayout
      title={countryData.name}
      intro={
        citiesWithArticles.length > 0
          ? `Cities I've visited in ${countryData.name} and related articles.`
          : `No articles found for this country`
      }
    >
      <div className="space-y-20">
        {citiesWithArticles.map(({ city, articles }) => (
          <Section key={city} title={city}>
            <div className="space-y-16">
              {articles.map((article) => (
                <Card as="article" key={article.slug}>
                  <Card.Title as="h3" href={`/articles/${article.slug}`}>
                    {article.title}
                  </Card.Title>
                  <Card.Description>{article.description}</Card.Description>
                  <Card.Eyebrow decorate>{article.date}</Card.Eyebrow>
                  <Card.Cta>Read article</Card.Cta>
                </Card>
              ))}
            </div>
          </Section>
        ))}
      </div>
    </SimpleLayout>
  )
}
