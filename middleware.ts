import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the current session
  const session = await auth();

  // List of protected routes that require authentication
  const protectedPaths = [
    "/dashboard",
    "/exercises",
    "/workout",
    "/history",
    "/stats",
  ];

  const pathname = request.nextUrl.pathname;

  // Check if the current path is a protected path
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // If no session and trying to access protected path, redirect to login
  if (!session && isProtectedPath) {
    const loginUrl = new URL("/login", request.url);
    // Add redirect parameter to send user back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
