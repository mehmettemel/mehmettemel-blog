import { Providers } from './providers'
import { Layout } from '../components/Layout'
import { siteConfig, generateStructuredData } from '../lib/seo'

import '../styles/tailwind.css'

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s - ${siteConfig.name}`,
    default: siteConfig.title,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.author.twitter,
    creator: siteConfig.author.twitter,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you have them from Search Console
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateStructuredData({
                type: 'Person',
                data: {
                  name: siteConfig.author.name,
                  jobTitle: siteConfig.author.jobTitle,
                  url: siteConfig.url,
                  sameAs: [
                    siteConfig.links.twitter,
                    siteConfig.links.github,
                    siteConfig.links.linkedin,
                    siteConfig.links.instagram,
                  ],
                  knowsAbout: [
                    'Travel Writing',
                    'Food Blogging',
                    'Restaurant Reviews',
                    'Travel Photography',
                    'Cultural Experiences',
                    'Turkish Cuisine',
                    'Mediterranean Food',
                    'Street Food',
                    'Local Cuisine',
                    'Travel Tips',
                    'City Guides',
                    'Frontend Development',
                    'React',
                    'Vue.js',
                    'E-commerce Development',
                  ],
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Adana',
                    addressCountry: 'Turkey',
                  },
                  description: siteConfig.description,
                  email: siteConfig.author.email,
                  nationality: 'Turkish',
                  homeLocation: {
                    '@type': 'Place',
                    name: 'Adana, Turkey',
                  },
                  workLocation: {
                    '@type': 'Place',
                    name: 'Remote/Digital Nomad',
                  },
                },
              }),
            ),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateStructuredData({
                type: 'WebSite',
                data: {
                  name: siteConfig.name,
                  url: siteConfig.url,
                  description: siteConfig.description,
                  publisher: siteConfig.author.name,
                },
              }),
            ),
          }}
        />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateStructuredData({
                type: 'LocalBusiness',
                data: {
                  name: siteConfig.business.name,
                  description: siteConfig.business.description,
                  url: siteConfig.url,
                  address: siteConfig.business.address,
                  geo: siteConfig.business.geo,
                  areaServed: siteConfig.business.areaServed,
                  serviceType: siteConfig.business.services,
                  knowsAbout: [
                    'Travel Writing',
                    'Food Reviews',
                    'Restaurant Recommendations',
                    'Travel Photography',
                    'City Guides',
                    'Cultural Experiences',
                    'Turkish Cuisine',
                    'Mediterranean Food',
                    'Street Food',
                    'Local Food Culture',
                    'Travel Tips',
                    'Budget Travel',
                    'Solo Travel',
                  ],
                },
              }),
            ),
          }}
        />

        {/* Blog Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Blog',
              name: 'Mehmet Temel Travel & Food Blog',
              description:
                'Travel and food blog featuring authentic experiences, restaurant reviews, and travel guides',
              url: siteConfig.url,
              author: {
                '@type': 'Person',
                name: siteConfig.author.name,
                url: siteConfig.url,
              },
              publisher: {
                '@type': 'Person',
                name: siteConfig.author.name,
              },
              blogPost: [
                {
                  '@type': 'BlogPosting',
                  headline: 'Travel and Food Adventures',
                  description:
                    'Authentic travel experiences and food discoveries from around the world',
                  author: {
                    '@type': 'Person',
                    name: siteConfig.author.name,
                  },
                },
              ],
              about: [
                {
                  '@type': 'Thing',
                  name: 'Travel',
                },
                {
                  '@type': 'Thing',
                  name: 'Food',
                },
                {
                  '@type': 'Thing',
                  name: 'Culture',
                },
              ],
              keywords:
                'travel blog, food blog, restaurant reviews, travel tips, local cuisine, authentic food, travel photography',
              inLanguage: 'en-US',
            }),
          }}
        />
      </head>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
