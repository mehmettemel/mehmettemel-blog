import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { toggleListCheckbox } from '@/lib/db'

/**
 * PATCH /api/listeler/[id]/toggle
 * Toggle list item checkbox (completed or liked)
 */
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { field } = body

    // Validate field
    if (!field || (field !== 'is_completed' && field !== 'is_liked')) {
      return NextResponse.json(
        { error: 'Invalid field. Must be is_completed or is_liked' },
        { status: 400 },
      )
    }

    // Validate ID
    const itemId = parseInt(id)
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
    }

    // Toggle checkbox
    const updatedItem = await toggleListCheckbox(itemId, field)

    // Revalidate all list pages to reflect the update
    revalidatePath('/listeler/kitap')
    revalidatePath('/listeler/film')
    revalidatePath('/listeler/urun')
    revalidatePath('/listeler')

    return NextResponse.json({
      success: true,
      item: updatedItem,
    })
  } catch (error) {
    console.error('Toggle list checkbox error:', error)

    // Handle specific errors
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'List item not found' },
        { status: 404 },
      )
    }

    if (error.message.includes('not completed')) {
      return NextResponse.json(
        { error: 'Cannot like an item that is not completed' },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to toggle checkbox' },
      { status: 500 },
    )
  }
}
