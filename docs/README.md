# 📚 Dokümantasyon

Kişisel web sitesi - Telegram bot entegrasyonu, listeler sistemi, ve keşifler notu sistemi.

## Hızlı Başlangıç

### Telegram Botunu Kullan

**[COMMANDS.md](./COMMANDS.md)** - Tüm Telegram komutları ve örnekler

```bash
/k zero to one          # Kitap ekle (AI yazar bulur)
/f inception            # Film ekle (AI yönetmen bulur)
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

- Kitap, film/dizi, ürün okuma/izleme listesi
- Checkbox ile tamamlama ve beğeni takibi
- AI ile otomatik yazar/yönetmen/marka bulma
- Description generation

**2. Keşifler** (`/kesifler`)

- Link, alıntı, video, kitap notları
- AI ile otomatik kategorizasyon
- Çoklu not desteği (video/kitap)

**3. Telegram Bot**

- Hızlı not ekleme
- 8 kısa komut: `/k /f /u /l /a /v /b /help`
- AI ile zenginleştirme
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

## Dosya Yapısı

```
docs/
├── README.md       # Bu dosya (giriş)
├── COMMANDS.md     # Telegram komutları
└── SYSTEM.md       # Teknik detaylar

src/
├── app/
│   ├── listeler/   # Listeler sayfaları
│   ├── kesifler/   # Keşifler sayfası
│   └── api/
│       ├── telegram/webhook/    # Telegram webhook
│       └── listeler/[id]/toggle/  # Checkbox API
├── lib/
│   ├── db.js       # Database fonksiyonları
│   └── gemini.js   # AI kategorilendirme
└── components/
    └── cache/      # Liste UI bileşenleri

scripts/
├── create-cache-table.sql
├── add-description-to-cache.sql
└── add-author-to-cache.sql
```

---

## Quick Debug

```bash
# Webhook kontrolü
curl https://mehmettemel.com/api/telegram/webhook

# Vercel logs
vercel logs

# Database migration
node scripts/run-migration.js
```

---

**Versiyon:** v2.2.0
**Son Güncelleme:** 17 Ocak 2026
