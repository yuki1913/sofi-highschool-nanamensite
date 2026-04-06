# ナナメン紹介サイト — SOFI高等学院

SOFI高等学院のナナメン（スタッフ・教員）を紹介するサイトです。
Google スプレッドシートをデータソースとし、メンバーの検索・フィルタリングができます。

## 機能

- **ナナメン一覧** — カードグリッド表示、U25/U20 バッジ
- **検索** — 名前・大学・スキル・モットー・ハッシュタグで横断検索
- **フィルター** — 年齢区分（AGE）およびマイ# ハッシュタグでフィルタリング（同ボタン再押しで解除）
- **詳細モーダル** — カードクリックで詳細を表示
- **認証** — 個人アカウント制（サインアップ / ログイン / ログアウト）

---

## 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | Next.js 16 (App Router, Turbopack) |
| スタイリング | Tailwind CSS v4 |
| フォント | Noto Sans JP / Zen Maru Gothic / Montserrat |
| データソース | Google Sheets API v4（60秒 ISR キャッシュ） |
| 画像ホスト | Google Drive（Thumbnail API） |
| データベース | Neon（サーバーレス PostgreSQL） |
| 認証 | PBKDF2 ハッシュ + HMAC-SHA256 セッション（Web Crypto API） |
| デプロイ | Vercel |

---

## ディレクトリ構成

```
.
├── app/
│   ├── actions/auth.ts       # Server Actions（ログイン・サインアップ・ログアウト）
│   ├── api/zukan/route.ts    # GET /api/zukan — スプレッドシートデータを返す
│   ├── login/page.tsx        # ログインページ
│   ├── signup/page.tsx       # サインアップページ
│   ├── page.tsx              # トップページ（MemberGallery をレンダリング）
│   ├── layout.tsx            # ルートレイアウト・フォント設定
│   └── globals.css           # グローバルスタイル
├── components/
│   ├── member-gallery.tsx    # 検索・フィルター・カードグリッド全体
│   ├── member-card.tsx       # 個別メンバーカード
│   ├── filter-bar.tsx        # 検索バー・AGEフィルター・マイ#フィルター
│   └── member-detail-modal.tsx # 詳細モーダル
├── lib/
│   ├── zukan.ts              # Google Sheets API クライアント・型定義
│   ├── image-utils.ts        # Google Drive URL 変換ユーティリティ
│   ├── db.ts                 # Neon PostgreSQL クライアント
│   ├── session.ts            # HMAC-SHA256 セッショントークン管理
│   └── auth-utils.ts         # PBKDF2 パスワードハッシュ
├── proxy.ts                  # ルート保護（Next.js 16 の middleware 相当）
├── next.config.ts
└── .env.local                # 環境変数（git 管理外）
```

> **注意**: Next.js 16 では `middleware.ts` は非推奨です。ルート保護は `proxy.ts` の `proxy` 関数で行います。

---

## スプレッドシートの列マッピング

スプレッドシート名: `ナナメンデータ`（1行目はヘッダー行）

| 列 | フィールド | 説明 |
|---|---|---|
| A | `name` | 氏名 |
| B | `location` | 現在地 |
| C | `hometown` | 出身地 |
| D | `ageGroup` | 年齢区分（例: `U25`, `U20`） |
| E | `university` | 大学名 |
| F | `faculty` | 学部・学科 |
| G | `skills` | スキル・特技 |
| H | —（スキップ） | |
| I | `motto` | モットー・座右の銘 |
| J | `hashtags` | マイ# タグ（カンマ・読点・スペース区切り） |
| K | `career` | キャリア・経歴 |
| L | —（スキップ） | |
| M | `url` | SNS・個人サイト URL |
| N | `imageUrl` | Google ドライブの共有リンク |

### Google ドライブ画像のリンク形式

N列には以下の形式のリンクを設定してください。公開設定は「リンクを知っている全員」にしてください。

```
https://drive.google.com/file/d/{ファイルID}/view?usp=sharing
```

`lib/image-utils.ts` が自動的に Thumbnail API 形式（`drive.google.com/thumbnail?id=...&sz=w800`）へ変換します。

---

## ローカル開発のセットアップ

### 1. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd sofi-highschool-nanamensite
npm install
```

### 2. 環境変数の設定

`.env.local` をプロジェクトルートに作成します。

```env
# Google Sheets
GOOGLE_SHEETS_API_KEY=AIza...
GOOGLE_SHEETS_SPREADSHEET_ID=1xxxxxxxxxxxx
GOOGLE_SHEETS_RANGE="'ナナメンデータ'!A:N"

# セッション署名キー（ランダムな文字列）
SESSION_SECRET=your-random-secret-here

# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

`SESSION_SECRET` は以下のコマンドで生成できます。

```bash
openssl rand -base64 32
```

### 3. データベースのセットアップ

Neon のダッシュボード → **SQL Editor** で以下を実行してください。

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

---

## Vercel へのデプロイ

1. **Neon データベースを作成** — [neon.tech](https://neon.tech) で無料アカウントを作成し、上記の CREATE TABLE を実行
2. **Vercel にプロジェクトを追加** — GitHub リポジトリを連携
3. **環境変数を設定** — Vercel ダッシュボード → Settings → Environment Variables に `.env.local` の内容を追加
4. **デプロイ** — `main` ブランチへのプッシュで自動デプロイされます

---

## 認証のしくみ

```
サインアップ
  → PBKDF2 (SHA-256, 100,000 iterations) でパスワードをハッシュ化
  → Neon DB に username / password_hash / salt を保存
  → HMAC-SHA256 署名付きセッショントークンを生成（有効期限 7 日）
  → HttpOnly Cookie にセット → トップページへリダイレクト

ログイン
  → DB からユーザーを取得 → パスワードをタイミングセーフに検証
  → セッショントークンを発行 → Cookie にセット

ルート保護 (proxy.ts)
  → Cookie のトークンを HMAC で検証
  → 未認証 → /login へリダイレクト
  → 認証済みで /login・/signup → トップへリダイレクト
```

すべての暗号処理は Web Crypto API を使用しており、外部依存なしで Edge Runtime 上で動作します。

---

## Google Sheets API キーの取得

1. [Google Cloud Console](https://console.cloud.google.com) でプロジェクトを作成
2. **Google Sheets API** を有効化
3. **認証情報** → API キーを作成
4. API キーの制限（推奨）: HTTP リファラー制限 + Google Sheets API のみ許可

スプレッドシートの共有設定は「リンクを知っている全員が閲覧可能」にしてください。

---

## スクリプト

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー起動（Turbopack） |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLint 実行 |
