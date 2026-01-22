import { NextResponse } from 'next/server'
import { validateSession } from '@/lib/session'
import { updateNote, deleteNote, getNoteById } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * PUT /api/admin/notes/[id]
 * Update a note by ID
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
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 })
    }

    const data = await request.json()

    // Update note
    const note = await updateNote(id, data)

    // Revalidate relevant pages
    revalidatePath('/kesifler')
    revalidatePath('/kesifler/linkler')
    revalidatePath('/kesifler/alintilar')
    revalidatePath('/kesifler/videolar')
    revalidatePath('/kesifler/kitaplar')

    return NextResponse.json({ note })
  } catch (error) {
    console.error('Error updating note:', error)
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update note' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/notes/[id]
 * Delete a note by ID
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
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 })
    }

    // Get note to know its type for revalidation
    const existingNote = await getNoteById(id)

    // Delete note
    const note = await deleteNote(id)

    // Revalidate relevant pages based on note type
    revalidatePath('/kesifler')
    if (existingNote) {
      if (existingNote.note_type === 'link') {
        revalidatePath('/kesifler/linkler')
      } else if (existingNote.note_type === 'quote') {
        revalidatePath('/kesifler/alintilar')
      } else if (existingNote.note_type === 'video') {
        revalidatePath('/kesifler/videolar')
      } else if (existingNote.note_type === 'book') {
        revalidatePath('/kesifler/kitaplar')
      }
    }

    return NextResponse.json({ success: true, note })
  } catch (error) {
    console.error('Error deleting note:', error)
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete note' },
      { status: 500 }
    )
  }
}
