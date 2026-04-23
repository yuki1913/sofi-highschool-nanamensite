import { convertGoogleDriveUrl } from "./image-utils"

export type Member = {
  id: string
  name: string        // A列
  location: string    // B列
  hometown: string    // C列
  ageGroup: string    // D列
  university: string  // E列
  faculty: string     // F列
  mbti: string        // G列（NEW）
  skills: string      // H列
  motto: string       // J列
  hashtags: string    // K列
  career: string      // L列
  questions: string   // M列（NEW）
  url: string         // N列
  imageUrl: string    // P列
}

type GoogleSheetsResponse = {
  values?: string[][]
}

export async function getZukanItems(): Promise<Member[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const range = process.env.GOOGLE_SHEETS_RANGE ?? "'ナナメンデータ'!A:P"

  if (!apiKey || !spreadsheetId) {
    throw new Error("環境変数が不足しています。")
  }

  const cleanSpreadsheetId = spreadsheetId.replace(/\/+$/, "")
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanSpreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`

  const res = await fetch(url, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error("Google Sheets API からの取得に失敗しました。")
  }

  const data: GoogleSheetsResponse = await res.json()

  const rows = (data.values ?? []).slice(1)

  return rows
    .map((row, index) => ({
      id: String(index + 1),
      name: row[0] ?? "",       // A列
      location: row[1] ?? "",   // B列
      hometown: row[2] ?? "",   // C列
      ageGroup: row[3] ?? "",   // D列
      university: row[4] ?? "", // E列
      faculty: row[5] ?? "",    // F列
      mbti: row[6] ?? "",       // G列
      skills: row[7] ?? "",     // H列
      // row[8] はI列（好きなこと、スキップ）
      motto: row[9] ?? "",      // J列
      hashtags: row[10] ?? "",  // K列
      career: row[11] ?? "",    // L列
      questions: row[12] ?? "", // M列
      url: row[13] ?? "",       // N列
      // row[14] はO列（スキップ）
      imageUrl: convertGoogleDriveUrl(row[15] ?? ""),  // P列
    }))
    .filter((item) => item.name)
}
