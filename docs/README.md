# Keşifler Sistemi

Telegram bot ile not toplama ve lokal data yönetimi.

## 🚀 Hızlı Başlangıç

### 1. Environment Variables

```bash
# .env.local
GEMINI_API_KEY=xxx  # AI kategorilendirme için
```

### 2. Development

```bash
npm run dev
# http://localhost:3000/kesifler
```

## 📁 Veri Yönetimi

Tüm veriler `src/data/kesifler.js` dosyasında saklanır:

```javascript
// Linkler
export const links = [{ id: 1, title: '...', url: '...', category: 'website' }]

// Alıntılar
export const quotes = [{ id: 1, text: '...', author: '...', category: 'genel' }]

// Video Notları
export const videoNotes = []

// Kitap Notları
export const bookNotes = []
```

## 📝 Telegram Komutları

```
/link https://example.com    # Link ekle
/alinti Alıntı metni         # Alıntı ekle
/video Video notu            # Video notu ekle
/kitap Kitap notu            # Kitap notu ekle
```

## 🗄️ Veri Tipleri

| Tip   | Açıklama         |
| ----- | ---------------- |
| link  | Dış bağlantılar  |
| quote | Alıntılar/sözler |
| video | Video notları    |
| book  | Kitap notları    |

## 📁 Proje Yapısı

```
src/
├── data/
│   └── kesifler.js          # Tüm veriler
├── app/
│   ├── api/kesifler/add/    # Telegram bot endpoint
│   └── kesifler/page.jsx    # Sayfa bileşeni
└── components/kesifler/     # UI bileşenleri
```

## 🐛 Sorun Giderme

| Sorun          | Çözüm                     |
| -------------- | ------------------------- |
| API hatası     | GEMINI_API_KEY kontrol et |
| Bot çalışmıyor | Vercel deploy kontrolü    |
