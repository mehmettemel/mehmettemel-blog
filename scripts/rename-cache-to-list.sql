-- ============================================
-- Migration: cache_items → list_items
-- Tarih: 17 Ocak 2026
-- Versiyon: v2.2.0
-- ============================================

-- DİKKAT: Bu script'i çalıştırmadan önce backup alın!
-- pg_dump your_database > backup_before_rename.sql

-- ============================================
-- ADIM 1: Tablo adını değiştir
-- ============================================
ALTER TABLE cache_items RENAME TO list_items;

-- ============================================
-- ADIM 2: Sütun adını değiştir
-- ============================================
ALTER TABLE list_items RENAME COLUMN cache_type TO list_type;

-- ============================================
-- ADIM 3: Constraint'i güncelle
-- ============================================
-- Önce eski constraint'i kaldır
ALTER TABLE list_items DROP CONSTRAINT IF EXISTS cache_items_cache_type_check;

-- Yeni constraint ekle
ALTER TABLE list_items ADD CONSTRAINT list_items_list_type_check 
  CHECK (list_type IN ('kitap', 'film', 'urun'));

-- ============================================
-- ADIM 4: Index'leri yeniden adlandır
-- ============================================
-- Eski index'leri kaldır (varsa)
DROP INDEX IF EXISTS idx_cache_type;
DROP INDEX IF EXISTS idx_cache_completed;
DROP INDEX IF EXISTS idx_cache_created_at;

-- Yeni index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_list_type ON list_items(list_type);
CREATE INDEX IF NOT EXISTS idx_list_completed ON list_items(is_completed);
CREATE INDEX IF NOT EXISTS idx_list_created_at ON list_items(created_at DESC);

-- ============================================
-- ADIM 5: Liked constraint'i güncelle
-- ============================================
-- Eski constraint'i kaldır
ALTER TABLE list_items DROP CONSTRAINT IF EXISTS check_liked_requires_completed;

-- Yeni constraint ekle
ALTER TABLE list_items ADD CONSTRAINT list_items_liked_requires_completed
  CHECK (is_liked = FALSE OR is_completed = TRUE);

-- ============================================
-- DOĞRULAMA: Tablo yapısını kontrol et
-- ============================================
-- Aşağıdaki sorguyu çalıştırarak yapıyı doğrulayın:
-- \d list_items

-- ============================================
-- GERİ ALMA (Rollback) - Gerekirse kullanın
-- ============================================
/*
ALTER TABLE list_items RENAME TO cache_items;
ALTER TABLE cache_items RENAME COLUMN list_type TO cache_type;
ALTER TABLE cache_items DROP CONSTRAINT IF EXISTS list_items_list_type_check;
ALTER TABLE cache_items ADD CONSTRAINT cache_items_cache_type_check 
  CHECK (cache_type IN ('kitap', 'film', 'urun'));
DROP INDEX IF EXISTS idx_list_type;
DROP INDEX IF EXISTS idx_list_completed;
DROP INDEX IF EXISTS idx_list_created_at;
CREATE INDEX IF NOT EXISTS idx_cache_type ON cache_items(cache_type);
CREATE INDEX IF NOT EXISTS idx_cache_completed ON cache_items(is_completed);
CREATE INDEX IF NOT EXISTS idx_cache_created_at ON cache_items(created_at DESC);
ALTER TABLE cache_items DROP CONSTRAINT IF EXISTS list_items_liked_requires_completed;
ALTER TABLE cache_items ADD CONSTRAINT check_liked_requires_completed
  CHECK (is_liked = FALSE OR is_completed = TRUE);
*/
