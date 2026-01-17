# Telegram Bot Komutları

Telegram üzerinden hızlı not ekleme ve liste yönetimi.

---

## 📚 Listeler Komutları

AI otomatik olarak yazar/yönetmen/marka/description bulur ve ekler.

### `/k [isim]` - Kitap Ekle

```bash
/k zero to one
```

**AI bulur:**

- Yazar: Peter Thiel
- Description: Startup ve yenilik üzerine... (3-4 satır Türkçe)

**Gider:** `/listeler/kitap`

---

### `/f [isim]` - Film/Dizi Ekle

```bash
/f inception
/f american primeval
```

**AI bulur:**

- Yönetmen: Christopher Nolan
- Description: Film hakkında kısa açıklama... (3-4 satır Türkçe)

**Gider:** `/listeler/film`

---

### `/u [isim]` - Ürün Ekle

```bash
/u iphone 15 pro
/u sony wh-1000xm5
```

**AI bulur:**

- Marka: Apple
- Description: Ürün hakkında kısa açıklama... (3-4 satır Türkçe)

**Gider:** `/listeler/urun`

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

**Tek alıntı:**

```bash
/a Tutarlılık başarının anahtarıdır
```

**Uzun alıntı + kaynak (- ile):**

```bash
/a İnsanlar reformcu veya vizyoner olmanızı değil, onların "oyununa" uymanızı isterler.

Eğer bir şeyi değiştirmek istiyorsanız, mevcut kesişim noktasını bulup, onu yavaşça kaydırmanız gerekir.

Bir sistemi analiz ederken "söylenen amaçlara" değil, "oyuncuların çıkarlarına" bak.

- Professor Jiang
```

→ Tüm metin **tek bir alıntı** olarak kaydedilir
→ `author: "Professor Jiang"`

**Önemli:**

- Tüm metin olduğu gibi tek not olarak kaydedilir
- Metin parçalanmaz, orijinal format korunur
- "-" işaretinden sonraki metin yazar/kaynak olarak algılanır

**AI bulur:** Kategori (kisisel/saglik/gida/seyahat/genel), yazar, kaynak

**Gider:** `/kesifler`

---

### `/v [metin]` - Video Notu

**Tek not:**

```bash
/v Huberman Lab: 10-30 minutes morning sunlight
```

**Tek not + kaynak (- ile):**

```bash
/v "Focus is the key to mastery" - Huberman Lab Sleep Toolkit
```

→ `notes: ["Focus is the key to mastery"], author: "Huberman", source: "Sleep Toolkit"`

**Çoklu not (tırnak içi, yan yana):**

```bash
/v "AI is the future" "Scaling is key" "Data matters" - Jensen Huang AI Interview
```

→ `notes: ["AI is the future", "Scaling is key", "Data matters"], author: "Jensen Huang", source: "AI Interview"`

**AI bulur:** Kategori (youtube/documentary/course/podcast), konuşmacı, kaynak

**Gider:** `/kesifler`

---

### `/b [metin]` - Kitap Notu

**Tek not:**

```bash
/b Focus is the key - Atomic Habits James Clear
```

→ `notes: ["Focus is the key"], source: "Atomic Habits", author: "James Clear"`

**Tek not + kaynak (- ile):**

```bash
/b "1% better every day" - Atomic Habits James Clear
```

→ `notes: ["1% better every day"], source: "Atomic Habits", author: "James Clear"`

**Çoklu not (tırnak içi, yan yana):**

```bash
/b "Small habits compound" "Identity change is key" - Atomic Habits James Clear
```

→ `notes: ["Small habits compound", "Identity change is key"], source: "Atomic Habits", author: "James Clear"`

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

| Komut | Tablo        | Sayfa             | AI Özelliği                    |
| ----- | ------------ | ----------------- | ------------------------------ |
| `/k`  | `list_items` | `/listeler/kitap` | Yazar + Description            |
| `/f`  | `list_items` | `/listeler/film`  | Yönetmen + Description         |
| `/u`  | `list_items` | `/listeler/urun`  | Marka + Description            |
| `/l`  | `notes`      | `/kesifler`       | Kategori + Başlık              |
| `/a`  | `notes`      | `/kesifler`       | Çoklu not + Kaynak + Yazar     |
| `/v`  | `notes`      | `/kesifler`       | Çoklu not + Kaynak + Konuşmacı |
| `/b`  | `notes`      | `/kesifler`       | Çoklu not + Kaynak + Yazar     |

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
4. **"-" = Kaynak** - Alıntılarda tire işaretinden sonra gelen metin yazar/kaynak olarak algılanır
5. **Alıntılar TEK not** - Tüm metin olduğu gibi tek alıntı olarak kaydedilir (parçalanmaz)
6. **Video/Kitap çoklu** - `/v` ve `/b` komutlarında `"..."` tırnak içi metinler ayrı notlar olarak kaydedilir
7. **Description otomatik** - Liste komutları için AI 3-4 satır Türkçe açıklama üretir

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

**Versiyon:** v2.2.0
**Son Güncelleme:** 17 Ocak 2026
