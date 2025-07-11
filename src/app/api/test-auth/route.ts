import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      success: true,
      authenticated: !!session?.user?.id,
      session: session ? {
        userId: session.user.id,
        email: session.user.email,
        username: session.user.username,
        fullName: session.user.fullName,
      } : null,
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json({
      success: false,
      error: "Authentication test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
} 