'use client'

import { useState, useId, useMemo } from 'react'
import { Pagination } from '../Pagination'
import { videoCategories } from '../../data/kesifler'
import { CategorySidebar } from './CategorySidebar'
import { SourceCard } from './SourceCard'

const ITEMS_PER_PAGE = 12

export function VideoNotesList({ notes }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const listId = useId()

  // Group notes by source
  const groupedBySource = useMemo(() => {
    if (!notes || notes.length === 0) return []

    const groups = {}
    notes.forEach((note) => {
      const key = note.source || 'Bilinmeyen Kaynak'
      if (!groups[key]) {
        groups[key] = {
          source: note.source,
          author: note.author,
          url: note.url,
          category: note.category,
          notes: [],
        }
      }
      groups[key].notes.push(note)
    })

    return Object.values(groups)
  }, [notes])

  if (!notes || notes.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl">🎬</div>
        <p className="text-base text-muted-foreground">
          Henüz video notu eklenmedi. Yakında video analizleri eklenecek!
        </p>
      </div>
    )
  }

  // Filter groups by category
  const filteredGroups =
    selectedCategory === 'all'
      ? groupedBySource
      : groupedBySource.filter((group) => group.category === selectedCategory)

  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentGroups = filteredGroups.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  // Get count for each category (count unique sources)
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return groupedBySource.length
    return groupedBySource.filter((g) => g.category === categoryId).length
  }

  // Prepare categories with counts
  const categoriesWithCounts = videoCategories.map((cat) => ({
    ...cat,
    count: getCategoryCount(cat.id),
  }))

  // Total notes count
  const totalNotesCount = filteredGroups.reduce(
    (acc, group) => acc + group.notes.length,
    0,
  )

  return (
    <div>
      {/* Category Chips */}
      <CategorySidebar
        categories={categoriesWithCounts}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Stats */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground sm:text-sm">
          <span className="font-semibold text-foreground">
            {filteredGroups.length}
          </span>{' '}
          kaynak,{' '}
          <span className="font-semibold text-foreground">
            {totalNotesCount}
          </span>{' '}
          not
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-muted-foreground">
            Sayfa {currentPage} / {totalPages}
          </p>
        )}
      </div>

      {/* Source Cards Grid */}
      {filteredGroups.length > 0 ? (
        <>
          <div
            key={`${listId}-${selectedCategory}-${currentPage}`}
            className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4"
          >
            {currentGroups.map((group, index) => (
              <SourceCard
                key={group.source || index}
                source={group.source}
                author={group.author}
                notes={group.notes}
                url={group.url}
                type="video"
                index={index}
              />
            ))}
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
            Bu kategoride henüz video notu yok.
          </p>
        </div>
      )}
    </div>
  )
}
