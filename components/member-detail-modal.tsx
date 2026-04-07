"use client"

import { useEffect } from "react"
import { X, MapPin, GraduationCap, ExternalLink } from "lucide-react"
import type { Member } from "@/lib/zukan"

type MemberDetailModalProps = {
  member: Member | null
  onClose: () => void
}

export function MemberDetailModal({ member, onClose }: MemberDetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (member) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [member])

  if (!member) return null

  const hashtags = member.hashtags
    ? member.hashtags.split(/[,、\s]+/).filter(Boolean)
    : []
  const careerTags = member.career
    ? member.career.split(/,\s*/).filter(Boolean)
    : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1e3a5f]/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[#f5f0e6] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 border border-[#ddd5c4] flex items-center justify-center hover:bg-[#1e3a5f] hover:text-white hover:border-[#1e3a5f] transition-all duration-200"
          aria-label="閉じる"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Photo header */}
        <div className="relative w-full aspect-[16/7] bg-[#eee8dc] overflow-hidden rounded-t-3xl">
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1e3a5f]/10">
              <span
                className="text-6xl font-medium text-[#1e3a5f]/20"
                style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
              >
                {member.name.charAt(0)}
              </span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/60 via-transparent to-transparent" />
          {/* Name over photo */}
          <div className="absolute bottom-0 left-0 p-6">
            <h2
              className="text-2xl sm:text-3xl font-medium text-white text-balance"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              {member.name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              {member.ageGroup && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                  {member.ageGroup}
                </span>
              )}
              {member.location && (
                <span className="flex items-center gap-1 text-xs text-white/80">
                  <MapPin className="w-3 h-3" />
                  {member.location}
                </span>
              )}
              {member.hometown && (
                <span className="text-xs text-white/70">出身: {member.hometown}</span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Motto */}
          {member.motto && (
            <div className="border-l-2 border-[#c5a84a] pl-4">
              <p
                className="text-[13px] leading-7 text-[#1e3a5f] italic"
                style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
              >
                &ldquo;{member.motto}&rdquo;
              </p>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {member.university && (
              <InfoItem
                icon={<GraduationCap className="w-3.5 h-3.5" />}
                label="大学"
                value={member.university}
              />
            )}
            {member.faculty && (
              <InfoItem label="学部" value={member.faculty} />
            )}
          </div>

          {/* Skills */}
          {member.skills && (
            <Section label="得意なこと・好きなこと・資格">
              <p className="text-[13px] leading-7 text-[#264a75] whitespace-pre-wrap">
                {member.skills}
              </p>
            </Section>
          )}

          {/* Career tags (K列) */}
          {careerTags.length > 0 && (
            <Section label="こんな進路や相談にのれるよ！">
              <div className="flex flex-wrap gap-2">
                {careerTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-3 py-1 rounded-full font-medium"
                    style={{
                      fontFamily: "var(--font-zen-maru-gothic)",
                      background: "rgba(197,168,74,0.12)",
                      color: "#9a7c2a",
                      border: "1px solid rgba(197,168,74,0.4)",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Hashtags (J列) */}
          {hashtags.length > 0 && (
            <Section label="マイ#">
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-3 py-1 rounded-full border border-[#c5a84a]/50 text-[#1e3a5f] font-medium"
                    style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* URL */}
          {member.url && (
            <a
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start text-xs text-[#1e3a5f] border border-[#c5a84a] rounded-full px-4 py-2 hover:bg-[#c5a84a] hover:text-white transition-all duration-200"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              もっと詳しく見る
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="text-[10px] tracking-[0.35em] text-[#c5a84a] uppercase font-semibold mb-2"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-white rounded-xl px-4 py-3 border border-[#ddd5c4]">
      <p
        className="text-[10px] tracking-[0.3em] text-[#c5a84a] uppercase font-semibold mb-1"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {label}
      </p>
      <p className="flex items-center gap-1.5 text-[13px] text-[#1e3a5f] font-medium">
        {icon && <span className="text-[#264a75]">{icon}</span>}
        {value}
      </p>
    </div>
  )
}
