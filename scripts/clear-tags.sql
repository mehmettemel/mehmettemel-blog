-- Clear all tags from existing notes
-- Run this in Neon SQL Editor or via psql

-- Update all notes to have empty tags array
UPDATE notes SET tags = '[]'::jsonb WHERE tags IS NOT NULL AND tags != '[]'::jsonb;

-- Verify the update
SELECT COUNT(*) as notes_with_tags FROM notes WHERE tags IS NOT NULL AND tags != '[]'::jsonb;

-- Optional: If you want to completely remove the tags column (NOT RECOMMENDED - just leave it empty)
-- ALTER TABLE notes DROP COLUMN tags;
