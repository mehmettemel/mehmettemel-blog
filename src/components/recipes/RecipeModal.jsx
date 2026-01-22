'use client'

import { useEffect } from 'react'

/**
 * RecipeModal Component
 * Displays full recipe details in a full-screen modal
 */
export function RecipeModal({ recipe, onClose }) {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!recipe) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-background"
      onClick={onClose}
    >
      {/* Header Bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="recipe">
              🍳
            </span>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              {recipe.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-all hover:bg-secondary/80 hover:scale-110"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="mx-auto max-w-4xl overflow-y-auto px-4 py-8"
        style={{ maxHeight: 'calc(100vh - 73px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ingredients */}
        <div className="mb-8">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            🥘 Malzemeler
          </h3>
          <div className="rounded-xl border border-border bg-card p-6">
            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground">
              {recipe.ingredients}
            </pre>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            👨‍🍳 Yapılışı
          </h3>
          <div className="rounded-xl border border-border bg-card p-6">
            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground">
              {recipe.instructions}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
