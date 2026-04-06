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
      className="bg-white rounded-2xl p-6 lg:p-7 flex flex-col gap-4 animate-fade-in-up border border-[#ddd5c4] hover:border-[#c5a84a]/50 hover:shadow-md transition-all duration-300"
      style={{
        animationDelay: `${index * 50}ms`,
        boxShadow: "0 2px 12px rgba(30, 58, 95, 0.06)",
      }}
    >
      {/* Top: Number + Category */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] tracking-[0.45em] text-[#c5a84a] tabular-nums font-semibold"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {String(member.id).padStart(2, "0")}
        </span>
        {member.category && (
          <span
            className="text-[10px] px-3 py-1 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] font-medium"
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            {member.category}
          </span>
        )}
      </div>

      {/* Name */}
      <div>
        <h2
          className="text-xl lg:text-2xl font-medium leading-tight text-[#1e3a5f]"
          style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
        >
          {member.name}
        </h2>
        {member.shortIntro && (
          <p className="mt-1.5 text-[13px] leading-6 text-[#264a75]">
            {member.shortIntro}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#c5a84a]/20" />

      {/* Content */}
      {member.fullIntro && (
        <div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-[800px]" : "max-h-[72px]"
            }`}
          >
            <p className="text-[13px] leading-7 text-[#264a75] whitespace-pre-wrap">
              {member.fullIntro}
            </p>
          </div>

          {member.fullIntro.length > 80 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center gap-1.5 group"
            >
              <span className="w-6 h-6 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center group-hover:bg-[#c5a84a]/20 transition-colors">
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3 text-[#1e3a5f]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#1e3a5f]" />
                )}
              </span>
              <span
                className="text-[11px] text-[#1e3a5f] font-medium group-hover:text-[#c5a84a] transition-colors"
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
