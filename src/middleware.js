import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

/**
 * Middleware to protect admin routes
 * Runs at the edge before page loads
 */
export async function middleware(request) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      // Get session cookie
      const sessionCookie = request.cookies.get('session')

      if (!sessionCookie) {
        // No session found, redirect to home with login prompt
        const url = new URL('/', request.url)
        url.searchParams.set('login', 'required')
        return NextResponse.redirect(url)
      }

      // Verify JWT token
      const payload = await verifyToken(sessionCookie.value)

      if (!payload) {
        // Invalid or expired token, redirect to home
        const url = new URL('/', request.url)
        url.searchParams.set('login', 'expired')
        return NextResponse.redirect(url)
      }

      // Session is valid, allow request to proceed
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware error:', error)
      // On error, redirect to home
      const url = new URL('/', request.url)
      url.searchParams.set('login', 'error')
      return NextResponse.redirect(url)
    }
  }

  // Allow all other requests
  return NextResponse.next()
}

// Configure which routes this middleware should run on
export const config = {
  matcher: ['/admin/:path*'],
}
