"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, AlertCircle, LogOut } from "lucide-react"
import Image from "next/image"
import { FilterBar } from "@/components/filter-bar"
import { MemberCard } from "@/components/member-card"
import { MemberDetailModal } from "@/components/member-detail-modal"
import { logout } from "@/app/actions/auth"
import type { Member } from "@/lib/zukan"

export function MemberGallery() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedHashtag, setSelectedHashtag] = useState("")

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/zukan")
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || "データの取得に失敗しました。")
        }
        setMembers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました。")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMembers()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(members.map((m) => m.ageGroup).filter(Boolean))
    return Array.from(set)
  }, [members])

  // J列のハッシュタグを分割・重複除去して一覧化
  const allHashtags = useMemo(() => {
    const set = new Set<string>()
    members.forEach((m) => {
      if (m.hashtags) {
        m.hashtags.split(/[,、\s]+/).filter(Boolean).forEach((tag) => set.add(tag))
      }
    })
    return Array.from(set)
  }, [members])

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(q) ||
        member.location.toLowerCase().includes(q) ||
        member.university.toLowerCase().includes(q) ||
        member.skills.toLowerCase().includes(q) ||
        member.motto.toLowerCase().includes(q) ||
        member.hashtags.toLowerCase().includes(q)
      const matchesCategory =
        selectedCategory === "" || member.ageGroup === selectedCategory
      const memberTags = member.hashtags
        ? member.hashtags.split(/[,、\s]+/).filter(Boolean)
        : []
      const matchesHashtag =
        selectedHashtag === "" || memberTags.includes(selectedHashtag)
      return matchesSearch && matchesCategory && matchesHashtag
    })
  }, [members, searchQuery, selectedCategory, selectedHashtag])

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#1e3a5f]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#f5f0e6]/95 backdrop-blur-sm border-b border-[#ddd5c4]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <a
            href="https://sofi-highschool.studio.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <Image
              src="/images/sofi-logo.png"
              alt="SOFI高等学院"
              width={40}
              height={40}
              style={{ width: "auto", height: "40px" }}
              className="shrink-0"
            />
            <span
              className="text-sm font-medium text-[#1e3a5f] group-hover:text-[#c5a84a] transition-colors"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              SOFI高等学院
            </span>
          </a>
          <nav className="flex items-center gap-3">
            <span
              className="hidden sm:inline text-xs px-4 py-1.5 rounded-full bg-[#1e3a5f] text-[#f5f0e6] font-medium"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              ナナメン紹介
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-[#9a7250] hover:text-[#1e3a5f] transition-colors px-2 py-1.5 rounded-full hover:bg-[#ddd5c4]/40"
                style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
                title="ログアウト"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">ログアウト</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-8 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-baseline gap-4">
            <h1
              className="text-2xl font-medium"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              <span style={{ color: "#1e3a5f" }}>ナナメン</span>
              <span style={{ color: "#c5a84a" }}>紹介サイト</span>
            </h1>
            <p className="hidden sm:block text-xs text-[#264a75]">
              生徒と斜めの関係で向き合うSOFIのスタッフ・教員
            </p>
          </div>
          {!isLoading && !error && members.length > 0 && (
            <span className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-medium text-[#1e3a5f] border border-[#ddd5c4] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a84a]" />
              <span style={{ fontFamily: "var(--font-zen-maru-gothic)" }}>
                {members.length}名のナナメン
              </span>
            </span>
          )}
        </div>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="border-t border-[#c5a84a]/30" />
        </div>
      </section>

      {/* Filter & Content */}
      <main className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
        {/* Filter Bar */}
        {!isLoading && !error && members.length > 0 && (
          <div className="mb-8">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => setSelectedCategory(cat === selectedCategory ? "" : cat)}
              hashtags={allHashtags}
              selectedHashtag={selectedHashtag}
              onHashtagChange={(tag) => setSelectedHashtag(tag === selectedHashtag ? "" : tag)}
            />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[#1e3a5f]" />
            </div>
            <span
              className="text-[10px] tracking-[0.4em] text-[#c5a84a] uppercase font-semibold"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              LOADING
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-white rounded-2xl border border-[#ddd5c4] p-6">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-[#1e3a5f]" />
            <div>
              <p className="text-sm font-medium text-[#1e3a5f]">データの取得に失敗しました</p>
              <p className="mt-1 text-xs text-[#264a75]">{error}</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredMembers.length === 0 && (
          <div className="py-24 text-center bg-white rounded-2xl border border-dashed border-[#ddd5c4]">
            <p className="text-sm text-[#264a75]">
              該当するナナメンが見つかりません
            </p>
            <p className="mt-2 text-xs text-[#c5a84a]">
              検索条件やカテゴリを変更してみてください。
            </p>
          </div>
        )}

        {/* Card Grid */}
        {!isLoading && !error && filteredMembers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                index={index}
                onOpenDetail={setSelectedMember}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#c5a84a]/30 mt-16 bg-[#1e3a5f]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/sofi-logo.png"
              alt="SOFI高等学院"
              width={32}
              height={32}
              style={{ width: "auto", height: "32px" }}
              className="shrink-0"
            />
            <span
              className="text-sm text-[#f5f0e6]"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              SOFI高等学院
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span
              className="text-xs text-[#c5a84a] italic"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Stand out fit in
            </span>
            <span
              className="text-[10px] tracking-[0.3em] text-[#f5f0e6]/60 uppercase"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              © 2024 SOFI HIGH SCHOOL
            </span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  )
}
