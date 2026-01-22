# Mehmet Temel - Food Decoded

A modern, SEO-optimized blog built with Next.js 16, focused on nutrition research, human biology, and health science. Features automated content publishing via Telegram bot integration with AI-powered categorization.

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4.1.18
- **UI Components**: shadcn/ui + Radix UI (@radix-ui/react-*)
- **Content**: Markdown/MDX with gray-matter, remark, rehype
- **Database**: Neon PostgreSQL (@neondatabase/serverless)
- **AI Integration**: Google Gemini AI (categorization & metadata extraction)
- **GitHub Integration**: Octokit REST API (@octokit/rest)
- **Telegram Bot**: Direct webhook integration + Google Apps Script
- **Typography**: @tailwindcss/typography
- **Font**: Geist Mono
- **Theme**: next-themes (Dark/Light mode)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Color Scheme**: Custom earth-tone palette (Linen, Olive, Sage, Clay)

## 📦 Features

### Content Management
- **Markdown/MDX Support**: Write research posts in Markdown/MDX format
- **Telegram Bot Integration**: Add content via Telegram commands (/link, /quote, /video, /kitap, /cache-*)
- **AI-Powered Categorization**: Automatic content categorization with Gemini AI
- **Multi-Type Notes**: Support for links, quotes, video notes, and book notes
- **Cache System**: Track books, movies/shows, and products with completion and like status
- **GitHub Auto-Sync**: Automatic markdown file creation and commits to GitHub
- **Database-Driven**: Neon PostgreSQL for dynamic content storage
- **ISR (Incremental Static Regeneration)**: 60-second revalidation for fresh content

### Research Blog (İncelemeler)
- **Category Organization**: Posts organized by gidalar, besinler, mekanizmalar
- **Reading Time**: Automatic reading time calculation
- **Category Filtering**: Filter posts by category
- **Static Generation**: Fast page loads with generateStaticParams

### Discoveries (Kesifler)
- **4 Content Types**: Links, Quotes, Video Notes, Book Notes
- **Real-time Updates**: ISR with 60-second revalidation
- **Category Sidebar**: Filter by AI-generated categories
- **Pagination**: Handle large content collections
- **Source Attribution**: Track authors, sources, and URLs

### SEO & Performance
- **SEO Optimized**: Full metadata, Open Graph, and structured data (Schema.org)
- **Dynamic Sitemap**: Auto-generated XML sitemap with all pages
- **Dynamic Robots.txt**: Crawler configuration
- **RSS Feed Support**: Feed generation ready (feed library included)
- **Fast Performance**: Optimized images, static generation, and ISR
- **Google Analytics**: GA4 integration

### User Experience
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System preference detection with animated toggle
- **Custom Color Scheme**: Unique earth-tone palette (Linen, Olive, Sage, Clay)
- **Smooth Animations**: Framer Motion for page transitions
- **Accessibility**: WCAG 2.1 AA compliant color contrasts

## 📝 Content Management

### Writing Research Posts (İncelemeler)

Create new research posts in the `content/researches/{category}` directory with `.md` or `.mdx` extension.

**Categories:**
- `gidalar` - Foods
- `besinler` - Nutrients
- `mekanizmalar` - Biological mechanisms

#### Example Post

Create a file `content/researches/gidalar/protein-powder.md`:

```markdown
---
title: "Protein Tozları: Bilimsel Bakış"
date: "2026-01-09"
description: "Protein tozlarının etkinliği, yan etkileri ve kullanım önerileri üzerine bilimsel araştırmalar"
category: "gidalar"
tags: ["protein", "supplement", "nutrition"]
author: "Mehmet Temel"
---

# Protein Tozları: Bilimsel Bakış

Your content here...
```

#### Frontmatter Fields

- `title` (required): Post title
- `date` (required): Publication date (YYYY-MM-DD)
- `description` (required): Brief description for previews
- `category` (required): One of: gidalar, besinler, mekanizmalar
- `tags` (optional): Array of tags
- `author` (optional): Author name (defaults to "Mehmet Temel")

### Adding Discoveries (Kesifler) via Telegram

You can add content to the Kesifler section using Telegram bot commands:

#### Available Commands

**Kesifler (Discoveries):**
- `/link [URL]` - Add a link with AI-powered metadata extraction
- `/quote [text]` or `/alinti [text]` - Add a quote
- `/video [text]` - Add video notes (supports multiple notes in one message)
- `/kitap [text]` - Add book notes (supports multiple notes in one message)

