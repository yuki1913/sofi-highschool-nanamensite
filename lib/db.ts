import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(path.join(dataDir, "users.db"))

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

export type User = {
  id: number
  username: string
  password_hash: string
  salt: string
  created_at: string
}

export function getUserByUsername(username: string): User | undefined {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username) as User | undefined
}

export function getUserById(id: number): User | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined
}

export function createUser(username: string, passwordHash: string, salt: string): number {
  const result = db
    .prepare("INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)")
    .run(username, passwordHash, salt)
  return result.lastInsertRowid as number
}
