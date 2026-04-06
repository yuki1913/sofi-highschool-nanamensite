"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createSession, COOKIE_NAME } from "@/lib/session"
import { getUserByUsername, createUser } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/auth-utils"

export type AuthState = { error?: string; field?: string } | undefined

// ─── ログイン ───────────────────────────────────────────────
export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const username = formData.get("username")
  const password = formData.get("password")

  if (typeof username !== "string" || !username.trim()) {
    return { error: "ユーザー名を入力してください。", field: "username" }
  }
  if (typeof password !== "string" || !password) {
    return { error: "パスワードを入力してください。", field: "password" }
  }

  const user = await getUserByUsername(username.trim())
  // ユーザー不在でも同じエラーを返す（存在確認を防ぐ）
  if (!user) {
    return { error: "ユーザー名またはパスワードが正しくありません。" }
  }

  const valid = await verifyPassword(password, user.password_hash, user.salt)
  if (!valid) {
    return { error: "ユーザー名またはパスワードが正しくありません。" }
  }

  const { cookie, expires } = await createSession(user.id)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  })

  redirect("/")
}

// ─── サインアップ ────────────────────────────────────────────
export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const username = formData.get("username")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")

  if (typeof username !== "string" || !username.trim()) {
    return { error: "ユーザー名を入力してください。", field: "username" }
  }
  if (username.trim().length < 2) {
    return { error: "ユーザー名は2文字以上で入力してください。", field: "username" }
  }
  if (!/^[a-zA-Z0-9_\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]+$/.test(username.trim())) {
    return { error: "ユーザー名に使えない文字が含まれています。", field: "username" }
  }
  if (typeof password !== "string" || password.length < 8) {
    return { error: "パスワードは8文字以上で入力してください。", field: "password" }
  }
  if (password !== confirmPassword) {
    return { error: "パスワードが一致しません。", field: "confirmPassword" }
  }

  const existing = await getUserByUsername(username.trim())
  if (existing) {
    return { error: "このユーザー名はすでに使用されています。", field: "username" }
  }

  const { hash, salt } = await hashPassword(password)
  const userId = await createUser(username.trim(), hash, salt)

  const { cookie, expires } = await createSession(userId)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  })

  redirect("/")
}

// ─── ログアウト ──────────────────────────────────────────────
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect("/login")
}
