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
    <div className="min-h-screen bg-white text-black">
      {/* ─── ヘッダー ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="https://sofi-highschool.studio.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <span
                className="text-[11px] tracking-[0.35em] font-semibold text-black uppercase"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                SOFI
              </span>
              <span className="w-px h-3 bg-black/30" />
              <span
                className="text-[11px] tracking-[0.2em] text-black/60 uppercase"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                HIGH SCHOOL
              </span>
            </a>
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <span
              className="text-[10px] tracking-[0.3em] text-black/40 uppercase"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              NANAMEN
            </span>
          </nav>
        </div>
      </header>

      {/* ─── ヒーロー ─── */}
      <section className="pt-14">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-20 pb-16 lg:pt-28 lg:pb-20">
          {/* 上部 ラベル */}
          <p
            className="text-[10px] tracking-[0.5em] text-black/40 uppercase mb-8"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            SOFI高等学院
          </p>

          {/* メインタイトル */}
          <div className="overflow-hidden mb-2">
            <h1
              className="text-[clamp(52px,10vw,120px)] font-medium leading-none tracking-tight text-black"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              ナナメン
            </h1>
          </div>
          <div className="overflow-hidden mb-10">
            <p
              className="text-[clamp(52px,10vw,120px)] font-medium leading-none tracking-tight text-black/15"
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              紹介
            </p>
          </div>

          {/* 説明文 */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-8">
            <p className="max-w-sm text-sm leading-7 text-black/50">
              SOFI高等学院のスタッフ・教員を紹介します。
              <br />
              生徒と斜めの関係で向き合う、ナナメンたちです。
            </p>
            {!isLoading && !error && members.length > 0 && (
              <p
                className="text-[10px] tracking-[0.3em] text-black/30 uppercase sm:ml-auto"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {members.length} MEMBERS
              </p>
            )}
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-black/10" />
      </section>

      {/* ─── フィルター & コンテンツ ─── */}
      <main className="max-w-[1280px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {/* フィルターバー */}
        {!isLoading && !error && members.length > 0 && (
          <div className="mb-12">
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
            <Loader2 className="h-6 w-6 animate-spin text-black/20" />
            <span
              className="text-[10px] tracking-[0.4em] text-black/30 uppercase"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              LOADING
            </span>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="flex items-start gap-3 border border-black/10 p-6">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-black/40" />
            <div>
              <p className="text-sm font-medium">データの取得に失敗しました</p>
              <p className="mt-1 text-xs text-black/50">{error}</p>
            </div>
          </div>
        )}

        {/* 該当なし */}
        {!isLoading && !error && filteredMembers.length === 0 && (
          <div className="py-24 text-center border border-dashed border-black/15">
            <p className="text-sm text-black/40">
              該当するナナメンが見つかりません
            </p>
            <p className="mt-2 text-xs text-black/25">
              検索条件やカテゴリを変更してみてください。
            </p>
          </div>
        )}

        {/* カードグリッド */}
        {!isLoading && !error && filteredMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-black/10">
            {filteredMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}
      </main>

      {/* ─── フッター ─── */}
      <footer className="border-t border-black/10 mt-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-[10px] tracking-[0.4em] text-black/30 uppercase"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            SOFI HIGH SCHOOL
          </span>
          <span
            className="text-[10px] tracking-[0.3em] text-black/20 uppercase"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            NANAMEN INTRODUCTION
          </span>
        </div>
      </footer>
    </div>
  )
}
