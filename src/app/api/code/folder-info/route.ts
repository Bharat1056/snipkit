import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const title = searchParams.get("title");

    if (!username || !title) {
      return NextResponse.json(
        { error: "Missing required query parameters." },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Find code/project by title and authorId
    const code = await db.code.findFirst({
      where: {
        authorId: user.id,
        title,
      },
      include: {
        files: true,
      },
    });

    if (!code) {
      return NextResponse.json({ error: "Code/project not found." }, { status: 404 });
    }

    // Shape the response
    const response = {
      title: code.title,
      description: code.description,
      downloadPath: code.downloadPath,
      access: code.access,
      files: code.files.map((file) => ({
        name: file.name,
        key: file.key,
        size: file.size,
        signedUrl: file.signedUrl,
        createdAt: file.createdAt,
      })),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
