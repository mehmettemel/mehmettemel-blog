import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

/**
 * POST /api/seyahat/seed
 * Seeds travel_continents and travel_countries tables
 * Only run this once to populate initial data
 */
export async function POST() {
  try {
    // Check if already seeded
    const continents = await sql`SELECT COUNT(*) as count FROM travel_continents`
    if (continents[0].count > 0) {
      return NextResponse.json({
        success: false,
        message: 'Data already seeded. Continents exist.',
        continentCount: parseInt(continents[0].count),
      })
    }

    // 1. Seed continents
    await sql`
      INSERT INTO travel_continents (name, name_en, emoji, display_order) VALUES
        ('Avrupa', 'Europe', '🇪🇺', 1),
        ('Asya', 'Asia', '🌏', 2),
        ('Afrika', 'Africa', '🌍', 3),
        ('Kuzey Amerika', 'North America', '🌎', 4),
        ('Güney Amerika', 'South America', '🗺️', 5),
        ('Okyanusya', 'Oceania', '🏝️', 6)
      ON CONFLICT (name) DO NOTHING
    `

    // Get continent IDs
    const avrupaId =
      await sql`SELECT id FROM travel_continents WHERE name = 'Avrupa'`
    const asyaId =
      await sql`SELECT id FROM travel_continents WHERE name = 'Asya'`
    const afrikaId =
      await sql`SELECT id FROM travel_continents WHERE name = 'Afrika'`
    const kuzeyAmerikaId =
      await sql`SELECT id FROM travel_continents WHERE name = 'Kuzey Amerika'`
    const guneyAmerikaId =
      await sql`SELECT id FROM travel_continents WHERE name = 'Güney Amerika'`
    const okyanusuaId =
      await sql`SELECT id FROM travel_continents WHERE name = 'Okyanusya'`

    // 2. Seed European countries
    await sql`
      INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order) VALUES
        (${avrupaId[0].id}, 'Fransa', 'France', '🇫🇷', 1),
        (${avrupaId[0].id}, 'İtalya', 'Italy', '🇮🇹', 2),
        (${avrupaId[0].id}, 'İspanya', 'Spain', '🇪🇸', 3),
        (${avrupaId[0].id}, 'Almanya', 'Germany', '🇩🇪', 4),
        (${avrupaId[0].id}, 'İngiltere', 'United Kingdom', '🇬🇧', 5),
        (${avrupaId[0].id}, 'Hollanda', 'Netherlands', '🇳🇱', 6),
        (${avrupaId[0].id}, 'Belçika', 'Belgium', '🇧🇪', 7),
        (${avrupaId[0].id}, 'İsviçre', 'Switzerland', '🇨🇭', 8),
        (${avrupaId[0].id}, 'Avusturya', 'Austria', '🇦🇹', 9),
        (${avrupaId[0].id}, 'Portekiz', 'Portugal', '🇵🇹', 10),
        (${avrupaId[0].id}, 'Yunanistan', 'Greece', '🇬🇷', 11),
        (${avrupaId[0].id}, 'Çek Cumhuriyeti', 'Czech Republic', '🇨🇿', 12),
        (${avrupaId[0].id}, 'Polonya', 'Poland', '🇵🇱', 13),
        (${avrupaId[0].id}, 'Norveç', 'Norway', '🇳🇴', 14),
        (${avrupaId[0].id}, 'İsveç', 'Sweden', '🇸🇪', 15),
        (${avrupaId[0].id}, 'Danimarka', 'Denmark', '🇩🇰', 16),
        (${avrupaId[0].id}, 'İzlanda', 'Iceland', '🇮🇸', 17),
        (${avrupaId[0].id}, 'İrlanda', 'Ireland', '🇮🇪', 18),
        (${avrupaId[0].id}, 'Hırvatistan', 'Croatia', '🇭🇷', 19),
        (${avrupaId[0].id}, 'Macaristan', 'Hungary', '🇭🇺', 20)
      ON CONFLICT (continent_id, name) DO NOTHING
    `

    // 3. Seed Asian countries
    await sql`
      INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order) VALUES
        (${asyaId[0].id}, 'Türkiye', 'Turkey', '🇹🇷', 1),
        (${asyaId[0].id}, 'Japonya', 'Japan', '🇯🇵', 2),
        (${asyaId[0].id}, 'Güney Kore', 'South Korea', '🇰🇷', 3),
        (${asyaId[0].id}, 'Çin', 'China', '🇨🇳', 4),
        (${asyaId[0].id}, 'Tayland', 'Thailand', '🇹🇭', 5),
        (${asyaId[0].id}, 'Vietnam', 'Vietnam', '🇻🇳', 6),
        (${asyaId[0].id}, 'Endonezya', 'Indonesia', '🇮🇩', 7),
        (${asyaId[0].id}, 'Malezya', 'Malaysia', '🇲🇾', 8),
        (${asyaId[0].id}, 'Singapur', 'Singapore', '🇸🇬', 9),
        (${asyaId[0].id}, 'Hindistan', 'India', '🇮🇳', 10),
        (${asyaId[0].id}, 'Nepal', 'Nepal', '🇳🇵', 11),
        (${asyaId[0].id}, 'Sri Lanka', 'Sri Lanka', '🇱🇰', 12),
        (${asyaId[0].id}, 'Maldivler', 'Maldives', '🇲🇻', 13),
        (${asyaId[0].id}, 'BAE', 'United Arab Emirates', '🇦🇪', 14),
        (${asyaId[0].id}, 'İsrail', 'Israel', '🇮🇱', 15),
        (${asyaId[0].id}, 'Ürdün', 'Jordan', '🇯🇴', 16),
        (${asyaId[0].id}, 'Filipinler', 'Philippines', '🇵🇭', 17),
        (${asyaId[0].id}, 'Kamboçya', 'Cambodia', '🇰🇭', 18)
      ON CONFLICT (continent_id, name) DO NOTHING
    `

    // 4. Seed African countries
    await sql`
      INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order) VALUES
        (${afrikaId[0].id}, 'Mısır', 'Egypt', '🇪🇬', 1),
        (${afrikaId[0].id}, 'Fas', 'Morocco', '🇲🇦', 2),
        (${afrikaId[0].id}, 'Güney Afrika', 'South Africa', '🇿🇦', 3),
        (${afrikaId[0].id}, 'Kenya', 'Kenya', '🇰🇪', 4),
        (${afrikaId[0].id}, 'Tanzanya', 'Tanzania', '🇹🇿', 5),
        (${afrikaId[0].id}, 'Tunus', 'Tunisia', '🇹🇳', 6),
        (${afrikaId[0].id}, 'Etiyopya', 'Ethiopia', '🇪🇹', 7),
        (${afrikaId[0].id}, 'Madagaskar', 'Madagascar', '🇲🇬', 8)
      ON CONFLICT (continent_id, name) DO NOTHING
    `

    // 5. Seed North American countries
    await sql`
      INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order) VALUES
        (${kuzeyAmerikaId[0].id}, 'Amerika Birleşik Devletleri', 'United States', '🇺🇸', 1),
        (${kuzeyAmerikaId[0].id}, 'Kanada', 'Canada', '🇨🇦', 2),
        (${kuzeyAmerikaId[0].id}, 'Meksika', 'Mexico', '🇲🇽', 3),
        (${kuzeyAmerikaId[0].id}, 'Küba', 'Cuba', '🇨🇺', 4),
        (${kuzeyAmerikaId[0].id}, 'Jamaika', 'Jamaica', '🇯🇲', 5),
        (${kuzeyAmerikaId[0].id}, 'Dominik Cumhuriyeti', 'Dominican Republic', '🇩🇴', 6)
      ON CONFLICT (continent_id, name) DO NOTHING
    `

    // 6. Seed South American countries
    await sql`
      INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order) VALUES
        (${guneyAmerikaId[0].id}, 'Brezilya', 'Brazil', '🇧🇷', 1),
        (${guneyAmerikaId[0].id}, 'Arjantin', 'Argentina', '🇦🇷', 2),
        (${guneyAmerikaId[0].id}, 'Şili', 'Chile', '🇨🇱', 3),
        (${guneyAmerikaId[0].id}, 'Peru', 'Peru', '🇵🇪', 4),
        (${guneyAmerikaId[0].id}, 'Kolombiya', 'Colombia', '🇨🇴', 5),
        (${guneyAmerikaId[0].id}, 'Ekvador', 'Ecuador', '🇪🇨', 6),
        (${guneyAmerikaId[0].id}, 'Bolivya', 'Bolivia', '🇧🇴', 7)
      ON CONFLICT (continent_id, name) DO NOTHING
    `

    // 7. Seed Oceania countries
    await sql`
      INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order) VALUES
        (${okyanusuaId[0].id}, 'Avustralya', 'Australia', '🇦🇺', 1),
        (${okyanusuaId[0].id}, 'Yeni Zelanda', 'New Zealand', '🇳🇿', 2),
        (${okyanusuaId[0].id}, 'Fiji', 'Fiji', '🇫🇯', 3),
        (${okyanusuaId[0].id}, 'Yeni Kaledonya', 'New Caledonia', '🇳🇨', 4),
        (${okyanusuaId[0].id}, 'Fransız Polinezyası', 'French Polynesia', '🇵🇫', 5)
      ON CONFLICT (continent_id, name) DO NOTHING
    `

    // Get final counts
    const finalContinents = await sql`SELECT COUNT(*) as count FROM travel_continents`
    const finalCountries = await sql`SELECT COUNT(*) as count FROM travel_countries`

    return NextResponse.json({
      success: true,
      message: 'Travel data seeded successfully',
      continentCount: parseInt(finalContinents[0].count),
      countryCount: parseInt(finalCountries[0].count),
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/seyahat/seed
 * Check seed status
 */
export async function GET() {
  try {
    const continents = await sql`SELECT COUNT(*) as count FROM travel_continents`
    const countries = await sql`SELECT COUNT(*) as count FROM travel_countries`
    const places = await sql`SELECT COUNT(*) as count FROM travel_places`

    const isSeeded = parseInt(continents[0].count) > 0

    return NextResponse.json({
      isSeeded,
      continentCount: parseInt(continents[0].count),
      countryCount: parseInt(countries[0].count),
      placeCount: parseInt(places[0].count),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 },
    )
  }
}
