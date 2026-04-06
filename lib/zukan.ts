export type ZukanItem = {
    id: string;
    name: string;
    shortIntro: string;
    category: string;
    fullIntro: string;
  };
  
  type GoogleSheetsResponse = {
    values?: string[][];
  };
  
  export async function getZukanItems(): Promise<ZukanItem[]> {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = process.env.GOOGLE_SHEETS_RANGE ?? "シート1!A2:E1000";
  
  if (!apiKey || !spreadsheetId) {
      throw new Error("環境変数が不足しています。");
    }

    // Remove trailing slash from spreadsheetId if present
    const cleanSpreadsheetId = spreadsheetId.replace(/\/+$/, '');

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanSpreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

  
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
  
    if (!res.ok) {
      throw new Error("Google Sheets API からの取得に失敗しました。");
    }
  
    const data: GoogleSheetsResponse = await res.json();
  
    return (data.values ?? [])
      .map((row, index) => ({
        id: row[0] ?? String(index + 1),
        name: row[1] ?? "",
        shortIntro: row[2] ?? "",
        category: row[3] ?? "",
        fullIntro: row[4] ?? "",
      }))
      .filter((item) => item.name);
  }
