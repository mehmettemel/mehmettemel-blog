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
        ORDER BY created_at ASC
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
        ORDER BY created_at ASC
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

/**
 * Get recent notes across all types for homepage display
 * For books and videos, only one note per source is shown
 * @param {number} limit - Number of notes to fetch (default: 10)
 * @returns {Promise<Array>} Recent notes
 */
export async function getRecentNotes(limit = 10) {
  try {
    const notes = await sql`
      WITH ranked_notes AS (
        SELECT
          id,
          note_type,
          category,
          title,
          text,
          author,
          source,
          url,
          created_at,
          ROW_NUMBER() OVER (
            PARTITION BY
              CASE
                WHEN note_type IN ('book', 'video') THEN source
                ELSE id::text
              END
            ORDER BY created_at DESC
          ) as rn
        FROM notes
      )
      SELECT id, note_type, category, title, text, author, source, url, created_at
      FROM ranked_notes
      WHERE rn = 1
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return notes
  } catch (error) {
    console.error('Database error in getRecentNotes:', error)
    throw new Error(`Failed to get recent notes: ${error.message}`)
  }
}

/**
 * Get cache items with optional filtering
 * @param {string} type - Cache type: 'kitap', 'film', or 'urun'
 * @param {string} [status='all'] - Filter by status: 'all', 'completed', 'pending', 'liked'
 * @returns {Promise<Array>} Cache items
 */
export async function getCacheItems(type, status = 'all') {
  try {
    let items

    if (status === 'completed') {
      items = await sql`
        SELECT * FROM cache_items
        WHERE cache_type = ${type} AND is_completed = true
        ORDER BY created_at DESC
      `
    } else if (status === 'pending') {
      items = await sql`
        SELECT * FROM cache_items
        WHERE cache_type = ${type} AND is_completed = false
        ORDER BY created_at DESC
      `
    } else if (status === 'liked') {
      items = await sql`
        SELECT * FROM cache_items
        WHERE cache_type = ${type} AND is_liked = true
        ORDER BY created_at DESC
      `
    } else {
      // 'all' - show pending first, then completed
      items = await sql`
        SELECT * FROM cache_items
        WHERE cache_type = ${type}
        ORDER BY is_completed ASC, created_at DESC
      `
    }

    return items
  } catch (error) {
    console.error('Database error in getCacheItems:', error)
    throw new Error(`Failed to get cache items: ${error.message}`)
  }
}

/**
 * Create a new cache item
 * @param {Object} data - Cache item data
 * @param {string} data.name - Item name
 * @param {string} data.cache_type - Type: 'kitap', 'film', or 'urun'
 * @returns {Promise<Object>} Created cache item
 */
export async function createCacheItem(data) {
  try {
    const result = await sql`
      INSERT INTO cache_items (name, cache_type)
      VALUES (${data.name}, ${data.cache_type})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error('Database error in createCacheItem:', error)
    throw new Error(`Failed to create cache item: ${error.message}`)
  }
}

/**
 * Toggle cache item checkbox (completed or liked)
 * @param {number} id - Cache item ID
 * @param {string} field - Field to toggle: 'is_completed' or 'is_liked'
 * @returns {Promise<Object>} Updated cache item
 */
export async function toggleCacheCheckbox(id, field) {
  try {
    // Validate field
    if (field !== 'is_completed' && field !== 'is_liked') {
      throw new Error('Invalid field. Must be is_completed or is_liked')
    }

    // Get current item state
    const current = await sql`
      SELECT * FROM cache_items WHERE id = ${id}
    `

    if (current.length === 0) {
      throw new Error('Cache item not found')
    }

    const item = current[0]
    const newValue = !item[field]

    // Special handling for toggling completed to false
    if (field === 'is_completed' && !newValue) {
      // If setting completed to false, also set liked to false
      const result = await sql`
        UPDATE cache_items
        SET is_completed = false, is_liked = false, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result[0]
    }

    // Special handling for toggling liked to true
    if (field === 'is_liked' && newValue && !item.is_completed) {
      throw new Error('Cannot like an item that is not completed')
    }

    // Normal toggle
    const result = await sql`
      UPDATE cache_items
      SET ${sql(field)} = ${newValue}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error('Database error in toggleCacheCheckbox:', error)
    throw new Error(`Failed to toggle checkbox: ${error.message}`)
  }
}

/**
 * Get cache statistics
 * @returns {Promise<Object>} Statistics by type
 */
export async function getCacheStats() {
  try {
    const stats = await sql`
      SELECT
        cache_type,
        COUNT(*) as total,
        SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN is_liked THEN 1 ELSE 0 END) as liked
      FROM cache_items
      GROUP BY cache_type
    `

    return stats.reduce((acc, row) => {
      acc[row.cache_type] = {
        total: parseInt(row.total),
        completed: parseInt(row.completed),
        liked: parseInt(row.liked),
      }
      return acc
    }, {})
  } catch (error) {
    console.error('Database error in getCacheStats:', error)
    throw new Error(`Failed to get cache stats: ${error.message}`)
  }
}
