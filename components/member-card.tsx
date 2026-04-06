"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

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
      className="bg-white p-7 lg:p-8 flex flex-col gap-5 animate-fade-in-up transition-colors duration-200 hover:bg-[#f9f9f9]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* 上部: 番号 + カテゴリ */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] tracking-[0.45em] text-black/30 uppercase tabular-nums"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {String(member.id).padStart(2, "0")}
        </span>
        {member.category && (
          <span
            className="text-[9px] tracking-[0.35em] text-black/40 uppercase border border-black/15 px-2.5 py-1"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {member.category}
          </span>
        )}
      </div>

      {/* 名前 */}
      <div>
        <h2
          className="text-2xl lg:text-[28px] font-medium leading-tight text-black"
          style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
        >
          {member.name}
        </h2>
        {member.shortIntro && (
          <p className="mt-2 text-[13px] leading-6 text-black/50">
            {member.shortIntro}
          </p>
        )}
      </div>

      {/* 区切り */}
      <div className="border-t border-black/8" />

      {/* 本文 */}
      {member.fullIntro && (
        <div>
          <div
            className={`overflow-hidden transition-all duration-400 ease-in-out ${
              isExpanded ? "max-h-[800px]" : "max-h-[72px]"
            }`}
          >
            <p className="text-[13px] leading-7 text-black/60 whitespace-pre-wrap">
              {member.fullIntro}
            </p>
          </div>

          {member.fullIntro.length > 80 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 flex items-center gap-2 group"
            >
              <span className="w-5 h-5 border border-black/20 flex items-center justify-center group-hover:border-black/60 transition-colors">
                {isExpanded ? (
                  <Minus className="w-2.5 h-2.5 text-black/40 group-hover:text-black/70" />
                ) : (
                  <Plus className="w-2.5 h-2.5 text-black/40 group-hover:text-black/70" />
                )}
              </span>
              <span
                className="text-[9px] tracking-[0.35em] text-black/35 uppercase group-hover:text-black/60 transition-colors"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {isExpanded ? "CLOSE" : "READ MORE"}
              </span>
            </button>
          )}
        </div>
      )}
    </article>
  )
}
