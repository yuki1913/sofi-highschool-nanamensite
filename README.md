# Winttle Assistant Site

Winttle のアシスタントを一覧表示・検索できる紹介サイトです。  
Google スプレッドシートをデータソースとして管理し、Web サイト上でリアルタイムに参照できます。

---

## 機能

- **一覧表示** — アシスタント情報をカード形式でグリッド表示（1〜3列のレスポンシブ対応）
- **テキスト検索** — 名前・短い紹介文・詳細紹介文をまたいで絞り込み
- **カテゴリーフィルター** — スプレッドシートのカテゴリー列から自動生成したボタンで絞り込み
- **続きを読む** — 詳細紹介文が長い場合は折りたたんで表示、ボタンで展開可能
- **60 秒キャッシュ** — Google Sheets API の呼び出しは ISR（`revalidate: 60`）でキャッシュ

---

## 技術スタック

| カテゴリ | 使用技術 |
|----------|----------|
| フレームワーク | Next.js 16.2.2 (App Router) |
| UI ライブラリ | React 19 |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| アイコン | lucide-react |
| データソース | Google Sheets API v4 |

---

## ディレクトリ構成

```
.
├── app/
│   ├── layout.tsx              # ルートレイアウト
│   ├── page.tsx                # トップページ（MemberGallery を表示）
│   └── api/
│       └── zukan/
│           └── route.ts        # GET /api/zukan — スプレッドシートからデータ取得
├── components/
│   ├── member-gallery.tsx      # ギャラリー全体（検索・フィルター・一覧）
│   ├── member-card.tsx         # アシスタント 1 件のカード
│   └── filter-bar.tsx          # 検索入力 + カテゴリーボタン
├── lib/
│   └── zukan.ts                # Google Sheets API クライアント・型定義
└── .env.local                  # 環境変数（要作成）
```

---

## セットアップ

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd winttle-assistant-site
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env.local` を作成し、以下を記入してください。

```env
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
# 省略可。デフォルトは "シート1!A2:E1000"
GOOGLE_SHEETS_RANGE=シート1!A2:E1000
```

> **Google Sheets API キーの取得方法**  
> Google Cloud Console でプロジェクトを作成し、Google Sheets API を有効化した上で API キーを発行してください。スプレッドシートは「リンクを知っている全員が閲覧可能」に設定する必要があります。

### 4. スプレッドシートの形式

2 行目以降にデータを入力してください（1 行目はヘッダー行として読み飛ばされます）。

| 列 | 内容 | 例 |
|----|------|----|
| A | ID | 1 |
| B | 名前 | 山田 太郎 |
| C | 短い紹介文 | 資料作成が得意です |
| D | カテゴリー | 事務サポート |
| E | 詳細紹介文 | （長文可） |

### 5. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くとサイトが表示されます。

---

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLint 実行 |

---

## データフロー

```
ブラウザ
  └─ GET /api/zukan
        └─ lib/zukan.ts → Google Sheets API
              └─ スプレッドシートの行データを ZukanItem[] に変換して返却
```

クライアント側（`MemberGallery`）は初回マウント時に `/api/zukan` を fetch し、取得した配列を状態管理して検索・フィルタリングを行います。
