import { NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO || 'mehmettemel/mehmettemel-blog' // repo adınızı güncelleyin
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'
const FILE_PATH = 'src/data/kesifler.js'

// Link mi Not mu tespit et
function isURL(text) {
  const urlPattern =
    /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$|^www\.[\w-]+\.[\w-]+(\/[\w-./?%&=]*)?$/i
  return urlPattern.test(text.trim())
}

// Gemini API çağrısı (retry mekanizması ile)
async function callGemini(prompt, retries = 3, delay = 2000) {
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
        // Overload hatası ise retry yap
        if (
          json.error.message.includes('overloaded') ||
          json.error.status === 'RESOURCE_EXHAUSTED'
        ) {
          if (attempt < retries) {
            console.log(
              `Gemini overloaded, retry ${attempt}/${retries} (${delay}ms bekliyor...)`,
            )
            await new Promise((resolve) => setTimeout(resolve, delay * attempt))
            continue
          }
        }
        throw new Error('Gemini API Hatası: ' + json.error.message)
      }

      if (!json.candidates || !json.candidates[0].content) {
        throw new Error('Gemini cevap döndüremedi.')
      }

      return json.candidates[0].content.parts[0].text
    } catch (error) {
      if (attempt === retries) {
        throw new Error('Gemini API çağrısı başarısız: ' + error.message)
      }
      // Network hatası varsa da retry yap
      console.log(
        `Gemini API hatası, retry ${attempt}/${retries} (${delay}ms bekliyor...)`,
      )
      await new Promise((resolve) => setTimeout(resolve, delay * attempt))
    }
  }
}

// Link işleme
async function handleLink(url) {
  const prompt = `Aşağıdaki URL'yi analiz et ve JSON formatında şu bilgileri döndür (sadece JSON döndür, markdown kod bloğu kullanma):
{
  "title": "Link başlığı",
  "description": "Kısa açıklama (max 150 karakter)",
  "type": "website/article/video seçeneklerinden en uygun olanı"
}

URL: ${url}

KATEGORİ SEÇİMİ:
- "website": Tüm web siteleri (ana sayfalar, kurumsal siteler, haber siteleri, online araçlar, web uygulamaları)
- "article": Blog yazıları, teknik dökümanlar, makaleler, rehberler, tutorial'lar
- "video": YouTube videoları, video kursları, webinar kayıtları

ÖNEMLI: Sadece düz JSON döndür, \`\`\`json gibi markdown formatı kullanma.`

  const aiResponse = await callGemini(prompt)

  // Markdown kod bloklarını temizle
  let cleanResponse = aiResponse.trim()
  cleanResponse = cleanResponse
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')

  const linkData = JSON.parse(cleanResponse)

  return {
    id: Date.now(),
    title: linkData.title,
    description: linkData.description,
    type: linkData.type,
    url: url,
  }
}

// Not işleme
async function handleNote(text) {
  const prompt = `Aşağıdaki notu analiz et ve JSON formatında şu bilgileri döndür (sadece JSON döndür, markdown kod bloğu kullanma):
{
  "text": "Notun kendisi (tırnak işaretlerini koruyarak)",
  "author": "Varsa yazar adı, yoksa null",
  "source": "Varsa kaynak, yoksa null",
  "category": "motivasyon/yazilim/tasarim/teknoloji/saglik/gida/seyahat kategorilerinden en uygun olanı",
  "tags": ["tag1", "tag2"]
}

Not: ${text}

ÖNEMLI:
- Sadece düz JSON döndür, \`\`\`json gibi markdown formatı kullanma.
- text alanında tırnak işaretlerini koruyarak düzgün escape et.`

  const aiResponse = await callGemini(prompt)

  // Markdown kod bloklarını temizle
  let cleanResponse = aiResponse.trim()
  cleanResponse = cleanResponse
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')

  const noteData = JSON.parse(cleanResponse)

  return {
    id: Date.now(),
    text: noteData.text,
    author: noteData.author,
    source: noteData.source,
    category: noteData.category,
    tags: noteData.tags || [],
  }
}

