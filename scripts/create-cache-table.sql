-- Create cache_items table for tracking books, movies/series, and products
-- with completion and liked status

CREATE TABLE IF NOT EXISTS cache_items (
  id BIGSERIAL PRIMARY KEY,

  -- Core fields
  name VARCHAR(500) NOT NULL,
  cache_type VARCHAR(20) NOT NULL CHECK (cache_type IN ('kitap', 'film', 'urun')),

  -- Checkbox states
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  is_liked BOOLEAN DEFAULT FALSE NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraint: liked can only be true if completed is true
  CONSTRAINT check_liked_requires_completed CHECK (is_liked = FALSE OR is_completed = TRUE)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cache_type ON cache_items(cache_type);
CREATE INDEX IF NOT EXISTS idx_cache_completed ON cache_items(is_completed);
CREATE INDEX IF NOT EXISTS idx_cache_created_at ON cache_items(created_at DESC);

-- Comments for documentation
COMMENT ON TABLE cache_items IS 'Stores user cache items (books, movies/series, products) with completion and liked status';
COMMENT ON COLUMN cache_items.cache_type IS 'Type of cache item: kitap (book), film (movie/series), or urun (product)';
COMMENT ON COLUMN cache_items.is_completed IS 'Whether the user has completed/read/watched/bought this item';
COMMENT ON COLUMN cache_items.is_liked IS 'Whether the user liked this item (can only be true if is_completed is true)';
COMMENT ON CONSTRAINT check_liked_requires_completed ON cache_items IS 'Ensures that an item can only be liked if it has been completed';
