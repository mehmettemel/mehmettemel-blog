import { NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * Clear session cookie
 */
export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    // Clear session cookie by setting maxAge to 0
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
