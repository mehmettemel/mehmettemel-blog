-- Create Travel Tables Migration
-- Version: 1.0
-- Description: Creates 3-level hierarchical structure for travel data
-- Tables: travel_continents → travel_countries → travel_places

-- ============================================================
-- 1. CONTINENTS TABLE
-- ============================================================
CREATE TABLE travel_continents (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, -- Turkish name: 'Avrupa', 'Asya', etc.
  name_en VARCHAR(100) NOT NULL,     -- English name: 'Europe', 'Asia', etc.
  emoji VARCHAR(10),                 -- Emoji: '🌍', '🌏', '🌎'
  display_order INT DEFAULT 0,       -- Custom ordering (lower = first)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 2. COUNTRIES TABLE
-- ============================================================
CREATE TABLE travel_countries (
  id BIGSERIAL PRIMARY KEY,
  continent_id BIGINT NOT NULL REFERENCES travel_continents(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,        -- Turkish name: 'Fransa', 'Türkiye', etc.
  name_en VARCHAR(100) NOT NULL,     -- English name: 'France', 'Turkey', etc.
  emoji VARCHAR(10),                 -- Flag emoji: '🇫🇷', '🇹🇷', etc.
  display_order INT DEFAULT 0,       -- Custom ordering within continent
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Unique constraint: one country name per continent
  UNIQUE(continent_id, name)
);

-- ============================================================
-- 3. PLACES TABLE (Cities, Attractions, Regions)
-- ============================================================
CREATE TABLE travel_places (
  id BIGSERIAL PRIMARY KEY,
  country_id BIGINT NOT NULL REFERENCES travel_countries(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,        -- Place name: 'Paris', 'Eiffel Tower', 'Cappadocia'
  place_type VARCHAR(20) NOT NULL    -- Type: 'city', 'attraction', 'region'
    CHECK (place_type IN ('city', 'attraction', 'region')),
  description TEXT,                  -- AI-generated Turkish description (2-3 lines)

  -- Checkbox states (same pattern as list_items)
  is_visited BOOLEAN DEFAULT FALSE NOT NULL, -- Equivalent to is_completed
  is_liked BOOLEAN DEFAULT FALSE NOT NULL,   -- Beğendim (can only be true if visited)

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Business logic constraint: can only like if visited
  CONSTRAINT travel_places_liked_requires_visited
    CHECK (is_liked = FALSE OR is_visited = TRUE),

  -- Unique constraint: one place name per country
  UNIQUE(country_id, name)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Continents
CREATE INDEX idx_travel_continents_order ON travel_continents(display_order, name);

-- Countries
CREATE INDEX idx_travel_countries_continent ON travel_countries(continent_id);
CREATE INDEX idx_travel_countries_order ON travel_countries(continent_id, display_order, name);

-- Places
CREATE INDEX idx_travel_places_country ON travel_places(country_id);
CREATE INDEX idx_travel_places_visited ON travel_places(is_visited);
CREATE INDEX idx_travel_places_liked ON travel_places(is_liked);
CREATE INDEX idx_travel_places_created ON travel_places(created_at DESC);
CREATE INDEX idx_travel_places_type ON travel_places(place_type);

-- ============================================================
-- TABLE COMMENTS (Documentation)
-- ============================================================

COMMENT ON TABLE travel_continents IS
  'Top-level geography: continents for organizing travel data hierarchically';

COMMENT ON TABLE travel_countries IS
  'Second-level: countries within continents';

COMMENT ON TABLE travel_places IS
  'Third-level: cities, attractions, and regions within countries. Includes visited/liked checkboxes';

COMMENT ON COLUMN travel_places.place_type IS
  'Type classification: city (Paris, Tokyo), attraction (Eiffel Tower, Taj Mahal), region (Cappadocia, Tuscany)';

COMMENT ON COLUMN travel_places.is_visited IS
  'Whether user has visited this place (equivalent to is_completed in list_items)';

COMMENT ON COLUMN travel_places.is_liked IS
  'Whether user liked this place (can only be true if is_visited = true)';

COMMENT ON CONSTRAINT travel_places_liked_requires_visited ON travel_places IS
  'Business logic: user can only like a place if they have visited it first';

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Travel tables created successfully!';
  RAISE NOTICE '   - travel_continents';
  RAISE NOTICE '   - travel_countries';
  RAISE NOTICE '   - travel_places';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next step: Run seed-travel-data.sql to populate continents and countries';
END $$;
