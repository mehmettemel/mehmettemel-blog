# User Priorities

This document outlines the core priorities for the project. All future changes and refactors must align with these principles.

## 1. Performance

- **Site Speed**: The website must be extremely fast.
- **Optimization**: Use techniques like code splitting, image optimization, and efficient bundling.
- **Lighthouse Score**: Aim for 100/100 on Performance.

## 2. SEO (Search Engine Optimization)

- **Structure**: Semantic HTML (proper use of `<header>`, `<main>`, `<footer>`, `<h1>`, etc.).
- **Metadata**: Accurate and dynamic metadata for all pages.
- **Indexing**: Correct `robots.txt` and `sitemap.xml` configuration.

## 3. Design & UI

- **Font**: Use **Geist** (`GeistSans` & `GeistMono`) for modern, high-performance typography.
- **Framework**: Use **shadcn/ui** for the component library.
- **Styling**: Tailwind CSS v4 for utility-first styling.
- **Color Scheme**: Custom earth-tone palette with natural, warm colors:
  - **Light Mode**: Linen (Keten) background (#F4F1EA) with Sage accents (#A3B18A)
  - **Dark Mode**: Olive background (#1A1C1A) with Clay accents (#D4A373)
  - See `docs/COLOR_SCHEME.md` for complete guidelines
- **Theme**: **Full Dark/Light Mode Support**. All text and background colors must use semantic variables (e.g., `bg-background`, `text-foreground`, `text-primary`) to adapt automatically.
- **Color Usage**: NEVER use hardcoded colors (e.g., `bg-blue-500`, `text-teal-400`). Always use semantic tokens (e.g., `bg-primary`, `text-muted-foreground`).

## 4. Development Workflow

- **Dev Server**: DO NOT start/restart dev server automatically. User will manually run `npm run dev` when needed.
- **Manual Control**: User prefers full control over when the development server runs.
