import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USER_COOKIE_KEY = "user";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const savedUser = request.cookies.get(USER_COOKIE_KEY);
    if (savedUser?.value) {
      return NextResponse.redirect(new URL("/expenses", request.url));
    }
  }
  return NextResponse.next();
}
