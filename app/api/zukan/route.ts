import { NextResponse } from "next/server";
import { getZukanItems } from "@/lib/zukan";

export async function GET() {
  try {
    const items = await getZukanItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { message: "図鑑データの取得に失敗しました。" },
      { status: 500 }
    );
  }
}