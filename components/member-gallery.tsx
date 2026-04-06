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
        setError(
          err instanceof Error ? err.message : "エラーが発生しました。"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(
      members.map((member) => member.category).filter(Boolean)
    )
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
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              SOFI
            </span>
            <span className="h-4 w-px bg-gray-300" />
            <span className="text-sm font-medium text-gray-800">
              高等学院
            </span>
          </div>
          <span className="text-[11px] tracking-[0.3em] text-gray-400 uppercase hidden sm:block"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            NANAMEN
          </span>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          <p
            className="text-[11px] tracking-[0.4em] text-gray-400 uppercase mb-4"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            SOFI HIGH SCHOOL
          </p>
          <h1
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            ナナメン紹介
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-gray-500">
            SOFI高等学院のスタッフ・教員を紹介します。
          </p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
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

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-4 text-sm text-gray-400">読み込んでいます...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-5 text-red-600">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium text-sm">データの取得に失敗しました</p>
              <p className="mt-1 text-xs text-red-500">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && filteredMembers.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <p className="text-base font-medium text-gray-700">
              該当するナナメンが見つかりません
            </p>
            <p className="mt-2 text-sm text-gray-400">
              検索条件やカテゴリを変更してみてください。
            </p>
          </div>
        )}

        {!isLoading && !error && filteredMembers.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="mt-16 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
          <p className="text-center text-xs text-gray-400 tracking-wider"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            © SOFI HIGH SCHOOL
          </p>
        </div>
      </footer>
    </div>
  )
}
