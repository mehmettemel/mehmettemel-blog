# 📚 Dokümantasyon

Kişisel web sitesi - Telegram bot entegrasyonu, listeler sistemi, ve keşifler notu sistemi.

## Hızlı Başlangıç

### Telegram Botunu Kullan

**[COMMANDS.md](./COMMANDS.md)** - Tüm Telegram komutları ve örnekler

```bash
# LISTELER (AI zenginleştirme)
/k zero to one          # Kitap ekle (AI yazar bulur)
/f inception            # Film ekle (AI yönetmen bulur)
/tarif Tavuk Sote...    # Tarif ekle (AI parse edip formatlar)

# KEŞİFLER (Ultra-short commands - AI otomatik kategori)
>ki Atomic Habits notları...  # Kitap notu (AI: kişisel)
>vi Huberman Lab...           # Video notu (AI: sağlık)
>al Sauna 4x per week...      # Alıntı (AI: sağlık)
>li https://example.com       # Link (kategorisiz)
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
- Ultra-short commands (2 karakter!): `>ki >vi >al >li`
- Listeler: `/k /f /tarif`
- Diğer: `/help /stats`
- AI %100 otomatik kategori (manuel kategori YOK)
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

## 🆕 v4.0.0 - Ultra-Short System (24 Ocak 2026)

### BÜYÜK DEĞİŞİKLİK: AI %100 Otomatik Kategorilendirme

**16 komut → 4 komut!** Sadece 2 karakter ile ultra hızlı not ekleme.

### Ultra-Short Commands

```bash
>ki [metin]  # 📖 Kitap notları (AI kategoriyi bulur)
>vi [metin]  # 🎬 Video/Podcast notları (AI kategoriyi bulur)
>al [metin]  # 💭 Alıntılar (AI kategoriyi bulur)
>li [url]    # 🔗 Linkler (kategorisiz)
```

### 4 Otomatik Kategori

AI içeriği analiz edip otomatik kategoriyi belirler:

- 🍎 **Gıda** - Yemek, beslenme, tarif
- 🏥 **Sağlık** - Fitness, wellness, mental sağlık
- 💭 **Kişisel** - Motivasyon, üretkenlik, gelişim
- 📝 **Genel** - Diğer tüm konular

**Linkler:** Kategorisiz (category = NULL)

### Örnekler

```bash
>ki Focus is the key to mastery - Atomic Habits
→ AI analiz eder → type=book, category=kisisel, author=James Clear

>vi Sauna 4x per week at 175 degrees = 40% decrease in mortality - Huberman Lab
→ AI analiz eder → type=video, category=saglik, speaker=Andrew Huberman

>al Akdeniz diyeti en sağlıklısı
→ AI analiz eder → type=quote, category=gida

>li https://waitbutwhy.com
→ type=link, category=null (AI başlık/açıklama bulur)
```

### Değişiklikler

- ✅ **SİLİNDİ:** Manuel kategori komutları (/ag, /as, /ak, /bg, /bs, /bk, /vg, /vs, /vk)
- ✅ **SİLİNDİ:** Eski komutlar (/l, /a, /v, /b)
- ✅ **YENİ:** Ultra-short commands (>ki, >vi, >al, >li)
- ✅ **AI %100 otomatik** - Manuel kategori override YOK
- ✅ **Parser simplification:** 150+ satır → 40 satır
- ✅ **Sıfır kategori hatası** - AI güvenilir şekilde kategoriler
- ✅ **Hatırlama kolay** - >kitap, >video, >alıntı, >link

---

## Dosya Yapısı

```
docs/
├── README.md       # Bu dosya (giriş)
├── COMMANDS.md     # Telegram komutları (GÜNCELLENDİ v4.0.0 - Ultra-short)
├── SYSTEM.md       # Teknik detaylar (GÜNCELLENDİ v4.0.0 - AI %100)
├── MIGRATION.md    # v3.0.0 Migration rehberi
└── RUSSIAN.md      # Rusça döküm

src/
├── app/
│   ├── listeler/   # Listeler sayfaları
│   │   ├── kitap/
│   │   ├── film/
│   │   └── tarif/  # Tarifler sayfası (YENİ!)
│   ├── kesifler/   # Keşifler sayfası
│   └── api/
│       ├── telegram/webhook/    # Telegram webhook (v4.0.0 - Ultra-short)
│       └── listeler/[id]/toggle/  # Checkbox API
├── lib/
│   ├── db.js       # Database fonksiyonları (recipes CRUD)
│   └── gemini.js   # AI kategorilendirme (AI %100 otomatik)
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

---

## Geçmiş Sürümler

### v3.1.0 - Tarifler Sistemi (21 Ocak 2026)
- ✅ Tarifler eklendi (`/tarif` komutu)
- ✅ Gemini AI ile tarif parse
- ✅ Full screen modal UI

### v3.0.0 - Kategori Sistemi (21 Ocak 2026)
- ✅ 4 yekpare kategori sistemi
- ✅ Manuel kategori override komutları (/ag, /as, /ak, vs.) - **v4.0.0'da silindi**

---

**Versiyon:** v4.0.0 - Ultra-Short System
**Son Güncelleme:** 24 Ocak 2026
