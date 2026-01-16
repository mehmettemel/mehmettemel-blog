# Telegram Bot Komutları

Telegram üzerinden hızlı not ekleme ve cache yönetimi.

---

## 📚 Cache Komutları

AI otomatik olarak yazar/yönetmen/marka/description bulur ve ekler.

### `/k [isim]` - Kitap Ekle

```bash
/k zero to one
```
**AI bulur:**
- Yazar: Peter Thiel
- Description: Startup ve yenilik üzerine... (3-4 satır Türkçe)

**Gider:** `/cache/kitap`

---

### `/f [isim]` - Film/Dizi Ekle

```bash
/f inception
/f american primeval
```
**AI bulur:**
- Yönetmen: Christopher Nolan
- Description: Film hakkında kısa açıklama... (3-4 satır Türkçe)

**Gider:** `/cache/film`

---

### `/u [isim]` - Ürün Ekle

```bash
/u iphone 15 pro
/u sony wh-1000xm5
```
**AI bulur:**
- Marka: Apple
- Description: Ürün hakkında kısa açıklama... (3-4 satır Türkçe)

**Gider:** `/cache/urun`

---

## 📝 Keşifler Komutları

AI ile kategorize edilir ve `notes` tablosuna eklenir.

### `/l [url]` - Link Ekle

```bash
/l https://waitbutwhy.com
/l https://paulgraham.com/articles.html
```
**AI bulur:** Başlık, açıklama, kategori (teknik/icerik/diger)

**Gider:** `/kesifler`

---

### `/a [metin]` - Alıntı Ekle

```bash
/a Tutarlılık başarının anahtarıdır
/a The dose makes the poison - Paracelsus
```
**AI bulur:** Kategori (kisisel/saglik/gida/seyahat/genel), yazar (varsa)

**Gider:** `/kesifler`

---

### `/v [metin]` - Video Notu

**Tek not:**
```bash
/v Huberman Lab: 10-30 minutes morning sunlight improves sleep
```

**Çoklu not:**
```bash
/v
1. Huberman Lab: Sleep Toolkit - Morning sunlight
2. Veritasium: Science of Thinking - Cognitive biases
3. Lex Fridman: AI Podcast - GPT architecture
```

**AI bulur:** Kategori (youtube/documentary/course/podcast), kaynak

**Gider:** `/kesifler`

---

### `/b [metin]` - Kitap Notu

**Tek not:**
```bash
/b Atomic Habits by James Clear - 1% better every day
```

**Çoklu not:**
```bash
/b
1. Atomic Habits - James Clear - Small habits compound
2. Deep Work - Cal Newport - Focus enables mastery
3. The Power of Now - Eckhart Tolle - Present moment awareness
```

**AI bulur:** Kategori (science/selfhelp/biography/fiction/health), yazar, kaynak

**Gider:** `/kesifler`

---

## 📊 Diğer Komutlar

### `/stats` - İstatistikler

```bash
/stats
```
**Gösterir:**
- Toplam not sayısı (link, alıntı, video, kitap)
- Cache istatistikleri (kitap, film, ürün)

---

### `/help` - Yardım

```bash
/help
```
**Gösterir:**
- Tüm komutlar
- Örnekler
- İpuçları

---

## 🎯 Komut Karşılaştırma

| Komut | Tablo | Sayfa | AI Özelliği |
|-------|-------|-------|-------------|
| `/k` | `cache_items` | `/cache/kitap` | Yazar + Description |
| `/f` | `cache_items` | `/cache/film` | Yönetmen + Description |
| `/u` | `cache_items` | `/cache/urun` | Marka + Description |
| `/l` | `notes` | `/kesifler` | Kategori |
| `/a` | `notes` | `/kesifler` | Kategori + Yazar |
| `/v` | `notes` | `/kesifler` | Kategori + Kaynak |
| `/b` | `notes` | `/kesifler` | Kategori + Yazar + Kaynak |

---

## 🔄 Legacy Komutlar

Eski komutlar hala çalışır (backward compatibility):

```bash
/cache-kitap → /k
/cache-film → /f
/cache-urun → /u
/link → /l
/quote → /a
/alinti → /a
/video → /v
/kitap → /b
```

---

## 💡 İpuçları

1. **Boşluk önemli** - `/k zero` ✅ `/kzero` ❌
2. **Küçük harf OK** - Büyük/küçük harf önemli değil
3. **URL otomatik** - Direkt URL gönder, otomatik `/l` olarak algılanır
4. **Çoklu not** - Video/kitap notları numaralı liste ile eklenebilir
5. **Description otomatik** - Cache komutları için AI 3-4 satır Türkçe açıklama üretir

---

## ⚠️ Yaygın Hatalar

### "Bot yanıt vermiyor"
**Çözüm:**
```bash
curl https://mehmettemel.com/api/telegram/webhook
```
`"version": "2.0.1"` görmeli.

### "Cache komutu keşiflere gidiyor"
**Neden:** parseMessage() hatası
**Çözüm:** Vercel logs kontrol et, `/k` → `cache-kitap` parse olmalı

### "AI yazar/description bulmuyor"
**Neden:** Gemini API hatası
**Çözüm:** Fallback çalışır, null olarak kaydedilir

---

## 🐛 Debug

### Vercel Logs
```bash
vercel logs --follow
```

### Test Komutu
```bash
/k zero to one
```

**Beklenen log:**
```
[parseMessage] Matched: /k → cache-kitap
[AI Cache] Enriched: { name: "Zero to One", author: "Peter Thiel", description: "..." }
[DB] Cache item created: ID 123
```

---

**Versiyon:** v2.0.1
**Son Güncelleme:** 16 Ocak 2026
