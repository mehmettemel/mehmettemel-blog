/**
 * Gemini AI Integration for Note Categorization
 * Extracted from existing /api/kesifler/add/route.js
 */

import { toTitleCase } from './utils'

const GEMINI_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_KEY) {
  console.warn(
    'GEMINI_API_KEY is not defined. AI categorization will not work.',
  )
}

/**
 * Call Gemini API with retry logic
 * @param {string} prompt - Prompt text
 * @param {number} retries - Number of retries (default: 3)
 * @param {number} delay - Initial delay in ms (default: 2000)
 * @returns {Promise<string>} AI response text
 */
export async function callGemini(prompt, retries = 3, delay = 2000) {
  if (!GEMINI_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not defined')
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (json.error) {
        // Retry on overload or resource exhausted
        if (
          json.error.message.includes('overloaded') ||
          json.error.status === 'RESOURCE_EXHAUSTED'
        ) {
          if (attempt < retries) {
            console.log(
              `Gemini overloaded, retry ${attempt}/${retries} (waiting ${delay}ms...)`,
            )
            await new Promise((resolve) => setTimeout(resolve, delay * attempt))
            continue
          }
        }
        throw new Error('Gemini API Error: ' + json.error.message)
      }

      if (!json.candidates || !json.candidates[0].content) {
        throw new Error('Gemini returned no response.')
      }

      return json.candidates[0].content.parts[0].text
    } catch (error) {
      if (attempt === retries) {
        throw new Error('Gemini API call failed: ' + error.message)
      }
      // Network error, retry
      console.log(
        `Gemini API error, retry ${attempt}/${retries} (waiting ${delay}ms...)`,
      )
      await new Promise((resolve) => setTimeout(resolve, delay * attempt))
    }
  }
}

/**
 * Handle link categorization with Gemini AI
 * @param {string} url - URL to categorize
 * @returns {Promise<Object>} Categorized link data
 */
export async function handleLink(url) {
  const prompt = `Aşağıdaki URL'yi analiz et ve JSON formatında şu bilgileri döndür (sadece JSON döndür, markdown kod bloğu kullanma):
{
  "title": "Link başlığı",
  "description": "Kısa açıklama (max 150 karakter)",
  "type": "teknik/icerik/diger seçeneklerinden en uygun olanı"
}

URL: ${url}

KATEGORİ SEÇİMİ (3 ana kategori):
- "teknik": Yazılım, kodlama, programlama dilleri, framework'ler, developer tools, tasarım araçları, UI/UX, Figma, Adobe, online araçlar, web uygulamaları, üretkenlik araçları, teknik konular
- "icerik": Blog yazıları, makaleler, tutorial'lar, rehberler, Medium yazıları, haber siteleri, içerik platformları, eğitim kaynakları, podcast'ler, YouTube kanalları, video kursları
- "diger": Yukarıdaki kategorilere uymayan diğer tüm linkler (genel konular, hobi, eğlence, vs.)

ÖNEMLI KURALLAR:
- GitHub repo, npm package, kod kütüphanesi → "teknik"
- Medium/Dev.to yazısı konusu teknik ise → "icerik"
- Figma, Notion, tasarım araçları → "teknik"
- YouTube tutorial/kurs → "icerik"
- Sadece düz JSON döndür, \`\`\`json gibi markdown formatı kullanma.`

  const aiResponse = await callGemini(prompt)

  // Clean markdown code blocks if present
  let cleanResponse = aiResponse.trim()
  cleanResponse = cleanResponse
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')

  // Try to extract JSON from response if it contains extra text
  const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleanResponse = jsonMatch[0]
  }

  let linkData
  try {
    linkData = JSON.parse(cleanResponse)
  } catch (parseError) {
    console.error('Failed to parse Gemini response as JSON:', cleanResponse)
    // Fallback: extract info from URL
    const urlObj = new URL(url)
    linkData = {
      title: urlObj.hostname,
      description: url,
      type: 'diger',
    }
  }

  return {
    type: 'link',
    category: linkData.type,
    title: linkData.title,
    text: linkData.description,
    url: url,
    author: null,
    source: null,
  }
}

/**
 * Handle quote/note categorization with Gemini AI
 * @param {string} text - Note text
 * @returns {Promise<Object>} Categorized note data
 */
