# ナナメン紹介サイト — SOFI高等学院

SOFI高等学院のナナメン（スタッフ・教員）を紹介するサイトです。
Google スプレッドシートをデータソースとし、メンバーの検索・フィルタリング・世界マップ表示ができます。

## 機能

- **ナナメン一覧** — カードグリッド表示、U25/U20 バッジ
- **検索** — 名前・大学・スキル・モットー・ハッシュタグで横断検索
- **フィルター** — 年齢区分（AGE）およびマイ# ハッシュタグ（同ボタン再押しで解除）
- **詳細モーダル** — カードクリックでナナメンビューを表示
- **世界マップ** — B列の現在地を地図上にプロット、マーカークリックで詳細表示
- **認証** — 個人アカウント制（サインアップ / ログイン / ログアウト）
- **アクセス解析** — Vercel Web Analytics によるPV・閲覧者数計測

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
| 地図 | Leaflet + react-leaflet（CartoDB Positron タイル） |
| ジオコーディング | 内蔵座標テーブル + Nominatim フォールバック |
| アクセス解析 | Vercel Web Analytics |
| デプロイ | Vercel |

---

## ディレクトリ構成

```
.
├── app/
│   ├── actions/auth.ts          # Server Actions（ログイン・サインアップ・ログアウト）
│   ├── api/
│   │   ├── geocode/route.ts     # POST /api/geocode — 地名→座標変換
│   │   └── zukan/route.ts       # GET /api/zukan — スプレッドシートデータ
│   ├── login/page.tsx           # ログインページ
│   ├── signup/page.tsx          # サインアップページ
│   ├── page.tsx                 # トップページ
│   ├── layout.tsx               # ルートレイアウト・フォント・Analytics
│   └── globals.css              # グローバルスタイル
├── components/
│   ├── member-gallery.tsx       # タブ切り替え・検索・フィルター・カードグリッド
│   ├── member-card.tsx          # 個別メンバーカード
│   ├── member-detail-modal.tsx  # ナナメンビュー（詳細モーダル）
│   ├── member-map.tsx           # 世界マップ（Leaflet）
│   └── filter-bar.tsx           # 検索バー・AGEフィルター・マイ#フィルター
├── lib/
│   ├── zukan.ts                 # Google Sheets API クライアント・型定義
│   ├── image-utils.ts           # Google Drive URL 変換
│   ├── db.ts                    # Neon PostgreSQL クライアント
│   ├── session.ts               # HMAC-SHA256 セッション管理
│   └── auth-utils.ts            # PBKDF2 パスワードハッシュ
├── proxy.ts                     # ルート保護（Next.js 16 の middleware 相当）
├── next.config.ts
└── .env.local                   # 環境変数（git 管理外）
```

> **注意**: Next.js 16 では `middleware.ts` は非推奨です。ルート保護は `proxy.ts` の `proxy` 関数で行います。

---

## スプレッドシートの列マッピング

スプレッドシート名: `ナナメンデータ`（1行目はヘッダー行）

| 列 | フィールド | 説明 |
|---|---|---|
| A | `name` | 氏名 |
| B | `location` | 現在地（世界マップに表示） |
| C | `hometown` | 出身地 |
| D | `ageGroup` | 年齢区分（例: `U25`, `U20`） |
| E | `university` | 大学名 |
| F | `faculty` | 学部・学科 |
| G | `skills` | スキル・特技 |
| H | —（スキップ） | |
| I | `motto` | モットー・座右の銘 |
| J | `hashtags` | マイ# タグ（カンマ・読点・スペース区切り） |
| K | `career` | こんな進路や相談にのれるよ（カンマ区切りでタグ表示） |
| L | —（スキップ） | |
| M | `url` | SNS・個人サイト URL |
| N | `imageUrl` | Google ドライブの共有リンク |

### Google ドライブ画像のリンク形式

N列には以下の形式のリンクを設定してください。公開設定は「リンクを知っている全員」にしてください。

```
https://drive.google.com/file/d/{ファイルID}/view?usp=sharing
```

`lib/image-utils.ts` が自動的に Thumbnail API 形式へ変換します。

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
3. **環境変数を設定** — Vercel ダッシュボード → Settings → Environment Variables に以下を追加:
   - `GOOGLE_SHEETS_API_KEY`
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SHEETS_RANGE` → 値: `'ナナメンデータ'!A:N`（ダブルクォート不要）
   - `SESSION_SECRET`
   - `DATABASE_URL`
4. **Analytics を有効化** — Vercel ダッシュボード → Analytics → Enable
5. **デプロイ** — `main` ブランチへのプッシュで自動デプロイ

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

## 世界マップのしくみ

```
マップタブを開く
  → /api/geocode に地名リストを POST
  → サーバー側で内蔵座標テーブル（約90都市）をキーワードマッチ
  → テーブルにない地名のみ Nominatim API（OpenStreetMap）に問い合わせ
  → 座標をクライアントに返却 → Leaflet でマーカーを表示

マーカーをタップ
  → その地点のナナメン一覧をポップアップ表示
  → メンバーをタップ → ナナメンビュー（詳細モーダル）を開く
```

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
