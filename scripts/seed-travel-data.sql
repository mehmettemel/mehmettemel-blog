-- Seed Travel Data
-- Version: 1.0
-- Description: Populates continents and popular countries for travel system
-- Run after: create-travel-tables.sql

-- ============================================================
-- 1. SEED CONTINENTS
-- ============================================================

INSERT INTO travel_continents (name, name_en, emoji, display_order) VALUES
  ('Avrupa', 'Europe', '🇪🇺', 1),
  ('Asya', 'Asia', '🌏', 2),
  ('Afrika', 'Africa', '🌍', 3),
  ('Kuzey Amerika', 'North America', '🌎', 4),
  ('Güney Amerika', 'South America', '🗺️', 5),
  ('Okyanusya', 'Oceania', '🏝️', 6)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 2. SEED COUNTRIES - EUROPE (Avrupa)
-- ============================================================

INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order)
SELECT
  c.id,
  country_data.name,
  country_data.name_en,
  country_data.emoji,
  country_data.display_order
FROM travel_continents c
CROSS JOIN LATERAL (VALUES
  ('Fransa', 'France', '🇫🇷', 1),
  ('İtalya', 'Italy', '🇮🇹', 2),
  ('İspanya', 'Spain', '🇪🇸', 3),
  ('Almanya', 'Germany', '🇩🇪', 4),
  ('İngiltere', 'United Kingdom', '🇬🇧', 5),
  ('Hollanda', 'Netherlands', '🇳🇱', 6),
  ('Belçika', 'Belgium', '🇧🇪', 7),
  ('İsviçre', 'Switzerland', '🇨🇭', 8),
  ('Avusturya', 'Austria', '🇦🇹', 9),
  ('Portekiz', 'Portugal', '🇵🇹', 10),
  ('Yunanistan', 'Greece', '🇬🇷', 11),
  ('Çek Cumhuriyeti', 'Czech Republic', '🇨🇿', 12),
  ('Polonya', 'Poland', '🇵🇱', 13),
  ('Norveç', 'Norway', '🇳🇴', 14),
  ('İsveç', 'Sweden', '🇸🇪', 15),
  ('Danimarka', 'Denmark', '🇩🇰', 16),
  ('İzlanda', 'Iceland', '🇮🇸', 17),
  ('İrlanda', 'Ireland', '🇮🇪', 18),
  ('Hırvatistan', 'Croatia', '🇭🇷', 19),
  ('Macaristan', 'Hungary', '🇭🇺', 20)
) AS country_data(name, name_en, emoji, display_order)
WHERE c.name = 'Avrupa'
ON CONFLICT (continent_id, name) DO NOTHING;

-- ============================================================
-- 3. SEED COUNTRIES - ASIA (Asya)
-- ============================================================

INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order)
SELECT
  c.id,
  country_data.name,
  country_data.name_en,
  country_data.emoji,
  country_data.display_order
FROM travel_continents c
CROSS JOIN LATERAL (VALUES
  ('Türkiye', 'Turkey', '🇹🇷', 1),
  ('Japonya', 'Japan', '🇯🇵', 2),
  ('Güney Kore', 'South Korea', '🇰🇷', 3),
  ('Çin', 'China', '🇨🇳', 4),
  ('Tayland', 'Thailand', '🇹🇭', 5),
  ('Vietnam', 'Vietnam', '🇻🇳', 6),
  ('Endonezya', 'Indonesia', '🇮🇩', 7),
  ('Malezya', 'Malaysia', '🇲🇾', 8),
  ('Singapur', 'Singapore', '🇸🇬', 9),
  ('Hindistan', 'India', '🇮🇳', 10),
  ('Nepal', 'Nepal', '🇳🇵', 11),
  ('Sri Lanka', 'Sri Lanka', '🇱🇰', 12),
  ('Maldivler', 'Maldives', '🇲🇻', 13),
  ('BAE', 'United Arab Emirates', '🇦🇪', 14),
  ('İsrail', 'Israel', '🇮🇱', 15),
  ('Ürdün', 'Jordan', '🇯🇴', 16),
  ('Filipinler', 'Philippines', '🇵🇭', 17),
  ('Kamboçya', 'Cambodia', '🇰🇭', 18)
) AS country_data(name, name_en, emoji, display_order)
WHERE c.name = 'Asya'
ON CONFLICT (continent_id, name) DO NOTHING;

-- ============================================================
-- 4. SEED COUNTRIES - AFRICA (Afrika)
-- ============================================================

INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order)
SELECT
  c.id,
  country_data.name,
  country_data.name_en,
  country_data.emoji,
  country_data.display_order
FROM travel_continents c
CROSS JOIN LATERAL (VALUES
  ('Mısır', 'Egypt', '🇪🇬', 1),
  ('Fas', 'Morocco', '🇲🇦', 2),
  ('Güney Afrika', 'South Africa', '🇿🇦', 3),
  ('Kenya', 'Kenya', '🇰🇪', 4),
  ('Tanzanya', 'Tanzania', '🇹🇿', 5),
  ('Tunus', 'Tunisia', '🇹🇳', 6),
  ('Etiyopya', 'Ethiopia', '🇪🇹', 7),
  ('Madagaskar', 'Madagascar', '🇲🇬', 8)
) AS country_data(name, name_en, emoji, display_order)
WHERE c.name = 'Afrika'
ON CONFLICT (continent_id, name) DO NOTHING;

-- ============================================================
-- 5. SEED COUNTRIES - NORTH AMERICA (Kuzey Amerika)
-- ============================================================

INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order)
SELECT
  c.id,
  country_data.name,
  country_data.name_en,
  country_data.emoji,
  country_data.display_order
FROM travel_continents c
CROSS JOIN LATERAL (VALUES
  ('Amerika Birleşik Devletleri', 'United States', '🇺🇸', 1),
  ('Kanada', 'Canada', '🇨🇦', 2),
  ('Meksika', 'Mexico', '🇲🇽', 3),
  ('Küba', 'Cuba', '🇨🇺', 4),
  ('Jamaika', 'Jamaica', '🇯🇲', 5),
  ('Dominik Cumhuriyeti', 'Dominican Republic', '🇩🇴', 6)
) AS country_data(name, name_en, emoji, display_order)
WHERE c.name = 'Kuzey Amerika'
ON CONFLICT (continent_id, name) DO NOTHING;

-- ============================================================
-- 6. SEED COUNTRIES - SOUTH AMERICA (Güney Amerika)
-- ============================================================

INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order)
SELECT
  c.id,
  country_data.name,
  country_data.name_en,
  country_data.emoji,
  country_data.display_order
FROM travel_continents c
CROSS JOIN LATERAL (VALUES
  ('Brezilya', 'Brazil', '🇧🇷', 1),
  ('Arjantin', 'Argentina', '🇦🇷', 2),
  ('Şili', 'Chile', '🇨🇱', 3),
  ('Peru', 'Peru', '🇵🇪', 4),
  ('Kolombiya', 'Colombia', '🇨🇴', 5),
  ('Ekvador', 'Ecuador', '🇪🇨', 6),
  ('Bolivya', 'Bolivia', '🇧🇴', 7)
) AS country_data(name, name_en, emoji, display_order)
WHERE c.name = 'Güney Amerika'
ON CONFLICT (continent_id, name) DO NOTHING;

-- ============================================================
-- 7. SEED COUNTRIES - OCEANIA (Okyanusya)
-- ============================================================

INSERT INTO travel_countries (continent_id, name, name_en, emoji, display_order)
SELECT
  c.id,
  country_data.name,
  country_data.name_en,
  country_data.emoji,
  country_data.display_order
FROM travel_continents c
CROSS JOIN LATERAL (VALUES
  ('Avustralya', 'Australia', '🇦🇺', 1),
  ('Yeni Zelanda', 'New Zealand', '🇳🇿', 2),
  ('Fiji', 'Fiji', '🇫🇯', 3),
  ('Yeni Kaledonya', 'New Caledonia', '🇳🇨', 4),
  ('Fransız Polinezyası', 'French Polynesia', '🇵🇫', 5)
) AS country_data(name, name_en, emoji, display_order)
WHERE c.name = 'Okyanusya'
ON CONFLICT (continent_id, name) DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

DO $$
DECLARE
  continent_count INT;
  country_count INT;
BEGIN
  SELECT COUNT(*) INTO continent_count FROM travel_continents;
  SELECT COUNT(*) INTO country_count FROM travel_countries;

  RAISE NOTICE '';
  RAISE NOTICE '✅ Travel data seeded successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Summary:';
  RAISE NOTICE '   - Continents: %', continent_count;
  RAISE NOTICE '   - Countries: %', country_count;
  RAISE NOTICE '';
  RAISE NOTICE '🎯 System ready! You can now:';
  RAISE NOTICE '   1. Use /t command in Telegram to add places';
  RAISE NOTICE '   2. Visit /listeler/seyahat page';
  RAISE NOTICE '';
END $$;