**Lists System:**
- `/k [name]` - Add a book to your reading list (AI finds author)
- `/f [name]` - Add a movie/show to your watch list (AI finds director)
- `/tarif [recipe text]` - Add a recipe (AI parses and formats everything)

**Other:**
- `/help` - Show help message
- `/stats` - Show content statistics

#### Examples

```
/link https://example.com/article
AI will automatically extract title, description, and categorize it

/quote The dose makes the poison - Paracelsus

/video
1. Video title - Key insight #1
2. Another video - Key insight #2

/k Zero to One
AI finds: Author: Peter Thiel, Description: ...

/tarif
Tavuk Sote

Malzemeler:
- 500g tavuk göğsü
- 2 soğan

Yapılışı:
1. Tavukları doğrayın
2. Soğanları kavurun

AI parses: name, ingredients, instructions
```

#### Content Flow

```
Telegram Message → Gemini AI Categorization → Neon Database → GitHub Commit → Website (ISR 60s)
```

### Weekly Signals (Bu Hafta)

Update the weekly content by editing `content/signals/current.md`:

```markdown
---
title: "Bu Hafta #1"
date: "2026-01-13"
---

Your weekly content here...
```

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

## 🗺️ Site Structure

### Pages and Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage - Features recent researches and discoveries |
| `/incelemeler` | Research blog index - List of all research posts |
| `/incelemeler/[slug]` | Individual research post |
| `/kesifler` | Discoveries - Dynamic content from database (links, quotes, videos, books) |
| `/listeler` | Lists dashboard - Overview of all tracked items |
| `/listeler/kitap` | Books list - Reading list with completion tracking |
| `/listeler/film` | Movies/Shows list - Watch list with completion tracking |
| `/listeler/tarif` | Recipes list - Simple recipe collection with full-screen modal view |
| `/bu-hafta` | Weekly signals - Current week's curated content |
| `/iletisim` | Contact page - Social links and email |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Dynamic robots.txt |

### Content Organization

**Research Posts (İncelemeler):**
- File-based: Markdown/MDX files in `content/researches/{category}/`
- Categories: gidalar (foods), besinler (nutrients), mekanizmalar (mechanisms)
- Static generation with ISR

**Discoveries (Kesifler):**
- Database-driven: Stored in Neon PostgreSQL
- 4 types: Links, Quotes, Video Notes, Book Notes
- AI-categorized with Gemini
- ISR with 60-second revalidation

**Lists System:**
- Track items to read, watch, or cook
- 3 categories: Books (Kitap), Movies/Shows (Film & Dizi), Recipes (Tarifler)
- Checkbox tracking: Completed and Liked status (books/movies)
- Recipe modal view: Full-screen display with ingredients and instructions
- AI-powered parsing for recipes
- Real-time updates with PATCH API
- ISR with 60-second revalidation

## 📁 Project Structure

