import { NextResponse } from 'next/server'
import { validateSession } from '@/lib/session'
import { getNotes, createNote } from '@/lib/db'

/**
 * GET /api/admin/notes
 * List notes with filtering and pagination
 */
export async function GET(request) {
  // Validate session
  const session = await validateSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'quote'
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get notes from database
    const result = await getNotes({ type, category, page, limit })

    // Apply search filter if provided (simple text search)
    let notes = result.notes
    if (search) {
      const searchLower = search.toLowerCase()
      notes = notes.filter(
        (note) =>
          (note.title && note.title.toLowerCase().includes(searchLower)) ||
          (note.text && note.text.toLowerCase().includes(searchLower)) ||
          (note.author && note.author.toLowerCase().includes(searchLower)) ||
          (note.source && note.source.toLowerCase().includes(searchLower))
      )
    }

    return NextResponse.json({
      notes,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/notes
 * Create a new note
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
    if (!data.type) {
      return NextResponse.json({ error: 'Note type is required' }, { status: 400 })
    }

    if (!data.text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Links require title and URL
    if (data.type === 'link') {
      if (!data.title) {
        return NextResponse.json({ error: 'Title is required for links' }, { status: 400 })
      }
      if (!data.url) {
        return NextResponse.json({ error: 'URL is required for links' }, { status: 400 })
      }
    }

    // Create note
    const note = await createNote(data)

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create note' },
      { status: 500 }
    )
  }
}
