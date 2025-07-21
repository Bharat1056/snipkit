"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, LogIn, UserPlus, Code } from "lucide-react";

export default function NotAuthenticate() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Authentication Required
          </CardTitle>
          <CardDescription>
            You need to sign in to access this page and manage your code snippets
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button asChild size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Link href="/sign-in" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In to Your Account
            </Link>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-500">Don&apos;t have an account?</span>
            </div>
          </div>
          
          <Button asChild variant="outline" size="lg" className="w-full border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white">
            <Link href="/sign-up" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Create New Account
            </Link>
          </Button>
          
          <div className="pt-4 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Code className="w-3 h-3" />
              Join thousands of developers sharing code snippets
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
