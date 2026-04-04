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
    <div className="min-h-screen bg-stone-50">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.08),transparent_40%)]" />
      </div>

      <header className="relative z-10 border-b border-stone-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/50">
              <div className="h-4 w-4 rounded-full border border-amber-500/70" />
            </div>

            <div>
              <p className="text-lg font-semibold tracking-wide text-stone-900">
                WINTTLE ASSISTANT
              </p>
              <p className="text-[11px] tracking-[0.28em] text-stone-500 uppercase">
                Introduction Archive
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            アシスタント紹介一覧
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            Googleスプレッドシートのデータをもとに、Winttleのアシスタント情報を一覧表示しています。
          </p>
        </div>

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
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
            <p className="mt-4 text-sm text-stone-500">データを読み込んでいます...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">データの取得に失敗しました</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && filteredMembers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-stone-900">
              該当するメンバーが見つかりません
            </p>
            <p className="mt-2 text-sm text-stone-500">
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
    </div>
  )
}