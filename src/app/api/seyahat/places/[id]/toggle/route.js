import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { toggleTravelPlaceCheckbox } from '@/lib/db'

/**
 * PATCH /api/seyahat/places/[id]/toggle
 * Toggle travel place checkbox (visited or liked)
 */
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { field } = body

    // Validate field
    if (!field || (field !== 'is_visited' && field !== 'is_liked')) {
      return NextResponse.json(
        { error: 'Invalid field. Must be is_visited or is_liked' },
        { status: 400 }
      )
    }

    // Validate ID
    const placeId = parseInt(id)
    if (isNaN(placeId)) {
      return NextResponse.json(
        { error: 'Invalid place ID' },
        { status: 400 }
      )
    }

    // Toggle checkbox
    const updatedPlace = await toggleTravelPlaceCheckbox(placeId, field)

    // Revalidate travel page
    revalidatePath('/listeler/seyahat')

    return NextResponse.json({
      success: true,
      place: updatedPlace,
    })
  } catch (error) {
    console.error('Toggle travel place checkbox error:', error)

    // Handle specific errors
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Travel place not found' },
        { status: 404 }
      )
    }

    if (error.message.includes('not been visited')) {
      return NextResponse.json(
        { error: 'Cannot like a place that has not been visited' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to toggle checkbox' },
      { status: 500 }
    )
  }
}
