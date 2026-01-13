'use client'

import { useState, useId } from 'react'
import { motion } from 'framer-motion'
import { Pagination } from '../Pagination'
import { linkCategories } from '../../data/kesifler'
import { CategorySidebar } from './CategorySidebar'
import { UnifiedCard } from './UnifiedCard'

const ITEMS_PER_PAGE = 12

const typeConfig = {
  teknik: {
    label: 'Teknik',
    icon: '🚀',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  icerik: {
    label: 'İçerik',
    icon: '📖',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  diger: {
    label: 'Diğer',
    icon: '🌍',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
}

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

export function LinksList({ links }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const listId = useId()

  if (!links || links.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl">📚</div>
        <p className="text-base text-muted-foreground">
          Henüz link eklenmedi. Yakında faydalı kaynaklar eklenecek!
        </p>
      </div>
    )
  }

  // Filter links by category (type)
  const filteredLinks =
    selectedCategory === 'all'
      ? links
      : links.filter((link) => link.type === selectedCategory)

  const totalPages = Math.ceil(filteredLinks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentLinks = filteredLinks.slice(startIndex, endIndex)

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
    if (categoryId === 'all') return links.length
    return links.filter((l) => l.type === categoryId).length
  }

  // Prepare categories with counts
  const categoriesWithCounts = linkCategories.map((cat) => ({
    ...cat,
    count: getCategoryCount(cat.id),
  }))

  return (
    <div>
      {/* Category Chips - Horizontal at top */}
      <CategorySidebar
        categories={categoriesWithCounts}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Stats */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground sm:text-sm">
          <span className="font-semibold text-foreground">
            {filteredLinks.length}
          </span>{' '}
          kaynak
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-muted-foreground">
            Sayfa {currentPage} / {totalPages}
          </p>
        )}
      </div>

      {/* Links List */}
      {filteredLinks.length > 0 ? (
        <>
          <motion.div
            key={`${listId}-${selectedCategory}-${currentPage}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3"
          >
            {currentLinks.map((gem, index) => {
              const config = typeConfig[gem.type] || typeConfig.teknik
              return (
                <UnifiedCard
                  key={gem.id}
                  title={gem.title}
                  description={gem.description}
                  icon={config.icon}
                  badge={config}
                  author={gem.author}
                  url={gem.url}
                  isExternal={true}
                  index={index}
                />
              )
            })}
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
          <p className="text-sm text-muted-foreground">
            Bu kategoride henüz içerik yok.
          </p>
        </div>
      )}
    </div>
  )
}