```
├── content/
│   ├── researches/          # Research blog posts (MDX/Markdown)
│   │   ├── gidalar/         # Food-related research
│   │   ├── besinler/        # Nutrient-related research
│   │   └── mekanizmalar/    # Biological mechanisms research
│   └── signals/             # Weekly signals
│       └── current.md       # Current week's content
├── public/                  # Static assets
├── scripts/                 # Automation scripts
│   ├── init-db.sql         # Database schema (notes table)
│   ├── create-cache-table.sql  # Cache table schema
│   └── telegram-bot-updated.gs  # Google Apps Script for Telegram
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── cache/      # Cache API
│   │   │   │   └── [id]/toggle/  # Toggle checkboxes
│   │   │   ├── notes/list/ # Fetch notes from DB
│   │   │   ├── kesifler/add/  # Add notes (legacy endpoint)
│   │   │   └── telegram/webhook/  # Telegram webhook
│   │   ├── incelemeler/    # Research blog pages
│   │   │   ├── page.jsx    # Research list
│   │   │   └── [slug]/page.jsx  # Individual post
│   │   ├── kesifler/       # Discoveries page
│   │   │   └── page.jsx    # Dynamic content from DB
│   │   ├── cache/          # Cache system pages
│   │   │   ├── page.jsx    # Cache dashboard
│   │   │   ├── kitap/page.jsx   # Books cache
│   │   │   ├── film/page.jsx    # Movies/Shows cache
│   │   │   └── urun/page.jsx    # Products cache
│   │   ├── bu-hafta/       # Weekly signals page
│   │   ├── iletisim/       # Contact page
│   │   ├── layout.jsx      # Root layout with SEO
│   │   ├── page.jsx        # Homepage
│   │   ├── providers.jsx   # Theme provider
│   │   ├── template.jsx    # Animation wrapper
│   │   ├── not-found.jsx   # 404 page
│   │   ├── robots.js       # Dynamic robots.txt
│   │   └── sitemap.js      # Dynamic sitemap
│   ├── components/         # React components
│   │   ├── ui/            # Radix UI components (shadcn)
│   │   ├── home/          # Home page components
│   │   ├── kesifler/      # Discovery page components
│   │   ├── cache/         # Lists system components
│   │   │   ├── CacheList.jsx   # List items list
│   │   │   └── CacheItem.jsx   # Individual list item
│   │   ├── recipes/       # Recipe components (NEW!)
│   │   │   ├── RecipeCard.jsx  # Recipe card preview
│   │   │   ├── RecipeModal.jsx # Full recipe modal
│   │   │   └── RecipeList.jsx  # Recipe list with filters
│   │   └── [various].jsx  # Navbar, Footer, etc.
│   ├── lib/               # Utilities & integrations
│   │   ├── blog.js        # Blog post utilities
│   │   ├── db.js          # Neon database functions
│   │   ├── github.js      # GitHub API integration
│   │   ├── gemini.js      # Gemini AI integration (includes handleRecipe)
│   │   ├── seo.js         # SEO utilities
│   │   └── utils.js       # General utilities
│   ├── data/              # Static data
│   │   ├── kesifler.js    # Fallback data & categories
│   │   └── list.js        # List categories config (includes tarif)
│   ├── styles/            # Global styles
│   │   ├── tailwind.css   # Tailwind config & custom styles
│   │   └── prism.css      # Code syntax highlighting
│   └── images/            # Image assets
├── next.config.mjs
├── package.json
├── tsconfig.json
├── jsconfig.json
└── .env.local             # Environment variables
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

**🚀 Quick Start:**
- `TELEGRAM_QUICK_START.md` - Telegram bot commands (quick reference)
- `CURRENT_SYSTEM.md` - Current system status (v2.0.0)

**📖 Detailed Docs:**
- `CACHE_SYSTEM.md` - Cache system documentation (Turkish)
- `TELEGRAM_AUTOMATION.md` - Telegram bot automation (Turkish)
- `TELEGRAM_COMMANDS.md` - All commands and test scenarios
- `COLOR_SCHEME.md` - Color palette and usage guide
- `FONT_SETUP.md` - Font configuration
- `SEO_SETUP.md` - SEO best practices
- `ANALYTICS_SETUP.md` - Analytics setup
- `FILE_STRUCTURE.md` - Complete file structure
- `project-overview.md` - Project architecture

## 🔌 API Routes

The project includes four main API endpoints:

### GET `/api/notes/list`
Fetch notes from Neon database with filtering and pagination.

**Query Parameters:**
- `type` - Filter by note type: link, quote, video, book
- `category` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "notes": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "totalNotes": 100
  }
}
```

**Caching:** ISR with 60-second revalidation

### POST `/api/kesifler/add`
Add new notes to the database (legacy endpoint for Google Apps Script).

**Request Body:**
```json
{
  "noteType": "link|quote|video|book",
  "category": "category-name",
  "title": "Note title",
  "text": "Note content",
  "author": "Author name",
  "source": "Source name",
  "url": "https://example.com",
  "tags": ["tag1", "tag2"]
}
```

### POST `/api/telegram/webhook`
Direct Telegram webhook integration for bot commands.

**Supported Commands:**
- `/link [url]` or `/l [url]` - Add link with AI metadata extraction
- `/quote [text]` or `/a [text]` - Add quote with AI categorization
- `/video [text]` or `/v [text]` - Add video notes
- `/book [text]` or `/b [text]` - Add book notes
- `/k [name]` - Add book to reading list (AI finds author & description)
- `/f [name]` - Add movie/show to watch list (AI finds director & description)
- `/tarif [recipe text]` - Add recipe (AI parses name, ingredients, instructions)
- `/help` - Show help
- `/stats` - Show statistics

**Authentication:** Validates user ID against `TELEGRAM_ALLOWED_USER_IDS`

### PATCH `/api/cache/[id]/toggle`
Toggle completion and like status for cache items.

**Request Body:**
```json
{
  "field": "is_completed" | "is_liked"
}
```

**Response:**
```json
{
  "success": true,
  "item": {
    "id": 1,
    "name": "Atomic Habits",
    "cache_type": "kitap",
    "is_completed": true,
    "is_liked": false,
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-01-15T11:00:00Z"
  }
}
```

