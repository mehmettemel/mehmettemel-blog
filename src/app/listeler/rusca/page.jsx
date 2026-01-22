'use client'

import { useState, useMemo } from 'react'
import { Container } from '@/components/Container'
import { RussianCard } from '@/components/russian/RussianCard'
import {
  russianCategories,
  getRussianByCategory,
} from '@/data/russian'

export default function RussianPage() {
  const [selectedCategory, setSelectedCategory] = useState('cumle')

  // Get data based on selected category
  const currentData = useMemo(() => {
    return getRussianByCategory(selectedCategory)
  }, [selectedCategory])

  return (
    <Container>
      <div className="mx-auto max-w-7xl py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <span className="text-4xl" role="img" aria-label="Russian">
              🇷🇺
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Rusça
            </h1>
          </div>
          <p className="text-base text-muted-foreground">
            Günlük hayatta kullanılabilecek Rusça kelime ve cümleler
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            💡 Kartların sağ üstündeki ℹ️ ikonuna hover et
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {russianCategories.map((cat) => {
            const count = getRussianByCategory(cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {cat.emoji} {cat.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentData.map((phrase) => (
            <RussianCard key={phrase.id} phrase={phrase} />
          ))}
        </div>
      </div>
    </Container>
  )
}
