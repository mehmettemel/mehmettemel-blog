'use client'

/**
 * RecipeCard Component
 * Displays a simple recipe card with just the name
 */
export function RecipeCard({ recipe, onClick }) {
  return (
    <div
      onClick={() => onClick(recipe)}
      className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:bg-secondary/20 hover:shadow-lg sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary sm:text-lg">
          {recipe.name}
        </h3>
        <span className="text-2xl" role="img" aria-label="recipe">
          🍳
        </span>
      </div>
    </div>
  )
}
