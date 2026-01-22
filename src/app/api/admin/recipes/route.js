import { NextResponse } from 'next/server'
import { validateSession } from '@/lib/session'
import { getRecipes, createRecipe } from '@/lib/db'

/**
 * GET /api/admin/recipes
 * List recipes with search filtering
 */
export async function GET(request) {
  // Validate session
  const session = await validateSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // Get all recipes from database
    let recipes = await getRecipes()

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      recipes = recipes.filter(
        (recipe) =>
          (recipe.name && recipe.name.toLowerCase().includes(searchLower)) ||
          (recipe.ingredients &&
            recipe.ingredients.toLowerCase().includes(searchLower)) ||
          (recipe.instructions &&
            recipe.instructions.toLowerCase().includes(searchLower))
      )
    }

    return NextResponse.json({
      recipes,
      total: recipes.length,
    })
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/recipes
 * Create a new recipe
 */
export async function POST(request) {
  // Validate session
  const session = await validateSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!data.ingredients) {
      return NextResponse.json(
        { error: 'Ingredients are required' },
        { status: 400 }
      )
    }

    if (!data.instructions) {
      return NextResponse.json(
        { error: 'Instructions are required' },
        { status: 400 }
      )
    }

    // Create recipe
    const recipe = await createRecipe(data)

    return NextResponse.json({ recipe }, { status: 201 })
  } catch (error) {
    console.error('Error creating recipe:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create recipe' },
      { status: 500 }
    )
  }
}
