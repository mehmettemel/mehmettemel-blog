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

### 🍎 4 Yekpare Kategori Sistemi

Tüm keşifler (alıntı, kitap, video) aynı 4 kategoriyi kullanır:

- 🍎 **Gıda** - Yemek, beslenme, tarif, mutfak
- 🏥 **Sağlık** - Fitness, bağışıklık, wellness, mental sağlık
- 💭 **Kişisel** - Motivasyon, üretkenlik, gelişim, alışkanlıklar
- 📝 **Genel** - Diğer tüm konular

---

### 📝 Alıntı Komutları (Kategori ile)

#### `/ag [metin]` - Alıntı (Gıda)
```bash
/ag Omega-3 beyin sağlığı için çok önemli
```

#### `/as [metin]` - Alıntı (Sağlık)
```bash
/as Günde 10.000 adım at
```

#### `/ak [metin]` - Alıntı (Kişisel)
```bash
/ak Tutarlılık başarının anahtarıdır
```

#### `/a [metin]` - Alıntı (Genel - Default)

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

**AI bulur:** Yazar, kaynak (kategori zaten belirtilmiş)

**Gider:** `/kesifler/alintilar`

---

### 📖 Kitap Notu Komutları (Kategori ile)

#### `/kg [metin]` - Kitap Notu (Gıda)
```bash
/kg "Akdeniz diyeti en sağlıklısı" - Michael Pollan
```

#### `/ks [metin]` - Kitap Notu (Sağlık)
```bash
/ks "Uyku her şeydir" - Why We Sleep
```

#### `/kk [metin]` - Kitap Notu (Kişisel)
```bash
/kk "Small habits compound" - Atomic Habits James Clear
```

#### `/b [metin]` - Kitap Notu (Genel - Default)
```bash
/b Focus is the key - Atomic Habits James Clear
```

**AI bulur:** Yazar, kaynak (kategori zaten belirtilmiş)

**Gider:** `/kesifler/kitaplar`

---

### 🎬 Video Notu Komutları (Kategori ile)

#### `/vg [metin]` - Video Notu (Gıda)
```bash
/vg "Fermente gıdalar probiyotik zengini" - Nutrition Video
```

#### `/vs [metin]` - Video Notu (Sağlık)
```bash
/vs "Sabah güneşi bağışıklığı güçlendirir" - Huberman Lab
```

#### `/vk [metin]` - Video Notu (Kişisel)
```bash
/vk "Focus is the key to mastery" - Cal Newport Interview
```

#### `/v [metin]` - Video Notu (Genel - Default)

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

**AI bulur:** Konuşmacı, kaynak (kategori zaten belirtilmiş)

**Gider:** `/kesifler/videolar`

---

### 🔗 Link Ekle (Kategori YOK)

#### `/l [url]` - Link Ekle

```bash
/l https://waitbutwhy.com
/l https://paulgraham.com/articles.html
```

**Önemli:** Linkler artık kategorilenmez, hepsi bir arada gösterilir.

**AI bulur:** Başlık, açıklama

**Gider:** `/kesifler/linkler`

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

### Listeler
| Komut | Tablo        | Sayfa             | AI Özelliği        |
| ----- | ------------ | ----------------- | ------------------ |
| `/k`  | `list_items` | `/listeler/kitap` | Yazar + Description|
| `/f`  | `list_items` | `/listeler/film`  | Yönetmen + Desc    |
| `/u`  | `list_items` | `/listeler/urun`  | Marka + Description|

### Keşifler (Kategori ile)
| Tip    | Gıda  | Sağlık | Kişisel | Genel | Tablo   | Sayfa              |
| ------ | ----- | ------ | ------- | ----- | ------- | ------------------ |
| Alıntı | `/ag` | `/as`  | `/ak`   | `/a`  | `notes` | `/kesifler/alintilar` |
| Kitap  | `/kg` | `/ks`  | `/kk`   | `/b`  | `notes` | `/kesifler/kitaplar`  |
| Video  | `/vg` | `/vs`  | `/vk`   | `/v`  | `notes` | `/kesifler/videolar`  |
| Link   | -     | -      | -       | `/l`  | `notes` | `/kesifler/linkler`   |

---

## 🔄 Legacy Komutlar

Eski komutlar hala çalışır (backward compatibility):

```bash
# Listeler
/cache-kitap → /k
/cache-film → /f
/cache-urun → /u

# Keşifler (genel kategoriye gider)
/link → /l (kategori yok)
/quote → /a (genel)
/alinti → /a (genel)
/video → /v (genel)
/book → /b (genel)
```

---

## 💡 İpuçları

1. **Boşluk önemli** - `/k zero` ✅ `/kzero` ❌
2. **Kategori harfi ekle** - `/ag` (gıda), `/as` (sağlık), `/ak` (kişisel), `/a` (genel)
3. **Komut sırası kritik** - `/kg` → kitap+gıda, `/k` → liste-kitap
4. **URL otomatik** - Direkt URL gönder, otomatik `/l` olarak algılanır
5. **"-" = Kaynak** - Alıntılarda tire işaretinden sonra gelen metin yazar/kaynak olarak algılanır
6. **Alıntılar TEK not** - Tüm metin olduğu gibi tek alıntı olarak kaydedilir (parçalanmaz)
7. **Video/Kitap çoklu** - `/v` ve `/b` komutlarında `"..."` tırnak içi metinler ayrı notlar olarak kaydedilir
8. **Description otomatik** - Liste komutları için AI 3-4 satır Türkçe açıklama üretir
9. **Linkler kategorisiz** - Artık teknik/içerik/diğer kategorileri yok, hepsi bir arada

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

---

## 🔄 Kategori Sistemi Değişikliği (v3.0.0)

### 21 Ocak 2026 - Büyük Güncelleme

**Eski Sistem (v2.x):**
- Alıntılar: 5 kategori (kişisel, sağlık, gıda, seyahat, genel)
- Kitaplar: 5 kategori (science, selfhelp, biography, fiction, health)
- Videolar: 4 kategori (youtube, documentary, course, podcast)
- Linkler: 3 kategori (teknik, içerik, diğer)

**Yeni Sistem (v3.0.0):**
- ✅ **4 Yekpare Kategori** - Gıda, Sağlık, Kişisel, Genel
- ✅ **Tek Kategori Sistemi** - Alıntı, kitap, video hepsi aynı kategorileri kullanır
- ✅ **Kategori Komutları** - `/ag`, `/as`, `/ak`, `/kg`, `/vg` gibi
- ✅ **Linkler Kategorisiz** - Artık tüm linkler bir arada
- ✅ **İçerik Bazlı** - Platform değil, içeriğe göre kategorileme

**Migration:**
- Mevcut veriler AI ile otomatik migrate edildi
- Eski kategoriler `old_category` kolonunda saklandı
- Rollback desteği mevcut

---

**Versiyon:** v3.0.0
**Son Güncelleme:** 21 Ocak 2026
