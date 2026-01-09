# Mehmet Temel - Travel & Food Blog

A modern, SEO-optimized blog built with Next.js 16, focused on travel stories and food adventures.

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4.1.18
- **UI Components**: shadcn/ui
- **Content**: Markdown with gray-matter
- **Typography**: @tailwindcss/typography
- **Font**: Geist Mono
- **Theme**: next-themes (Dark/Light mode)
- **Animations**: Framer Motion
- **Color Scheme**: Custom earth-tone palette (Linen, Olive, Sage, Clay)

## 📦 Blog Features

- **Markdown Support**: Write blog posts in Markdown format
- **Reading Time**: Automatic reading time calculation
- **SEO Optimized**: Full metadata, Open Graph, and structured data
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System preference detection with animated toggle
- **Custom Color Scheme**: Unique earth-tone palette for warm, natural aesthetics
- **Fast Performance**: Optimized images and static generation
- **Accessibility**: WCAG 2.1 AA compliant color contrasts

## 📝 Writing Blog Posts

Create new blog posts in the `content/blog` directory with `.md` extension.

### Example Post

Create a file `content/blog/my-first-post.md`:

```markdown
---
title: "My First Food Adventure in Istanbul"
date: "2026-01-09"
description: "Exploring the hidden gems of Istanbul's street food scene"
tags: ["Turkey", "Street Food", "Istanbul"]
author: "Mehmet Temel"
---

# My First Food Adventure in Istanbul

Your content here...
```

### Frontmatter Fields

- `title` (required): Post title
- `date` (required): Publication date (YYYY-MM-DD)
- `description` (required): Brief description for previews
- `tags` (optional): Array of tags
- `author` (optional): Author name (defaults to "Mehmet Temel")

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
├── content/
│   └── blog/           # Markdown blog posts
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── blog/       # Blog pages
│   │   │   ├── page.jsx          # Blog list
│   │   │   └── [slug]/page.jsx   # Blog post detail
│   │   ├── about/      # About page
│   │   ├── layout.jsx  # Root layout
│   │   └── page.jsx    # Homepage
│   ├── components/     # Reusable components
│   ├── images/         # Image assets
│   ├── lib/
│   │   ├── blog.js     # Blog utilities
│   │   └── seo.js      # SEO utilities
│   └── styles/         # Global styles
├── next.config.mjs
├── package.json
└── tailwind.config.js
```

## 🎨 Customization

### Colors

The project uses a unique earth-tone color palette:
- **Light Mode**: Linen (warm beige) background with Sage (soft green) accents
- **Dark Mode**: Olive (deep green) background with Clay (terracotta) accents

Edit `src/styles/tailwind.css` to customize the color palette. See `docs/COLOR_SCHEME.md` for detailed color documentation.

**Color Usage:**
```jsx
// Always use semantic color tokens
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Click me
  </button>
  <p className="text-muted-foreground">Secondary text</p>
</div>
```

### Navigation

Update navigation links in:
- `src/components/Navbar.jsx` (Main navigation)
- `src/components/Footer.jsx` (Footer links)

### SEO

Configure SEO settings in:
- `src/lib/seo.js` (Global SEO config)
- `src/app/layout.jsx` (Root metadata)

### Documentation

Complete documentation available in `/docs`:
- `COLOR_SCHEME.md` - Color palette and usage guide
- `FONT_SETUP.md` - Font configuration
- `SEO_SETUP.md` - SEO best practices
- `ANALYTICS_SETUP.md` - Analytics setup
- `FILE_STRUCTURE.md` - Complete file structure
- `project-overview.md` - Project architecture

## 🌐 Deployment

This project is optimized for deployment on Vercel:

```bash
# Deploy to Vercel
vercel

# Or push to your git repository
git push origin main
```

## 📄 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://mehmettemel.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 📝 License

MIT License - See LICENSE.md for details

## 👤 Author

**Mehmet Temel**

- Website: [mehmettemel.com](https://mehmettemel.com)
- Twitter: [@temelbusiness](https://x.com/temelbusiness)
- Instagram: [@mehmettemelim](https://instagram.com/mehmettemelim)
- GitHub: [@mehmettemel](https://github.com/mehmettemel)
- LinkedIn: [mehmettemelim](https://linkedin.com/in/mehmettemelim)

---

Built with ❤️ using Next.js
