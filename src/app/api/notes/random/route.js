import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined')
}

const sql = neon(process.env.DATABASE_URL)

/**
 * GET /api/notes/random
 * Get a random note from quote, video, or book types
 * @returns {Promise<Object>} Random note
 */
export async function GET() {
  try {
    // Get a random note from quote, video, or book types
    const result = await sql`
      SELECT * FROM notes
      WHERE note_type IN ('quote', 'video', 'book')
      ORDER BY RANDOM()
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'No notes found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Database error in random note:', error)
    return NextResponse.json(
      { error: 'Failed to fetch random note' },
      { status: 500 }
    )
  }
}
