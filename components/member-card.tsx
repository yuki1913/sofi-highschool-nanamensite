"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export type Member = {
  id: string
  name: string
  shortIntro: string
  category: string
  fullIntro: string
}

type MemberCardProps = {
  member: Member
  index: number
}

export function MemberCard({ member, index }: MemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gray-200"
      style={{
        animationDelay: `${index * 60}ms`,
        animationFillMode: "backwards",
      }}
    >
      {/* 上部アクセントライン */}
      <div className="h-[2px] w-full bg-gray-900" />

      <div className="p-6">
        {/* ヘッダー行 */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {member.category && (
              <span className="inline-block rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-medium tracking-widest text-gray-500 uppercase mb-3"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {member.category}
              </span>
            )}
            <h2
              className="text-xl font-bold text-gray-900 leading-snug"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              {member.name}
            </h2>
          </div>

          {/* ID バッジ */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {String(member.id).padStart(2, "0")}
          </div>
        </div>

        {/* 一言紹介 */}
        {member.shortIntro && (
          <p className="text-sm leading-6 text-gray-600 font-medium mb-4">
            {member.shortIntro}
          </p>
        )}

        {/* 区切り線 */}
        <div className="my-4 h-px bg-gray-100" />

        {/* 詳細紹介 */}
        <div className="relative">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? "max-h-[600px]" : "max-h-[88px]"
            }`}
          >
            <p className="text-sm leading-7 text-gray-600">{member.fullIntro}</p>
          </div>

          {!isExpanded && member.fullIntro.length > 90 && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        {member.fullIntro.length > 90 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gray-900 transition hover:text-gray-600 border-b border-gray-900 hover:border-gray-400 pb-0.5"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {isExpanded ? (
              <>
                <span>閉じる</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>続きを読む</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </article>
  )
}