**Business Logic:**
- An item must be completed before it can be liked
- If an item is marked as not completed, it will automatically be unmarked as liked

## 🗄️ Database Setup

This project uses Neon PostgreSQL. Follow these steps to set up the database:

### 1. Create Neon Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 2. Initialize Database Schema

Run the initialization script:

```bash
# Make sure you have psql installed
psql $DATABASE_URL < scripts/init-db.sql
```

Or manually execute the SQL in `scripts/init-db.sql`.

### 3. Database Schema

**Tables:**

- **notes** - Main content table
  - Fields: id, note_type, category, title, text, author, source, url, tags, created_at, updated_at, github_path, github_commit_sha
  - Indexes: note_type, category, created_at, composite indexes

- **list_items** - List tracking table
  - Fields: id, name, list_type, author, description, is_completed, is_liked, created_at, updated_at
  - Types: kitap (books), film (movies/shows)
  - Constraint: is_liked requires is_completed to be true

- **recipes** - Recipes table (simplified)
  - Fields: id, name, ingredients, instructions, created_at, updated_at
  - AI-parsed and formatted content (name, ingredients, instructions only)

- **valid_categories** - Category reference table
  - Pre-populated with valid categories for each note type

### 4. Connection

The app uses `@neondatabase/serverless` for serverless-friendly connections.

## 🤖 Telegram Bot Setup

Two integration options are available:

### Option 1: Direct Webhook (Recommended)

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Get your Telegram user ID (use [@userinfobot](https://t.me/userinfobot))
4. Add to `.env.local`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ALLOWED_USER_IDS=your_user_id
```

5. Set webhook (after deploying):
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://yourdomain.com/api/telegram/webhook"
```

### Option 2: Google Apps Script (Alternative)

1. Open Google Apps Script: [script.google.com](https://script.google.com)
2. Create new project
3. Copy code from `scripts/telegram-bot-updated.gs`
4. Set Script Properties:
   - `TELEGRAM_BOT_TOKEN`
   - `API_URL` (your deployed site + /api/kesifler/add)
   - `GEMINI_API_KEY`
5. Deploy as Web App
6. Set Telegram webhook to your Apps Script URL

## 🌐 Deployment

This project is optimized for deployment on Vercel:

```bash
# Deploy to Vercel
vercel

# Or push to your git repository
git push origin main
```

## 📄 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://mehmettemel.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Neon Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# GitHub Integration
GITHUB_TOKEN=ghp_your_github_token
GITHUB_REPO=username/repo-name
GITHUB_BRANCH=main  # Optional, defaults to 'main'

# Telegram Bot (Optional - for direct webhook)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ALLOWED_USER_IDS=123456789,987654321  # Comma-separated user IDs
```

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Your website URL | Yes |
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `GITHUB_TOKEN` | GitHub Personal Access Token | Yes |
| `GITHUB_REPO` | GitHub repository (format: owner/repo) | Yes |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID | No |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | No* |
| `TELEGRAM_ALLOWED_USER_IDS` | Allowed Telegram user IDs | No* |

*Required only if using direct Telegram webhook integration

## 🏗️ Architecture & Data Flow

### Content Pipeline

```
┌─────────────────┐
│  Telegram Bot   │
│   (Commands)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Gemini AI     │
│ (Categorization)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Neon Database  │
│  (PostgreSQL)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub API     │
│ (Auto Commit)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Website       │
│  (ISR 60s)      │
└─────────────────┘
```

### Key Components

1. **Content Input Layer**
   - Telegram bot commands
   - Manual markdown files

2. **AI Processing Layer**
   - Gemini AI categorizes content
   - Extracts metadata from URLs
   - Parses structured notes (video/book)

3. **Storage Layer**
   - Neon PostgreSQL (dynamic content)
   - GitHub (markdown files for version control)

4. **Presentation Layer**
   - Next.js with App Router
   - ISR for dynamic content
   - Static generation for blog posts

### Technology Choices

**Why Neon PostgreSQL?**
- Serverless-friendly
- Built-in connection pooling
- Generous free tier
- SQL for complex queries

**Why Gemini AI?**
- Excellent categorization accuracy
- Built-in web scraping for link metadata
- Generous free tier (1500 requests/day)
- Fast response times

**Why GitHub for Notes?**
- Version control for all content
- Backup and history
- Git-based content workflow
- Easy migration/export

**Why ISR (60s)?**
- Fresh content without rebuild
- Fast page loads
- Reduced database queries
- Better SEO with static-like pages

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
