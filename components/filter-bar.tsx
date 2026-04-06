"use client"

import { Search, X } from "lucide-react"

type FilterBarProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  categories: string[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
  hashtags: string[]
  selectedHashtag: string
  onHashtagChange: (value: string) => void
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  hashtags,
  selectedHashtag,
  onHashtagChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* 検索 */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#c5a84a]" />
        <input
          type="text"
          placeholder="名前・紹介で検索"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white rounded-full border border-[#ddd5c4] py-2.5 pl-10 pr-9 text-sm text-[#1e3a5f] placeholder:text-[#c5a84a]/70 outline-none focus:border-[#1e3a5f] transition-colors"
          style={{ fontFamily: "var(--font-noto-sans-jp)" }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c5a84a] hover:text-[#1e3a5f] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* カテゴリ（ageGroup） */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-[10px] tracking-[0.3em] text-[#c5a84a] uppercase shrink-0 mr-1"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            AGE
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`text-xs px-4 py-1.5 rounded-full transition-all font-medium ${
                selectedCategory === cat
                  ? "bg-[#1e3a5f] text-[#f5f0e6]"
                  : "bg-white text-[#264a75] border border-[#ddd5c4] hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
              }`}
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* マイ# ハッシュタグ */}
      {hashtags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-[10px] tracking-[0.3em] text-[#c5a84a] uppercase shrink-0 mr-1"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            マイ#
          </span>
          {hashtags.map((tag) => (
            <button
              key={tag}
              onClick={() => onHashtagChange(tag)}
              className={`text-xs px-3 py-1 rounded-full transition-all font-medium ${
                selectedHashtag === tag
                  ? "bg-[#c5a84a] text-white"
                  : "bg-white text-[#264a75] border border-[#ddd5c4] hover:border-[#c5a84a] hover:text-[#c5a84a]"
              }`}
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
