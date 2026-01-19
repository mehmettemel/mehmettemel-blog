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
  "category": "kisisel/saglik/gida/seyahat/genel kategorilerinden en uygun olanı"
}

${authorHint ? `Yazar/Kaynak ipucu: ${authorHint}` : ''}

Metin:
${mainText}

KATEGORİ SEÇİMİ (5 kategori):
- kisisel: Kişisel gelişim, motivasyon, ilham verici alıntılar, hayat dersleri, başarı, mutluluk
- saglik: Sağlık tavsiyeleri, fitness, bağışıklık, vitaminler, egzersiz, mental sağlık
- gida: Yemek tarifleri, beslenme, mutfak ipuçları, gıda bilgisi, diyet
- seyahat: Gezi, tatil, keşif, macera, yer önerileri, seyahat ipuçları
- genel: Yukarıdaki kategorilere uymayan diğer tüm konular

KAYNAK TESPİTİ:
- İsim varsa → author alanına (örn: "Professor Jiang", "Steve Jobs")
- Kaynak varsa → source alanına (örn: "Stanford Konuşması", "Atomic Habits")
- İkisi birlikte varsa ayrı ayrı doldur

ÖNEMLI: Sadece düz JSON döndür, \`\`\`json gibi markdown formatı kullanma`

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
  "category": "youtube/documentary/course/podcast kategorilerinden en uygun olanı",
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
 * Handle list item (no AI needed, simple text extraction)
 * @param {string} type - List type: 'kitap', 'film', or 'urun'
 * @param {string} text - Item name
 * @returns {Object} List item data
 */
export function handleListItem(type, text) {
  return {
    name: toTitleCase(text.trim()),
    list_type: type,
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

/**
 * Handle travel place with AI - determines continent → country → city/place
 * Uses Gemini AI to analyze travel locations and categorize them hierarchically
 *
 * @param {string} text - Place name (e.g., "Eiffel Tower", "Istanbul", "Cappadocia")
 * @returns {Promise<Object>} Travel place data with continent, country, place_name, place_type, description
 */
export async function handleTravelPlace(text) {
  const trimmedText = text.trim()

  const prompt = `Analyze this travel location and return a JSON object:
"${trimmedText}"

Return ONLY a JSON object with this exact format (no markdown, no explanation):
{
  "continent": "continent name in Turkish (Avrupa, Asya, Afrika, Kuzey Amerika, Güney Amerika, Okyanusya)",
  "country": "country name in Turkish",
  "place_name": "specific place name (city, attraction, or region)",
  "place_type": "city|attraction|region",
  "description": "2-3 line description in Turkish about what makes this place special"
}

CLASSIFICATION RULES:
- place_type "city": Paris, Tokyo, Istanbul (urban areas)
- place_type "attraction": Eiffel Tower, Colosseum, Great Wall (specific landmarks/monuments)
- place_type "region": Cappadocia, Tuscany, Provence (geographic regions/areas)

CONTINENT MAPPING (ONLY use these exact Turkish values):
- Avrupa: All European countries
- Asya: All Asian countries (including Turkey if context is Asian side)
- Afrika: All African countries
- Kuzey Amerika: USA, Canada, Mexico, Caribbean
- Güney Amerika: South American countries
- Okyanusya: Australia, New Zealand, Pacific Islands

COUNTRY NAMES (use Turkish names):
- France → Fransa
- Italy → İtalya
- Turkey → Türkiye
- Japan → Japonya
- United States → Amerika Birleşik Devletleri
- United Kingdom → İngiltere
- Spain → İspanya
- Germany → Almanya
- etc.

Examples:
Input: "Eiffel Tower"
Output: {"continent": "Avrupa", "country": "Fransa", "place_name": "Eiffel Tower", "place_type": "attraction", "description": "Paris'in simgesi olan 330 metre yüksekliğindeki demir kule. 1889'da inşa edildi ve yılda 7 milyon turisti ağırlıyor."}

Input: "Tokyo"
Output: {"continent": "Asya", "country": "Japonya", "place_name": "Tokyo", "place_type": "city", "description": "Japonya'nın başkenti ve dünyanın en büyük metropollerinden biri. Modern teknoloji ile geleneksel kültürün birleşimi."}

Input: "Cappadocia"
Output: {"continent": "Asya", "country": "Türkiye", "place_name": "Kapadokya", "place_type": "region", "description": "Nevşehir'de yer alan volkanik kayalıklar ve peri bacaları ile ünlü tarihi bölge. Balon turları ve yer altı şehirleri ile meşhur."}

Input: "Grand Canyon"
Output: {"continent": "Kuzey Amerika", "country": "Amerika Birleşik Devletleri", "place_name": "Grand Canyon", "place_type": "region", "description": "Arizona'da Colorado Nehri tarafından oyulmuş 446 km uzunluğunda muhteşem kanyon. Dünyanın en büyük doğal harikalarından biri."}

Important:
- description must be in Turkish
- Use exact continent names from the list above
- Return ONLY the JSON object`

  try {
    const response = await callGemini(prompt, 3, 2000)

    let jsonText = response.trim()

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '')
    }

    const data = JSON.parse(jsonText)

    console.log('[AI Travel] Analyzed travel place:', data)

    return {
      continent: data.continent,
      country: data.country,
      place_name: data.place_name,
      place_type: data.place_type,
      description: data.description,
    }
  } catch (error) {
    console.error('[AI Travel] Failed to process travel place:', error)
    // Fallback: return with minimal info
    return {
      continent: 'Avrupa', // Default fallback
      country: 'Bilinmiyor',
      place_name: trimmedText,
      place_type: 'city',
      description: null,
    }
  }
}
