import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export type User = {
  id: number
  username: string
  password_hash: string
  salt: string
  created_at: string
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const rows = await sql`SELECT * FROM users WHERE username = ${username} LIMIT 1`
  return (rows[0] as User) ?? null
}

export async function getUserById(id: number): Promise<User | null> {
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
  return (rows[0] as User) ?? null
}

export async function createUser(
  username: string,
  passwordHash: string,
  salt: string
): Promise<number> {
  const rows = await sql`
    INSERT INTO users (username, password_hash, salt)
    VALUES (${username}, ${passwordHash}, ${salt})
    RETURNING id
  `
  return (rows[0] as { id: number }).id
}
