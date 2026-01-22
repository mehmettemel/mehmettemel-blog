import { NextResponse } from 'next/server'
import { verifyPassword, createToken } from '@/lib/auth'

/**
 * POST /api/auth/login
 * Verify password and create session
 */
export async function POST(request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Verify password
    const isValid = await verifyPassword(password)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Create JWT token
    const token = await createToken('admin')

    // Create response with success
    const response = NextResponse.json({ success: true })

    // Set HttpOnly cookie with session token
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
