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
      className="bg-white rounded-2xl p-6 lg:p-7 flex flex-col gap-4 animate-fade-in-up border border-[#f0e4d0] hover:border-[#f07840]/30 hover:shadow-md transition-all duration-300"
      style={{
        animationDelay: `${index * 50}ms`,
        boxShadow: "0 2px 12px rgba(45, 31, 14, 0.06)",
      }}
    >
      {/* 上部: 番号 + カテゴリ */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] tracking-[0.45em] text-[#c4a882] tabular-nums"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {String(member.id).padStart(2, "0")}
        </span>
        {member.category && (
          <span
            className="text-[10px] px-3 py-1 rounded-full bg-[#f07840]/10 text-[#f07840] font-medium"
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            {member.category}
          </span>
        )}
      </div>

      {/* 名前 */}
      <div>
        <h2
          className="text-xl lg:text-2xl font-medium leading-tight text-[#2d1f0e]"
          style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
        >
          {member.name}
        </h2>
        {member.shortIntro && (
          <p className="mt-1.5 text-[13px] leading-6 text-[#9a7250]">
            {member.shortIntro}
          </p>
        )}
      </div>

      {/* 区切り */}
      <div className="border-t border-[#f0e4d0]" />

      {/* 本文 */}
      {member.fullIntro && (
        <div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-[800px]" : "max-h-[72px]"
            }`}
          >
            <p className="text-[13px] leading-7 text-[#5c3d20] whitespace-pre-wrap">
              {member.fullIntro}
            </p>
          </div>

          {member.fullIntro.length > 80 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center gap-1.5 group"
            >
              <span className="w-6 h-6 rounded-full bg-[#faf0e4] flex items-center justify-center group-hover:bg-[#f07840]/10 transition-colors">
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3 text-[#f07840]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#f07840]" />
                )}
              </span>
              <span
                className="text-[11px] text-[#f07840] font-medium"
                style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
              >
                {isExpanded ? "閉じる" : "もっと読む"}
              </span>
            </button>
          )}
        </div>
      )}
    </article>
  )
}
