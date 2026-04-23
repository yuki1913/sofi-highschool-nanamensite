"use client"

import { useState } from "react"
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

// ハッシュタグのカテゴリ定義（キーワードの部分一致で分類）
const HASHTAG_CATEGORIES: { label: string; keywords: string[] }[] = [
  {
    label: "スポーツ・体",
    keywords: ["スポーツ", "筋トレ", "ハンドボール", "アスリート", "サイクリング", "ダンス", "バトントワリング", "テニス", "サッカー", "野球", "水泳", "ランニング", "体"],
  },
  {
    label: "国際・語学",
    keywords: ["英語", "スペイン語", "イタリア語", "海外", "留学", "TOEIC", "TOEFL", "語学", "language", "Language"],
  },
  {
    label: "文化・趣味",
    keywords: ["ドラマ", "ピアノ", "茶道", "競技かるた", "音楽", "映画", "読書", "写真", "photoshop", "Photoshop", "デザイン", "アニメ", "キャンプ", "犬", "料理", "食", "旅行", "インスタ"],
  },
  {
    label: "社会・ボランティア",
    keywords: ["ボランティア", "子ども食堂", "子ども", "看護", "行事運営", "地域", "医療", "福祉"],
  },
  {
    label: "ビジネス・キャリア",
    keywords: ["インターンシップ", "起業", "AI", "アパレル", "イベント", "マルシェ", "新規事業", "就職", "リーダー", "スピーチ", "探求", "ビジネス", "マーケ", "経営"],
  },
  {
    label: "ライフ・マインド",
    keywords: ["一人暮らし", "いいとこ探し", "マインドコントロール", "感動", "感謝", "自己分析", "感情", "生活", "人間"],
  },
]

function categorizeHashtag(tag: string): string {
  for (const cat of HASHTAG_CATEGORIES) {
    if (cat.keywords.some((kw) => tag.includes(kw) || kw.includes(tag))) {
      return cat.label
    }
  }
  return "その他"
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
  const [selectedHashtagCategory, setSelectedHashtagCategory] = useState("すべて")

  // ハッシュタグをカテゴリ別にグループ化
  const grouped = new Map<string, string[]>()
  grouped.set("すべて", hashtags)
  for (const tag of hashtags) {
    const cat = categorizeHashtag(tag)
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(tag)
  }

  // 実際に存在するカテゴリのみ（定義順 + その他）
  const presentCategories = ["すべて", ...HASHTAG_CATEGORIES.map((c) => c.label), "その他"].filter(
    (c) => c === "すべて" || (grouped.has(c) && grouped.get(c)!.length > 0)
  )

  const visibleHashtags = grouped.get(selectedHashtagCategory) ?? hashtags

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

      {/* マイ# ハッシュタグ（カテゴリ分け） */}
      {hashtags.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {/* ラベル */}
          <span
            className="text-[10px] tracking-[0.3em] text-[#c5a84a] uppercase"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            マイ#
          </span>

          {/* カテゴリタブ（角丸・塗りつぶし系） */}
          <div className="flex flex-wrap gap-1.5">
            {presentCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedHashtagCategory(cat)}
                className={`text-[11px] px-3.5 py-1.5 rounded-md font-semibold transition-all border ${
                  selectedHashtagCategory === cat
                    ? "bg-[#1e3a5f] text-[#f5f0e6] border-[#1e3a5f]"
                    : "bg-[#eee8dc] text-[#1e3a5f]/70 border-transparent hover:bg-[#ddd5c4] hover:text-[#1e3a5f]"
                }`}
                style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ハッシュタグ一覧（丸ピル・細め） */}
          <div className="flex flex-wrap gap-2 pl-1 pt-1 border-t border-[#ddd5c4]">
            {visibleHashtags.map((tag) => (
              <button
                key={tag}
                onClick={() => onHashtagChange(selectedHashtag === tag ? "" : tag)}
                className={`text-[11px] px-3 py-0.5 rounded-full transition-all font-medium border ${
                  selectedHashtag === tag
                    ? "bg-[#c5a84a] text-white border-[#c5a84a]"
                    : "bg-white text-[#264a75] border-[#ddd5c4] hover:border-[#c5a84a] hover:text-[#c5a84a]"
                }`}
                style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
