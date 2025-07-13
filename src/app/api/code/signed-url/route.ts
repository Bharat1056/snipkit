import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { s3Service } from "@/s3/service";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const code = await db.code.findUnique({
      where: {
        authorId_slug: {
          authorId: session.user.id,
          slug,
        },
      },
      include: {
        files: true,
      },
    });

    if (!code) {
      return NextResponse.json({ error: "Code not found" }, { status: 404 });
    }

    const filesWithSignedUrls = await Promise.all(
      code.files.map(async (file) => {
        const signedUrl = file.key
          ? await s3Service.getSignedDownloadUrl({ key: file.key as string })
          : null;
        await db.file.update({
          where: { id: file.id },
          data: { signedUrl },
        });
        return {
          id: file.id,
          name: file.name,
          key: file.key,
          size: file.size,
          signedUrl,
        };
      })
    );

    return NextResponse.json({ files: filesWithSignedUrls }, { status: 200 });
  } catch (err) {
    console.error("Failed to get signed URLs:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}