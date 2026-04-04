"use client"

import { Search } from "lucide-react"

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
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700/60" />
        <input
          type="text"
          placeholder="名前や一言紹介で検索..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCategoryChange("")}
          className={`rounded-full border px-4 py-2 text-xs font-medium tracking-wider transition ${
            selectedCategory === ""
              ? "border-amber-500 bg-amber-500 text-white"
              : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-stone-900"
          }`}
        >
          すべて
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full border px-4 py-2 text-xs font-medium tracking-wider transition ${
              selectedCategory === category
                ? "border-amber-500 bg-amber-500 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-stone-900"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}