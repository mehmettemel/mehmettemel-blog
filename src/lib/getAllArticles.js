export async function getAllArticles() {
  const articleSlugs = [
    'rewriting-the-cosmos-kernel-in-rust',
    'social-media-influence-on-youth',
  ]

  const articles = await Promise.all(
    articleSlugs.map(async (slug) => {
      const mod = await import(`@/app/articles/${slug}/page.mdx`)
      return { ...mod.article, slug }
    }),
  )
  return articles
}

export async function getArticlesByCountry(country) {
  const articles = await getAllArticles()
  return articles.filter((article) => article.country === country)
}

export async function getArticlesByCountryAndCity(country, city) {
  const articles = await getAllArticles()
  return articles.filter(
    (article) => article.country === country && article.city === city,
  )
}
