# Renk Şeması Dokümantasyonu

Bu proje, doğal ve toprak tonlarından oluşan bir renk paletine sahiptir.

## Renk Paleti

### Light Mode

- **Background**: `#F4F1EA` (Linen) - Ana arka plan
- **Foreground**: `#2D302D` (Olive) - Ana metin
- **Border**: `#E8E3D5` - Kenarlıklar
- **Muted**: `#6B705C` - İkincil metinler
- **Accent**: `#A3B18A` (Sage) - Vurgu rengi

### Dark Mode

- **Background**: `#1A1C1A` (Olive) - Ana arka plan
- **Foreground**: `#F4F1EA` (Linen) - Ana metin
- **Border**: `#2D302D` - Kenarlıklar
- **Muted**: `#A3B18A` (Sage) - İkincil metinler
- **Accent**: `#D4A373` (Clay) - Vurgu rengi

## Kullanım

```jsx
// Arka plan ve metin
<div className="bg-background text-foreground">İçerik</div>

// Vurgu rengi
<button className="bg-primary text-primary-foreground">Buton</button>

// Kenarlık ve kart
<div className="border border-border bg-card">Kart</div>

// İkincil metin
<p className="text-muted-foreground">İkincil bilgi</p>
```

## Erişilebilirlik

Tüm renk kombinasyonları WCAG 2.1 AA standartlarını karşılar:

- Normal metin için minimum kontrast: 4.5:1
- Büyük metin için minimum kontrast: 3:1

## Renk Değiştirme

Renkleri değiştirmek için `src/styles/tailwind.css` dosyasındaki CSS değişkenlerini düzenleyin.
