import { NextResponse } from 'next/server'
import { validateSession } from '@/lib/session'
import { getListItems, createListItem } from '@/lib/db'

/**
 * GET /api/admin/list-items
 * List items with filtering and pagination
 */
export async function GET(request) {
  // Validate session
  const session = await validateSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const listType = searchParams.get('list_type') || 'kitap'
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    // Get items from database
    let items = await getListItems(listType, status)

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      items = items.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(searchLower)) ||
          (item.author && item.author.toLowerCase().includes(searchLower)) ||
          (item.description && item.description.toLowerCase().includes(searchLower))
      )
    }

    return NextResponse.json({
      items,
      total: items.length,
    })
  } catch (error) {
    console.error('Error fetching list items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch list items' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/list-items
 * Create a new list item
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

    if (!data.list_type) {
      return NextResponse.json({ error: 'List type is required' }, { status: 400 })
    }

    // Create list item
    const item = await createListItem(data)

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('Error creating list item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create list item' },
      { status: 500 }
    )
  }
}
