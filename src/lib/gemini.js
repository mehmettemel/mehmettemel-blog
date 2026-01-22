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
  "description": "Kısa açıklama (max 150 karakter)"
}

URL: ${url}

ÖNEMLI: Sadece düz JSON döndür, \`\`\`json gibi markdown formatı kullanma.`

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
    }
  }

  return {
    type: 'link',
    category: null, // Links don't have categories
    title: linkData.title,
    text: linkData.description,
    url: url,
    author: null,
    source: null,
  }
}

/**
 * Handle quote/note categorization with Gemini AI
 * Saves the ENTIRE text as ONE note (no splitting)
 * Only extracts author, source and category
 * @param {string} text - Note text
 * @returns {Promise<Object>} Categorized note data (single object)
 */
export async function handleNote(text) {
  // Separate the main text from the author/source part
  // If there's a "-" at the end, that's the author/source
  // IMPORTANT: Preserve internal line breaks and whitespace!
  let mainText = text
  let authorHint = null

  // Check if text ends with "- Author Name" pattern (on last line)
  // The dash must be preceded by whitespace or newline (not mid-word like "Omega-3")
  // Match: text + (newline or spaces) + dash + spaces + author name at the end
  const dashMatch = text.match(/^([\s\S]+?)(?:\n|[ \t]+)-\s*([^\n]+)$/)
  if (dashMatch) {
    // Keep original whitespace/line breaks, only trim the very edges
    mainText = dashMatch[1].replace(/^\s+|\s+$/g, '')
    authorHint = dashMatch[2].trim()
  } else {
    // No author pattern found, just trim edges but keep internal formatting
    mainText = text.replace(/^\s+|\s+$/g, '')
  }

  const prompt = `Aşağıdaki alıntıyı/notu analiz et ve JSON formatında şu bilgileri döndür (sadece JSON döndür, markdown kod bloğu kullanma):
{
  "author": "Varsa yazar adı, yoksa null",
  "source": "Varsa kaynak (kitap adı, konuşma, makale vs.), yoksa null",
  "category": "gida/saglik/kisisel/genel kategorilerinden en uygun olanı"
}

${authorHint ? `Yazar/Kaynak ipucu: ${authorHint}` : ''}

Metin:
${mainText}

KATEGORİ SEÇİMİ (4 kategori):
- gida: Yemek tarifleri, beslenme, mutfak ipuçları, gıda bilgisi, diyet, yemek kültürü
- saglik: Sağlık tavsiyeleri, fitness, bağışıklık, vitaminler, egzersiz, mental sağlık, wellness
- kisisel: Kişisel gelişim, motivasyon, ilham verici alıntılar, hayat dersleri, başarı, mutluluk, alışkanlıklar, üretkenlik
- genel: Yukarıdaki kategorilere uymayan diğer tüm konular (seyahat, teknoloji, genel bilgi, vs.)

KAYNAK TESPİTİ:
- İsim varsa → author alanına (örn: "Professor Jiang", "Steve Jobs")
- Kaynak varsa → source alanına (örn: "Stanford Konuşması", "Atomic Habits")
- İkisi birlikte varsa ayrı ayrı doldur

ÖNEMLI:
- "seyahat" kategorisi artık YOK → içeriğe göre "kisisel" veya "genel" seç
- Sadece düz JSON döndür, \`\`\`json gibi markdown formatı kullanma`

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
      author: authorHint || null,
      source: null,
      category: 'genel',
    }
  }

  // Return SINGLE note object (not array)
  // The entire mainText is preserved as one note
  return {
    type: 'quote',
    category: noteData?.category || 'genel',
    title: null,
    text: mainText,
    url: null,
    author: noteData?.author || null,
    source: noteData?.source || null,
  }
}

/**
 * Handle video note categorization with Gemini AI
 * Supports multiple notes with "-" for source
 * @param {string} text - Video note text
 * @returns {Promise<Array>} Categorized video note data array
 */
