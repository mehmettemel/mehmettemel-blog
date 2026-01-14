import { NextResponse } from 'next/server'
import { toggleCacheCheckbox } from '@/lib/db'

/**
 * PATCH /api/cache/[id]/toggle
 * Toggle cache item checkbox (completed or liked)
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
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 },
      )
    }

    // Toggle checkbox
    const updatedItem = await toggleCacheCheckbox(itemId, field)

    return NextResponse.json({
      success: true,
      item: updatedItem,
    })
  } catch (error) {
    console.error('Toggle cache checkbox error:', error)

    // Handle specific errors
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Cache item not found' },
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
