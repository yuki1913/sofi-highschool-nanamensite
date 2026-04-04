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
      className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        animationDelay: `${index * 80}ms`,
        animationFillMode: "backwards",
      }}
    >
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />

      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-medium tracking-wider text-amber-700">
              {member.category || "カテゴリ未設定"}
            </span>

            <h2 className="mt-3 text-xl font-semibold text-stone-900">
              {member.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              {member.shortIntro}
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-300 text-sm font-semibold text-amber-700">
            {String(member.id).padStart(2, "0")}
          </div>
        </div>

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

        <div className="relative">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? "max-h-[500px]" : "max-h-[96px]"
            }`}
          >
            <p className="text-sm leading-7 text-stone-700">{member.fullIntro}</p>
          </div>

          {!isExpanded && member.fullIntro.length > 90 && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        {member.fullIntro.length > 90 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 inline-flex items-center gap-2 text-xs font-medium tracking-wider text-amber-700 transition hover:text-amber-800"
          >
            {isExpanded ? (
              <>
                <span>閉じる</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>続きを読む</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </article>
  )
}