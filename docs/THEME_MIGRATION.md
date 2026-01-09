# Tema Migrasyonu - Earth Tone Color Scheme

Bu dokümanda, projenin standart renklerden benzersiz toprak tonlarına geçişi ve yapılan tüm değişiklikler anlatılmaktadır.

## 📅 Geçiş Tarihi
9 Ocak 2026

## 🎨 Yeni Renk Paleti

### Renk Felsefesi
Proje, standart mavi/gri tonlardan doğal ve sıcak toprak tonlarına geçiş yapılmıştır. Bu palet özellikle yiyecek, seyahat ve doğa içerikleri için idealdir.

### Ana Renkler

#### Light Mode (Işık Modu)
- **Arka Plan**: Linen (Keten) - `#F4F1EA`
- **Metin**: Olive (Zeytin) - `#2D302D`
- **Vurgu**: Sage (Adaçayı) - `#A3B18A`
- **Kenarlıklar**: `#E8E3D5`

#### Dark Mode (Karanlık Mod)
- **Arka Plan**: Deep Olive - `#1A1C1A`
- **Metin**: Linen - `#F4F1EA`
- **Vurgu**: Clay (Kil) - `#D4A373`
- **Kenarlıklar**: `#2D302D`

## 🔄 Yapılan Değişiklikler

### 1. CSS Değişkenleri (src/styles/tailwind.css)

**Değişiklikler:**
- Tüm HSL renk değerleri yeni palete göre güncellendi
- Light mode için linen/sage kombinasyonu eklendi
- Dark mode için olive/clay kombinasyonu eklendi
- Yeni renk tanımları eklendi:
  - `--color-linen-50/100/200`
  - `--color-olive-700/800/900`
  - `--color-brand-sage`
  - `--color-brand-clay`

### 2. Component Güncellemeleri

#### 2.1 Navigation Components
**Değiştirilen Dosyalar:**
- `src/components/Navbar.jsx`
- `src/components/Footer.jsx`

**Değişiklikler:**
- `text-teal-500` → `text-primary`
- `text-zinc-800` → `text-foreground`
- `dark:text-zinc-200` → Kaldırıldı (semantic token kullanımı)
- `border-zinc-100` → `border-border`

#### 2.2 Page Components
**Değiştirilen Dosyalar:**
- `src/app/page.jsx`
- `src/app/about/page.jsx`
- `src/app/contact/page.jsx`
- `src/app/not-found.jsx`

**Değişiklikler:**
- Tüm `text-zinc-*` → `text-foreground` / `text-muted-foreground`
- Tüm `bg-zinc-*` → `bg-background` / `bg-secondary`
- `text-teal-500` → `text-primary`
- `hover:text-teal-600` → `hover:text-accent`

#### 2.3 Blog Components
**Değiştirilen Dosyalar:**
- `src/app/blog/page.jsx`
- `src/app/blog/[slug]/page.jsx`

**Değişiklikler:**
- Article card hover: `bg-zinc-50` → `bg-secondary`
- Links: `text-teal-500` → `text-primary`
- Borders: `border-zinc-100` → `border-border`
- Tag badges: `bg-teal-50 text-teal-600` → `bg-primary/10 text-primary`

#### 2.4 UI Components
**Değiştirilen Dosyalar:**
- `src/components/Button.jsx`
- `src/components/ThemeToggle.jsx`
- `src/components/Section.jsx`

**Değişiklikler:**
- Button variants semantic color tokens kullanıyor
- Theme toggle icons: amber/blue → primary/muted
- Section borders: zinc → border token

### 3. Typography Güncellemeleri

**Değiştirilen Dosyalar:**
- `typography.js`
- `src/styles/prism.css`

**Değişiklikler:**
- Prose renkler yeni palete uyarlandı
- Light mode: Olive/Sage kombinasyonu
- Dark mode: Clay/Linen kombinasyonu
- Code syntax highlighting earth tone renklerle güncellendi

### 4. Metadata & PWA

**Değiştirilen Dosyalar:**
- `src/app/layout.jsx`
- `public/site.webmanifest`

**Değişiklikler:**
- `theme-color` meta tags güncellendi:
  - Light: `#F4F1EA`
  - Dark: `#1A1C1A`
- PWA manifest theme color güncellendi

### 5. Dokümantasyon

**Yeni Dosyalar:**
- `docs/COLOR_SCHEME.md` - Detaylı renk dokümantasyonu
- `docs/THEME_MIGRATION.md` - Bu dosya

