# Sistem Dokümantasyonu

Teknik detaylar, mimari, database şemaları, ve API referansı.

---

## İçindekiler

1. [Sistem Mimarisi](#sistem-mimarisi)
2. [Database Şemaları](#database-şemaları)
3. [Kategori Sistemi (v4.0.0)](#kategori-sistemi-v400)
4. [Listeler Sistemi](#listeler-sistemi)
5. [Telegram Entegrasyonu](#telegram-entegrasyonu)
6. [AI Kategorilendirme](#ai-kategorilendirme)
7. [API Referansı](#api-referansı)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────┐
│                    TELEGRAM BOT                          │
│  User → Telegram → Webhook → Next.js API Route          │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│  LİSTELER   │ │ KEŞİFLER │ │    STATS     │
│ (Simple DB)  │ │ (AI+DB)  │ │     (DB)     │
└──────┬───────┘ └────┬─────┘ └──────┬───────┘
       │              │              │
       └──────────────┼──────────────┘
                      ▼
         ┌─────────────────────────┐
         │  NEON PostgreSQL        │
         │  - cache_items          │
         │  - notes                │
         └─────────────────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │   WEB PAGES (ISR 60s)   │
         │  - /listeler/*          │
         │  - /kesifler            │
         └─────────────────────────┘
```

### Veri Akışı

**Cache Ekleme (`/k`, `/f`, `/u`):**

```
Telegram → parseMessage() → handleCacheItemWithAI()
  → Gemini API (yazar/yönetmen/marka/description)
  → createCacheItem() → cache_items table
  → Telegram yanıt → Web görünür (ISR 60s)
```

**Keşifler Ekleme (`>li`, `>al`, `>vi`, `>ki`):**

```
Telegram → parseMessage() → handleLink/Note/Video/Book()
  → Gemini API (AI otomatik kategori, kaynak)
  → createNote() → notes table
  → Telegram yanıt → /kesifler sayfası (ISR 60s)
```

---

## Database Şemaları

### list_items

```sql
CREATE TABLE list_items (
  id BIGSERIAL PRIMARY KEY,

  -- Temel alanlar
  name VARCHAR(500) NOT NULL,
  list_type VARCHAR(20) NOT NULL
    CHECK (list_type IN ('kitap', 'film', 'urun')),

  -- AI ile bulunan alanlar
  author VARCHAR(200),              -- Yazar/Yönetmen/Marka
  description TEXT,                 -- 3-4 satır AI-generated Türkçe açıklama

  -- Checkbox durumları
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  is_liked BOOLEAN DEFAULT FALSE NOT NULL,

  -- Zaman damgaları
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- İş mantığı: Beğenmek için önce tamamlanmış olmalı
  CONSTRAINT list_items_liked_requires_completed
    CHECK (is_liked = FALSE OR is_completed = TRUE)
);

-- İndeksler
CREATE INDEX idx_list_type ON list_items(list_type);
CREATE INDEX idx_list_completed ON list_items(is_completed);
CREATE INDEX idx_list_created_at ON list_items(created_at DESC);
```

**Önemli Kısıtlamalar:**

- `is_liked = true` → `is_completed` mutlaka `true` olmalı
- `is_completed` false yapılırsa → `is_liked` otomatik false olur

**Migrations:**

- `scripts/rename-cache-to-list.sql` - cache_items → list_items migration

---

### notes

```sql
CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,

  -- Not tipi
  note_type VARCHAR(20) NOT NULL
    CHECK (note_type IN ('link', 'quote', 'video', 'book')),

  -- AI ile bulunan kategori (v3.0.0: NULL allowed for links)
  category VARCHAR(50),  -- NOT NULL constraint kaldırıldı

  -- İçerik
  title VARCHAR(500),              -- Sadece link için
  text TEXT NOT NULL,              -- Ana içerik

  -- Meta bilgiler
  author VARCHAR(200),             -- Yazar (quote, book)
  source VARCHAR(500),             -- Kaynak (video, book)
  url TEXT,                        -- URL (link)
  tags TEXT[],                     -- Etiketler (opsiyonel)

  -- Zaman damgaları
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Migration tracking (v3.0.0)
  is_migrated BOOLEAN DEFAULT FALSE,
  old_category VARCHAR(50)         -- Backup for rollback
);

-- İndeksler
CREATE INDEX idx_notes_type ON notes(note_type);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_type_category ON notes(note_type, category);
```

---

## Kategori Sistemi (v4.0.0)

### 🍎 4 Yekpare Kategori

**v4.0.0 Güncellemesi (24 Ocak 2026):**

AI TAMAMEN otomatik kategori belirler. Manuel kategori seçimi YOK.

Tüm keşifler (alıntı, kitap, video) aynı 4 kategoriyi kullanır:

| Kategori | ID        | Icon | Açıklama                                        |
| -------- | --------- | ---- | ----------------------------------------------- |
| Gıda     | `gida`    | 🍎   | Yemek, beslenme, tarif, mutfak                  |
| Sağlık   | `saglik`  | 🏥   | Fitness, bağışıklık, wellness, mental sağlık    |
| Kişisel  | `kisisel` | 💭   | Motivasyon, üretkenlik, gelişim, alışkanlıklar  |
| Genel    | `genel`   | 📝   | Diğer tüm konular                               |

**Linkler:** Kategorisiz (category = NULL)

### valid_categories Tablosu

```sql
CREATE TABLE valid_categories (
  note_type VARCHAR(20) NOT NULL,
  category_id VARCHAR(50) NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  PRIMARY KEY (note_type, category_id)
);

-- v4.0.0 kategoriler (AI otomatik belirler)
INSERT INTO valid_categories (note_type, category_id, category_name, icon) VALUES
  ('quote', 'gida', 'Gıda', '🍎'),
  ('quote', 'saglik', 'Sağlık', '🏥'),
  ('quote', 'kisisel', 'Kişisel', '💭'),
  ('quote', 'genel', 'Genel', '📝'),
  ('book', 'gida', 'Gıda', '🍎'),
  ('book', 'saglik', 'Sağlık', '🏥'),
  ('book', 'kisisel', 'Kişisel', '💭'),
  ('book', 'genel', 'Genel', '📝'),
  ('video', 'gida', 'Gıda', '🍎'),
  ('video', 'saglik', 'Sağlık', '🏥'),
  ('video', 'kisisel', 'Kişisel', '💭'),
  ('video', 'genel', 'Genel', '📝');
```

### Kategori Seçimi

**İçerik Bazlı Kategorileme:**

- ✅ Kitabın/videonun **konusuna** göre
- ❌ Platform (youtube, podcast) bazlı DEĞİL
- ❌ Tür (science, fiction) bazlı DEĞİL

**Örnekler:**

```
"Omega-3 beyin sağlığı için önemli" → saglik
"Akdeniz diyeti en sağlıklısı" → gida
"1% better every day" - Atomic Habits → kisisel
"Yapay zeka geleceği şekillendirecek" → genel
```

### Migration (v2.x → v3.0.0)

**Eski Kategoriler:**

- Quote: 5 kategori (kisisel, saglik, gida, **seyahat**, genel)
- Book: 5 kategori (**science**, **selfhelp**, **biography**, **fiction**, **health**)
- Video: 4 kategori (**youtube**, **documentary**, **course**, **podcast**)
- Link: 3 kategori (**teknik**, **icerik**, **diger**)

**Migration Mapping:**

```javascript
// Direkt mapping
quote.gida → gida
quote.saglik → saglik
quote.kisisel → kisisel
quote.genel → genel
quote.seyahat → AI (kisisel veya genel)

book.health → saglik
book.selfhelp → kisisel
book.science → AI (genel veya saglik)
book.biography → AI (kisisel veya genel)
book.fiction → AI (genel)

video.* → AI (içeriğe göre)

link.* → NULL
```

**Migration Script:** `scripts/migrate-categories.js`

Detaylar için: [MIGRATION.md](./MIGRATION.md)

---

## Listeler Sistemi

### Sayfa Yapısı

- `/listeler` - Ana sayfa (3 kategori kartı + istatistikler)
- `/listeler/kitap` - Kitap listesi
- `/listeler/film` - Film/dizi listesi
- `/listeler/urun` - Ürün listesi

**ISR:** Her sayfa 60 saniye cache'lenir (`export const revalidate = 60`)

### Checkbox Mantığı

**Tamamlandı Checkbox:**

- Her zaman tıklanabilir
- Toggle edilir (true ↔ false)
- False yapılırsa → `is_liked` otomatik false olur

**Beğendim (Heart) Button:**

- Sadece `is_completed = true` iken aktif
- `is_completed = false` ise disabled (gri)
- Toggle edilir (true ↔ false)

**Frontend State Yönetimi:**

```javascript
const toggleCheckbox = async (field) => {
  const response = await fetch(`/api/listeler/${item.id}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify({ field }),
  })

  const data = await response.json()

  // State güncelleme
  setIsCompleted(data.item.is_completed)
  setIsLiked(data.item.is_liked)
}
```

### Database Fonksiyonları

**getCacheItems(type, status)**

```javascript
// Tüm kitapları getir
await getCacheItems('kitap')

// Sadece tamamlananları
await getCacheItems('kitap', 'completed')

// Sadece bekleyenleri
await getCacheItems('kitap', 'pending')

// Sadece beğenilenleri
await getCacheItems('kitap', 'liked')
```

**createCacheItem(data)**

```javascript
await createCacheItem({
  name: 'Zero to One',
  cache_type: 'kitap',
  author: 'Peter Thiel', // AI bulur
  description: 'Startup ve...', // AI üretir (3-4 satır Türkçe)
})
```

**toggleCacheCheckbox(id, field)**

```javascript
// Tamamlandı toggle
await toggleCacheCheckbox(123, 'is_completed')

// Beğendim toggle
await toggleCacheCheckbox(123, 'is_liked')
```

**getCacheStats()**

```javascript
const stats = await getCacheStats()
// {
//   kitap: { total: 10, completed: 5, liked: 3 },
//   film: { total: 8, completed: 4, liked: 2 },
//   urun: { total: 6, completed: 3, liked: 1 }
// }
```

---

## Telegram Entegrasyonu

### Webhook URL

**Production:**

```
https://mehmettemel.com/api/telegram/webhook
```

### Kurulum

**1. Bot Token Al**

```bash
# @BotFather'dan bot oluştur
/newbot
Bot name: Mehmet Blog Bot
Username: mehmetblog_bot

# Token'ı kaydet
Token: 1234567890:ABCdefGHI...
```

**2. User ID Öğren**

```bash
# @userinfobot'a mesaj gönder
Your user ID: 123456789
```

**3. Environment Variables**

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHI...
TELEGRAM_ALLOWED_USER_IDS=123456789,987654321
GEMINI_API_KEY=...
DATABASE_URL=...
```

**4. Webhook Ayarla**

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://mehmettemel.com/api/telegram/webhook"

# Webhook kontrolü
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

### Komut Parse Mantığı (v4.0.0)

**parseMessage(text)** → `{ type, category: null, content }`

**ULTRA-SHORT COMMANDS (2 karakter!):**

```javascript
// Listeler komutları
'/k '     → 'cache-kitap'
'/f '     → 'cache-film'
'/u '     → 'cache-urun'
'/tarif ' → 'tarif'

// Keşifler komutları (ULTRA-SHORT)
'>ki '    → type='book',  category=null (AI belirler)
'>vi '    → type='video', category=null (AI belirler)
'>al '    → type='quote', category=null (AI belirler)
'>li '    → type='link',  category=null (linkler kategorisiz)

// Otomatik URL algılama (backward compatibility)
isURL(text) → type='link', category=null

// ÖNEMLİ: Manuel kategori override KALDIRILDI
// Eski sistem: /ag /as /ak /bg /bs /bk /vg /vs /vk → SİLİNDİ
// Yeni sistem: AI %100 kategori belirler
```

**Örnek Parse:**

```javascript
'>ki Atomic Habits notları...'
→ { type: 'book', category: null, content: 'Atomic Habits notları...' }
→ AI analiz eder → category: 'kisisel'

'>al Sauna 4x per week...'
→ { type: 'quote', category: null, content: 'Sauna 4x per week...' }
→ AI analiz eder → category: 'saglik'

'>li https://waitbutwhy.com'
→ { type: 'link', category: null, content: 'https://waitbutwhy.com' }
→ category=null (linkler kategorisiz)
```

### User Authentication

```javascript
const ALLOWED_USER_IDS = process.env.TELEGRAM_ALLOWED_USER_IDS.split(',').map(
  (id) => parseInt(id.trim()),
)

// Her mesajda kontrol
if (!ALLOWED_USER_IDS.includes(message.from.id)) {
  return NextResponse.json({ ok: true }, { status: 200 })
  // Sessizce reddet (kullanıcıya mesaj gönderme)
}
```

---

## AI Kategorilendirme

**Dosya:** `/src/lib/gemini.js`

### callGemini(prompt, retries, delay)

**Retry Logic:**

- Toplam 3 deneme
- Exponential backoff: 2s, 4s, 6s
- Retry durumları:
  - `503` Service overloaded
  - `429` Resource exhausted
  - Network errors

```javascript
const response = await callGemini(prompt, 3, 2000)
// Direkt text döner (JSON parse gerekebilir)
```

### handleCacheItemWithAI(type, text)

**Input:**

```javascript
handleCacheItemWithAI('kitap', 'zero to one')
```

**AI Prompt:**

```
Find information about this book: "zero to one"

Find the author and a short description of this book.

Return ONLY a JSON object:
{
  "name": "full correct name",
  "author": "author name",
  "description": "3-4 lines in Turkish"
}
```

**Output:**

```javascript
{
  name: 'Zero to One',
  author: 'Peter Thiel',
  description: 'Startup ve yenilik üzerine...',
  cache_type: 'kitap'
}
```

### handleLink(url)

AI ile başlık, açıklama, kategori çıkarır.

### handleNote(text)

Alıntı/not kategorize eder, yazar/kaynak ayıklar.

### handleVideo(text) / handleBook(text)

Çoklu not desteği. Numaralı liste parse eder:

```
1. Video Title - Note
2. Another Title - Another Note
```

Array döner.

---

## API Referansı

### GET /api/telegram/webhook

Health check ve version kontrolü.

**Response:**

```json
{
  "status": "ok",
  "version": "4.0.0",
  "botConfigured": true,
  "userFilterEnabled": true,
  "allowedUsers": 1,
  "commandsParsed": ["/k", "/f", "/u", "/tarif", ">ki", ">vi", ">al", ">li"]
}
```

---

### POST /api/telegram/webhook

Telegram mesajlarını işler.

**Request:** Telegram webhook format

**Response:**

```json
{
  "ok": true,
  "noteId": 123 // veya cacheId
}
```

---

### PATCH /api/listeler/[id]/toggle

Checkbox durumunu değiştirir.

**Request:**

```json
{
  "field": "is_completed" // veya "is_liked"
}
```

**Response:**

```json
{
  "success": true,
  "item": {
    "id": 123,
    "name": "Zero to One",
    "cache_type": "kitap",
    "author": "Peter Thiel",
    "description": "...",
    "is_completed": true,
    "is_liked": false,
    "created_at": "2026-01-16T...",
    "updated_at": "2026-01-16T..."
  }
}
```

**Hatalar:**

```json
{
  "success": false,
  "error": "Cannot like an item that is not completed"
}
```

---

## Deployment

### Environment Variables (Vercel)

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ALLOWED_USER_IDS=...
GEMINI_API_KEY=...
DATABASE_URL=...
```

### Database Migrations

**İlk kurulum:**

```bash
# 1. Ana tablo
psql $DATABASE_URL -f scripts/create-cache-table.sql

# 2. Author field ekle
psql $DATABASE_URL -f scripts/add-author-to-cache.sql

# 3. Description field ekle
psql $DATABASE_URL -f scripts/add-description-to-cache.sql
```

**Node.js ile:**

```bash
node scripts/run-migration.js
```

### Vercel Deployment

```bash
# Deploy
vercel --prod

# Webhook güncelle
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://mehmettemel.com/api/telegram/webhook"

# Test
curl https://mehmettemel.com/api/telegram/webhook
```

---

## Troubleshooting

### Bot yanıt vermiyor

**1. Webhook kontrolü:**

```bash
curl https://mehmettemel.com/api/telegram/webhook
# Beklenen: {"status": "ok", "version": "2.0.1"}

curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
# url: "https://mehmettemel.com/api/telegram/webhook"
```

**2. User ID yetkili mi?**

```bash
# Vercel logs kontrol et
vercel logs --follow
# "[TELEGRAM WEBHOOK] User ID: 123456789"
```

**3. Environment variables?**

- Vercel Dashboard → Settings → Environment Variables
- `TELEGRAM_BOT_TOKEN` var mı?
- `TELEGRAM_ALLOWED_USER_IDS` doğru mu?

---

### Cache komutu keşiflere gidiyor

**Neden:** parseMessage() hatası

**Debug:**

```bash
# Vercel logs
vercel logs --follow

# Telegram'da /k test gönder
# Beklenen log:
[parseMessage] Matched: /k → cache-kitap
[AI Cache] Enriched cache item: {...}

# Yanlış log (BUG):
[parseMessage] No command found, defaulting to quote
```

**Çözüm:**

- `src/app/api/telegram/webhook/route.js` → `parseMessage()` kontrol et
- `/k ` (boşluklu) regex doğru çalışıyor mu?

---

### AI yazar/description bulmuyor

**Neden:** Gemini API hatası veya quota

**Debug:**

```bash
# Vercel logs
[AI Cache] Failed to enrich cache item: Gemini API error
```

**Çözüm:**

- Fallback çalışır, `author` ve `description` null olur
- Gemini API key kontrol et
- Quota kontrol et: https://ai.google.dev/

---

### Database constraint hatası

```
ERROR: new row violates check constraint "check_liked_requires_completed"
```

**Neden:** `is_liked = true` ama `is_completed = false`

**Çözüm:**

- Önce `is_completed` true yap
- Sonra `is_liked` true yap
- Frontend otomatik kontrol eder

---

### Checkbox toggle çalışmıyor

**Debug:**

```bash
# Browser console
fetch('/api/listeler/123/toggle', {
  method: 'PATCH',
  body: JSON.stringify({ field: 'is_completed' })
})
```

**Olası hata:**

- `field` parametresi yanlış (sadece `is_completed` veya `is_liked`)
- ID yanlış
- Database connection hatası

---

## Değişiklik Geçmişi

### v4.0.0 (24 Ocak 2026) - ULTRA-SHORT SYSTEM

**BÜYÜK DEĞİŞİKLİK:**

- ✅ **Ultra-short commands:** >ki, >vi, >al, >li (sadece 2 karakter!)
- ✅ **AI %100 kategori belirler** - Manuel kategori override tamamen kaldırıldı
- ✅ **16 komut → 4 komut** - Sistem büyük oranda basitleştirildi
- ✅ **SİLİNEN komutlar:** /ag, /as, /ak, /bg, /bs, /bk, /vg, /vs, /vk (9 komut)
- ✅ **SİLİNEN komutlar:** /l, /a, /v, /b (4 komut - ultra-short ile değiştirildi)
- ✅ **Parser simplification:** 150+ satır → 40 satır
- ✅ **Webhook route:** Kategori override logic tamamen kaldırıldı

**Komut Değişiklikleri:**

```
ESKİ (v3.0.0):
/l, /a, /v, /b + 9 kategori override komutu = 13 komut

YENİ (v4.0.0):
>li, >al, >vi, >ki = 4 komut (AI kategori)
```

---

### v3.0.0 (21 Ocak 2026)

- ✅ 4 yekpare kategori sistemi (gıda, sağlık, kişisel, genel)
- ✅ Kategori migration script
- ✅ valid_categories tablosu

### v2.2.0 (17 Ocak 2026)

- ✅ `/cache` route'u `/listeler` olarak yeniden adlandırıldı
- ✅ Tüm dokümantasyon güncellendi (cache → listeler)
- ✅ API endpoint'leri güncellendi (/api/listeler)

### v2.1.0 (16 Ocak 2026)

- ✅ Esnek not formatlaması (tırnak içi çoklu not)
- ✅ "-" ile kaynak/yazar ayrıştırma
- ✅ handleNote artık array döndürüyor

### v2.0.1 (16 Ocak 2026)

- ✅ Description field eklendi (AI-generated Türkçe 3-4 satır)
- ✅ Dokümantasyon temizlendi (6 dosya → 3 dosya)
- ✅ COMMANDS.md description örnekleri eklendi

### v2.0.0 (15 Ocak 2026)

- ✅ Kısa komutlar: /k, /f, /u, /l, /a, /v, /b
- ✅ AI ile otomatik author bulma
- ✅ Direkt Vercel webhook
- ✅ SQL syntax Neon'a uyumlu

### v1.0.0 (Önceki)

- ❌ Uzun komutlar
- ❌ Google Apps Script kullanımı
- ❌ Manuel author girişi

---

**Versiyon:** v4.0.0 - Ultra-Short System
**Son Güncelleme:** 24 Ocak 2026
