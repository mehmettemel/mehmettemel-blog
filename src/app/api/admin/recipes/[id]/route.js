import { NextResponse } from 'next/server'
import { validateSession } from '@/lib/session'
import { updateRecipe, deleteRecipe } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * PUT /api/admin/recipes/[id]
 * Update a recipe by ID
 */
export async function PUT(request, { params }) {
  // Validate session
  const session = await validateSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 })
    }

    const data = await request.json()

    // Update recipe
    const recipe = await updateRecipe(id, data)

    // Revalidate recipes page
    revalidatePath('/listeler/tarif')

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Error updating recipe:', error)
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update recipe' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/recipes/[id]
 * Delete a recipe by ID
 */
export async function DELETE(request, { params }) {
  // Validate session
  const session = await validateSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 })
    }

    // Delete recipe
    const recipe = await deleteRecipe(id)

    // Revalidate recipes page
    revalidatePath('/listeler/tarif')

    return NextResponse.json({ success: true, recipe })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete recipe' },
      { status: 500 }
    )
  }
}
