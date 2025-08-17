'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/auth.hook';
import { User, LogOut } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { clearAuth, isAuthenticated, user } = useAuth();

  // Generate user initials for avatar fallback
  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

          {/* Right: Auth buttons */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-700/50"
                  >
                    <Avatar className="h-10 w-10 border-2 border-gray-600">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {getUserInitials(user?.name || user?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-gray-800 border-gray-700"
                  align="end"
                  forceMount
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.name && (
                        <p className="font-medium text-white">{user.name}</p>
                      )}
                      {user?.email && (
                        <p className="w-[200px] truncate text-sm text-gray-400">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/me"
                      className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700/50 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      My Snippets
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={clearAuth}
                    className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700/50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
