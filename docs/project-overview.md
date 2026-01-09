# Project Overview

## Core Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript (migrating to TypeScript gradually recommended)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Font**: Geist Sans & Mono
- **Theming**: Dark/Light mode support via `next-themes`

## Architecture

### File Structure

- `src/app`: App Router pages and layouts.
- `src/components`: UI components (shadcn/ui and custom).
- `src/lib`: Utilities and helper functions.
- `src/styles`: Global styles (Tailwind CSS configuration).
- `docs`: Documentation files.

### Styling & Theming

- **Tailwind v4**: Configuration is handled entirely in `src/styles/tailwind.css` using the `@theme` directive. `tailwind.config.js` is NOT used and should be deleted to avoid confusion.
- **Dark Mode**: Implemented with CSS variables (`--background`, `--foreground`, etc.) in `src/styles/tailwind.css`. `next-themes` in `src/app/providers.jsx` toggles the `dark` class on the `<html>` element.
- **Color Scheme**: Unique earth-tone palette inspired by nature:
  - **Light Mode**: Linen (Keten) tones - warm, natural beige (#F4F1EA)
  - **Dark Mode**: Olive tones - deep, peaceful green (#1A1C1A)
  - **Accent Colors**: Sage (#A3B18A) for light mode, Clay (#D4A373) for dark mode
  - See `docs/COLOR_SCHEME.md` for complete color documentation
- **Colors**: Semantic color names (e.g., `primary`, `secondary`, `muted`) are used to ensure automatic dark mode compatibility. Always use these semantic classes (e.g., `bg-primary`, `text-primary-foreground`) instead of hardcoded colors (e.g., `bg-[#A3B18A]`).

## Key Guidelines

1.  **Performance**: Use `Geist` font variables. Avoid heavy client-side libraries.
2.  **SEO**: Metadata is defined in `layout.jsx` and `page.jsx`. Ensure semantic HTML structure.
3.  **Components**: Use `shadcn/ui` components from `src/components/ui` (to be created).

## Recent Changes

- Migrated to Tailwind v4.
- Switched to Geist font.
- Simplified homepage to bio-only.
- Implemented custom earth-tone color scheme (Linen/Olive/Sage/Clay).
- Updated all components to use new semantic color tokens.
- Enhanced dark mode with warm, natural tones.
