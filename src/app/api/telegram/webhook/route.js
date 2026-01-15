import { NextResponse } from 'next/server'
import { createNote, getNotesStats, createCacheItem } from '@/lib/db'
import {
  callGemini,
  handleLink,
  handleNote,
  handleVideo,
  handleBook,
  handleCacheItem,
  handleCacheItemWithAI,
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
    throw new Error('Telegram bot token not configured')
  }

  // Validate text parameter
  if (!text || typeof text !== 'string') {
    console.error('Invalid text parameter for Telegram message:', text)
    throw new Error('Invalid message text')
  }

  try {
    const payload = {
      chat_id: chatId,
      text: text.substring(0, 4096), // Telegram has 4096 char limit
      parse_mode: 'HTML', // HTML is more reliable than Markdown
    }

    console.log('Sending Telegram message:', {
      chat_id: chatId,
      text_length: text?.length || 0,
      text_preview: (text || '').substring(0, 100) + '...'
    })

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    )

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Telegram API error response:', JSON.stringify(responseData, null, 2))
      throw new Error(`Telegram API error: ${responseData.description || 'Unknown error'}`)
    }

    console.log('Telegram message sent successfully')
    return responseData
  } catch (error) {
    console.error('Failed to send Telegram message:', error)
    console.error('Message text:', text)
    throw error
  }
}

/**
 * Parse message to determine type and content
 * @param {string} text - Message text
 * @returns {Object|null} { type, content } or null if needs AI detection
 */
