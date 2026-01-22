-- ============================================
-- TABLOYİ BASİTLEŞTİR - Gereksiz Kolonları Sil
-- ============================================
-- Eğer recipes tablosu zaten varsa ve fazla kolon içeriyorsa
-- bu script ile sadece gerekli kolonları bırakabilirsiniz
--
-- UYARI: Bu işlem geri alınamaz! Veri kaybı olabilir.
-- Önce backup alın!
--
-- Kullanım:
-- psql $DATABASE_URL -f scripts/simplify-recipes-table.sql
-- ============================================

-- Fazla kolonları sil
ALTER TABLE recipes
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS category,
  DROP COLUMN IF EXISTS prep_time,
  DROP COLUMN IF EXISTS cook_time,
  DROP COLUMN IF EXISTS servings,
  DROP COLUMN IF EXISTS difficulty,
  DROP COLUMN IF EXISTS tags;

-- İndexleri temizle
DROP INDEX IF EXISTS idx_recipes_category;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Recipes table simplified!';
  RAISE NOTICE '📊 Remaining columns: id, name, ingredients, instructions, created_at, updated_at';
  RAISE NOTICE '🗑️ Removed: description, category, prep_time, cook_time, servings, difficulty, tags';
END $$;
