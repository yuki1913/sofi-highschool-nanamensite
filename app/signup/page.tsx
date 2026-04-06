"use client"

import { useActionState } from "react"
import Link from "next/link"
import { signup, type AuthState } from "@/app/actions/auth"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { useState } from "react"

export default function SignupPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, undefined)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
            新規登録
          </h1>
          <p className="mt-1 text-xs text-[#9a7250]">アカウントを作成してください</p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          {/* ユーザー名 */}
          <div className="flex flex-col gap-1">
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
            <p className="text-[10px] text-[#c5a84a] pl-4">
              2文字以上・日本語・英数字・アンダーバー使用可
            </p>
          </div>

          {/* パスワード */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#c5a84a]" />
            <input
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="パスワード（8文字以上）"
              autoComplete="new-password"
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
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c5a84a] hover:text-[#1e3a5f] transition-colors"
              aria-label={showPw ? "パスワードを隠す" : "パスワードを表示"}
            >
              {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* パスワード確認 */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#c5a84a]" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="パスワード（確認）"
              autoComplete="new-password"
              required
              className={`w-full bg-[#f5f0e6] rounded-full border py-2.5 pl-10 pr-10 text-sm text-[#1e3a5f] placeholder:text-[#c5a84a]/60 outline-none transition-colors ${
                state?.field === "confirmPassword"
                  ? "border-red-400"
                  : "border-[#ddd5c4] focus:border-[#1e3a5f]"
              }`}
              style={{ fontFamily: "var(--font-noto-sans-jp)" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c5a84a] hover:text-[#1e3a5f] transition-colors"
              aria-label={showConfirm ? "パスワードを隠す" : "パスワードを表示"}
            >
              {showConfirm ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* エラー */}
          {state?.error && (
            <p className="text-xs text-center text-red-500 px-2">{state.error}</p>
          )}

          {/* 登録ボタン */}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full py-2.5 rounded-full bg-[#c5a84a] text-white text-sm font-medium hover:bg-[#b5983a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            {pending ? "登録中..." : "アカウントを作成"}
          </button>
        </form>

        {/* ログインリンク */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#9a7250]">
            すでにアカウントをお持ちの方は{" "}
            <Link
              href="/login"
              className="text-[#1e3a5f] hover:text-[#c5a84a] font-medium transition-colors"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              ログイン
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