export async function handleVideo(text) {
  const prompt = `Aşağıdaki video notunu analiz et ve JSON formatında şu bilgileri döndür (sadece JSON döndür, markdown kod bloğu kullanma):
{
  "notes": ["Alıntı 1", "Alıntı 2", "Alıntı 3"],
  "author": "Konuşmacı veya içerik üreticisi adı (örn: Jensen Huang, Lex Fridman)",
  "source": "Video başlığı veya konu (örn: AI Bubble Interview, Huberman Lab)",
  "category": "gida/saglik/kisisel/genel kategorilerinden en uygun olanı",
  "url": "Video URL'i varsa, yoksa null"
}

${text}

PARSE KURALLARI:
1. Tırnak içindeki her metin ("...") AYRI BİR ALINTIDIR - notes array'ine ayrı ayrı ekle
2. Yan yana yazılan farklı notlar ayrı ayrı parse edilmeli
   Örnek: "Not 1" "Not 2" "Not 3" → notes: ["Not 1", "Not 2", "Not 3"]
3. "-" işaretinden sonra gelen metin KAYNAK (source) veya KONUŞMACI (author)'dır, NOT DEĞİLDİR
   Örnek: "AI önemli" "Gelecek parlak" - Jensen Huang AI Interview
   → notes: ["AI önemli", "Gelecek parlak"], author: "Jensen Huang", source: "AI Interview"
4. İsimler (Jensen Huang, Elon Musk, Huberman vs.) author alanına gitmeli
5. Konu/video başlığı (AI Bubble, Sleep Toolkit, Interview) source alanına gitmeli

KAYNAK TESPİTİ (ÖNCELİK SIRASI):
1. "-" sonrası isim + konu varsa → isim author'a, konu source'a
2. Sadece isim varsa → author alanına
3. Kanal/program adı (Huberman Lab, Lex Fridman Podcast) → source alanına

KATEGORİ SEÇİMİ (4 kategori - İÇERİĞE GÖRE):
- gida: Yemek videoları, tarif, beslenme, mutfak, yemek kültürü
- saglik: Sağlık, fitness, egzersiz, bağışıklık, mental sağlık, wellness, psikoloji
- kisisel: Kişisel gelişim, motivasyon, verimlilik, eğitim, kurslar, başarı, kariyer
- genel: Diğer tüm konular (teknoloji, bilim, haber, eğlence, belgesel, podcast)

ÖNEMLI:
- Platform (YouTube, podcast vs.) artık ÖNEMLİ DEĞİL - sadece İÇERİK konusuna bak
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
  "category": "gida/saglik/kisisel/genel kategorilerinden en uygun olanı",
  "url": "Kitap link'i varsa (Amazon, Goodreads vs.), yoksa null"
}

${text}

PARSE KURALLARI:
1. Tırnak içindeki her metin ("...") AYRI BİR ALINTIDIR - notes array'ine ayrı ayrı ekle
2. Satır başındaki her farklı cümle/paragraf ayrı bir not olabilir
3. "Yazar:", "Author:", "by" veya "-" ile belirtilen isimler author alanına git
4. "Kitap:", "Book:", "from", "Kaynak:" ile belirtilen başlıklar source alanına git
5. Notlar Türkçe veya İngilizce olabilir, her iki dili de destekle

KATEGORİ SEÇİMİ (4 kategori - İÇERİĞE GÖRE):
- gida: Yemek kitapları, beslenme, diyet, mutfak, tarif kitapları, yemek kültürü
- saglik: Sağlık, fitness, psikoloji, wellness, beslenme bilimi, mental sağlık
- kisisel: Kişisel gelişim, self-help, motivasyon, alışkanlıklar, başarı, kariyer, üretkenlik
- genel: Diğer tüm konular (bilim, tarih, felsefe, kurgu, biyografi, roman, edebiyat)

ÖNEMLI:
- Tür (science, biography, fiction) artık ÖNEMLİ DEĞİL - kitabın ana KONUSUNA bak
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
 * Handle list item with AI - finds author/director/brand automatically
 * Uses Gemini AI to enrich list items with metadata
 *
 * @param {string} type - List type: 'kitap' (book), 'film' (movie/show), 'urun' (product)
 * @param {string} text - Item name (e.g., "Zero to One", "Inception", "iPhone 15")
 * @returns {Promise<Object>} List item data with name, author, and list_type
 */
export async function handleListItemWithAI(type, text) {
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

    console.log('[AI List] Enriched list item:', data)

    // Apply title case formatting to name and author
    const name = toTitleCase(data.name || trimmedText)
    const author = data.author ? toTitleCase(data.author) : null
    const description = data.description || null

    return {
      name,
      author,
      description,
      list_type: type,
    }
  } catch (error) {
    console.error('[AI List] Failed to enrich list item:', error)
    // Fallback: return without author and description (still apply title case)
    return {
      name: toTitleCase(trimmedText),
      author: null,
      description: null,
      list_type: type,
    }
  }
}

/**
 * Handle recipe parsing and formatting with Gemini AI
 * Parses recipe text and extracts structured data
 * @param {string} text - Recipe text from Telegram
 * @returns {Promise<Object>} Structured recipe data
 */
export async function handleRecipe(text) {
  const prompt = `Aşağıdaki tarif metnini analiz et ve yapılandırılmış JSON formatında döndür.
SADECE isim, malzemeler ve yapılış bilgilerini çıkar.

${text}

Şu JSON formatında döndür (sadece JSON döndür, markdown kod bloğu kullanma):
{
  "name": "Tarif adı (kısa ve açıklayıcı)",
  "ingredients": "Malzemeler listesi (her malzeme yeni satırda, ölçü birimleri ile)",
  "instructions": "Yapılış adımları (her adım numaralandırılmış ve detaylı)"
}

KURALLAR:
1. Tüm metni dikkatlice oku
2. Malzemeler listesini düzenli formatta yaz (her satırda bir malzeme)
3. Yapılış adımlarını numaralandır ve detaylı açıkla
4. ingredients ve instructions MUTLAKA tam ve eksiksiz olmalı

ÖNEMLI: Sadece düz JSON döndür, \`\`\`json gibi markdown formatı kullanma.`

  const aiResponse = await callGemini(prompt, 3, 2000)

  // Clean markdown code blocks if present
  let cleanResponse = aiResponse.trim()
  cleanResponse = cleanResponse
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')

  // Try to extract JSON from response
  const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleanResponse = jsonMatch[0]
  }

  let recipeData
  try {
    recipeData = JSON.parse(cleanResponse)
  } catch (parseError) {
    console.error('Failed to parse recipe JSON:', cleanResponse)
    throw new Error('Tarif formatı okunamadı. Lütfen tarifinizi düzgün formatta yazın.')
  }

  // Validate required fields
  if (!recipeData.name || !recipeData.ingredients || !recipeData.instructions) {
    throw new Error('Tarif eksik bilgi içeriyor. Malzemeler ve yapılış mutlaka olmalı.')
  }

  return {
    name: recipeData.name,
    ingredients: recipeData.ingredients,
    instructions: recipeData.instructions,
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

