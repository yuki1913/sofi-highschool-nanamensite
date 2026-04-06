import { NextRequest, NextResponse } from "next/server"
import { verifySession, COOKIE_NAME } from "@/lib/session"

const PUBLIC_PATHS = ["/login", "/signup"]

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p))

  const token = req.cookies.get(COOKIE_NAME)?.value
  const isAuthenticated = token ? await verifySession(token) : false

  // 未認証 → /login にリダイレクト
  if (!isPublic && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // 認証済みで /login・/signup にアクセス → トップにリダイレクト
  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|images/).*)"],
}
