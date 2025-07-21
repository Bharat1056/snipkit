import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { codeId, access } = await req.json();

    if (!codeId || !access) {
      return new NextResponse("Missing codeId or access", { status: 400 });
    }

    if (!["public", "private"].includes(access)) {
      return new NextResponse("Invalid access value", { status: 400 });
    }

    const code = await db.code.findUnique({
      where: { id: codeId },
    });

    if (!code) {
      return new NextResponse("Code not found", { status: 404 });
    }

    if (code.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedCode = await db.code.update({
      where: { id: codeId },
      data: { access },
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error("[CODE_ACCESS_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 