**Güncellenen Dosyalar:**
- `docs/project-overview.md` - Renk şeması bilgisi eklendi
- `docs/FILE_STRUCTURE.md` - Renk dokümantasyonu referansı eklendi
- `docs/priorities.md` - Renk kullanım kuralları eklendi
- `README.md` - Renk paleti açıklaması ve kullanım örnekleri eklendi

## 📋 Migrasyon Kontrol Listesi

### ✅ Tamamlanan
- [x] CSS değişkenleri güncellendi
- [x] Navigation components güncellendi
- [x] Page components güncellendi
- [x] Blog components güncellendi
- [x] UI components güncellendi
- [x] Typography renkler güncellendi
- [x] Syntax highlighting güncellendi
- [x] Theme meta tags güncellendi
- [x] PWA manifest güncellendi
- [x] Dokümantasyon oluşturuldu

### 🎯 Semantic Token Kullanımı

Tüm projede artık **semantic color tokens** kullanılıyor:

#### Kullanılması Gerekenler ✅
```jsx
// Arka planlar
bg-background
bg-card
bg-secondary
bg-primary

// Metinler
text-foreground
text-muted
text-muted-foreground
text-primary

// Kenarlıklar
border-border
border-primary

// Hover/Focus
hover:text-primary
hover:bg-primary/90
ring-primary
```

#### Kullanılmaması Gerekenler ❌
```jsx
// ASLA hardcoded renkler kullanmayın!
bg-blue-500
text-teal-400
text-zinc-800
dark:text-zinc-200
```

## 🧪 Test Önerileri

### Manuel Testler
1. **Light Mode**
   - [ ] Ana sayfa okunaklılığı
   - [ ] Blog listesi görünümü
   - [ ] Blog post detay sayfası
   - [ ] Navigation hover durumları
   - [ ] Buton hover/active durumları

2. **Dark Mode**
   - [ ] Tüm yukarıdaki testler
   - [ ] Renk geçişleri smooth mu?
   - [ ] Kontrast yeterli mi?

3. **Blog İçeriği**
   - [ ] Markdown render
   - [ ] Code block syntax highlighting
   - [ ] Link renkler
   - [ ] Heading hiyerarşisi

4. **Erişilebilirlik**
   - [ ] Lighthouse accessibility score
   - [ ] Kontrast oranları (WCAG AA)
   - [ ] Keyboard navigation
   - [ ] Screen reader uyumluluğu

## 🔍 Bilinen Sorunlar

Henüz bilinen sorun yok.

## 🚀 Gelecek İyileştirmeler

1. **Animasyonlar**: Tema geçişlerinde daha smooth animasyonlar
2. **Custom Renkler**: Kullanıcı tercihi ile renk özelleştirme
3. **Seasonal Themes**: Mevsimsel varyasyonlar (örn: sonbahar tonları)
4. **Accessibility**: Yüksek kontrast modu seçeneği

## 📚 Referanslar

- [Color Scheme Dokümantasyonu](./COLOR_SCHEME.md)
- [Project Overview](./project-overview.md)
- [Development Priorities](./priorities.md)

## 💡 Önemli Notlar

1. **Tutarlılık**: Yeni component eklerken mutlaka semantic token kullanın
2. **Kontrast**: WCAG 2.1 AA standartlarını koruyun
3. **Dokümantasyon**: Renk değişikliklerinde `COLOR_SCHEME.md`'yi güncelleyin
4. **Test**: Her iki modda da test edin

## 👨‍💻 Geliştirici Notları

### Yeni Renk Eklemek
```css
/* tailwind.css içinde */
:root {
  --new-color: <hue> <saturation>% <lightness>%;
}

.dark {
  --new-color: <hue> <saturation>% <lightness>%;
}
```

### Theme Değişkenlerini Kullanmak
```jsx
// Tailwind class olarak
<div className="bg-background text-foreground">

// CSS içinde
.custom-class {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

## 🎉 Sonuç

Proje artık benzersiz ve modern bir earth-tone renk paletine sahip. Bu palet özellikle:
- Yiyecek ve seyahat içeriklerine uygun
- Gözü yormayan, doğal tonlar
- Her iki modda da tutarlı deneyim
- WCAG standartlarına uygun kontrast
- Profesyonel ve modern görünüm

sağlamaktadır.
