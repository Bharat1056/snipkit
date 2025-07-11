import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { folderStructure: true },
  });
  return NextResponse.json({ folderStructure: user?.folderStructure ?? null });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  if (!body.folderStructure) {
    return NextResponse.json({ error: "Missing folderStructure" }, { status: 400 });
  }
  await db.user.update({
    where: { id: session.user.id },
    data: { folderStructure: body.folderStructure },
  });
  return NextResponse.json({ success: true });
} 