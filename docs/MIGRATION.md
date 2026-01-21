# Kategori Sistemi Migration Dokümantasyonu

v2.x → v3.0.0 Büyük Güncelleme (21 Ocak 2026)

---

## 📋 İçindekiler

1. [Özet](#özet)
2. [Değişiklikler](#değişiklikler)
3. [Migration Adımları](#migration-adımları)
4. [Rollback](#rollback)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Özet

### Neden?

- **Problem:** 4 farklı kategori sistemi (alıntılar için 5, kitaplar için 5, videolar için 4, linkler için 3)
- **Karmaşık:** Her tip farklı kategorilere sahipti
- **Tutarsız:** Platform bazlı kategoriler (youtube, documentary) yerine içerik bazlı kategoriler gerekiyordu

### Çözüm

- **4 Yekpare Kategori:** Gıda 🍎, Sağlık 🏥, Kişisel 💭, Genel 📝
- **Tek Sistem:** Alıntı, kitap, video hepsi aynı kategorileri kullanır
- **İçerik Bazlı:** Platform değil, içerik konusuna göre kategorileme
- **Linkler Kategorisiz:** Artık tüm linkler bir arada

---

## Değişiklikler

### 1. Database Schema

**Değişiklikler:**

```sql
-- NOT NULL constraint kaldırıldı (linkler için NULL kategori)
ALTER TABLE notes ALTER COLUMN category DROP NOT NULL;

-- Migration tracking kolonu eklendi
ALTER TABLE notes ADD COLUMN old_category VARCHAR(50);

-- Eski kategoriler yedeklendi
UPDATE notes SET old_category = category;

-- Linkler NULL yapıldı
UPDATE notes SET category = NULL WHERE note_type = 'link';
```

**valid_categories Tablosu:**

```sql
-- Eski kategoriler temizlendi
DELETE FROM valid_categories;

-- Yeni 4 kategori eklendi (her tip için)
INSERT INTO valid_categories (note_type, category_id, category_name, icon) VALUES
  ('quote', 'gida', 'Gıda', '🍎'),
  ('quote', 'saglik', 'Sağlık', '🏥'),
  ('quote', 'kisisel', 'Kişisel', '💭'),
  ('quote', 'genel', 'Genel', '📝'),
  -- book ve video için de aynısı
```

### 2. Telegram Komutları

**Yeni Komutlar:**

| Tip    | Gıda  | Sağlık | Kişisel | Genel |
| ------ | ----- | ------ | ------- | ----- |
| Alıntı | `/ag` | `/as`  | `/ak`   | `/a`  |
| Kitap  | `/kg` | `/ks`  | `/kk`   | `/b`  |
| Video  | `/vg` | `/vs`  | `/vk`   | `/v`  |

**Özellikler:**

- Kategori komuttan gelirse AI kategorileme skip edilir
- Legacy komutlar (`/quote`, `/book`, `/video`) hala çalışır → 'genel' kategorisi
- `/k` liste-kitap olarak korundu (conflict yok)

### 3. AI Prompts

**handleNote() - Alıntılar:**

```javascript
// ESKİ: 5 kategori
- kisisel, saglik, gida, seyahat, genel

// YENİ: 4 kategori
- gida, saglik, kisisel, genel
// seyahat → kisisel veya genel (içeriğe göre)
```

**handleBook() - Kitaplar:**

```javascript
// ESKİ: Tür bazlı (5 kategori)
- science, selfhelp, biography, fiction, health

// YENİ: İçerik bazlı (4 kategori)
- gida, saglik, kisisel, genel
// Kitabın konusuna göre kategori
```

**handleVideo() - Videolar:**

```javascript
// ESKİ: Platform bazlı (4 kategori)
- youtube, documentary, course, podcast

// YENİ: İçerik bazlı (4 kategori)
- gida, saglik, kisisel, genel
// Videonun konusuna göre kategori
```

**handleLink() - Linkler:**

```javascript
// ESKİ: 3 kategori
- teknik, icerik, diger

// YENİ: Kategori YOK
return { category: null }
```

### 4. Frontend

**Kategori Tanımları (src/data/kesifler.js):**

```javascript
// Alıntı, Kitap, Video → AYNI kategoriler
export const quoteCategories = [
  { id: 'all', name: 'Tümü', icon: '📚' },
  { id: 'gida', name: 'Gıda', icon: '🍎' },
  { id: 'saglik', name: 'Sağlık', icon: '🏥' },
  { id: 'kisisel', name: 'Kişisel', icon: '💭' },
  { id: 'genel', name: 'Genel', icon: '📝' },
]

export const bookCategories = [...] // AYNI
export const videoCategories = [...] // AYNI

// Linkler → sadece "Tümü"
export const linkCategories = [
  { id: 'all', name: 'Tümü', icon: '📚' },
]
```

**Sayfalar:**

- `/kesifler/linkler` → Kategori filtresi kaldırıldı
- `LinksList.jsx` → CategorySidebar component'ı kaldırıldı

### 5. Database Fonksiyonları

**createNote() (src/lib/db.js):**

```javascript
// Link için NULL kategori
const category = data.type === 'link' ? null : (data.category || null)
```

**getNotes():**

```javascript
// Link için kategori filtresini atla
if (type === 'link') {
  // Kategori filtresi KULLANMA
  notes = await sql`SELECT * FROM notes WHERE note_type = 'link' ...`
} else if (category && category !== 'all') {
  // Diğer tipler için kategori filtresi
  notes = await sql`... WHERE note_type = ${type} AND category = ${category} ...`
}
```

---

## Migration Adımları

### 1. Backup (ÖNEMLİ!)

```bash
# Database backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Code backup
git branch backup-v2
git checkout backup-v2
git push origin backup-v2
git checkout main
```

### 2. Code Deploy

```bash
git add .
git commit -m "Refactor: Unified 4-category system for discoveries (v3.0.0)

- Add category-specific Telegram commands (/ag, /as, /kg, /vg, etc.)
- Update AI prompts to 4 unified categories
- Remove categories from links
- Update frontend category displays
- Add migration scripts

🤖 Generated with Claude Code"

git push
```

### 3. Database Schema Migration

```bash
# Run schema migration
psql $DATABASE_URL -f scripts/migrate-schema.sql
```

**Script içeriği:**

```sql
-- Step 1: Backup
CREATE TABLE IF NOT EXISTS valid_categories_backup AS SELECT * FROM valid_categories;

-- Step 2: Remove NOT NULL constraint
ALTER TABLE notes ALTER COLUMN category DROP NOT NULL;

-- Step 3: Add tracking column
ALTER TABLE notes ADD COLUMN IF NOT EXISTS old_category VARCHAR(50);

-- Step 4: Backup old categories
UPDATE notes SET old_category = category WHERE old_category IS NULL;

-- Step 5: Update valid_categories
DELETE FROM valid_categories;
INSERT INTO valid_categories ... -- Yeni kategoriler

-- Step 6: Set links to NULL
UPDATE notes SET category = NULL WHERE note_type = 'link';
```

### 4. Data Migration (AI ile)

**Dry-run (önce test):**

```bash
node scripts/migrate-categories.js --dry-run
```

**Execute:**

```bash
node scripts/migrate-categories.js --execute
```

**Verify:**

```bash
node scripts/migrate-categories.js --verify
```

**Migration Logic:**

```javascript
// Direkt mapping (AI gereksiz)
const DIRECT_MAPPINGS = {
  quote: {
    gida: 'gida',      // değişmez
    saglik: 'saglik',  // değişmez
    kisisel: 'kisisel', // değişmez
    genel: 'genel',     // değişmez
    // seyahat → AI
  },
  book: {
    health: 'saglik',
    selfhelp: 'kisisel',
    // science, biography, fiction → AI
  },
  video: {}, // Hepsi AI ile
}

// AI ile kategorileme
const newCategory = await categorizeWithAI(note)
// Gemini 2.5 Flash ile içerik bazlı kategorileme
```

**Output:**

```
📊 MIGRATION SUMMARY

Total notes: 150
Successful: 148
Errors: 2

📈 Category Changes:
  quote: seyahat → kisisel: 12 notes
  quote: seyahat → genel: 5 notes
  book: science → genel: 23 notes
  book: selfhelp → kisisel: 18 notes
  video: youtube → saglik: 30 notes
  video: podcast → kisisel: 25 notes
  link: teknik → NULL: 15 notes
  link: icerik → NULL: 20 notes
```

### 5. Verification

```sql
-- Kategori dağılımını kontrol et
SELECT
  note_type,
  category,
  COUNT(*) as count
FROM notes
GROUP BY note_type, category
ORDER BY note_type, category;

-- Unmigrated notları kontrol et
SELECT COUNT(*) FROM notes
WHERE old_category IS NOT NULL
AND category = old_category
AND note_type != 'link';

-- Linkler NULL mı?
SELECT COUNT(*) FROM notes
WHERE note_type = 'link' AND category IS NOT NULL;
-- 0 olmalı
```

### 6. Testing

**Telegram komutlarını test et:**

```bash
# Yeni komutlar
/ag Omega-3 sağlıklı
/as Günde 10.000 adım
/ak Tutarlılık önemli
/kg Akdeniz diyeti - Michael Pollan
/vs Uyku çok önemli - Huberman
/vk Focus is key - Cal Newport

# Legacy komutlar
/a Test genel alıntı
/b Test genel kitap
/v Test genel video
/l https://example.com
```

**Frontend'i test et:**

- `/kesifler/alintilar` → 4 kategori görmeli
- `/kesifler/kitaplar` → 4 kategori görmeli
- `/kesifler/videolar` → 4 kategori görmeli
- `/kesifler/linkler` → Kategori filtresi YOK olmalı

---

## Rollback

Eğer bir şeyler ters giderse:

### 1. Database Rollback

```sql
-- Kategorileri geri yükle
UPDATE notes
SET category = old_category
WHERE old_category IS NOT NULL;

-- valid_categories'i geri yükle
DELETE FROM valid_categories;
INSERT INTO valid_categories
SELECT * FROM valid_categories_backup;

-- NOT NULL constraint'i geri ekle
ALTER TABLE notes ALTER COLUMN category SET NOT NULL;
```

### 2. Code Rollback

```bash
git revert HEAD
git push
```

### 3. Full Restore (son çare)

```bash
# Database'i geri yükle
psql $DATABASE_URL < backup-20260121.sql

# Kodu geri al
git checkout backup-v2
git push origin main --force
```

---

## Testing

### Unit Tests

```javascript
// Command parsing tests
describe('parseMessage with category commands', () => {
  test('/ag returns quote with gida category', () => {
    const result = parseMessage('/ag Omega-3 test')
    expect(result).toEqual({
      type: 'quote',
      category: 'gida',
      content: 'Omega-3 test'
    })
  })

  test('/l returns link with null category', () => {
    const result = parseMessage('/l https://example.com')
    expect(result).toEqual({
      type: 'link',
      category: null,
      content: 'https://example.com'
    })
  })
})
```

### Integration Tests

1. Send `/ag` command → verify category=gida
2. Send `/kg` command → verify category=gida
3. Send `/l` command → verify category=NULL
4. Check frontend filters work
5. Check legacy commands work

---

## Troubleshooting

### "NOT NULL constraint violation"

**Hata:**

```
ERROR: null value in column "category" violates not-null constraint
```

**Çözüm:**

```sql
ALTER TABLE notes ALTER COLUMN category DROP NOT NULL;
```

### "Command not recognized"

**Problem:** `/kg` algılanmıyor

**Çözüm:** Komut sırası önemli! `/kg` önce, `/k` sonra parse edilmeli.

```javascript
// ✅ DOĞRU sıra
if (text.startsWith('/kg ')) { ... }
if (text.startsWith('/k ')) { ... }

// ❌ YANLIŞ sıra
if (text.startsWith('/k ')) { ... }  // /kg'yi yakalar!
if (text.startsWith('/kg ')) { ... }
```

### "AI categorization failing"

**Problem:** Gemini API rate limit

**Çözüm:** Migration script'te zaten retry logic var

```javascript
// Her 10 not'tan sonra 3 saniye bekle
if ((i + 1) % 10 === 0) {
  await new Promise(resolve => setTimeout(resolve, 3000))
}
```

### "Frontend showing wrong categories"

**Problem:** Cache

**Çözüm:**

```bash
# ISR cache'i temizle
vercel deploy --force
```

---

## Başarı Kriterleri

- ✅ Yeni komutlar çalışıyor (`/ag`, `/kg`, `/vg`)
- ✅ Linkler kategorisiz
- ✅ Mevcut veriler migrate edilmiş
- ✅ Veri kaybı yok
- ✅ Frontend 4 kategoriyi gösteriyor
- ✅ AI yeni kategorileri kullanıyor
- ✅ Legacy komutlar çalışıyor
- ✅ Rollback hazır

---

## Migration Özet

```
ESKİ (v2.x)                    YENİ (v3.0.0)
─────────────────────────────────────────────────────
Alıntılar                      Alıntılar
  - 5 kategori                   - 4 kategori
  - seyahat (kaldırıldı)         - /ag, /as, /ak, /a

Kitaplar                       Kitaplar
  - 5 tür (genre)                - 4 içerik kategorisi
  - science, biography...        - /kg, /ks, /kk, /b

Videolar                       Videolar
  - 4 platform                   - 4 içerik kategorisi
  - youtube, podcast...          - /vg, /vs, /vk, /v

Linkler                        Linkler
  - 3 kategori                   - KATEGORİ YOK
  - teknik, içerik, diğer        - /l (hepsi bir arada)
```

---

**Migration Tarihi:** 21 Ocak 2026
**Versiyon:** v2.x → v3.0.0
**Sorumlu:** Claude Code + Mehmet Temel
**Süre:** ~4 saat (kod) + ~2 saat (migration)
