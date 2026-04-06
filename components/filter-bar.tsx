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
    <div className="flex flex-col gap-6">
      {/* 検索 */}
      <div className="relative max-w-xs">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30" />
        <input
          type="text"
          placeholder="名前・紹介で検索"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border-b border-black/20 bg-transparent py-2 pl-6 pr-7 text-sm text-black placeholder:text-black/25 outline-none focus:border-black/60 transition-colors"
          style={{ fontFamily: "var(--font-noto-sans-jp)" }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/60 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* カテゴリ */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span
            className="text-[9px] tracking-[0.4em] text-black/25 uppercase shrink-0"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            CATEGORY
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <button
              onClick={() => onCategoryChange("")}
              className={`text-xs tracking-wide transition-colors pb-0.5 ${
                selectedCategory === ""
                  ? "text-black border-b border-black"
                  : "text-black/35 hover:text-black/60 border-b border-transparent"
              }`}
            >
              すべて
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`text-xs tracking-wide transition-colors pb-0.5 ${
                  selectedCategory === cat
                    ? "text-black border-b border-black"
                    : "text-black/35 hover:text-black/60 border-b border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
