'use client'

import { useState } from 'react'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function RecipesForm({ recipe, onSuccess }) {
  const isEdit = !!recipe
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: recipe?.name || '',
    ingredients: recipe?.ingredients || '',
    instructions: recipe?.instructions || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        name: formData.name,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
      }

      const url = isEdit
        ? `/api/admin/recipes/${recipe.id}`
        : '/api/admin/recipes'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save recipe')
      }

      onSuccess()
    } catch (err) {
      console.error('Error saving recipe:', err)
      setError(err.message || 'Failed to save recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {isEdit ? 'Edit Recipe' : 'Create Recipe'}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? 'Update the recipe details below.'
            : 'Fill in the details to create a new recipe.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Recipe Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            disabled={loading}
            placeholder="e.g., Tavuk Sote"
          />
        </div>

        {/* Ingredients */}
        <div className="space-y-2">
          <Label htmlFor="ingredients">Ingredients *</Label>
          <Textarea
            id="ingredients"
            value={formData.ingredients}
            onChange={(e) =>
              setFormData({ ...formData, ingredients: e.target.value })
            }
            disabled={loading}
            placeholder="List all ingredients (one per line or comma-separated)"
            rows={6}
          />
          <p className="text-xs text-muted-foreground">
            Enter ingredients line by line or separated by commas
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions *</Label>
          <Textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
            disabled={loading}
            placeholder="Step-by-step cooking instructions"
            rows={8}
          />
          <p className="text-xs text-muted-foreground">
            Enter cooking instructions step by step
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button
            type="submit"
            disabled={
              loading ||
              !formData.name ||
              !formData.ingredients ||
              !formData.instructions
            }
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
