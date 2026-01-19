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
 * Get list items with optional filtering
 * @param {string} type - List type: 'kitap', 'film', or 'urun'
 * @param {string} [status='all'] - Filter by status: 'all', 'completed', 'pending', 'liked'
 * @returns {Promise<Array>} List items
 */
export async function getListItems(type, status = 'all') {
  try {
    let items

    if (status === 'completed') {
      items = await sql`
        SELECT * FROM list_items
        WHERE list_type = ${type} AND is_completed = true
        ORDER BY created_at DESC
      `
    } else if (status === 'pending') {
      items = await sql`
        SELECT * FROM list_items
        WHERE list_type = ${type} AND is_completed = false
        ORDER BY created_at DESC
      `
    } else if (status === 'liked') {
      items = await sql`
        SELECT * FROM list_items
        WHERE list_type = ${type} AND is_liked = true
        ORDER BY created_at DESC
      `
    } else {
      // 'all' - show pending first, then completed
      items = await sql`
        SELECT * FROM list_items
        WHERE list_type = ${type}
        ORDER BY is_completed ASC, created_at DESC
      `
    }

    return items
  } catch (error) {
    console.error('Database error in getListItems:', error)
    throw new Error(`Failed to get list items: ${error.message}`)
  }
}

/**
 * Create a new list item
 * @param {Object} data - List item data
 * @param {string} data.name - Item name
 * @param {string} data.list_type - Type: 'kitap', 'film', or 'urun'
 * @param {string} data.author - Author/Director/Brand name (optional)
 * @param {string} data.description - AI-generated description (optional)
 * @returns {Promise<Object>} Created list item
 */
export async function createListItem(data) {
  try {
    const result = await sql`
      INSERT INTO list_items (name, list_type, author, description)
      VALUES (${data.name}, ${data.list_type}, ${data.author || null}, ${data.description || null})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error('Database error in createListItem:', error)
    throw new Error(`Failed to create list item: ${error.message}`)
  }
}

/**
 * Toggle list item checkbox (completed or liked)
 * @param {number} id - List item ID
 * @param {string} field - Field to toggle: 'is_completed' or 'is_liked'
 * @returns {Promise<Object>} Updated list item
 */
export async function toggleListCheckbox(id, field) {
  try {
    // Validate field
    if (field !== 'is_completed' && field !== 'is_liked') {
      throw new Error('Invalid field. Must be is_completed or is_liked')
    }

    // Get current item state
    const current = await sql`
      SELECT * FROM list_items WHERE id = ${id}
    `

    if (current.length === 0) {
      throw new Error('List item not found')
    }

    const item = current[0]
    const newValue = !item[field]

    // Special handling for toggling completed to false
    if (field === 'is_completed' && !newValue) {
      // If setting completed to false, also set liked to false
      const result = await sql`
        UPDATE list_items
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
    // Use conditional query based on field (safest approach with Neon's new API)
    let result
    if (field === 'is_completed') {
      result = await sql`
        UPDATE list_items
        SET is_completed = ${newValue}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
    } else if (field === 'is_liked') {
      result = await sql`
        UPDATE list_items
        SET is_liked = ${newValue}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
    } else {
      throw new Error('Invalid field')
    }

    return result[0]
  } catch (error) {
    console.error('Database error in toggleListCheckbox:', error)
    throw new Error(`Failed to toggle checkbox: ${error.message}`)
  }
}

/**
 * Get list statistics
 * @returns {Promise<Object>} Statistics by type
 */
export async function getListStats() {
  try {
    const stats = await sql`
      SELECT
        list_type,
        COUNT(*) as total,
        SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN is_liked THEN 1 ELSE 0 END) as liked
      FROM list_items
      GROUP BY list_type
    `

    return stats.reduce((acc, row) => {
      acc[row.list_type] = {
        total: parseInt(row.total),
        completed: parseInt(row.completed),
        liked: parseInt(row.liked),
      }
      return acc
    }, {})
  } catch (error) {
    console.error('Database error in getListStats:', error)
    throw new Error(`Failed to get list stats: ${error.message}`)
  }
}

// ============================================================
// TRAVEL SYSTEM FUNCTIONS
// ============================================================

/**
 * Get travel data with full hierarchy (continents → countries → places)
 * @returns {Promise<Array>} Hierarchical travel data
 */
export async function getTravelHierarchy() {
  try {
    // Get all continents
    const continents = await sql`
      SELECT id, name, name_en, emoji, display_order
      FROM travel_continents
      ORDER BY display_order, name
    `

    // Get all countries
    const countries = await sql`
      SELECT id, continent_id, name, name_en, emoji, display_order
      FROM travel_countries
      ORDER BY display_order, name
    `

    // Get all places
    const places = await sql`
      SELECT
        id, country_id, name, place_type, description,
        is_visited, is_liked, created_at, updated_at
      FROM travel_places
      ORDER BY is_visited ASC, created_at DESC
    `

    // Build hierarchy
    const hierarchy = continents.map((continent) => ({
      ...continent,
      countries: countries
        .filter((country) => country.continent_id === continent.id)
        .map((country) => ({
          ...country,
          places: places.filter((place) => place.country_id === country.id),
        })),
    }))

    // Filter out continents with no countries or countries with no places
    return hierarchy
      .map((continent) => ({
        ...continent,
        countries: continent.countries.filter(
          (country) => country.places.length > 0
        ),
      }))
      .filter((continent) => continent.countries.length > 0)
  } catch (error) {
    console.error('Database error in getTravelHierarchy:', error)
    throw new Error(`Failed to get travel hierarchy: ${error.message}`)
  }
}

