import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import readingTime from 'reading-time'

const postsDirectory = path.join(process.cwd(), 'content')

// Valid categories (from frontmatter only)
const CATEGORIES = ['gidalar', 'besinler', 'mekanizmalar']

/**
 * Get all post files from content folder (flat structure)
 */
function getAllPostFiles(dir) {
  const entries = []

  // Check if directory exists
  if (!fs.existsSync(dir)) {
    return entries
  }

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    // Only process markdown files, ignore directories
    if (
      !stat.isDirectory() &&
      (item.endsWith('.md') || item.endsWith('.mdx'))
    ) {
      entries.push({
        file: item,
        fullPath,
      })
    }
  }

  return entries
}

/**
 * Get all posts with category information (from frontmatter)
 */
export function getAllPosts() {
  const postFiles = getAllPostFiles(postsDirectory)

  const allPostsData = postFiles.map(({ file, fullPath }) => {
    const slug = file.replace(/\.mdx?$/, '')
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const readingStats = readingTime(content)

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      description: data.description || '',
      category: data.category || 'uncategorized',
      tags: data.tags || [],
      author: data.author || 'Mehmet Temel',
      readingTime: readingStats.text,
      featured: data.featured || false,
      ...data,
    }
  })

  return allPostsData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1
    } else {
      return -1
    }
  })
}

/**
 * Get posts filtered by category
 */
export function getPostsByCategory(category) {
  const allPosts = getAllPosts()
  if (!category || category === 'all') {
    return allPosts
  }
  return allPosts.filter((post) => post.category === category)
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug) {
  for (const ext of ['.md', '.mdx']) {
    const fullPath = path.join(postsDirectory, `${slug}${ext}`)
    if (fs.existsSync(fullPath)) {
      return await readPost(fullPath, slug)
    }
  }

  return null
}

/**
 * Read and process a post file
 */
async function readPost(fullPath, slug) {
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // Extract headings for TOC
  const headingRegex = /^##\s+(.+)$/gm
  const headings = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    headings.push({ text, id })
  }

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .use(remarkGfm)
    .process(content)

  // Add IDs to h2 elements in HTML for anchor linking
  let contentHtml = processedContent.toString()
  headings.forEach(({ text, id }) => {
    contentHtml = contentHtml.replace(
      new RegExp(
        `<h2>${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h2>`,
        'g',
      ),
      `<h2 id="${id}">${text}</h2>`,
    )
  })

  const readingStats = readingTime(content)

  return {
    slug,
    content: contentHtml,
    headings,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    description: data.description || '',
    category: data.category || 'uncategorized',
    tags: data.tags || [],
    author: data.author || 'Mehmet Temel',
    readingTime: readingStats.text,
    featured: data.featured || false,
    ...data,
  }
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs() {
  const postFiles = getAllPostFiles(postsDirectory)
  return postFiles.map(({ file }) => ({
    slug: file.replace(/\.mdx?$/, ''),
  }))
}

/**
 * Get category display name in Turkish
 */
export function getCategoryName(category) {
  const names = {
    gidalar: 'Gıdalar',
    besinler: 'Besinler',
    mekanizmalar: 'Mekanizmalar',
  }
  return names[category] || category
}

/**
 * Get category icon emoji
 */
export function getCategoryIcon(category) {
  const icons = {
    gidalar: '🍎',
    besinler: '💊',
    mekanizmalar: '🧬',
  }
  return icons[category] || '📄'
}

/**
 * Get all available categories
 */
export function getAllCategories() {
  return CATEGORIES
}