export async function handleNote(text) {
  const prompt = `Aşağıdaki notu analiz et ve JSON formatında şu bilgileri döndür (sadece JSON döndür, markdown kod bloğu kullanma):
{
  "text": "Notun kendisi (tırnak işaretlerini koruyarak)",
  "author": "Varsa yazar adı, yoksa null",
  "source": "Varsa kaynak (kitap adı, makale başlığı, konuşma ismi vs.), yoksa null",
  "category": "kisisel/saglik/gida/seyahat/genel kategorilerinden en uygun olanı"
}

${text}

KAYNAK TESPİTİ:
- "Kaynak: ..." ifadesi varsa kaynağı çıkar
- "- Kitap Adı" gibi ifadeler varsa kaynak olarak kullan
- "(Kitap/Konuşma/Makale adı)" şeklinde parantez içinde bilgi varsa kaynağı çıkar
- Yazar adı ile kaynak ayrı tutulmalı (örn: Yazar: Steve Jobs, Kaynak: Stanford Konuşması)
- Kaynak yoksa null döndür

KATEGORİ SEÇİMİ (5 kategori):
- kisisel: Kişisel gelişim, motivasyon, ilham verici alıntılar, hayat dersleri, başarı, mutluluk
- saglik: Sağlık tavsiyeleri, fitness, bağışıklık, vitaminler, egzersiz, mental sağlık
- gida: Yemek tarifleri, beslenme, mutfak ipuçları, gıda bilgisi, diyet
- seyahat: Gezi, tatil, keşif, macera, yer önerileri, seyahat ipuçları
- genel: Yukarıdaki kategorilere uymayan diğer tüm konular (teknoloji, yazılım, tasarım, bilim, kültür, vs.)

ÖNEMLI:
- Sadece düz JSON döndür, \`\`\`json gibi markdown formatı kullanma.
- text alanında tırnak işaretlerini koruyarak düzgün escape et.
- Kategori seçiminde en spesifik kategoriyi tercih et (örn: sağlık konusu ise "genel" yerine "saglik")`

  const aiResponse = await callGemini(prompt)

  // Clean markdown code blocks if present
  let cleanResponse = aiResponse.trim()
  cleanResponse = cleanResponse
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')

  // Try to extract JSON from response if it contains extra text
  const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleanResponse = jsonMatch[0]
  }

  let noteData
  try {
    noteData = JSON.parse(cleanResponse)
  } catch (parseError) {
    console.error('Failed to parse Gemini response as JSON:', cleanResponse)
    // Fallback: use original text as-is with default category
    noteData = {
      text: text,
      author: null,
      source: null,
      category: 'genel',
    }
  }

  return {
    type: 'quote',
    category: noteData.category,
    title: null,
    text: noteData.text,
    url: null,
    author: noteData.author,
    source: noteData.source,
  }
}

/**
 * Handle video note categorization with Gemini AI
 * @param {string} text - Video note text
 * @returns {Promise<Object>} Categorized video note data
 */
