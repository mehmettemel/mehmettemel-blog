'use client'

import { useState, useId } from 'react'
import { Pagination } from '../Pagination'
import { quoteCategories } from '../../data/kesifler'
import { CategorySidebar } from './CategorySidebar'
import { UnifiedCard } from './UnifiedCard'

const ITEMS_PER_PAGE = 12

export function QuotesList({ quotes }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const listId = useId()

  if (!quotes || quotes.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl">💭</div>
        <p className="text-base text-muted-foreground">
          Henüz alıntı eklenmedi. Yakında ilham verici notlar eklenecek!
        </p>
      </div>
    )
  }

  // Filter quotes by category
  const filteredQuotes =
    selectedCategory === 'all'
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory)

  const totalPages = Math.ceil(filteredQuotes.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentQuotes = filteredQuotes.slice(startIndex, endIndex)

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
    if (categoryId === 'all') return quotes.length
    return quotes.filter((q) => q.category === categoryId).length
  }

  // Prepare categories with counts
  const categoriesWithCounts = quoteCategories.map((cat) => ({
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
            {filteredQuotes.length}
          </span>{' '}
          not/alıntı
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-muted-foreground">
            Sayfa {currentPage} / {totalPages}
          </p>
        )}
      </div>

      {/* Quotes List */}
      {filteredQuotes.length > 0 ? (
        <>
          <div
            key={`${listId}-${selectedCategory}-${currentPage}`}
            className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3"
          >
            {currentQuotes.map((quote, index) => {
              // Check if text has quotes already
              const hasQuotes =
                quote.text.startsWith('"') || quote.text.includes('\n')
              const displayText = hasQuotes ? quote.text : `"${quote.text}"`

              return (
                <UnifiedCard
                  key={quote.id}
                  description={displayText}
                  author={quote.author}
                  source={quote.source}
                  url={quote.url}
                  isExternal={false}
                  index={index}
                />
              )
            })}
          </div>

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
            Bu kategoride henüz not/alıntı yok.
          </p>
        </div>
      )}
    </div>
  )
}