/**
 * Create a new travel place (finds or creates continent/country)
 * @param {Object} data - Travel place data from AI
 * @param {string} data.continent - Continent name (Turkish)
 * @param {string} data.country - Country name (Turkish)
 * @param {string} data.place_name - Place name
 * @param {string} data.place_type - Type: 'city', 'attraction', or 'region'
 * @param {string} [data.description] - AI-generated description
 * @returns {Promise<Object>} Created travel place with continent/country info
 */
export async function createTravelPlace(data) {
  try {
    // 1. Find or create continent
    let continent = await sql`
      SELECT id FROM travel_continents WHERE name = ${data.continent}
    `

    if (continent.length === 0) {
      // Create continent if doesn't exist
      continent = await sql`
        INSERT INTO travel_continents (name, name_en, display_order)
        VALUES (${data.continent}, ${data.continent}, 999)
        RETURNING id
      `
    }
    const continentId = continent[0].id

    // 2. Find or create country
    let country = await sql`
      SELECT id FROM travel_countries
      WHERE continent_id = ${continentId} AND name = ${data.country}
    `

    if (country.length === 0) {
      // Create country if doesn't exist
      country = await sql`
        INSERT INTO travel_countries (continent_id, name, name_en, display_order)
        VALUES (${continentId}, ${data.country}, ${data.country}, 999)
        RETURNING id
      `
    }
    const countryId = country[0].id

    // 3. Check for duplicate place
    const existingPlace = await sql`
      SELECT id FROM travel_places
      WHERE country_id = ${countryId} AND name = ${data.place_name}
    `

    if (existingPlace.length > 0) {
      throw new Error(`${data.place_name} zaten ${data.country} için eklenmiş`)
    }

    // 4. Create place
    const result = await sql`
      INSERT INTO travel_places (
        country_id, name, place_type, description
      )
      VALUES (
        ${countryId},
        ${data.place_name},
        ${data.place_type},
        ${data.description || null}
      )
      RETURNING *
    `

    return {
      ...result[0],
      continent: data.continent,
      country: data.country,
    }
  } catch (error) {
    console.error('Database error in createTravelPlace:', error)
    throw new Error(`Failed to create travel place: ${error.message}`)
  }
}

/**
 * Toggle travel place checkbox (visited or liked)
 * @param {number} id - Place ID
 * @param {string} field - Field to toggle: 'is_visited' or 'is_liked'
 * @returns {Promise<Object>} Updated place
 */
export async function toggleTravelPlaceCheckbox(id, field) {
  try {
    // Validate field
    if (field !== 'is_visited' && field !== 'is_liked') {
      throw new Error('Invalid field. Must be is_visited or is_liked')
    }

    // Get current place state
    const current = await sql`
      SELECT * FROM travel_places WHERE id = ${id}
    `

    if (current.length === 0) {
      throw new Error('Travel place not found')
    }

    const place = current[0]
    const newValue = !place[field]

    // Special handling for toggling visited to false
    if (field === 'is_visited' && !newValue) {
      // If setting visited to false, also set liked to false
      const result = await sql`
        UPDATE travel_places
        SET is_visited = false, is_liked = false, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result[0]
    }

    // Special handling for toggling liked to true
    if (field === 'is_liked' && newValue && !place.is_visited) {
      throw new Error('Cannot like a place that has not been visited')
    }

    // Normal toggle
    let result
    if (field === 'is_visited') {
      result = await sql`
        UPDATE travel_places
        SET is_visited = ${newValue}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
    } else if (field === 'is_liked') {
      result = await sql`
        UPDATE travel_places
        SET is_liked = ${newValue}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
    }

    return result[0]
  } catch (error) {
    console.error('Database error in toggleTravelPlaceCheckbox:', error)
    throw new Error(`Failed to toggle checkbox: ${error.message}`)
  }
}

/**
 * Get travel statistics
 * @returns {Promise<Object>} Statistics (total places, visited, liked)
 */
export async function getTravelStats() {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_visited THEN 1 ELSE 0 END) as visited,
        SUM(CASE WHEN is_liked THEN 1 ELSE 0 END) as liked
      FROM travel_places
    `

    return {
      total: parseInt(stats[0].total),
      completed: parseInt(stats[0].visited), // Use 'completed' for consistency with list_items
      liked: parseInt(stats[0].liked),
    }
  } catch (error) {
    console.error('Database error in getTravelStats:', error)
    throw new Error(`Failed to get travel stats: ${error.message}`)
  }
}
