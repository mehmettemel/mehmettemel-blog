import { getNotes } from '@/lib/db'
import { KesiflerClient } from '../../components/kesifler/KesiflerClient'

export const revalidate = 60 // ISR: Revalidate every 60 seconds

export default async function Kesifler({ searchParams }) {
  // Get tab from URL query params
  const params = await searchParams
  const tab = params?.tab || 'links'

  // Fetch data from database
  const [linksData, quotesData, videosData, booksData] = await Promise.all([
    getNotes({ type: 'link', limit: 1000 }).catch(() => ({
      notes: [],
      total: 0,
    })),
    getNotes({ type: 'quote', limit: 1000 }).catch(() => ({
      notes: [],
      total: 0,
    })),
    getNotes({ type: 'video', limit: 1000 }).catch(() => ({
      notes: [],
      total: 0,
    })),
    getNotes({ type: 'book', limit: 1000 }).catch(() => ({
      notes: [],
      total: 0,
    })),
  ])

  return (
    <KesiflerClient
      links={linksData.notes}
      quotes={quotesData.notes}
      videos={videosData.notes}
      books={booksData.notes}
      initialTab={tab}
    />
  )
}
