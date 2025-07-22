import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { s3Service } from "@/s3/service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface FileWithUploadData {
  uploadUrl: string;
  key: string;
  path: string;
  name: string;
  size: number;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, description, slug, access, downloadPath, files } = body;

    if (!title || !slug || !files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingCode = await db.code.findUnique({
      where: {
        authorId_slug: {
          authorId: userId,
          slug: slug,
        },
      },
    });

    if (existingCode) {
      return NextResponse.json({ error: "File already exists with this slug name" }, { status: 409 });
    }

        // Step 1: Generate S3 upload URLs outside the transaction
        const filesWithUrls: FileWithUploadData[] = [];
        for (const file of files) {
          const { name, path, contentType, size } = file;
          const uploadResponse = await s3Service.uploadFile({
            username: user.username,
            filename: name,
            slug: slug,
            contentType: contentType,
            fileSize: size,
            path,
          });
    
          filesWithUrls.push({
            uploadUrl: uploadResponse.uploadUrl,
            key: uploadResponse.key,
            path,
            name,
            size,
          });
        }

        await db.code.create({
          data: {
            title,
            description,
            slug,
            access,
            downloadPath,
            authorId: user.id,
            files: {
              createMany: {
                data: filesWithUrls.map(f => ({
                  name: f.name,
                  size: f.size,
                  key: f.key,
                  path: f.path,
                })),
              },
            },
          },
        });  

    return NextResponse.json({ filesWithUrls: filesWithUrls }, { status: 201 });

  } catch (error) {
    console.error("Error creating code project:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const {id} = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Id is required" }, { status: 400 });
    }

    const code = await db.code.findFirst({
      where: {
        id: id,
      },
      include: {
        files: true,
      },
    });

    if (!code) {
      return NextResponse.json({ error: "Code not found" }, { status: 404 });
    }

    if (code.files && code.files.length > 0) {
      code.files.map((file) => {
        s3Service.deleteFile({
          key: file.key as string,
        })
      });
    }

    await db.code.delete({
      where: {
        id: code.id,
      },
    });

    return NextResponse.json({ message: "Code project deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting code:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
} 