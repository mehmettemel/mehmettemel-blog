# Sistem Dokümantasyonu

Teknik detaylar, mimari, database şemaları, ve API referansı.

---

## İçindekiler

1. [Sistem Mimarisi](#sistem-mimarisi)
2. [Database Şemaları](#database-şemaları)
3. [Cache Sistemi](#cache-sistemi)
4. [Telegram Entegrasyonu](#telegram-entegrasyonu)
5. [AI Kategorilendirme](#ai-kategorilendirme)
6. [API Referansı](#api-referansı)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

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
│   CACHE      │ │ KEŞİFLER │ │    STATS     │
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
         │  - /cache/*             │
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

**Keşifler Ekleme (`/l`, `/a`, `/v`, `/b`):**
```
Telegram → parseMessage() → handleLink/Note/Video/Book()
  → Gemini API (kategori, kaynak)
  → createNote() → notes table
  → Telegram yanıt → /kesifler sayfası (ISR 60s)
```

---

## Database Şemaları

### cache_items

```sql
CREATE TABLE cache_items (
  id BIGSERIAL PRIMARY KEY,

  -- Temel alanlar
  name VARCHAR(500) NOT NULL,
  cache_type VARCHAR(20) NOT NULL
    CHECK (cache_type IN ('kitap', 'film', 'urun')),

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
  CONSTRAINT check_liked_requires_completed
    CHECK (is_liked = FALSE OR is_completed = TRUE)
);

-- İndeksler
CREATE INDEX idx_cache_type ON cache_items(cache_type);
CREATE INDEX idx_cache_completed ON cache_items(is_completed);
CREATE INDEX idx_cache_created_at ON cache_items(created_at DESC);
```

**Önemli Kısıtlamalar:**
- `is_liked = true` → `is_completed` mutlaka `true` olmalı
- `is_completed` false yapılırsa → `is_liked` otomatik false olur

**Migrations:**
- `scripts/create-cache-table.sql` - İlk tablo oluşturma
- `scripts/add-author-to-cache.sql` - Author field ekleme
- `scripts/add-description-to-cache.sql` - Description field ekleme

---

### notes

```sql
CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,

  -- Not tipi
  note_type VARCHAR(20) NOT NULL
    CHECK (note_type IN ('link', 'quote', 'video', 'book')),

  -- AI ile bulunan kategori
  category VARCHAR(50) NOT NULL,

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

  -- Migration flag
  is_migrated BOOLEAN DEFAULT FALSE
);

-- İndeksler
CREATE INDEX idx_notes_type ON notes(note_type);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_type_category ON notes(note_type, category);
```

**Kategoriler:**

**Link:**
- `teknik` - Yazılım, programlama, developer tools
- `icerik` - Blog, makale, tutorial
- `diger` - Diğer

**Quote:**
- `kisisel` - Kişisel gelişim, motivasyon
- `saglik` - Sağlık, fitness, mental sağlık
- `gida` - Yemek, beslenme
- `seyahat` - Gezi, tatil
- `genel` - Diğer

**Video:**
- `youtube` - YouTube videoları
- `documentary` - Belgeseller
- `course` - Kurslar, eğitimler
- `podcast` - Podcast'ler

**Book:**
- `science` - Bilim, araştırma
- `selfhelp` - Kişisel gelişim
- `biography` - Biyografi
- `fiction` - Kurgu
- `health` - Sağlık, fitness

---

## Cache Sistemi

### Sayfa Yapısı

- `/cache` - Ana sayfa (3 kategori kartı + istatistikler)
- `/cache/kitap` - Kitap listesi
- `/cache/film` - Film/dizi listesi
- `/cache/urun` - Ürün listesi

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
  const response = await fetch(`/api/cache/${item.id}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify({ field })
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
  author: 'Peter Thiel',          // AI bulur
  description: 'Startup ve...'    // AI üretir (3-4 satır Türkçe)
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

### Komut Parse Mantığı

**parseMessage(text)** → `{ type, content }`

```javascript
// Cache komutları (öncelik sırası önemli!)
'/k '  → 'cache-kitap'
'/f '  → 'cache-film'
'/u '  → 'cache-urun'

// Keşifler komutları
'/l '  → 'link'
'/a '  → 'quote'
'/v '  → 'video'
'/b '  → 'book'

// Legacy komutlar (backward compatibility)
'/cache-kitap ' → 'cache-kitap'
'/link ' → 'link'
'/quote ' → 'quote'
'/alinti ' → 'quote'

// Otomatik URL algılama
isURL(text) → 'link'

// Hiçbiri değilse
null → default: 'quote'
```

### User Authentication

```javascript
const ALLOWED_USER_IDS = process.env.TELEGRAM_ALLOWED_USER_IDS
  .split(',')
  .map(id => parseInt(id.trim()))

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
  "version": "2.0.1",
  "botConfigured": true,
  "userFilterEnabled": true,
  "allowedUsers": 1,
  "commandsParsed": ["/k", "/f", "/u", "/l", "/a", "/v", "/b"]
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
  "noteId": 123  // veya cacheId
}
```

---

### PATCH /api/cache/[id]/toggle

Checkbox durumunu değiştirir.

**Request:**
```json
{
  "field": "is_completed"  // veya "is_liked"
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
fetch('/api/cache/123/toggle', {
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

**Versiyon:** v2.0.1
**Son Güncelleme:** 16 Ocak 2026
