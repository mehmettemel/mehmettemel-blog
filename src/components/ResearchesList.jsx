'use client'

import { useState, useId } from 'react'
import { motion } from 'framer-motion'
import { Pagination } from './Pagination'
import { ResearchCategorySidebar } from './ResearchCategorySidebar'
import { RabbitHoleCard } from './RabbitHoleCard'

const ITEMS_PER_PAGE = 12

// Research categories with icons
const researchCategories = [
  { id: 'all', name: 'Tümü', icon: '📚' },
  { id: 'gidalar', name: 'Gıdalar', icon: '🍎' },
  { id: 'besinler', name: 'Besinler', icon: '💊' },
  { id: 'mekanizmalar', name: 'Mekanizmalar', icon: '🧬' },
]

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
}

export function ResearchesList({ posts }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const listId = useId()

  if (!posts || posts.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mb-3 text-4xl">📚</div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Henüz araştırma eklenmedi. Yakında yeni içerikler eklenecek!
        </p>
      </div>
    )
  }

  // Filter posts by category
  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((post) => post.category === selectedCategory)

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1) // Reset to first page when category changes
  }

  // Get count for each category
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return posts.length
    return posts.filter((p) => p.category === categoryId).length
  }

  // Prepare categories with counts
  const categoriesWithCounts = researchCategories.map((cat) => ({
    ...cat,
    count: getCategoryCount(cat.id),
  }))

  return (
    <div>
      {/* Category Chips - Horizontal at top */}
      <ResearchCategorySidebar
        categories={categoriesWithCounts}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Stats */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground sm:text-sm">
          <span className="font-semibold text-foreground">
            {filteredPosts.length}
          </span>{' '}
          araştırma
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-muted-foreground">
            Sayfa {currentPage} / {totalPages}
          </p>
        )}
      </div>

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        <>
          <motion.div
            key={`${listId}-${selectedCategory}-${currentPage}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2.5"
          >
            {currentPosts.map((post, index) => (
              <RabbitHoleCard key={post.slug} post={post} index={index} />
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-secondary/20 py-12 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Bu kategoride henüz araştırma yok.
          </p>
        </div>
      )}
    </div>
  )
}
