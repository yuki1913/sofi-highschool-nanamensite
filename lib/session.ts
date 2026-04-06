// Edge-compatible session management using Web Crypto API (no external deps)

export const COOKIE_NAME = "sofi-auth"
const EXPIRES_DAYS = 7

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error("SESSION_SECRET is not set")
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

function toUrlSafeBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function fromUrlSafeBase64(str: string): string {
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"))
}

export async function createSession(userId: number): Promise<{ cookie: string; expires: Date }> {
  const expiresAt = new Date(Date.now() + EXPIRES_DAYS * 24 * 60 * 60 * 1000)
  const payload = JSON.stringify({ userId, expiresAt: expiresAt.toISOString() })
  const key = await getKey()
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  const token =
    btoa(payload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") +
    "." +
    toUrlSafeBase64(sig)
  return { cookie: token, expires: expiresAt }
}

export async function verifySession(token: string): Promise<{ userId: number } | null> {
  try {
    const dot = token.lastIndexOf(".")
    if (dot === -1) return null
    const payloadB64 = token.slice(0, dot)
    const sigB64 = token.slice(dot + 1)
    const payload = fromUrlSafeBase64(payloadB64)
    const sigBytes = Uint8Array.from(fromUrlSafeBase64(sigB64), (c) => c.charCodeAt(0))
    const key = await getKey()
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(payload),
    )
    if (!valid) return null
    const parsed = JSON.parse(payload)
    if (!parsed.userId || new Date(parsed.expiresAt) <= new Date()) return null
    return { userId: parsed.userId }
  } catch {
    return null
  }
}
