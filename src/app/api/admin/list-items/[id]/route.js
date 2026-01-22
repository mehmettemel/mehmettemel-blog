import { NextResponse } from 'next/server'
import { validateSession } from '@/lib/session'
import { updateListItem, deleteListItem } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * PUT /api/admin/list-items/[id]
 * Update a list item by ID
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
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
    }

    const data = await request.json()

    // Update item
    const item = await updateListItem(id, data)

    // Revalidate relevant pages
    revalidatePath('/listeler')
    revalidatePath('/listeler/kitap')
    revalidatePath('/listeler/film')

    return NextResponse.json({ item })
  } catch (error) {
    console.error('Error updating list item:', error)
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: 'List item not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update list item' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/list-items/[id]
 * Delete a list item by ID
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
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
    }

    // Delete item
    const item = await deleteListItem(id)

    // Revalidate relevant pages
    revalidatePath('/listeler')
    revalidatePath('/listeler/kitap')
    revalidatePath('/listeler/film')

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('Error deleting list item:', error)
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: 'List item not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete list item' },
      { status: 500 }
    )
  }
}
