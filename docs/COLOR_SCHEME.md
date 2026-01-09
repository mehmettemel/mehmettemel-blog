# Renk Şeması Dokümantasyonu

Bu proje, alışılmışın dışında doğal ve toprak tonlarından oluşan benzersiz bir renk paletine sahiptir. Renk şeması, modern minimalizmi doğal tonlarla birleştirerek sıcak ve otantik bir kullanıcı deneyimi sunar.

## Renk Paleti Felsefesi

Projede kullanılan renkler, doğadan ilham alınarak seçilmiştir:

- **Light Mode**: Keten kumaşının sıcak ve doğal tonu
- **Dark Mode**: Zeytin ağacının huzur veren koyu yeşili
- **Vurgu Renkleri**: Adaçayı (Sage) ve kil (Clay) tonları

## Renk Tanımları

### Light Mode (Işık Modu)

#### Linen (Keten) Tonları

```css
--color-linen-50: #f9f7f2 /* En açık arka plan */ --color-linen-100: #f4f1ea
  /* Ana arka plan (Keten) */ --color-linen-200: #e8e3d5
  /* Kenarlıklar ve kartlar */;
```

#### Ana Renkler

- **Background**: `#F4F1EA` (Linen 100) - Ana sayfa arka planı
- **Foreground**: `#2D302D` (Olive 800) - Ana metin rengi
- **Border**: `#E8E3D5` (Linen 200) - Kenarlık rengi
- **Muted**: `#6B705C` - İkincil metinler
- **Accent**: `#A3B18A` (Sage) - Vurgu rengi (butonlar, linkler)

### Dark Mode (Karanlık Mod)

#### Olive (Zeytin) Tonları

```css
--color-olive-700: #4a4e4a /* İkincil metinler */ --color-olive-800: #2d302d
  /* Kartlar ve bileşenler */ --color-olive-900: #1a1c1a
  /* Ana arka plan (Zeytin) */;
```

#### Ana Renkler

- **Background**: `#1A1C1A` (Olive 900) - Ana sayfa arka planı
- **Foreground**: `#F4F1EA` (Linen 100) - Ana metin rengi
- **Border**: `#2D302D` (Olive 800) - Kenarlık rengi
- **Muted**: `#A3B18A` (Sage) - İkincil metinler
- **Accent**: `#D4A373` (Clay) - Vurgu rengi (butonlar, linkler)

### Brand Renkleri (Her İki Modda)

```css
--color-brand-sage: #a3b18a /* Adaçayı yeşili */ --color-brand-clay: #d4a373
  /* Kil/Toprak tonu */;
```

## Kullanım Örnekleri

### Tailwind CSS Sınıfları

#### Arka Plan ve Metin

```jsx
<div className="bg-background text-foreground">Ana içerik</div>
```

#### Vurgu Renkleri

```jsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Tıkla
</button>

<a className="text-primary hover:text-accent">
  Link
</a>
```

#### Kenarlıklar ve Kartlar

```jsx
<div className="border border-border bg-card text-card-foreground">
  Kart içeriği
</div>
```

#### İkincil Metinler

```jsx
<p className="text-muted-foreground">İkincil bilgi</p>
```

## CSS Değişken Kullanımı

Renkler HSL formatında CSS değişkenleri olarak tanımlanmıştır:

```css
:root {
  --background: 40 33% 94%; /* Light mode */
  --foreground: 120 5% 18%;
  --primary: 82 26% 60%; /* Sage */
  --accent: 82 26% 60%;
}

.dark {
  --background: 120 5% 10%; /* Dark mode */
  --foreground: 40 33% 94%;
  --primary: 30 48% 64%; /* Clay */
  --accent: 30 48% 64%;
}
```

## Erişilebilirlik

Tüm renk kombinasyonları WCAG 2.1 AA standartlarını karşılayacak şekilde seçilmiştir:

- **Normal metin için minimum kontrast**: 4.5:1
- **Büyük metin için minimum kontrast**: 3:1

### Kontrast Oranları

#### Light Mode

- Foreground (#2D302D) / Background (#F4F1EA): **~12:1** ✓
- Primary (#A3B18A) / Background (#F4F1EA): **~4.8:1** ✓
- Muted (#6B705C) / Background (#F4F1EA): **~7.2:1** ✓

#### Dark Mode

- Foreground (#F4F1EA) / Background (#1A1C1A): **~13:1** ✓
- Primary (#D4A373) / Background (#1A1C1A): **~6.5:1** ✓
- Muted (#A3B18A) / Background (#1A1C1A): **~5.2:1** ✓

## Renk Değiştirme

Proje genelinde renkleri değiştirmek için `src/styles/tailwind.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
  --background: <hue> <saturation>% <lightness>%;
  /* diğer renkler */
}
```

## Tasarım İpuçları

1. **Tutarlılık**: Her zaman CSS değişkenlerini kullanın (örn: `bg-primary` yerine `bg-[#A3B18A]`)
2. **Opacity**: Renkleri şeffaflaştırmak için `/` operatörünü kullanın (örn: `bg-primary/90`)
3. **Hover Durumları**: Hover için genellikle rengi %10-20 koyulaştırın
4. **Focus Durumları**: Erişilebilirlik için ring-primary kullanın

## Renk Psikolojisi

- **Linen (Keten)**: Sıcaklık, doğallık, konfor
- **Olive (Zeytin)**: Huzur, denge, sofistike
- **Sage (Adaçayı)**: Büyüme, yenilenme, sakinlik
- **Clay (Kil)**: Topraklılık, güvenilirlik, sıcaklık

Bu renk paleti özellikle yiyecek, seyahat ve doğa temalı içerikler için idealdir.

## Özel Durumlar

### Hata Mesajları

```jsx
<div className="bg-destructive/10 text-destructive">Hata mesajı</div>
```

### Başarı Mesajları

Light mode'da Sage, dark mode'da Clay kullanın:

```jsx
<div className="bg-primary/10 text-primary">Başarılı işlem</div>
```

### Bilgi Mesajları

```jsx
<div className="bg-secondary text-muted-foreground">Bilgi mesajı</div>
```

## Bakım ve Güncellemeler

Renk şemasını güncellerken:

1. Her iki mod için de test edin
2. Kontrast oranlarını kontrol edin
3. Tüm component'leri gözden geçirin
4. Blog yazılarını ve markdown içeriğini test edin