export async function handleVideo(text) {
  const prompt = `Aşağıdaki video notunu analiz et ve JSON formatında şu bilgileri döndür (sadece JSON döndür, markdown kod bloğu kullanma):
{
  "notes": ["Alıntı 1", "Alıntı 2", "Alıntı 3"],
  "author": "Konuşmacı veya içerik üreticisi adı (örn: Jensen Huang, Lex Fridman)",
  "source": "Video başlığı veya konu (örn: AI Bubble Interview)",
  "category": "youtube/documentary/course/podcast kategorilerinden en uygun olanı",
  "url": "Video URL'i varsa, yoksa null"
}

 ${text}

PARSE KURALLARI:
1. Tırnak içindeki her metin ("...") AYRI BİR ALINTIDIR - notes array'ine ayrı ayrı ekle
2. Satır başındaki her farklı cümle/paragraf ayrı bir not olabilir
3. İsimler (Jensen Huang, Elon Musk vs.) author alanına git
4. "on ...", "about ...", "hakkında" gibi ifadeler source/konu olarak çıkarılmalı
5. Her alıntıyı notes array'inde AYRI bir eleman olarak döndür

KATEGORİ SEÇİMİ (4 kategori):
- youtube: YouTube videoları, röportajlar, vlogs
- documentary: Belgeseller, uzun format içerikler
- course: Kurs, eğitim, tutorial serisi
- podcast: Podcast'ler, ses içerikleri

ÖNEMLI:
- notes bir ARRAY olmalı, her alıntı ayrı bir string
- Tek alıntı varsa bile array olarak döndür: ["Tek alıntı"]
- Sadece düz JSON döndür, \`\`\`json gibi markdown formatı kullanma`

  const aiResponse = await callGemini(prompt)

  let cleanResponse = aiResponse.trim()
  cleanResponse = cleanResponse
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')

  // Try to extract JSON from response if it contains extra text
  const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleanResponse = jsonMatch[0]
  }

  let videoData
  try {
    videoData = JSON.parse(cleanResponse)
  } catch (parseError) {
    console.error('Failed to parse Gemini response as JSON:', cleanResponse)
    // Fallback: use original text as single note
    videoData = {
      notes: [text],
      author: null,
      source: null,
      category: 'youtube',
      url: null,
    }
  }

  // Ensure notes is an array and not empty
  let notesArray = videoData?.notes

  if (!Array.isArray(notesArray) || notesArray.length === 0) {
    // If text field exists (old format), convert to array
    if (videoData?.text) {
      notesArray = [videoData.text]
    } else {
      // Last fallback: use original input text
      notesArray = [text]
    }
  }

  // Filter out empty notes
  notesArray = notesArray.filter((note) => note && note.trim().length > 0)

  // If still no valid notes, throw error
  if (notesArray.length === 0) {
    throw new Error('Video notunu parse edemedik. Lütfen formatı kontrol edin.')
  }

  // Return array of note objects
  return notesArray.map((noteText) => ({
    type: 'video',
    category: videoData?.category || 'youtube',
    title: null,
    text: noteText.trim(),
    url: videoData?.url || null,
    author: videoData?.author || null,
    source: videoData?.source || null,
  }))
}

/**
 * Handle book note categorization with Gemini AI
 * @param {string} text - Book note text
 * @returns {Promise<Object>} Categorized book note data
 */
export async function handleBook(text) {
  const prompt = `Aşağıdaki kitap notunu analiz et ve JSON formatında şu bilgileri döndür (sadece JSON döndür, markdown kod bloğu kullanma):
{
  "notes": ["Alıntı 1", "Alıntı 2", "Alıntı 3"],
  "author": "Kitabın yazarı (örn: James Clear, Yuval Noah Harari)",
  "source": "Kitap adı (örn: Atomic Habits, Sapiens)",
  "category": "science/selfhelp/biography/fiction/health kategorilerinden en uygun olanı",
  "url": "Kitap link'i varsa (Amazon, Goodreads vs.), yoksa null"
}

${text}

PARSE KURALLARI:
1. Tırnak içindeki her metin ("...") AYRI BİR ALINTIDIR - notes array'ine ayrı ayrı ekle
2. Satır başındaki her farklı cümle/paragraf ayrı bir not olabilir
3. "Yazar:", "Author:", "by" veya "-" ile belirtilen isimler author alanına git
4. "Kitap:", "Book:", "from", "Kaynak:" ile belirtilen başlıklar source alanına git
5. Notlar Türkçe veya İngilizce olabilir, her iki dili de destekle

KATEGORİ SEÇİMİ (5 kategori):
- science: Bilim, araştırma, akademik, tarih, felsefe
- selfhelp: Kişisel gelişim, self-help, motivasyon, alışkanlıklar
- biography: Biyografi, otobiyografi, anı
- fiction: Roman, kurgu, hikaye, edebiyat
- health: Sağlık, fitness, beslenme, psikoloji

ÖNEMLI:
- notes bir ARRAY olmalı, her alıntı ayrı bir string
- Tek alıntı varsa bile array olarak döndür: ["Tek alıntı"]
- Sadece düz JSON döndür, \`\`\`json gibi markdown formatı kullanma`

  const aiResponse = await callGemini(prompt)

  let cleanResponse = aiResponse.trim()
  cleanResponse = cleanResponse
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')

  // Try to extract JSON from response if it contains extra text
  const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleanResponse = jsonMatch[0]
  }

  let bookData
  try {
    bookData = JSON.parse(cleanResponse)
  } catch (parseError) {
    console.error('Failed to parse Gemini response as JSON:', cleanResponse)
    // Fallback: use original text as single note
    bookData = {
      notes: [text],
      author: null,
      source: null,
      category: 'selfhelp',
      url: null,
    }
  }

  // Ensure notes is an array and not empty
  let notesArray = bookData?.notes

  if (!Array.isArray(notesArray) || notesArray.length === 0) {
    // If text field exists (old format), convert to array
    if (bookData?.text) {
      notesArray = [bookData.text]
    } else {
      // Last fallback: use original input text
      notesArray = [text]
    }
  }

  // Filter out empty notes
  notesArray = notesArray.filter((note) => note && note.trim().length > 0)

  // If still no valid notes, throw error
  if (notesArray.length === 0) {
    throw new Error('Kitap notunu parse edemedik. Lütfen formatı kontrol edin.')
  }

  // Return array of note objects
  return notesArray.map((noteText) => ({
    type: 'book',
    category: bookData?.category || 'selfhelp',
    title: null,
    text: noteText.trim(),
    url: bookData?.url || null,
    author: bookData?.author || null,
    source: bookData?.source || null,
  }))
}

