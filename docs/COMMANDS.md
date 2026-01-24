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
/u vitamix blender
```

**AI bulur:**
- Marka: Vitamix
- Description: Ürün açıklaması... (3-4 satır Türkçe)

**Gider:** `/listeler/urun`

---

### `/tarif [metin]` - Tarif Ekle

```bash
/tarif
Tavuk Sote

Malzemeler:
- 500g tavuk göğsü
- 2 soğan
- 3 domates
- Zeytinyağı

Yapılışı:
1. Tavukları küp şeklinde doğrayın
2. Soğanları kavurun
3. Tavukları ekleyin
4. 20 dakika pişirin

15 dakika hazırlık, 30 dakika pişirme, 4 kişilik
```

**AI bulur ve düzenler:**
- Tarif adı
- Malzemeler listesi (düzenli formatta)
- Yapılış adımları (numaralandırılmış)

**Gider:** `/listeler/tarif`

---

## 📝 Keşifler Komutları - ULTRA KISA SİSTEM

### ✨ Sadece 4 Komut (2 Karakter!)

AI otomatik kategori belirler: **Gıda 🍎 / Sağlık 🏥 / Kişisel 💭 / Genel 📝**

---

### `>ki [metin]` - Kitap Notları

📖 Kitap notları için. AI kategori, yazar, kaynak otomatik bulur.

**Tek not:**
```bash
>ki İki düşünce sistemi var: System 1 (hızlı, sezgisel) ve System 2 (yavaş, mantıksal). -Thinking Fast and Slow, Daniel Kahneman
```

**Çoklu not:**
```bash
>ki
"Focus is the key to mastery"
"Small habits compound over time"
"Environment shapes behavior"
-Atomic Habits, James Clear
```

**AI bulur:**
- Yazar: Daniel Kahneman / James Clear
- Kaynak: Thinking Fast and Slow / Atomic Habits
- Kategori: kisisel (AI otomatik)

**Gider:** `/kesifler/kitaplar`

---

### `>vi [metin]` - Video/Podcast Notları

🎬 Video ve podcast notları için. AI kategori, konuşmacı, kaynak otomatik bulur.

**Tek not:**
```bash
>vi Sabah güneş ışığı bağışıklığı güçlendirir - Huberman Lab
```

**Çoklu not:**
```bash
>vi
"AI is the future of computing"
"Scaling is the most important factor"
"Data quality beats quantity"
-Jensen Huang, NVIDIA AI Summit
```

**AI bulur:**
- Konuşmacı: Andrew Huberman / Jensen Huang
- Kaynak: Huberman Lab / NVIDIA AI Summit
- Kategori: saglik / genel (AI otomatik)

**Gider:** `/kesifler/videolar`

---

### `>al [metin]` - Alıntılar

💭 Alıntılar ve notlar için. AI kategori, yazar, kaynak otomatik bulur.

**Basit alıntı:**
```bash
>al Sauna 4x per week at 175 degrees = 40% decrease in mortality
```

**Alıntı + Kaynak:**
```bash
>al İnsanlar reformcu veya vizyoner olmanızı değil, onların "oyununa" uymanızı isterler. Bir sistemi analiz ederken "söylenen amaçlara" değil, "oyuncuların çıkarlarına" bak. -Professor Jiang
```

**AI bulur:**
- Yazar: Professor Jiang
- Kategori: kisisel / saglik (AI otomatik, içeriğe göre)

**Gider:** `/kesifler/alintilar`

---

### `>li [url]` - Link Ekle

🔗 Web linkleri için. AI başlık ve açıklama bulur. **Kategori yok.**

```bash
>li https://waitbutwhy.com
>li https://paulgraham.com/articles.html
```

**AI bulur:**
- Başlık
- Açıklama

**Gider:** `/kesifler/linkler`

---

## 💡 AI Otomatik Kategoriler

Tüm keşifler (kitap, video, alıntı) aynı 4 kategoriyi kullanır:

| Kategori | Icon | Açıklama                                        |
| -------- | ---- | ----------------------------------------------- |
| 🍎 Gıda   | 🍎   | Yemek, beslenme, tarif, mutfak                  |
| 🏥 Sağlık | 🏥   | Fitness, bağışıklık, wellness, mental sağlık    |
| 💭 Kişisel| 💭   | Motivasyon, üretkenlik, gelişim, alışkanlıklar  |
| 📝 Genel  | 📝   | Diğer tüm konular                               |

**Örnekler:**
```
"Omega-3 beyin sağlığı için önemli" → saglik
"Akdeniz diyeti en sağlıklısı" → gida
"1% better every day - Atomic Habits" → kisisel
"Yapay zeka geleceği şekillendirecek" → genel
```

---

## 📊 Diğer Komutlar

### `/stats` - İstatistikler

```bash
/stats
```

**Gösterir:**
- Toplam not sayısı (link, alıntı, video, kitap)

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

## 🎯 Komut Özeti

### Listeler
| Komut    | Açıklama           | AI Özelliği            |
| -------- | ------------------ | ---------------------- |
| `/k`     | Kitap ekle         | Yazar + Description    |
| `/f`     | Film/Dizi ekle     | Yönetmen + Description |
| `/u`     | Ürün ekle          | Marka + Description    |
| `/tarif` | Tarif ekle         | Malzemeler + Yapılış   |

### Keşifler (Ultra-Short + AI Kategori)
| Komut | Tip     | AI Kategoriler                | Sayfa                  |
| ----- | ------- | ----------------------------- | ---------------------- |
| `>ki` | Kitap   | gıda/sağlık/kişisel/genel 🤖  | `/kesifler/kitaplar`   |
| `>vi` | Video   | gıda/sağlık/kişisel/genel 🤖  | `/kesifler/videolar`   |
| `>al` | Alıntı  | gıda/sağlık/kişisel/genel 🤖  | `/kesifler/alintilar`  |
| `>li` | Link    | kategori yok                  | `/kesifler/linkler`    |

---

## 💡 İpuçları

1. **Ultra hızlı** - Sadece 2 karakter: `>ki`, `>vi`, `>al`, `>li`
2. **AI her şeyi halleder** - Kategori, yazar, kaynak otomatik bulunur
3. **Hatırlama kolay** - >kitap, >video, >alıntı, >link
4. **"-" = Kaynak** - Tire işaretinden sonra gelen metin yazar/kaynak olarak algılanır
5. **Tek metin** - Tüm metin olduğu gibi kaydedilir, parçalanmaz
6. **Çoklu not** - `"..."` tırnak içi metinler ayrı notlar (video/kitap)
7. **URL otomatik** - Direkt URL gönder, otomatik link olarak algılanır
8. **Sıfır kategori hatası** - Manuel kategori yok, AI %95+ doğru

---

## ⚠️ Yaygın Hatalar

### "Bot yanıt vermiyor"

**Çözüm:**
```bash
curl https://mehmettemel.com/api/telegram/webhook
```

`"status": "ok"` görmeli.

### "AI kategori yanlış buluyor"

**Neden:** İçerik belirsiz
**Çözüm:** Daha açıklayıcı metin ekle veya kategoriyi manuel düzelt (admin panel)

---

**Versiyon:** v4.0.0 - Ultra-Short Commands
**Son Güncelleme:** 24 Ocak 2026
