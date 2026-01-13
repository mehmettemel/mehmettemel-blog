import { NextResponse } from 'next/server'
import { createNote, updateNoteGithubPath, getNotesStats } from '@/lib/db'
import { createMarkdownFile } from '@/lib/github'
import {
  callGemini,
  handleLink,
  handleNote,
  handleVideo,
  handleBook,
  isURL,
} from '@/lib/gemini'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const ALLOWED_USER_IDS = process.env.TELEGRAM_ALLOWED_USER_IDS
  ? process.env.TELEGRAM_ALLOWED_USER_IDS.split(',').map((id) =>
      parseInt(id.trim()),
    )
  : []

/**
 * Send a message to Telegram chat
 * @param {number} chatId - Telegram chat ID
 * @param {string} text - Message text (supports Markdown)
 * @returns {Promise<void>}
 */
async function sendTelegramMessage(chatId, text) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not defined')
    return
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      },
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Telegram sendMessage error:', error)
    }
  } catch (error) {
    console.error('Failed to send Telegram message:', error)
  }
}

/**
 * Parse message to determine type and content
 * @param {string} text - Message text
 * @returns {Object|null} { type, content } or null if needs AI detection
 */
function parseMessage(text) {
  const commands = {
    '/link': 'link',
    '/quote': 'quote',
    '/alinti': 'quote',
    '/video': 'video',
    '/book': 'book',
    '/kitap': 'book',
  }

  // Check for commands (support both "/cmd text" and "/cmd\ntext" formats)
  for (const [cmd, type] of Object.entries(commands)) {
    if (text.startsWith(cmd + ' ') || text.startsWith(cmd + '\n')) {
      // Extract content after command (remove command and leading whitespace/newlines)
      const regex = new RegExp(`^${cmd}[\\s\\n]+`, 'i')
      const content = text.replace(regex, '').trim()
      return { type, content }
    }
  }

  // Auto-detect URL as link
  if (isURL(text)) {
    return {
      type: 'link',
      content: text.trim(),
    }
  }

  // Need AI detection
  return null
}

/**
 * POST /api/telegram/webhook
 * Handle incoming Telegram webhook updates
 */
export async function POST(request) {
  let chatId
  let update

  try {
    update = await request.json()

    // Check if it's a message
    if (!update.message || !update.message.text) {
      return NextResponse.json({ ok: true })
    }

    const { message } = update
    chatId = message.chat.id
    const userId = message.from.id
    const text = message.text

    console.log(
      `Telegram message from user ${userId}: ${text.substring(0, 50)}...`,
    )

    // Check user authorization
    if (ALLOWED_USER_IDS.length > 0 && !ALLOWED_USER_IDS.includes(userId)) {
      await sendTelegramMessage(chatId, '❌ Bu botu kullanma yetkiniz yok.')
      return NextResponse.json({ ok: true })
    }

    // Handle /help command
    if (text === '/help') {
      await sendTelegramMessage(
        chatId,
        `📚 *Keşifler Bot Kullanım Kılavuzu*

*Komutlar:*
/link [url] - Link ekle
/quote [text] - Alıntı/not ekle
/video [text] - Video notu ekle
/book [text] - Kitap notu ekle
/stats - İstatistikler
/help - Bu mesaj

*Örnekler:*
\`\`\`
/link https://ui-skills.com

/quote D vitamini bağışıklık için önemlidir
Yazar: Osman Müftüoğlu

/video React hooks explained
Source: freeCodeCamp

/book Consistency is key
Author: James Clear
Source: Atomic Habits
\`\`\`

*Not:* URL gönderirseniz otomatik link olarak algılanır.`,
      )
      return NextResponse.json({ ok: true })
    }

    // Handle /stats command
    if (text === '/stats') {
      try {
        const stats = await getNotesStats()
        const byType = stats.byType || {}

        const statsText = `📊 *İstatistikler*

📝 Toplam: ${stats.total} not

🔗 Link: ${byType.link || 0}
💭 Alıntı: ${byType.quote || 0}
🎬 Video: ${byType.video || 0}
📖 Kitap: ${byType.book || 0}`

        await sendTelegramMessage(chatId, statsText)
      } catch (error) {
        await sendTelegramMessage(
          chatId,
          '❌ İstatistikler alınırken hata oluştu.',
        )
      }
      return NextResponse.json({ ok: true })
    }

    // Start processing message
    await sendTelegramMessage(chatId, '⏳ Not işleniyor...')

    // Parse message
    let parsed = parseMessage(text)

    // If no command found, default to quote
    if (!parsed) {
      parsed = { type: 'quote', content: text }
    }

    // Categorize content with Gemini AI
    let categorizedData

    switch (parsed.type) {
      case 'link':
        categorizedData = await handleLink(parsed.content)
        break
      case 'quote':
        categorizedData = await handleNote(parsed.content)
        break
      case 'video':
        categorizedData = await handleVideo(parsed.content)
        break
      case 'book':
        categorizedData = await handleBook(parsed.content)
        break
      default:
        throw new Error(`Unknown note type: ${parsed.type}`)
    }

    // Save to database
    const note = await createNote(categorizedData)

    console.log(`Created note #${note.id} (${note.note_type}/${note.category})`)

    // Push to GitHub
    const github = await createMarkdownFile(note)
    await updateNoteGithubPath(note.id, github.path, github.sha)

    console.log(`GitHub sync complete: ${github.path}`)

    // Send success message
    const emoji = { link: '🔗', quote: '💭', video: '🎬', book: '📖' }[
      parsed.type
    ]

    const successMessage = `✅ ${emoji} *Not eklendi!*

📁 Kategori: ${categorizedData.category}
🔗 GitHub: \`${github.path}\`
🆔 ID: ${note.id}`

    await sendTelegramMessage(chatId, successMessage)

    return NextResponse.json({ ok: true, noteId: note.id })
  } catch (error) {
    console.error('Telegram webhook error:', error)

    // Send error message to user
    if (chatId) {
      const errorMessage = `❌ *Hata oluştu*

${error.message}

💡 /help komutu ile kullanım kılavuzunu görebilirsiniz.`

      await sendTelegramMessage(chatId, errorMessage)
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * GET /api/telegram/webhook
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Telegram webhook is active',
    botConfigured: !!TELEGRAM_BOT_TOKEN,
    userFilterEnabled: ALLOWED_USER_IDS.length > 0,
  })
}
