import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

/**
 * GET /api/auth/session
 * Check if user is authenticated
 */
export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      userId: session.userId,
      expiresAt: session.exp ? session.exp * 1000 : null, // Convert to milliseconds
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
