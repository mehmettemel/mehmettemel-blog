import { verifyToken } from './auth'
import { cookies } from 'next/headers'

/**
 * Validate session from request cookies
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object|null>} Session payload if valid, null otherwise
 */
export async function validateSession(request) {
  try {
    // Get session cookie from request
    const cookieHeader = request.headers.get('cookie')

    if (!cookieHeader) {
      return null
    }

    // Parse cookies manually
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {})

    const sessionToken = cookies.session

    if (!sessionToken) {
      return null
    }

    // Verify JWT token
    const payload = await verifyToken(sessionToken)

    if (!payload) {
      return null
    }

    return payload
  } catch (error) {
    console.error('Error validating session:', error)
    return null
  }
}

/**
 * Get session from Next.js cookies (for Server Components)
 * @returns {Promise<Object|null>} Session payload if valid, null otherwise
 */
export async function getSession() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return null
    }

    const payload = await verifyToken(sessionCookie.value)

    return payload
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}
