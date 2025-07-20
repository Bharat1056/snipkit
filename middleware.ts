import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth

    // Allow public routes
    if (
      pathname === "/" ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/api/user") ||
      pathname.includes(".") ||
      pathname.startsWith("/terms-of-service") ||
      pathname.startsWith("/privacy-policy") ||
      pathname.startsWith("/sitemap") ||
      pathname.startsWith("/robots")
    ) {
      return NextResponse.next()
    }

    // Handle auth pages when user is already authenticated
    if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
      if (token) {
        // User is authenticated, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      // User is not authenticated, allow access to auth pages
      return NextResponse.next()
    }

    // Protected routes that require authentication
    const protectedRoutes = ["/dashboard", "/code", "/cli-login"]
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtectedRoute && !token) {
      // User is not authenticated, redirect to sign-in with callback URL
      const signInUrl = new URL("/sign-in", req.url)
      signInUrl.searchParams.set("callbackUrl", req.url)
      return NextResponse.redirect(signInUrl)
    }

    // For /code/[username]/[codename] public routes, allow access without authentication
    const codeViewPattern = /^\/code\/[^/]+\/[^/]+/
    if (codeViewPattern.test(pathname) && !pathname.includes("/edit") && !pathname.includes("/settings")) {
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Always allow access to these routes
        if (
          pathname === "/" ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/user") ||
          pathname.includes(".") ||
          pathname.startsWith("/terms-of-service") ||
          pathname.startsWith("/privacy-policy") ||
          pathname.startsWith("/sitemap") ||
          pathname.startsWith("/robots")
        ) {
          return true
        }

        // Allow auth pages regardless of authentication status
        if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
          return true
        }

        // Allow public code viewing (but not editing)
        const codeViewPattern = /^\/code\/[^/]+\/[^/]+/
        if (codeViewPattern.test(pathname) && !pathname.includes("/edit") && !pathname.includes("/settings")) {
          return true
        }

        // For all other routes, require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
} 