/**
 * Handle cache item with AI - finds author/director/brand automatically
 * Uses Gemini AI to enrich cache items with metadata
 *
 * @param {string} type - Cache type: 'kitap' (book), 'film' (movie/show), 'urun' (product)
 * @param {string} text - Item name (e.g., "Zero to One", "Inception", "iPhone 15")
 * @returns {Promise<Object>} Cache item data with name, author, and cache_type
 */
export async function handleCacheItemWithAI(type, text) {
  const trimmedText = text.trim()

  // Determine what to search for based on type
  const searchType =
    {
      kitap: 'book author',
      film: 'movie/TV show director',
      urun: 'product brand/manufacturer',
    }[type] || 'creator'

  const prompt = `Find information about this ${type === 'kitap' ? 'book' : type === 'film' ? 'movie or TV show' : 'product'}:
"${trimmedText}"

${type === 'kitap' ? 'Find the author and a short description of this book.' : ''}
${type === 'film' ? 'Find the director and a short description of this movie or TV show.' : ''}
${type === 'urun' ? 'Find the brand/manufacturer and a short description of this product.' : ''}

Return ONLY a JSON object with this exact format (no markdown, no explanation):
{
  "name": "full correct name of the ${type === 'kitap' ? 'book' : type === 'film' ? 'movie/show' : 'product'}",
  "author": "${type === 'kitap' ? 'author name' : type === 'film' ? 'director name' : 'brand name'}",
  "description": "3-4 lines describing what this ${type === 'kitap' ? 'book' : type === 'film' ? 'movie/show' : 'product'} is about (in Turkish)"
}

If you cannot find the ${searchType}, return:
{
  "name": "${trimmedText}",
  "author": null,
  "description": null
}

Important:
- Return ONLY the JSON object, nothing else
- Description must be in Turkish (Türkçe)
- Description should be 3-4 lines maximum
- Description should explain what the ${type === 'kitap' ? 'book' : type === 'film' ? 'movie/show' : 'product'} is about`

  try {
    const response = await callGemini(prompt, 3, 2000)

    // callGemini already returns the text content directly
    let jsonText = response.trim()

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '')
    }

    const data = JSON.parse(jsonText)

    console.log('[AI Cache] Enriched cache item:', data)

    // Apply title case formatting to name and author
    const name = toTitleCase(data.name || trimmedText)
    const author = data.author ? toTitleCase(data.author) : null
    const description = data.description || null

    return {
      name,
      author,
      description,
      cache_type: type,
    }
  } catch (error) {
    console.error('[AI Cache] Failed to enrich cache item:', error)
    // Fallback: return without author and description (still apply title case)
    return {
      name: toTitleCase(trimmedText),
      author: null,
      description: null,
      cache_type: type,
    }
  }
}

/**
 * Handle cache item (no AI needed, simple text extraction)
 * @param {string} type - Cache type: 'kitap', 'film', or 'urun'
 * @param {string} text - Item name
 * @returns {Object} Cache item data
 */
export function handleCacheItem(type, text) {
  return {
    name: toTitleCase(text.trim()),
    cache_type: type,
  }
}

/**
 * Detect if text is a URL
 * @param {string} text - Text to check
 * @returns {boolean} True if URL
 */
export function isURL(text) {
  const urlPattern =
    /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$|^www\.[\w-]+\.[\w-]+(\/[\w-./?%&=]*)?$/i
  return urlPattern.test(text.trim())
}