function parseMessage(text) {
  // IMPORTANT: Order commands by length (longest first) to avoid conflicts
  // For example: /cache-kitap before /kitap, /kitap before /k
  const commands = [
    // Long cache commands first
    ['/cache-kitap', 'cache-kitap'],
    ['/cache-film', 'cache-film'],
    ['/cache-urun', 'cache-urun'],
    // Medium length commands
    ['/kitap', 'book'],
    ['/alinti', 'quote'],
    ['/video', 'video'],
    ['/quote', 'quote'],
    ['/book', 'book'],
    ['/link', 'link'],
    // Short cache commands last (single letter)
    ['/k', 'cache-kitap'],
    ['/f', 'cache-film'],
    ['/u', 'cache-urun'],
  ]

  // Check for commands (support both "/cmd text" and "/cmd\ntext" formats)
  for (const [cmd, type] of commands) {
    if (text.startsWith(cmd + ' ') || text.startsWith(cmd + '\n')) {
      // Extract content after command (remove command and leading whitespace/newlines)
      const regex = new RegExp(`^${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\n]+`, 'i')
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
        `📚 <b>Keşifler Bot Kullanım Kılavuzu</b>

<b>Not Komutları:</b>
/link [url] - Link ekle
/quote [text] - Alıntı/not ekle
/video [text] - Video notu ekle
/book [text] - Kitap notu ekle

<b>Cache Komutları (Kısa):</b>
/k [isim -yazar] - Kitap ekle
/f [isim -yönetmen] - Film/dizi ekle
/u [isim -marka] - Ürün ekle

<b>Cache Komutları (Uzun):</b>
/cache-kitap [isim] - Kitap ekle
/cache-film [isim] - Film/dizi ekle
/cache-urun [isim] - Ürün ekle

<b>Diğer:</b>
/stats - İstatistikler
/help - Bu mesaj

<b>Örnekler:</b>
<pre>
/k zero to one -peter thiel
/k atomic habits -james clear
/f inception -christopher nolan
/u iphone 15 pro -apple

/cache-kitap Sapiens
/cache-film Breaking Bad

/link https://ui-skills.com
/quote D vitamini bağışıklık için önemlidir
</pre>

<b>İpucu:</b>
• "-" işaretiyle yazar/yönetmen ekleyebilirsiniz
• URL gönderirseniz otomatik link olarak algılanır`,
      )
      return NextResponse.json({ ok: true })
    }

    // Handle /stats command
    if (text === '/stats') {
      try {
        const stats = await getNotesStats()
        const byType = stats.byType || {}

        const statsText = `📊 <b>İstatistikler</b>

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
    try {
      await sendTelegramMessage(chatId, '⏳ Not işleniyor...')
    } catch (statusError) {
      console.warn('Failed to send status message, continuing...', statusError)
    }

    // Parse message
    let parsed = parseMessage(text)

    // If no command found, default to quote
    if (!parsed) {
      parsed = { type: 'quote', content: text }
    }

    // Handle cache items with AI enrichment
    if (parsed.type === 'cache-kitap' || parsed.type === 'cache-film' || parsed.type === 'cache-urun') {
      const cacheType = parsed.type.replace('cache-', '')

      try {
        // Use AI to find author/director/brand
        const cacheData = await handleCacheItemWithAI(cacheType, parsed.content)
        const cacheItem = await createCacheItem(cacheData)

        const emoji = { kitap: '📚', film: '🎬', urun: '🛍️' }[cacheType] || '📋'
        const categoryName = { kitap: 'Kitap', film: 'Film/Dizi', urun: 'Ürün' }[cacheType] || 'Cache'

        const authorText = cacheItem.author ? `\n✍️ ${cacheItem.author}` : ''
        await sendTelegramMessage(
          chatId,
          `✅ ${emoji} <b>${categoryName} eklendi!</b>\n\n📝 ${cacheItem.name}${authorText}\n\nID: ${cacheItem.id}`
        )

        return NextResponse.json({ ok: true, cacheId: cacheItem.id })
      } catch (error) {
        throw new Error(`Cache item eklenemedi: ${error.message}`)
      }
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

    // Validate categorizedData
    if (!categorizedData) {
      throw new Error('Not verisi oluşturulamadı. Lütfen tekrar deneyin.')
    }

    // Check if multi-note (video/book can return arrays)
    const isMultiNote = Array.isArray(categorizedData)
    console.log('Is multi-note:', isMultiNote)
    console.log('Categorized data length:', Array.isArray(categorizedData) ? categorizedData.length : 'N/A')

    // Validate array has items
    if (isMultiNote && categorizedData.length === 0) {
      throw new Error('Hiçbir not bulunamadı. Lütfen formatı kontrol edin.')
    }

    if (isMultiNote) {
      console.log('Processing multiple notes...')
      // Handle multiple notes
      const savedNotes = []

      for (let i = 0; i < categorizedData.length; i++) {
        const noteData = categorizedData[i]
        console.log(`Processing note ${i + 1}/${categorizedData.length}:`, {
          hasType: !!noteData?.type,
          hasText: !!noteData?.text,
          hasCategory: !!noteData?.category
        })

        if (!noteData || !noteData.type || !noteData.text) {
          console.warn('Invalid note data, skipping:', noteData)
          continue
        }

        const note = await createNote(noteData)
        console.log(
          `Created note #${note.id} (${note.note_type}/${note.category})`,
        )

        savedNotes.push({
          id: note.id,
        })
      }

      console.log(`Saved ${savedNotes.length} notes successfully`)

      // Check if any notes were saved
      if (savedNotes.length === 0) {
        throw new Error('Notlar kaydedilemedi. Lütfen formatı kontrol edin.')
      }

      // Send success message for multiple notes
      const emoji = { link: '🔗', quote: '💭', video: '🎬', book: '📖' }[
        parsed.type
      ] || '📝'

      const firstNote = Array.isArray(categorizedData) && categorizedData.length > 0
        ? categorizedData[0]
        : {}

      // Safe array operations
      const noteIds = Array.isArray(savedNotes) && savedNotes.length > 0
        ? savedNotes
            .map((n) => n?.id)
            .filter((id) => id != null)
            .join(', ')
        : 'N/A'

      // Escape HTML special characters
      const escapeHtml = (text) => {
        if (!text) return ''
        try {
          return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
        } catch (e) {
          console.error('escapeHtml error:', e)
          return ''
        }
      }

      const category = escapeHtml(firstNote?.category || 'Belirtilmemiş')
      const source = escapeHtml(firstNote?.source || 'Belirtilmemiş')
      const author = escapeHtml(firstNote?.author || 'Belirtilmemiş')

      const successMessage = `✅ ${emoji} <b>${savedNotes?.length || 0} not eklendi!</b>

Kategori: ${category}
Kaynak: ${source}
Yazar: ${author}
ID: ${noteIds}`

      console.log('Sending success message:', successMessage)

      // Try to send success message but don't let it fail the whole operation
      try {
        await sendTelegramMessage(chatId, successMessage)
      } catch (msgError) {
        console.error('Failed to send formatted success message:', msgError)
        // Fallback: send simple message without special formatting
        try {
          await sendTelegramMessage(chatId, `✅ ${savedNotes.length} not eklendi! ID: ${noteIds}`)
        } catch (fallbackError) {
          console.error('Failed to send fallback message too:', fallbackError)
          // Last resort: send minimal message without any variables
          try {
            await sendTelegramMessage(chatId, '✅ Not eklendi!')
          } catch (minimalError) {
            console.error('All message attempts failed, but note was saved:', minimalError)
            // Don't throw - note was saved successfully
          }
        }
      }

      // Always return success if notes were saved
      return NextResponse.json({
        ok: true,
        noteIds: savedNotes.map((n) => n?.id).filter(Boolean),
      })
    }

    // Validate single note data
    if (!categorizedData || !categorizedData.type || !categorizedData.category) {
      throw new Error('Not formatı hatalı. Lütfen tekrar deneyin.')
    }

    // Save single note to database
    const note = await createNote(categorizedData)

    console.log(`Created note #${note.id} (${note.note_type}/${note.category})`)

    // Send success message
    const emoji = { link: '🔗', quote: '💭', video: '🎬', book: '📖' }[
      parsed.type
    ] || '📝'

    // Escape HTML special characters
    const escapeHtml = (text) => {
      if (!text) return ''
      try {
        return String(text)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      } catch (e) {
        console.error('escapeHtml error:', e)
        return ''
      }
    }

    const category = escapeHtml(categorizedData?.category || 'Belirtilmemiş')

    const successMessage = `✅ ${emoji} <b>Not eklendi!</b>

Kategori: ${category}
ID: ${note?.id || 'N/A'}`

    console.log('Sending success message:', successMessage)

    // Try to send success message but don't let it fail the whole operation
    try {
      await sendTelegramMessage(chatId, successMessage)
    } catch (msgError) {
      console.error('Failed to send formatted success message:', msgError)
      // Fallback: send simple message without special formatting
      try {
        await sendTelegramMessage(chatId, `✅ Not eklendi! ID: ${note.id}`)
      } catch (fallbackError) {
        console.error('Failed to send fallback message too:', fallbackError)
        // Last resort: send minimal message
        try {
          await sendTelegramMessage(chatId, '✅ Not eklendi!')
        } catch (minimalError) {
          console.error('All message attempts failed, but note was saved:', minimalError)
          // Don't throw - note was saved successfully
        }
      }
    }

    // Always return success if note was saved
    return NextResponse.json({ ok: true, noteId: note.id })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    console.error('Error stack:', error?.stack)
    console.error('Error type:', typeof error)

    // Send error message to user
    if (chatId) {
      try {
        // Get user-friendly error message
        let userMessage = error?.message || String(error) || 'Bilinmeyen bir hata oluştu.'

        // Ensure userMessage is a string
        userMessage = String(userMessage)

        // Truncate very long error messages
        if (userMessage && userMessage.length > 500) {
          userMessage = userMessage.substring(0, 500) + '...'
        }

        // Add hints based on error type
        let hint = ''
        if (userMessage.includes('parse')) {
          hint = '\n\n💡 İpucu: Mesajınızın formatını kontrol edin.'
        } else if (userMessage.includes('length') || userMessage.includes('undefined')) {
          hint = '\n\n💡 İpucu: Not eklerken doğru formatı kullanın. /help ile örneklere bakın.'
        } else if (userMessage.includes('Gemini')) {
          hint = '\n\n💡 İpucu: AI işleme sırasında bir sorun oluştu. Lütfen tekrar deneyin.'
        }

        const errorMessage = `❌ <b>Hata oluştu</b>

${userMessage}${hint}

📖 /help komutu ile kullanım kılavuzunu görebilirsiniz.`

        await sendTelegramMessage(chatId, errorMessage)
      } catch (msgError) {
        console.error('Failed to send error message to user:', msgError)
        // Try to send a simple fallback message
        await sendTelegramMessage(chatId, '❌ Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    }

    return NextResponse.json(
      { error: error?.message || 'Unknown error' },
      { status: 500 }
    )
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
