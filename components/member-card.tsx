"use client"

import type { Member } from "@/lib/zukan"

type MemberCardProps = {
  member: Member
  index: number
  onOpenDetail: (member: Member) => void
}

export function MemberCard({ member, index, onOpenDetail }: MemberCardProps) {
  const hashtags = member.hashtags
    ? member.hashtags.split(/[,、\s]+/).filter(Boolean)
    : []

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden flex flex-col animate-fade-in-up border border-[#ddd5c4] hover:border-[#c5a84a]/60 hover:shadow-md transition-all duration-300 cursor-pointer group"
      style={{
        animationDelay: `${index * 50}ms`,
        boxShadow: "0 2px 12px rgba(30, 58, 95, 0.06)",
      }}
      onClick={() => onOpenDetail(member)}
    >
      {/* Photo */}
      <div className="relative w-full aspect-[4/3] bg-[#eee8dc] overflow-hidden">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-4xl font-medium text-[#1e3a5f]/30"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              {member.name.charAt(0)}
            </span>
          </div>
        )}
        {/* Age group badge — U25:ゴールド / U20:ネイビー / その他:グレー */}
        {member.ageGroup && (
          <span
            className="absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full font-medium backdrop-blur-sm"
            style={{
              fontFamily: "var(--font-zen-maru-gothic)",
              backgroundColor: member.ageGroup.includes("25")
                ? "rgba(197,168,74,0.9)"
                : member.ageGroup.includes("20")
                  ? "rgba(30,58,95,0.85)"
                  : "rgba(100,100,100,0.7)",
              color: "#f5f0e6",
            }}
          >
            {member.ageGroup}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Name + location */}
        <div>
          <h2
            className="text-lg font-medium leading-tight text-[#1e3a5f]"
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            {member.name}
          </h2>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-[#264a75]">
            {member.location && (
              <span className="flex items-center gap-1">
                <span className="text-[#c5a84a]">&#9679;</span>
                {member.location}
              </span>
            )}
            {member.university && (
              <span className="truncate">{member.university}</span>
            )}
          </div>
        </div>

        {/* Motto */}
        {member.motto && (
          <p
            className="text-[12px] leading-6 text-[#1e3a5f] italic line-clamp-2"
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            &ldquo;{member.motto}&rdquo;
          </p>
        )}

        {/* Skills */}
        {member.skills && (
          <p className="text-[11px] leading-5 text-[#264a75] line-clamp-2">
            {member.skills}
          </p>
        )}

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-[#ddd5c4]/60">
            {hashtags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e3a5f]/8 text-[#1e3a5f] font-medium"
                style={{ fontFamily: "var(--font-zen-maru-gothic)", background: "rgba(30,58,95,0.07)" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* View button */}
        <button
          className="mt-2 w-full py-2 rounded-full border border-[#c5a84a] text-[#c5a84a] text-xs font-medium hover:bg-[#c5a84a] hover:text-white transition-all duration-200"
          style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          onClick={(e) => {
            e.stopPropagation()
            onOpenDetail(member)
          }}
        >
          ナナメンビュー
        </button>
      </div>
    </article>
  )
}
