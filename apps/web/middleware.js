import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  // ❌ NOT LOGGED IN
  if (!token) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ❌ ADMIN ONLY
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};