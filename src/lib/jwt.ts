// ── JWT decode utility (client-side only) ────────────────────
// Decodes the payload of a Google Identity Services JWT credential.
// NOTE: For production, always verify the token on your backend.

export interface GoogleJwtPayload {
  /** Google user ID */
  sub: string
  /** Full name */
  name: string
  /** Given (first) name */
  given_name?: string
  /** Family (last) name */
  family_name?: string
  /** Email address */
  email: string
  /** Whether email is verified */
  email_verified?: boolean
  /** Profile picture URL */
  picture?: string
  /** Token issuer */
  iss?: string
  /** Audience (your client ID) */
  aud?: string
  /** Expiration time (unix) */
  exp?: number
  /** Issued at (unix) */
  iat?: number
}

/**
 * Decode a JWT token's payload without verification.
 * Safe for client-side use to extract user info from Google's credential response.
 */
export function decodeGoogleJwt(token: string): GoogleJwtPayload {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format')
  }

  // Base64url → Base64 → decode
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const json = atob(padded)

  return JSON.parse(json) as GoogleJwtPayload
}
