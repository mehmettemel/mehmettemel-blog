'use client'

import { useState } from 'react'
import { RecipeCard } from './RecipeCard'
import { RecipeModal } from './RecipeModal'

/**
 * RecipeList Component
 * Displays a simple grid of recipe cards with modal view
 */
export function RecipeList({ recipes: initialRecipes = [] }) {
  const [recipes] = useState(initialRecipes)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
        <div className="mb-4 rounded-full bg-muted/50 p-6 dark:bg-muted/30">
          <span className="text-4xl">🍳</span>
        </div>
        <p className="mb-2 text-base font-medium text-foreground sm:text-lg dark:text-foreground">
          Henüz hiçbir tarif eklenmemiş
        </p>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base dark:text-muted-foreground/80">
          Telegram botundan "/tarif" komutu ile tarif ekleyebilirsiniz
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 sm:space-y-8">
        {/* Stats */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary transition-colors dark:bg-primary/20">
            📊 Toplam: {recipes.length} tarif
          </span>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={setSelectedRecipe}
            />
          ))}
        </div>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  )
}
