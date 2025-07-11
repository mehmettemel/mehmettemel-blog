export const siteConfig = {
  name: 'Mehmet Temel',
  title: 'Mehmet Temel - Travel & Food Blogger | Front End Engineer',
  description:
    'Travel and food enthusiast sharing authentic experiences from around the world. Front End Engineer specializing in React, Vue.js, and e-commerce. Discover hidden gems, local cuisines, and travel tips from a digital nomad based in Adana, Turkey.',
  url: 'https://mehmettemel.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://x.com/temelbusiness',
    github: 'https://github.com/mehmettemelim',
    linkedin: 'https://linkedin.com/in/mehmettemel',
    instagram: 'https://instagram.com/mehmettemel',
  },
  keywords: [
    // Personal branding
    'Mehmet Temel',
    'Travel Blogger',
    'Food Blogger',
    'Digital Nomad',
    'Travel & Food Writer',

    // Travel keywords
    'Travel Guide',
    'Travel Tips',
    'Travel Experiences',
    'Solo Travel',
    'Budget Travel',
    'Travel Photography',
    'Travel Stories',
    'Backpacking',
    'City Guides',
    'Travel Recommendations',

    // Food keywords
    'Food Blog',
    'Food Reviews',
    'Local Cuisine',
    'Street Food',
    'Restaurant Reviews',
    'Food Photography',
    'Culinary Adventures',
    'Food Guide',
    'Authentic Food',
    'Local Food Spots',
    'Food Travel',
    'Foodie Travel',

    // Location-based keywords
    'Adana Food',
    'Adana Restaurants',
    'Turkey Travel',
    'Turkey Food',
    'Turkish Cuisine',
    'Middle East Travel',
    'Mediterranean Food',
    'Adana Travel Guide',
    'Turkish Food Blog',
    'Adana Food Guide',
    'Turkey Restaurant Reviews',
    'Adana Local Food',

    // International locations
    'Asia Travel',
    'Europe Travel',
    'Food in Asia',
    'Food in Europe',
    'International Food',
    'World Cuisine',
    'Travel Food Guide',

    // Tech (secondary)
    'Front End Engineer',
    'React Developer',
    'Vue.js Developer',
    'E-commerce Developer',
    'Remote Work',
    'Web Development',
    'Digital Nomad Life',
  ],
  author: {
    name: 'Mehmet Temel',
    jobTitle: 'Travel & Food Blogger | Front End Engineer',
    location: 'Adana, Turkey',
    email: 'mehmet@mehmettemel.com',
    twitter: '@temelbusiness',
    bio: 'Passionate traveler and food enthusiast sharing authentic experiences from around the world. Digital nomad and frontend engineer exploring cultures through cuisine.',
  },
  // Location info for local SEO
  business: {
    type: 'ProfessionalService',
    name: 'Mehmet Temel - Travel & Food Blog',
    description:
      'Travel and food blog featuring authentic experiences, restaurant reviews, and travel guides',
    address: {
      streetAddress: 'Adana',
      addressLocality: 'Adana',
      addressRegion: 'Adana',
      postalCode: '01000',
      addressCountry: 'Turkey',
    },
    geo: {
      latitude: '37.0000',
      longitude: '35.3213',
    },
    areaServed: [
      'Turkey',
      'Europe',
      'Asia',
      'Middle East',
      'Mediterranean',
      'International',
    ],
    services: [
      'Travel Writing',
      'Food Reviews',
      'Restaurant Recommendations',
      'Travel Photography',
      'City Guides',
      'Cultural Experiences',
    ],
  },
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = [siteConfig.author.name],
  section,
  tags = [],
  location,
  cuisine,
  rating,
  priceRange,
}) {
  // Add location-based keywords if location is provided
  const locationKeywords = location
    ? [
        `${location} food`,
        `${location} restaurants`,
        `${location} travel`,
        `${location} food guide`,
        `${location} dining`,
        `best food in ${location}`,
        `where to eat in ${location}`,
        `${location} food blog`,
      ]
    : []

  // Add cuisine-specific keywords
  const cuisineKeywords = cuisine
    ? [
        `${cuisine} food`,
        `${cuisine} cuisine`,
        `${cuisine} restaurant`,
        `authentic ${cuisine}`,
        `best ${cuisine} food`,
      ]
    : []

  const metadata = {
    title: title ? `${title} - ${siteConfig.name}` : siteConfig.title,
    description: description || siteConfig.description,
    keywords: [
      ...siteConfig.keywords,
      ...keywords,
      ...locationKeywords,
      ...cuisineKeywords,
    ],
    authors: authors.map((author) => ({ name: author })),
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url ? `${siteConfig.url}${url}` : siteConfig.url,
    },
    openGraph: {
      type,
      locale: 'en_US',
      url: url ? `${siteConfig.url}${url}` : siteConfig.url,
      siteName: siteConfig.name,
      title: title || siteConfig.title,
      description: description || siteConfig.description,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors.length > 0 && { authors }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.author.twitter,
      creator: siteConfig.author.twitter,
      title: title || siteConfig.title,
      description: description || siteConfig.description,
      images: [image || siteConfig.ogImage],
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
  }

  return metadata
}

