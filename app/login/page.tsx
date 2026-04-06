"use client"

import { useActionState } from "react"
import Link from "next/link"
import { login, type AuthState } from "@/app/actions/auth"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { useState } from "react"

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, undefined)
  const [show, setShow] = useState(false)

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col items-center justify-center px-4">
      {/* ロゴ */}
      <a
        href="https://sofi-highschool.studio.site/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-3 mb-12 group"
      >
        <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
          <span
            className="text-[10px] font-bold text-[#f5f0e6] tracking-wider"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            SOFI
          </span>
        </div>
        <span
          className="text-base font-medium text-[#1e3a5f] group-hover:text-[#c5a84a] transition-colors"
          style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
        >
          SOFI高等学院
        </span>
      </a>

      {/* カード */}
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-[#ddd5c4] p-8"
        style={{ boxShadow: "0 4px 24px rgba(30, 58, 95, 0.08)" }}
      >
        <div className="mb-8 text-center">
          <h1
            className="text-xl font-medium text-[#1e3a5f]"
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            ログイン
          </h1>
          <p className="mt-1 text-xs text-[#9a7250]">ナナメン紹介サイトへようこそ</p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          {/* ユーザー名 */}
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#c5a84a]" />
            <input
              type="text"
              name="username"
              placeholder="ユーザー名"
              autoComplete="username"
              required
              className={`w-full bg-[#f5f0e6] rounded-full border py-2.5 pl-10 pr-4 text-sm text-[#1e3a5f] placeholder:text-[#c5a84a]/60 outline-none transition-colors ${
                state?.field === "username"
                  ? "border-red-400"
                  : "border-[#ddd5c4] focus:border-[#1e3a5f]"
              }`}
              style={{ fontFamily: "var(--font-noto-sans-jp)" }}
            />
          </div>

          {/* パスワード */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#c5a84a]" />
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="パスワード"
              autoComplete="current-password"
              required
              className={`w-full bg-[#f5f0e6] rounded-full border py-2.5 pl-10 pr-10 text-sm text-[#1e3a5f] placeholder:text-[#c5a84a]/60 outline-none transition-colors ${
                state?.field === "password"
                  ? "border-red-400"
                  : "border-[#ddd5c4] focus:border-[#1e3a5f]"
              }`}
              style={{ fontFamily: "var(--font-noto-sans-jp)" }}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c5a84a] hover:text-[#1e3a5f] transition-colors"
              aria-label={show ? "パスワードを隠す" : "パスワードを表示"}
            >
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* エラー */}
          {state?.error && (
            <p className="text-xs text-center text-red-500 px-2">{state.error}</p>
          )}

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full py-2.5 rounded-full bg-[#1e3a5f] text-[#f5f0e6] text-sm font-medium hover:bg-[#264a75] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            {pending ? "確認中..." : "ログイン"}
          </button>
        </form>

        {/* サインアップリンク */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#9a7250]">
            アカウントをお持ちでない方は{" "}
            <Link
              href="/signup"
              className="text-[#c5a84a] hover:text-[#1e3a5f] font-medium transition-colors"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              新規登録
            </Link>
          </p>
        </div>
      </div>

      <p
        className="mt-8 text-[10px] tracking-[0.3em] text-[#c5a84a]/60 uppercase"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        SOFI HIGH SCHOOL
      </p>
    </div>
  )
}
