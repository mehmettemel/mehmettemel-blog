# Project File Structure

Complete guide to all files and their purposes in this Next.js portfolio project.

## Root Configuration Files

### `package.json`
**Purpose:** Project dependencies and npm scripts
**Key Dependencies:** Next.js 16, React 19, Tailwind CSS 4, Geist font, MDX support

### `next.config.mjs`
**Purpose:** Next.js configuration
**Key Features:** MDX support, page extensions configuration

### `tailwind.config.js`
**Purpose:** Tailwind CSS v3/v4 hybrid configuration
**Contains:** Container settings, color themes, animations, plugins

### `postcss.config.js`
**Purpose:** PostCSS configuration for Tailwind CSS processing

### `tsconfig.json`
**Purpose:** TypeScript configuration
**Note:** Project uses JSX but has TypeScript support for tooling

### `jsconfig.json`
**Purpose:** JavaScript configuration for IDE support
**Features:** Path aliases (@/ for src/)

### `.eslintrc.json`
**Purpose:** ESLint configuration for code quality

### `prettier.config.js`
**Purpose:** Code formatting configuration
**Plugins:** Tailwind CSS class sorting

### `components.json`
**Purpose:** shadcn/ui components configuration
**Note:** Used for UI component generation

### `mdx-components.jsx`
**Purpose:** Custom MDX component mappings for blog posts

### `typography.js`
**Purpose:** Typography plugin configuration for blog content styling

## Environment Files

### `.env.local`
**Purpose:** Local environment variables (not committed to git)
**Contains:** API keys, site URL, Google Analytics ID

### `.env.example` / `env.example`
**Purpose:** Example environment variables template
**Note:** `env.example` is duplicate, should be removed

## Source Files (`src/`)

### App Directory (`src/app/`)

#### `layout.jsx`
**Purpose:** Root layout for entire application
**Key Features:**
- Metadata configuration (SEO, Open Graph, Twitter Cards)
- Geist Mono font setup
- Google Analytics integration
- Structured data (Schema.org)
- Theme provider wrapper

#### `page.jsx`
**Purpose:** Homepage
**Content:** Hero section with bio and social links

#### `template.jsx`
**Purpose:** Page transition animations
**Feature:** Framer Motion layout transitions

#### `providers.jsx`
**Purpose:** React context providers wrapper
**Includes:** Theme provider for dark mode

#### `not-found.jsx`
**Purpose:** Custom 404 error page

#### `sitemap.js`
**Purpose:** Dynamic XML sitemap generation for SEO

#### `robots.js`
**Purpose:** Dynamic robots.txt generation for SEO

### Components (`src/components/`)

#### `Layout.jsx`
**Purpose:** Main layout wrapper with header and footer

#### `Header.jsx`
**Purpose:** Navigation header with mobile menu and theme toggle

#### `Footer.jsx`
**Purpose:** Site footer with navigation links and copyright

#### `Container.jsx`
**Purpose:** Responsive container components (OuterContainer, InnerContainer)

#### `Section.jsx`
**Purpose:** Reusable section wrapper component

#### `Button.jsx`
**Purpose:** Reusable button component

#### `SocialIcons.jsx`
**Purpose:** Social media icon components (Twitter, Instagram, GitHub, LinkedIn)

#### `SEO.jsx`
**Purpose:** SEO component for meta tags (may be deprecated in favor of Next.js metadata)

### Library (`src/lib/`)

#### `seo.js`
**Purpose:** SEO configuration and utilities
**Contains:**
- Site configuration (metadata, social links)
- Structured data generators
- Business information for local SEO

#### `blog.js`
**Purpose:** Blog post utilities
**Functions:** Get all posts, get post by slug, markdown processing

#### `utils.js`
**Purpose:** Utility functions
**Contains:** `cn()` function for className merging

### Styles (`src/styles/`)

#### `tailwind.css`
**Purpose:** Main CSS file
**Contains:**
- Tailwind directives
- @theme configuration (Tailwind v4)
- CSS custom properties for theming
- Dark mode styles
- Custom earth-tone color palette (Linen, Olive, Sage, Clay)
- HSL color values for light and dark modes

#### `prism.css`
**Purpose:** Syntax highlighting styles for code blocks in blog posts

### Images (`src/images/`)

#### `avatar2.jpg`
**Purpose:** Profile picture for about page and hero section

## Content (`content/`)

### `content/blog/`
**Purpose:** Blog post markdown/MDX files
**Example:** `sample-post.md`

## Public Assets (`public/`)

### Favicons
- `favicon.ico` - Main favicon
- `favicon-16x16.png` - 16x16 favicon
- `favicon-32x32.png` - 32x32 favicon
- `apple-icon-180x180.png` - Apple touch icon
- `android-icon-192x192.png` - Android PWA icon

### `site.webmanifest`
**Purpose:** PWA manifest for mobile app-like experience

### `og-image.jpg`
**Purpose:** Default Open Graph image for social media sharing

## Documentation (`docs/`)

### `COLOR_SCHEME.md`
**Purpose:** Complete color palette documentation
**Contains:** Light/dark mode colors, usage examples, accessibility guidelines, design philosophy

### `FONT_SETUP.md`
**Purpose:** Geist Mono font setup and troubleshooting guide

### `SEO_SETUP.md`
**Purpose:** SEO configuration and best practices

### `ANALYTICS_SETUP.md`
**Purpose:** Google Analytics setup guide

### `project-overview.md`
**Purpose:** High-level project overview and architecture

### `structure.md`
**Purpose:** Project structure overview (may overlap with this file)

### `priorities.md`
**Purpose:** Development priorities and task tracking

### `FILE_STRUCTURE.md` (this file)
**Purpose:** Complete file structure documentation

## Other Files

### `README.md`
**Purpose:** Project overview and setup instructions

### `LICENSE.md`
**Purpose:** Project license information

### `next-env.d.ts`
**Purpose:** Next.js TypeScript declarations (auto-generated)

## Files to Remove (Duplicates/Unused)

- `env.example` (duplicate of `.env.example`)
- Possibly `src/components/SEO.jsx` (if using Next.js metadata API)
- `docs/structure.md` (overlaps with this file)

## Generated/Cache Directories (not committed)

- `.next/` - Next.js build output
- `node_modules/` - NPM dependencies
- `.git/` - Git repository data
