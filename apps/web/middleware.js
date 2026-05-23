import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  console.log("MIDDLEWARE RUNNING");
  console.log("PATH:", pathname);
  console.log("TOKEN:", token);
  console.log("ROLE:", role);

  // =========================
  // PROTECTED ROUTES
  // =========================
  const isDashboard =
    pathname.startsWith("/dashboard");

  const isAdmin =
    pathname.startsWith("/admin");

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!token && (isDashboard || isAdmin)) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // =========================
  // ADMIN ONLY
  // =========================
  if (isAdmin && role !== "admin") {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};