export function generateStructuredData({ type, data }) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  switch (type) {
    case 'Person':
      return {
        ...baseData,
        name: data.name,
        jobTitle: data.jobTitle,
        url: data.url,
        sameAs: data.sameAs || [],
        knowsAbout: data.knowsAbout || [],
        address: data.address,
        description: data.description,
        email: data.email,
        alumniOf: data.alumniOf,
        nationality: data.nationality || 'Turkish',
        homeLocation: data.homeLocation,
        workLocation: data.workLocation,
      }

    case 'Article':
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Person',
          name: data.author,
          url: siteConfig.url,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: siteConfig.url,
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        image: data.image,
        url: data.url,
        mainEntityOfPage: data.url,
        ...(data.keywords && { keywords: data.keywords.join(', ') }),
        ...(data.section && { articleSection: data.section }),
        ...(data.location && {
          about: {
            '@type': 'Place',
            name: data.location,
          },
        }),
        ...(data.cuisine && {
          about: {
            '@type': 'Thing',
            name: data.cuisine,
          },
        }),
      }

    case 'Review':
      return {
        ...baseData,
        itemReviewed: {
          '@type': data.itemType || 'Restaurant',
          name: data.itemName,
          address: data.address,
          telephone: data.telephone,
          url: data.itemUrl,
          image: data.itemImage,
          priceRange: data.priceRange,
          servesCuisine: data.cuisine,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: data.rating,
          bestRating: data.bestRating || 5,
        },
        author: {
          '@type': 'Person',
          name: data.author,
        },
        datePublished: data.datePublished,
        reviewBody: data.reviewBody,
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
        },
      }

    case 'Restaurant':
      return {
        ...baseData,
        name: data.name,
        image: data.image,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.address?.streetAddress,
          addressLocality: data.address?.addressLocality,
          addressRegion: data.address?.addressRegion,
          postalCode: data.address?.postalCode,
          addressCountry: data.address?.addressCountry,
        },
        telephone: data.telephone,
        url: data.url,
        openingHours: data.openingHours,
        priceRange: data.priceRange,
        servesCuisine: data.cuisine,
        aggregateRating: data.aggregateRating && {
          '@type': 'AggregateRating',
          ratingValue: data.aggregateRating.ratingValue,
          reviewCount: data.aggregateRating.reviewCount,
        },
        menu: data.menu,
        acceptsReservations: data.acceptsReservations,
      }

    case 'TravelAction':
      return {
        ...baseData,
        agent: {
          '@type': 'Person',
          name: data.agent,
        },
        fromLocation: {
          '@type': 'Place',
          name: data.fromLocation,
        },
        toLocation: {
          '@type': 'Place',
          name: data.toLocation,
        },
        startTime: data.startTime,
        endTime: data.endTime,
      }

    case 'TouristDestination':
      return {
        ...baseData,
        name: data.name,
        description: data.description,
        image: data.image,
        address: data.address,
        geo: data.geo && {
          '@type': 'GeoCoordinates',
          latitude: data.geo.latitude,
          longitude: data.geo.longitude,
        },
        touristType: data.touristType,
        includesAttraction: data.attractions,
      }

    case 'WebSite':
      return {
        ...baseData,
        name: data.name,
        url: data.url,
        description: data.description,
        publisher: {
          '@type': 'Person',
          name: data.publisher,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${data.url}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }

    case 'BreadcrumbList':
      return {
        ...baseData,
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }

    case 'LocalBusiness':
      return {
        ...baseData,
        name: data.name,
        description: data.description,
        url: data.url,
        address: {
          '@type': 'PostalAddress',
          addressLocality: data.address?.addressLocality,
          addressRegion: data.address?.addressRegion,
          addressCountry: data.address?.addressCountry,
        },
        geo: data.geo && {
          '@type': 'GeoCoordinates',
          latitude: data.geo.latitude,
          longitude: data.geo.longitude,
        },
        areaServed: data.areaServed,
        serviceType: data.serviceType,
        knowsAbout: data.knowsAbout,
      }

    default:
      return baseData
  }
}

export function generateBreadcrumbs(items) {
  return generateStructuredData({
    type: 'BreadcrumbList',
    data: { items },
  })
}

// Helper function to generate location-specific SEO
export function generateLocationSEO(location, type = 'city') {
  const locationKeywords = [
    `${location} food`,
    `${location} restaurants`,
    `${location} travel guide`,
    `${location} food blog`,
    `${location} dining guide`,
    `best restaurants in ${location}`,
    `where to eat in ${location}`,
    `${location} food scene`,
    `${location} local food`,
    `${location} street food`,
    `${location} food recommendations`,
    `${location} travel tips`,
    `${location} food culture`,
    `${location} cuisine guide`,
    `${location} food spots`,
  ]

  return {
    title: `${location} Food Guide & Travel Tips - Mehmet Temel`,
    description: `Discover the best food spots, restaurants, and travel tips for ${location}. Local insights, authentic cuisine recommendations, and hidden gems from a passionate food blogger.`,
    keywords: locationKeywords,
  }
}

// Helper function for restaurant/food review SEO
export function generateRestaurantSEO(restaurant, location, cuisine) {
  const keywords = [
    `${restaurant} review`,
    `${restaurant} ${location}`,
    `${cuisine} restaurant ${location}`,
    `best ${cuisine} food ${location}`,
    `${restaurant} food review`,
    `${location} restaurant review`,
    `${cuisine} food ${location}`,
    `authentic ${cuisine} ${location}`,
  ]

  return {
    title: `${restaurant} Review - ${cuisine} Food in ${location}`,
    description: `Honest review of ${restaurant} in ${location}. Authentic ${cuisine} cuisine, prices, atmosphere, and recommendations from a food enthusiast.`,
    keywords,
  }
}
