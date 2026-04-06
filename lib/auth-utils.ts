// PBKDF2 password hashing using the built-in Web Crypto API (no external deps)

const ITERATIONS = 100_000
const KEY_LENGTH = 256 // bits

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function fromHex(hex: string): ArrayBuffer {
  const pairs = hex.match(/.{2}/g) ?? []
  return new Uint8Array(pairs.map((b) => parseInt(b, 16))).buffer as ArrayBuffer
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    KEY_LENGTH,
  )
  return { hash: toHex(bits), salt: toHex(salt.buffer as ArrayBuffer) }
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string,
): Promise<boolean> {
  const salt = fromHex(storedSalt)
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    KEY_LENGTH,
  )
  const inputHash = toHex(bits)
  // Timing-safe comparison
  if (inputHash.length !== storedHash.length) return false
  let diff = 0
  for (let i = 0; i < inputHash.length; i++) {
    diff |= inputHash.charCodeAt(i) ^ storedHash.charCodeAt(i)
  }
  return diff === 0
}
