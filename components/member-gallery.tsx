"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { FilterBar } from "@/components/filter-bar"
import { MemberCard, type Member } from "@/components/member-card"

export function MemberGallery() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

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
    const set = new Set(members.map((m) => m.category).filter(Boolean))
    return Array.from(set)
  }, [members])

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.shortIntro.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.fullIntro.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "" || member.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [members, searchQuery, selectedCategory])

  return (
    <div className="min-h-screen bg-[#faf0e4] text-[#2d1f0e]">
      {/* ─── ヘッダー ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf0e4]/95 backdrop-blur-sm border-b border-[#e8d5be]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <a
            href="https://sofi-highschool.studio.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#2d1f0e] flex items-center justify-center shrink-0">
              <span
                className="text-[7px] font-bold text-[#faf0e4] tracking-wider"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                SOFI
              </span>
            </div>
            <span
              className="text-sm font-medium text-[#2d1f0e] group-hover:text-[#f07840] transition-colors"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              SOFI高等学院
            </span>
          </a>
          <nav className="hidden sm:flex items-center">
            <span
              className="text-xs px-4 py-1.5 rounded-full bg-[#f07840] text-white font-medium"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              ナナメン紹介
            </span>
          </nav>
        </div>
      </header>

      {/* ─── ヒーロー ─── */}
      <section className="pt-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-16 pb-12 lg:pt-24 lg:pb-16">
          {/* ラベル */}
          <p
            className="text-[10px] tracking-[0.5em] text-[#9a7250] uppercase mb-6"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            SOFI高等学院
          </p>

          {/* メインタイトル */}
          <h1
            className="text-[clamp(44px,8vw,96px)] font-medium leading-tight text-[#2d1f0e] mb-2"
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            ナナメンを
          </h1>
          <h1
            className="text-[clamp(44px,8vw,96px)] font-medium leading-tight mb-10"
            style={{ fontFamily: "var(--font-zen-maru-gothic)", color: "#f07840" }}
          >
            紹介します
          </h1>

          {/* 説明文 */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <p className="max-w-md text-sm leading-7 text-[#5c3d20]">
              SOFI高等学院のスタッフ・教員を紹介します。
              <br />
              生徒と斜めの関係で向き合う、ナナメンたちです。
            </p>
            {!isLoading && !error && members.length > 0 && (
              <div className="sm:ml-auto shrink-0">
                <span className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 text-sm font-medium text-[#5c3d20] border border-[#e8d5be]">
                  <span className="w-2 h-2 rounded-full bg-[#f07840]" />
                  <span style={{ fontFamily: "var(--font-zen-maru-gothic)" }}>
                    {members.length}名のナナメン
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="border-t border-[#e8d5be]" />
        </div>
      </section>

      {/* ─── フィルター & コンテンツ ─── */}
      <main className="max-w-[1280px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {/* フィルターバー */}
        {!isLoading && !error && members.length > 0 && (
          <div className="mb-10">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        )}

        {/* ローディング */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f07840]/10 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[#f07840]" />
            </div>
            <span
              className="text-[10px] tracking-[0.4em] text-[#9a7250] uppercase"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              LOADING
            </span>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="flex items-start gap-3 bg-white rounded-2xl border border-[#e8d5be] p-6">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-[#f07840]" />
            <div>
              <p className="text-sm font-medium text-[#2d1f0e]">データの取得に失敗しました</p>
              <p className="mt-1 text-xs text-[#9a7250]">{error}</p>
            </div>
          </div>
        )}

        {/* 該当なし */}
        {!isLoading && !error && filteredMembers.length === 0 && (
          <div className="py-24 text-center bg-white rounded-2xl border border-dashed border-[#e8d5be]">
            <p className="text-sm text-[#9a7250]">
              該当するナナメンが見つかりません
            </p>
            <p className="mt-2 text-xs text-[#c4a882]">
              検索条件やカテゴリを変更してみてください。
            </p>
          </div>
        )}

        {/* カードグリッド */}
        {!isLoading && !error && filteredMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}
      </main>

      {/* ─── フッター ─── */}
      <footer className="border-t border-[#e8d5be] mt-16 bg-[#f5e4d0]/40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#2d1f0e] flex items-center justify-center">
              <span
                className="text-[6px] font-bold text-[#faf0e4]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                SOFI
              </span>
            </div>
            <span
              className="text-sm text-[#5c3d20]"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              SOFI高等学院
            </span>
          </div>
          <span
            className="text-[10px] tracking-[0.3em] text-[#c4a882] uppercase"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            © 2024 SOFI HIGH SCHOOL
          </span>
        </div>
      </footer>
    </div>
  )
}
