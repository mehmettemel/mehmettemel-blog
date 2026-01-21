'use client'

import { useState, useMemo } from 'react'
import { Container } from '@/components/Container'
import RandomButton from '@/components/RandomButton'
import {
  russianPhrases,
  russianCategories,
  getRussianByCategory,
} from '@/data/russian'

// Helper to render example with highlighted verb
function renderExample(example) {
  if (!example) return null

  // Split by * and highlight the parts between *
  const parts = example.split('*')
  return parts.map((part, index) => {
    // Odd indices are the highlighted parts (between *)
    if (index % 2 === 1) {
      return (
        <span key={index} className="font-bold text-primary">
          {part}
        </span>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export default function RussianPage() {
  const [selectedCategory, setSelectedCategory] = useState('cumle')
  const [currentPhrase, setCurrentPhrase] = useState(null)

  // Get data based on selected category
  const currentData = useMemo(() => {
    return getRussianByCategory(selectedCategory)
  }, [selectedCategory])

  // Get current category info
  const categoryInfo = useMemo(() => {
    return russianCategories.find((c) => c.id === selectedCategory)
  }, [selectedCategory])

  // Get random phrase from current category
  const getRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * currentData.length)
    setCurrentPhrase(currentData[randomIndex])
  }

  // Reset current phrase when category changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPhrase(null)
  }

  return (
    <Container>
      <div className="mx-auto max-w-2xl py-8 sm:py-12">
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
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {russianCategories.map((cat) => {
            const count = getRussianByCategory(cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
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

        {/* Random Button */}
        <div className="mb-8 flex justify-center">
          <RandomButton onClick={getRandomPhrase} text="🎲" />
        </div>

        {/* Current Phrase Card */}
        {currentPhrase ? (
          <div className="animate-[fade-in-up_0.3s_ease-out_forwards] rounded-2xl border border-border bg-card p-8 shadow-lg">
            {/* Color swatch for colors */}
            {currentPhrase.type === 'renk' && currentPhrase.color && (
              <div
                className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-border shadow-lg"
                style={{ backgroundColor: currentPhrase.color }}
              />
            )}

            {/* Russian Text */}
            <p className="mb-3 text-center text-3xl font-bold text-foreground sm:text-4xl">
              {currentPhrase.russian}
            </p>

            {/* Pronunciation */}
            <p className="mb-6 text-center font-mono text-lg text-primary">
              [{currentPhrase.pronunciation}]
            </p>

            {/* Divider */}
            <div className="mx-auto mb-6 h-px w-16 bg-border" />

            {/* Translations */}
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-lg">
                <span>🇬🇧</span>
                <span className="text-foreground">{currentPhrase.english}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-lg">
                <span>🇹🇷</span>
                <span className="text-foreground">{currentPhrase.turkish}</span>
              </div>
            </div>

            {/* Example sentence for verbs */}
            {currentPhrase.example && (
              <div className="mt-6 rounded-lg bg-secondary/30 p-4">
                <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Örnek Cümle
                </p>
                <p className="text-lg text-foreground">
                  {renderExample(currentPhrase.example)}
                </p>
                {currentPhrase.examplePronunciation && (
                  <p className="mt-1 font-mono text-sm text-primary">
                    [{currentPhrase.examplePronunciation}]
                  </p>
                )}
                {currentPhrase.exampleTranslation && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    → {currentPhrase.exampleTranslation}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-12 text-center">
            <div className="mb-4 text-5xl">{categoryInfo?.emoji || '👆'}</div>
            <p className="text-base text-muted-foreground">
              🎲 Butona tıklayarak rastgele bir cümle öğren
            </p>
          </div>
        )}
      </div>
    </Container>
  )
}
