import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const title = searchParams.get("title");
    const filename = searchParams.get("filename");

    if (!username || !title || !filename) {
      return NextResponse.json(
        { error: "Missing required query parameters." },
        { status: 400 }
      );
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Find the code snippet by title and authorId
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
      return NextResponse.json({ error: "Code snippet not found." }, { status: 404 });
    }

    // Find the specific file
    const file = code.files.find((f) => f.name === filename);

    if (!file) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    return NextResponse.json({
      name: file.name,
      size: file.size,
      createdAt: code.createdAt,
      author: user.username,
      access: code.access,
      title: code.title,
      signedUrl: file.signedUrl,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
