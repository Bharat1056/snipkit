"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useAuth } from '@/hooks/auth.hook'

export function Navbar() {
  const pathname = usePathname()
  const { clearAuth, isAuthenticated } = useAuth()

  return (
    <nav className="border-b bg-transparent shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl text-white">Snipkit</span>
            </Link>
          </div>

          {/* Center: Nav buttons */}
          <div className="flex-grow flex justify-center">
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
                size="sm"
                asChild
                className={
                  pathname === '/dashboard'
                    ? 'bg-gray-700/50 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              {isAuthenticated && (
                <Button
                  variant={pathname === '/me' ? 'secondary' : 'ghost'}
                  size="sm"
                  asChild
                  className={
                    pathname === '/me'
                      ? 'bg-gray-700/50 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }
                >
                  <Link href="/me">Me</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Right: Auth buttons */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAuth}
                className="border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
