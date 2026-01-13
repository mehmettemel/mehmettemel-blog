import { NextResponse } from 'next/server'
import { createNote, updateNoteGithubPath } from '@/lib/db'
import { createMarkdownFile } from '@/lib/github'
import {
  handleLink,
  handleNote,
  handleVideo,
  handleBook,
  isURL,
} from '@/lib/gemini'

/**
 * POST /api/kesifler/add
 * Add a new note (link, quote, video, or book) to the system
 *
 * This endpoint is used by the Google Apps Script Telegram bot
 * Flow: Telegram → Google Apps Script → This API → Neon DB + GitHub
 *
 * Body: { text: string }
 * Commands: /link, /alinti, /video, /kitap
 * Response: { success: boolean, type: string, data: object, message: string }
 */
export async function POST(request) {
  try {
    // Parse request body
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Mesaj metni gerekli' },
        { status: 400 },
      )
    }

    console.log(`📩 New request: ${text.substring(0, 50)}...`)

    // Check for commands (support both "/cmd text" and "/cmd\ntext" formats)
    let noteType = null
    let content = text

    // Helper to extract content after command
    const extractContent = (cmd) => {
      // Match command with space or newline
      const regex = new RegExp(`^${cmd}[\\s\\n]+`, 'i')
      return text.replace(regex, '').trim()
    }

    if (text.startsWith('/link ') || text.startsWith('/link\n')) {
      noteType = 'link'
      content = extractContent('/link')
    } else if (text.startsWith('/alinti ') || text.startsWith('/alinti\n')) {
      noteType = 'quote'
      content = extractContent('/alinti')
    } else if (text.startsWith('/video ') || text.startsWith('/video\n')) {
      noteType = 'video'
      content = extractContent('/video')
    } else if (text.startsWith('/kitap ') || text.startsWith('/kitap\n')) {
      noteType = 'book'
      content = extractContent('/kitap')
    }

    // Auto-detect if no command
    if (!noteType) {
      if (isURL(content)) {
        noteType = 'link'
      } else {
        noteType = 'quote' // Default to quote
      }
    }

    // Process based on type
    let categorizedData
    let isMultiNote = false

    switch (noteType) {
      case 'link':
        categorizedData = await handleLink(content)
        console.log(`🔗 Detected as link: ${categorizedData.title}`)
        break
      case 'quote':
        categorizedData = await handleNote(content)
        console.log(`💭 Detected as quote: ${categorizedData.category}`)
        break
      case 'video':
        categorizedData = await handleVideo(content)
        isMultiNote = Array.isArray(categorizedData)
        console.log(
          `🎬 Detected as video: ${isMultiNote ? categorizedData.length + ' notes' : categorizedData.category}`,
        )
        break
      case 'book':
        categorizedData = await handleBook(content)
        isMultiNote = Array.isArray(categorizedData)
        console.log(
          `📖 Detected as book: ${isMultiNote ? categorizedData.length + ' notes' : categorizedData.category}`,
        )
        break
      default:
        throw new Error(`Unknown note type: ${noteType}`)
    }

    // Handle multi-note (video/book can return arrays)
    if (isMultiNote && Array.isArray(categorizedData)) {
      const savedNotes = []

      for (const noteData of categorizedData) {
        // Save to Neon database
        const note = await createNote(noteData)
        console.log(`✅ Saved to DB: note #${note.id}`)

        // Create markdown file in GitHub
        const github = await createMarkdownFile(note)
        console.log(`📁 Created GitHub file: ${github.path}`)

        // Update note with GitHub info
        await updateNoteGithubPath(note.id, github.path, github.sha)

        savedNotes.push({
          id: note.id,
          text: noteData.text,
          github_path: github.path,
        })
      }

      // Return success response for multiple notes
      const typeNames = {
        link: 'Link',
        quote: 'Alıntı',
        video: 'Video',
        book: 'Kitap',
      }

      return NextResponse.json({
        success: true,
        type: noteType,
        count: savedNotes.length,
        data: {
          notes: savedNotes,
          category: categorizedData[0]?.category,
          author: categorizedData[0]?.author,
          source: categorizedData[0]?.source,
        },
        message: `${savedNotes.length} ${typeNames[noteType]} notu başarıyla eklendi!`,
      })
    }

    // Single note (link, quote, or single video/book)
    const note = await createNote(categorizedData)
    console.log(`✅ Saved to DB: note #${note.id}`)

    // Create markdown file in GitHub
    const github = await createMarkdownFile(note)
    console.log(`📁 Created GitHub file: ${github.path}`)

    // Update note with GitHub info
    await updateNoteGithubPath(note.id, github.path, github.sha)

    // Return success response (compatible with Google Apps Script bot)
    const typeNames = {
      link: 'Link',
      quote: 'Alıntı',
      video: 'Video',
      book: 'Kitap',
    }

    return NextResponse.json({
      success: true,
      type: noteType,
      data: {
        id: note.id,
        title: categorizedData.title || null,
        text: categorizedData.text,
        type: categorizedData.category, // For backward compatibility
        category: categorizedData.category,
        url: categorizedData.url || null,
        author: categorizedData.author || null,
        source: categorizedData.source || null,
        tags: categorizedData.tags || [],
        github_path: github.path,
      },
      message: `${typeNames[noteType]} başarıyla eklendi! (DB + GitHub)`,
    })
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
