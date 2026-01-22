# 📚 Dokümantasyon

Kişisel web sitesi - Telegram bot entegrasyonu, listeler sistemi, ve keşifler notu sistemi.

## Hızlı Başlangıç

### Telegram Botunu Kullan

**[COMMANDS.md](./COMMANDS.md)** - Tüm Telegram komutları ve örnekler

```bash
/k zero to one          # Kitap ekle (AI yazar bulur)
/f inception            # Film ekle (AI yönetmen bulur)
/tarif Tavuk Sote...    # Tarif ekle (AI parse edip formatlar)
/l https://example.com  # Link ekle
/a güzel bir alıntı     # Alıntı ekle
```

### Sistem Detayları

**[SYSTEM.md](./SYSTEM.md)** - Sistem mimarisi, database, API'ler

- Listeler sistemi nasıl çalışır
- Telegram webhook kurulumu
- Database şemaları
- AI kategorilendirme

---

## Sistem Özeti

### 3 Ana Modül

**1. Listeler Sistemi** (`/listeler/*`)

- Kitap, film/dizi, tarifler listesi
- Checkbox ile tamamlama ve beğeni takibi (kitap/film)
- AI ile otomatik yazar/yönetmen bulma
- Tarifler için tam AI parse ve formatla (malzemeler, yapılış, süreler, vs.)
- Description generation

**2. Keşifler** (`/kesifler`)

- Link, alıntı, video, kitap notları
- AI ile otomatik kategorizasyon
- Çoklu not desteği (video/kitap)

**3. Telegram Bot**

- Hızlı not ekleme
- 9 kısa komut: `/k /f /tarif /l /a /v /b /help /stats`
- AI ile zenginleştirme ve otomatik formatla
- User authentication

---

## Environment Variables

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ALLOWED_USER_IDS=...
GEMINI_API_KEY=...
DATABASE_URL=...
```

---

## 🆕 v3.0.0 - Büyük Güncelleme (21 Ocak 2026)

### Yeni Kategori Sistemi

**4 Yekpare Kategori** - Tüm keşifler artık aynı kategori sistemini kullanır:

- 🍎 **Gıda** - Yemek, beslenme, tarif
- 🏥 **Sağlık** - Fitness, wellness, mental sağlık
- 💭 **Kişisel** - Motivasyon, üretkenlik, gelişim
- 📝 **Genel** - Diğer tüm konular

### Yeni Telegram Komutları

**Kategori ile Not Ekleme:**

```bash
# Alıntılar
/ag [metin]  # Gıda
/as [metin]  # Sağlık
/ak [metin]  # Kişisel
/a [metin]   # AI kategoriler (otomatik)

# Kitap Notları
/bg [metin]  # Gıda
/bs [metin]  # Sağlık
/bk [metin]  # Kişisel
/b [metin]   # AI kategoriler (otomatik)

# Video Notları
/vg [metin]  # Gıda
/vs [metin]  # Sağlık
/vk [metin]  # Kişisel
/v [metin]   # AI kategoriler (otomatik)

# Linkler (kategorisiz)
/l [url]
```

**Not:** Kategori belirtilmezse (`/a`, `/b`, `/v`), AI içeriği analiz edip otomatik kategoriler.

### Değişiklikler

- ✅ Alıntı, kitap, video → aynı 4 kategori
- ✅ İçerik bazlı kategorileme (platform bazlı DEĞİL)
- ✅ Linkler kategorisiz
- ✅ AI ile otomatik migration
- ✅ Rollback desteği

**Detaylar:** [MIGRATION.md](./MIGRATION.md)

---

## Dosya Yapısı

```
docs/
├── README.md       # Bu dosya (giriş)
├── COMMANDS.md     # Telegram komutları (GÜNCELLENDİ v3.0.0)
├── SYSTEM.md       # Teknik detaylar (GÜNCELLENDİ v3.0.0)
├── MIGRATION.md    # v3.0.0 Migration rehberi (YENİ!)
└── RUSSIAN.md      # Rusça döküm

src/
├── app/
│   ├── listeler/   # Listeler sayfaları
│   │   ├── kitap/
│   │   ├── film/
│   │   └── tarif/  # Tarifler sayfası (YENİ!)
│   ├── kesifler/   # Keşifler sayfası
│   └── api/
│       ├── telegram/webhook/    # Telegram webhook (GÜNCELLENDİ)
│       └── listeler/[id]/toggle/  # Checkbox API
├── lib/
│   ├── db.js       # Database fonksiyonları (GÜNCELLENDİ - recipes CRUD)
│   └── gemini.js   # AI kategorilendirme (GÜNCELLENDİ - handleRecipe)
├── components/
│   ├── kesifler/   # Keşifler UI bileşenleri
│   └── recipes/    # Tarifler UI bileşenleri (YENİ!)
│       ├── RecipeCard.jsx
│       ├── RecipeModal.jsx
│       └── RecipeList.jsx
└── data/
    ├── kesifler.js # Kategori tanımları
    └── list.js     # Liste kategorileri (GÜNCELLENDİ - tarif eklendi)

scripts/
├── migrate-schema.sql      # v3.0.0 Schema migration
├── migrate-categories.js   # v3.0.0 Data migration
├── create-cache-table.sql
├── add-description-to-cache.sql
└── create-recipes-table.sql # Tarifler tablosu (YENİ!)
```

---

## Quick Debug

```bash
# Webhook kontrolü
curl https://mehmettemel.com/api/telegram/webhook

# Vercel logs
vercel logs --follow

# Database schema migration
psql $DATABASE_URL -f scripts/migrate-schema.sql

# Data migration (v3.0.0)
node scripts/migrate-categories.js --dry-run
node scripts/migrate-categories.js --execute
node scripts/migrate-categories.js --verify
```

---

## 🍳 v3.1.0 - Tarifler Sistemi Eklendi (21 Ocak 2026)

### Yeni Özellik: Tarifler

**Telegram ile Tarif Ekleme:**
```bash
/tarif
Tavuk Sote

Malzemeler:
- 500g tavuk göğsü
- 2 soğan
- 3 domates

Yapılışı:
1. Tavukları doğrayın
2. Soğanları kavurun
3. 20 dakika pişirin

15 dakika hazırlık, 30 dakika pişirme
```

**Gemini AI Özellikleri:**
- ✅ Tarif metnini analiz eder
- ✅ Malzemeleri düzenli formata çevirir
- ✅ Yapılış adımlarını numaralandırır

**UI Özellikleri:**
- Full screen modal ile tarif görüntüleme
- Basit ve temiz tasarım
- Mobil responsive
- Dark mode desteği

**Database:**
- Yeni `recipes` tablosu
- Basit yapı: name, ingredients, instructions

**Sayfa:** `/listeler/tarif`

---

**Versiyon:** v3.1.0
**Son Güncelleme:** 21 Ocak 2026