// GitHub'dan dosya içeriğini oku
async function getFileFromGitHub() {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${GITHUB_BRANCH}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`GitHub dosya okuma hatası: ${error}`)
  }

  const data = await response.json()

  // Base64'den decode et
  const content = Buffer.from(data.content, 'base64').toString('utf-8')

  return {
    content,
    sha: data.sha, // Güncelleme için gerekli
  }
}

// GitHub'a dosya yaz
async function updateFileOnGitHub(newContent, sha, commitMessage) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`

  // Base64'e encode et
  const contentBase64 = Buffer.from(newContent).toString('base64')

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: contentBase64,
      sha: sha,
      branch: GITHUB_BRANCH,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`GitHub dosya yazma hatası: ${error}`)
  }

  return await response.json()
}

// kesifler.js dosyasını GitHub üzerinden güncelle
async function updateKesiflerFile(type, newData) {
  // 1. Mevcut dosyayı GitHub'dan oku
  const { content: fileContent, sha } = await getFileFromGitHub()

  let updatedContent = fileContent

  if (type === 'link') {
    // usefulLinks array'ine ekle
    const newLink = `  {
    id: ${newData.id},
    title: '${newData.title.replace(/'/g, "\\'")}',
    description: '${newData.description.replace(/'/g, "\\'")}',
    type: '${newData.type}',
    url: '${newData.url}',
  },`

    // Array içine ekle - son ] işaretinden önce ekle
    // Hem boş array [] hem de çok satırlı array'leri destekler
    updatedContent = updatedContent.replace(
      /(export const usefulLinks = \[)([\s\S]*?)(\s*\])/,
      (match, p1, p2, p3) => {
        // Eğer array boş ise (sadece whitespace varsa)
        if (!p2.trim()) {
          return `${p1}\n${newLink}\n]`
        }
        // Array doluysa sonuna ekle
        return `${p1}${p2}\n${newLink}\n]`
      },
    )
  } else if (type === 'note') {
    // inspirationalQuotes array'ine ekle
    const newNote = `  {
    id: ${newData.id},
    text: '${newData.text.replace(/'/g, "\\'")}',
    author: ${newData.author ? `'${newData.author.replace(/'/g, "\\'")}'` : 'null'},
    source: ${newData.source ? `'${newData.source.replace(/'/g, "\\'")}'` : 'null'},
    category: '${newData.category}',
    tags: ${JSON.stringify(newData.tags)},
  },`

    // Hem boş array [] hem de çok satırlı array'leri destekler
    updatedContent = updatedContent.replace(
      /(export const inspirationalQuotes = \[)([\s\S]*?)(\s*\])/,
      (match, p1, p2, p3) => {
        // Eğer array boş ise (sadece whitespace varsa)
        if (!p2.trim()) {
          return `${p1}\n${newNote}\n]`
        }
        // Array doluysa sonuna ekle
        return `${p1}${p2}\n${newNote}\n]`
      },
    )
  }

  // 2. GitHub'a commit et
  const commitMessage =
    type === 'link'
      ? `🔗 Yeni link eklendi: ${newData.title}`
      : `💭 Yeni not eklendi: ${newData.text.substring(0, 50)}...`

  await updateFileOnGitHub(updatedContent, sha, commitMessage)

  return true
}

// API endpoint
export async function POST(request) {
  try {
    // GitHub token kontrolü
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GITHUB_TOKEN environment variable tanımlı değil' },
        { status: 500 },
      )
    }

    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Mesaj metni gerekli' },
        { status: 400 },
      )
    }

    // Link mi Not mu kontrol et
    const isLink = isURL(text)

    let result
    let type

    if (isLink) {
      type = 'link'
      result = await handleLink(text)
      await updateKesiflerFile('link', result)
    } else {
      type = 'note'
      result = await handleNote(text)
      await updateKesiflerFile('note', result)
    }

    return NextResponse.json({
      success: true,
      type,
      data: result,
      message: `${type === 'link' ? 'Link' : 'Not'} başarıyla eklendi! (GitHub'a commit edildi)`,
    })
  } catch (error) {
    console.error('API Hatası:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
