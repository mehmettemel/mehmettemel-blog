import { SignJWT, jwtVerify } from 'jose'

// Secret key for JWT signing (derived from AUTH_PASSWORD)
const getSecret = () => {
  const password = process.env.AUTH_PASSWORD
  if (!password) {
    throw new Error('AUTH_PASSWORD environment variable is not set')
  }
  return new TextEncoder().encode(password)
}

// Static salt for single-user system (acceptable for this use case)
const SALT = 'mehmettemel-admin-salt-2026'
const ITERATIONS = 100000

/**
 * Hash a password using Web Crypto API (Edge Runtime compatible)
 * @param {string} password - Password to hash
 * @returns {Promise<string>} Hex-encoded hash
 */
export async function hashPassword(password) {
  // Convert password and salt to ArrayBuffer
  const encoder = new TextEncoder()
  const passwordData = encoder.encode(password)
  const saltData = encoder.encode(SALT)

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  )

  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: ITERATIONS,
      hash: 'SHA-512',
    },
    keyMaterial,
    512 // 64 bytes * 8 bits
  )

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(derivedBits))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify a password against the stored hash
 * @param {string} inputPassword - Password to verify
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(inputPassword) {
  try {
    const inputHash = await hashPassword(inputPassword)
    const storedPassword = process.env.AUTH_PASSWORD

    if (!storedPassword) {
      return false
    }

    const storedHash = await hashPassword(storedPassword)
    return inputHash === storedHash
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

/**
 * Create a JWT token for authenticated session
 * @param {string} userId - User identifier (default: 'admin')
 * @returns {Promise<string>} JWT token
 */
export async function createToken(userId = 'admin') {
  try {
    const secret = getSecret()
    const token = await new SignJWT({ userId, iat: Math.floor(Date.now() / 1000) })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d') // 7 days expiry
      .sign(secret)

    return token
  } catch (error) {
    console.error('Error creating token:', error)
    throw new Error('Failed to create authentication token')
  }
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object|null>} Payload if valid, null if invalid
 */
export async function verifyToken(token) {
  try {
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    // Token is invalid or expired
    return null
  }
}
