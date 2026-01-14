/**
 * Cache Categories Configuration
 * Defines the categories available in the cache system
 */

export const cacheCategories = [
  {
    id: 'kitap',
    name: 'Kitap',
    emoji: '📚',
    icon: '📖',
    description: 'Okumak istediğim veya okuduğum kitaplar',
  },
  {
    id: 'film',
    name: 'Film & Dizi',
    emoji: '🎬',
    icon: '📺',
    description: 'İzlemek istediğim veya izlediğim filmler ve diziler',
  },
  {
    id: 'urun',
    name: 'Ürünler',
    emoji: '🛍️',
    icon: '📦',
    description: 'Almak istediğim veya aldığım ürünler',
  },
]

/**
 * Get category config by ID
 * @param {string} id - Category ID
 * @returns {Object|null} Category config or null
 */
export function getCacheCategory(id) {
  return cacheCategories.find((cat) => cat.id === id) || null
}
