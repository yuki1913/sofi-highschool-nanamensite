export type Member = {
  id: string
  name: string        // A列
  location: string    // B列
  hometown: string    // C列
  ageGroup: string    // D列
  university: string  // E列
  faculty: string     // F列
  skills: string      // G列
  // H列はスキップ
  motto: string       // I列
  hashtags: string    // J列
  career: string      // K列
  // L列はスキップ
  url: string         // M列
  imageUrl: string    // N列
}

type GoogleSheetsResponse = {
  values?: string[][]
}

export async function getZukanItems(): Promise<Member[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const range = process.env.GOOGLE_SHEETS_RANGE ?? "ナナメンデータ!A:N"

  if (!apiKey || !spreadsheetId) {
    throw new Error("環境変数が不足しています。")
  }

  // Remove trailing slash from spreadsheetId if present
  const cleanSpreadsheetId = spreadsheetId.replace(/\/+$/, "")

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanSpreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`

  const res = await fetch(url, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error("Google Sheets API からの取得に失敗しました。")
  }

  const data: GoogleSheetsResponse = await res.json()

  // 1行目はタイトル行なのでスキップ（index 0）
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
      skills: row[6] ?? "",     // G列
      // row[7] はH列（スキップ）
      motto: row[8] ?? "",      // I列
      hashtags: row[9] ?? "",   // J列
      career: row[10] ?? "",    // K列
      // row[11] はL列（スキップ）
      url: row[12] ?? "",       // M列
      imageUrl: row[13] ?? "",  // N列
    }))
    .filter((item) => item.name)
}
