# Geist Font Setup

Site **Geist Sans** ve **Geist Mono** fontlarını kullanmaktadır.

## Kurulum

```bash
npm install geist
```

## Kullanım

`src/app/layout.jsx` dosyasında:

```jsx
import { GeistMono } from 'geist/font/mono'

<body className={cn('min-h-screen bg-background', GeistMono.className)}>
```

## Sorun Giderme

Font yüklenmezse:

1. Next.js cache temizle:

```bash
rm -rf .next
```

2. Tarayıcıyı hard refresh yap:
   - Mac: `Cmd + Shift + R`
   - Windows/Linux: `Ctrl + Shift + F5`

## Referanslar

- [Vercel Geist Font](https://github.com/vercel/geist-font)
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
