"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm transition-colors duration-200">P</span>
              </div>
              <span className="font-bold text-xl transition-colors duration-200">Pieces</span>
            </Link>
          </div>

          {/* Center: Nav buttons */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-8">
            <Link 
              href={!session ? "/" : "/dashboard"} 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            {session?.user && (
              <Link 
                href="/code" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/code" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Code
              </Link>
            )}
            <Link 
              href="#contact" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </div>

          <div className="ml-auto flex items-center">
            {status === "authenticated" && session?.user ? (
              <>
                <span className="text-sm font-medium text-muted-foreground">
                  {session.user.username}
                </span>
                <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 