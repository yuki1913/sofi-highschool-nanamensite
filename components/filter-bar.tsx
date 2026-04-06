"use client"

import { Search, X } from "lucide-react"

type FilterBarProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  categories: string[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* 検索 */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#c4a882]" />
        <input
          type="text"
          placeholder="名前・紹介で検索"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white rounded-full border border-[#e8d5be] py-2.5 pl-10 pr-9 text-sm text-[#2d1f0e] placeholder:text-[#c4a882] outline-none focus:border-[#f07840] transition-colors"
          style={{ fontFamily: "var(--font-noto-sans-jp)" }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c4a882] hover:text-[#f07840] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* カテゴリ */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onCategoryChange("")}
            className={`text-xs px-4 py-1.5 rounded-full transition-all font-medium ${
              selectedCategory === ""
                ? "bg-[#f07840] text-white"
                : "bg-white text-[#9a7250] border border-[#e8d5be] hover:border-[#f07840] hover:text-[#f07840]"
            }`}
            style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
          >
            すべて
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`text-xs px-4 py-1.5 rounded-full transition-all font-medium ${
                selectedCategory === cat
                  ? "bg-[#f07840] text-white"
                  : "bg-white text-[#9a7250] border border-[#e8d5be] hover:border-[#f07840] hover:text-[#f07840]"
              }`}
              style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
