import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined')
}

const sql = neon(process.env.DATABASE_URL)

/**
 * Create a new note in the database
 * @param {Object} data - Note data
 * @param {string} data.type - Note type: 'link', 'quote', 'video', 'book'
 * @param {string} data.category - Category based on note type
 * @param {string} [data.title] - Title (required for links)
 * @param {string} data.text - Main content
 * @param {string} [data.author] - Author name
 * @param {string} [data.source] - Source (book name, video title, etc.)
 * @param {string} [data.url] - URL
 * @param {string[]} [data.tags] - Tags array
 * @param {boolean} [data.is_migrated] - Migration flag
 * @returns {Promise<Object>} Created note
 */
export async function createNote(data) {
  try {
    const result = await sql`
      INSERT INTO notes (note_type, category, title, text, author, source, url, tags, is_migrated)
      VALUES (
        ${data.type},
        ${data.category},
        ${data.title || null},
        ${data.text},
        ${data.author || null},
        ${data.source || null},
        ${data.url || null},
        ${data.tags || []},
        ${data.is_migrated || false}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error('Database error in createNote:', error)
    throw new Error(`Failed to create note: ${error.message}`)
  }
}

/**
 * Get notes with filtering and pagination
 * @param {Object} options - Query options
 * @param {string} options.type - Note type to filter
 * @param {string} [options.category] - Category to filter (optional, 'all' for no filter)
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.limit=12] - Items per page
 * @returns {Promise<Object>} Notes data with pagination info
 */
export async function getNotes({ type, category, page = 1, limit = 12 }) {
  try {
    const offset = (page - 1) * limit

    // Get notes with proper SQL template
    let notes
    let countResult

    if (category && category !== 'all') {
      // Filter by both type and category
      notes = await sql`
        SELECT * FROM notes
        WHERE note_type = ${type} AND category = ${category}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      countResult = await sql`
        SELECT COUNT(*) as count FROM notes
        WHERE note_type = ${type} AND category = ${category}
      `
    } else {
      // Filter by type only
      notes = await sql`
        SELECT * FROM notes
        WHERE note_type = ${type}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      countResult = await sql`
        SELECT COUNT(*) as count FROM notes
        WHERE note_type = ${type}
      `
    }

    const total = parseInt(countResult[0].count)

    return {
      notes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error('Database error in getNotes:', error)
    throw new Error(`Failed to get notes: ${error.message}`)
  }
}

/**
 * Get a single note by ID
 * @param {number} id - Note ID
 * @returns {Promise<Object|null>} Note data or null
 */
export async function getNoteById(id) {
  try {
    const result = await sql`
      SELECT * FROM notes
      WHERE id = ${id}
    `
    return result[0] || null
  } catch (error) {
    console.error('Database error in getNoteById:', error)
    throw new Error(`Failed to get note: ${error.message}`)
  }
}

/**
 * Update GitHub sync information for a note
 * @param {number} noteId - Note ID
 * @param {string} path - GitHub file path
 * @param {string} sha - Commit SHA
 * @returns {Promise<void>}
 */
export async function updateNoteGithubPath(noteId, path, sha) {
  try {
    await sql`
      UPDATE notes
      SET
        github_path = ${path},
        github_commit_sha = ${sha},
        updated_at = NOW()
      WHERE id = ${noteId}
    `
  } catch (error) {
    console.error('Database error in updateNoteGithubPath:', error)
    throw new Error(`Failed to update GitHub path: ${error.message}`)
  }
}

/**
 * Get statistics about notes
 * @returns {Promise<Object>} Statistics
 */
export async function getNotesStats() {
  try {
    const stats = await sql`
      SELECT
        note_type,
        COUNT(*) as count
      FROM notes
      GROUP BY note_type
    `

    const total = await sql`
      SELECT COUNT(*) as count FROM notes
    `

    return {
      total: parseInt(total[0].count),
      byType: stats.reduce((acc, row) => {
        acc[row.note_type] = parseInt(row.count)
        return acc
      }, {}),
    }
  } catch (error) {
    console.error('Database error in getNotesStats:', error)
    throw new Error(`Failed to get stats: ${error.message}`)
  }
}

/**
 * Get valid categories for a note type
 * @param {string} noteType - Note type
 * @returns {Promise<Array>} Categories
 */
export async function getValidCategories(noteType) {
  try {
    const categories = await sql`
      SELECT category_id, category_name, icon
      FROM valid_categories
      WHERE note_type = ${noteType}
      ORDER BY id
    `
    return categories
  } catch (error) {
    console.error('Database error in getValidCategories:', error)
    throw new Error(`Failed to get categories: ${error.message}`)
  }
}
